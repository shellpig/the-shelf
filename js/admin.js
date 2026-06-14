// 本機後台：選專案資料夾 → 編輯 projects.json，圖片拖曳上傳、封面裁切 16:9。
// 需 Chrome/Edge（File System Access API）。

const FS_OK = 'showDirectoryPicker' in window;

let dirHandle = null;
let savedHandle = null;             // IndexedDB 記住的資料夾（待重新授權）
let projects = [];
let editing = null;                 // 編輯中的索引，null = 新增
let draft = { cover: '', images: [], tech: [], links: [] };
let cropper = null, pendingCropName = '';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function slug(s) {
  return String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
function currentId() {
  return $('f-id').value.trim() || slug($('f-title').value);
}

/* ---------- 記住資料夾（IndexedDB） ---------- */
function idbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('shelf-admin', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbSet(handle) {
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const t = db.transaction('kv', 'readwrite');
    t.objectStore('kv').put(handle, 'dir');
    t.oncomplete = res; t.onerror = () => rej(t.error);
  });
}
async function idbGet() {
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const t = db.transaction('kv', 'readonly');
    const rq = t.objectStore('kv').get('dir');
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
  });
}
async function ensurePerm(handle, request) {
  const opts = { mode: 'readwrite' };
  if (await handle.queryPermission(opts) === 'granted') return true;
  if (request && await handle.requestPermission(opts) === 'granted') return true;
  return false;
}

/* ---------- 資料夾 / 讀寫 ---------- */
async function pickFolder() {
  try {
    if (savedHandle && await ensurePerm(savedHandle, true)) {
      dirHandle = savedHandle;            // 重新授權已記住的資料夾
    } else {
      dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      await idbSet(dirHandle).catch(() => {});
    }
    savedHandle = null;
    $('status').textContent = `已選資料夾：${dirHandle.name}（可儲存）`;
    await loadProjects();
  } catch (e) { /* 使用者取消 */ }
}

async function loadProjects() {
  try {
    const fh = await dirHandle.getFileHandle('projects.json');
    const text = await (await fh.getFile()).text();
    projects = JSON.parse(text);
  } catch (e) {
    projects = [];
  }
  renderList();
  resetForm();
}

async function saveProjects() {
  const json = JSON.stringify(projects, null, 2) + '\n';
  if (dirHandle) {
    const fh = await dirHandle.getFileHandle('projects.json', { create: true });
    const w = await fh.createWritable();
    await w.write(json); await w.close();
    flash('已儲存 projects.json');
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = 'projects.json'; a.click();
  }
}

async function writeImage(name, blob) {
  if (!dirHandle) { alert('請先選擇專案資料夾，才能存圖片。'); return null; }
  const imgs = await dirHandle.getDirectoryHandle('images', { create: true });
  const fh = await imgs.getFileHandle(name, { create: true });
  const w = await fh.createWritable();
  await w.write(blob); await w.close();
  return `images/${name}`;
}

/* ---------- 作品清單 ---------- */
function renderList() {
  $('count').textContent = projects.length;
  $('plist').innerHTML = projects.map((p, i) => `
    <li>
      <span class="pi-title">${esc(p.title)}</span>
      <span class="pi-id">${esc(p.id)}</span>
      <span class="ops">
        <button class="ghost" onclick="moveItem(${i},-1)" ${i === 0 ? 'disabled' : ''}>↑</button>
        <button class="ghost" onclick="moveItem(${i},1)" ${i === projects.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="ghost" onclick="editItem(${i})">編輯</button>
        <button class="ghost" onclick="delItem(${i})">刪除</button>
      </span>
    </li>`).join('') || '<li style="color:var(--text-muted)">尚無作品</li>';
}
function moveItem(i, d) {
  const j = i + d; if (j < 0 || j >= projects.length) return;
  [projects[i], projects[j]] = [projects[j], projects[i]];
  renderList();
}
function delItem(i) {
  if (!confirm(`刪除「${projects[i].title}」？（不會刪除圖片檔）`)) return;
  projects.splice(i, 1);
  if (editing === i) resetForm();
  renderList();
}

