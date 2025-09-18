import { initHeader } from './header.js';

async function inject(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return false;

  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) {
      console.error('Failed to load', url, res.status);
      return false;
    }
    host.innerHTML = await res.text();
    return true;
  } catch (err) {
    console.error('Fetch error for', url, err);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // IMPORTANT: prefix with repo name
  const repo = 'Gihon-Hebrew-Synagogue';

  const okHeader = await inject('#__header', `/${repo}/partials/header.html`);
  await inject('#__footer', `/${repo}/partials/footer.html`);

  if (okHeader) initHeader();

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});