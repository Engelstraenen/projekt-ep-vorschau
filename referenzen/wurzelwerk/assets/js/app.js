/* WURZELWERK – Demo (PROJEKT EX). Vanilla-JS, Scroll-Kapitel hängen an der Scroll-Position. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var eio = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var band = function (p, a, b, f) { f = f || .05; return Math.min(seg(p, a, a + f), 1 - seg(p, b - f, b)); };
  var mobile = function () { return innerWidth < 900; };

  /* ---------- Bilder: data-img="name" -> assets/img/name.webp (Handy -m) ---------- */
  var IMG = window.WW_IMG || {};
  $$('[data-img]').forEach(function (el) {
    var n = el.getAttribute('data-img');
    if (IMG[n]) el.src = 'assets/img/' + n + (mobile() ? '-m' : '') + (el.hasAttribute('data-png') ? '.png' : '.webp') + '?v=' + (IMG._v || 1);
    else { el.removeAttribute('src'); el.style.visibility = 'hidden'; }
  });
  // Teile ohne Foto ausblenden, nie Platzhalter zeigen
  $$('[data-need]').forEach(function (el) { if (!IMG[el.getAttribute('data-need')]) el.style.display = 'none'; });

  /* ---------- Persönlicher Link ?firma=Name ---------- */
  (function () {
    var f = null;
    try { f = new URLSearchParams(location.search).get('firma'); if (f) sessionStorage.setItem('ww-firma', f); else f = sessionStorage.getItem('ww-firma'); } catch (e) {}
    if (!f) return;
    $$('[data-firma]').forEach(function (el) { el.textContent = f; });
    root.classList.add('has-firma');
  })();

  /* ---------- Menü, Modal, Toast ---------- */
  var burger = $('.burger');
  burger.addEventListener('click', function () { var o = root.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false); }); });
  var toastT;
  function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); root.classList.remove('menu-open');
      var m = $('#m-' + b.getAttribute('data-open')); if (!m || !m.showModal) return;
      var mp = $('.m-plan', m);
      if (mp) { var s = b.hasAttribute('data-plan') ? planSummary() : ''; mp.hidden = !s; mp.textContent = s; }
      m.showModal();
    });
  });
  $('#m-anfrage form').addEventListener('submit', function (e) { if (e.submitter && e.submitter.value === 'ok') toast('Demo: Anfrage wäre jetzt beim Team. Rückmeldung in 24 Stunden.'); });

  /* ---------- Kapitel-Punkte + Navigation hell/dunkel ---------- */
  var secs = $$('main > section');
  var dots = $('.dots');
  secs.forEach(function () { dots.appendChild(document.createElement('i')); });
  var dotEls = $$('i', dots), nav = $('.nav');

  /* ---------- Fortschritt je Kapitel ---------- */
  function prog(sec) { var r = sec.getBoundingClientRect(), h = sec.offsetHeight - innerHeight; return h > 0 ? clamp(-r.top / h, 0, 1) : 0; }
  function show(el, o, dy, dx) { if (!el) return; el.style.opacity = o.toFixed(3); el.style.transform = 'translate(' + ((1 - o) * (dx || 0)).toFixed(1) + 'px,' + ((1 - o) * (dy == null ? 30 : dy)).toFixed(1) + 'px)'; }

  /* ---------- Film: Video spulen (falls vorhanden), sonst Standbild ---------- */
  function Film(sec) {
    var box = $('.media', sec), v = $('.vid', box), ok = false;
    var base = v.getAttribute('data-src'), key = v.getAttribute('data-key'), V = window.WW_VID || {};
    if (base && V[key]) {
      var s = document.createElement('source');
      s.src = base + (mobile() ? (innerWidth / innerHeight <= .75 ? '-p' : '-m') : '') + '.mp4?v=' + (V._v || 1); s.type = 'video/mp4'; v.appendChild(s);
      v.addEventListener('loadeddata', function () { ok = true; box.classList.add('has-vid'); });
      v.load(); var pr = v.play && v.play(); if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
    }
    var cur = 0, want = 0, run = false;
    function step() {
      cur += (want - cur) * .35;
      if (Math.abs(want - cur) < .01) cur = want;
      if (Math.abs(v.currentTime - cur) > .02 || cur === want) v.currentTime = cur;
      if (cur !== want) requestAnimationFrame(step); else run = false;
    }
    return function (p, z) {
      if (z != null) box.style.setProperty('--z', z);
      if (ok && v.duration) {
        want = Math.min(v.duration - .05, v.duration * p);
        if (!run) { run = true; requestAnimationFrame(step); }
      }
      return ok;
    };
  }

  /* 1 Einstieg: Werkzeug über die Linse (4 Wisch-Clips, Standbilder als Rückfall) */
  var Z = $('#zeitraffer'), zm = $('.op-media', Z), zst = $$('img.still', Z), zv = $$('video.vid', Z), zbar = $('.zr-bar i', Z), zpct = $('.zr-pct', Z), zhint = $('.scroll-hint', Z);
  var zVor = $('.op-vor', Z), zNach = $('.op-nach', Z), zTags = $$('.op-tag', Z), zCta = $('.op-cta', Z);
  var ZW = [[.05, .22], [.29, .46], [.53, .7], [.77, .92]];
  var zOk = [], zCur = [0, 0, 0, 0], zWant = [0, 0, 0, 0], zRun = false, ZV = window.WW_VID || {};
  zv.forEach(function (v, i) {
    var key = v.getAttribute('data-key'); zOk[i] = false;
    if (!ZV[key]) return;
    var s = document.createElement('source');
    s.src = v.getAttribute('data-src') + (mobile() ? (innerWidth / innerHeight <= .75 ? '-p' : '-m') : '') + '.mp4?v=' + (ZV._v || 1); s.type = 'video/mp4'; v.appendChild(s);
    v.addEventListener('loadeddata', function () { zOk[i] = true; if (window.WWreq) window.WWreq(); });
    v.load();
  });
  function zStep() {
    var more = false;
    zv.forEach(function (v, i) {
      if (!zOk[i] || !v.duration) return;
      zCur[i] += (zWant[i] - zCur[i]) * .4;
      if (Math.abs(zWant[i] - zCur[i]) < .01) zCur[i] = zWant[i]; else more = true;
      if (Math.abs(v.currentTime - zCur[i]) > .015) v.currentTime = zCur[i];
    });
    if (more) requestAnimationFrame(zStep); else zRun = false;
  }
  function zeit() {
    var p = prog(Z), k = 0;
    for (var i = 0; i < 4; i++) if (p >= ZW[i][0]) k = i;
    var t = clamp((p - ZW[k][0]) / (ZW[k][1] - ZW[k][0]), 0, 1);
    var useVid = zOk[k];
    zv.forEach(function (v, i) {
      v.classList.toggle('on', useVid && i === k);
      if (zOk[i] && v.duration) zWant[i] = i < k ? v.duration - .04 : i > k ? 0 : Math.min(v.duration - .04, v.duration * t);
    });
    if (!zRun) { zRun = true; requestAnimationFrame(zStep); }
    var si = k + (t > .5 ? 1 : 0);
    zst.forEach(function (im, i) { im.classList.toggle('on', !useVid && i === si); });
    show(zVor, 1 - seg(p, .035, .08), -40);
    show(zTags[0], band(p, .2, .31, .025), 30);
    show(zTags[1], band(p, .44, .55, .025), 30);
    show(zTags[2], band(p, .68, .79, .025), 30);
    show(zNach, band(p, .9, .965, .025), 40);
    var c = seg(p, .955, .99);
    zCta.style.opacity = c.toFixed(3); zCta.classList.toggle('show', c > .5);
    zm.style.filter = c > 0 ? 'blur(' + (c * 10).toFixed(1) + 'px) brightness(' + (1 - c * .35).toFixed(2) + ')' : '';
    zbar.style.width = (p * 100).toFixed(1) + '%';
    zpct.textContent = Math.round(p * 100) + ' %';
    zhint.style.opacity = p < .03 ? .7 : 0;
  }

  /* 2 Rollrasen */
  var R = $('#rasen'), rStrip = $('.rs-strip', R), rRoll = $('.rs-roll', R), rH1 = $('.rs-h1', R), rH2 = $('.rs-h2', R), rEnd = $('.rs-end', R), rCta = $('.rs-cta', R);
  function rasen() {
    var p = prog(R), u = eio(seg(p, .1, .5)), w = eio(seg(p, .52, .68));
    var sx = (mobile() ? 14 : 31) * (1 - w);
    rStrip.style.setProperty('--sx', sx + '%');
    var y0 = 26 + 64 + rRoll.offsetHeight * .5, ry = y0 + u * (innerHeight - y0);
    rStrip.style.setProperty('--sb', (u > 0 ? innerHeight - ry : innerHeight).toFixed(1) + 'px');
    rRoll.style.setProperty('--ry', ry.toFixed(1) + 'px');
    rRoll.style.opacity = 1 - seg(p, .5, .56);
    rRoll.style.width = ((mobile() ? 78 : 42) * (1 - u * .25) * (1 + w * .6)) + '%';
    show(rH1, 1 - seg(p, .08, .16), -30);
    show(rH2, seg(p, .3, .4) * (1 - seg(p, .72, .78)), 30);
    var e = seg(p, .74, .84);
    rEnd.style.opacity = e.toFixed(3);
    show(rCta, seg(p, .8, .9), 40);
    rEnd.style.pointerEvents = e > .5 ? 'auto' : 'none';
  }

  /* 7 Karriere */
  var K = $('#karriere'), kf = Film(K), kw = $$('.k-w', K), kb = $$('.k-w2', K), kc = $('.k-cta', K);
  function karriere() {
    var p = prog(K);
    kf(p, 1 + p * .12);
    kw.forEach(function (el, i) { var a = .06 + i * .1; show(el, eout(seg(p, a, a + .08)), 0, -120); });
    kb.forEach(function (el, i) { var a = .38 + i * .13; show(el, band(p, a, a + .13, .035), 50); });
    kc.classList.toggle('show', p > .3);
  }

  /* ---------- Scroll-Schleife ---------- */
  var tick = false;
  function frame() {
    tick = false;
    zeit(); rasen(); karriere();
    var y = innerHeight * .35, active = 0;
    secs.forEach(function (s, i) { var r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) active = i; });
    dotEls.forEach(function (d, i) { d.classList.toggle('on', i === active); });
    var under = document.elementFromPoint(innerWidth / 2, 26 + 64 + 4);
    var light = under && under.closest('.light, .paper');
    nav.classList.toggle('on-light', !!light);
    nav.classList.toggle('solid', scrollY > 40 && !light);
  }
  function req() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  window.WWreq = req;
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();

  /* ---------- Sichtbar-Beobachter ---------- */
  function onView(el, f, th) { if (!el) return; var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { f(); io.disconnect(); } }); }, { threshold: th || .35 }); io.observe(el); }

  /* 3 Leistungen: Streifen fahren hoch, Tippen öffnet */
  var strips = $$('.strip');
  strips.forEach(function (s, i) {
    s.style.setProperty('--ty', '120px'); s.style.setProperty('--op', '0'); s.style.transitionDelay = (i * .09) + 's';
    s.addEventListener('click', function () { var on = s.classList.contains('on'); strips.forEach(function (o) { o.classList.remove('on'); }); if (!on) s.classList.add('on'); });
  });
  onView($('.strips'), function () {
    strips.forEach(function (s) { s.style.setProperty('--ty', '0px'); s.style.setProperty('--op', '1'); });
    setTimeout(function () { strips.forEach(function (s) { s.style.transitionDelay = '0s'; }); var v = strips.filter(function (s) { return s.style.display !== 'none'; }); if (v[1] && !mobile()) v[1].classList.add('on'); }, 1200);
  }, .2);

  /* 4 Vorher / Nachher */
  var ba = $('.ba'), baIn = $('.ba-in');
  if (ba && baIn) {
    baIn.addEventListener('input', function () { ba.style.setProperty('--p', baIn.value + '%'); });
    onView(ba, function () { var t0 = performance.now(); (function an(t) { var k = clamp((t - t0) / 1600, 0, 1), v = 50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k); ba.style.setProperty('--p', v + '%'); baIn.value = v; if (k < 1) requestAnimationFrame(an); })(t0); });
  }

  /* 5 Gartenplaner: 16 x 10 m */
  var plan = $('.pl-plan'), m2El = $('.pl-m2'), listEl = $('.pl-list'), PW = 16, PH = 10, HOUSE = 1.2;
  var NAMES = { terrasse: 'Terrasse', rasen: 'Rasen', hochbeet: 'Hochbeet', weg: 'Weg', teich: 'Teich', baum: 'Baum' };
  var els = [];
  function place(o) {
    o.el.style.left = (o.x / PW * 100) + '%'; o.el.style.top = (o.y / PH * 100) + '%';
    o.el.style.width = (o.w / PW * 100) + '%'; o.el.style.height = (o.h / PH * 100) + '%';
  }
  function sum() {
    var t = 0, c = {};
    els.forEach(function (o) { var a = o.w * o.h; if (o.t !== 'baum') t += a; c[o.t] = (c[o.t] || 0) + a; });
    m2El.textContent = Math.round(t);
    listEl.textContent = Object.keys(c).map(function (k) { return NAMES[k] + ' ' + c[k] + ' m²'; }).join(' · ');
  }
  function add(t, w, h, x, y) {
    var el = document.createElement('div'); el.className = 'pe pe-' + t;
    el.innerHTML = NAMES[t] + (t !== 'baum' ? '<small>' + (w * h) + ' m²</small>' : '');
    var o = { t: t, w: w, h: h, x: x, y: y, el: el };
    if (x == null) { o.x = clamp((PW - w) / 2 + (Math.random() - .5) * 4, 0, PW - w); o.y = clamp(HOUSE + (PH - HOUSE - h) / 2 + (Math.random() - .5) * 3, HOUSE, PH - h); }
    els.push(o); place(o); plan.appendChild(el); sum();
    var sx, sy, ox, oy, moved, last = 0;
    el.addEventListener('pointerdown', function (e) {
      e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('drag');
      sx = e.clientX; sy = e.clientY; ox = o.x; oy = o.y; moved = false;
    });
    el.addEventListener('pointermove', function (e) {
      if (!el.classList.contains('drag')) return;
      var r = plan.getBoundingClientRect();
      var dx = (e.clientX - sx) / r.width * PW, dy = (e.clientY - sy) / r.height * PH;
      if (Math.abs(dx) + Math.abs(dy) > .15) moved = true;
      o.x = Math.round(clamp(ox + dx, 0, PW - o.w) * 2) / 2; o.y = Math.round(clamp(oy + dy, HOUSE, PH - o.h) * 2) / 2; place(o);
    });
    el.addEventListener('pointerup', function () {
      el.classList.remove('drag');
      if (!moved) { var n = Date.now(); if (n - last < 380) { el.remove(); els = els.filter(function (x) { return x !== o; }); sum(); } last = n; }
    });
  }
  $$('.pt').forEach(function (b) { b.addEventListener('click', function () { add(b.getAttribute('data-t'), +b.getAttribute('data-w'), +b.getAttribute('data-h')); }); });
  // Startplan wie im Storyboard: Terrasse, Rasen, Hochbeet, Weg = 62 m²
  add('terrasse', 5, 4, .5, 1.5); add('rasen', 7, 5, 6.5, 2); add('hochbeet', 3, 1, 12.5, 8.5); add('weg', 1, 4, 5.5, 5.5); add('baum', 2, 2, 14, 2);
  function planSummary() { return 'Dein Plan: ' + (listEl.textContent || 'leer') + ' · gesamt ' + m2El.textContent + ' m²'; }

  /* 6 Angebot per Foto: Ecken ziehen, Fläche live */
  var scr = $('.af-phone .ph-screen'), poly = $('.af-poly'), m2b = $('.af-m2 b');
  if (scr && poly) {
    var pts = [[18, 96], [82, 92], [92, 150], [8, 154]], K0 = null;
    var area = function () { var a = 0; for (var i = 0; i < 4; i++) { var j = (i + 1) % 4; a += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1]; } return Math.abs(a / 2); };
    K0 = 36 / area();
    var draw = function () { poly.setAttribute('points', pts.map(function (q) { return q.join(','); }).join(' ')); m2b.textContent = Math.round(area() * K0); knobs.forEach(function (k, i) { k.style.left = pts[i][0] + '%'; k.style.top = (pts[i][1] / 178 * 100) + '%'; }); };
    var knobs = pts.map(function (q, i) {
      var k = document.createElement('span'); k.className = 'af-knob'; k.setAttribute('aria-label', 'Ecke ' + (i + 1)); scr.appendChild(k);
      k.addEventListener('pointerdown', function (e) { e.preventDefault(); k.setPointerCapture(e.pointerId); k.dataset.d = 1; });
      k.addEventListener('pointermove', function (e) { if (!k.dataset.d) return; var r = scr.getBoundingClientRect(); pts[i] = [clamp((e.clientX - r.left) / r.width * 100, 2, 98), clamp((e.clientY - r.top) / r.height * 178, 40, 170)]; draw(); });
      k.addEventListener('pointerup', function () { delete k.dataset.d; });
      return k;
    });
    draw(); m2b.textContent = '0';
    onView(scr, function () {
      var t0 = performance.now();
      (function an(t) { var k = clamp((t - t0) / 1400, 0, 1); poly.style.setProperty('--dash', (400 * (1 - eout(k))).toFixed(1)); m2b.textContent = Math.round(36 * eout(k)); if (k < 1) requestAnimationFrame(an); })(t0);
    });
  }

  /* 8 Bewerben in 60 Sekunden */
  var Q = [
    { h: 'Was fährst du?', o: ['Bagger', 'Radlader', 'Noch nichts'], ic: [
      '<path d="M2 19h12M3 21.5h10a1.5 1.5 0 0 0 0-3H3a1.5 1.5 0 0 0 0 3zM4 18v-5h6l1 5M6 13V9h4l1 4M10 11l5-6 5 3-2 4M18 12l2 3h-3"/>',
      '<circle cx="6" cy="18" r="2.6"/><circle cx="16" cy="18" r="2.6"/><path d="M3 15V9h5l2 4h6v5M8.6 18h4.8M16 13l3-4h2.5v4H19"/>',
      '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'] },
    { h: 'Azubi oder Profi?', o: ['Ausbildung', 'Schon Profi', 'Quereinstieg'] },
    { h: 'Ab wann?', o: ['Sofort', 'In 3 Monaten', 'Nächstes Ausbildungsjahr'] }
  ];
  var box = $('.bw-cards'), bar = $('.bw-bar i'), nEl = $('.bw-n'), clk = $('.bw-clock b'), ring = $('.bw-ring');
  if (box) {
    var cards = [], step = 0, left = 60, timer = null;
    Q.forEach(function (q) {
      var c = document.createElement('div'); c.className = 'bw-card';
      c.innerHTML = '<span class="stamp">OK</span><h4>' + q.h + '</h4>' + q.o.map(function (o, k) { return '<button class="opt">' + o + (q.ic ? '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + q.ic[k] + '</svg>' : '<span>›</span>') + '</button>'; }).join('') + '<div class="bw-pb"><i style="width:' + (cards.length + 1) * 25 + '%"></i></div>';
      cards.push(c);
    });
    var form = document.createElement('form'); form.className = 'bw-card';
    form.innerHTML = '<h4>Fast fertig.</h4><input name="v" placeholder="Vorname" autocomplete="given-name" required><input name="n" placeholder="Nachname" autocomplete="family-name" required><input name="o" placeholder="Wohnort" autocomplete="address-level2"><input name="e" type="email" placeholder="E-Mail" autocomplete="email"><input name="t" type="tel" placeholder="Handynummer" autocomplete="tel" required><button class="btn lime">Abschicken</button>';
    cards.push(form);
    var done = document.createElement('div'); done.className = 'bw-card bw-done'; done.innerHTML = '<b>✓</b><h4>Danke!</h4><p>Wir rufen dich an. Versprochen.</p><small>Demo: Es wird nichts gesendet.</small>';
    cards.push(done);
    cards.slice().reverse().forEach(function (c) { box.appendChild(c); });
    var lay = function () {
      cards.forEach(function (c, i) { c.classList.toggle('out', i < step); c.classList.toggle('next', i === step + 1); c.classList.toggle('hide', i > step + 1); });
      bar.style.width = (Math.min(step, 4) / 4 * 100) + '%'; nEl.textContent = Math.min(step + 1, 4) + ' / 4';
    };
    var start = function () { if (timer) return; timer = setInterval(function () { left = Math.max(0, left - 1); clk.textContent = left; ring.style.strokeDashoffset = (94.25 * (1 - left / 60)).toFixed(2); if (!left) clearInterval(timer); }, 1000); };
    cards.forEach(function (c, i) { $$('.opt', c).forEach(function (b) { b.addEventListener('click', function () { start(); b.classList.add('sel'); setTimeout(function () { step = i + 1; lay(); }, 220); }); }); });
    form.addEventListener('submit', function (e) { e.preventDefault(); clearInterval(timer); step = 4; lay(); bar.style.width = '100%'; nEl.textContent = 'fertig'; toast('Demo: Bewerbung nach ' + (60 - left) + ' Sekunden. Es wurde nichts gesendet.'); });
    lay();
  }

  /* 9 Bewertungen: Sterne füllen, Beispielkarten wechseln */
  onView($('.rv-stars'), function () { $$('.rv-stars i').forEach(function (s, i) { setTimeout(function () { s.style.setProperty('--f', 1); }, 250 + i * 220); }); });
  var rc = $$('.rv-card'), ri = 0;
  setInterval(function () { rc[ri].classList.remove('on'); ri = (ri + 1) % rc.length; setTimeout(function () { rc[ri].classList.add('on'); }, 700); }, 5200);
})();
