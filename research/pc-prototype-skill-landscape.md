# PC 页面原型 Skill 调研与方向（2026-09-24）

## 目标与结论

用户希望输入页面需求，得到**可运行的 PC 网页原型及其截图**。用户可能说不清设计术语，却能从几张真实效果图中判断喜欢与不喜欢。Skill 应承担提出审美方向、让用户看图选择、沿所选方向打磨的工作。

建议第一版聚焦 **PC 业务页面**（工作台、列表/详情、分析页、编辑页）。核心能力是：理解页面任务 → 从小型预设库推荐明显不同的方向 → 用同一内容制作并排效果图 → 用户选择或否决 → 打磨选中方向 → 交付可运行网页和截图。高级感是每个方向的质量底线，不是某一种固定配色。

## 公开 Skill 对照

以下是公开源码中有代表性的样本，不是全网穷尽或品质排名。

| 项目 | 主要做法 | 对本目标的启发或边界 |
| --- | --- | --- |
| [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 从产品语境推导色彩、字排、版式；写代码前检查方案是否落入通用模板，建议截图自评 | 审美原则强，但没有 PC 业务页面专用输入、交付和必经的浏览器验收 |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/templates/base/skill-content.md) | 检索产品、风格、色板、字体与 UX 规则，生成可复用设计系统 | 适合补设计知识；设计系统本身不等于最终页面和截图反馈 |
| [Impeccable](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md) | 覆盖塑形、审查、字排、布局、润色等前端设计任务，强调针对具体页面选择设计动作 | 改进手段全面；覆盖范围大，第一版无需复制整个体系 |
| [frontend-ui-prototype](https://github.com/0furkancolak/frontend-ui-prototype/blob/main/SKILL.md) | 需求问答、产品事实与参考、设计方向选择、独立 HTML、桌面和移动截图 | 与交付方式最接近；其覆盖面包含落地页与移动端，可针对 PC 业务场景收窄 |
| [interface-design](https://github.com/Dammyjay93/interface-design/blob/main/.claude/skills/interface-design/SKILL.md) | 专注 dashboard、后台和 SaaS 的焦点、信息密度、比例、层级和界面状态 | 与 PC 工作台接近；更偏正式产品界面，不规定原型交付格式 |
| [office-web-ui-system](https://github.com/thienanblog/awesome-ai-agent-skills/blob/main/skills/office-web-ui-system/SKILL.md) | 关注运营后台、CRM、ERP、CRUD 页面中的表格、表单、筛选和操作空间 | 说明 PC 页面需要不同于营销页的版式判断；可新建或改善页面，但未定义独立原型交付 |
| [Superdesign skill](https://github.com/superdesigndev/superdesign-skill) | 通过独立 CLI、账户和设计画布完成参考探索、草稿分支与迭代 | 适合多方案探索，但依赖外部服务；不是一个自包含的本地 Skill |

辅助项目：[Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)负责规则审查，不负责设计生成；[Anthropic canvas-design](https://github.com/anthropics/skills/blob/main/skills/canvas-design/SKILL.md)面向静态艺术 PNG/PDF，不适合需要准确文案与可操作控件的业务页面。

本机当前的 [`frontend-skill`](/Users/luo/.codex/skills/frontend-skill/SKILL.md) 有应用界面规则，但主体包含落地页的 hero、图片和动效指导。它要求视觉方向，却没有把实际浏览器截图和针对截图的修订设为交付门槛。若将其规则直接套到信息密集的 PC 业务页，仍需要额外指定页面任务、密度和主要操作。这里描述的是当前文件，无法证明用户过去调用时用的是同一版本。

## 为什么会出现“难看”

**不能按现有证据对用户个案归因。**缺少过去的原始需求、提示词、模型、调用方式和结果截图。

1. **模型会回到熟悉的模板。**Anthropic 的公开 Skill 明列卡片网格、惯性配色、无语境标签等常见生成特征，要求先审查设计计划是否针对当前主题。[源码](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)。这是通用模型工作方式的线索，不是针对 GPT 的单独测量。
2. **抽象审美词没有被转成可见选项。**用户不必先学会设计术语才能提出“高级大气”的目标；Skill 应根据业务内容给出多张有真实差异的方向图。目标用户、主任务、真实字段、数据密度和既有视觉资产会影响方案。[Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)要求从主题和内容推导设计；[OpenAI Academy 的 Codex 设计示例](https://academy.openai.com/public/clubs/champions-ecqup/videos/design-context-and-iteration-with-codex-2026-07-09)建议用截图、URL、情绪板或组件参考给出上下文。这些参考应由 Skill 主动寻找和提出，不能全压给用户。
3. **交付流程可能止于代码。**当前本机 `frontend-skill` 并不强制浏览器截图；代码、预览图与用户看到的页面可能不同。[Anthropic 的设计实验](https://www.anthropic.com/engineering/harness-design-long-running-apps)使用独立评价者打开页面、截图、给出具体批评后再迭代，并指出生成者自评容易偏乐观。实验针对 Claude，不能直接当作 GPT 的量化结论。
4. **如果曾用图像模型直接绘制整张 UI，载体也会限制精确度。**OpenAI 的[图像生成文档](https://developers.openai.com/api/docs/guides/image-generation)列出精确文本位置和结构化布局摆放的限制；其[评估示例](https://developers.openai.com/cookbook/examples/multimodal/image_evals)也将页面类型、布局层级、文本正确性和控件可辨识性分开验收。复杂业务 UI 更适合由 HTML/CSS 保证文字和控件可编辑，再截图交付；图像模型可用于氛围或素材探索。这是工作流建议，尚未在用户案例中实测。

[UI-Bench](https://arxiv.org/html/2508.20410v1)在 2025 年的文本生成应用工具盲评中观察到明显的视觉质量差异，并将高质量结果与布局规划、素材、字排和配色系统关联起来。它比较的是工具整体，未隔离底座模型，且是当时的快照；不能据此判定 GPT 固有能力或当前工具排名。

### 两个本地项目给出的具体线索

- [AI-study v2 提示词](/Users/luo/Projects/ai-study/product/visual/ashare-workbench-v2.prompt.md)要求保留旧图的深色配色、左导航、中央工作区、右侧 Agent 栏和整体空间层级，并且只改误导性的内容与数字。[v1](/Users/luo/Projects/ai-study/product/visual/ashare-workbench-v1-reference.png) 与 [v2](/Users/luo/Projects/ai-study/product/visual/ashare-workbench-v2.png) 的确延续了三张指标卡、多层面板和右栏。这是一次内容修正型编辑，不是多方向视觉探索；不能拿它单独证明 GPT 无法产出其他风格。[项目 README](/Users/luo/Projects/ai-study/README.md)目前把 v2 图列为旧视觉参考。
- [门店经营 V2 的已批准设计规范](/Users/luo/Projects/store-management-v2/DESIGN.md)把 PC 方向定为简约、有秩序、紧凑连续列表，明确排除卡片矩阵、渐变、重阴影和装饰性标题。它可成为一个“经营工作台”预设的种子，但不能自动推为所有产品的唯一高级风格。

## 第一版 Skill 的建议边界

名称可暂用 `desktop-ui-prototype`。单次任务先围绕一个目标页面。原型之外的正式产品实现不在默认交付范围。

1. **轻量提问：**先问页面要完成什么、哪些内容必须真实呈现、有无既有品牌和明确禁忌。对于风格，给日常语言的可选倾向，也允许回答“不知道”；不要求用户先提供设计术语或参考站点。
2. **同题多方向：**从预设库挑出最适合该任务的约三种方向，使用同一业务内容、功能范围和桌面视口制作轻量 HTML/CSS 页面并截成并排效果图。差异应体现在构图、字排、密度、色彩与素材策略，不能只换主题色。每张附一行通俗说明与推荐理由；首轮无需把三套交互都实现完整。
3. **让用户作视觉判断：**询问最喜欢、最排斥、想保留的局部；允许“都不喜欢”。根据反馈更新方向，而不是让用户重新写一份专业设计说明。选择后再做少量精修变体，避免在第一轮就把单一方案做得很重。[NN/g 关于识别与回忆的说明](https://www.nngroup.com/articles/recognition-and-recall/)支持可见选项比凭空描述更容易判断；这是交互设计依据，并不证明某个固定变体数最佳。
4. **打磨与交付：**将选中方向做成可运行 HTML/CSS/JS 或沿用原项目技术栈，在固定桌面视口截图，检查视觉焦点、比例、字排、留白、密度、溢出和主要交互，修正有证据的问题后交付源文件与最终截图。

### 预设是视觉语法，不是固定模板

平台保持统一品牌底层（字体、色彩角色、图标和控件语言），不同页面功能再选合适的编排规则。已有已批准设计规范时，默认在其边界内展示不同编排；用户明确要求探索新视觉方向时，候选可偏离既有规范，但须标为待选择的探索稿，不能当成已采纳方案。以下是第一批待实际出图检验的候选预设：

| 预设 | 核心画面 | 适用页面 | 依据 |
| --- | --- | --- | --- |
| 精密工作台 | 弱侧栏、紧凑工具区、连续列表、中性色与单一强调色 | 商品/订单/审批/配置 | [Linear 改版说明](https://linear.app/now/behind-the-latest-design-refresh)、本地门店经营 V2 规范 |
| 品牌画册 | 大幅产品照片、不对称编排、宽松留白，属性次级 | 服装选品、素材目录、品牌展示 | [Notion 图库视图](https://www.notion.com/help/galleries) |
| 研究刊物 | 主阅读栏加证据/目录栏，细致字排，少量关键数字 | 个股研究、策略解释、报告详情 | [IBM 字排原则](https://www.ibm.com/design/language/typography/type-basics/) |
| 分析终端 | 筛选、图表和数据表形成高密度工作面；颜色表达数据含义 | 持仓分析、全市场机会、监控 | [TradingView 筛选器](https://www.tradingview.com/support/solutions/43000718885-tradingview-screeners-walkthrough/) |
| 创作画布 | 编辑结果居中，工具与属性栏可收起，工作区宽松 | AI 策略生成、规则编辑、设计工具 | [Figma UI3 设计复盘](https://www.figma.com/blog/behind-our-redesign-ui3/) |

这些名称和适配关系是本次调研后的设计提案，不是这些产品的官方分类，也不意味着复制它们的视觉外观。第一版可将预设写成少量可调整的排版、色彩、密度和素材规则，并配原创效果图供用户选择；不要先收集几十个风格名。

最小实现可以是 `desktop-ui-prototype/SKILL.md`（提问、出图、选择、打磨、交付流程）、`references/style-presets.md`（五种预设的适用任务和变化轴）及 `assets/previews/`（经用户比较后保留的原创示例图）。先为一个真实页面做三张可比的方向图，确认这些规则确实能生成不同且可选的效果，再固化为 Skill；纯文本规则通过结构校验不代表审美有效。

## 如何判断新 Skill 真有改进

先用 AI-study 的一个分析页、门店经营 V2 的一个操作页验证“同题多方向”能否让用户明确选出更喜欢的视觉语言；这两个项目当前各有不同的视觉约束，测试时不能互相套模板。然后固定模型、画布、内容、素材和时间预算，盲比现有 `frontend-skill` 与新 Skill 的最终截图。记录用户偏好、理由、修订轮次、任务清晰度和可读性；自动检查负责可运行性、溢出与内容缺失。若新 Skill 的候选都像同一张后台图，预设设计就失败了。[UI-Bench 的人工成对评价方法](https://arxiv.org/html/2508.20410v1)可供参考。
