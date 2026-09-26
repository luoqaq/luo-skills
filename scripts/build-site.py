#!/usr/bin/env python3
"""Build the public introduction and selected demos with Python's standard library."""

import argparse
import html
import json
import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
SKILLS = ROOT / "skills"
EXAMPLES = SKILLS / "task-ui-prototype/assets/examples"
ASSET_TYPES = {".html", ".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".woff2"}
NOINDEX = '<meta name="robots" content="noindex,follow">'
ROBOTS_META = re.compile(r'<meta\b[^>]*\bname=["\']robots["\'][^>]*>', re.I)
CSS_URL = re.compile(r'url\(\s*["\']?([^\s)"\']+)["\']?\s*\)', re.I)
JS_FILE = re.compile(r'["\']([\w./-]+\.(?:html|css|js|svg|png|jpg|jpeg|webp)(?:[?#][^"\']*)?)["\']')


class PageLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.description = ""
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for name in ("href", "src", "poster"):
            if attrs.get(name):
                self.links.append(attrs[name])
        self.links += CSS_URL.findall(attrs.get("style", ""))
        if tag == "style":
            self.in_style = True
        if tag == "meta" and attrs.get("name") == "description":
            self.description = attrs.get("content", "")

    def handle_endtag(self, tag):
        if tag == "style":
            self.in_style = False

    def handle_data(self, data):
        if self.in_style:
            self.links += CSS_URL.findall(data)


def public_url(value):
    parsed = urlsplit(value)
    if (parsed.scheme != "https" or not parsed.hostname or parsed.username
            or parsed.password or parsed.query or parsed.fragment):
        raise argparse.ArgumentTypeError("--base-url 必须是没有凭据、查询参数或片段的 HTTPS 站点网址。")
    if any(part in {".", ".."} for part in unquote(parsed.path).split("/")):
        raise argparse.ArgumentTypeError("--base-url 不能包含 . 或 .. 路径段。")
    return value.rstrip("/") + "/"


def source_files():
    files = [(SITE / name, Path(name)) for name in ("index.html", "styles.css", "main.js")]
    files.append((EXAMPLES / "mobile-styles/screenshots/comparison.png", Path("assets/mobile-comparison.jpg")))
    files.append((SITE / "assets/pc-preview.jpg", Path("assets/pc-preview.jpg")))
    for name in ("mobile-styles", "stock-analysis"):
        source = EXAMPLES / name
        selected = [p for p in source.iterdir() if p.is_file() and p.suffix in {".html", ".js", ".css"}]
        assets = source / "assets"
        if assets.is_dir():
            selected += [p for p in assets.rglob("*") if p.is_file() and p.suffix.lower() in ASSET_TYPES]
        for path in sorted(selected):
            if path.is_symlink() or not path.resolve().is_relative_to(source.resolve()):
                raise ValueError(f"不复制指向目录外的素材：{path.relative_to(ROOT)}")
            files.append((path, Path("demos") / name / path.relative_to(source)))
    for source, _ in files:
        if not source.is_file():
            raise ValueError(f"缺少输入文件：{source.relative_to(ROOT)}")
    return files


def load_skills():
    skills = json.loads((SITE / "skills.json").read_text(encoding="utf-8"))
    seen = set()
    for skill in skills:
        key = skill["id"]
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", key) or key in seen:
            raise ValueError(f"Skill 标识无效或重复：{key}")
        seen.add(key)
        if not (SKILLS / key / "SKILL.md").is_file():
            raise ValueError(f"技能目录中不存在 skills/{key}/SKILL.md")
        for field in ("name", "subtitle", "category", "description", "prompt"):
            if not isinstance(skill[field], str) or not skill[field].strip():
                raise ValueError(f"{key} 缺少有效的 {field}")
        if skill.get("detail"):
            detail = (SITE / skill["detail"]).resolve()
            if not detail.is_relative_to(SITE) or not detail.is_file():
                raise ValueError(f"{key} 的详情片段不存在或不在 site 目录")
    return skills


def render_skills(source, skills):
    directory, details = [], []
    for number, skill in enumerate(skills, 1):
        key = skill["id"]
        name, subtitle, category, description, prompt = (
            html.escape(skill[field]) for field in ("name", "subtitle", "category", "description", "prompt")
        )
        install_request = (f"请从 https://github.com/luoqaq/luo-skills 安装 {key}，"
                           "只安装这一项到当前 Agent 的个人技能目录。按 README 执行；"
                           "已有版本先保留我的 memory/，完成后报告安装路径与结果。")
        directory.append(f'''<article class="catalog-row">
  <span class="catalog-index">{number:02}</span>
  <div class="catalog-name"><span class="catalog-category">{category}</span><h3><a href="#skill-{key}">{name}</a></h3><p>{subtitle}</p></div>
  <p class="catalog-description">{description}</p>
  <div class="catalog-actions"><a class="text-link" href="#skill-{key}">查看技能与示例 ↓</a></div>
  <div class="catalog-install" data-copy-group>
    <p class="catalog-install-label">复制给 Agent，安装这一项</p>
    <div class="catalog-command"><code class="agent-request-text" id="agent-install-catalog-{key}">{install_request}</code><button type="button" data-copy="agent-install-catalog-{key}" aria-label="复制 {name} 安装请求" hidden>复制安装请求</button></div>
    <p data-copy-status class="copy-status" role="status" aria-live="polite"></p>
    <details class="terminal-alternative"><summary>终端安装（Codex）</summary><div class="catalog-command"><code id="command-catalog-{key}">npx skills add luoqaq/luo-skills --skill {key} --agent codex -g</code><button type="button" data-copy="command-catalog-{key}" hidden>复制命令</button></div></details>
  </div>
</article>''')
        detail = (SITE / skill["detail"]).read_text(encoding="utf-8") if skill.get("detail") else ""
        details.append(f'''<article id="skill-{key}" class="skill-detail section-shell" aria-labelledby="title-{key}">
  <header class="skill-header">
    <div class="section-heading"><p class="eyebrow">SKILL {number:02} / {category}</p><a class="back-to-catalog" href="#skills">返回技能目录 ↑</a></div>
    <div class="skill-heading"><div><h2 id="title-{key}">{name}<span class="chinese-title">{subtitle}</span></h2><p class="skill-name"><code>{key}</code></p></div>
    <div class="skill-summary"><p>{description}</p><a class="text-link" href="https://github.com/luoqaq/luo-skills/blob/main/skills/{key}/SKILL.md">完整技能说明 ↗</a></div></div>
  </header>
  {detail}
  <section class="skill-install" id="install-{key}" aria-labelledby="install-title-{key}" data-copy-group>
    <div><p class="eyebrow">INSTALL / 安装这一项</p><h3 id="install-title-{key}">使用 {name}</h3><p class="install-description">把安装请求发给你的 Agent，只安装 <code>{key}</code>。安装完成后，再发送下面的调用示例。</p></div>
    <div class="install-content">
      <div class="code-header"><span>推荐 · 让 Agent 安装</span><button type="button" data-copy="agent-install-{key}" hidden>复制安装请求</button></div>
      <pre class="agent-request"><code id="agent-install-{key}">{install_request}</code></pre>
      <details class="terminal-alternative"><summary>自己用终端安装（Codex）</summary><div class="code-header"><span>终端命令 · 个人级</span><button type="button" data-copy="command-{key}" hidden>复制命令</button></div><pre><code id="command-{key}">npx skills add luoqaq/luo-skills --skill {key} --agent codex -g</code></pre></details>
      <div class="code-header"><span>调用示例</span><button type="button" data-copy="prompt-{key}" hidden>复制示例</button></div>
      <pre class="prompt"><code id="prompt-{key}">{prompt}</code></pre>
      <p data-copy-status class="copy-status" role="status" aria-live="polite"></p>
    </div>
  </section>
</article>''')
    for token, value in (("SKILL_COUNT", str(len(skills))), ("SKILL_DIRECTORY", "\n".join(directory)), ("SKILL_DETAILS", "\n".join(details))):
        marker = f"<!-- {token} -->"
        if source.count(marker) != 1:
            raise ValueError(f"site/index.html 必须包含一个 {token} 占位。")
        source = source.replace(marker, value)
    return source


def introduction(source, base_url):
    source = render_skills(source, load_skills())
    if source.count("<!-- PUBLIC_METADATA -->") != 1:
        raise ValueError("site/index.html 必须包含一个 PUBLIC_METADATA 注释占位。")
    if not ROBOTS_META.search(source):
        raise ValueError("site/index.html 必须包含预览用的 robots noindex 元信息。")
    source = ROBOTS_META.sub("" if base_url else NOINDEX, source)
    metadata = ""
    if base_url:
        parser = PageLinks()
        parser.feed(source)
        structured = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Luo Skills",
            "url": base_url,
            "description": parser.description,
            "inLanguage": "zh-CN",
        }
        structured_json = json.dumps(structured, ensure_ascii=False).replace("<", "\\u003c")
        escaped_url = html.escape(base_url, quote=True)
        metadata = "\n".join([
            f'<link rel="canonical" href="{escaped_url}">',
            f'<meta property="og:url" content="{escaped_url}">',
            f'<script type="application/ld+json">{structured_json}</script>',
        ])
    return source.replace("<!-- PUBLIC_METADATA -->", metadata)


