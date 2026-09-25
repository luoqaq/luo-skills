# Luo Skills

可复用的 Agent 技能。每个 Skill 目录包含入口、按需参考和所需素材，可独立使用。

## 当前技能

| Skill | 用途 |
|---|---|
| [task-ui-prototype](task-ui-prototype/SKILL.md) | 设计 PC/移动端任务型网页原型：识别风格倾向，必要时比较方向稿，选定后扩展完整可点击原型并验收 |

`task-ui-prototype` 适用于后台、工作台、列表详情、分析和表单；不用于营销落地页或静态艺术图。PC 与移动端均有按需参考。移动端覆盖手机网页、小程序和 App 的网页原型，包含任务重排、触控、导航返回、输入、安全区及验收边界；网页原型不代表原生或宿主运行通过。PC 历史案例与移动端视觉预设分开维护，预设不是固定三选一菜单；已收录样板不代表真机验证或适用于所有项目。

## 使用

将整个 Skill 目录放入所用 Agent 支持的技能目录，或在任务中指定其 `SKILL.md` 路径。不要只复制入口文件，否则会丢失参考和素材。

说明用户、主要动作、页面清单、目标端/载体及已知风格倾向。载体的识别与默认规则见 [SKILL.md 阶段 1](task-ui-prototype/SKILL.md#1-明确输入)；双端任务分别按各端规范设计和验收。没有倾向时，默认先提供同一代表页的多个可运行方向稿；明确说“风格你来定，直接做”可委托 Agent 选择。

支持从交互中积累 [个人偏好记忆](task-ui-prototype/preference-memory.md)：设计前读取，收到相关反馈后更新，区分长期倾向、当次选择和待确认推断。当次要求优先，也可说“忘记这条”“暂停记录”。个人记录保存在 Skill 内的 `memory/preferences.md`，默认不进入 Git；更新时保留、迁移时单独复制，分享 Skill 时排除。

## 目录

```text
task-ui-prototype/
├── SKILL.md
├── pc-design-reference.md
├── mobile-design-reference.md
├── mobile-visual-presets.md
├── task-patterns.md
├── visual-examples.md
├── preference-memory.md
├── memory/                        # 本地个人记录，按需创建，不随 Git 分发
└── assets/examples/
    ├── stock-analysis/             # PC 历史案例
    └── mobile-styles/              # 移动端同题视觉样板
```

在仓库根目录预览案例：

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory task-ui-prototype/assets/examples/stock-analysis
```

打开 [案例对比页](http://127.0.0.1:8766/index.html)。样稿使用演示数据，仅用于理解视觉手法。

移动端样板：

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory task-ui-prototype/assets/examples/mobile-styles
```

打开 [可切换预览](http://127.0.0.1:8769/) 或 [同画布并排比较](http://127.0.0.1:8769/compare.html)。三稿保持业务内容和交互位置一致，比较纸本目录、柔和工作台、机能终端的视觉语言；详细规则与验证状态见 [mobile-visual-presets.md](task-ui-prototype/mobile-visual-presets.md)。