/* ---------- 表單 ---------- */
function resetForm() {
  editing = null;
  draft = { cover: '', images: [], tech: [], links: [] };
  $('f-title').value = ''; $('f-id').value = ''; $('f-summary').value = ''; $('f-readme').value = '';
  $('editing-label').textContent = '新增作品';
  syncDraft();
}
function editItem(i) {
  const p = projects[i];
  editing = i;
  draft = { cover: p.cover || '', images: [...(p.images || [])], tech: [...(p.tech || [])], links: (p.links || []).map(l => ({ ...l })) };
  $('f-title').value = p.title || ''; $('f-id').value = p.id || '';
  $('f-summary').value = p.summary || ''; $('f-readme').value = p.readme || '';
  $('editing-label').textContent = `編輯：${p.title}`;
  syncDraft();
  window.scrollTo({ top: $('editor').offsetTop - 60, behavior: 'smooth' });
}

function syncDraft() {
  // tech chips
  $('tech-chips').innerHTML = draft.tech.map((t, i) =>
    `<span class="chip">${esc(t)}<button onclick="rmTech(${i})" aria-label="移除">×</button></span>`).join('');
  // cover
  $('cover-preview').innerHTML = draft.cover ? `<img src="${esc(draft.cover)}" alt="封面預覽">` : '';
  // gallery
  $('gallery-preview').innerHTML = draft.images.map((src, i) =>
    `<span class="gp"><img src="${esc(src)}" alt=""><button class="ghost" onclick="rmImg(${i})" aria-label="移除">×</button></span>`).join('');
  // links
  $('links-list').innerHTML = draft.links.map((l, i) => `
    <div class="linkrow">
      <input type="text" placeholder="標題" value="${esc(l.label || '')}" oninput="updLink(${i},'label',this.value)">
      <input type="text" placeholder="https://..." value="${esc(l.url || '')}" oninput="updLink(${i},'url',this.value)">
      <button class="ghost" onclick="rmLink(${i})">×</button>
    </div>`).join('');
}
function addTech() { const v = $('tech-in').value.trim(); if (!v) return; draft.tech.push(v); $('tech-in').value = ''; syncDraft(); }
function rmTech(i) { draft.tech.splice(i, 1); syncDraft(); }
function addLink() { draft.links.push({ label: '', url: '' }); syncDraft(); }
function updLink(i, k, v) { draft.links[i][k] = v; }
function rmLink(i) { draft.links.splice(i, 1); syncDraft(); }
function rmImg(i) { draft.images.splice(i, 1); syncDraft(); }

function saveForm() {
  const title = $('f-title').value.trim();
  if (!title) { alert('請填標題。'); return; }
  const id = currentId();
  if (!id) { alert('無法產生 id，請在「網址 id」欄手動填寫（英數與連字號）。'); return; }
  if (projects.some((p, i) => p.id === id && i !== editing)) { alert(`id「${id}」已存在，請改用其他 id。`); return; }
  const obj = {
    id, title,
    summary: $('f-summary').value.trim(),
    tech: draft.tech,
    cover: draft.cover,
    images: draft.images,
    readme: $('f-readme').value,
    links: draft.links.filter(l => l.label && l.url),
  };
  if (editing == null) projects.push(obj); else projects[editing] = obj;
  renderList(); resetForm();
  flash('已加入清單，記得按「儲存 projects.json」寫入檔案。');
}

/* ---------- 圖片：封面裁切 ---------- */
function handleCoverFile(file) {
  const id = currentId();
  if (!id) { alert('請先填標題或 id，再上傳封面。'); return; }
  pendingCropName = `${id}-cover.jpg`;
  const url = URL.createObjectURL(file);
  $('crop-img').src = url;
  $('crop-modal').classList.add('show');
  if (cropper) cropper.destroy();
  cropper = new Cropper($('crop-img'), { aspectRatio: 16 / 9, viewMode: 1, autoCropArea: 1 });
}
function cancelCrop() { $('crop-modal').classList.remove('show'); if (cropper) { cropper.destroy(); cropper = null; } }
async function confirmCrop() {
  const canvas = cropper.getCroppedCanvas({ width: 1280, height: 720, imageSmoothingQuality: 'high' });
  canvas.toBlob(async blob => {
    const path = await writeImage(pendingCropName, blob);
    if (path) { draft.cover = path + '?t=' + Date.now(); syncDraft(); }
    cancelCrop();
  }, 'image/jpeg', 0.9);
}

