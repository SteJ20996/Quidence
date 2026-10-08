# Quidence · Mathematics and Introductory Physics

**当前状态与下一步审核以 [CURRENT_STATUS.md](CURRENT_STATUS.md) 为准。其他带日期的审核文件保留当时的验证范围。**

公测已暂停账户与云端同步，新学习记录仅保存在当前浏览器。所有活动页提供 [保存、恢复与删除记录](records/) 入口，公用设备离开前应清除本地记录和下载文件。默认 `npm start` 不开启账户 API 或打开学生数据库；开发测试中的 `accountsEnabled: true` 不用于公测。当前规则见 [LOCAL_ONLY_REVIEW.md](LOCAL_ONLY_REVIEW.md)。

主页提供 8 个数学学科（含统计学），Science 分组拆成 Physics 1 Foundations 和 Physics 2 Foundations。物理按对应课程主题选取代数型入门内容，不规定统一开课年级，不宣称完整进阶课程或考试准备；范围与缺口见 [两课设计稿](PHYSICS_TRACKS_DESIGN_2026-10-08.md)。经济学和博弈论不再提供课程活动。

| 分类 | 学科 | 检查题 |
| --- | --- | ---: |
| School Mathematics | Pre-Algebra、Algebra I、Geometry、Algebra II | 各 4 题 |
| Further Mathematics | Pre-calculus、Calculus、Statistics | 各 4 题 |
| Further Mathematics | Linear Algebra | 12 题 |
| Science | Physics 1 Foundations、Physics 2 Foundations | 各 6 题（公式提供） |

当前主页共 52 道检查题、204 个独立检查的答案分量。主页每科均提供 **Test your understanding / Diagnostic challenges**，可以直接测试。物理两课另有 6/7 个学习单元，包含 18/21 个学习题和 24/28 个活动。原四单元 Physics 与第 4 版题库保留读取历史记录，不混入新课报告。

当前共 20 个 California-inspired field projects，10 科各两个；包含 64 个阶段、162 个数值输入、6 个模型公式、2 个几何构造和 51 个开放回应。项目不是选择题。主页 **Explore two field projects** 可直接进入。内部挑战目标尚未由学生试做校准，不公开数值难度。

几何可轻点放点、输入分数坐标、用按钮连线及撤销；答案和图形一起保存。等价多项式用系数核验，解释不按关键词、语法或长度自动判分。每小问有理解要点及可记录的本地复核；未审核的理解保留待复核。见 [PROJECTS_REVIEW.md](PROJECTS_REVIEW.md)。


## 题目和反馈

- 新题要求组合概念、处理限制或特殊情况、构建模型，并解释或核验结果。线代重点包括参数系统、秩与零空间、复合顺序、换基、投影、最小二乘、特征向量、面积变化和子空间。
- 题目注明前置知识。**Not studied** 与 **Not sure** 分开记录；前者是学习准备情况，不记成客观错误。
- 数值和选择题按分量检查。报告列出需要复查的知识点；下游结果如果可能沿用上游错值，会明确注明，避免把连带错误算成多个独立薄弱点。
- 原始解释、未提交草稿、提交历史和本地人工解释审核保留。匹配数值不等于解释通过，也不自动等于学科掌握程度。
- 每科题集是独立抽样，并非完整课程或经过学生数据标定的诊断量表。难度标记是设计目标；详见 [MATH_DIAGNOSTICS_REVIEW.md](MATH_DIAGNOSTICS_REVIEW.md)。

## 本地运行

使用 Node.js 24.19 或更新的 24.x 在本地运行：

```sh
npm start
```

打开 <http://127.0.0.1:3000/>，线代诊断入口为 <http://127.0.0.1:3000/diagnostics/?module=ab01>。默认服务器仅提供允许的网页文件，账户和云同步 API 返回暂停状态，不打开学生数据库。无需安装第三方 npm 依赖。

静态托管前运行 `npm run build:static`，只发布生成的 `static-release/`，不要发布整个仓库。脚本要求输出目录不存在，避免旧文件混入新包。生成的 `_headers` 适用于 Cloudflare Pages 静态响应；其他托管方须等效配置安全响应头。这个命令只准备文件，不部署网站，不表示来源审核已经通过。详见 [OVERALL_REVIEW_2026-10-07.md](OVERALL_REVIEW_2026-10-07.md)。

`npm test` 检查记录保护、题目数学、DOM 流程和来源清单；GitHub Actions 自动执行这些检查及发布包构建。真实浏览器端到端覆盖和 macOS/iPad 实测仍待完成。账户相关代码仅供开发测试，不能据此重开公测账户。

## 主要位置

| 位置 | 内容 |
| --- | --- |
| `assets/challenge-bank.js`、`diagnostics/` | 数学中高难度诊断与物理入门检查 |
| `assets/foundation-engine.js`、`assets/foundation-app.js` | 共用检查、历史保存与报告流程；新题使用独立记录空间 |
| `assets/project-bank.js`、`assets/physics-foundation-bank.js` | 20 个为 Quidence 编写的多步骤情境项目，来源审核待完成 |
| `assets/project-tools.js` | 有界多项式检查与几何构造工具 |
| `projects/` | 独立项目入口与保存 |
| `review/project-math-audit.json` | 从情境数据独立推导的答案参照 |
| `review/project-graphics.svg` | 给定图与独立审核的几何构造 |
| `PROJECTS_REVIEW.md` | 逐项目审核、解释标准和验证范围 |
| `review/challenge-math-audit.json` | 52 道当前题及 6 道历史 Physics 题的复算答案参照 |
| `scripts/audit-challenges.py` | 不读取题库答案的精确分数、消元、积分与统计验证 |
| `review/challenge-graphics.svg` | 新图在 320px 和 520px 宽度下的审核页 |
| `courses/`、`modules/aa01`、`ab01`、`ad01`、`ae01`、`af01` | 当前数学教学与视觉活动，另含 `courses/physics-1/`、`courses/physics-2/`，旧 `courses/physics/` 保留历史读取 |
| `foundations/`、`reports/` | 旧数学基础检查、保存的报告；历史记录保持兼容 |
| `backend/`、`account/` | 账号及带版本冲突保护的跨设备同步 |
| `archive/retired-subjects/` | 已退出产品的经济学与博弈论源文件；不属于当前课程 |

退出课程的旧 URL 显示停止提供课程的说明，保留返回数学主页及导出旧报告的链接。旧记录、报告和必要的历史题目定义不删除；当前活动入口不再提供这些学科。

## 验证

```sh
npm test
python3 scripts/audit-challenges.py
node scripts/render-challenge-graphics.cjs
```

`npm test` 检查当前数学、题目流程、草稿/历史/报告、图像、账号隔离和同步冲突；新增诊断检查使用独立复算答案，逐个扰动分量来核对部分匹配及错误反馈。Python 审核只使用标准库。图像审核页是独立 SVG，不需要浏览器截图依赖。

旧版本审核文件保留作为历史记录；以本 README 和本次诊断审核表为当前范围。macOS 实机交互及打印仍需实际浏览器测试。

Current record behavior is described at `data-use/`. See [Claude follow-up status](CLAUDE_FOLLOWUP_REVIEW.md), [source review process](SOURCE_REVIEW.md), and the [unapproved privacy and retention draft](PRIVACY_AND_RETENTION_DRAFT.md). There is no online account deletion or automatic revision expiry yet. The explanation checks are provisional and do not call an AI grading model; these activities do not certify comprehensive mathematical mastery.
