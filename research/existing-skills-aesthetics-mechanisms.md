# 已有 UI 设计 Skill 的美观保障机制（2026-09-24）

问题：公开 UI 设计 skill 各自通过什么机制保证产出美观？哪些机制值得 `pc-ui-prototype` 借鉴？

方法：逐个抓取 8 个 skill 的 SKILL.md 及核心参考文件原文（raw 源码），按五类机制归纳：审美规则、流程门槛、评审迭代、设计系统/素材、反模式禁令。样本来自 [pc-prototype-skill-landscape.md](pc-prototype-skill-landscape.md)，非全网穷尽。

## 一、各 skill 的机制概览

| Skill | "美"由什么背书 | 核心手段 |
|---|---|---|
| [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 对 AI 产出分布的经验归纳 + 排版经典标准 | 角色代入 + 两遍工作法（先 token 方案自审独特性再写码）+ 精确到 hex 的 AI 味反模式清单 |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 数据策展人的品味 | 15 个 CSV 策展数据集（色板/字体配对/风格参数/产品类型推理）+ Python 检索，AI 只组合不创作；无截图验收 |
| [Impeccable](https://github.com/pbakaus/impeccable) | 外部化工具，刻意不信任模型自评 | 随机脚本分配方向破审美惯性 + 写码前方向契约落盘 + comp-diff 像素对比门禁 + 独立 reviewer 子代理（禁止构建者自评） |
| [frontend-ui-prototype](https://github.com/0furkancolak/frontend-ui-prototype/blob/main/SKILL.md) | Google DESIGN.md 外部规范 + 流程 | 提问门 → 强制 3 个结构性不同的方向候选 → 用户选择门 → 三视口渲染 + 100 分记分卡（85 及格）+ 强制一轮修订 |
| [interface-design](https://github.com/Dammyjay93/interface-design) | 对 Linear/Vercel/Stripe 细节规律的逆向总结 | 大量量化规则（字阶比例、阴影 rgba 值）+ 强制意图 checkpoint + swap/squint/signature 自检测试 + presumptive blockers 验收门槛 |
| [office-web-ui-system](https://github.com/thienanblog/awesome-ai-agent-skills) | 规则文档本身的品味 | 页面类型 × 表现力分档矩阵 + 组件配方（强制最小集）+ 高密度反模式禁令 + 真实渲染验收 |
| [Superdesign](https://github.com/superdesigndev/superdesign-skill) | 外部设计服务 + 人工画布终审 | 审美外包给 superdesign.dev；本地只管防烂：init 上下文硬门槛、像素级复刻建 ground truth、design-system 保真条款、人工批准后才写码 |
| [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Vercel 内部规范 | 纯评审 skill：约 130 条工艺清单运行时实时拉取，file:line 格式输出；不管风格层审美 |

## 二、跨样本的六个共性发现

1. **反模式清单是标配，且越具体越有效。**Anthropic 精确到 hex 值（#F4F1EA 米色背景、#D97757 陶土橙——并点名这是 Claude 自家配色，用了即露馅）；Impeccable 直接黑名单训练数据默认字体（Fraunces、Inter-as-display、"these training-data defaults mean you stopped looking"）；frontend-ui-prototype 点名"紫色渐变球、图标云"。泛泛说"不要千篇一律"没用，点名才有约束力。

2. **"设计决策先行"是硬门槛，不是建议。**Anthropic："Only after you've confirmed the relative uniqueness of your design plan should you start to write the code"；frontend-ui-prototype："Do not code before the question and design-selection gates are resolved"；Impeccable 更进一步——写码前方向契约（THESIS/FORM/FINISH 六块）必须落盘，否则算 contract violation。

3. **自评不可信是共识，解法分两派。**Impeccable 最激进："a reviewer that inherits your transcript inherits your framing, your optimism"——强制 spawn 无构建记忆的独立 reviewer 子代理；Superdesign 把视觉终审交给人（画布上人工验收，agent 只做结构检查并明确声明"not a claim of complete visual QA"）。frontend-ui-prototype 用记分卡把自评客观化（100 分制、85 及格、强制找出三个最大弱点修复）。

4. **截图验收有纪律，不是无限打磨。**Impeccable："verify in bounded passes, not a loop … confirm with at most one more round, and stop polishing. Open-ended self-QA burns the user's money"；且截图必须先验证有效性（动画时序可能隐藏元素，"an element hidden by animation timing reads as a missing element"）。

5. **验收门槛用"否决项"写法比"检查清单"更硬。**interface-design 的 design-review 列 presumptive blockers：无焦点、仅用大小区分字体层级、单调布局、缺状态——"Any one present → not approved"。配合可操作的自检测试：swap test（换掉字体布局会不会毫无差别）、squint test（眯眼后层级是否仍可读）。

6. **量化规则下沉到参考文件。**interface-design 的字阶比例（dense UI 用 1.2、常规 1.25）、暗色表面 +7%/+9%/+12% 层级、边框 rgba(255,255,255,0.06–0.12)；office-web-ui-system 的表现力分档（CRUD 默认 Restrained、dashboard 默认 Balanced，"Do not choose intensity in isolation"）。这类数值是"高级感"的真正载体——形容词无法执行，数值可以。

## 三、对 pc-ui-prototype 的借鉴清单

映射到五阶段流程：

**阶段 1（输入契约）**
- Superdesign 的"单一风格源"禁令：参考方向最多选一个主源，禁止混合两种风格互相稀释。（"Pick ONE primary style source — do NOT blend two competing styles"）
- 前端-ui-prototype 的提问纪律：禁止问抽象品味（反例 "Should it be modern?"），只问具体事实。

**阶段 2（设计简报）**
- 升级为"方向契约"：必须落盘（或至少在对话中成文），包含首屏构图、色彩策略、密度档位、签名元素，作为阶段 4 的对照基准（Impeccable 做法）。
- 候选方向必须结构性不同，"not only by color"（frontend-ui-prototype）。
- 加"表现力分档 × 页面类型"矩阵：CRUD 默认克制、dashboard 默认均衡（office-web-ui-system）。

**阶段 3（实现）**
- Superdesign 保真条款："只用简报中定义的字体/颜色/间距，不引入系统外样式"；并禁止在结构描述里堆"高级、优雅"类形容词——模型会把形容词渲染成通用营销页。

**阶段 4（截图验收）**
- 验收清单改为否决项写法：无第一屏焦点、纯大小区分层级、缺真实状态、密度与页面类型不匹配——任一命中即打回（interface-design）。
- 加"简报对照"环节：简报承诺的焦点/层级在截图里逐条核对。
- 有界修订纪律：一轮批量截图、一次批量修复、至多两轮，明确"停止打磨"（Impeccable）。
- 截图有效性前置检查：动画时序隐藏元素、空白视口要先排除。
- 可选升级：重要交付时 spawn 独立 reviewer（无构建上下文）看截图，或请用户过目——我们当前方案是生成者自评，这是已知最弱点（调研 landscape 文档第 33 行也指出自评偏乐观）。

**参考文件（pc-design-reference.md）**
- 反模式清单精确到具体样式参数，点名 PC 业务页的典型 AI 味：千篇一律左侧菜单+面包屑+卡片堆砌、彩虹统计卡、hero-metric 大数字模板、处处玻璃拟态。
- 补量化默认值：字阶比例、暗色表面层级、边框透明度、状态色语义（蓝=默认指标、绿=健康、琥珀=警告、红=风险）。
- 加正向案例拆解（2-3 个优秀 PC 界面的具体手法），反模式防丑，正向案例指向美。

**明确不搬的**
- Impeccable 的随机掷方向脚本和 comp-diff 像素对比门禁：对原型场景过重。
- UI/UX Pro Max 的 CSV 数据集 + Python 检索架构：数据策展工作量与 v1 规模不匹配，且它没有截图验收，恰是我们的强项。
- Superdesign 的外部服务依赖：违背自包含定位。
