## 2026-10-30 · 基礎邏輯學：Intuition Lab 活動（第四部分，完成）

- Intuition Lab 新增第 15 個活動「Which cards would you turn over?」（你會翻哪幾張卡片？），有英文和西班牙文。
  - 題目：卡片一面是字母、一面是整數，規則是「如果一面是母音，另一面就是偶數」。桌上的卡片露出 E、K、4、7，要翻哪幾張才能知道規則有沒有被打破？
  - 多數人會選 E 和 4；正確答案是 E 和 7。學生先預測，再用滑桿逐張查看背面可能是什麼、哪一種會打破規則，最後用第二課「條件句只在 P 真 Q 假時為假」說明原因；選 4 其實是在檢查逆命題。
- 測試另外列舉每張卡片背面所有可能的字母與數字，確認模型的判斷、正確選項和延伸題答案（6 張卡片要翻 3 張）。
- 基礎邏輯學卡片現在和其他學科一樣齊全，「尚未提供」的提示已移除；四個部分都已完成。
- 見[發布紀錄](review/basic-logic-intuition-20261030.md)。

## 2026-10-30 · 基礎邏輯學：基礎檢查與理解檢查（第三部分）

- 基礎邏輯學新增 15 題基礎檢查（40 個答案部分）和 4 道理解檢查（16 個答案部分），都有英文和西班牙文。
  - 基礎檢查涵蓋課程預設學生已會的內容：數的性質、不等式、分類與計數、精確閱讀日常規則，以及課程用到的方程式、平方與分數。多數題目針對一個常見錯誤。
  - 理解檢查涵蓋：三個命題的真值表與括號、數的條件句與逆命題、判斷論證是否有效，以及「全部／沒有／有些」與三段論。
- 測試與 `audit-challenges.py` 另外重新計算每個答案（列舉真值、逐一測試整數、窮舉學生分組）；這是一致性檢查，尚未經過人工審核。
- 診斷題庫升為 `quidence-challenges-10`；舊紀錄（題庫 v6–v9、13 科的基礎檢查紀錄）都能照常開啟，內容不變。
- 發布前的內容審查確認所有答案正確；依審查把涉及負數的題目改用「integer」（美式英文的 whole number 不含負數），理解檢查的論證 A 改為分情況推理（原本和課堂最後一題重複），並補上課程會用到的「正方形與長方形」前提知識。
- 順帶修正所有科目共用的一句報告文字：答錯時的「Recheck 〈欄位〉.」在西班牙文介面從未翻譯，問句標籤還會出現「?.」。現在改為「Recheck: …」並翻成「Vuelve a comprobar: …」。
- 首頁卡片、課程頁頂端、知識地圖都能進入兩個檢查。卡片上「尚未提供」只剩 Intuition Lab 活動。
- 見[發布紀錄](review/basic-logic-checks-20261030.md)。

## 2026-10-30 · 基礎邏輯學：兩個實作專題（第二部分）

- 基礎邏輯學新增兩個實作專題，都有英文和西班牙文：
  - 「誰可以使用電動工具？」：用沙加緬度機器人社 40 名社員的紀錄，計算連接詞為真的人數、檢驗條件句與它的逆命題，並看出括號位置如何改變規則。
  - 「市集問卷支持哪些說法？」：用佛雷斯諾農夫市集 120 名顧客的問卷，填出三集合文氏圖，用反例與見證檢驗「全部／有些」的說法，並找出前提能保證的最小值與最大值。
- 專題沒有選擇題，邏輯概念都透過「計數」來檢查；文字說明保存待審，不自動評分。
- `scripts/audit-projects.py` 另外重新計算全部 17 個數值答案（逐一列出社員、由總數重建文氏圖各區、窮舉收據分配）；這是一致性檢查，尚未經過人工審核。
- 專題題庫升為 `quidence-projects-7`，第 6 版凍結保存；舊的專題紀錄都能照常開啟，內容不變。
- 發布前的內容審查確認 17 個答案都正確；依審查把問卷三組改名為 Fruit／Veg／App（避免「只買水果」有 24 和 38 兩種解讀，也避免和真值表的 F／V 混淆），並改寫兩個「下一步」延伸題。
- 首頁卡片、課程頁頂端和專題頁的科目選單都能進入；卡片上「尚未提供」只剩基礎檢查、理解檢查和 Intuition Lab 活動。
- 見[發布紀錄](review/basic-logic-projects-20261030.md)。

