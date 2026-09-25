# Luo Skills

可复用的 Agent 技能。每个 Skill 目录包含入口、按需参考和所需素材，可独立使用。

## 当前技能

| Skill | 用途 |
|---|---|
| [task-ui-prototype](task-ui-prototype/SKILL.md) | 设计 PC/移动端任务型网页原型：识别风格倾向，必要时比较方向稿，选定后扩展完整可点击原型并验收 |

`task-ui-prototype` 适用于后台、工作台、列表详情、分析和表单；不用于营销落地页或静态艺术图。PC 规范已编写，移动端规范尚待补充；三套视觉案例是参考样稿，未完成任务操作验证。

## 使用

将整个 Skill 目录放入所用 Agent 支持的技能目录，或在任务中指定其 `SKILL.md` 路径。不要只复制入口文件，否则会丢失参考和素材。

说明用户、主要动作、页面清单及已知风格倾向。没有倾向时，默认先提供同一代表页的多个可运行方向稿；明确说“风格你来定，直接做”可委托 Agent 选择。

## 目录

```text
task-ui-prototype/
├── SKILL.md
├── pc-design-reference.md
├── mobile-design-reference.md
├── task-patterns.md
├── visual-examples.md
└── assets/examples/stock-analysis/   # 案例及其本地资源
```

在仓库根目录预览案例：

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory task-ui-prototype/assets/examples/stock-analysis
```

打开 [案例对比页](http://127.0.0.1:8766/index.html)。样稿使用演示数据，仅用于理解视觉手法。