/* ---------- 圖片：圖庫（原比例） ---------- */
async function handleGalleryFiles(files) {
  const id = currentId();
  if (!id) { alert('請先填標題或 id，再上傳截圖。'); return; }
  for (const file of files) {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const name = `${id}-g${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
    const path = await writeImage(name, file);
    if (path) draft.images.push(path);
  }
  syncDraft();
}

/* ---------- dropzone 綁定 ---------- */
function bindDrop(el, onFiles, multiple) {
  el.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = !!multiple;
    inp.onchange = () => onFiles([...inp.files]);
    inp.click();
  });
  ['dragover', 'dragenter'].forEach(ev => el.addEventListener(ev, e => { e.preventDefault(); el.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => el.addEventListener(ev, e => { e.preventDefault(); el.classList.remove('over'); }));
  el.addEventListener('drop', e => {
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if (files.length) onFiles(files);
  });
}

/* ---------- README：丟 .md 檔自動填入 ---------- */
function handleMdFile(file) {
  const reader = new FileReader();
  reader.onload = () => { $('f-readme').value = reader.result; flash(`已載入 ${file.name} 內容到 README`); };
  reader.readAsText(file, 'utf-8');
}
function bindMdDrop(el) {
  const isMd = f => /\.(md|markdown|txt)$/i.test(f.name) || /markdown|text\/plain/.test(f.type);
  el.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.md,.markdown,.txt,text/markdown,text/plain';
    inp.onchange = () => inp.files[0] && handleMdFile(inp.files[0]);
    inp.click();
  });
  ['dragover', 'dragenter'].forEach(ev => el.addEventListener(ev, e => { e.preventDefault(); el.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => el.addEventListener(ev, e => { e.preventDefault(); el.classList.remove('over'); }));
  el.addEventListener('drop', e => { const f = [...e.dataTransfer.files].find(isMd); if (f) handleMdFile(f); });
}

function flash(msg) { const s = $('flash'); s.textContent = msg; s.style.opacity = 1; setTimeout(() => s.style.opacity = 0, 2500); }

/* ---------- 啟動 ---------- */
function init() {
  if (!FS_OK) $('fs-warn').style.display = 'block';
  $('btn-folder').addEventListener('click', pickFolder);
  $('btn-save').addEventListener('click', saveProjects);
  $('btn-new').addEventListener('click', resetForm);
  $('btn-addtech').addEventListener('click', addTech);
  $('tech-in').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } });
  $('btn-addlink').addEventListener('click', addLink);
  $('btn-saveform').addEventListener('click', saveForm);
  $('btn-cancelcrop').addEventListener('click', cancelCrop);
  $('btn-confirmcrop').addEventListener('click', confirmCrop);
  $('f-title').addEventListener('input', () => { if (!$('f-id').value) $('f-id').placeholder = slug($('f-title').value) || 'auto'; });
  bindDrop($('cover-drop'), files => handleCoverFile(files[0]), false);
  bindDrop($('gallery-drop'), files => handleGalleryFiles(files), true);
  bindMdDrop($('md-drop'));
  initialLoad();
}

// 開啟流程：
// 1) 若曾記住資料夾（IndexedDB）且權限仍在 → 直接從該資料夾載入、可存檔。
// 2) 記住但權限需重授 → 先以 HTTP 顯示，提示按鈕重新授權。
// 3) 從未選過 → 以 HTTP fetch 顯示現有作品（檢視模式，存檔前需選資料夾）。
async function initialLoad() {
  if (FS_OK) {
    try {
      const h = await idbGet();
      if (h) {
        if (await ensurePerm(h, false)) {
          dirHandle = h;
          $('status').textContent = `已記住資料夾：${h.name}（可儲存）`;
          await loadProjects();
          return;
        }
        savedHandle = h;
        $('status').textContent = `已記住資料夾：${h.name}，請點「選擇專案資料夾」重新授權即可存檔`;
      }
    } catch (e) { /* 忽略，走檢視模式 */ }
  }
  try {
    const res = await fetch('projects.json', { cache: 'no-store' });
    if (res.ok) projects = await res.json();
  } catch (e) { /* file:// 或讀取失敗：維持空清單 */ }
  renderList();
  if (!savedHandle) {
    $('status').textContent = projects.length
      ? `已載入 ${projects.length} 件（檢視模式，存檔前請選資料夾）`
      : '尚未選擇資料夾（若清單為空，請改用 http://localhost 開啟，勿用 file://）';
  }
}

init();
