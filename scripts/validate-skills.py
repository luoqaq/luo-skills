#!/usr/bin/env python3
"""Check packaged Skills and their repository entries using only the standard library.

This is not a complete YAML or Markdown parser. Frontmatter supports flat,
single-line string fields; Markdown checks inline links, images and reference
definitions, excluding fenced/indented code, inline code and HTML comments.
"""

import argparse
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
FIELD = re.compile(r"([A-Za-z][A-Za-z0-9_-]*):[ \t]*(.*)")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
INLINE_CODE = re.compile(r"(`+)(?!`)([\s\S]*?)(?<!`)\1(?!`)")
LINK = re.compile(
    r"(?<!\\)!?\[(?:\\.|[^\]\\\n])*\]\(\s*"
    r"(?P<target><[^>\n]*>|(?:\\.|[^\\\s()]|\([^()\n]*\))*)"
    r"(?:\s+(?:\"[^\"\n]*\"|'[^'\n]*'|\([^()\n]*\)))?\s*\)"
)
REFERENCE = re.compile(
    r"^ {0,3}\[[^\]\n]+\]:\s*(?P<target><[^>\n]+>|\S+)", re.M
)


def scalar(value, location):
    """Parse only the single-line string notation used by this repository."""
    if not value:
        return ""
    if value.startswith('"'):
        try:
            result = json.loads(value)
        except ValueError as error:
            raise ValueError(f"{location}: 双引号字段仅支持 JSON 字符串转义") from error
        if not isinstance(result, str):
            raise ValueError(f"{location}: 字段必须是字符串")
        return result
    if value.startswith("'"):
        if not re.fullmatch(r"'(?:[^']|'')*'", value):
            raise ValueError(f"{location}: 单引号字段格式不支持")
        return value[1:-1].replace("''", "'")
    if (value[0] in "|>[{&*!%@`" or ": " in value
            or re.search(r"\s#", value) or value.startswith("#")
            or value.lower() in {"null", "true", "false", "~"}
            or re.fullmatch(r"[-+]?\d+(?:\.\d+)?", value)):
        raise ValueError(f"{location}: 仅支持单行字符串；请将复杂值加引号或简化格式")
    return value


def frontmatter(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0] != "---":
        raise ValueError(f"{path}: 首行必须是 frontmatter 分隔符 ---")
    try:
        end = lines.index("---", 1)
    except ValueError as error:
        raise ValueError(f"{path}: 缺少 frontmatter 结束分隔符 ---") from error
    fields = {}
    for number, line in enumerate(lines[1:end], 2):
        if not line.strip() or line.startswith("#"):
            continue
        location = f"{path}:{number}"
        match = FIELD.fullmatch(line)
        if not match:
            raise ValueError(f"{location}: 仅支持平铺的单行 key: value 字段")
        key, value = match.groups()
        if key in fields:
            raise ValueError(f"{location}: 字段 {key} 重复")
        fields[key] = scalar(value.strip(), location)
    for key in ("name", "description"):
        if not fields.get(key, "").strip():
            raise ValueError(f"{path}: 必需字段 {key} 不能为空")
    return fields


def mask_code(source):
    """Keep line positions while hiding examples that do not render as links."""
    def blank(match):
        return re.sub(r"[^\n]", " ", match.group())

    source = re.sub(r"<!--[\s\S]*?-->", blank, source)
    visible = []
    fence = None
    for line in source.splitlines(keepends=True):
        match = FENCE.match(line)
        if fence:
            if (match and match[1][0] == fence[0] and len(match[1]) >= len(fence)
                    and not match[2].strip()):
                fence = None
            visible.append("\n" if line.endswith("\n") else "")
        elif match:
            fence = match[1]
            visible.append("\n" if line.endswith("\n") else "")
        elif line.startswith(("    ", "\t")):
            visible.append("\n" if line.endswith("\n") else "")
        else:
            visible.append(line)
    return INLINE_CODE.sub(blank, "".join(visible))


def markdown_links(path):
    source = mask_code(path.read_text(encoding="utf-8"))
    for pattern in (LINK, REFERENCE):
        for match in pattern.finditer(source):
            value = match["target"]
            if value.startswith("<") and value.endswith(">"):
                value = value[1:-1]
            value = re.sub(r"\\([!\"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])", r"\1", value)
            yield source.count("\n", 0, match.start()) + 1, value


