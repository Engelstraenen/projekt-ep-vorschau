/* Feld & Partner – One-Take Film (242 Frames @ 8fps), scroll-gesteuert */
(function () {
  'use strict';
  var sec = document.querySelector('[data-film]');
  if (!sec) return;
  var cv = sec.querySelector('.film__cv');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var N = 242;
  var mobile = matchMedia('(max-width: 700px)').matches;
  var dir = mobile ? 'film/m/' : 'film/d/';
  var imgs = new Array(N);
  var want = 0, drawn = -1, progress = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Fokus (0..1 der Bildbreite) je Frame: Füller, Akte, Raum, Fenster, Gespräch, Unterschrift */
  var narrow = matchMedia('(max-width: 960px)');
  var focus = [[0, .45], [24, .52], [38, .7], [64, .7], [76, .5], [122, .52], [132, .55], [162, .56], [172, .6], [182, .72], [212, .72], [220, .63], [241, .63]];
  function focusOf(f) {
    for (var j = 1; j < focus.length; j++) {
      if (f <= focus[j][0]) {
        var a = focus[j - 1], b = focus[j], t = (f - a[0]) / Math.max(1, b[0] - a[0]);
        t = t * t * (3 - 2 * t);
        return a[1] + (b[1] - a[1]) * t;
      }
    }
    return focus[focus.length - 1][1];
  }

  function src(i) { return dir + String(i + 1).padStart(3, '0') + '.webp'; }
  function load(i) {
    if (imgs[i]) return;
    var im = new Image();
    im.decoding = 'async';
    im.src = src(i);
    im.onload = function () { if (Math.abs(i - Math.round(want)) < 4) paint(true); };
    imgs[i] = im;
  }
  for (var i = 0; i < N; i += 8) load(i);
  var filling = false;
  function fill() {
    if (filling) return;
    filling = true;
    var k = 0;
    (function step() {
      for (var n = 0; n < 8 && k < N; k++) if (!imgs[k]) { load(k); n++; }
      if (k < N) setTimeout(step, 40);
    })();
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { if (e[0].isIntersecting) fill(); }, { rootMargin: '120% 0px' }).observe(sec);
  } else fill();

  function best(f) {
    for (var d = 0; d < N; d++) {
      var a = imgs[f - d], b = imgs[f + d];
      if (a && a.complete && a.naturalWidth) return a;
      if (b && b.complete && b.naturalWidth) return b;
    }
    return null;
  }
  function paint(force) {
    var f = Math.max(0, Math.min(N - 1, Math.round(want)));
    if (f === drawn && !force) return;
    var im = best(f); if (!im) return;
    drawn = f;
    var W = cv.width, H = cv.height;
    var s = Math.max(W / im.naturalWidth, H / im.naturalHeight);
    var w = im.naturalWidth * s, h = im.naturalHeight * s;
    var x = (W - w) / 2;
    /* Hochformat (Handy/Tablet): Bildausschnitt folgt dem Motiv der Szene statt stur der Bildmitte */
    if (narrow.matches && w > W + 1) x = Math.min(0, Math.max(W - w, W / 2 - focusOf(f) * w));
    ctx.drawImage(im, x, (H - h) / 2, w, h);
  }
  function size() {
    var r = cv.getBoundingClientRect();
    var d = Math.min(devicePixelRatio || 1, 2);
    var w = Math.round(r.width * d), h = Math.round(r.height * d);
    /* Adressleiste ein/aus loest resize aus, die Buehne (svh) bleibt gleich gross: nicht neu anlegen */
    if (w === cv.width && h === cv.height && drawn > -1) return;
    cv.width = w;
    cv.height = h;
    paint(true);
  }
  addEventListener('resize', size);
  size();

  /* Holds an den Kapitelgrenzen (Scroll-Progress -> Frame) */
  var stops = [
    [0, 0], [0.06, 4], [0.18, 40], [0.28, 72], [0.42, 118],
    [0.52, 140], [0.66, 168], [0.76, 188], [0.90, 220], [1, 241]
  ];
  function frameOf(p) {
    for (var j = 1; j < stops.length; j++) {
      if (p <= stops[j][0]) {
        var a = stops[j - 1], b = stops[j];
        return a[1] + (b[1] - a[1]) * ((p - a[0]) / Math.max(1e-6, b[0] - a[0]));
      }
    }
    return N - 1;
  }

  var words = sec.querySelector('.film__words');
  var stages = [].slice.call(sec.querySelectorAll('.film__st'));
  var bar = sec.querySelector('.film__bar i');
  var mm = sec.querySelector('.film__mm b');
  var kick = sec.querySelector('.film__kick');
  var labels = ['Stift', 'Akte', 'Raum', 'Fassade', 'Gespräch', 'Schluss'];

  function setUI(p) {
    var f = frameOf(p);
    want = f;
    paint(false);
    var stage = p * (stages.length - 1);
    stages.forEach(function (el, i) {
      /* Hochformat: Texte stehen untereinander statt über dem Bild -> sauber nacheinander statt übereinander blenden */
      var o = Math.max(0, 1 - Math.abs(stage - i) * (narrow.matches ? 2.1 : 1.35));
      el.style.opacity = String(o);
      el.style.transform = 'translate3d(0,' + ((i - stage) * 18) + 'px,0)';
      if (Math.round(stage) === i) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    if (words) words.style.transform = 'translate3d(' + (-stage * 100) + 'vw,0,0)';
    if (bar) bar.style.transform = 'scaleY(' + p + ')';
    if (mm) mm.textContent = String(Math.round(1987 + p * (2026 - 1987)));
    if (kick) kick.textContent = labels[Math.min(labels.length - 1, Math.round(stage))];
  }

  if (reduce || !window.ScrollTrigger) {
    fill(); setUI(1); return;
  }
  window.gsap.registerPlugin(window.ScrollTrigger);
  setUI(0);
  window.ScrollTrigger.create({
    trigger: sec,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: function (st) { progress = st.progress; setUI(progress); },
    onEnter: fill,
    onEnterBack: fill
  });
})();
