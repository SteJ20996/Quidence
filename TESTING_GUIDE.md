# 当前版本怎么审核

使用 Node.js 24.19 运行 `npm start`，打开 `http://127.0.0.1:3000/`。公测只提供本地记录，账户及跨设备同步关闭。后端保留明确启用账户时的内部回归测试，不把通过这些测试说成公开功能。显示品牌是 Quidence；旧存储键与题库版本保持兼容。

## 首页与题量

当前保留八门数学课：Pre-Algebra、Algebra I、Geometry、Algebra II、Pre-calculus、Calculus、Linear Algebra、Statistics；Science 另加 Physics 入门课。经济学与博弈论不在当前课程入口中。首页依次提供选择科目、可选学习需求和直接做题；没有重复的 Find a starting point 或旧的年龄/方向筛选。

八科共 40 道中等及较难诊断题：线性代数 12 道，其他科目各 4 道；另有每科 2 个分步项目，共 16 个。项目难度 6.5/10 是设计目标，尚未用学生数据校准。基础检查是独立的一组，不要把全部入口当成一次考试。

Physics 有四个单元、16 个递进探索活动、12 个学习题，另有六道检查及两道项目；不把接受过教学的学习题结果当成独立诊断证据。课程范围见物理设计稿。

第二轮回归特别检查：`1/27` 填 `0.035` 或 `0.04` 应不匹配，`0.037` 正确舍入可匹配；`0.0049` 填 `0.00` 应不匹配。科学记数法与题目指定单位可输入，错误单位不能静默接受。旧结果保持原样并可标为精度待审。打开旧报告不产生新快照；实际提交/复核变化仍新增版本。Safari/Firefox 的真实容量与打印仍须单独实测。

| 操作 | 预期结果 |
| --- | --- |
| 点击页面左上角 Quidence | 返回主页；页面与下载文件使用新品牌、Q 图标 |
| 用改名前的草稿、解释、已提交历史与几何作图重新打开 | 原始输入恢复，旧提交和复核保持；不因改名要求清空记录 |
| 未提交时刷新，保存过解释后再修改、重新提交 | 保留草稿、原提交和对应复核；旧复核不自动沿用到新提交 |
| 只写错线性代数结果中的一个坐标 | 分量分别判断，其他正确分量保持正确 |
| 数字匹配，解释简短、用别的方法、中文或尚无法判断 | 保留原话；不靠长度或关键词认定完整理解。开放解释等待复核 |
| 写清不确定之处或选择尚未学过 | 单独记录，不能当成失败或已掌握 |
| 几何项目用画板放点、连接线段，保存后刷新 | 恢复点、线段、说明和历史；横纵坐标单位一致 |
| 打开报告，再点击报告页的 Print / save as PDF | 在独立页手动打印；原活动页没有自动弹出打印对话框 |
| Markdown 复制失败 | 显示可选中的文本，原答案保留；分享前可自行删去个人信息 |
| 两个浏览器配置文件登录同一账号，分别保存和同步 | 第二设备恢复已同步工作；不同修改产生冲突而不静默覆盖 |
| 导出未同步答案，再退出账号 | 当前浏览器清掉账号副本、冲突备份和同步基线；云端已同步数据保留 |
| 点击 Clear learning records from this device | 确认后同时清掉访客及账号学习记录；不删除在线账号 |
| 在一个标签页退出/换账号，再回旧课程标签页作答 | 旧页阻止写入另一账号并要求重新加载 |
| 网络断开时退出 | 本地账号副本清掉，并明确提示无法确认服务器退出 |
| 会话过期时仍有未同步答案 | 不静默删除；可以下载，再登录恢复同步 |

## macOS 打印复测

在曾卡死的 Mac 上分别测试完成 PDF 保存、取消打印、关闭报告页并返回课程。检查上下滚动与按钮，再刷新确认草稿和历史恢复。若仍卡住，记录 macOS、Safari/Chrome 版本及最后一次操作。自动检查没有复现或认证原生 macOS 打印。

## 解释与诊断表述

复核 0/1/2 只针对一次提交：0 表示理由未回应关键问题或需修改；1 表示部分连接仍不完整；2 表示支持了该题关键连接。无法判断保持 Open。应结合图、式子、日常语言和追问核对，不是整门学科的分数或全面数学语言认证。

反馈请保留科目、入口、题目 ID、完整原回答、实际结果、预期结果和操作顺序。`npm test` 覆盖数学、状态、DOM、旧数据兼容及真实 HTTP 账户测试；仍需教师审核、学生试答与实际浏览器检查，才能评估覆盖范围、误判和教学效果。

## Claude follow-up checks

Run `node --test tests/csp.test.cjs tests/security.test.cjs tests/learning-handoff.test.cjs` for CSP headers, extracted startup scripts, manual standalone printing, concurrent classroom registration/login, trusted proxy rate buckets and corrupted homepage request protection. `node scripts/build-source-ledger.cjs --check` detects a stale source inventory; it is not an originality test. The server CSP must also be configured by any static hosting deployment. Check actual browser CSP violations and report-tab printing before deployment; no native macOS printing or browser enforcement certification is implied by Node fixtures.

## Local-only public testing

`node --test tests/local-records.test.cjs tests/explanation-policy.test.cjs` verifies the public default rejects account APIs, creates no student database, makes no sync requests, preserves existing local workspaces, exports/restores raw records, refuses overwrite, clears only reviewed learning keys, and blocks stale writes. Explanation tests keep keyword suggestions as audit candidates without automatic understanding credit. Older account/security tests explicitly enable the dormant backend to preserve regression coverage; their passing results are not a claim that public accounts are available. See `LOCAL_ONLY_REVIEW.md`.