def local_target(source, value, boundary, location):
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return None
    relative = Path(unquote(parsed.path))
    if relative.is_absolute():
        raise ValueError(f"{location}: 本地链接须为包内相对路径 → {value}")
    target = (source.parent / relative).resolve()
    if not target.is_relative_to(boundary):
        raise ValueError(f"{location}: 本地链接越过目录边界 {boundary} → {value}")
    if not target.exists():
        raise ValueError(f"{location}: 本地链接目标不存在 → {value}")
    return target


def validate_skill(directory):
    entry = directory / "SKILL.md"
    if not entry.is_file():
        raise ValueError(f"{directory}: 缺少 SKILL.md")
    fields = frontmatter(entry)
    if fields["name"] != directory.name:
        raise ValueError(f"{entry}: name={fields['name']!r} 与目录名 {directory.name!r} 不一致")
    documents = links = 0
    for path in sorted(directory.rglob("*.md")):
        if path.relative_to(directory).parts[0] == "memory":
            continue  # Personal runtime notes are not part of the distributed Skill.
        if not path.resolve().is_relative_to(directory):
            raise ValueError(f"{path}: Markdown 文件指向 Skill 目录外")
        documents += 1
        for number, value in markdown_links(path):
            if local_target(path, value, directory, f"{path}:{number}") is not None:
                links += 1
    return documents, links


def validate_readmes(skills):
    expected = {directory / "SKILL.md" for directory in skills}
    if not (ROOT / "README.md").is_file():
        raise ValueError("仓库缺少 README.md")
    for readme in sorted(ROOT.glob("README*.md")):
        entries = set()
        for number, value in markdown_links(readme):
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or Path(unquote(parsed.path)).name != "SKILL.md":
                continue
            target = local_target(readme, value, ROOT, f"{readme}:{number}")
            if target not in expected:
                raise ValueError(f"{readme}:{number}: Skill 入口不属于 skills/ 下的实际 Skill → {value}")
            entries.add(target)
        missing = sorted(path.parent.name for path in expected - entries)
        if missing:
            raise ValueError(f"{readme}: 缺少 Skill 入口：{', '.join(missing)}")


def validate_catalog(skills):
    catalog = ROOT / "site/skills.json"
    records = json.loads(catalog.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError(f"{catalog}: 目录必须是 JSON 数组")
    identifiers = set()
    for record in records:
        if not isinstance(record, dict) or not isinstance(record.get("id"), str) or not record["id"].strip():
            raise ValueError(f"{catalog}: 每项必须有非空字符串 id")
        identifier = record["id"]
        if identifier in identifiers:
            raise ValueError(f"{catalog}: id 重复：{identifier}")
        identifiers.add(identifier)
        if "detail" in record:
            detail = record["detail"]
            if not isinstance(detail, str) or not detail.strip():
                raise ValueError(f"{catalog}: {identifier} 的 detail 必须是非空相对路径，或省略此字段")
            target = local_target(catalog, detail, catalog.parent, f"{catalog} ({identifier})")
            if target is None or not target.is_file():
                raise ValueError(f"{catalog}: {identifier} 的 detail 必须指向 site/ 内的文件")
    actual = {directory.name for directory in skills}
    if identifiers != actual:
        missing = ", ".join(sorted(actual - identifiers)) or "无"
        extra = ", ".join(sorted(identifiers - actual)) or "无"
        raise ValueError(f"{catalog}: 目录 id 与实际 Skill 不一致；缺少：{missing}；多余：{extra}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skill", type=Path, help="只校验一个独立 Skill 目录，不读取仓库 README 或 site")
    args = parser.parse_args()
    try:
        if args.skill:
            skills = [args.skill.expanduser().resolve()]
        else:
            directory = ROOT / "skills"
            skills = sorted(path.resolve() for path in directory.iterdir() if path.is_dir())
            if not skills:
                raise ValueError(f"{directory}: 未找到 Skill 目录")
        documents = links = 0
        for directory in skills:
            counts = validate_skill(directory)
            documents += counts[0]
            links += counts[1]
        if not args.skill:
            validate_readmes(skills)
            validate_catalog(skills)
        scope = "独立 Skill" if args.skill else "Skill、README 与网站目录"
        print(f"校验通过：{scope}；{len(skills)} 个 Skill，{documents} 份 Markdown，{links} 项本地链接。")
    except (OSError, ValueError) as error:
        parser.exit(1, f"校验失败：{error}\n")


if __name__ == "__main__":
    main()
