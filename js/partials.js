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
    console.error('Error fetching', url, err);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Detect if running on GitHub Pages
  const onGithub = location.hostname.includes('github.io');

  // Base path: local (./partials/) vs GitHub Pages (/REPO/partials/)
  const base = onGithub
    ? '/Gihon-Hebrew-Synagogue/partials/'
    : './partials/';
    
  // Inject header + footer
  const okHeader = await inject('#__header', base + 'header.html');
  await inject('#__footer', base + 'footer.html');

  // Initialize header JS if loaded
  if (okHeader) initHeader();

  // Auto-update footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
