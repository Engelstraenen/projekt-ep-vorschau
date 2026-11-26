/* ZUGVOGEL Umzüge – Demo. Scroll-Filme, Rechner, Besichtigung, Halteverbot, Live-Status, Karriere, Bewertungen. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var band = function (p, a, b, f) { f = f || .06; return Math.min(seg(p, a, a + f), 1 - seg(p, b - f, b)); };
  var mobile = function () { return innerWidth <= 900; };
  var de = function (n, d) { return n.toLocaleString('de-DE', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Persönlicher Link: ?firma=Umzüge+Müller ---------- */
  (function () {
    var f = null;
    try { f = new URLSearchParams(location.search).get('firma'); if (f) sessionStorage.setItem('zv-firma', f); else f = sessionStorage.getItem('zv-firma'); } catch (e) {}
    if (!f) return;
    $$('[data-firma]').forEach(function (el) { el.textContent = f; });
    root.classList.add('has-firma');
  })();

  /* ---------- Bilder ohne Datei ausblenden (nie Platzhalter) ---------- */
  $$('img').forEach(function (im) {
    function gone() { var p = im.closest('.calc-bg,.scan-bg') || im; p.style.display = 'none'; }
    if (im.complete && im.naturalWidth === 0 && im.getAttribute('src')) gone();
    im.addEventListener('error', gone);
  });

  /* ---------- Kopfzeile + Menü ---------- */
  var top = $('#top'), burger = $('#burger');
  burger.addEventListener('click', function () {
    var o = !root.classList.contains('menu-open');
    root.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o);
    burger.setAttribute('aria-label', o ? 'Menü schließen' : 'Menü öffnen');
  });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false); }); });

  /* ---------- Hilfen ---------- */
  function prog(sec) {
    var r = sec.getBoundingClientRect(), h = sec.offsetHeight - innerHeight;
    return h > 0 ? clamp(-r.top / h, 0, 1) : 0;
  }
  function vis(sec) { var r = sec.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }
  function show(el, o, dy) {
    if (!el) return;
    el.style.opacity = o.toFixed(3);
    var base = el.classList.contains('b-hero') ? 'translateY(-40%) ' : el.classList.contains('b-cta') ? 'translateY(-50%) ' : '';
    el.style.transform = base + 'translateY(' + ((1 - o) * (dy == null ? 26 : dy)).toFixed(1) + 'px)';
    el.style.visibility = o < .01 ? 'hidden' : 'visible';
  }

  /* ---------- Film: Video spulen, sonst Standbild mit Kamerafahrt ---------- */
  function Film(sec) {
    var box = $('.media', sec), v = $('.vid', box), ok = false;
    var base = v && v.getAttribute('data-src'), key = v && v.getAttribute('data-key');
    var V = window.ZV_VID || {};
    function attach() {
      var s = document.createElement('source');
      // volle Auflösung: Desktop Original, Handy hochkant Ausschnitt in voller Höhe (-p), Handy quer (-m)
      s.src = base + (mobile() ? (innerWidth / innerHeight <= .75 ? '-p' : '-m') : '') + '.mp4?v=' + V._v; s.type = 'video/mp4'; v.appendChild(s);
      v.addEventListener('loadeddata', function () { ok = true; box.classList.add('has-vid'); });
      v.load(); var pr = v.play && v.play(); if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
    }
    if (base && V[key]) {
      // erster Film sofort, alle anderen erst kurz bevor ihr Kapitel ins Bild kommt (spart Ladezeit)
      if (sec.id === 'lift' || !('IntersectionObserver' in window)) attach();
      else { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); attach(); } }, { rootMargin: '150% 0px' }); io.observe(sec); }
    }
    var cur = 0;
    return function (p, z) {
      box.style.setProperty('--z', ok ? 1 : (z == null ? 1 : z));
      if (ok && v.duration) {
        var want = Math.min(v.duration - .05, v.duration * p);
        cur += (want - cur) * .35;
        if (Math.abs(v.currentTime - cur) > .02) v.currentTime = cur;
      }
    };
  }

  /* 1 Möbellift */
  var S1 = $('#lift'), f1 = Film(S1), b1 = $$('.beat', S1);
  function ch1(p) {
    f1(p, 1 + .16 * ease(p));
    show(b1[0], 1 - seg(p, .04, .14), 30);
    show(b1[1], band(p, .28, .66, .08));
    show(b1[2], band(p, .7, .99, .06));
  }
  /* 2 Sofa + Festpreis-Frage, endet als Bauplan */
  var S2 = $('#festpreis'), f2 = Film(S2), b2 = $$('.beat', S2), bp = $('.blueprint', S2);
  function ch2(p) {
    f2(seg(p, 0, .8), 1.04 + .12 * ease(seg(p, 0, .8)));
    show(b2[0], band(p, .04, .32));
    show(b2[1], band(p, .34, .6));
    show(b2[2], band(p, .62, .9, .06));
    var b = seg(p, .86, 1);
    bp.style.opacity = b.toFixed(3);
    $('.media', S2).style.filter = b > 0 ? 'grayscale(' + b + ') brightness(' + (1 - .6 * b) + ')' : '';
  }

  /* 3 Umzugsrechner */
  var CAT = [
    ['Sofa', 1.8], ['Sessel', .6], ['Bett (doppelt)', 1.6], ['Kleiderschrank', 2.4], ['Esstisch + Stühle', 1.2],
    ['Regal', .9], ['Kommode', .7], ['Schreibtisch', .8], ['Waschmaschine', .5], ['Kühlschrank', .6], ['Kartons (10 Stück)', 1.0], ['Fahrrad', .4]
  ];
  var PRE = {
    1: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1],
    2: [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1],
    3: [1, 1, 2, 2, 1, 3, 2, 1, 1, 1, 5, 2],
    4: [2, 2, 3, 3, 1, 4, 3, 2, 1, 2, 8, 3]
  };
  var qty = PRE[2].slice(), ul = $('#items');
  CAT.forEach(function (c, i) {
    var li = document.createElement('li');
    li.innerHTML = '<span>' + c[0] + '</span><button type="button" aria-label="' + c[0] + ' weniger">−</button><b>0</b><button type="button" aria-label="' + c[0] + ' mehr">+</button>';
    var bs = $$('button', li);
    bs[0].addEventListener('click', function () { qty[i] = Math.max(0, qty[i] - 1); calc(); });
    bs[1].addEventListener('click', function () { qty[i] = Math.min(20, qty[i] + 1); calc(); });
    ul.appendChild(li);
  });
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      qty = PRE[b.getAttribute('data-preset')].slice(); calc();
    });
  });
  ['floorA', 'km', 'optLift', 'pack', 'hvz'].forEach(function (id) { $('#' + id).addEventListener('change', calc); });

  /* LKW: echter Koffer-LKW in Isometrie. Die Größe wächst mit dem Umzugsgut:
     3,5 t (≈18 m³) → 7,5 t (≈38 m³) → 12 t (≈52 m³) → 18 t (≈68 m³) → darüber zweiter LKW */
  var CLS = [
    { n: '3,5 t', L: 3.6, cap: 18, base: 120 },
    { n: '7,5 t', L: 5.2, cap: 38, base: 190 },
    { n: '12 t', L: 6.8, cap: 52, base: 290 },
    { n: '18 t', L: 8.4, cap: 68, base: 380 }
  ];
  var SLOTS = [], NS = 'http://www.w3.org/2000/svg', truckSvg = $('#truck');
  var C30 = .866, S = 30;
  function P(x, y, z) { return [((x - y) * C30 * S).toFixed(1), ((x + y) * .5 * S - z * S).toFixed(1)]; }
  function pt(x, y, z) { return P(x, y, z).join(','); }
  function poly(pts, cls, extra) { return '<polygon class="' + cls + '" points="' + pts.map(function (q) { return pt(q[0], q[1], q[2]); }).join(' ') + '"' + (extra || '') + '/>'; }
  function mat(v) { return 'matrix(' + v.map(function (n) { return n.toFixed(3); }).join(' ') + ')'; }
  function planeY(Y) { return mat([C30 * S, .5 * S, 0, -S, -Y * C30 * S, Y * .5 * S]); }
  function planeX(X) { return mat([-C30 * S, .5 * S, 0, -S, X * C30 * S, X * .5 * S]); }
  function planeZ(Z) { return mat([C30 * S, .5 * S, -C30 * S, .5 * S, 0, -Z * S]); }
  var W = 2.4, Z0 = 1.0, H = 2.6, NSC = ' vector-effect="non-scaling-stroke"';
  function wheel(x, y, far) {
    return '<g transform="' + planeY(y) + '"><g class="wh' + (far ? ' far' : '') + '">' +
      '<circle cx="' + x + '" cy=".48" r=".48" class="tyre"' + NSC + '/><circle cx="' + x + '" cy=".48" r=".28" class="rim"' + NSC + '/>' +
      '<g class="spokes" style="transform-origin:' + x + 'px .48px"><path d="M' + (x - .26) + ' .48H' + (x + .26) + 'M' + x + ' .22V.74" class="spoke"' + NSC + '/></g>' +
      '<circle cx="' + x + '" cy=".48" r=".07" class="hub"/></g></g>';
  }
  function line(a, b) { var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]); return 'M' + p[0] + ' ' + p[1] + 'L' + q[0] + ' ' + q[1]; }
  function rigSvg(L) {
    var c = L + .1, rx = Math.max(.9, L * .25), axles = L >= 8 ? [rx, rx + 1.05] : [rx], f = L + 1.0, ribs = [];
    for (var r = 1.3; r < L - .2; r += 1.3) ribs.push(r);
    return '<g id="rig">' +
      '<g transform="' + planeZ(0) + '"><ellipse cx="' + ((L + 1.9) / 2) + '" cy="1.2" rx="' + ((L + 3.2) / 2) + '" ry="1.7" class="t-shadow"/></g>' +
      axles.map(function (a) { return wheel(a, .05, 1); }).join('') + wheel(f, .15, 1) +
      poly([[0, 0, Z0], [L, 0, Z0], [L, W, Z0], [0, W, Z0]], 't-floor') +
      poly([[0, 0, Z0], [L, 0, Z0], [L, 0, Z0 + H], [0, 0, Z0 + H]], 't-wall') +
      poly([[L, 0, Z0], [L, W, Z0], [L, W, Z0 + H], [L, 0, Z0 + H]], 't-wall2') +
      '<g id="fill"></g>' +
      '<g transform="' + planeY(W) + '"><rect x="0" y="' + Z0 + '" width="' + L + '" height="' + H + '" class="t-glass"' + NSC + '/>' +
      '<rect x="-.05" y="' + (Z0 - .16) + '" width="' + (L + .05) + '" height=".18" class="t-rail"/>' +
      ribs.map(function (x) { return '<path d="M' + x + ' ' + Z0 + 'V' + (Z0 + H) + '" class="t-rib"' + NSC + '/>'; }).join('') + '</g>' +
      poly([[0, 0, Z0 + H], [L, 0, Z0 + H], [L, W, Z0 + H], [0, W, Z0 + H]], 't-roof', NSC) +
      poly([[L, 0, Z0 + 1.95], [L, W, Z0 + 1.95], [L, W, Z0 + H], [L, 0, Z0 + H]], 't-front') +
      '<g transform="' + planeY(2.25) + '"><rect x=".1" y=".72" width="' + (L + 1.8) + '" height=".3" class="t-chassis"/><rect x="-.05" y=".55" width=".22" height=".3" class="t-light-r"/></g>' +
      '<g transform="' + planeY(2.3) + '"><path d="M' + c + ' .8H' + (c + 1.75) + 'V2.1L' + (c + 1.25) + ' 2.95H' + c + 'Z" class="cab-side"' + NSC + '/>' +
      '<path d="M' + (c + .7) + ' 1.95H' + (c + 1.48) + 'L' + (c + 1.18) + ' 2.72H' + (c + .7) + 'Z" class="cab-win"/><path d="M' + (c + .2) + ' 1.95H' + (c + .58) + 'V2.72H' + (c + .2) + 'Z" class="cab-win dim"/>' +
      '<path d="M' + (c + .64) + ' .95V2.75M' + (c + 1.6) + ' 1.0V1.92" class="cab-line"' + NSC + '/><rect x="' + (c + 1.25) + '" y="1.55" width=".22" height=".06" class="cab-handle"/>' +
      '<path d="M' + (c + .12) + ' 1.3l.16 -.12 .16 .12 .16 -.12 .16 .12" class="cab-logo"' + NSC + '/></g>' +
      '<g transform="' + planeX(c + 1.75) + '"><rect x=".1" y=".8" width="2.2" height="1.3" class="cab-front"/>' +
      '<rect x=".15" y=".68" width="2.1" height=".22" class="cab-bumper"/><rect x=".75" y="1.05" width=".9" height=".5" class="cab-grille"/>' +
      '<rect x=".22" y="1.12" width=".4" height=".22" rx=".05" class="cab-lamp"/><rect x="1.78" y="1.12" width=".4" height=".22" rx=".05" class="cab-lamp"/></g>' +
      poly([[c + 1.75, .1, 2.1], [c + 1.75, 2.3, 2.1], [c + 1.25, 2.3, 2.95], [c + 1.25, .1, 2.95]], 'cab-wind') +
      poly([[c, .1, 2.95], [c + 1.25, .1, 2.95], [c + 1.25, 2.3, 2.95], [c, 2.3, 2.95]], 'cab-roof') +
      poly([[c + 1.45, 2.3, 2.25], [c + 1.45, 2.58, 2.25], [c + 1.45, 2.58, 1.7], [c + 1.45, 2.3, 1.7]], 'cab-mirror') +
      axles.map(function (a) { return wheel(a, W, 0); }).join('') + wheel(f, 2.3, 0) +
      '<path d="' + line([c + 1.76, .45, 1.23], [c + 3.6, .15, .3]) + 'L' + P(c + 3.6, .95, .3).join(' ') + 'Z" class="t-beam"/>' +
      '<path d="' + line([c + 1.76, 2.0, 1.23], [c + 3.6, 1.65, .3]) + 'L' + P(c + 3.6, 2.5, .3).join(' ') + 'Z" class="t-beam"/>' +
      '</g>';
  }
  var cur = 1, curL = CLS[1].L, rig, spokes, fill, off = 0, shown = 0, lastN = 0;
  function build(L) {
    truckSvg.innerHTML = rigSvg(L);
    rig = $('#rig', truckSvg); spokes = $$('.spokes', truckSvg); fill = $('#fill', truckSvg); SLOTS = [];
    var nx = Math.max(2, Math.round(L / 1.3)), ny = 3, nz = 3, dx = (L - .2) / nx, dy = (W - .2) / ny, dz = (H - .15) / nz, g = .9, all = [];
    for (var z = 0; z < nz; z++) for (var x = 0; x < nx; x++) for (var y = 0; y < ny; y++) {
      var x0 = .1 + x * dx, y0 = .1 + y * dy, z0 = Z0 + z * dz, a = dx * g, b = dy * g, cc = dz * g;
      var el = document.createElementNS(NS, 'g');
      el.innerHTML = poly([[x0 + a, y0, z0], [x0 + a, y0 + b, z0], [x0 + a, y0 + b, z0 + cc], [x0 + a, y0, z0 + cc]], 'box-s') +
        poly([[x0, y0 + b, z0], [x0 + a, y0 + b, z0], [x0 + a, y0 + b, z0 + cc], [x0, y0 + b, z0 + cc]], 'box-f') +
        poly([[x0, y0, z0 + cc], [x0 + a, y0, z0 + cc], [x0 + a, y0 + b, z0 + cc], [x0, y0 + b, z0 + cc]], 'box-t') +
        '<path d="' + line([x0 + a * .5, y0 + b, z0 + cc], [x0 + a * .5, y0 + b, z0 + cc * .55]) + '" class="box-tape"/>';
      el.style.opacity = 0; el.style.transform = 'translateY(-36px)';
      // Beladen wie echt: unten zuerst, vorne an der Stirnwand zuerst, innen vor außen
      all.push({ g: el, fillKey: z * 1000 + (nx - 1 - x) * 10 + y, drawKey: x + y + z * 1.01 });
    }
    all.slice().sort(function (p, q) { return p.drawKey - q.drawKey; }).forEach(function (s) { fill.appendChild(s.g); });
    all.sort(function (p, q) { return p.fillKey - q.fillKey; }).forEach(function (s) { SLOTS.push(s); });
    rigAt(off); shown = 0;
  }
  function rigAt(o) {
    off = o;
    if (rig) rig.setAttribute('transform', 'translate(' + (-o * C30 * S).toFixed(1) + ' ' + (-o * .5 * S).toFixed(1) + ')');
    var ang = (-o / .48 * 57.3).toFixed(1);
    if (spokes) spokes.forEach(function (s) { s.style.transform = 'rotate(' + ang + 'deg)'; });
  }
  var drove = false, DIST = 6;
  function drive() {
    if (drove) return; drove = true;
    var t0 = performance.now(), D = RM ? 0 : 1600;
    (function st(t) {
      var k = D ? clamp((t - t0) / D, 0, 1) : 1, e = 1 - Math.pow(1 - k, 3);
      rigAt((1 - e) * DIST);
      if (k < 1) requestAnimationFrame(st);
    })(t0);
  }
  // Wachsen: Koffer zieht sich in die Länge, Fahrerhaus rollt mit, dann wird neu beladen
  var growing = 0;
  function grow(toL, done) {
    var fromL = curL, t0 = performance.now(), D = RM ? 0 : 750, id = ++growing;
    truckSvg.classList.add('grow');
    (function st(t) {
      if (id !== growing) return;
      var k = D ? clamp((t - t0) / D, 0, 1) : 1, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      curL = fromL + (toL - fromL) * e;
      truckSvg.innerHTML = rigSvg(curL); rig = $('#rig', truckSvg); spokes = $$('.spokes', truckSvg); rigAt(off);
      if (k < 1) requestAnimationFrame(st); else { curL = toL; build(toL); truckSvg.classList.remove('grow'); done(); }
    })(t0);
  }
  build(curL); rigAt(RM ? 0 : DIST);
  function fillTo(n) {
    SLOTS.forEach(function (s, i) {
      var on = i < n;
      s.g.style.transitionDelay = (on ? Math.max(0, i - shown) * 35 : 0) + 'ms';
      s.g.style.opacity = on ? 1 : 0; s.g.style.transform = on ? 'none' : 'translateY(-40px)';
    });
    shown = n;
  }
  function calc() {
    var m3 = 0;
    $$('li', ul).forEach(function (li, i) { $('b', li).textContent = qty[i]; li.classList.toggle('has', qty[i] > 0); m3 += qty[i] * CAT[i][1]; });
    var floor = +$('#floorA').value, km = +$('#km').value, lift = $('#optLift').checked, pack = $('#pack').checked, hvz = $('#hvz').checked;
    m3 = Math.round(m3 * 10) / 10;
    var ci = 0; while (ci < CLS.length - 1 && m3 > CLS[ci].cap) ci++;
    var cl = CLS[ci], over = Math.max(0, m3 - cl.cap), two = over > 0;
    var crew = m3 < 12 ? 2 : m3 < 30 ? 3 : m3 < 50 ? 4 : m3 < 70 ? 5 : 6;
    var hours = Math.max(3, Math.round(m3 * (lift || floor === 0 ? .22 : .22 + floor * .05) / (crew / 3) + km / 60 + (pack ? m3 * .12 : 0)));
    var base = hours * crew * 39 + cl.base + (two ? 120 + km * 1.2 : 0) + km * 1.6 + (lift && floor > 0 ? 220 : 0) + (pack ? m3 * 14 : 0) + (hvz ? 140 : 0);
    var from = Math.round(base * .92 / 10) * 10, to = Math.round(base * 1.12 / 10) * 10;
    count($('#m3'), m3, 1); count($('#pFrom'), from, 0); count($('#pTo'), to, 0);
    $('#truckSize').textContent = two ? cl.n + ' + 3,5 t' : cl.n; $('#crew').textContent = crew; $('#hours').textContent = hours;
    var pct = Math.min(100, Math.round(m3 / cl.cap * 100));
    $('#loadBar').style.width = pct + '%';
    $('#loadTxt').textContent = 'Laderaum ' + cl.n + ' · ' + cl.cap + ' m³ · ' + pct + ' % belegt';
    var msg = $('#truckMsg');
    if (two) msg.textContent = 'Mehr als in einen 18-Tonner passt: ' + de(over, 1) + ' m³ fahren in einem zweiten LKW mit.';
    else if (pct >= 90) msg.textContent = 'Fast voll. Noch ein Stück mehr, und es wird der nächstgrößere LKW.';
    else if (ci > 0) msg.textContent = 'Zu viel für den ' + CLS[ci - 1].n.replace(' t', '-Tonner') + ' – wir kommen mit dem ' + cl.n.replace(' t', '-Tonner') + '. Noch ' + de(cl.cap - m3, 1) + ' m³ frei.';
    else msg.textContent = 'Passt rein. Noch ' + de(cl.cap - m3, 1) + ' m³ Platz.';
    msg.classList.toggle('warn', two || pct >= 90);
    var n = clamp(Math.round(Math.min(1, m3 / cl.cap) * SLOTS.length), m3 > 0 ? 1 : 0, SLOTS.length);
    if (ci !== cur) {
      cur = ci;
      grow(cl.L, function () { var k = clamp(Math.round(Math.min(1, m3 / cl.cap) * SLOTS.length), m3 > 0 ? 1 : 0, SLOTS.length); requestAnimationFrame(function () { requestAnimationFrame(function () { fillTo(k); }); }); });
    } else if (!truckSvg.classList.contains('grow')) fillTo(n);
    window.zvM3 = m3; document.dispatchEvent(new CustomEvent('zv:m3', { detail: m3 }));
  }
  var cnt = new WeakMap();
  function count(el, to, d) {
    var from = cnt.get(el) || 0, t0 = performance.now(), dur = RM ? 0 : 500;
    cnt.set(el, to);
    (function step(t) {
      var k = dur ? clamp((t - t0) / dur, 0, 1) : 1, v = from + (to - from) * ease(k);
      el.textContent = de(v, d);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  var calcStarted = false;
  new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !calcStarted) { calcStarted = true; drive(); setTimeout(calc, RM ? 0 : 1300); } }); }, { threshold: .25 }).observe($('#rechner'));

  /* 4 Besichtigung per Handy: AR-Rahmen erscheinen beim Scrollen */
  var AR = [
    // x,y,w,h in % des Wohnzimmerbilds (zv-d, 16:9) + Name + m³
    [22, 59, 34, 19, 'Sofa · 1,8 m³', 1.8], [60.5, 52, 17, 23, 'Sessel · 0,6 m³', .6], [45, 66, 18, 15, 'Couchtisch · 0,3 m³', .3],
    [39.5, 26, 11, 29, 'Regal · 0,9 m³', .9], [13, 51, 13, 17, 'Sideboard · 0,7 m³', .7], [81.5, 43, 17, 36, 'Pflanze · 0,2 m³', .2]
  ];
  var arBox = $('#ar'), arEls = AR.map(function (a) {
    var d = document.createElement('div'); d.className = 'bx';
    d.style.cssText = 'left:' + a[0] + '%;top:' + a[1] + '%;width:' + a[2] + '%;height:' + a[3] + '%';
    if (a[0] + a[2] > 70) d.classList.add('rt'); d.innerHTML = '<span>' + a[4] + '</span>'; arBox.appendChild(d); return d;
  });
  var S4 = $('#besichtigung'), arSum = $('#arM3'), recT = $('#recT'), lastN = -1;
  function ch4(p) {
    var n = Math.round(seg(p, .1, .8) * AR.length), m = 0;
    arEls.forEach(function (e, i) { e.classList.toggle('on', i < n); if (i < n) m += AR[i][5]; });
    if (n !== lastN) { arSum.textContent = de(m, 1); lastN = n; }
    var s = Math.round(seg(p, 0, 1) * 30); recT.textContent = '00:' + (s < 10 ? '0' : '') + s;
  }
  var file = $('#file');
  file.addEventListener('change', function () {
    var n = file.files.length;
    $('#fileInfo').textContent = n ? n + (n === 1 ? ' Datei' : ' Dateien') + ' ausgewählt · Demo: nichts wird hochgeladen.' : 'Demo: Dateien werden nicht hochgeladen.';
  });

  /* 5 Halteverbot */
  var S5 = $('#halteverbot'), tl = $('#tl'), tls = $$('li', tl);
  function ch5(p) {
    var a = seg(p, .05, .3), b = seg(p, .3, .55), c = seg(p, .55, .9);
    S5.style.setProperty('--zo', a.toFixed(3));
    S5.style.setProperty('--so', Math.min(1, b * 3).toFixed(3));
    S5.style.setProperty('--sd', ((1 - ease(seg(b, 0, .6))) * 220).toFixed(1) + 'px');
    S5.style.setProperty('--sd2', ((1 - ease(seg(b, .3, 1))) * 220).toFixed(1) + 'px');
    S5.style.setProperty('--ro', ((1 - c) * 800).toFixed(1));
    // LKW: fährt ein, Räder drehen nach Strecke, Federung wippt, bremst mit Nicken, parkt mit Warnblinker, Ladebordwand fährt runter
    var tx = -320 + (1 - Math.pow(1 - c, 2.2)) * 1150, v = c < 1 ? Math.pow(1 - c, 1.2) : 0;
    S5.style.setProperty('--tx', tx.toFixed(1) + 'px');
    S5.style.setProperty('--wr', (tx / 23 * 57.3).toFixed(1) + 'deg');
    S5.style.setProperty('--bob', (Math.sin(tx / 18) * 1.6 * v).toFixed(2) + 'px');
    var brake = band(c, .8, 1, .1); S5.style.setProperty('--pitch', (brake * 1.6).toFixed(2) + 'deg');
    S5.style.setProperty('--smoke', (c > 0 && c < .97 ? v : 0).toFixed(2));
    S5.style.setProperty('--beam', (c > 0 && c < .98 ? .9 : 0).toString());
    var r = seg(p, .9, 1); S5.style.setProperty('--ra', (-90 * seg(r, 0, .5)).toFixed(1) + 'deg'); S5.style.setProperty('--rl', (seg(r, .5, 1) * 30).toFixed(1) + 'px');
    S5.classList.toggle('parked', c >= .985);
    S5.style.setProperty('--lit', seg(p, .85, .95).toFixed(3));
    S5.style.setProperty('--tp', (a * .0 + (b > 0 ? .5 * b : 0) + (c > 0 ? .5 * c : 0)).toFixed(3));
    tls[0].classList.toggle('on', a > .3); tls[1].classList.toggle('on', b > .5); tls[2].classList.toggle('on', c > .9);
  }


  /* 7 Leistungen: Kachel antippen → Details; Versicherung rechnet mit dem m³ aus dem Rechner */
  (function () {
    var D = JSON.parse($('#svData').textContent), box = $('#svd'), act = null;
    new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { $('#leistungen').classList.add('in'); o.disconnect(); } }); }, { threshold: .2 }).observe($('#leistungen'));
    $$('.sv').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-sv'), same = act === b;
        $$('.sv').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
        if (same) { box.hidden = true; act = null; return; }
        act = b; b.setAttribute('aria-expanded', 'true');
        $('#svT').textContent = D[k].n;
        $('#svB').innerHTML = D[k].b.map(function (t) { return '<li>' + t + '</li>'; }).join('');
        box.hidden = false; box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
        if (mobile()) box.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'nearest' });
      });
    });
    var wert = $('#vWert'), m3 = 36.2;
    function vers() {
      var h = Math.round(m3 * 620), w = +wert.value, mx = Math.max(h, w, 1), sc = 400 / mx;
      $('#vM3').textContent = de(m3, 1); count($('#vHaft'), h, 0); $('#vWertT').textContent = de(w, 0);
      $('#vbH').setAttribute('width', (h * sc).toFixed(1)); $('#vbW').setAttribute('width', (w * sc).toFixed(1));
      var gap = Math.max(0, w - h); $('#vbG').setAttribute('x', (h * sc).toFixed(1)); $('#vbG').setAttribute('width', (gap * sc).toFixed(1));
      $('#vNote').textContent = gap > 0 ? 'Rot markiert: ' + de(gap, 0) + ' € wären nur mit Transportversicherung zum Neuwert gedeckt.' : 'Ihr Hausrat ist durch die gesetzliche Haftung vollständig abgedeckt.';
    }
    wert.addEventListener('input', vers);
    document.addEventListener('zv:m3', function (e) { m3 = e.detail || 0; vers(); });
    vers();
  })();

  /* 6 Live-Status */
  var S6 = $('#live'), feed = $$('#feed li'), lr = $('#lroute'), lt = $('#ltruck'), LEN = lr.getTotalLength();
  var CARD = [['06:45', 'Team startet im Depot', 8], ['07:12', 'Team unterwegs – Ankunft 7:30', 35], ['07:29', 'Team ist da, Möbellift wird aufgebaut', 55], ['11:40', 'LKW beladen, Abfahrt zur neuen Adresse', 80], ['14:55', 'Alles drin. Willkommen zu Hause.', 100]];
  var lastC = -1;
  function ch6(p) {
    var k = seg(p, .05, .9), pt = lr.getPointAtLength(LEN * k);
    lt.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
    var c = Math.min(CARD.length - 1, Math.floor(k * CARD.length));
    feed.forEach(function (li, i) { li.classList.toggle('on', i <= c); li.classList.toggle('cur', i === c); });
    if (c !== lastC) { $('#cardT').textContent = CARD[c][0]; $('#cardS').textContent = CARD[c][1]; $('#card').style.setProperty('--cb', CARD[c][2] + '%'); lastC = c; }
  }

  /* 7 Karriere: Film + Kinetik-Typo */
  var S7 = $('#karriere'), f7 = Film(S7), b7 = $$('.beat', S7), kin = $$('.kin p', S7);
  function ch7(p) {
    f7(seg(p, 0, .75), 1 + .1 * ease(p));
    show(b7[0], band(p, .02, .3));
    kin.forEach(function (k, i) {
      var a = .3 + i * .09, o = band(p, a, .74, .05), t = seg(p, a, a + .06);
      k.style.opacity = o.toFixed(3); k.style.transform = mobile() ? 'translateY(' + ((1 - ease(t)) * 40).toFixed(1) + 'px)' : 'translateX(' + ((1 - ease(t)) * 90).toFixed(1) + 'px)';
    });
    show(b7[1], seg(p, .78, .86));
  }

  /* ---------- Schleife ---------- */
  var CH = [[S1, ch1], [S2, ch2], [S4, ch4], [S5, ch5], [S6, ch6], [S7, ch7]], tick = false;
  function frame() {
    tick = false;
    top.classList.toggle('solid', scrollY > innerHeight * .6);
    CH.forEach(function (c) { if (vis(c[0])) c[1](prog(c[0])); });
  }
  function req() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  CH.forEach(function (c) { c[1](prog(c[0])); });
  frame();

  /* Aktiver Menüpunkt */
  var navA = $$('.nav a');
  var navIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) navA.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['rechner', 'besichtigung', 'halteverbot', 'live', 'karriere', 'bewertungen'].forEach(function (id) { navIO.observe($('#' + id)); });

  /* ---------- Bewertungen: hochzählen, Sterne füllen, Karten wechseln ---------- */
  var revDone = false;
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting || revDone) return; revDone = true;
      $$('.count', e.target).forEach(function (el) {
        var to = +el.getAttribute('data-to'), d = +el.getAttribute('data-dec'), t0 = performance.now(), dur = RM ? 0 : 1600;
        (function st(t) { var k = dur ? clamp((t - t0) / dur, 0, 1) : 1; el.textContent = de(to * ease(k), d); if (k < 1) requestAnimationFrame(st); })(t0);
      });
      var stars = $('.stars', e.target); setTimeout(function () { stars.style.transition = 'none'; var t0 = performance.now(); (function st(t) { var k = clamp((t - t0) / 1600, 0, 1); stars.style.setProperty('--v', (.98 * ease(k)).toFixed(3)); if (k < 1) requestAnimationFrame(st); })(t0); }, 100);
    });
  }, { threshold: .3 }).observe($('#bewertungen'));
  var qs = $$('#quotes figure'), qi = 0;
  // nacheinander: erst ausblenden, dann die nächste Karte einblenden (nie Text über Text)
  setInterval(function () { qs[qi].classList.remove('on'); qi = (qi + 1) % qs.length; var n = qs[qi]; setTimeout(function () { n.classList.add('on'); }, 800); }, 5600);

  /* ---------- Freie Termine (Beispiel) ---------- */
  (function () {
    var cal = $('#cal'), d = new Date(); d.setHours(0, 0, 0, 0);
    ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].forEach(function (w) { var s = document.createElement('span'); s.className = 'dh'; s.textContent = w; cal.appendChild(s); });
    var start = new Date(d); start.setDate(d.getDate() + 7 - ((d.getDay() + 6) % 7)); // nächster Montag
    for (var i = 0; i < 21; i++) {
      var x = new Date(start); x.setDate(start.getDate() + i);
      var b = document.createElement('button'); b.type = 'button'; b.textContent = x.getDate() + '.';
      var wd = (x.getDay() + 6) % 7, free = wd < 6 && ((i * 7 + 3) % 5 !== 0);
      b.setAttribute('aria-label', x.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }) + (free ? ', frei' : ', belegt'));
      if (free) { b.className = 'free'; b.addEventListener('click', function () { $$('#cal .sel').forEach(function (s) { s.classList.remove('sel'); }); this.classList.add('sel'); }); } else b.disabled = true;
      cal.appendChild(b);
    }
    var n = document.createElement('p'); n.className = 'cal-note'; n.textContent = 'Beispiel-Kalender · freie Tage sind hervorgehoben'; cal.appendChild(n);
  })();

  /* ---------- Modals mit Schritt-Formular ---------- */
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      var m = $('#' + b.getAttribute('data-open'));
      $$('.step', m).forEach(function (s, i) { s.classList.toggle('on', i === 0); });
      if (m.showModal) m.showModal(); else m.setAttribute('open', '');
    });
  });
  $$('[data-flow]').forEach(function (f) {
    $$('[data-next]', f).forEach(function (b) {
      b.addEventListener('click', function () {
        var cur = b.closest('.step'), nx = cur.nextElementSibling;
        if (nx && nx.classList.contains('step')) { cur.classList.remove('on'); nx.classList.add('on'); var i = $('input', nx); if (i && !mobile()) i.focus(); }
      });
    });
  });
  $$('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) m.close(); }); });
})();
