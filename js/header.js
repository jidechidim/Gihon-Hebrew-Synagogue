export function initHeader(){
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!header) return;

  const transparent = document.body.dataset.header === 'transparent';
  const THRESHOLD = 56;

  function onScroll(){
    if (!transparent) { header.classList.add('scrolled'); return; }
    if (window.scrollY > THRESHOLD) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  function openDrawer(open){
    if (!hamburger || !mobileNav || !backdrop) return;
    mobileNav.classList.toggle('open', open);
    backdrop.classList.toggle('show', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  hamburger?.addEventListener('click', () => openDrawer(!mobileNav.classList.contains('open')));
  backdrop?.addEventListener('click', () => openDrawer(false));
  document.querySelectorAll('.drawer-link').forEach(a => a.addEventListener('click', () => openDrawer(false)));
}