// QUARTIER AERO – mobiles Menü + Kopfzeile über dem hellen Exposé-Teil (Mobil-Check 2026-11).
// Ergänzt js/main.js (gebündelt, Quelle nicht im Repo); Kapitel-Links scrollt main.js weiterhin per Lenis.
(function () {
  var menu = document.querySelector('details.qmenu');
  if (menu) {
    var shut = function () { menu.removeAttribute('open'); };
    menu.querySelectorAll('.qmenu__panel a').forEach(function (a) { a.addEventListener('click', shut); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { shut(); menu.querySelector('summary').focus(); } });
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) shut(); });
  }
  // Nur mobil (CSS-Regeln für .on-paper stehen in mobile-fix.css unter max-width:760px)
  var bar = document.querySelector('.bar'), paper = document.querySelector('.paper');
  var mq = matchMedia('(max-width: 760px)');
  if (!bar || !paper) return;
  var queued = false;
  function check() { queued = false; bar.classList.toggle('on-paper', mq.matches && paper.getBoundingClientRect().top < bar.offsetHeight); }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(check); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  if (mq.addEventListener) mq.addEventListener('change', queue);
  check();
})();
