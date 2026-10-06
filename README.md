# Quidence · Theoretical and Applied Mathematics

主页现在专注 8 个数学学科，统计学保留；经济学和博弈论不再提供课程活动。

| 分类 | 学科 | 中高难度诊断题 |
| --- | --- | ---: |
| School Mathematics | Pre-Algebra、Algebra I、Geometry、Algebra II | 各 4 题 |
| Further Mathematics | Pre-calculus、Calculus、Statistics | 各 4 题 |
| Further Mathematics | Linear Algebra | 12 题 |

共 40 道原创诊断题、156 个独立检查的答案分量。主页各课程卡及课程导航提供 **Test your understanding / Diagnostic challenges** 入口；可直接测试，不必先完成入门课。入门教学、旧基础检查和视觉活动仍可用于复习。

新增 16 个原创 California-inspired field projects，8 科各两个；包含 52 个分步问题、123 个数值输入、6 个模型公式、2 个几何构造和 39 个开放回应。新增项目全部不是选择题。主页每科的 **Explore two field projects** 可直接进入；目标难度约 6.5/10，待试做校准。

几何可轻点放点、输入分数坐标、用按钮连线及撤销；答案和图形一起保存。等价多项式用系数核验，解释不按关键词、语法或长度自动判分。每小问有理解要点及可记录的本地复核；未审核的理解保留待复核。见 [PROJECTS_REVIEW.md](PROJECTS_REVIEW.md)。


## 题目和反馈

- 新题要求组合概念、处理限制或特殊情况、构建模型，并解释或核验结果。线代重点包括参数系统、秩与零空间、复合顺序、换基、投影、最小二乘、特征向量、面积变化和子空间。
- 题目注明前置知识。**Not studied** 与 **Not sure** 分开记录；前者是学习准备情况，不记成客观错误。
- 数值和选择题按分量检查。报告列出需要复查的知识点；下游结果如果可能沿用上游错值，会明确注明，避免把连带错误算成多个独立薄弱点。
- 原始解释、未提交草稿、提交历史和本地人工解释审核保留。匹配数值不等于解释通过，也不自动等于学科掌握程度。
- 每科题集是独立抽样，并非完整课程或经过学生数据标定的诊断量表。难度标记是设计目标；详见 [MATH_DIAGNOSTICS_REVIEW.md](MATH_DIAGNOSTICS_REVIEW.md)。

## 本地运行

只测试课程与题目，可在项目根目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>。线代新题可直接打开 <http://127.0.0.1:8000/diagnostics/?module=ab01>。未登录的进度仍保存在当前浏览器。

测试账号同步需 Node.js 24.19 或更新的 24.x：

```sh
npm start
```

打开 <http://127.0.0.1:3000/> 和 <http://127.0.0.1:3000/account/>。不需要安装第三方 npm 依赖。公开跨设备使用需要同一 HTTPS 地址和持久数据库；本仓库代码尚未部署线上账号服务。部署见 [BACKEND_SYNC_REVIEW.md](BACKEND_SYNC_REVIEW.md)。

## 主要位置

| 位置 | 内容 |
| --- | --- |
| `assets/challenge-bank.js`、`diagnostics/` | 8 科中高难度诊断题与入口 |
| `assets/foundation-engine.js`、`assets/foundation-app.js` | 共用检查、历史保存与报告流程；新题使用独立记录空间 |
| `assets/project-bank.js` | 16 个原创多步骤情境项目 |
| `assets/project-tools.js` | 有界多项式检查与几何构造工具 |
| `projects/` | 独立项目入口与保存 |
| `review/project-math-audit.json` | 从情境数据独立推导的答案参照 |
| `review/project-graphics.svg` | 给定图与独立审核的几何构造 |
| `PROJECTS_REVIEW.md` | 逐项目审核、解释标准和验证范围 |
| `review/challenge-math-audit.json` | 全 40 题独立复算的答案参照 |
| `scripts/audit-challenges.py` | 不读取题库答案的精确分数、消元、积分与统计验证 |
| `review/challenge-graphics.svg` | 新图在 320px 和 520px 宽度下的审核页 |
| `courses/`、`modules/aa01`、`ab01`、`ad01`、`ae01`、`af01` | 当前数学教学与视觉活动 |
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
