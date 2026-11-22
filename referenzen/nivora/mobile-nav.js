/* Projekt EX Mobil-Check 2026-11: Das Handy-Menue der Kollektions- und Produktseiten zeigt alle Ziele der
   Desktop-Navigation. Fehlende Eintraege (z. B. "Alpine Map" / "Alpine World") werden als normaler Link ergaenzt.
   Ausserdem bleibt in der seitlich scrollbaren Abschnitts-Navigation (sehr schmale Handys) das aktive Kapitel sichtbar.
   Im Quellprojekt besser direkt in den Menue-Komponenten (EcMobileNav / NpMobileNav) nachtragen. */
(function () {
  'use strict';
  var PAIRS = [['.ec-mobile-nav', '.ec-main-nav'], ['.np-mobile-nav', '.np-header nav']];
  var done = typeof WeakSet === 'function' ? new WeakSet() : null;
  function key(href) {
    try { var u = new URL(href, location.href); return u.pathname.replace(/\/+$/, '') + u.hash; } catch (e) { return href; }
  }
  function fill() {
    for (var i = 0; i < PAIRS.length; i++) {
      var mob = document.querySelector(PAIRS[i][0]);
      if (!mob || (done && done.has(mob))) continue;
      var desk = document.querySelector(PAIRS[i][1]);
      if (!desk) continue;
      var have = {};
      var links = mob.querySelectorAll('a[href]');
      for (var j = 0; j < links.length; j++) have[key(links[j].getAttribute('href'))] = 1;
      var tpl = links[links.length - 1];
      var dl = desk.querySelectorAll('a[href]');
      for (var k = 0; k < dl.length; k++) {
        var href = dl[k].getAttribute('href');
        if (have[key(href)]) continue;
        var a = tpl ? tpl.cloneNode(true) : document.createElement('a');
        a.removeAttribute('aria-current');
        a.setAttribute('href', href);
        a.setAttribute('data-pex-added', '');
        var label = (dl[k].textContent || '').trim();
        var t = null;
        for (var c = a.firstChild; c; c = c.nextSibling) if (c.nodeType === 3 && c.nodeValue.trim()) { t = c; break; }
        if (t) t.nodeValue = label; else a.insertBefore(document.createTextNode(label), a.firstChild);
        mob.appendChild(a);
        have[key(href)] = 1;
      }
      if (done) done.add(mob);
    }
  }
  /* Abschnitts-Navigation (unten, seitlich scrollbar auf sehr schmalen Handys): aktives Kapitel sichtbar halten */
  var navs = typeof WeakSet === 'function' ? new WeakSet() : null;
  function center(nav) {
    if (nav.scrollWidth <= nav.clientWidth + 1) return;
    var a = nav.querySelector('a[aria-current]');
    if (!a) return;
    var left = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
    if (Math.abs(nav.scrollLeft - left) > 4) nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }
  function watchNav() {
    var nav = document.querySelector('.section-nav');
    if (!nav || !navs || navs.has(nav)) return;
    navs.add(nav);
    new MutationObserver(function () { center(nav); }).observe(nav, { attributes: true, subtree: true, attributeFilter: ['aria-current'] });
    center(nav);
  }
  function tick() { fill(); watchNav(); }
  if (typeof MutationObserver === 'function') {
    new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true });
    tick();
  }
})();