## 2026-10-30 · 新學科：基礎邏輯學（第一部分）

- 新增 School Mathematics 的高中課程 **Basic Logic**（`courses/basic-logic/`），首頁現有 15 張學科卡片。
  - 四堂互動課：命題與真值表、條件句（逆命題、否命題、逆否命題）、論證的有效性與兩種常見謬誤、量詞與三段論。
  - 每堂課都有互動模型：前三堂是真值表，第四堂是三個集合的文氏圖，會以陰影、× 和紅點顯示三段論是否有效。
  - 和其他學校課程一樣：先預測並寫理由，再看四個步驟，最後回答兩題新問題並取得回饋。
- 真值表在英文介面顯示 T/F，西班牙文介面顯示 V/F；切換語言時會即時更新，螢幕閱讀器則讀出完整的字。
- 測試另外用布林運算和窮舉重新計算每個讀數；這是一致性檢查，尚未經過人工審核。
- 知識地圖新增「Logic」節點（介於 Algebra I 與 Proof & discrete math 之間），插畫地圖也新增課程節點；四種外觀都有自己的卡片插圖。
- 兩個實作專題、基礎檢查與理解檢查、Intuition Lab 活動會在後續 PR 補上；卡片上會標示「尚未提供」。
- 發布前做了內容與介面兩次審查，所有讀數與答案都正確。依審查補上「n 為整數」的限定、預測題不再提前使用未教的術語，並修正手機版的三段論選單與 × 標記。
- 見[發布紀錄](review/basic-logic-course-20261030.md)。

## 2026-10-30 · 離散數學：Intuition Lab 活動（第三部分）

- Intuition Lab 新增第 14 個活動「It doubles each time. Every time?」，有英文和西班牙文。
  - 題目：圓上 n 個點兩兩連弦，1 到 5 個點分別把圓分成 1、2、4、8、16 塊。6 個點會是 32 塊嗎？
  - 學生先預測，再用滑桿把點數從 1 調到 8 實際觀察，會看到答案是 31，不是 32。最後由 1 + C(n, 2) + C(n, 4) 說明原因。
- 圖上的點刻意擺在不規則的角度，確保沒有三條弦交於同一點。測試會用 Euler 公式逐一驗證圖上的區域數和讀數一致。
- 離散數學卡片現在和其他學科一樣齊全，「尚未提供」的提示已移除。
- 實驗室頁面原本寫「12 subjects」，但其實已有 13 個活動，現在一併更正為 14。
- 見[發布紀錄](review/discrete-math-intuition-20261030.md)。

## 2026-10-30 · 離散數學：基礎檢查與理解檢查（第二部分）

- 離散數學新增 15 題基礎檢查（31 個答案部分）和 4 道理解檢查（16 個答案部分），都有英文和西班牙文。
  - 基礎檢查涵蓋課程預設學生已會的內容：仔細計數、數列規律、奇偶與餘數、文字中的邏輯，以及課程用到的代數。多數題目針對一個常見錯誤。
  - 理解檢查涵蓋：有序與無序的計數、從第一步選擇找出遞迴式、用度數分析聯賽，以及歸納法和不變量。
- 測試會另外重新計算每個答案，多數用窮舉；這是一致性檢查，尚未經過人工審核。
- 首頁卡片和課程頁頂端都能進入兩個檢查。卡片上「尚未提供」只剩 Intuition Lab 活動。
- 舊的學習紀錄（診斷題庫 v6–v8、12 科的基礎檢查紀錄）都能照常開啟，內容不變。
- 見[發布紀錄](review/discrete-math-checks-20261030.md)。

