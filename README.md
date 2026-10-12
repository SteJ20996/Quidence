## 2026-10-12 · 薄雾紫 × 深青绿与 Qidolab 入口

- 用户已审核的新配色覆盖主页、课程、检查、项目和报告；阅读卡片保持明亮，图表及正误反馈继续保留原有语义。
- 底部使用正式 Qidolab Logo 和水壶小游戏配图，整块可进入 Qidolab；左侧新增通往该区域的浮动卡片，手机端使用紧凑入口。
- 生成模板、英／西语来源和资源版本同步更新。题库、评分、原始作答及历史保存不变；检查范围见 [本轮整合记录](review/mist-teal-qidolab-20261012.md)。GitHub 合并与正式域名部署分别处理。

## 2026-10-10 · Number Theory 与知识地图发布

- 新增数论：10 个项目、43 个步骤、120 个答题字段及完整证明；首页、学科卡片和知识地图均可进入。现有十门课与历史记录保持兼容。
- 数论题目、完整证明、选项、互动模型与导出均提供英/西双语；西语按墨西哥常用拉美用词复核。证明回答仅保存待审，不自动判成正确。
- 修复数论的跨标签页保存冲突保护；加入设备备份。移除地图中含义不明的大圆，并保持既定地图比例。
- 发布范围与验证：[数论发布记录](review/number-theory-release-20261010.md)。

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

当前主页共 52 道检查题、204 个独立检查的答案分量。主页每科均提供 **Test your understanding**，可以直接测试。物理两课另有 6/7 个学习单元，包含 18/21 个学习题和 24/28 个活动。原四单元 Physics 与历史题库保留读取历史记录，不混入新课报告。

当前共 20 个 California-inspired field projects，10 科各两个；包含 64 个阶段、162 个数值输入、6 个模型公式、2 个几何构造和 51 个开放回应。项目不是选择题。主页 **Explore two field projects** 可直接进入。内部挑战目标尚未由学生试做校准，不公开数值难度。

几何可轻点放点、输入分数坐标、用按钮连线及撤销；答案和图形一起保存。等价多项式用系数核验，解释不按关键词、语法或长度自动判分。每小问有理解要点及可记录的本地复核；未审核的理解保留待复核。见 [PROJECTS_REVIEW.md](PROJECTS_REVIEW.md)。


## 题目和反馈

- 新题要求组合概念、处理限制或特殊情况、构建模型，并解释或核验结果。线代重点包括参数系统、秩与零空间、复合顺序、换基、投影、最小二乘、特征向量、面积变化和子空间。
- 题目注明前置知识。**Not studied** 与 **Not sure** 分开记录；前者是学习准备情况，不记成客观错误。
- 物理两课接受精确值、分数，或正确舍入到至少三位有效数字的最终结果（例如 `4.83e14`）；数学题保留至少两位小数及两位有效数字的规则。与字段一致的单位可选，不自动转换 `kPa`、`kJ` 等前缀。旧提交的题目和判定保留，受精度规则影响的差异提示复核。
- 数值和选择题按分量检查。报告列出需要复查的知识点；下游结果如果可能沿用上游错值，会明确注明，避免把连带错误算成多个独立薄弱点。
- 原始解释、未提交草稿、提交历史和本地人工解释审核保留。匹配数值不等于解释通过，也不自动等于学科掌握程度。
- 每科题集是独立抽样，并非完整课程或经过学生数据标定的诊断量表。难度标记是设计目标；详见 [MATH_DIAGNOSTICS_REVIEW.md](MATH_DIAGNOSTICS_REVIEW.md)。

## 本地启动与访问教程（无需账户登录）

这里的“本地登录”指在自己的电脑上启动 Quidence，再用浏览器打开。当前无需注册、用户名或密码；账户和云同步仍暂停。默认服务器不打开学生数据库，学习记录保存在浏览器里。

### 1. 安装 Node.js

