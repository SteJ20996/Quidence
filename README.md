# Cluevera — AA01 / AB01 / AC01 / AD01 / AE01 / AF01 Subject Hub

这是一个私有开发仓库。首页提供六个入口：中学数学（AA01 / Cluevera Beta 0.6）、线性代数（AB01 Beta 0.2）、博弈论入门（AC01 Beta 0.1）、可视化微积分（AD01 Beta 0.1）、统计学基础（AE01 Beta 0.1）和 Pre-calculus（AF01 Beta 0.1）。学生选择后进入对应模块，不需要先创建账号。

## 当前内容

| 位置 | 内容 |
| --- | --- |
| `index.html`、`assets/` | 学科选择首页、解释型基础检查、报告保存和公共导航 |
| `foundations/`、`reports/` | 六个模块各 15 题入口基础检查；原四模块另有 8/8/6/8 题进一步检查；共同保存的报告 |
| `tests/` | 120 道原创基础检查题的数学、解释门槛、分量判断、答题流程和记录检查 |
| `modules/aa01/dist/` | Cluevera Beta 0.6：当前 Pre-Algebra / Algebra I 活动、几何模型、综合项目、进度保存及报告 |
| `modules/aa01/tests/` | AA01 的回归检查文件、实际反馈案例及历史答案 fixture |
| `modules/ab01/dist/` | AB01 矩阵学习、向量诊断、Matrix Lab 及 Beta 0.1 静态存档 |
| `modules/ab01/tests/` | AB01 的九个数学和交互检查文件 |
| `modules/ac01/dist/` | AC01：收益表、最佳回应、囚徒困境、纳什均衡四节入门课，采用先判断、教学、新题、反馈的流程 |
| `modules/ac01/tests/` | AC01 数学、答案历史及交互状态检查 |
| `modules/ad01/dist/` | AD01：极限、导数、积分和微积分基本定理四节课，包含可播放、暂停与重播的图像、手动控件与新题 |
| `modules/ae01/dist/`、`modules/af01/dist/` | AE01 统计学与 AF01 Pre-calculus：各四课、12 次作答、互动演示、必填解释和报告 |
| `assets/course-*`、`assets/subject-foundations.js` | 两个新模块的共同课程流程、图像和新增 30 道入口基础题 |
| `tests/new-subjects.test.cjs` | 新课程数学、流程、动画、报告和旧档案迁移检查 |
| `modules/ad01/tests/` | AD01 数学、会话、图像操作和入口检查；含可选真实浏览器脚本 |

中学入口目前覆盖所列基础内容，并非全部中学课程。各模块保留原有课程、答题、提示、计时和会话逻辑；打开报告时新增共同保存副本。其他 AA 系列功能尚未整合。

## 在 Mac 上打开整个网站

