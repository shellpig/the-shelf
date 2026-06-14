// 首頁：讀 site.json + projects.json，渲染大標、自我介紹與卡片牆。

const ICONS = {
  github: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderHero(site) {
  document.title = site.title || "作品集";
  const contacts = (site.contacts || []).map(c =>
    `<a href="${esc(c.url)}">${ICONS[c.icon] || ''}<span>${esc(c.label)}</span></a>`
  ).join('');
  document.getElementById('hero').innerHTML = `
    <h1>${esc(site.title || '')}</h1>
    ${site.tagline ? `<p class="tagline">${esc(site.tagline)}</p>` : ''}
    ${site.intro ? `<p class="intro">${esc(site.intro)}</p>` : ''}
    ${contacts ? `<div class="contacts">${contacts}</div>` : ''}`;
}

function coverHtml(p) {
  if (p.cover) {
    return `<div class="cover"><img src="${esc(p.cover)}" alt="${esc(p.title)} 封面"></div>`;
  }
  const letter = (p.title || '?').trim().charAt(0);
  return `<div class="cover placeholder"><span class="ph-letter">${esc(letter)}</span></div>`;
}

function cardHtml(p) {
  const tags = (p.tech || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
  return `
    <a class="card" href="detail.html?id=${encodeURIComponent(p.id)}">
      ${coverHtml(p)}
      <div class="card-body">
        <h2 class="card-title">${esc(p.title)}</h2>
        <p class="card-summary">${esc(p.summary || '')}</p>
        ${tags ? `<div class="tags">${tags}</div>` : ''}
      </div>
    </a>`;
}

async function main() {
  try {
    const [site, projects] = await Promise.all([
      fetch('site.json').then(r => r.json()),
      fetch('projects.json').then(r => r.json()),
    ]);
    renderHero(site);
    document.getElementById('grid').innerHTML = projects.map(cardHtml).join('');
  } catch (e) {
    document.getElementById('grid').innerHTML =
      `<p class="notfound">資料載入失敗：${esc(e.message)}</p>`;
  }
}

main();
