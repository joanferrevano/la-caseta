/* ═══════════════════════════════════════════════════════════════
   MAIN.JS — Global init, smooth scroll
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Smooth scroll for anchor links ── */
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ── Global state for scroll path head (used by timeline.js) ── */
  window.__LIGHT_PATH_HEAD_Y__ = 0;

  /* ── Expose simple util ── */
  window.LaCaseta = window.LaCaseta || {};

  window.LaCaseta.lerp = function (a, b, t) {
    return a + (b - a) * t;
  };

  window.LaCaseta.clamp = function (val, min, max) {
    return Math.min(Math.max(val, min), max);
  };

  window.LaCaseta.mapRange = function (val, inMin, inMax, outMin, outMax) {
    const t = window.LaCaseta.clamp((val - inMin) / (inMax - inMin), 0, 1);
    return window.LaCaseta.lerp(outMin, outMax, t);
  };

})();
