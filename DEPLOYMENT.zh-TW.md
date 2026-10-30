# Quidence：GitHub 自動部署到現有 Cloudflare Worker

正式網站目前使用 Cloudflare Worker `shy-thunder-f1c9`，已有 `www.quidence.com` 綁定。連接現有 Worker 與 `SteJ20996/AA01` 後，Cloudflare 會在 `main` 更新時拉取原始碼、檢查、建置和部署。無需為這次連接新建 Worker 或重新綁定網域。

## 儲存庫設定

- `wrangler.jsonc` 使用現有 Worker 名稱，只上傳 `static-release/` 中的靜態網站。
- `.node-version` 固定 Node.js `24.19.0`，與 `package.json` 和 GitHub Actions 一致。
- 網域及路由繼續在 Cloudflare 控制台管理；設定不含 `route` 或 `routes`，並設定 `workers_dev: false`。正式網域和根網域重新導向不由這份設定修改。
- `keep_vars: true` 保留現有控制台變數；本次靜態發布無需新增應用變數、資料庫或後端入口。

2026-10-12：GitHub 部署設定已合併到 `main`，Cloudflare 控制台已連接儲存庫 `SteJ20996/AA01`，生產分支為 `main`。首次建置與正式網域發布仍待確認；以 Cloudflare 建置日誌和實際部署結果為準。

## 連接現有 Worker

1. 先將這份部署設定合併到 `SteJ20996/AA01` 的 `main`。
2. 在 Cloudflare 開啟 **Workers & Pages → shy-thunder-f1c9 → Settings → Builds → Connect**。
3. 選擇 GitHub 帳戶 `SteJ20996` 與儲存庫 `AA01`。如儲存庫不可見，在 Cloudflare 的 GitHub App 授權中加入 `AA01`；保留 `Qidolab` 的已有授權。
4. 使用以下設定：

| 設定 | 值 |
| --- | --- |
| Worker / Project name | `shy-thunder-f1c9` |
| Git repository | `SteJ20996/AA01` |
| Production branch | `main` |
| Root directory / Advanced Path | `/`，儲存庫根目錄 |
| Build command | `npm test && npm run build:static` |
| Deploy command | `npx wrangler deploy` |
| Preview command（啟用預覽時） | `npx wrangler preview` |
| 靜態檔案目錄 | 已在 `wrangler.jsonc` 中設定為 `./static-release` |
| Node.js | `.node-version` 已設定為 `24.19.0` |

5. 部署 API token 使用控制台為此 Worker 建立或選擇的 token，不要寫入 GitHub 檔案。若已有 `NODE_VERSION` 建置變數，改為 `24.19.0`，避免覆蓋儲存庫版本檔案。
6. 儲存連接並啟動首次建置。檢查日誌中 `npm test` 通過、靜態包建置成功，最後部署到 `shy-thunder-f1c9`。
7. 開啟 `https://www.quidence.com/`，確認霧紫底色、Qidolab logo 與水壺圖案、左側跳轉入口，以及英語/西班牙語課程頁面。確認 `https://quidence.com/` 仍按原規則重新導向到主網域。

Worker 名稱必須與設定的 `name` 完全一致。不要把 Project name 改為 `quidence`，否則會指向另一個 Worker。

## 後續更新

修改通過 PR 審核並合併到 `main` 後，Cloudflare 自動發布。Cloudflare 的建置指令獨立執行 Node 檢查；GitHub Actions 另外執行完整 Chromium 迴歸。Cloudflare 不會自動等待所有 GitHub Actions 檢查，所以應先等 PR 檢查通過再合併。

Qidolab 可以直接發布儲存庫根目錄；Quidence 的儲存庫還含開發、審閱和後端檔案，因此始終只發布建置腳本生成的 `static-release/`。不要將 `assets.directory` 改為 `.` 或 `./dist`，也不要將 `npm start` 用作部署指令。

建置腳本要求目標輸出目錄不存在。Cloudflare 應使用乾淨 checkout；若重新執行時提示輸出目錄已存在，先清除該次建置工作區中的生成目錄或重新開始乾淨建置，不要向舊目錄追加檔案。

## 官方文件

- [Workers Builds：連接現有 Worker 與名稱要求](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers Builds 建置映像及 Node 版本覆蓋](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [靜態檔案目錄設定](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Wrangler：保留控制台變數及路由管理](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [靜態回應的 _headers 支援](https://developers.cloudflare.com/workers/static-assets/headers/)
