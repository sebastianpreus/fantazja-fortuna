/* ── MENU ── */
const hamburger     = document.querySelector('.hamburger');
const menuOverlay   = document.querySelector('.menu-overlay');
const menuLinks     = document.querySelectorAll('.menu-overlay nav a');

function toggleMenu(open) {
  const state = open ?? !menuOverlay.classList.contains('open');
  hamburger.classList.toggle('open', state);
  menuOverlay.classList.toggle('open', state);
  document.body.style.overflow = state ? 'hidden' : '';
}

hamburger?.addEventListener('click', () => toggleMenu());
menuOverlay?.addEventListener('click', e => { if (e.target === menuOverlay) toggleMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
menuLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

/* Podświetl aktywny link w menu */
const currentPage = location.pathname.split('/').pop() || 'index.html';
menuLinks.forEach(l => {
  if (l.getAttribute('href') === currentPage) l.classList.add('active');
});

/* ── NAV: klasa przy scrollu ── */
const nav = document.querySelector('.nav');
const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── JĘZYK PL/EN ── */
const LANG_KEY = 'ff_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'pl';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-pl][data-en]').forEach(el => {
    el.textContent = el.dataset[lang] || el.textContent;
  });
  document.querySelectorAll('[data-pl-html][data-en-html]').forEach(el => {
    el.innerHTML = el.dataset[lang + 'Html'] || el.innerHTML;
  });

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-toggle button').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

applyLang(currentLang);

/* ── FADE-IN przy scrollu ── */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}

/* ── GALERIA LIGHTBOX ── */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.querySelector('.lightbox');
const lbImg        = document.querySelector('.lightbox__img');
const lbClose      = document.querySelector('.lightbox__close');
const lbPrev       = document.querySelector('.lightbox__prev');
const lbNext       = document.querySelector('.lightbox__next');

if (galleryItems.length && lightbox) {
  let currentIdx = 0;
  const images = [...galleryItems].map(item => item.querySelector('img').src);

  function openLightbox(idx) {
    currentIdx = idx;
    lbImg.src = images[idx];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showNext() { openLightbox((currentIdx + 1) % images.length); }
  function showPrev() { openLightbox((currentIdx - 1 + images.length) % images.length); }

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  lbClose?.addEventListener('click', closeLightbox);
  lbNext?.addEventListener('click', showNext);
  lbPrev?.addEventListener('click', showPrev);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'Escape')     closeLightbox();
  });
}