def demo_page(source):
    source = ROBOTS_META.sub("", source)
    if not re.search(r"<head\b[^>]*>", source, re.I):
        raise ValueError("演示 HTML 缺少 head，无法添加 noindex。")
    return re.sub(r"(<head\b[^>]*>)", lambda match: match[0] + "\n" + NOINDEX, source, count=1, flags=re.I)


def check_links(output):
    checked = 0
    missing = []
    for path in sorted(output.rglob("*")):
        if path.suffix not in {".html", ".css", ".js"}:
            continue
        source = path.read_text(encoding="utf-8")
        links = CSS_URL.findall(source) if path.suffix == ".css" else JS_FILE.findall(source)
        if path.suffix == ".html":
            parser = PageLinks()
            parser.feed(source)
            links += parser.links
        for link in set(links):
            parsed = urlsplit(link)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            local_path = unquote(parsed.path)
            target = ((output / local_path.lstrip("/")) if local_path.startswith("/")
                      else (path.parent / local_path)).resolve()
            if target.is_dir():
                target = target / "index.html"
            checked += 1
            if not target.is_relative_to(output) or not target.is_file():
                missing.append(f"{path.relative_to(output)} → {link}")
    if missing:
        raise ValueError("本地资源检查失败：\n" + "\n".join(missing))
    return checked


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path, help="新目录或已有空目录；不会删除或覆盖已有文件")
    parser.add_argument("--base-url", type=public_url, help="仅发布构建填写真实 HTTPS 正式网址，支持子路径")
    args = parser.parse_args()
    output = args.out.expanduser().resolve()
    try:
        if output == ROOT or output in ROOT.parents:
            raise ValueError("输出不能是仓库根目录或其父目录。")
        if output.exists() and (not output.is_dir() or any(output.iterdir())):
            raise ValueError("输出路径必须不存在或是空目录；不会删除或覆盖已有内容。")
        files = source_files()
        intro = introduction((SITE / "index.html").read_text(encoding="utf-8"), args.base_url)
        output.mkdir(parents=True, exist_ok=True)
        for source, destination in files:
            target = output / destination
            target.parent.mkdir(parents=True, exist_ok=True)
            if destination == Path("index.html"):
                target.write_text(intro, encoding="utf-8")
            elif destination.suffix == ".html":
                target.write_text(demo_page(source.read_text(encoding="utf-8")), encoding="utf-8")
            else:
                shutil.copyfile(source, target)
        if args.base_url:
            sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
                       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                       f'  <url><loc>{html.escape(args.base_url)}</loc></url>\n</urlset>\n')
            (output / "sitemap.xml").write_text(sitemap, encoding="utf-8")
        checked = check_links(output)
        mode = "正式网址构建（尚未发布）" if args.base_url else "本地预览构建（noindex）"
        print(f"{mode}：{output}\n复制 {len(files)} 个文件；{checked} 项本地资源引用检查通过。")
    except (OSError, ValueError) as error:
        parser.exit(1, f"构建失败：{error}\n")


if __name__ == "__main__":
    main()
