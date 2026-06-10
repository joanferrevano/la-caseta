/* ─── main.js ────────────────────────────────────────────────── */

/* ── Hero entrance animations (se ejecutan al entrar en viewport) ── */
(function initHeroAnims() {
  const items = document.querySelectorAll('[data-anim]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        el.style.animationDelay = delay + 'ms';
        requestAnimationFrame(() => el.classList.add('anim-in'));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(el => observer.observe(el));
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
    return card ? card.offsetWidth + 24 : 344;
  };

  btnNext && btnNext.addEventListener('click', () =>
    track.scrollBy({ left: cardWidth(), behavior: 'smooth' })
  );
  btnPrev && btnPrev.addEventListener('click', () =>
    track.scrollBy({ left: -cardWidth(), behavior: 'smooth' })
  );

  const updateProgress = () => {
    const max  = track.scrollWidth - track.clientWidth;
    const pct  = max > 0 ? track.scrollLeft / max : 0;
    if (progress) progress.style.width = (25 + pct * 75) + '%';
  };

  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* Drag-to-scroll */
  let isDragging = false, startX, scrollStart;
  track.addEventListener('mousedown', e => {
    isDragging  = true;
    startX      = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    track.scrollLeft = scrollStart - (e.pageX - track.offsetLeft - startX) * 1.2;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
})();