# Luo Skills

**按任务选择、独立安装的 Agent 技能库。**

中文 · [English](README.en.md)

[在线网站与案例](https://luoqaq.github.io/luo-skills/) · [详细安装指南](docs/installation.md) · [本地预览](docs/installation.md#本地预览)

## 当前技能

| Skill / 安装名称 | 适合的任务 | 主要能力 |
|---|---|---|
| [task-ui-prototype](skills/task-ui-prototype/SKILL.md) | PC / 移动端后台、工作台、列表详情和表单的 UI 原型 | 比较 2–3 个可运行视觉方向，扩展可点击流程并验收，按场景记录个人设计偏好 |
| [less-talk](skills/less-talk/SKILL.md) | 日常问答、解释、建议、进度与结果汇报 | 先给结论，再给对应依据；按问题组织简短回答，保留必要事实、条件与步骤 |

目前有 **2 个 Skill**，都位于 `skills/<名称>/`。每个目录内的 `SKILL.md`、参考文档和素材构成一项完整 Skill，可独立安装；UI 规范、视觉预设和样板不是单独的 Skill。

`task-ui-prototype` 交付可运行网页原型、源码、启动方式、设计简报及验收结果。小程序与 App 也用网页表达；演示数据和宿主示意不代表真实服务或平台能力已接通。它不用于营销落地页或静态艺术图，缺失的浏览器、截图或点击验证会列为未验证项。

`less-talk` 约束 AI 在对话中生成回答时的表达方式。简单事实或区别默认 1–3 句，没问做法不附教程，答清即停。需要展开时按“答案或结论 → 关键理由或证据 → 必要补充”组织，按解释、选择、操作、汇报调整；同一信息不重复改成表格或总结。从属依据或例子最多缩进一层。用户明确要求详细时展开。可单次调用，也可按[安装指南设为跨对话默认](docs/installation.md#less-talk-跨对话默认启用)；仅安装不代表每轮必用。

## 安装

### 首推：让 Agent 安装

把下面的话发给具备联网、终端和文件权限的 Agent；需要简洁回答技能时，将名称换成 `less-talk`：

```text
请从 https://github.com/luoqaq/luo-skills 安装 task-ui-prototype，
放到当前 Agent 的个人技能目录，只安装这一项。
请按 docs/installation.md 执行；已存在时先核对版本并保留我的 memory/，
完成后报告实际安装路径和结果。
```

需要项目级安装时，把“个人技能目录”改成“当前项目的技能目录”。单独粘贴仓库链接不代表已经安装。

### 备选：终端安装

以下使用第三方 [skills CLI](https://github.com/vercel-labs/skills#readme)，需要符合其[版本要求](https://github.com/vercel-labs/skills/blob/main/package.json)的 Node.js、npm 和 Git；首次运行 `npx` 可能下载工具。以 Codex 个人级安装为例：

```sh
# 查看可安装项
npx skills add luoqaq/luo-skills --list

# 只安装指定技能；可将名称换成 less-talk
npx skills add luoqaq/luo-skills --skill task-ui-prototype --agent codex -g
```

项目级安装先进入目标项目，再去掉 `-g`。已有同名技能时先备份个人 `memory/`；多个技能、其他 Agent、手动引入和更新步骤见[详细安装指南](docs/installation.md)。

## 使用示例

**任务型 UI 原型：**

```text
使用 task-ui-prototype，为服装门店管理员设计手机网页原型。
只做首页、商品列表、商品详情。按全新项目设计，不参考现有 UI。
暂无风格偏好，先给 2–3 个可运行方向稿。
```

已有明确方向可以直接做基准页；说“风格你来定，直接做”可委托 Agent 决定。

**Less Talk · 简洁回答：**

```text
使用 $less-talk 回答：Git 的 commit 和 push 有什么区别？
```

也可以说：“这次对话按 less-talk 的规则回答，先给结论，省掉铺垫和重复，必要细节保留。”Codex 可用 `$task-ui-prototype`、`$less-talk` 显式调用；其他 Agent 的语法以其文档为准。

查看[在线网站与案例](https://luoqaq.github.io/luo-skills/)，或按[本地预览步骤](docs/installation.md#本地预览)运行现有样板。网站维护与构建说明见 [site/README.md](site/README.md)。
