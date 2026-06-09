/* ─── main.js ────────────────────────────────────────────────── */

/* ── Hero entrance animations ── */
(function initHeroAnims() {
  const items = document.querySelectorAll('[data-anim]');
  if (!items.length) return;

  items.forEach(el => {
    const delay = parseInt(el.dataset.delay || '0', 10);
    el.style.animationDelay = delay + 'ms';
    // Small timeout so CSS transition is already applied
    requestAnimationFrame(() => {
      el.classList.add('anim-in');
    });
  });
})();


/* ── Gallery slider ── */
(function initSlider() {
  const track    = document.getElementById('sliderTrack');
  const progress = document.getElementById('sliderProgress');
  const btnPrev  = document.getElementById('btnPrev');
  const btnNext  = document.getElementById('btnNext');

  if (!track) return;

  const cardWidth = () => {
    const card = track.querySelector('.gallery-card');
    return card ? card.offsetWidth + 24 : 344; // 24px = 1.5rem gap
  };

  btnNext && btnNext.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });

  btnPrev && btnPrev.addEventListener('click', () => {
    track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });

  // Update progress bar
  const updateProgress = () => {
    const max  = track.scrollWidth - track.clientWidth;
    const pct  = max > 0 ? track.scrollLeft / max : 0;
    const fill = 25 + pct * 75; // 25% → 100%
    if (progress) progress.style.width = fill + '%';
  };

  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Drag-to-scroll (mouse)
  let isDragging = false;
  let startX, scrollStart;

  track.addEventListener('mousedown', (e) => {
    isDragging  = true;
    startX      = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.2;
    track.scrollLeft = scrollStart - walk;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
})();
