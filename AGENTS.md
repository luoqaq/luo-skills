# 仓库维护约定

## 内容归属

- 可安装的 Skill 放在 `skills/<name>/`；目录名与 `SKILL.md` frontmatter 的 `name` 一致。
- 每个 Skill 必须能独立复制和使用。运行所需的参考与素材留在自己的目录内，使用相对链接，不依赖仓库根目录或其他 Skill 的文件。
- `SKILL.md` 保留触发范围、主流程与按需读取入口；复杂参考放 `references/`，可复用样板放 `assets/`。简单 Skill 无需创建空目录。
- `less-talk` 本身也要精简，只保留影响对话输出的必要规则，不扩成写作教程。
- 根 README 面向使用者，提供技能目录与快速入口；详细安装和更新说明在 `docs/installation.md`。网站维护方式见 `site/README.md`。
- `site/skills.json` 管展示名称、简介、分类与调用示例；`SKILL.md` 管执行规则。两者能力边界一致，不要求文案相同。

## 变更同步

- 新增、改名或移动 Skill 时，同步中英文 README、站点目录、安装路径、构建脚本及相对引用。
- 修改行为时同步受影响的使用说明和调用示例；不要把个人反馈自动写成所有人的通用规则。
- 个人 `memory/` 留在实际加载的 Skill 目录，更新时保留，提交和公开分发时排除。`.gitignore` 不能保护普通复制或重装操作。
- `docs/research/`、根目录 `research/` 和 `trials/` 是本地研究或试跑内容，不加入正式文档与网站发布包。

## 验证

在仓库根目录运行：

```sh
python3 scripts/validate-skills.py
python3 scripts/build-site.py --out /private/tmp/luo-skills-check
```

构建输出须为不存在或为空的目录，重复验证换一个目录。移动文件后，另将每个 Skill 独立复制到临时目录，运行 `python3 scripts/validate-skills.py --skill <复制后的目录>` 检查随包引用。

静态检查只证明结构和引用有效。修改 Skill 行为时用真实请求验证结果；修改页面交互时做浏览器验收，记录未覆盖项。PR 执行结构检查和网站构建，主分支发布前重复校验；本地通过不代表 CI 或线上发布完成。
