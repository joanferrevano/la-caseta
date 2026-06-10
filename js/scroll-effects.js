/* ─── scroll-effects.js ──────────────────────────────────────── */

/* ══════════════════════════════════════════════════════════════
   INTRO: texto 3D que hace zoom-in al hacer scroll
   ══════════════════════════════════════════════════════════════ */
(function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  const title   = document.getElementById('intro-title');
  const spacer  = document.getElementById('intro-spacer');
  if (!overlay || !title || !spacer) return;

  /* ─ Partículas doradas cayendo ─ */
  const canvas = document.getElementById('intro-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const COLORS = ['#D4B483','#E8DCCB','#c8aa7a','#f0ddb0','#B7C4B1','#5E8FA8'];

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const PARTICLE_COUNT = window.innerWidth < 768 ? 20 : 50;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight - window.innerHeight,
      vy:      0.4 + Math.random() * 1.1,
      size:    0.8 + Math.random() * 2.2,
      alpha:   0.1 + Math.random() * 0.55,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      tailLen: 8 + Math.random() * 32,
    }));

    let particlesActive = true;
    (function drawLoop() {
      if (!particlesActive) return; /* para el loop cuando el overlay se oculta */
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        const grad = ctx.createLinearGradient(p.x, p.y - p.tailLen, p.x, p.y + p.size);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        const hex = Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        grad.addColorStop(1, p.color + hex);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = p.size * 0.65;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.tailLen);
        ctx.lineTo(p.x, p.y + p.size);
        ctx.stroke();
        ctx.fillStyle = p.color + hex;
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
      requestAnimationFrame(drawLoop);
    })();

    /* exponer referencia para poder parar el loop desde updateIntro */
    canvas._stopParticles = () => { particlesActive = false; };
  }

  /* ─ Zoom + fade controlado por scroll ─
     El spacer mide 250vh → ese es el recorrido total.
     0 scroll     → escala 1   (texto normal, centrado)
     ~60% scroll  → escala 9   (texto ocupa toda la pantalla)
     ~80% scroll  → fade-out
     100% spacer  → overlay oculto, aparece la página
  */
  const isMobile      = window.innerWidth < 768;
  const SCALE_MAX     = isMobile ? 5 : 11;
  const FADE_START    = isMobile ? 0.60 : 0.72;
  const SPACER_HEIGHT = () => isMobile
    ? window.innerHeight * 1.6
    : spacer.offsetHeight;

  let currentScroll = 0;
  let targetScroll  = 0;
  let rafRunning    = false;

  function onScroll() {
    targetScroll = window.scrollY;
    if (!rafRunning) {
      rafRunning = true;
      requestAnimationFrame(rafLoop);
    }
  }

  function rafLoop() {
    if (isMobile) {
      currentScroll += (targetScroll - currentScroll) * 0.12;
    } else {
      currentScroll = targetScroll;
    }

    updateIntro(currentScroll);

    if (Math.abs(targetScroll - currentScroll) > 0.5) {
      requestAnimationFrame(rafLoop);
    } else {
      currentScroll = targetScroll;
      updateIntro(currentScroll);
      rafRunning = false;
    }
  }

  function updateIntro(scrolled) {
    const total = SPACER_HEIGHT();
    const pct   = Math.min(1, scrolled / total);

    const easedPct = pct < 0.5
      ? 2 * pct * pct
      : 1 - Math.pow(-2 * pct + 2, 2) / 2;
    const scale = 1 + easedPct * (SCALE_MAX - 1);

    const titleOpacity = pct < FADE_START
      ? 1
      : Math.max(0, 1 - (pct - FADE_START) / (1 - FADE_START));

    const overlayOpacity = pct < 0.85
      ? 1
      : Math.max(0, 1 - (pct - 0.85) / 0.15);

    title.style.transform = `scale(${scale})`;
    title.style.opacity   = titleOpacity;
    overlay.style.opacity = overlayOpacity;

    const hint = overlay.querySelector('.intro-scroll-hint');
    if (hint) {
      hint.style.opacity = pct < 0.15 ? '' : Math.max(0, 1 - (pct - 0.15) / 0.15);
    }

    if (overlayOpacity <= 0.01) {
      overlay.style.display = 'none';
    } else {
      overlay.style.display = '';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateIntro(window.scrollY);
})();


