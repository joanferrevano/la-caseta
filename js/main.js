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


