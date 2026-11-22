/* Projekt EX Mobil-Check 2026-11: Das Handy-Menue der Kollektions- und Produktseiten zeigt alle Ziele der
   Desktop-Navigation. Fehlende Eintraege (z. B. "Alpine Map" / "Alpine World") werden als normaler Link ergaenzt.
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
  if (typeof MutationObserver === 'function') {
    new MutationObserver(fill).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
