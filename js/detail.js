// 細節頁：依 ?id= 找出作品，渲染名稱、簡述、圖庫、README、連結。

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function getId() {
  return new URLSearchParams(location.search).get('id');
}

function render(p) {
  document.title = `${p.title} — 作品集`;
  const tags = (p.tech || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
  const links = (p.links || []).map(l =>
    `<a href="${esc(l.url)}" ${/^https?:/.test(l.url) ? 'target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`
  ).join('');
  const gallery = (p.images || []).map(src =>
    `<img src="${esc(src)}" alt="${esc(p.title)} 截圖">`
  ).join('');
  const readmeHtml = p.readme ? marked.parse(p.readme) : '';

  document.getElementById('content').innerHTML = `
    <div class="detail-head">
      <h1>${esc(p.title)}</h1>
      ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ''}
      ${tags ? `<div class="tags">${tags}</div>` : ''}
      ${links ? `<div class="detail-links">${links}</div>` : ''}
    </div>
    ${gallery ? `<div class="gallery">${gallery}</div>` : ''}
    ${readmeHtml ? `<div class="readme">${readmeHtml}</div>` : ''}`;
}

function notFound() {
  document.getElementById('content').innerHTML =
    `<div class="notfound"><p>查無此作品。</p><p><a href="index.html">← 回首頁</a></p></div>`;
}

async function main() {
  const id = getId();
  if (!id) return notFound();
  try {
    const projects = await fetch('projects.json').then(r => r.json());
    const p = projects.find(x => x.id === id);
    p ? render(p) : notFound();
  } catch (e) {
    document.getElementById('content').innerHTML =
      `<div class="notfound">資料載入失敗：${esc(e.message)}</div>`;
  }
}

main();
