# Quidence 基礎 SEO 配置

本輪以 `https://www.quidence.com` 為正式主站，保留現有課程路徑、語言選擇和本機學生記錄。沒有替你部署、提交 Google 索引或修改 Cloudflare DNS。

## 已完成的程式碼配置

- `robots.txt` 允許抓取公開頁面及其 CSS/JS，列出 sitemap，禁止抓取 `/api/`。報告工作區保持可抓取，讓搜尋引擎看到 `noindex`。
- `sitemap.xml` 列出首頁、11 門課程、資料使用說明的英文和西語版本，共 26 個規範網址。不收錄帳戶、個人記錄、報告工作區、內部模組工具頁、歷史物理入口或未發布預覽。
- 語言版本沿用 `?lang=en` 和 `?lang=es`。這兩個網址可直接選擇語言，不依賴上次的語言偏好。`hreflang` 的 `en`、`es`、`es-MX` 互相對應；兩個西語標記指向同一份拉美西語內容。
- 規範網址保留活動的 `module` 參數及語言，去除版本號、追蹤參數和 hash。不會把所有學科的測試頁歸到同一個無課程參數的網址。
- 標題、描述和分享資訊區分課程及語言。帳戶、記錄和報告頁在原始 HTML 中即含 `noindex`，靜態部署包也包含相應 `X-Robots-Tag` 規則。
- 不增加第三方追蹤腳本，不讀取學生答案，不修改 localStorage，也不自動跳轉到另一網域。

## 當前階段的限制

現有靜態託管通過 JavaScript 翻譯同一份 HTML，因此 canonical 與 hreflang 在渲染後生成，原始 HTML 不硬編碼一個隨後被西語覆蓋的英文 canonical。Google 支援 JavaScript 生成這些資訊，但實際效果須在 Search Console 的 URL Inspection 中檢查“渲染後的 HTML”。未來可在課程介紹完成後生成獨立英文／西語靜態頁面，讓資訊直接出現在初始響應裡；本輪不遷移網址或學生記錄。

Google 可以選擇不同的 canonical；canonical 和 sitemap 都不保證收錄或排名。`noindex` 不是隱私造訪控制。當前學生答案只存在各自瀏覽器中，本輪也不會把它們發布到任何公開網址。

## 本機維護與部署

修改 SEO 配置或重新生成首頁／課程頁後，按順序執行：

```bash
npm run build:seo
npm run version:activities
npm run build:seo
npm run test:seo
npm test
npm run build:static
```

第二次 `build:seo` 是冪等整理檢查；建置腳本會拒絕遺漏或過期的 SEO 檔案。`static-release/` 必須是新的空輸出位置，只將其中的檔案部署到現有 Cloudflare Worker。ZIP 根目錄應直接包含 `index.html`、`robots.txt`、`sitemap.xml`、`assets/` 等。

`_headers` 的效果取決於託管配置，應上線後檢查實際響應；報告頁另有 HTML `noindex`，不完全依賴響應頭。

## Google Search Console：需要你完成的帳號步驟

1. 開啟 https://search.google.com/search-console ，使用你自己的 Google 帳號。
2. Add property 選擇 **Domain**，填 `quidence.com`，不填協議或 `www`。若已有這個 Domain property，直接使用它。
3. 複製 Google 實際給出的 TXT 值，不使用示例或佔位驗證碼。
4. 在 Cloudflare 中開啟 `quidence.com` → DNS → Records → Add record。Type 選 `TXT`，Name 填 `@`，Content 粘貼完整的 `google-site-verification=...`，TTL 使用 Auto。保留所有原有 DNS、郵件和網站記錄。
5. 返回 Search Console 點選 Verify，成功後保留這個 TXT 記錄。
6. 部署本輪網站包並確認主站恢復正常開放後，在 Sitemaps 提交 `https://www.quidence.com/sitemap.xml`。只提交正式公開內容，暫時關閉的課程先從配置中移除或延後提交。
7. 用 URL Inspection 檢查首頁、微積分和數論的英／西語網址，例如 `https://www.quidence.com/courses/number-theory/?lang=es`。執行 Test live URL，檢查頁面可造訪、渲染後正文是西語、canonical 指向同一西語網址，且正常課程沒有 `noindex`。
8. 對照檢查 `/reports/` 應當不參與收錄。公開課程確認正常後才請求索引。

主網域的 Cloudflare 跳轉繼續使用現有規則，另行確認裸網域跳向 `www.quidence.com` 時保留原路徑和 query。不要把 `.org` 或 `.app` 加上永久跳轉，本輪沒有改變它們的用途。

## 後續觀察

記錄正式部署日期。每隔幾週查看 Page indexing、Performance 中的展示、點選和搜尋詞，分別查看英文／西語網址。早期展示少不能直接說明配置失效；先確認抓取、渲染和收錄狀態，再改善課程介紹與原創講解。

## 官方依據

- [Google：canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google：JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google：雙語版本與 hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google：noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Search Console：網域驗證](https://support.google.com/webmasters/answer/9008080)
