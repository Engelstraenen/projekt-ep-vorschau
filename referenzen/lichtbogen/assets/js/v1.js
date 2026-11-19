/* Testversion 1 · Haus: Kamerafahrt durch die Räume, Schalter zum Anfassen */
(function () {
  'use strict';
  var Z = window.LB_ZONES || [];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hs = $('#hs'), stage = $('.hs-stage'), zoom = $('#hs-zoom'), house = $('#house'), card = $('#hs-card');
  /* Bildmitte und Vergrößerung je Bereich (Koordinaten der Zeichnung 800 x 720) */
  var CAM = { all: [400, 380, 1], pv: [520, 190, 2.1], wallbox: [706, 476, 2.6], smart: [288, 325, 2.5], licht: [288, 464, 2.5], echeck: [512, 464, 2.5], altbau: [512, 325, 2.5], not: [300, 620, 2.5] };
  var step = -1, dots = $('#hs-dots');
  Z.forEach(function () { dots.appendChild(document.createElement('i')); });

  function cam(key) {
    var c = CAM[key] || CAM.all, W = stage.clientWidth, H = stage.clientHeight, k = W / 800;
    var wide = W >= 720;
    var base = Math.min(1, H / (720 * k)) * (wide ? 0.92 : 1);        /* Haus passt immer ganz ins Bild */
    var s = base * c[2] * (wide ? 0.75 : 1);
    if (key === 'all') s = base;
    var fx = wide ? W * 0.62 : W / 2, fy = wide ? H / 2 : H * 0.36;
    zoom.style.transform = 'translate(' + (fx - c[0] * k * s).toFixed(1) + 'px,' + (fy - c[1] * k * s).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
  }
  function go(i) {
    i = Math.max(0, Math.min(Z.length - 1, i));
    if (i === step) return;
    step = i;
    var z = Z[i];
    cam(z.z);
    $('#hs-eye').textContent = z.eye; $('#hs-h').textContent = z.h; $('#hs-t').textContent = z.t;
    var a = $('#hs-a');
    if (z.link) { a.hidden = false; a.href = z.link; a.textContent = z.cta; } else a.hidden = true;
    $('#hs-call').hidden = !(z.z === 'not' || z.z === 'all');
    $$('i', dots).forEach(function (d, n) { d.classList.toggle('on', n <= i); });
    card.classList.remove('sw'); void card.offsetWidth; card.classList.add('sw');
  }
  var tick = false;
  function onScroll() {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      tick = false;
      var r = hs.getBoundingClientRect(), p = Math.max(0, Math.min(0.999, -r.top / (r.height - innerHeight)));
      go(Math.floor(p * Z.length));
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { cam(Z[Math.max(0, step)].z); });
  onScroll(); if (step < 0) go(0);

  /* Anfassen */
  function act(el) {
    var a = el.getAttribute('data-act'), z = el.getAttribute('data-z');
    if (a === 'lamp') house.classList.toggle('lamp-on');
    if (a === 'shut') house.classList.toggle('shut');
    if (a === 'plug') house.classList.toggle('plug');
    if (a === 'fuse') {
      var off = house.classList.toggle('hs-off');
      if (window.LB) window.LB.toast(off ? 'Sicherung raus: Das ganze Haus ist ohne Strom. Tipp noch einmal.' : 'Strom ist wieder da.');
    }
    /* zur passenden Stelle scrollen, damit Karte und Kamera mitkommen */
    var i = Z.map(function (x) { return x.z; }).indexOf(z);
    if (i > -1 && i !== step) {
      var r = hs.getBoundingClientRect(), top = r.top + scrollY;
      scrollTo({ top: top + (i + 0.5) / Z.length * (r.height - innerHeight), behavior: 'smooth' });
    }
  }
  $$('.hot').forEach(function (el) {
    el.addEventListener('click', function () { act(el); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(el); } });
  });
  house.classList.add('lamp-on');
})();
