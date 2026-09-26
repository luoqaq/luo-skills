# 安装、使用与更新

本仓库提供可独立安装的 Agent Skills。先从 [README 技能列表](../README.md#当前技能)确认名称，再选择需要的项目和安装范围。每个 Skill 位于 `skills/<名称>/`，包含 `SKILL.md` 及其参考、素材；不要只复制一个说明文件。

## 方式一：让 Agent 用自然语言安装

这是推荐方式。把下面的话发给具备联网、终端和文件权限的 Agent。安装范围默认写清楚；如果目标是项目级，把“个人技能目录”改成“当前项目的技能目录”。这些话要求 Agent 执行安装，单独粘贴 GitHub 链接不代表已安装。

**单个 Skill：**

```text
请从 https://github.com/luoqaq/luo-skills 安装 task-ui-prototype，
放到当前 Agent 的个人技能目录，只安装这一项。请按 docs/installation.md 执行，
已存在时先核对版本并保留我的 memory/；完成后报告实际安装路径和结果。
```

安装简洁回答技能时，将单项示例中的名称换成 `less-talk`。

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
$skill-installer 请安装 https://github.com/luoqaq/luo-skills/tree/main/skills/task-ui-prototype
```

Codex 内置安装器可从其他仓库安装 Skill，见 [OpenAI 官方说明](https://learn.chatgpt.com/docs/build-skills#install-curated-skills-for-local-use)。不同安装器的路径和更新行为可能不同，以实际输出为准；不要假定批量失败会自动回滚已成功的项。

## 方式二：命令行安装

使用第三方 [skills CLI](https://github.com/vercel-labs/skills#readme)，需要符合[安装器版本要求](https://github.com/vercel-labs/skills/blob/main/package.json)的 Node.js、npm 和 Git；首次运行 `npx` 可能下载该工具。以下以 **Codex 个人级安装**为例，已安装过同名技能时先看[更新与个人记忆](#更新与个人记忆)。

```sh
# 查看仓库有哪些技能，不安装技能
npx skills add luoqaq/luo-skills --list

# 只安装一个
npx skills add luoqaq/luo-skills --skill task-ui-prototype --agent codex -g

# 交互选择要安装的技能；只有一个可选项时可能直接选中
npx skills add luoqaq/luo-skills --agent codex -g
```

一次安装多个：先从列表获取真实名称，再替换下面的占位符。

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

## 方式三：手动引入

下载仓库 ZIP 并解压，或克隆仓库：

```sh
git clone https://github.com/luoqaq/luo-skills.git
cd luo-skills
```

从 `skills/` 中选中需要的 Skill，复制**整个 Skill 目录**到 Agent 的技能目录，例如把 `skills/task-ui-prototype/` 复制为目标目录中的 `task-ui-prototype/`。保留 `.gitignore`、`references/`、`agents/` 和 `assets/` 等已有文件，不要只复制 `SKILL.md`，也不要多套一层 `luo-skills/` 或 `skills/`。复制别人的本地副本时排除 `memory/`；Git 忽略不会阻止普通文件复制。

以 Codex 为例，手动放置到 `~/.agents/skills/task-ui-prototype/` 可供个人跨项目使用；放到目标项目的 `.agents/skills/task-ui-prototype/` 则供该项目使用。目录依据 [Codex 官方说明](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)；其他 Agent 按各自文档设置，不把 Codex 路径当作统一规范。

对于 Git 克隆的仓库，也可在仓库根目录执行以下命令（macOS / Linux / Git Bash）。它从 `HEAD:skills` 导出**当前 HEAD 中已提交的版本**，本地未提交的修改不会导出，也不会携带本地未跟踪的个人记忆。已有目标会跳过：

```sh
skill_dest="$HOME/.agents/skills"
mkdir -p "$skill_dest"
for skill_name in task-ui-prototype; do
  if [ -e "$skill_dest/$skill_name" ] || [ -L "$skill_dest/$skill_name" ]; then
    printf '跳过已存在的 Skill：%s；更新请先保留 memory/。\n' "$skill_name"
  else
    git archive HEAD:skills "$skill_name" | tar -x -C "$skill_dest"
  fi
done
```

只引入一个就保留一个目录名；引入多个时在 `for skill_name in` 后列出选中的实际目录名，以空格分隔。项目级安装则把 `skill_dest` 换成**目标项目**的 `.agents/skills` 绝对路径。ZIP 解压目录没有 Git 元数据，使用普通整目录复制即可。

## 安装后如何使用

**Less Talk · 简洁回答：**

```text
使用 $less-talk 回答：Git 的 commit 和 push 有什么区别？
```

也可以说：“这次对话按 less-talk 的规则回答，先给结论，再给必要依据，按问题组织简短回答。”简单事实或区别默认 1–3 句，没问做法不附教程；需要展开时按解释、选择、操作、汇报调整结构，保留必要事实、条件与步骤，明确要求详细时展开。单次调用用于当前对话；跨对话默认使用需另设全局指令。

### Less Talk 跨对话默认启用

安装只让 Skill 可被发现，不代表每轮必用。Codex 通常先加载名称和描述，选用时才读取正文；`allow_implicit_invocation` 默认就是 `true`，含义是允许按任务自动选择，不能当作“始终启用”开关。[官方 Skill 加载说明](https://learn.chatgpt.com/docs/build-skills#how-codex-uses-skills)

希望默认使用时，可把下面的完整请求发给负责安装的 Agent：

```text
请从 https://github.com/luoqaq/luo-skills 安装 less-talk，
放到当前 Agent 的个人技能目录，并设为跨对话默认回答风格。
检查当前 Agent 实际加载的全局指令文件，保留原内容，合并一条规则：
每次新对话读取实际安装的 less-talk/SKILL.md，后续默认遵循；
用户当次指定的篇幅、语言和格式优先，不减少任务或必要检查。
不要重复安装或重复添加规则。完成后报告安装路径、修改位置和验证结果。
```

Codex 的全局入口默认是 `~/.codex/AGENTS.md`；若设置了 `CODEX_HOME`，则以该目录为准。同层存在非空 `AGENTS.override.md` 时优先读取它，不能只修改一个未生效的文件。下面是需要合并的规则示例，安装时将占位符换成真实绝对路径：[官方全局指令说明](https://learn.chatgpt.com/docs/agent-configuration/agents-md#create-global-guidance)

```md
## 默认回答风格

每次新对话读取并遵循 <Skill 文件的实际绝对路径>，后续默认沿用。
用户当次指定的篇幅、语言和格式优先，不减少任务或必要检查。
```

只在用户选择“设为默认”时合并全局规则；仅安装不附带修改全局配置。其他 Agent 使用各自的全局指令入口，不能假定都读取 Codex 的文件。云端、其他机器或其他客户端需分别配置。

在同一 Agent 配置下，选两个不同项目分别新建对话，不提 Skill 名称，核对实际加载的指令来源和 Skill 读取记录，再试普通问答和明确要求详细的请求。仅回答变短或模型声称已启用，不足以证明加载成功。若指令未加载，检查入口、覆盖规则和长度限制，必要时重启。配置验证与行为观察分别报告：全局规则提供默认指引，不保证每条回答都完全符合风格。

### 任务型 UI 原型

先确认实际安装路径内存在 `SKILL.md` 及参考、素材。Codex 会自动发现技能变化；若下一轮仍未出现，再重启，见 [官方加载说明](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。不要在多个技能目录里重复安装同名副本。

在任务中明确指定 Skill，最容易确认是否被采用：

```text
使用 task-ui-prototype，为服装门店管理员设计手机网页原型。
只做首页、商品列表、商品详情。按全新项目设计，不参考现有 UI。
暂无风格偏好，先给 2–3 个可运行方向稿。
```

Codex 可在开头写 `$task-ui-prototype`。其他 Agent 的显式调用语法以其文档为准。说明用户、主要动作、页面清单、目标端/载体和已知风格倾向；明确说“风格你来定，直接做”可委托 Agent 选择。

## 临时使用，不安装

将仓库放在 Agent 可读取的位置，然后指定实际路径：

```text
请读取并遵循 /实际路径/luo-skills/skills/task-ui-prototype/SKILL.md，
按需读取其相对引用的参考与素材，只用于本次 UI 原型任务。不要安装。
```

其他技能替换相应名称和任务即可。这种方式不保证后续任务自动发现；`task-ui-prototype` 的个人记忆写在本次实际加载的 Skill 目录，临时目录删除后不会自动保留。安装多个 Skill 也不代表每个任务都要读取全部，按任务指定需要的名称和分工即可。

## 更新与个人记忆

`task-ui-prototype` 会按 [偏好记忆规则](../skills/task-ui-prototype/references/preference-memory.md) 在**实际加载的 Skill 目录**中创建 `memory/preferences.md`，不是相对当前工作目录。通用规则随仓库分发，个人记录不进入 Git；Git 忽略不等于加密、备份或自动同步。可以说“忘记这条”“暂停记录”或“这次不要参考历史”。

更新或重装前，将同一使用者的 `memory/` 备份到**安装目录之外**，核对实际加载位置（包括软链接目标），再更新通用文件并恢复记录。部分安装器会替换整个目录，不能依赖 Git 忽略来保护记忆；内置安装器也不一定支持覆盖更新。

不同使用者各自安装，分享时排除个人记录；多个独立副本不会自动同步。没有写权限时只能在本次任务采用反馈，Agent 应明确告知未持久保存。

## 本地预览

以下命令在仓库根目录执行，样板使用演示数据。`127.0.0.1` 地址只供运行命令的本机访问，不是公开在线演示。

**介绍页与样板入口：**

```sh
python3 scripts/build-site.py --out /private/tmp/luo-skills-site
python3 -m http.server 8770 --bind 127.0.0.1 --directory /private/tmp/luo-skills-site
```

输出目录须不存在或为空；重复构建时换一个目录，并同步修改启动命令中的目录。构建不会删除或覆盖已有文件。

打开 [本地介绍页](http://127.0.0.1:8770/)。介绍页源文件为 [site/index.html](../site/index.html)，构建时打包现有样板；此命令只生成并预览文件，不会发布网站。维护与发布说明见 [site/README.md](../site/README.md)。

**也可分别运行样板：**

```sh
# PC 历史案例
python3 -m http.server 8766 --bind 127.0.0.1 --directory skills/task-ui-prototype/assets/examples/stock-analysis
```

打开 [PC 案例对比](http://127.0.0.1:8766/index.html)。

```sh
# 移动端同题视觉样板
python3 -m http.server 8769 --bind 127.0.0.1 --directory skills/task-ui-prototype/assets/examples/mobile-styles
```

打开 [单屏切换](http://127.0.0.1:8769/) 或 [并排比较](http://127.0.0.1:8769/compare.html)。移动端规则与验收状态见 [mobile-visual-presets.md](../skills/task-ui-prototype/references/mobile-visual-presets.md)；网页原型不代表真机、小程序或 App 宿主验证通过。