/* ══════════════════════════════════════════════════════════════
   NAV: .scrolled al bajar del spacer
   ══════════════════════════════════════════════════════════════ */
(function initNavScroll() {
  const nav    = document.getElementById('siteNav');
  const spacer = document.getElementById('intro-spacer');
  if (!nav) return;

  const onScroll = () => {
    const threshold = spacer ? spacer.offsetHeight + 60 : 60;
    nav.classList.toggle('scrolled', window.scrollY > threshold);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL genérico
   ══════════════════════════════════════════════════════════════ */
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


/* ══════════════════════════════════════════════════════════════
   TIMELINE — entry animations + active-item highlight
   IntersectionObserver adds .visible (fires CSS transitions).
   A separate scroll listener adds/removes .active on whichever
   item is closest to the viewport center.
   ══════════════════════════════════════════════════════════════ */
(function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  /* ── Entry: add .visible when item is 40% in view ── */
  const entryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  items.forEach(item => entryObserver.observe(item));

  /* ── Active highlight: item whose center is closest to mid-viewport ── */
  function updateActiveItem() {
    const viewMid = window.innerHeight / 2;
    items.forEach(item => {
      const rect      = item.getBoundingClientRect();
      const itemMid   = rect.top + rect.height / 2;
      const distance  = Math.abs(itemMid - viewMid);
      /* Mark active if within 35% of the viewport height from center */
      item.classList.toggle('active', distance < window.innerHeight * 0.35);
    });
  }

  window.addEventListener('scroll', updateActiveItem, { passive: true });
  updateActiveItem();
})();


/* ══════════════════════════════════════════════════════════════
   TIMELINE SVG — diagonal "sabre" line
   Builds a bezier zigzag path through all editions, then
   animates stroke-dashoffset as the user scrolls #historia.
   Also drives the lateral nav dots (active state + show/hide).

   FIX — two bugs resolved vs. previous version:
   1. buildPath() deferred with double-rAF so the section has
      its final scrollHeight before getTotalLength() is called.
   2. Progress formula uses absolute scroll math (window.scrollY)
      so pct correctly maps 0→1 over the whole section height.
   ══════════════════════════════════════════════════════════════ */
(function initTimelineSVG() {
  const section = document.getElementById('historia');
  const svg     = document.getElementById('timeline-svg');
  const path    = document.getElementById('timeline-path');
  const navEl   = document.querySelector('.tl-nav-dots');
  const navDots = Array.from(document.querySelectorAll('.tl-dot-btn'));

  if (!section || !svg || !path) return;

  const isMobile = () => window.innerWidth < 768;

  let totalLength = 0;
  let activeIndex = -1;
  let rafPending  = false;

  /* ── Catmull-Rom → cubic Bézier ────────────────────────────
     Catmull-Rom guarantees the curve PASSES THROUGH every point.
     alpha = 0.5 gives a centripetal parameterisation (no cusps).
  ─────────────────────────────────────────────────────────── */
  function catmullRomToBezier(pts) {
    if (pts.length < 2) return '';
    const alpha = 0.5;
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const cp1x = p1.x + (p2.x - p0.x) * alpha / 3;
      const cp1y = p1.y + (p2.y - p0.y) * alpha / 3;
      const cp2x = p2.x - (p3.x - p1.x) * alpha / 3;
      const cp2y = p2.y - (p3.y - p1.y) * alpha / 3;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  /* ── Build sinusoidal zigzag path ───────────────────────────
     Each edition contributes a point at its vertical center,
     alternating left (18%) / right (82%) of the viewport width.
     The curve passes through every point — no right angles.
  ─────────────────────────────────────────────────────────── */
  function buildPath() {
    if (isMobile()) { totalLength = 0; return; }

    const W     = section.offsetWidth;
    const H     = section.scrollHeight;
    const items = Array.from(section.querySelectorAll('.tl-item'));
    const count = items.length;
    if (count === 0) return;

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const pts = [];

    /* One point per edition — at its vertical center */
    items.forEach((item, i) => {
      const cy   = item.offsetTop + item.offsetHeight / 2;
      const side = i % 2 === 0 ? W * 0.18 : W * 0.82;
      pts.push({ x: side, y: cy });
    });

    /* Exit point: bottom, opposite side from last edition */
    pts.push({ x: count % 2 === 0 ? W * 0.72 : W * 0.28, y: H });

    /* Prepend two anchor points so the line visibly leads INTO the first
       edition from above, not starting at its center mid-scroll.
       y=0 anchor at 65% width + a midpoint at 30% of firstItem center. */
    const firstCenter = items[0].offsetTop + items[0].offsetHeight / 2;
    pts.unshift({ x: W * 0.5,  y: Math.max(0, firstCenter * 0.3) });
    pts.unshift({ x: W * 0.65, y: 0 });

    path.setAttribute('d', catmullRomToBezier(pts));

    /* Measure length one frame later, then sync dashoffset with current scroll */
    requestAnimationFrame(() => {
      const len = path.getTotalLength();
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
      totalLength = len;
      onScroll(); /* apply correct progress immediately */
    });
  }

  /* ── Scroll: animate dashoffset + nav dots ── */
  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      if (!totalLength) return;

      const sectionRect = section.getBoundingClientRect();
      const sectionTop  = sectionRect.top + window.scrollY;

      /* Start counting progress when the first item reaches mid-viewport,
         not when the #historia top (which includes a header) enters the screen. */
      const firstItem    = section.querySelector('.tl-item');
      const startY       = firstItem
        ? window.scrollY + firstItem.getBoundingClientRect().top - window.innerHeight * 0.5
        : sectionTop;
      const endY         = sectionTop + section.scrollHeight - window.innerHeight;
      const scrolled     = Math.max(0, window.scrollY - startY);
      const scrollRange  = Math.max(1, endY - startY);
      const pct          = Math.min(1, scrolled / scrollRange);

      path.style.strokeDashoffset = (totalLength * (1 - pct)).toFixed(2);

      /* Nav dots: mark the edition closest to viewport center */
      const items = Array.from(section.querySelectorAll('.tl-item'));
      const mid   = window.innerHeight / 2;
      let newActive = -1, closest = Infinity;
      items.forEach((item, i) => {
        const r    = item.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < closest) { closest = dist; newActive = i; }
      });
      if (newActive !== activeIndex) {
        navDots.forEach((dot, i) => dot.classList.toggle('is-active', i === newActive));
        activeIndex = newActive;
      }

      /* Show nav only while scrolling through #historia */
      if (navEl) {
        const rect      = section.getBoundingClientRect();
        const inSection = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
        navEl.classList.toggle('visible', inSection);
      }
    });
  }

  /* ── Nav dot clicks ── */
  navDots.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ── Init: double-rAF ensures the section has its real scrollHeight ── */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      buildPath();
      onScroll();
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    totalLength = 0;
    requestAnimationFrame(buildPath);
  });
})();


