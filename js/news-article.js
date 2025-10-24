/* ================================
   PARSHA.JS — Gihon Hebrew Synagogue
   ================================ */

// -------------------------------
// Mobile Drawer (hamburger menu)
// -------------------------------
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
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();


// -------------------------------
// Load Weekly Parsha
// -------------------------------
async function loadParsha() {
  try {
    // Adjust path if your JSON is inside /data/
    const res = await fetch('data/parsha.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load parsha.json (${res.status})`);

    const parshiot = await res.json();

    // Auto-rotate weekly (based on week number in year)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - firstDay) / (24 * 60 * 60 * 1000));
    const weekNum = Math.floor(days / 7) % parshiot.length;
    const parsha = parshiot[weekNum];

    if (!parsha) throw new Error('No parsha found for this week.');

    // If we're on the home page
    const summaryEl = document.getElementById('parshaSummary');
    const titleEl = document.getElementById('parshaTitle');

    // If we're on the parsha.html page
    const fullEl = document.getElementById('parshaFull');
    const nameEl = document.getElementById('parshaName');
    const hebrewEl = document.getElementById('parshaHebrew');
    const refsEl = document.getElementById('parshaRefs');

    if (summaryEl && titleEl) {
      // index.html
      titleEl.textContent = parsha.english;
      summaryEl.textContent = parsha.summary;
    }

    if (fullEl && nameEl && hebrewEl) {
      // parsha.html
      nameEl.textContent = parsha.english;
      hebrewEl.textContent = parsha.hebrew;
      fullEl.textContent = parsha.full;

      if (refsEl && parsha.refs) {
        refsEl.innerHTML = parsha.refs.map(r => `<a href="#" class="ref">${r}</a>`).join('<span class="sep"> • </span>');
      }
    }

  } catch (err) {
    console.error('Error loading parsha:', err);
    const errEl = document.getElementById('parshaFull') || document.getElementById('parshaSummary');
    if (errEl) errEl.textContent = 'Unable to load Parsha content.';
  }
}

document.addEventListener('DOMContentLoaded', loadParsha);