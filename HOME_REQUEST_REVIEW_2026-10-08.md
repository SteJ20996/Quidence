# 主页学习需求与反馈入口

2026-10-08。基于已合并的活动资源修复 PR #18。本次分支先供用户查看实际截图，再决定合并。

## 修改后的行为

- 页头显示 `Mathematics & Science`，下一行说明 `Online learning · Foundation checks · Reports`。窄屏改为自然换行，保留完整文案。
- 学习需求下增加 `Use my request as a criterion in my final report`。默认不勾选，旧需求也不自动开启。换学科保留输入原文，但需要重新勾选，避免把另一科的请求带入报告。
- 勾选后的非空原文随该学科的新报告版本保存为 `learningRequest`，包含学科和捕获时间。报告页面、历史报告、JSON、Markdown、独立完整 PDF、可用的学生摘要 PDF 和图包均读取同一份保存的上下文。修改主页请求、取消勾选或重新打开旧报告不改写旧版本。
- 报告的 `Your learning focus` 请教师或导师对照原文与实际答题证据说明：哪些需求已检查、相关证据是什么、哪些内容仍未覆盖。它是讨论进展和选择下一步的参考条件，不改变固定答案检查，也不宣称已实现自由文本的自动语义评估。
- 页底加入反馈板块，按钮打开 `mailto:hello@quidence.com?subject=Quidence%20website%20feedback`。不自动发送邮件或附加学生记录；邮箱收信配置不属于此次前端改动。
- 新增及修改的主页、共用报告和课程资源使用内容指纹。Algebra 原活动保留公开版本 `v=0.6`，同时加内容指纹。主页生成脚本可以重复运行，不会删除反馈板块或重复插入脚本。

## 验证

- 自动套件共 216 个计数测试通过，另有 Algebra 的应用回调和数学检查通过。
- 需求默认关闭、旧格式迁移、学科隔离、空文本、不合法/不可读存档、原文空白、历史不改写、导出和 HTML 转义均有回归覆盖。Algebra、矩阵、Calculus、共用数学/Physics 学习页的实际导出回调已核对。
- 真实 Chromium 在 1440、768、375、320px 检查主页布局和交互。桌面及手机各完成一个诊断和一个项目：需求保存、完整 JSON、独立完整 PDF、摘要 PDF、主页需求修改后重新打开原报告，以及历史报告查看均通过。
- 保留原有 80 组活动布局、40 组草稿/跨学科/刷新流程及真实旧缓存升级回归。浏览器运行没有页面异常或失败请求。
- 静态发布构建 128 个文件，链接检查通过；内部审核文档、截图和测试不进入公开包。资源版本检查及 `git diff --check` 通过。
- 来源清单因 Algebra 应用文件哈希更新而重新生成：38 条全文件哈希变化，题目定义指纹变化为 0；不增加任何来源或数学认证结论。

真实 macOS 打印对话框、Safari / Firefox、邮件应用和正式域名发布仍以实际使用验收为准。

## 实际截图

- [桌面主页](review/home-report-goals-20261008/home-1440.png)
- [手机页头](review/home-report-goals-20261008/home-375.png)
- [桌面需求选项](review/home-report-goals-20261008/learning-request-1440.png)
- [手机需求选项](review/home-report-goals-20261008/learning-request-375.png)
- [桌面反馈板块](review/home-report-goals-20261008/feedback-1440.png)
- [手机反馈板块](review/home-report-goals-20261008/feedback-375.png)
- [桌面报告学习需求](review/home-report-goals-20261008/report-focus-1440.png)
- [手机报告学习需求](review/home-report-goals-20261008/report-focus-375.png)
