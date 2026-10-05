# Cluevera — AA01 / AB01 / AC01 / AD01 Subject Hub

这是一个私有开发仓库。首页提供四个入口：中学数学（AA01 / Cluevera Beta 0.5）、线性代数（AB01 Beta 0.2）、博弈论入门（AC01 Beta 0.1）和可视化微积分（AD01 Beta 0.1）。学生选择后进入对应模块，不需要先创建账号。

## 当前内容

| 位置 | 内容 |
| --- | --- |
| `index.html`、`assets/` | 学科选择首页、解释型基础检查、报告保存和公共导航 |
| `foundations/`、`reports/` | 四个模块各 15 题的独立基础检查；共同保存的报告 |
| `tests/` | 60 道新题的数学、解释门槛、答题流程和记录检查 |
| `modules/aa01/dist/` | Cluevera Beta 0.5：当前 Pre-Algebra / Algebra I 活动、几何模型、综合项目及报告 |
| `modules/aa01/tests/` | AA01 的九个回归检查文件及历史答案 fixture |
| `modules/ab01/dist/` | AB01 矩阵学习、向量诊断、Matrix Lab 及 Beta 0.1 静态存档 |
| `modules/ab01/tests/` | AB01 的九个数学和交互检查文件 |
| `modules/ac01/dist/` | AC01：收益表、最佳回应、囚徒困境、纳什均衡四节入门课，采用先判断、教学、新题、反馈的流程 |
| `modules/ac01/tests/` | AC01 数学、答案历史及交互状态检查 |
| `modules/ad01/dist/` | AD01：极限、导数、积分和微积分基本定理四节课，包含可播放、暂停与重播的图像、手动控件与新题 |
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

运行命令时必须在项目根目录。现在从整个项目根目录提供网页，首页才会显示四个入口；旧命令的 `--directory modules/ab01/dist` 只打开 AB01。

Terminal 需保持运行。关闭服务时按 **Control+C**。如果之前的服务还在运行，先在那个 Terminal 窗口按 Control+C，再启动新命令。Windows 安装了 Python Launcher 时，命令开头可改为 `py -3`。

## 记录与返回入口

- AA01 当前作答仍在原标签页内存中；刷新会重置活动。打开报告时另存浏览器副本；导出/打印可以跨设备保留。
- AB01 保留原来的浏览器本地存储方式；没有新增云端账号、跨设备同步或统一学生档案。
- AC01 使用独立的浏览器本地记录。每课包含一次初始判断、四个教学步骤、两道新题与反馈；四课完成后可导出答案历史和 Markdown 报告。初始判断与学完后的作答分开呈现。
- AD01 使用独立的浏览器本地记录，保存预测、新题、答案历史与图像设置。四课完成后可导出 JSON 和 Markdown 总结。
- 四个模块顶部的 **Choose a subject** 在新标签页打开选择首页，让原来的活动页面保持打开。它不会把 AA01 内存中的作答变成永久记录。
- 原课程评分和会话仍各自独立。新增 Saved reports 保存四个模块打开的报告副本与版本。
- 每个学科有独立的 15 题基础检查，必须解释。草稿、提交历史和本地人工解释审核按学科/检查分别保存；新检查不覆盖旧检查。数字/选择判断与解释审核分开。
- 保存是当前浏览器本地功能，没有云端档案或自动跨设备同步。浏览器清理或存储不可用会影响保存；下载报告后可交给另一 AI 导师。
- 基础覆盖、解释要求与剩余缺口见 [FOUNDATION_AUDIT.md](FOUNDATION_AUDIT.md)；完整新题审核清单见 [FOUNDATION_ITEM_REVIEW.md](FOUNDATION_ITEM_REVIEW.md)。完成题目能支持多强的漏洞判断、现有项目的依赖与后续补强见 [DIAGNOSTIC_COVERAGE_REVIEW.md](DIAGNOSTIC_COVERAGE_REVIEW.md)。

## 运行检查

安装了 Node.js 时，在仓库根目录运行：

```sh
node scripts/test-all.cjs
```

也可分别运行 `node scripts/test-aa01.cjs`、`node scripts/test-ab01.cjs`、`node scripts/test-ac01.cjs` 、`node scripts/test-ad01.cjs` 和 `node scripts/test-foundations.cjs`。脚本会使用各模块需要的路径。模块检查覆盖数学、DOM fixtures 和交互状态，不能证明教学效果或诊断有效性。

## 开发约定

- 保留 `main` 的可运行版本；后续修改可放到独立分支。
- AA01 模块遵循 `modules/aa01/AGENTS.md`，学生界面使用英文。
- 原题来源和解释评分的限制见各模块说明；未导入混合来源的手写 PDF 题库。
- 真实学生导出记录、密码和 API 密钥放在代码仓库之外。
- Private 控制源码访问；网站托管和网页访问权限需要单独配置。

## 源码来源与发布状态

模块版本和原始提交记录在 `SOURCE_SNAPSHOT.json`。AA01 使用当前主版本 Cluevera Beta 0.5，不使用已存档的 Beta_Style02。原平台 Git 历史继续保留；本仓库保存独立开发快照，不包含原平台的部署配置。

这次整合只更新 GitHub 仓库。AC01 和 AD01 已接入本仓库的 Dashboard；原来的在线网站、访问权限和域名均未调整。GitHub Pages 尚未启用。

AD01 的 19 项数学与交互状态检查已通过，包含四课动画、暂停与重播检查。SVG 已进行渲染检查；当前环境缺少 Chromium，真实浏览器视觉验收尚未完成。可选浏览器检查的运行说明见 `modules/ad01/README.md`。