1. 在 GitHub 点击绿色 **Code → Download ZIP**，解压最新下载包。
2. 打开 Terminal，输入 `cd` 和一个空格，把解压后的项目文件夹拖进 Terminal，再按 Return。
3. 确认该文件夹内有 `index.html`、`assets`、`modules` 和 `scripts`。
4. 运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory .
```

5. 在同一台电脑的浏览器打开 <http://127.0.0.1:8000/>。

运行命令时必须在项目根目录。现在从整个项目根目录提供网页，首页才会显示六个入口；旧命令的 `--directory modules/ab01/dist` 只打开 AB01。

Terminal 需保持运行。关闭服务时按 **Control+C**。如果之前的服务还在运行，先在那个 Terminal 窗口按 Control+C，再启动新命令。Windows 安装了 Python Launcher 时，命令开头可改为 `py -3`。

## 记录与返回入口

- AA01 自动在当前浏览器保存作答草稿、原始输入、提交历史、提示和报告状态；刷新可恢复，离开页面的时间不计入作答。存储不可用时会显示提示；损坏的记录不会被自动覆盖。
- AB01 保留原来的浏览器本地存储方式；没有新增云端账号、跨设备同步或统一学生档案。
- AC01 使用独立的浏览器本地记录。每课包含一次初始判断、四个教学步骤、两道新题与反馈；四课完成后可导出答案历史和 Markdown 报告。初始判断与学完后的作答分开呈现。
- AE01 / AF01 分别保存课程草稿、初始判断、学后作答、解释、求助记录与修改历史。每课有一次初始判断和两道新题；须填写理由后才能提交。每个学科另有独立 15 题基础检查。AF01 与 AD01 双向链接，课程记录仍各自独立。
- AD01 使用独立的浏览器本地记录，保存预测、新题、答案历史与图像设置。四课完成后可导出 JSON 和 Markdown 总结。
- 六个模块顶部的 **Choose a subject** 在新标签页打开选择首页，让原来的活动页面保持打开。
- 原课程评分和会话仍各自独立。新增 Saved reports 保存六个模块打开的报告副本与版本。
- 每个学科保留独立的 15 题入口检查，另有 Further foundations：AA01 8题、AB01 8题、AC01 6题、AD01 8题。全部必须解释。原题版本和旧会话保持兼容；两种检查分别保存草稿、提交历史、报告和本地人工解释审核。
- 报告显示各回答分量和多选题的正确/多选/漏选情况；解释保持未审核，直到明确保存本地人工审核。分量数不换算成能力分或加权总分。修改后，旧解释分不会沿用到新提交。
- 保存是当前浏览器本地功能，没有云端档案或自动跨设备同步。浏览器清理或存储不可用会影响保存；下载报告后可交给另一 AI 导师。
- 基础覆盖、解释要求与剩余缺口见 [FOUNDATION_AUDIT.md](FOUNDATION_AUDIT.md)；原60题见 [FOUNDATION_ITEM_REVIEW.md](FOUNDATION_ITEM_REVIEW.md)，新增30题见 [FOUNDATION_FOLLOWUP_REVIEW.md](FOUNDATION_FOLLOWUP_REVIEW.md)。漏洞判断与补强对应关系见 [DIAGNOSTIC_COVERAGE_REVIEW.md](DIAGNOSTIC_COVERAGE_REVIEW.md)。试答与评分检查步骤见 [TESTING_GUIDE.md](TESTING_GUIDE.md)。

## 运行检查

安装了 Node.js 时，在仓库根目录运行：

```sh
node scripts/test-all.cjs
```

也可分别运行 `node scripts/test-aa01.cjs`、`node scripts/test-ab01.cjs`、`node scripts/test-ac01.cjs` 、`node scripts/test-ad01.cjs` 、`node scripts/test-foundations.cjs` 和 `node scripts/test-new-subjects.cjs`。脚本会使用各模块需要的路径。模块检查覆盖数学、DOM fixtures 和交互状态，不能证明教学效果或诊断有效性。

## 开发约定

- 保留 `main` 的可运行版本；后续修改可放到独立分支。
- AA01 模块遵循 `modules/aa01/AGENTS.md`，学生界面使用英文。
- 原题来源和解释评分的限制见各模块说明；未导入混合来源的手写 PDF 题库。
- 真实学生导出记录、密码和 API 密钥放在代码仓库之外。
- Private 控制源码访问；网站托管和网页访问权限需要单独配置。

## 源码来源与发布状态

原始模块快照版本和提交记录在 `SOURCE_SNAPSHOT.json`；后续修改见 Git 历史与版本说明。AA01 当前为 Cluevera Beta 0.6，不使用已存档的 Beta_Style02。原平台 Git 历史继续保留；本仓库保存独立开发快照，不包含原平台的部署配置。

这次整合只更新 GitHub 仓库。AC01、AD01、AE01 和 AF01 已接入本仓库的 Dashboard；原来的在线网站、访问权限和域名均未调整。GitHub Pages 尚未启用。

AD01 的 19 项数学与交互状态检查已通过，包含四课动画、暂停与重播检查。SVG 已进行渲染检查；当前环境缺少 Chromium，真实浏览器视觉验收尚未完成。可选浏览器检查的运行说明见 `modules/ad01/README.md`。


## 统计学与 Pre-calculus 扩展（2026-10-05）

AE01 与 AF01 已放入六入口 Dashboard。Pre-calculus 使用独立入口，并与 Visual Calculus 双向衔接。每个新模块提供四节入门课与 15 题基础检查；不代表完整 AP Statistics、Pre-calculus 或大学课程。新增题覆盖和剩余缺口见 [SUBJECT_EXPANSION_REVIEW.md](SUBJECT_EXPANSION_REVIEW.md)。

旧四学科的本地基础检查档案会添加两个空学科容器；已保存答案、解释审核和报告保持原样。新模块暂不提供 Further foundations；原四模块的进一步检查继续可用。

新增和原有自动回归检查均已通过；新 SVG 已实际渲染并检查。当前环境没有 Chromium，尚未完成真实浏览器桌面/手机布局验收。

## 首页筛选

首页支持两个可组合的筛选条件：Learning stage（初中 / 高中 / 大学）与 Math area（基础数学 / 高等数学）。两者都提供 All，默认显示六个板块。分类反映当前内容的建议起点；学生始终可以选择 All 查看其他课程。

| 板块 | 建议学习阶段 | 数学方向 |
| --- | --- | --- |
| AA01 中学数学 | 初中、高中 | 基础数学 |
| AB01 线性代数 | 高中、大学 | 高等数学 |
| AC01 博弈论 | 高中、大学 | 高等数学 |
| AD01 Visual Calculus | 高中、大学 | 高等数学 |
| AE01 统计学基础 | 初中、高中、大学 | 基础数学 |
| AF01 Pre-calculus | 高中、大学 | 基础数学 |

两个条件取交集。没有匹配项时显示提示和重置入口。筛选保留在 URL 的 `stage` / `direction` 参数中，刷新或分享链接可恢复；没有新增年龄收集或学习等级推断。JavaScript 不可用时仍显示全部课程入口。

## 学生反馈修订（2026-10-05）

AA01 Beta 0.6 增加本地进度恢复，替换重复的 Q6、调整 P2/P3，并将额外检查总量限制为三题。P4 作为主流程中的学习经历检查，允许记录尚未学过二次函数。反馈接受等价计算和简洁的日常解释；无法确定的表述保留人工复核，具体算术错误单独指出。

报告先打开独立预览，由学生点击打印；AA01 使用紧凑的题目、作答、反馈排版。六个模块及基础检查提供 Markdown 复制和 AI 导师入口。首页新增左侧学科、右侧学习目标/作业输入，可附上该学科的已保存报告；内容由学生手动粘贴。

完整自动回归通过。macOS 导出 PDF 后卡死尚未在此环境复现，原生打印仍需在受影响的 Mac 上复测。具体行为与检查范围见 [FEEDBACK_REVIEW_2026-10-05.md](FEEDBACK_REVIEW_2026-10-05.md)。