## 2026-10-30 · 新學科：離散數學（第一部分）

- 新增 Further Mathematics 的第七門課 **Discrete Mathematics**（`courses/discrete-math/`），首頁現有 14 張學科卡片。
  - 10 個證明專題，共 40 個步驟、90 個答題欄位，從高中基礎到大學入門。
  - 題材包括圖著色、路徑計數與二項式定理、鴿籠原理、河內塔、殘缺棋盤、L 形三格骨牌、柯尼斯堡七橋、骨牌與費氏數列、錯排，以及最小生成樹。
  - 每個步驟都有完整證明和互動實驗。計算與選擇題會檢查答案，寫下的證明只儲存待審，不自動評分。
- 題目、證明和實驗都有英文和西班牙文。測試會另外重新計算答案，多數用窮舉搜尋；這是一致性檢查，尚未經過人工審核。
- 知識地圖的「Proof & discrete math」節點和插畫地圖都可以進入這門課；四種外觀都有自己的卡片插圖。
- 基礎檢查、理解檢查和 Intuition Lab 活動會在後續 PR 補上。真值表等邏輯基礎留給之後的 Basic Logic 課程。
- 見[發布紀錄](review/discrete-math-projects-20261030.md)。

## 2026-10-30 · 顯示修正與說明文件正體化

- 巡檢 quidence.com 後修正五個顯示問題：
  - Classic 首頁左側欄在筆電視窗被截掉；
  - Coordinate Geometry 的 Intuition Lab 提示卡出現在頁首上方；
  - 入門課公式顯示成 `x_B` 而不是下標；
  - Coordinate Geometry 頁首的「Learning notebook」在桌面版換行；
  - Intuition Lab 外觀列在手機上多出空白。

  見 [發布紀錄](review/display-fixes-20261030.md)。
- 其餘 31 份簡體中文說明文件改為正體中文（台灣用語）。部署說明改名為 [DEPLOYMENT.zh-TW.md](DEPLOYMENT.zh-TW.md)。

## 2026-10-29 · 數論與解析幾何補齊

- 數論新增 4 道 **Test your understanding** 問題（16 個答案部分），規模與其他學科的檢查一致。見 [數論理解檢查](review/number-theory-understanding-check-20261029.md)。
- 解析幾何補齊了其他學科已有的活動：15 題基礎檢查、4 道理解檢查（16 個答案部分）、4 節入門課和 Intuition Lab 活動 “One midpoint. One fair spot?”。首頁卡片恢復兩個專題的入口。見 [檢查](review/coordinate-geometry-checks-20261029.md)、[入門課](review/coordinate-geometry-lessons-20261029.md)、[Intuition Lab 活動](review/coordinate-geometry-intuition-20261029.md)和[專題入口](review/coordinate-geometry-card-projects-20261029.md)。
- Geometry 與 Algebra II 新增 15 題基礎檢查，現在每張學科卡片都有基礎檢查。見 [發布紀錄](review/geometry-algebra2-foundations-20261029.md)。
- 外觀切換列改版：桌面和平板的每個選項都有該外觀的迷你預覽，手機收成一顆顯示目前外觀的按鈕。見 [發布紀錄](review/appearance-switcher-20261029.md)。
- quidence.com 只提供英文和西班牙文：Coordinate Geometry 課程和 Intuition Lab 的繁體中文版本已移除，舊的學習紀錄仍可開啟，答案不變。見 [發布紀錄](review/site-languages-en-es-20261029.md)。
- 10 月 14 日至 27 日的其他更新（四種外觀、Intuition Lab、Math Voice Lab、英文聽寫複核、賽局理論專題和解析幾何專題）列在 [CURRENT_STATUS.md](CURRENT_STATUS.md)。

## 2026-10-12 · 薄霧紫 × 深青綠與 Qidolab 入口

