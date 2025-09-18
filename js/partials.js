// /js/partials.js
import { initHeader } from './header.js';

// Resolve paths relative to the JS file location (…/js/)
const ROOT = new URL('..', import.meta.url); // parent folder of /js

async function inject(selector, fileName) {
  const host = document.querySelector(selector);
  if (!host) return false;

  try {
    // Looks for …/partials/<fileName> next to your /js folder
    const url = new URL(`partials/${fileName}`, ROOT).href;
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    host.innerHTML = await res.text();
    return true;
  } catch (err) {
    console.error(`[partials] Failed to inject ${fileName}:`, err);
    host.innerHTML = ''; // keep DOM clean if injection fails
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const headerOk = await inject('#__header', 'header.html');
  await inject('#__footer', 'footer.html');
  if (headerOk) initHeader?.();

  // Year in footer (optional)
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});