/* GLANZWERK – Unterseiten: Bilder, Vorher/Nachher, Einblenden, Balken. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = window.GW_IMG || {}, mobile = function () { return innerWidth < 900; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  $$('[data-img]').forEach(function (el) {
    var n = el.getAttribute('data-img');
    if (IMG[n]) { el.src = 'assets/img/' + n + (mobile() ? '-m' : '') + '.webp?v=' + (IMG._v || 1); el.decoding = 'async'; }
    else { el.removeAttribute('src'); el.style.display = 'none'; }
  });
  $$('[data-need]').forEach(function (el) { if (!IMG[el.getAttribute('data-need')]) el.style.display = 'none'; });
  $$('.ba').forEach(function (ba) {
    var r = $('input[type=range]', ba); if (!r) return;
    r.addEventListener('input', function () { ba.style.setProperty('--x', r.value + '%'); });
  });
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .25 });
    rvs.forEach(function (el) { io.observe(el); });
  } else rvs.forEach(function (el) { el.classList.add('in'); });
  // Vorher/Nachher: kurzer Hinweis-Schwenk
  var ba = $('.ba input[type=range]') && $('.ba');
  if (ba && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io2.disconnect();
      var t0 = performance.now();
      (function st(t) { var k = clamp((t - t0) / 1800, 0, 1); ba.style.setProperty('--x', (50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k)) + '%'); if (k < 1) requestAnimationFrame(st); })(t0);
    }, { threshold: .5 });
    io2.observe(ba);
  }
})();
