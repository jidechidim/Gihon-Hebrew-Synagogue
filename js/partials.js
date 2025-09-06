import { initHeader } from './header.js';

async function inject(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return false;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) { console.error('Failed to load', url, res.status); return false; }
  host.innerHTML = await res.text();
  return true;
}

document.addEventListener('DOMContentLoaded', async () => {
  const okHeader = await inject('#__header', './partials/header.html');
  await inject('#__footer', './partials/footer.html');
  if (okHeader) initHeader();

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