/* ══════════════════════════════════════════════════════════════
   PROXIMA VIDEO — lazy-load the background video when the
   section enters the viewport (avoids loading on page start).
   ══════════════════════════════════════════════════════════════ */
(function initProximaVideo() {
  const section = document.getElementById('proxima');
  const video   = document.getElementById('proximaVideo');
  if (!section || !video) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !video.src) {
        video.src = video.dataset.src;
        video.play().catch(() => {});
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(section);
})();


/* ══════════════════════════════════════════════════════════════
   PROXIMA — parallax on ::before numeral via --parallax-y
   ══════════════════════════════════════════════════════════════ */
(function initNextEditionParallax() {
  const section = document.getElementById('proxima');
  if (!section) return;

  let raf = false;

  function update() {
    const rect   = section.getBoundingClientRect();
    const viewH  = window.innerHeight;
    /* Map section center position to a small vertical offset */
    const center = rect.top + rect.height / 2 - viewH / 2;
    const offset = center * 0.08; /* subtle: 8% of distance from center */
    section.style.setProperty('--parallax-y', offset.toFixed(2) + 'px');
  }

  window.addEventListener('scroll', () => {
    if (!raf) {
      raf = true;
      requestAnimationFrame(() => { update(); raf = false; });
    }
  }, { passive: true });

  update();
})();