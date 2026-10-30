# 首頁學習需求與回饋入口

2026-10-08。基於已合併的活動資源修復 PR #18。本次分支先供使用者查看實際截圖，再決定合併。

## 修改後的行為

- 頁頭顯示 `Mathematics & Science`，下一行說明 `Online learning · Foundation checks · Reports`。窄螢幕改為自然換行，保留完整文案。
- 學習需求下增加 `Use my request as a criterion in my final report`。預設不勾選，舊需求也不自動開啟。換學科保留輸入原文，但需要重新勾選，避免把另一科的請求帶入報告。
- 勾選後的非空原文隨該學科的新報告版本儲存為 `learningRequest`，包含學科和捕獲時間。報告頁面、歷史報告、JSON、Markdown、獨立完整 PDF、可用的學生摘要 PDF 和圖包均讀取同一份儲存的上下文。修改首頁請求、取消勾選或重新開啟舊報告不改寫舊版本。
- 報告的 `Your learning focus` 請教師或導師對照原文與實際答題證據說明：哪些需求已檢查、相關證據是什麼、哪些內容仍未覆蓋。它是討論進展和選擇下一步的參考條件，不改變固定答案檢查，也不宣稱已實現自由文字的自動語義評估。
- 頁底加入回饋板塊，按鈕開啟 `mailto:hello@quidence.com?subject=Quidence%20website%20feedback`。不自動傳送郵件或附加學生記錄；郵箱收信配置不屬於此次前端改動。
- 新增及修改的首頁、共用報告和課程資源使用內容指紋。Algebra 原活動保留公開版本 `v=0.6`，同時加內容指紋。首頁生成腳本可以重複執行，不會刪除回饋板塊或重複插入腳本。

## 驗證

- 自動套件共 216 個計數測試通過，另有 Algebra 的應用回呼和數學檢查通過。
- 需求預設關閉、舊格式遷移、學科隔離、空文字、不合法/不可讀存檔、原文空白、歷史不改寫、匯出和 HTML 轉義均有迴歸覆蓋。Algebra、矩陣、Calculus、共用數學/Physics 學習頁的實際匯出回呼已核對。
- 真實 Chromium 在 1440、768、375、320px 檢查首頁版面和互動。桌面及手機各完成一個診斷和一個專題：需求儲存、完整 JSON、獨立完整 PDF、摘要 PDF、首頁需求修改後重新開啟原報告，以及歷史報告查看均通過。
- 保留原有 80 組活動版面、40 組草稿/跨學科/重新整理流程及真實舊快取升級迴歸。瀏覽器執行沒有頁面異常或失敗請求。
- 靜態發布建置 128 個檔案，連結檢查通過；內部審核文件、截圖和測試不進入公開包。資源版本檢查及 `git diff --check` 通過。
- 來源清單因 Algebra 應用檔案雜湊更新而重新生成：38 條全檔案雜湊變化，題目定義指紋變化為 0；不增加任何來源或數學認證結論。

真實 macOS 列印對話框、Safari / Firefox、郵件應用和正式網域發布仍以實際使用驗收為準。

## 實際截圖

- [桌面首頁](review/home-report-goals-20261008/home-1440.png)
- [手機頁頭](review/home-report-goals-20261008/home-375.png)
- [桌面需求選項](review/home-report-goals-20261008/learning-request-1440.png)
- [手機需求選項](review/home-report-goals-20261008/learning-request-375.png)
- [桌面回饋板塊](review/home-report-goals-20261008/feedback-1440.png)
- [手機回饋板塊](review/home-report-goals-20261008/feedback-375.png)
- [桌面報告學習需求](review/home-report-goals-20261008/report-focus-1440.png)
- [手機報告學習需求](review/home-report-goals-20261008/report-focus-375.png)
