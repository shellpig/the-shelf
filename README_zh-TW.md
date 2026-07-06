# The Shelf

[English](./README.md) | **繁體中文** | [简体中文](./README_zh-CN.md)

![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?logo=javascript&logoColor=black)
![Deploy](https://img.shields.io/badge/DEPLOY-GITHUB%20PAGES-222?logo=github&logoColor=white)
![Status](https://img.shields.io/badge/STATUS-ACTIVE-green)

> 個人作品集網站——把每一件作品，一件件擺上架。

ShellPig's Shelf 是一個靜態作品集網站，以卡片牆呈現個人專案。點擊卡片進入細節頁，可看到截圖、README 內容與相關連結。所有內容由單一 `projects.json` 驅動，透過本機後台表單編輯——不手寫 HTML、不需後端、不需資料庫。

---

## 線上網址

https://shellpig.github.io/the-shelf/

---

## 功能

- **卡片牆**：每件作品以一張卡片呈現，含封面圖、標題、簡述與技術棧標籤。
- **細節頁**：點擊卡片進入獨立細節頁——名稱、簡述、圖庫、Markdown 渲染的 README 內容、相關連結（網頁類作品含線上試玩連結）。
- **響應式排版**：桌面 3 欄 / 平板 2 欄 / 手機 1 欄，以 CSS Grid 實作。
- **資料驅動**：所有內容存於 `projects.json`，網站載入時讀取並渲染。
- **本機後台**：`admin.html` 提供表單新增 / 編輯 / 刪除 / 排序作品，圖片可拖曳上傳，封面自動裁切為 16:9（Cropper.js）——全部透過瀏覽器 File System Access API 完成，無需伺服器。
- **Markdown 渲染**：細節頁的 README 內容以 Markdown 存於資料檔，前端以 marked.js 渲染為 HTML。

---

## 視覺設計

**「紙感書架」**——溫潤觸感的視覺調性，呼應 Shelf（架子）的命名：

| 元素 | 色碼 | 說明 |
|---|---|---|
| 頁面底色 | `#f6f1e7` | 暖米色 |
| 卡片底色 | `#fffdf7` | 近白暖色 |
| 主要文字 | `#3a3225` | 深褐 |
| 次要文字 | `#8a7c64` | 暖灰褐 |
| 邊框 | `#e6dcc7` | 柔和米邊 |
| 強調色（磚紅） | `#993c1d` | 連結、技術標籤、hover 重點 |

字體：標題用思源宋體 Noto Serif TC（帶書卷感的襯線體）、內文用思源黑體 Noto Sans TC，透過 Google Fonts 載入。

---

## 技術棧

- **前端**：原生 HTML + CSS + JavaScript——不使用框架、無 build step。
- **資料**：單一 `projects.json`（純文字、git 可版控）。
- **Markdown**：marked.js（輕量，隨站附於 `lib/`）。
- **圖片裁切**：Cropper.js（後台用，隨站附於 `lib/`）。
- **後台存檔**：瀏覽器 File System Access API——直接從瀏覽器讀寫 `projects.json` 與存入 `images/`。
- **排版**：CSS Grid 控制響應式三欄 / 兩欄 / 單欄。
- **部署**：GitHub Pages（純靜態）。

---

## Quick Start

### 直接瀏覽

前往 https://shellpig.github.io/the-shelf/ ——無需安裝。

### 本機執行

1. Clone 此 repo。
2. 以任意靜態檔案伺服器開啟，例如：
   ```powershell
   npx serve .
   ```
   或直接在瀏覽器開啟 `index.html`（部分功能如 `fetch` 需要本機伺服器）。
3. 後台管理請以 Chrome 或 Edge 開啟 `admin.html`（需 File System Access API）。

---

## 目前收錄的作品

| # | 作品 | 簡述 |
|---|---|---|
| 1 | **FactorHammer** | 台股／美股量化研究與回測工具，本機離線執行、不做實單交易。內建技術指標、雙回測引擎，並可選用 AI 輔助分析。 |
| 2 | **Warboard Theater 戰局劇場** | 瀏覽器中的 3D 歷史戰役推演劇場，以時間軸與自動導播重現經典戰役；首場為赤壁之戰。純前端、開啟即看。 |
| 3 | **After The Model** | 設定在 2030 年的 2D 橫向賽博龐克探索遊戲；扮演 AI 重塑後城市裡的底層小人物，接零工、解謎、找回被抹除的記憶。 |
| 4 | **AI Roundtable** | 本機多 AI 圓桌討論工具。用一個瀏覽器介面同時召集多個模型發言、追問、整理共識，適合用來做第二意見、方案比較與長篇問題拆解。 |
| 5 | **Sparkote** | 由現實任務驅動的療癒探索遊戲。把現實中完成的自我照顧小任務化為能量，驅動郵差萊拉在迷霧群島間探索送信，讓世界一塊塊變得完整。 |
| 6 | **List-Smith** | 可重複使用的清單 App，從旅遊打包出發，也適用於任何需要反覆檢查的清單。範本可快照成一次清單，完成後再由使用者決定哪些變更要回饋到範本。 |

---

## 目錄結構

```text
the-shelf/
├── index.html          首頁：大標區 + 卡片牆
├── detail.html         細節頁模板（靠 ?id= 區分）
├── admin.html          本機後台（新增/編輯/刪除/排序作品）
├── projects.json       所有作品資料（唯一內容來源）
├── site.json           站台設定（大標、簡介、聯絡連結）
├── css/
│   ├── style.css       主樣式
│   └── admin.css       後台樣式
├── js/
│   ├── app.js          讀 JSON、渲染卡片牆
│   ├── detail.js       渲染細節頁 + Markdown
│   └── admin.js        後台表單邏輯、File System Access、拖曳上傳
├── lib/
│   ├── marked.min.js   Markdown 渲染
│   ├── cropper.min.js  圖片裁切（後台用）
│   └── cropper.min.css
├── images/             作品封面圖與截圖
└── 規格書.md            規格文件
```

---

## 後台管理

後台（`admin.html`）是隨站附帶的本機工具：

1. 以 Chrome / Edge 開啟 `admin.html`。
2. 授權檔案系統存取，選取專案資料夾。
3. 透過表單新增、編輯、刪除或調整作品順序。
4. 拖曳上傳圖片——封面自動裁切為 16:9（1280×720）。
5. 儲存後寫回 `projects.json` 與 `images/`。
6. `git commit` + `git push` 即上線。

> 後台需 File System Access API（Chrome / Edge）。訪客瀏覽網站不受此限制影響。

---

## 部署流程

1. 本機以 `admin.html` 編輯作品 → 儲存。
2. `git commit` + `git push` 至 https://github.com/shellpig/the-shelf。
3. GitHub Pages 自動發佈。
4. 線上網址：https://shellpig.github.io/the-shelf/

---

## 授權

本專案為個人作品，目前尚未附正式授權條款（保留所有權利）。
