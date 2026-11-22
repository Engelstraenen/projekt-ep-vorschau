/* Projekt EX Mobil-Check 2026-11 (FLUTLICHT 27)
   1) Handy-Menue: Unter 720px blendet die Seite die Hauptnavigation (Halle, Verleih, Mitspielen, Bar, Spielen) aus.
      Ein Menue-Knopf zeigt sie als Liste; die Links behalten ihr Scroll-Verhalten (Lenis). Schliessen per Knopf,
      Link, Escape oder Tippen ausserhalb.
   2) Stabile Szenenhoehe auf Touch-Geraeten: window.__pexH() liefert die Hoehe der Buehne (.stage, 100svh) statt
      window.innerHeight. Die Szene rechnet damit Fortschritt und Bildgroessen; die ein-/ausfahrende Adressleiste
      loest so keine Spruenge mehr aus. Desktop (Maus) bekommt weiterhin window.innerHeight.
   Im Quellprojekt (flutlicht27-site) besser direkt in Nav- und Szenen-Komponente umsetzen. */
(function () {
  'use strict';
  var mq = window.matchMedia ? window.matchMedia('(hover: none) and (pointer: coarse)') : null;
  var stage = null;
  window.__pexH = function () {
    if (!mq || !mq.matches) return window.innerHeight;
    if (!stage || !stage.isConnected) stage = document.querySelector('.stage');
    var h = stage ? stage.clientHeight : 0;
    return h > 0 ? h : window.innerHeight;
  };

  var root = document.documentElement;
  function setOpen(btn, open) {
    root.classList.toggle('pex-menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }
  function setup() {
    var ul = document.querySelector('.nav ul');
    if (!ul) return false;
    if (document.querySelector('.pex-menu-btn')) return true;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pex-menu-btn';
    btn.innerHTML = '<span></span><span></span><span></span>';
    setOpen(btn, false);
    document.body.appendChild(btn);
    root.classList.add('pex-has-menu');
    btn.addEventListener('click', function () { setOpen(btn, !root.classList.contains('pex-menu-open')); });
    document.addEventListener('click', function (e) {
      if (!root.classList.contains('pex-menu-open')) return;
      var t = e.target;
      if (t.closest && t.closest('.nav ul a')) { setOpen(btn, false); return; }
      if (t.closest && (t.closest('.nav ul') || t.closest('.pex-menu-btn'))) return;
      setOpen(btn, false);
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('pex-menu-open')) { setOpen(btn, false); btn.focus(); }
    });
    return true;
  }
  /* erst nach der React-Hydrierung einhaengen (Signal: Lenis bzw. statischer Modus ist aktiv) */
  var tries = 0;
  (function wait() {
    tries++;
    if ((window.__lenis || root.classList.contains('static') || tries > 50) && setup()) return;
    if (tries < 120) setTimeout(wait, 150);
  })();
})();
