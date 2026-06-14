# The Shelf

[English](./README.md) | [繁體中文](./README_zh-TW.md) | **简体中文**

![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?logo=javascript&logoColor=black)
![Deploy](https://img.shields.io/badge/DEPLOY-GITHUB%20PAGES-222?logo=github&logoColor=white)
![Status](https://img.shields.io/badge/STATUS-ACTIVE-green)

> 个人作品集网站——把每一件作品，一件件摆上架。

ShellPig's Shelf 是一个静态作品集网站，以卡片墙呈现个人项目。点击卡片进入细节页，可看到截图、README 内容与相关链接。所有内容由单一 `projects.json` 驱动，通过本机后台表单编辑——不手写 HTML、不需后端、不需数据库。

---

## 线上网址

https://shellpig.github.io/the-shelf/

---

## 功能

- **卡片墙**：每件作品以一张卡片呈现，含封面图、标题、简述与技术栈标签。
- **细节页**：点击卡片进入独立细节页——名称、简述、图库、Markdown 渲染的 README 内容、相关链接（网页类作品含线上试玩链接）。
- **响应式排版**：桌面 3 栏 / 平板 2 栏 / 手机 1 栏，以 CSS Grid 实现。
- **数据驱动**：所有内容存于 `projects.json`，网站加载时读取并渲染。
- **本机后台**：`admin.html` 提供表单新增 / 编辑 / 删除 / 排序作品，图片可拖拽上传，封面自动裁切为 16:9（Cropper.js）——全部通过浏览器 File System Access API 完成，无需服务器。
- **Markdown 渲染**：细节页的 README 内容以 Markdown 存于数据文件，前端以 marked.js 渲染为 HTML。

---

## 视觉设计

**「纸感书架」**——温润触感的视觉调性，呼应 Shelf（架子）的命名：

| 元素 | 色码 | 说明 |
|---|---|---|
| 页面底色 | `#f6f1e7` | 暖米色 |
| 卡片底色 | `#fffdf7` | 近白暖色 |
| 主要文字 | `#3a3225` | 深褐 |
| 次要文字 | `#8a7c64` | 暖灰褐 |
| 边框 | `#e6dcc7` | 柔和米边 |
| 强调色（砖红） | `#993c1d` | 链接、技术标签、hover 重点 |

字体：标题用思源宋体 Noto Serif TC（带书卷感的衬线体）、正文用思源黑体 Noto Sans TC，通过 Google Fonts 加载。

---

## 技术栈

- **前端**：原生 HTML + CSS + JavaScript——不使用框架、无 build step。
- **数据**：单一 `projects.json`（纯文本、git 可版控）。
- **Markdown**：marked.js（轻量，随站附于 `lib/`）。
- **图片裁切**：Cropper.js（后台用，随站附于 `lib/`）。
- **后台存档**：浏览器 File System Access API——直接从浏览器读写 `projects.json` 与存入 `images/`。
- **排版**：CSS Grid 控制响应式三栏 / 两栏 / 单栏。
- **部署**：GitHub Pages（纯静态）。

---

## Quick Start

### 直接浏览

前往 https://shellpig.github.io/the-shelf/ ——无需安装。

### 本机运行

1. Clone 此 repo。
2. 以任意静态文件服务器开启，例如：
   ```powershell
   npx serve .
   ```
   或直接在浏览器打开 `index.html`（部分功能如 `fetch` 需要本机服务器）。
3. 后台管理请以 Chrome 或 Edge 打开 `admin.html`（需 File System Access API）。

---

## 目前收录的作品

| # | 作品 | 简述 |
|---|---|---|
| 1 | **FactorHammer** | 台股／美股量化研究与回测工具，本机离线执行、不做实单交易。 |
| 2 | **Warboard Theater 战局剧场** | 浏览器中的 3D 历史战役推演剧场，以时间轴与自动导播重现经典战役。 |
| 3 | **After The Model** | 设定在 2030 年的 2D 横向赛博朋克探索游戏；扮演 AI 重塑后城市里的底层小人物。 |
| 4 | **Sparkote** | 由现实任务驱动的治愈探索游戏——把照顾自己的小事化为能量，驱动邮差在迷雾群岛间探索送信。 |

---

## 目录结构

```text
the-shelf/
├── index.html          首页：大标区 + 卡片墙
├── detail.html         细节页模板（靠 ?id= 区分）
├── admin.html          本机后台（新增/编辑/删除/排序作品）
├── projects.json       所有作品数据（唯一内容来源）
├── site.json           站台设定（大标、简介、联系链接）
├── css/
│   ├── style.css       主样式
│   └── admin.css       后台样式
├── js/
│   ├── app.js          读 JSON、渲染卡片墙
│   ├── detail.js       渲染细节页 + Markdown
│   └── admin.js        后台表单逻辑、File System Access、拖拽上传
├── lib/
│   ├── marked.min.js   Markdown 渲染
│   ├── cropper.min.js  图片裁切（后台用）
│   └── cropper.min.css
├── images/             作品封面图与截图
└── 規格書.md            规格文档
```

---

## 后台管理

后台（`admin.html`）是随站附带的本机工具：

1. 以 Chrome / Edge 打开 `admin.html`。
2. 授权文件系统访问，选取项目文件夹。
3. 通过表单新增、编辑、删除或调整作品顺序。
4. 拖拽上传图片——封面自动裁切为 16:9（1280×720）。
5. 保存后写回 `projects.json` 与 `images/`。
6. `git commit` + `git push` 即上线。

> 后台需 File System Access API（Chrome / Edge）。访客浏览网站不受此限制影响。

---

## 部署流程

1. 本机以 `admin.html` 编辑作品 → 保存。
2. `git commit` + `git push` 至 https://github.com/shellpig/the-shelf。
3. GitHub Pages 自动发布。
4. 线上网址：https://shellpig.github.io/the-shelf/

---

## 授权

本项目为个人作品，目前尚未附正式授权条款（保留所有权利）。
