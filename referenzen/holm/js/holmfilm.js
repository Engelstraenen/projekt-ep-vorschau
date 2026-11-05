// HOLM & CO – Kapitel „Vom Stamm zum Raum“: fotorealistischer Film, per Scroll gesteuert (Bildsequenz auf Canvas).
(function () {
  var sec = document.querySelector('.story'); if (!sec) return;
  var cv = sec.querySelector('.story__cv'), ctx = cv.getContext('2d');
  var mobile = matchMedia('(max-width: 700px)').matches;
  var N = 218, FPS = 12, dir = mobile ? 'film/m/' : 'film/d/';
  var imgs = new Array(N), cur = 0, drawn = -1;
  function src(i) { return dir + String(i + 1).padStart(3, '0') + '.webp'; }
  function load(i) { if (imgs[i]) return; var im = new Image(); im.decoding = 'async'; im.src = src(i); im.onload = function () { if (Math.abs(i - frameOf(cur)) < 6) draw(true); }; imgs[i] = im; }
  // Erst grob (jedes 8. Bild), dann alles – der Film ist sofort scrubbar
  for (var i = 0; i < N; i += 8) load(i);
  var fillStarted = false;
  function fill() { if (fillStarted) return; fillStarted = true; var k = 0; (function step() { for (var n = 0; n < 6 && k < N; k++) if (!imgs[k]) { load(k); n++; } if (k < N) setTimeout(step, 60); })(); }
  new IntersectionObserver(function (e) { if (e[0].isIntersecting) fill(); }, { rootMargin: '150% 0px' }).observe(sec);

  // Scroll -> Filmzeit (Sekunden) mit Haltepunkten an den fünf Kapiteln
  var stops = [[0, 0], [.07, 0], [.23, 4], [.31, 4.6], [.47, 8.5], [.54, 9], [.69, 12], [.75, 12.4], [.97, 18], [1, 18]];
  var stT = [0, 4.3, 8.7, 12.2, 18];
  function timeOf(p) { for (var j = 1; j < stops.length; j++) if (p <= stops[j][0]) { var a = stops[j - 1], b = stops[j]; return a[1] + (b[1] - a[1]) * ((p - a[0]) / Math.max(1e-6, b[0] - a[0])); } return 18; }
  function frameOf(p) { return Math.min(N - 1, Math.round(timeOf(p) * FPS)); }
  function stageOf(t) { for (var j = 1; j < stT.length; j++) if (t <= stT[j]) return j - 1 + (t - stT[j - 1]) / (stT[j] - stT[j - 1]); return 4; }

  function best(f) { for (var d = 0; d < N; d++) { var a = imgs[f - d], b = imgs[f + d]; if (a && a.complete && a.naturalWidth) return a; if (b && b.complete && b.naturalWidth) return b; } return null; }
  function draw(force) {
    var f = frameOf(cur); if (f === drawn && !force) return;
    var im = best(f); if (!im) return; drawn = f;
    var W = cv.width, H = cv.height, s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  }
  function size() { var r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); draw(true); }
  addEventListener('resize', size); size();

  var lines = [].slice.call(sec.querySelectorAll('.story__st')), words = sec.querySelector('.story__words'), mm = sec.querySelector('.story__mm b'), bar = sec.querySelector('.story__bar i');
  function set(p) {
    cur = p; draw(false);
    var sf = stageOf(timeOf(p)), act = Math.round(sf);
    lines.forEach(function (el, i) { var o = Math.max(0, 1 - Math.abs(sf - i) * 2.4); el.style.opacity = o; el.style.transform = 'translate3d(0,' + ((i - sf) * 36) + 'px,0)'; if (i === act) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true'); });
    if (words) words.style.transform = 'translate3d(' + (-sf * 100) + 'vw,0,0)';
    if (mm) mm.textContent = Math.round(p * 2735).toLocaleString('de-DE').replace('.', '\u202f');
    if (bar) bar.style.transform = 'scaleY(' + p + ')';
  }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  sec.classList.add('story--film');
  if (reduce || !window.ScrollTrigger) { set(1); load(N - 1); return; }
  set(0);
  ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: function (st) { set(st.progress); } });
})();
