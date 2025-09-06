const LIST_EL = document.getElementById('newsList');

async function getArticles() {
  const res = await fetch('/data/articles.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load articles.json');
  return res.json();
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return iso; }
}

function renderList(items) {
  // newest first
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  LIST_EL.innerHTML = items.map(a => `
    <article class="post">
      <a class="post-media" href="/news-article.html?slug=${encodeURIComponent(a.slug)}" aria-label="${a.title}">
        <img src="${a.thumb}" alt="${a.title}">
      </a>
      <h2 class="post-title">
        <a href="/news-article.html?slug=${encodeURIComponent(a.slug)}">${a.title}</a>
      </h2>
      <p class="post-excerpt">${a.excerpt}</p>
      <a class="post-more" href="/news-article.html?slug=${encodeURIComponent(a.slug)}">Read more →</a>
    </article>
  `).join('');
}

getArticles()
  .then(renderList)
  .catch(err => {
    console.error(err);
    LIST_EL.innerHTML = `<p>Unable to load news at the moment.</p>`;
  });