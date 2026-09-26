# Luo Skills 技能目录的维护与发布

这里是整个仓库的技能目录站模板，使用 GitHub Pages 发布到 <https://luoqaq.github.io/luo-skills/>。首页介绍技能集合；目录按任务分类，各 Skill 有独立介绍、可选示例和安装区。当前只有 `task-ui-prototype`，不显示尚不存在的技能。部署成功不代表搜索引擎已经收录。

安装方式优先让 Agent 执行：首屏直接提供仓库安装请求，每个目录条目及技能详情提供只安装该 Skill 的请求，均可直接复制。终端命令折叠为备选。安装请求明确当前 Agent、个人级范围、已有 memory/ 保留和结果报告；不因新增 Skill 改为默认安装全部。维护时保留这些直接安装入口，不用纯说明或详情页跳转替代。

## 本地预览

在仓库根目录执行，无需安装依赖（Python 3.9+）：

```sh
python3 scripts/build-site.py --out /private/tmp/luo-skills-site
python3 -m http.server 8770 --directory /private/tmp/luo-skills-site --bind 127.0.0.1
```

打开 <http://127.0.0.1:8770/>。输出目录必须不存在或为空，脚本不会删除或覆盖已有文件。重复构建请换一个新目录。

默认构建保留介绍页的 `noindex,follow`，不生成 canonical、正式网址或 sitemap。脚本结束会检查 HTML、CSS、JS 中可静态识别的本地资源引用；实际布局、交互和外链仍需浏览器验证。

## 生成待发布文件

`.github/workflows/pages.yml` 在推送到 `main` 时自动构建并部署，也可在 GitHub Actions 手动运行。构建沿用下述白名单，仅上传生成目录；正式地址由 Pages 配置提供。构建失败不会进入部署步骤。发布状态以 Actions 的部署结果及公开网址检查为准。

先确认部署平台和真实正式网址，再把地址传入 `--base-url`；支持 GitHub Pages 一类带子路径的网址。下面的地址变量必须替换为已确认的正式地址：

```sh
python3 scripts/build-site.py --out /private/tmp/luo-skills-release --base-url "$skills_public_url"
```

这一步只在本地构建，不会发布。正式构建会：

- 去掉介绍页的 `noindex`，填入绝对地址的 canonical、`og:url`；分享标题与摘要描述整个技能库，不用某一项技能的截图代表全站。
- 加入描述当前站点的 `WebSite` JSON-LD；不虚构评分、下载量或搜索表现。
- 生成只含介绍页的 `sitemap.xml`。
- 为每个演示 HTML 添加 `noindex,follow`，让演示页不参与搜索索引；不通过 robots.txt 阻止爬虫读取该指令。

`noindex` 是搜索索引指令，不是访问控制。演示内容应视为可公开内容，不能放入账号、密钥、个人记忆或真实账户数据。

实际部署和域名配置遵守用户授权；About / Topics 候选在此轮尚未写入线上。发布之后再验证页面、分享元信息、演示交互及 sitemap；提交 sitemap 或请求收录也不能保证收录和排名。

## 发布范围

构建脚本只复制这些内容：

- `site/index.html`、`styles.css`、`main.js`；首页的目录、计数和各技能介绍由 `site/skills.json` 在构建时生成，浏览器禁用 JavaScript 仍可阅读。
- 移动端三方案比较截图，作为 `assets/mobile-comparison.jpg`（源文件虽名为 `.png`，实际内容是 JPEG；构建只纠正输出扩展名）。
- `site/assets/pc-preview.jpg` 是现有 PC 研究刊物样板的真实浏览器截图，用于首页 PC 预览。
- `mobile-styles` 和 `stock-analysis` 根目录的 HTML / JS / CSS，以及各自 `assets/` 下的运行素材白名单。

不会复制整个仓库，不包含演示目录的 Markdown、JSON、截图目录、个人 `memory/` 或 `stock-analysis/kimi/`。只显式加入上述两张截图；技能清单与 HTML 片段是构建输入，不单独发布。

## 增加或更新 Skill

新增技能时不改首页骨架：

1. 先创建真实的 `<skill-id>/SKILL.md`；`id` 使用与安装名称一致的目录名。
2. 在 `site/skills.json` 末尾追加一项，填写 `id`、`name`、`subtitle`、`category`、`description`、`prompt`。构建会生成目录条目、技能标题、独立安装请求、备选终端命令和调用示例，并自动更新数量。分类写该技能真实用途。
3. 如需专属展示，新增 `site/skills/<skill-id>.html`，并用 `detail` 指向它。该字段可省略；片段可展示文档、命令或其他成果，不要求有 PC / 移动端案例。片段里的 HTML id 用技能名作前缀，避免多个 Skill 冲突。
4. 只有新增图片或演示资源时，才扩展 `scripts/build-site.py` 的发布白名单。随后重新构建并验证目录锚点、每项安装命令及新增交互；同步根 README 的技能列表。

`site/index.html` 只维护集合定位、目录容器与通用使用说明，不嵌入单一 Skill 的能力文案。现有 PC 三方向切换与移动端样板都在 `site/skills/task-ui-prototype.html` 内；复制反馈按各自安装区隔离。Skill 名称、description 和公开页面的能力边界保持一致。

## 候选发现入口

以下是待确认后可写入 GitHub 的候选信息，未代表线上已修改：

- **About**：`A growing collection of reusable Agent Skills. Explore use cases, examples, and install each skill independently. / 按任务选择、独立安装的 Agent 技能库`
- **Topics**：`agent-skills`、`ui-prototyping`、`interaction-design`、`design-systems`、`codex`、`claude-code`

About 和 Topics 应随仓库实际能力变化，不堆放无关热门词。除了 GitHub，可提供准确的 skills CLI 安装命令，让真实使用者自行安装；[skills.sh FAQ](https://skills.sh/docs/faq) 说明其目录依赖安装时的匿名统计。存在安装命令或发生一次安装，都不等于保证收录与排名；不要刷安装量。
