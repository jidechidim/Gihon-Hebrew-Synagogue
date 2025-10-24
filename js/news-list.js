const LIST_EL = document.getElementById('newsList');

async function getArticles() {
  try {
    const res = await fetch('./data/news.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load news.json');
    const articles = await res.json();

    // Sort newest first
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderList(articles);
  } catch (err) {
    console.error(err);
    LIST_EL.innerHTML = `<p>Unable to load news at the moment.</p>`;
  }
}

function renderList(items) {
  LIST_EL.innerHTML = items
    .map(post => `
      <article class="post">
        <a class="post-media" href="news-article.html?slug=${encodeURIComponent(post.id)}">
          <img src="${post.image}" alt="${post.title}">
        </a>
        <div class="post-body">
          <h3 class="post-title">
            <a href="news-article.html?slug=${encodeURIComponent(post.id)}">${post.title}</a>
          </h3>
          <p class="post-excerpt">${post.summary}</p>
          <a class="post-more" href="news-article.html?slug=${encodeURIComponent(post.id)}">Read More</a>
        </div>
      </article>
    `)
    .join('');
}

// Load articles on page load
document.addEventListener('DOMContentLoaded', getArticles);
