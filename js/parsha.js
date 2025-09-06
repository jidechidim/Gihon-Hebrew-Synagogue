// Mobile drawer controls (same pattern as your landing page)
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const backdrop = document.getElementById('drawerBackdrop');

function toggleDrawer(open) {
  if (open) {
    mobileNav.classList.add('open');
    backdrop.classList.add('show');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  } else {
    mobileNav.classList.remove('open');
    backdrop.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    toggleDrawer(!isOpen);
  });
}
if (backdrop) backdrop.addEventListener('click', () => toggleDrawer(false));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* ----------------------------
   Parsha in-page search
   - Highlights matches with <mark>
   - Shows result count
----------------------------- */
const input = document.getElementById('q');
const meta = document.getElementById('resultMeta');
const reading = document.querySelector('.container.reading');

// Keep original HTML to reset highlights
const originalHtml = reading.innerHTML;
let lastQuery = '';

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(query) {
  // Reset on empty
  if (!query.trim()) {
    reading.innerHTML = originalHtml;
    meta.textContent = '';
    lastQuery = '';
    return;
  }
  if (query === lastQuery) return;

  // Build regex (case-insensitive)
  const rx = new RegExp(escapeRegExp(query), 'gi');

  // Replace inside paragraphs only, preserve structure
  const paras = Array.from(new DOMParser()
    .parseFromString(originalHtml, 'text/html')
    .querySelectorAll('p'));

  let count = 0;
  const replaced = paras.map(p => {
    const html = p.innerHTML;
    const replacedHtml = html.replace(rx, (m) => {
      count++;
      return `<mark>${m}</mark>`;
    });
    return `<p>${replacedHtml}</p>`;
  }).join('\n');

  reading.innerHTML = replaced;
  meta.textContent = count
    ? `Found ${count} match${count === 1 ? '' : 'es'} for “${query}”.`
    : `No matches for “${query}”.`;

  lastQuery = query;
}

if (input) {
  input.addEventListener('input', (e) => highlight(e.target.value));
  input.addEventListener('search', (e) => highlight(e.target.value)); // supports clear button in Safari/iOS
}