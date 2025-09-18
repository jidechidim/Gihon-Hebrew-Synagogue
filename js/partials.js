import { initHeader } from './header.js';

async function inject(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return false;
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    host.innerHTML = await res.text();
    return true;
  } catch (err) {
    console.error(`Failed to load ${url}:`, err);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Detect if running on GitHub Pages (domain includes github.io)
  const onGithub = window.location.hostname.includes('github.io');

  // Base path: local (./partials/) vs GitHub Pages (/REPO/partials/)
  const base = onGithub
    ? '/Gihon-Hebrew-Synagogue/partials/'
    : './partials/';

  const okHeader = await inject('#__header', base + 'header.html');
  await inject('#__footer', base + 'footer.html');

  if (okHeader) initHeader();

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});