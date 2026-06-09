/* ─── scroll-effects.js ──────────────────────────────────────── */

/* ── Nav: .scrolled al bajar del hero ── */
(function initNavScroll() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Scroll reveal genérico ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
})();


/* ── Timeline items ── */
(function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  items.forEach(item => observer.observe(item));
})();


/* ── Hero: zoom-out en scroll + partículas doradas ── */
(function initHeroScroll() {
  const hero       = document.getElementById('hero');
  const heroTitle  = hero && hero.querySelector('.hero-title');
  const heroEdition = hero && hero.querySelector('.hero-edition');
  const heroDivider = hero && hero.querySelector('.hero-divider');
  const heroSub    = hero && hero.querySelector('.hero-subtitle');
  const heroScroll = hero && hero.querySelector('.hero-scroll');
  const canvas     = document.getElementById('hero-canvas');

  if (!hero || !heroTitle || !canvas) return;

  /* ─ Partículas ─ */
  const ctx = canvas.getContext('2d');
  const COLORS = ['#D4B483', '#E8DCCB', '#B7C4B1', '#F8F6F1', '#c8aa7a', '#5E8FA8'];
  const COUNT  = 45;

  function resizeCanvas() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const particles = Array.from({ length: COUNT }, () => ({
    x:      Math.random() * canvas.width,
    y:      Math.random() * canvas.height - canvas.height,
    vy:     0.35 + Math.random() * 1.0,
    size:   0.8 + Math.random() * 2.0,
    alpha:  0.12 + Math.random() * 0.5,
    color:  COLORS[Math.floor(Math.random() * COLORS.length)],
    tailLen: 8 + Math.random() * 30,
  }));

  (function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.save();
      const tail = ctx.createLinearGradient(p.x, p.y - p.tailLen, p.x, p.y + p.size);
      tail.addColorStop(0, 'rgba(0,0,0,0)');
      tail.addColorStop(1, p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0'));
      ctx.strokeStyle = tail;
      ctx.lineWidth   = p.size * 0.65;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.tailLen);
      ctx.lineTo(p.x, p.y + p.size);
      ctx.stroke();
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y += p.vy;
      if (p.y > canvas.height + 20) {
        p.y = -p.tailLen - 10;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(drawParticles);
  })();

  /* ─ Zoom-out del título al hacer scroll ─ */
  const MAX_SCALE  = 2.0;  /* escala inicial (grande) */
  const MIN_SCALE  = 1.0;  /* escala final (normal) */
  const ZOOM_RANGE = hero.offsetHeight * 0.55; /* distancia de scroll para completar el efecto */

  function onScroll() {
    const y   = window.scrollY;
    const pct = Math.min(1, y / ZOOM_RANGE);

    /* Escala del título: de MAX_SCALE → MIN_SCALE */
    const scale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * pct;
    heroTitle.style.transform = `scale(${scale})`;

    /* Fade-out de elementos secundarios al bajar */
    const fadeSec = Math.max(0, 1 - pct * 2.2);
    if (heroEdition)  heroEdition.style.opacity  = fadeSec;
    if (heroDivider)  heroDivider.style.opacity  = fadeSec;
    if (heroSub)      heroSub.style.opacity       = fadeSec;
    if (heroScroll)   heroScroll.style.opacity    = Math.max(0, 1 - pct * 3);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* estado inicial */
})();