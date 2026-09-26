# Luo Skills

可复用的 Agent 技能。每个包含 `SKILL.md` 的目录是一项完整 Skill，连同参考和素材一起安装，可独立使用。

## 当前技能

| Skill / 安装名称 | 用途 |
|---|---|
| [task-ui-prototype](task-ui-prototype/SKILL.md) | PC / 移动端任务型 UI 原型：比较视觉方向、扩展可点击页面、验收，并按场景积累个人设计偏好 |

目前只有 **1 个 Skill**。下文多选方式适用于仓库后续增加技能；示例中的占位名称必须替换为实际存在的名称。移动端规范、视觉预设和样板都是 `task-ui-prototype` 的组成部分，不是单独安装的 Skill。

## 方式一：命令行安装

使用第三方 [skills CLI](https://github.com/vercel-labs/skills#readme)，需要符合[安装器版本要求](https://github.com/vercel-labs/skills/blob/main/package.json)的 Node.js、npm 和 Git；首次运行 `npx` 可能下载该工具。以下以 **Codex 个人级安装**为例，已安装过同名技能时先看[更新与个人记忆](#更新与个人记忆)。

```sh
# 查看仓库有哪些技能，不安装技能
npx skills add luoqaq/luo-skills --list

# 只安装一个
npx skills add luoqaq/luo-skills --skill task-ui-prototype --agent codex -g

# 交互选择要安装的技能；只有一个可选项时可能直接选中
npx skills add luoqaq/luo-skills --agent codex -g
```

一次安装多个：先从列表获取真实名称，再替换下面的占位符（当前仓库尚无第二项）。

```text
npx skills add luoqaq/luo-skills --skill <名称一> <名称二> --agent codex -g
```

如果明确需要安装仓库里的全部技能，仍限定目标 Agent：

```sh
npx skills add luoqaq/luo-skills --skill '*' --agent codex -g
```

- `-g` 表示个人级，跨项目使用；只给某个项目使用时，先进入目标项目根目录，再去掉 `-g`。
- `--agent codex` 可替换为 `claude-code`、`cursor` 等[安装器支持的 Agent 名称](https://github.com/vercel-labs/skills#supported-agents)；也可明确列出多个目标 Agent。安装器支持不等于本仓库已在所有 Agent 上验收。
- 不要把 `--all` 当成“只安装本仓库全部技能”：该参数还会选择所有 Agent 并跳过确认。按需选择 Skill 和目标 Agent 即可。

## 方式二：让 Agent 用自然语言安装

把下面的话发给具备联网、终端和文件权限的 Agent。安装范围默认写清楚；如果目标是项目级，把“个人技能目录”改成“当前项目的技能目录”。这些话要求 Agent 执行安装，单独粘贴 GitHub 链接不代表已安装。

**单个 Skill：**

```text
请从 https://github.com/luoqaq/luo-skills 安装 task-ui-prototype，
放到当前 Agent 的个人技能目录，只安装这一项。请按仓库 README 执行，
已存在时先核对版本并保留我的 memory/；完成后报告实际安装路径和结果。
```

**多个指定 Skill（替换为实际名称）：**

```text
请从 https://github.com/luoqaq/luo-skills 安装这些 Skill：<名称一>、<名称二>。
只安装名单内的项目，放到当前 Agent 的个人技能目录。
先核对名称是否存在；已安装项保留个人 memory/，逐项报告安装结果。
```

**先了解，再选择性安装：**

```text
请查看 https://github.com/luoqaq/luo-skills，列出可安装的 Skill 名称、用途和已安装状态。
先不要安装，等我选择后，只把选中的项目装到当前 Agent 的个人技能目录。
```

Codex 也可以明确使用内置安装器：

```text
$skill-installer 请安装 https://github.com/luoqaq/luo-skills/tree/main/task-ui-prototype
```

Codex 内置安装器可从其他仓库安装 Skill，见 [OpenAI 官方说明](https://learn.chatgpt.com/docs/build-skills#install-curated-skills-for-local-use)。不同安装器的路径和更新行为可能不同，以实际输出为准；不要假定批量失败会自动回滚已成功的项。

## 方式三：手动引入

下载仓库 ZIP 并解压，或克隆仓库：

```sh
git clone https://github.com/luoqaq/luo-skills.git
cd luo-skills
```

从仓库选中需要的 Skill，复制**整个目录**到 Agent 的技能目录。保留 `.gitignore`、参考文档和 `assets/`，不要只复制 `SKILL.md`，也不要多套一层 `luo-skills/`。复制别人的本地副本时排除 `memory/`；Git 忽略不会阻止普通文件复制。

以 Codex 为例，手动放置到 `~/.agents/skills/task-ui-prototype/` 可供个人跨项目使用；放到目标项目的 `.agents/skills/task-ui-prototype/` 则供该项目使用。目录依据 [Codex 官方说明](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)；其他 Agent 按各自文档设置，不把 Codex 路径当作统一规范。

对于 Git 克隆的仓库，也可在仓库根目录执行以下命令（macOS / Linux / Git Bash）。它导出已提交的完整 Skill，不携带本地未跟踪的个人记忆，已有目标会跳过：

```sh
skill_dest="$HOME/.agents/skills"
mkdir -p "$skill_dest"
for skill_name in task-ui-prototype; do
  if [ -e "$skill_dest/$skill_name" ] || [ -L "$skill_dest/$skill_name" ]; then
    printf '跳过已存在的 Skill：%s；更新请先保留 memory/。\n' "$skill_name"
  else
    git archive HEAD "$skill_name" | tar -x -C "$skill_dest"
  fi
done
```

只引入一个就保留一个目录名；引入多个时在 `for skill_name in` 后列出选中的实际目录名，以空格分隔。项目级安装则把 `skill_dest` 换成**目标项目**的 `.agents/skills` 绝对路径。ZIP 解压目录没有 Git 元数据，使用普通整目录复制即可。

## 安装后如何使用

先确认实际安装路径内存在 `SKILL.md` 及参考、素材。Codex 会自动发现技能变化；若下一轮仍未出现，再重启，见 [官方加载说明](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。不要在多个技能目录里重复安装同名副本。

在任务中明确指定 Skill，最容易确认是否被采用：

```text
使用 task-ui-prototype，为服装门店管理员设计手机网页原型。
只做首页、商品列表、商品详情。按全新项目设计，不参考现有 UI。
暂无风格偏好，先给 2–3 个可运行方向稿。
```

Codex 可在开头写 `$task-ui-prototype`。其他 Agent 的显式调用语法以其文档为准。说明用户、主要动作、页面清单、目标端/载体和已知风格倾向；明确说“风格你来定，直接做”可委托 Agent 选择。

**只想临时使用，不安装：** 将仓库放在 Agent 可读取的位置，然后指定实际路径：

```text
请读取并遵循 /实际路径/luo-skills/task-ui-prototype/SKILL.md，
按需读取其相对引用的参考与素材，只用于本次 UI 原型任务。不要安装。
```

这种方式不保证后续任务自动发现；个人记忆写在本次实际加载的 Skill 目录，临时目录删除后不会自动保留。安装多个 Skill 也不代表每个任务都要读取全部，按任务指定需要的名称和分工即可。

## 更新与个人记忆

`task-ui-prototype` 会按 [偏好记忆规则](task-ui-prototype/preference-memory.md) 在本地创建 `memory/preferences.md`；通用规则随仓库分发，个人记录不进入 Git。可以说“忘记这条”“暂停记录”或“这次不要参考历史”。

更新或重装前，将同一使用者的 `memory/` 备份到**安装目录之外**，核对实际加载位置（包括软链接目标），再更新通用文件并恢复记录。部分安装器会替换整个目录，不能依赖 Git 忽略来保护记忆；内置安装器也不一定支持覆盖更新。

不同使用者各自安装，分享时排除个人记录；多个独立副本不会自动同步。没有写权限时只能在本次任务采用反馈，Agent 应明确告知未持久保存。

## 预览样板

以下命令在仓库根目录执行，样板使用演示数据。

```sh
# PC 历史案例
python3 -m http.server 8766 --bind 127.0.0.1 --directory task-ui-prototype/assets/examples/stock-analysis
```

打开 [PC 案例对比](http://127.0.0.1:8766/index.html)。

```sh
# 移动端同题视觉样板
python3 -m http.server 8769 --bind 127.0.0.1 --directory task-ui-prototype/assets/examples/mobile-styles
```

打开 [单屏切换](http://127.0.0.1:8769/) 或 [并排比较](http://127.0.0.1:8769/compare.html)。移动端规则与验收状态见 [mobile-visual-presets.md](task-ui-prototype/mobile-visual-presets.md)；网页原型不代表真机、小程序或 App 宿主验证通过。