从 [Node.js 官方下载页](https://nodejs.org/en/download)选择 **24.x LTS**，版本至少为 **24.19.0**，低于 25；这与 `package.json` 的要求一致。也可在[官方 24.x 版本列表](https://nodejs.org/en/download/archive/v24)选择相应安装包。CI 使用 24.19.0。

- macOS：选 macOS 安装包；Apple Silicon 机器选兼容 arm64 的版本，Intel 机器选 x64。
- Windows：选 Windows 安装包，按自己电脑的架构选择。安装包包含 npm。

安装后重新打开 **Terminal**（macOS）或 **Windows Terminal / PowerShell**（Windows），分别检查：

```sh
node -v
npm -v
```

`node -v` 应显示 `v24.19.0` 或更新的 `v24.x`。本项目无需安装第三方 npm 依赖，可以直接启动。

### 2. 获取最新版程序并进入文件夹

打开 [GitHub 仓库](https://github.com/SteJ20996/AA01)，确认分支为 **main**，点击 **Code → Download ZIP** 并解压。不要在 ZIP 内直接操作。解压后找到包含 `package.json`、`README.md`、`assets/` 和 `backend/` 的文件夹。

如果解压在 Downloads，文件夹名为 `AA01-main`，使用以下命令；如果放在其他位置，请替换成实际路径。

macOS Terminal：

```sh
cd ~/Downloads/AA01-main
```

Windows PowerShell：

```powershell
cd "$env:USERPROFILE\Downloads\AA01-main"
```

已经用 Git 克隆过的读者，可以在自己的仓库文件夹内确认分支为 main，再用 `git pull --ff-only` 更新。若有本地修改或更新失败，先保留自己的修改，不要用强制重置代替更新。

### 3. 启动本地服务器

在上一步的程序根目录运行：

```sh
npm start
```

看到 `Quidence server listening on port 3000` 后，保持这个终端窗口运行。浏览器打开下面的 HTTP 地址；默认只供本机访问，无需绑定正式域名。

| 页面 | 本地地址 |
| --- | --- |
| 主页 | <http://127.0.0.1:3000/> |
| 线性代数诊断 | <http://127.0.0.1:3000/diagnostics/?module=ab01> |
| Physics 1 Foundations | <http://127.0.0.1:3000/courses/physics-1/> |
| Physics 2 Foundations | <http://127.0.0.1:3000/courses/physics-2/> |
| 已保存报告 | <http://127.0.0.1:3000/reports/> |
| 备份、恢复和删除记录 | <http://127.0.0.1:3000/records/> |

从主页选科目即可开始。不需要进入 `/account/`；该页面只说明账户暂停。不要双击 `index.html` 代替服务器，也不要把本地地址写成 `https://127.0.0.1:3000/`。

### 4. 下次继续、备份和退出

下次先在同一程序目录运行 `npm start`，再用**同一个浏览器资料夹和同一个地址**打开网页。未提交草稿和已有报告会在浏览器允许保存时继续保留；留意页面上的保存失败提示。

`127.0.0.1:3000`、`localhost:3000`、其他端口和正式网站是不同的存储来源。换浏览器、资料夹、设备或网址不会自动同步记录；无痕窗口和清除网站数据也可能删除记录。

需要备份时，在 `/records/` 点击 **Download local-record backup**，确认 JSON 文件已下载并私密保存。在另一浏览器或设备启动程序后，可用 **Restore a local-record backup** 手动恢复。已有不同记录时，恢复会停止，当前不会合并两份历史。

退出时，在运行服务器的终端按 **Control+C / Ctrl+C**。停止服务器不会主动删除浏览器记录。公用设备离开前，先按需备份，再在 `/records/` 点击 **Delete learning records from this browser** 并确认；另外清理下载文件、剪贴板副本和打开的报告页。本地记录没有账户密码保护，同一浏览器资料夹的使用者可能查看它们。

### 5. 常见问题

| 现象 | 处理方法 |
| --- | --- |
| `node` 或 `npm` 找不到 | 安装上述 Node.js 24.x，然后重新打开终端，检查 `node -v` 和 `npm -v` |
| `ENOENT`，找不到 `package.json` | 当前目录不对；进入解压后的程序根目录，再运行 `npm start` |
| `node:sqlite` 找不到或运行版本不符 | 核对 `node -v`，改用至少 24.19.0、低于 25 的 Node.js；无需另装 SQLite |
| PowerShell 提示 `npm.ps1` 无法执行 | 在同一目录改用 `npm.cmd start`，无需为此关闭系统的脚本执行限制 |
| `EADDRINUSE`，3000 端口已占用 | 先检查是否已经开过服务器，直接访问已有地址；要重启时先在原终端按 Ctrl+C。确需换端口时使用下方命令 |
| 网页无法连接 | 检查终端是否还在运行、是否显示报错，以及地址是否为 `http://127.0.0.1:3000/` |
| 换了地址后看不到记录 | 回到原来的浏览器资料夹和原地址；按需在那里导出备份，再到新地址手动恢复 |
| 更新后项目页还是旧样式，或页头与导航不一致 | 停止原服务器，完整更新同一个程序目录，再运行 `npm start` 并从主页重新进入。必要时用 Cmd+Shift+R（macOS）或 Ctrl+Shift+R（Windows）强制刷新；无需清除网站数据。入口和资源现在带内容版本，更新 URL 不会更换记录来源 |

临时改用 3001 端口，macOS Terminal：

```sh
PORT=3001 npm start
```

Windows PowerShell：

```powershell
$env:PORT = '3001'
npm.cmd start
```

此时打开 <http://127.0.0.1:3001/>。换端口不会搬移原来 3000 端口的浏览器记录。Windows 的设置会留在当前 PowerShell 会话中，改回 3000 前运行 `Remove-Item Env:PORT`，或关闭该终端后重新打开。

## 发布与开发检查

静态托管前运行 `npm run build:static`，只发布生成的 `static-release/`，不要发布整个仓库。脚本要求输出目录不存在，避免旧文件混入新包。生成的 `_headers` 适用于 Cloudflare Pages 和 Workers 静态响应；其他托管方须等效配置安全响应头。这个命令只准备文件，不部署网站，不表示来源审核已经通过。详见 [OVERALL_REVIEW_2026-10-07.md](OVERALL_REVIEW_2026-10-07.md)。现有 Worker `shy-thunder-f1c9` 的 GitHub 自动部署配置和连接步骤见 [Cloudflare 部署说明](DEPLOYMENT.zh-CN.md)。

`npm test` 检查记录保护、题目数学、DOM 流程、活动资源版本和来源清单；GitHub Actions 自动执行这些检查、发布包构建及 Chromium 活动页检查。macOS/iPad、Safari、Firefox 和打印交互仍需实测。账户相关代码仅供开发测试，不能据此重开公测账户。

修改活动页、共用资源或重新生成主页/课程页后，先运行 `npm run version:activities`，并提交更新的 HTML。该脚本按实际文件内容更新基础检查、检查、项目页的 CSS/JS URL，以及主页和课程页的活动入口；不修改题目或学生记录。

浏览器检查仅需开发依赖，日常 `npm start` 仍可直接运行：

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

此检查在隔离浏览器中运行，覆盖十科项目/检查页的四种屏幕宽度、草稿刷新与切科目、新标签页及旧 HTTP 缓存升级，不读取个人浏览器记录。Linux 缺少系统依赖时使用 `npx playwright install --with-deps chromium`。

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

## 基础 SEO 与 Search Console

配置、维护顺序和 Cloudflare DNS 验证步骤见 [SEO_SETUP.md](SEO_SETUP.md)。更改页面或 SEO 后运行 `npm run build:seo`、`npm run version:activities`、`npm run build:seo`，再检查和构建。只发布 `static-release/`；不要发布源码、学生记录或未完成预览。
