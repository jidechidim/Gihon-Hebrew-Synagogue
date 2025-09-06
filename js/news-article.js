import { fetchJSONWithFallback } from './fetch-json.js';

const articleEl = document.getElementById('article');
const msgEl     = document.getElementById('articleMsg');

(async function init() {
  try {
    const slug = new URLSearchParams(location.search).get('slug');
    if (!slug) {
      msgEl.textContent = 'Missing article slug.';
      return;
    }

    const articles = await fetchJSONWithFallback([
      './data/articles.json',
      '/data/articles.json',
      '../data/articles.json'
    ]);

    const a = articles.find(x => x.slug === slug);
    if (!a) {
      msgEl.textContent = 'Article not found.';
      return;
    }

    renderArticle(a);
    msgEl.textContent = '';
  } catch (err) {
    console.error(err);
    msgEl.textContent = 'Unable to load this article right now.';
  }
})();

function renderArticle(a) {
  const date = safeDate(a.date);
  const bodyHTML = Array.isArray(a.body) ? a.body.map(p => `<p>${escapeHTML(p)}</p>`).join('') : '';

  articleEl.innerHTML = `
    <header class="article-head">
      <h1>${escapeHTML(a.title)}</h1>
      <p class="article-meta">
        ${date ? `<span class="article-date">${date}</span>` : ''}
        ${a.author ? `<span class="sep">•</span> <span class="article-author">${escapeHTML(a.author)}</span>` : ''}
      </p>
    </header>

    ${a.hero ? `<figure class="article-figure">
      <img src="${escapeAttr(a.hero)}" alt="${escapeAttr(a.title)}">
    </figure>` : ''}

    <div class="article-body">
      ${bodyHTML}
    </div>

    <nav class="pager">
      <a class="pager-link prev" href="/news.html"><span aria-hidden="true">‹</span> Back to News</a>
      <a class="pager-link next" href="/news.html">More Articles <span aria-hidden="true">›</span></a>
    </nav>
  `;
}

function safeDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHTML(s='') {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(s='') { return escapeHTML(String(s)); }