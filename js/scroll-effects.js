/* ═══════════════════════════════════════════════════════════════
   SCROLL-EFFECTS.JS
   A. Scroll path SVG animation (stroke-dashoffset)
   B. Lighting overlay on hero
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const { clamp, mapRange } = window.LaCaseta;

  /* ─────────────────────────────────────────────
     A. Scroll Path SVG
  ───────────────────────────────────────────── */
  const svg        = document.getElementById('scroll-path-svg');
  const pathEl     = svg ? svg.querySelector('path') : null;
  const historia   = document.getElementById('historia');

  let pathLength = 0;

  function initScrollPath() {
    if (!pathEl) return;

    pathLength = pathEl.getTotalLength();

    /* Start fully hidden */
    pathEl.style.strokeDasharray  = pathLength;
    pathEl.style.strokeDashoffset = pathLength;
  }

  function updateScrollPath() {
    if (!pathEl || !historia) return;

    const heroHeight    = window.innerHeight;
    const historiaTop   = historia.getBoundingClientRect().top + window.scrollY;
    const historiaBot   = historiaTop + historia.offsetHeight;

    /* Scroll range: from hero bottom to end of historia */
    const scrollStart = historiaTop - window.innerHeight * 0.8;
    const scrollEnd   = historiaBot - window.innerHeight * 0.3;
    const scrollY     = window.scrollY;

    const progress  = clamp((scrollY - scrollStart) / (scrollEnd - scrollStart), 0, 1);
    const dashOffset = pathLength * (1 - progress);

    pathEl.style.strokeDashoffset = dashOffset;

    /* Expose head position in viewport Y for timeline ignition */
    if (progress > 0 && progress < 1) {
      const headPoint = pathEl.getPointAtLength(pathLength * progress);
      const svgRect   = svg.getBoundingClientRect();
      window.__LIGHT_PATH_HEAD_Y__ = svgRect.top + headPoint.y;
    } else if (progress === 0) {
      window.__LIGHT_PATH_HEAD_Y__ = -9999;
    } else {
      window.__LIGHT_PATH_HEAD_Y__ = 9999;
    }
  }

  /* ─────────────────────────────────────────────
     B. Hero lighting overlay
  ───────────────────────────────────────────── */
  const overlay = document.getElementById('bg-lighting-overlay');

  function updateLightingOverlay() {
    if (!overlay) return;
    const scrollY     = window.scrollY;
    const heroHeight  = window.innerHeight;
    const opacity     = mapRange(scrollY, 0, heroHeight * 0.6, 0, 0.15);
    overlay.style.opacity = opacity.toFixed(3);
  }

  /* ─────────────────────────────────────────────
     Next-edition section reveal
  ───────────────────────────────────────────── */
  const proxima   = document.getElementById('proxima');
  let neRevealed  = false;

  const neEls = proxima ? [
    proxima.querySelector('.ne-label'),
    proxima.querySelector('.ne-h2'),
    proxima.querySelector('.ne-title'),
    proxima.querySelector('.ne-desc'),
    proxima.querySelector('.ne-btn-primary'),
    proxima.querySelector('.ne-btn-secondary'),
  ] : [];

  function checkNextEditionReveal() {
    if (neRevealed || !proxima) return;

    const rect = proxima.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
      neRevealed = true;
      neEls.forEach(function (el) {
        if (el) el.classList.add('revealed');
      });
    }
  }

  /* ─────────────────────────────────────────────
     Scroll handler (rAF throttled)
  ───────────────────────────────────────────── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollPath();
        updateLightingOverlay();
        checkNextEditionReveal();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ─────────────────────────────────────────────
     Init
  ───────────────────────────────────────────── */
  function init() {
    initScrollPath();
    updateScrollPath();
    updateLightingOverlay();
    checkNextEditionReveal();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', initScrollPath);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