- 使用者已審核的新配色涵蓋首頁、課程、檢查、專題和報告；閱讀卡片保持明亮，圖表及正誤回饋繼續保留原有語意。
- 底部使用正式的 Qidolab Logo 和水壺小遊戲配圖，整塊可進入 Qidolab；左側新增通往該區域的浮動卡片，手機版使用精簡入口。
- 產生範本、英／西語來源和資源版本同步更新。題庫、評分、原始作答及歷史儲存不變；檢查範圍見 [本輪整合紀錄](review/mist-teal-qidolab-20261012.md)。GitHub 合併與正式網域部署分別處理。

## 2026-10-10 · Number Theory 與知識地圖發布

- 新增數論：10 個專題、43 個步驟、120 個答題欄位及完整證明；首頁、學科卡片和知識地圖均可進入。現有十門課與歷史紀錄保持相容。
- 數論題目、完整證明、選項、互動模型與匯出均提供英／西雙語；西語依墨西哥常用的拉丁美洲用詞複核。證明回答僅儲存待審，不自動判為正確。
- 修正數論的跨分頁儲存衝突保護；加入裝置備份。移除地圖中含義不明的大圓，並保持既定的地圖比例。
- 發布範圍與驗證：[數論發布紀錄](review/number-theory-release-20261010.md)。

# Quidence · Mathematics and Introductory Physics

**目前狀態與下一步審核以 [CURRENT_STATUS.md](CURRENT_STATUS.md) 為準。其他附日期的審核文件保留當時的驗證範圍。**

公測已暫停帳戶與雲端同步，新的學習紀錄只儲存在目前的瀏覽器。所有活動頁都提供 [儲存、還原與刪除紀錄](records/) 入口，離開公用裝置前應清除本機紀錄和下載的檔案。預設的 `npm start` 不開啟帳戶 API，也不開啟學生資料庫；開發測試中的 `accountsEnabled: true` 不用於公測。目前的規則見 [LOCAL_ONLY_REVIEW.md](LOCAL_ONLY_REVIEW.md)。

首頁共 13 張學科卡片：School Mathematics 5 科、Further Mathematics 6 科，Science 分組拆成 Physics 1 Foundations 和 Physics 2 Foundations。物理依對應課程的主題選取代數型入門內容，不規定統一的開課年級，也不宣稱是完整的進階課程或考試準備；範圍與缺口見 [兩課設計稿](PHYSICS_TRACKS_DESIGN_2026-10-08.md)。賽局理論已於 2026-10-12 恢復；經濟學仍不提供課程活動。

| 分類 | 學科 | 檢查題 |
| --- | --- | ---: |
| School Mathematics | Pre-Algebra、Algebra I、Geometry、Algebra II、Coordinate Geometry | 各 4 題 |
| Further Mathematics | Pre-calculus、Calculus、Statistics、Number Theory | 各 4 題 |
| Further Mathematics | Linear Algebra | 12 題 |
| Further Mathematics | Game Theory | 15 題（Think in Choices，不在診斷題庫中） |
| Science | Physics 1 Foundations、Physics 2 Foundations | 各 6 題（提供公式） |

診斷題庫（`assets/challenge-bank.js`，版本 `quidence-challenges-8`）共有 60 道現行檢查題、236 個獨立檢查的答案部分；賽局理論的 15 題另計。首頁每科都提供 **Test your understanding**，可以直接測試。每科都有 15 題基礎檢查：Pre-Algebra 與 Algebra I 共用一份，其餘 11 科各一份。物理兩課另有 6／7 個學習單元，包含 18／21 個學習題和 24／28 個活動。原四單元 Physics 與歷史題庫保留，用於讀取歷史紀錄，不混入新課報告。

目前共有 20 個 California-inspired field projects，10 科各兩個；包含 64 個階段、162 個數值輸入、6 個模型公式、2 個幾何構造和 51 個開放回應。專題不是選擇題。首頁的 **Explore two field projects** 可直接進入。另有數論 10 個證明專題、賽局理論 2 個專題和 1 個決策案例、解析幾何 2 個六步引導專題，在各自的課程頁進行。內部的挑戰目標尚未經學生試做校準，不公開數值難度。

