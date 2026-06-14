# The Shelf

**English** | [繁體中文](./README_zh-TW.md) | [简体中文](./README_zh-CN.md)

![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?logo=javascript&logoColor=black)
![Deploy](https://img.shields.io/badge/DEPLOY-GITHUB%20PAGES-222?logo=github&logoColor=white)
![Status](https://img.shields.io/badge/STATUS-ACTIVE-green)

> A personal portfolio site — placing each project on the shelf, one by one.

ShellPig's Shelf is a static website that showcases personal projects as browsable cards. Click a card to see the full detail page with screenshots, README content, and links. All content is driven by a single `projects.json` file, edited through a local admin panel — no hand-written HTML, no backend, no database.

---

## Live Site

https://shellpig.github.io/the-shelf/

---

## Features

- **Card wall**: each project displayed as a card with cover image, title, summary, and tech tags.
- **Detail page**: click a card to see full project info — name, summary, image gallery, rendered README (Markdown), and links (including live demo where applicable).
- **Responsive layout**: 3 columns on desktop / 2 on tablet / 1 on mobile, powered by CSS Grid.
- **Data-driven**: all content lives in `projects.json`; the site reads and renders it at load time.
- **Local admin panel**: `admin.html` provides a form to add / edit / delete / reorder projects, with drag-and-drop image upload and 16:9 cover cropping (Cropper.js) — all via the browser's File System Access API, no server needed.
- **Markdown rendering**: detail-page README content stored as Markdown in the data file, rendered client-side with marked.js.

---

## Visual Design

**"Paper Shelf"** — a warm, tactile aesthetic that echoes the *Shelf* in the name:

| Element | Color | Note |
|---|---|---|
| Page background | `#f6f1e7` | Warm beige |
| Card background | `#fffdf7` | Near-white warm |
| Primary text | `#3a3225` | Deep brown |
| Secondary text | `#8a7c64` | Warm grey-brown |
| Borders | `#e6dcc7` | Soft beige |
| Accent (brick red) | `#993c1d` | Links, tech tags, hover highlights |

Typography: Noto Serif TC for headings (bookish serif feel), Noto Sans TC for body text, loaded via Google Fonts.

---

## Tech Stack

- **Frontend**: vanilla HTML + CSS + JavaScript — no framework, no build step.
- **Data**: single `projects.json` (plain text, git-versionable).
- **Markdown**: marked.js (lightweight, bundled in `lib/`).
- **Image cropping**: Cropper.js (admin panel, bundled in `lib/`).
- **Admin storage**: browser File System Access API — reads/writes `projects.json` and saves images to `images/` directly from the browser.
- **Layout**: CSS Grid for responsive 3/2/1 column layout.
- **Deploy**: GitHub Pages (pure static).

---

## Quick Start

### Just browse

Visit https://shellpig.github.io/the-shelf/ — nothing to install.

### Run locally

1. Clone the repo.
2. Serve the directory with any static file server, e.g.:
   ```powershell
   npx serve .
   ```
   Or simply open `index.html` in a browser (some features like `fetch` require a local server).
3. For the admin panel, open `admin.html` in Chrome or Edge (File System Access API required).

---

## Current Projects

| # | Project | Description |
|---|---|---|
| 1 | **FactorHammer** | TW/US stock quantitative research & backtesting tool — local, offline, no live trading. |
| 2 | **Warboard Theater** | Browser-based 3D historical battle theater — timeline-driven replay with auto-directing camera. |
| 3 | **After The Model** | 2D side-scrolling cyberpunk exploration game set in 2030 — play as an ordinary person after AI reshaped the world. |
| 4 | **Sparkote** | A healing exploration game driven by real-life self-care tasks — guide a postal carrier across misty islands. |

---

## Directory Structure

```text
the-shelf/
├── index.html          Homepage: hero section + card wall
├── detail.html         Detail page template (?id= routing)
├── admin.html          Local admin panel (add/edit/delete/reorder projects)
├── projects.json       All project data (single source of truth)
├── site.json           Site config (title, tagline, intro, contact links)
├── css/
│   ├── style.css       Main stylesheet
│   └── admin.css       Admin panel styles
├── js/
│   ├── app.js          Reads JSON, renders card wall
│   ├── detail.js       Renders detail page + Markdown
│   └── admin.js        Admin form logic, File System Access, drag-and-drop upload
├── lib/
│   ├── marked.min.js   Markdown renderer
│   ├── cropper.min.js  Image cropper (admin)
│   └── cropper.min.css
├── images/             Project cover images & screenshots
└── 規格書.md            Spec document (Chinese)
```

---

## Admin Panel

The admin panel (`admin.html`) is a local-only tool bundled with the site:

1. Open `admin.html` in Chrome / Edge.
2. Grant file system access to select the project folder.
3. Add, edit, delete, or reorder projects via the form.
4. Drag-and-drop images — covers are cropped to 16:9 (1280x720) automatically.
5. Save writes back to `projects.json` and `images/`.
6. `git commit` + `git push` to publish changes.

> The admin panel requires File System Access API (Chrome / Edge). Visitors browsing the site are unaffected by this limitation.

---

## Deploy

1. Edit projects locally via `admin.html` -> save.
2. `git commit` + `git push` to https://github.com/shellpig/the-shelf.
3. GitHub Pages auto-publishes.
4. Live at: https://shellpig.github.io/the-shelf/

---

## License

This is a personal project. No formal license attached yet (all rights reserved).
