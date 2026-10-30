# 目前版本怎麼審核

使用 Node.js 24.19 執行 `npm start`，開啟 `http://127.0.0.1:3000/`。公測只提供本機紀錄，帳戶及跨裝置同步關閉。後端保留明確啟用帳戶時的內部迴歸測試，不把通過這些測試說成公開功能。顯示品牌是 Quidence；舊儲存鍵與題庫版本保持相容。

## 首頁與題量

目前保留八門數學課：Pre-Algebra、Algebra I、Geometry、Algebra II、Pre-calculus、Calculus、Linear Algebra、Statistics；Science 另加 Physics 入門課。經濟學與賽局理論不在目前課程入口中。首頁依次提供選擇科目、可選學習需求和直接做題；沒有重複的 Find a starting point 或舊的年齡/方向篩選。

八科共 40 道中等及較難診斷題：線性代數 12 道，其他科目各 4 道；另有每科 2 個分步專題，共 16 個。專題難度 6.5/10 是設計目標，尚未用學生資料校準。基礎檢查是獨立的一組，不要把全部入口當成一次考試。

Physics 有四個單元、16 個遞進探索活動、12 個學習題，另有六道檢查及兩道專題；不把接受過教學的學習題結果當成獨立診斷證據。課程範圍見物理設計稿。

第二輪迴歸特別檢查：`1/27` 填 `0.035` 或 `0.04` 應不相符，`0.037` 正確捨入可相符；`0.0049` 填 `0.00` 應不相符。科學記號與題目指定單位可輸入，錯誤單位不能靜默接受。舊結果保持原樣並可標為精度待審。開啟舊報告不產生新快照；實際提交/複核變化仍新增版本。Safari/Firefox 的真實容量與列印仍須單獨實測。

| 操作 | 預期結果 |
| --- | --- |
| 點選頁面左上角 Quidence | 返回首頁；頁面與下載檔案使用新品牌、Q 圖示 |
| 用改名前的草稿、解釋、已提交歷史與幾何作圖重新開啟 | 原始輸入恢復，舊提交和複核保持；不因改名要求清空紀錄 |
| 未提交時重新整理，儲存過解釋後再修改、重新提交 | 保留草稿、原提交和對應複核；舊複核不自動沿用到新提交 |
| 只寫錯線性代數結果中的一個座標 | 分量分別判斷，其他正確分量保持正確 |
| 數字相符，解釋簡短、用別的方法、中文或尚無法判斷 | 保留原話；不靠長度或關鍵字認定完整理解。開放解釋等待複核 |
| 寫清不確定之處或選擇尚未學過 | 單獨記錄，不能當成失敗或已掌握 |
| 幾何專題用畫板放點、連接線段，儲存後重新整理 | 恢復點、線段、說明和歷史；橫縱座標單位一致 |
| 開啟報告，再點選報告頁的 Print / save as PDF | 在獨立頁手動列印；原活動頁沒有自動彈出列印對話框 |
| Markdown 複製失敗 | 顯示可選取的文字，原答案保留；分享前可自行刪去個人資訊 |
| 兩個瀏覽器設定檔登入同一帳號，分別儲存和同步 | 第二裝置恢復已同步工作；不同修改產生衝突而不靜默覆蓋 |
| 匯出未同步答案，再登出帳號 | 目前瀏覽器清掉帳號副本、衝突備份和同步基線；雲端已同步資料保留 |
| 點選 Clear learning records from this device | 確認後同時清掉訪客及帳號學習紀錄；不刪除線上帳號 |
| 在一個分頁登出/換帳號，再回舊課程分頁作答 | 舊頁阻止寫入另一帳號並要求重新載入 |
| 網路斷線時登出 | 本機帳號副本清掉，並明確提示無法確認伺服器登出 |
| 工作階段過期時仍有未同步答案 | 不靜默刪除；可以下載，再登入恢復同步 |

## macOS 列印複測

在曾卡死的 Mac 上分別測試完成 PDF 儲存、取消列印、關閉報告頁並返回課程。檢查上下捲動與按鈕，再重新整理確認草稿和歷史恢復。若仍卡住，記錄 macOS、Safari/Chrome 版本及最後一次操作。自動檢查沒有重現或認證原生 macOS 列印。

## 解釋與診斷表述

複核 0/1/2 只針對一次提交：0 表示理由未回應關鍵問題或需修改；1 表示部分連結仍不完整；2 表示支持了該題關鍵連結。無法判斷保持 Open。應結合圖、式子、日常語言和追問核對，不是整門學科的分數或全面數學語言認證。

回饋請保留科目、入口、題目 ID、完整原回答、實際結果、預期結果和操作順序。`npm test` 涵蓋數學、狀態、DOM、舊資料相容及真實 HTTP 帳戶測試；仍需教師審核、學生試答與實際瀏覽器檢查，才能評估涵蓋範圍、誤判和教學效果。

## Claude follow-up checks

Run `node --test tests/csp.test.cjs tests/security.test.cjs tests/learning-handoff.test.cjs` for CSP headers, extracted startup scripts, manual standalone printing, concurrent classroom registration/login, trusted proxy rate buckets and corrupted homepage request protection. `node scripts/build-source-ledger.cjs --check` detects a stale source inventory; it is not an originality test. The server CSP must also be configured by any static hosting deployment. Check actual browser CSP violations and report-tab printing before deployment; no native macOS printing or browser enforcement certification is implied by Node fixtures.

## Local-only public testing

`node --test tests/local-records.test.cjs tests/explanation-policy.test.cjs` verifies the public default rejects account APIs, creates no student database, makes no sync requests, preserves existing local workspaces, exports/restores raw records, refuses overwrite, clears only reviewed learning keys, and blocks stale writes. Explanation tests keep keyword suggestions as audit candidates without automatic understanding credit. Older account/security tests explicitly enable the dormant backend to preserve regression coverage; their passing results are not a claim that public accounts are available. See `LOCAL_ONLY_REVIEW.md`.