Intuition Lab 是首頁的第三種檢視模式，每科一個活動，共 13 個：先預測，再操作互動模型，最後看參考推理、遷移題和反思。活動提供英文和西班牙文。語音、聽寫和 AI 對話類活動依 [語言政策](AGENTS.md) 只提供英文。

幾何可輕點放點、輸入分數座標、用按鈕連線及復原；答案和圖形一起儲存。等價多項式用係數核驗，解釋不依關鍵字、文法或長度自動評分。每小題有理解要點及可記錄的本機複核；未審核的理解保留待複核。見 [PROJECTS_REVIEW.md](PROJECTS_REVIEW.md)。


## 題目和回饋

- 新題要求組合概念、處理限制或特殊情況、建立模型，並解釋或核驗結果。線性代數的重點包括參數系統、秩與零空間、合成順序、換基、投影、最小平方、特徵向量、面積變化和子空間。
- 題目註明先備知識。**Not studied** 與 **Not sure** 分開記錄；前者是學習準備情況，不記為客觀錯誤。
- 物理兩課接受精確值、分數，或正確捨入到至少三位有效數字的最終結果（例如 `4.83e14`）；數學題保留至少兩位小數及兩位有效數字的規則。與欄位一致的單位可選，不自動換算 `kPa`、`kJ` 等前綴。舊提交的題目和判定保留，受精度規則影響的差異會提示複核。
- 數值題和選擇題按答案部分檢查。報告列出需要複查的知識點；下游結果如果可能沿用上游的錯誤值，會明確註明，避免把連帶錯誤算成多個獨立的弱點。
- 原始解釋、未提交的草稿、提交歷史和本機人工解釋審核都保留。數值相符不等於解釋通過，也不自動等於學科的掌握程度。
- 每科題集是獨立抽樣，並非完整課程或經學生資料標定的診斷量表。難度標記是設計目標；詳見 [MATH_DIAGNOSTICS_REVIEW.md](MATH_DIAGNOSTICS_REVIEW.md)。

## 本機啟動與存取教學（不需帳戶登入）

這裡的「本機登入」指在自己的電腦上啟動 Quidence，再用瀏覽器開啟。目前不需註冊、使用者名稱或密碼；帳戶和雲端同步仍暫停。預設伺服器不開啟學生資料庫，學習紀錄儲存在瀏覽器裡。

### 1. 安裝 Node.js

