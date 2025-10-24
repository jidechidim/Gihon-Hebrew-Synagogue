// Smooth header state on scroll (transparent -> white)
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 10) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile drawer
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobileNav');
const backdrop = document.getElementById('drawerBackdrop');
const drawerLinks = drawer.querySelectorAll('a');

function openDrawer() {
  drawer.classList.add('open');
  backdrop.classList.add('show');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  backdrop.classList.remove('show');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  expanded ? closeDrawer() : openDrawer();
});
backdrop.addEventListener('click', closeDrawer);
drawerLinks.forEach(a => a.addEventListener('click', closeDrawer));
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// Newsletter form (basic UX validation)
const form = document.getElementById('newsletterForm');
const emailInput = document.getElementById('email');
const msg = document.getElementById('newsletterMsg');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = emailInput.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!ok) {
      msg.textContent = 'Please enter a valid email address.';
      msg.style.color = '#b91c1c';
      emailInput.focus();
      return;
    }
    // Pretend to submit…
    msg.textContent = 'Thanks! You are subscribed.';
    msg.style.color = '#166534';
    form.reset();
  });
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

async function loadParsha() {
  try {
    const res = await fetch('parsha.json');
    const data = await res.json();

    // Auto-select based on week of the year (1–54)
    const weekNum = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    const index = (weekNum - 1) % data.length;
    const parsha = data[index];

    // Update homepage content
    const parshaName = document.getElementById('parshaName');
    const parshaHebrew = document.getElementById('parshaHebrew');
    const parshaSummary = document.getElementById('parshaSummary');
    const parshaLink = document.getElementById('parshaLink');

    if (parshaName) parshaName.textContent = parsha.english;
    if (parshaHebrew) parshaHebrew.textContent = parsha.hebrew;
    if (parshaSummary) parshaSummary.textContent = parsha.summary;
    if (parshaLink) parshaLink.href = `parsha.html?id=${parsha.id}`;
  } catch (err) {
    console.error("Error loading Parsha:", err);
  }
}
loadParsha();