從 [Node.js 官方下載頁](https://nodejs.org/en/download)選擇 **24.x LTS**，版本至少為 **24.19.0**，且低於 25；這與 `package.json` 的要求一致。也可以在[官方 24.x 版本列表](https://nodejs.org/en/download/archive/v24)選擇對應的安裝程式。CI 使用 24.19.0。

- macOS：選 macOS 安裝程式；Apple Silicon 機器選相容 arm64 的版本，Intel 機器選 x64。
- Windows：選 Windows 安裝程式，依自己電腦的架構選擇。安裝程式包含 npm。

安裝後重新開啟 **Terminal**（macOS）或 **Windows Terminal / PowerShell**（Windows），分別檢查：

```sh
node -v
npm -v
```

`node -v` 應顯示 `v24.19.0` 或更新的 `v24.x`。本專案不需安裝第三方 npm 相依套件，可以直接啟動。

### 2. 取得最新版程式並進入資料夾

開啟 [GitHub 儲存庫](https://github.com/SteJ20996/Quidence)，確認分支為 **main**，點選 **Code → Download ZIP** 並解壓縮。不要在 ZIP 內直接操作。解壓縮後找到包含 `package.json`、`README.md`、`assets/` 和 `backend/` 的資料夾。

如果解壓縮到 Downloads，資料夾名稱為 `AA01-main`，請使用以下指令；如果放在其他位置，請換成實際路徑。

macOS Terminal：

```sh
cd ~/Downloads/AA01-main
```

Windows PowerShell：

```powershell
cd "$env:USERPROFILE\Downloads\AA01-main"
```

已經用 Git clone 過的讀者，可以在自己的儲存庫資料夾內確認分支為 main，再用 `git pull --ff-only` 更新。若有本機修改或更新失敗，先保留自己的修改，不要用強制重設代替更新。

### 3. 啟動本機伺服器

在上一步的程式根目錄執行：

```sh
npm start
```

看到 `Quidence server listening on port 3000` 後，讓這個終端機視窗保持執行。用瀏覽器開啟下面的 HTTP 網址；預設只供本機存取，不需綁定正式網域。

| 頁面 | 本機網址 |
| --- | --- |
| 首頁 | <http://127.0.0.1:3000/> |
| 線性代數診斷 | <http://127.0.0.1:3000/diagnostics/?module=ab01> |
| Physics 1 Foundations | <http://127.0.0.1:3000/courses/physics-1/> |
| Physics 2 Foundations | <http://127.0.0.1:3000/courses/physics-2/> |
| 已儲存的報告 | <http://127.0.0.1:3000/reports/> |
| 備份、還原和刪除紀錄 | <http://127.0.0.1:3000/records/> |

從首頁選擇科目即可開始。不需要進入 `/account/`；該頁面只說明帳戶已暫停。不要直接點兩下 `index.html` 代替伺服器，也不要把本機網址寫成 `https://127.0.0.1:3000/`。

### 4. 下次繼續、備份和結束

下次先在同一個程式目錄執行 `npm start`，再用**同一個瀏覽器設定檔和同一個網址**開啟網頁。在瀏覽器允許儲存時，未提交的草稿和已有的報告會繼續保留；請留意頁面上的儲存失敗提示。

`127.0.0.1:3000`、`localhost:3000`、其他連接埠和正式網站是不同的儲存來源。換瀏覽器、設定檔、裝置或網址都不會自動同步紀錄；無痕視窗和清除網站資料也可能刪除紀錄。

需要備份時，在 `/records/` 點選 **Download local-record backup**，確認 JSON 檔案已下載並私下保存。在另一個瀏覽器或裝置啟動程式後，可用 **Restore a local-record backup** 手動還原。已有不同的紀錄時，還原會停止，目前不會合併兩份歷史。

結束時，在執行伺服器的終端機按 **Control+C / Ctrl+C**。停止伺服器不會主動刪除瀏覽器紀錄。離開公用裝置前，先視需要備份，再到 `/records/` 點選 **Delete learning records from this browser** 並確認；另外也要清理下載的檔案、剪貼簿副本和開啟的報告頁。本機紀錄沒有帳戶密碼保護，使用同一個瀏覽器設定檔的人可能看得到。

### 5. 常見問題

| 現象 | 處理方法 |
| --- | --- |
| 找不到 `node` 或 `npm` | 安裝上述的 Node.js 24.x，然後重新開啟終端機，檢查 `node -v` 和 `npm -v` |
| `ENOENT`，找不到 `package.json` | 目前目錄不對；進入解壓縮後的程式根目錄，再執行 `npm start` |
| 找不到 `node:sqlite` 或執行版本不符 | 核對 `node -v`，改用至少 24.19.0、低於 25 的 Node.js；不需另外安裝 SQLite |
| PowerShell 提示無法執行 `npm.ps1` | 在同一個目錄改用 `npm.cmd start`，不需要為此關閉系統的指令碼執行限制 |
| `EADDRINUSE`，3000 連接埠已被占用 | 先檢查是否已經開過伺服器，直接存取既有的網址；要重新啟動時，先在原本的終端機按 Ctrl+C。確實需要換連接埠時，使用下方指令 |
| 網頁無法連線 | 檢查終端機是否還在執行、是否顯示錯誤，以及網址是否為 `http://127.0.0.1:3000/` |
| 換了網址後看不到紀錄 | 回到原本的瀏覽器設定檔和原網址；視需要在那裡匯出備份，再到新網址手動還原 |
| 更新後專題頁還是舊樣式，或頁首與導覽不一致 | 停止原本的伺服器，完整更新同一個程式目錄，再執行 `npm start` 並從首頁重新進入。必要時用 Cmd+Shift+R（macOS）或 Ctrl+Shift+R（Windows）強制重新整理；不需清除網站資料。入口和資源現在帶有內容版本，更新網址不會更換紀錄來源 |

暫時改用 3001 連接埠，macOS Terminal：

```sh
PORT=3001 npm start
```

Windows PowerShell：

```powershell
$env:PORT = '3001'
npm.cmd start
```

此時開啟 <http://127.0.0.1:3001/>。換連接埠不會搬移原本 3000 連接埠的瀏覽器紀錄。Windows 的設定會留在目前的 PowerShell 工作階段中，改回 3000 前請執行 `Remove-Item Env:PORT`，或關閉該終端機後重新開啟。

## 發布與開發檢查

靜態託管前執行 `npm run build:static`，只發布產生的 `static-release/`，不要發布整個儲存庫。腳本要求輸出目錄不存在，避免舊檔案混入新包。產生的 `_headers` 適用於 Cloudflare Pages 和 Workers 的靜態回應；其他託管服務須設定同等的安全回應標頭。這個指令只準備檔案，不部署網站，也不代表來源審核已經通過。詳見 [OVERALL_REVIEW_2026-10-07.md](OVERALL_REVIEW_2026-10-07.md)。現有 Worker `shy-thunder-f1c9` 的 GitHub 自動部署設定和連接步驟見 [Cloudflare 部署說明](DEPLOYMENT.zh-TW.md)。

`npm test` 檢查紀錄保護、題目數學、DOM 流程、活動資源版本和來源清單；GitHub Actions 會自動執行這些檢查、發布包建置及 Chromium 活動頁檢查。macOS／iPad、Safari、Firefox 和列印互動仍需實際測試。帳戶相關程式碼僅供開發測試，不能據此重新開放公測帳戶。

修改活動頁、共用資源或重新產生首頁／課程頁後，先執行 `npm run version:activities`，並提交更新後的 HTML。這個腳本依實際檔案內容，更新基礎檢查、檢查、專題頁的 CSS／JS 網址，以及首頁和課程頁的活動入口；不修改題目或學生紀錄。

瀏覽器檢查只需要開發用的相依套件，日常的 `npm start` 仍可直接執行：

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

這項檢查在隔離的瀏覽器中執行，涵蓋十科專題／檢查頁的四種螢幕寬度、草稿重新整理與切換科目、新分頁及舊 HTTP 快取升級，不會讀取個人的瀏覽器紀錄。Linux 缺少系統相依套件時，使用 `npx playwright install --with-deps chromium`。

## 主要位置

| 位置 | 內容 |
| --- | --- |
| `assets/challenge-bank.js`、`diagnostics/` | 數學中高難度診斷與物理入門檢查 |
| `assets/foundation-engine.js`、`assets/foundation-app.js` | 共用檢查、歷史儲存與報告流程；新題使用獨立的紀錄空間 |
| `assets/project-bank.js`、`assets/physics-foundation-bank.js` | 20 個為 Quidence 編寫的多步驟情境專題，來源審核待完成 |
| `assets/project-tools.js` | 有界多項式檢查與幾何構造工具 |
| `projects/` | 獨立的專題入口與儲存 |
| `review/project-math-audit.json` | 從情境資料獨立推導的答案參照 |
| `review/project-graphics.svg` | 給定圖形與獨立審核的幾何構造 |
| `PROJECTS_REVIEW.md` | 逐專題審核、解釋標準和驗證範圍 |
| `review/challenge-math-audit.json` | 60 道現行題目及 6 道歷史 Physics 題的重算答案參照 |
| `scripts/audit-challenges.py` | 不讀取題庫答案的精確分數、消去、積分與統計驗證 |
| `review/challenge-graphics.svg` | 新圖形在 320px 和 520px 寬度下的審核頁 |
| `courses/`、`modules/aa01`、`ab01`、`ad01`、`ae01`、`af01` | 目前的數學教學與視覺活動，另含 `courses/physics-1/`、`courses/physics-2/`；舊的 `courses/physics/` 保留以讀取歷史紀錄 |
| `intuition/` | Intuition Lab 的 13 個活動及其數值模型 |
| `modules/ac01/` | 賽局理論課程、Think in Choices 檢查、專題與決策案例 |
| `demos/college-voice-lab/` | 六個學科的英文 Math Voice Lab 示範 |
| `foundations/`、`reports/` | 舊的數學基礎檢查、儲存的報告；歷史紀錄保持相容 |
| `backend/`、`account/` | 帳號及帶有版本衝突保護的跨裝置同步 |
| `archive/retired-subjects/` | 經濟學封存的原始檔案及賽局理論的歷史快照；賽局理論現已在 modules/ac01 恢復 |

已停止提供的課程，其舊網址會顯示停止提供的說明，並保留返回數學首頁及匯出舊報告的連結。舊紀錄、報告和必要的歷史題目定義不會刪除；目前的活動入口不再提供這些學科。

## 驗證

```sh
npm test
python3 scripts/audit-challenges.py
node scripts/render-challenge-graphics.cjs
```

`npm test` 檢查目前的數學、題目流程、草稿／歷史／報告、圖形、帳號隔離和同步衝突；新增的診斷檢查使用獨立重算的答案，逐一擾動答案部分，核對部分相符及錯誤回饋。Python 審核只使用標準函式庫。圖形審核頁是獨立的 SVG，不需要瀏覽器截圖的相依套件。

舊版本的審核文件保留為歷史紀錄；以本 README 和本次診斷審核表為目前的範圍。macOS 實機互動及列印仍需在實際瀏覽器中測試。

Current record behavior is described at `data-use/`. See [Claude follow-up status](CLAUDE_FOLLOWUP_REVIEW.md), [source review process](SOURCE_REVIEW.md), and the [unapproved privacy and retention draft](PRIVACY_AND_RETENTION_DRAFT.md). There is no online account deletion or automatic revision expiry yet. The explanation checks are provisional and do not call an AI grading model; these activities do not certify comprehensive mathematical mastery.

## 基礎 SEO 與 Search Console

設定、維護順序和 Cloudflare DNS 驗證步驟見 [SEO_SETUP.md](SEO_SETUP.md)。更改頁面或 SEO 後，執行 `npm run build:seo`、`npm run version:activities`、`npm run build:seo`，再檢查和建置。只發布 `static-release/`；不要發布原始碼、學生紀錄或未完成的預覽。

## 賽局理論（AC01）恢復

Game Theory 已恢復到大學數學知識地圖、Further Mathematics 的 Subject 選項和 College Level 課程卡片。提供四個原有的英文教學單元、八道課後檢查，以及另外的 15 題基礎檢查和 6 題進一步檢查；舊的 AC01 學習紀錄與報告繼續相容。正式發布包含 modules/ac01/dist，原有的封存快照保留。

## Repository access

The GitHub repository is now `SteJ20996/Quidence`. Cloning or downloading this private repository requires access as its owner or an authorized collaborator. The public website does not require repository access.

## Licensing and rights / 版權與授權

This project is not offered under an open-source license. See [LICENSE](LICENSE) for the scoped proprietary notice covering implementation code and brand artwork only to the extent owned by Yizhen Jia. Ordinary use of the official website remains permitted as described there.

Questions, teaching text, solutions, educational illustrations, game instructions/copy, and translations are excluded from this notice pending separate provenance review, including when embedded in code. Their exclusion is not a reuse license or an originality claim. Third-party terms, valid prior grants, GitHub platform rights, and applicable legal exceptions remain unchanged; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

本次聲明僅涵蓋 Yizhen Jia 擁有相應權利的程式實作及品牌素材，保留相關權利；題目、教學文字、解答、教學插圖、遊戲說明及文案、翻譯暫不納入，待另行查核。排除不代表允許轉載，也不代表已經確認原創。第三方授權及已有的合法授權不受影響，網站的正常使用不變。

Permission requests / 授權聯絡：hello@quidence.com
