/* FARBKANTE – Demo (PROJEKT EX). Vanilla-JS, alles hängt an der Scroll-Position. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var mobile = function () { return innerWidth < 900; };

  /* ---------- Bilder: data-img="name" → assets/img/name.webp (mobil -m) ---------- */
  var IMG = window.FK_IMG || {};           // aus img.js: {name:{w,h,png}}
  function src(name, png) {
    var m = mobile() ? '-m' : '';
    return 'assets/img/' + name + m + (png ? '.png' : '.webp') + '?v=' + (IMG._v || 1);
  }
  $$('[data-img]').forEach(function (el) {
    var n = el.getAttribute('data-img');
    if (IMG[n]) { el.src = src(n, el.hasAttribute('data-png')); }
    else { el.classList.add('ph'); el.setAttribute('data-ph', n + ' rendert'); el.removeAttribute('src'); }
  });
  // Teile, deren Foto noch fehlt, ganz ausblenden statt Platzhalter zeigen
  $$('[data-need]').forEach(function (el) { if (!IMG[el.getAttribute('data-need')]) el.style.visibility = 'hidden'; });

  /* ---------- Persönlicher Link: ?firma=Maler+Müller ---------- */
  (function () {
    var f = null;
    try { f = new URLSearchParams(location.search).get('firma'); if (f) sessionStorage.setItem('fk-firma', f); else f = sessionStorage.getItem('fk-firma'); } catch (e) {}
    if (!f) return;
    $$('[data-firma]').forEach(function (el) { el.textContent = f; });
    root.classList.add('has-firma');
  })();

  /* ---------- Menü, Toast, Modal ---------- */
  $('.nav-menu').addEventListener('click', function () {
    var o = root.classList.toggle('menu-open'); this.setAttribute('aria-expanded', o);
  });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); }); });
  var toastT;
  function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2600); }
  $$('[data-open="termin"]').forEach(function (b) { b.addEventListener('click', function () { var m = $('#m-termin'); if (m.showModal) m.showModal(); }); });
  $('#m-termin form').addEventListener('submit', function () { toast('Demo: Anfrage wäre jetzt beim Meister.'); });
  $$('.social span').forEach(function (s) { s.addEventListener('click', function () { toast('Demo: Beispiel-Kanal'); }); });

  /* ---------- Kapitel-Punkte ---------- */
  var chs = $$('.ch');
  var dots = $('.dots');
  chs.forEach(function (c) { var i = document.createElement('i'); dots.appendChild(i); });
  var dotEls = $$('i', dots);

  /* ---------- Fortschritt je Kapitel ---------- */
  function prog(sec) {
    var r = sec.getBoundingClientRect(), h = sec.offsetHeight - innerHeight;
    return h > 0 ? clamp(-r.top / h, 0, 1) : (r.top < innerHeight && r.bottom > 0 ? 1 : 0);
  }
  function show(el, o, dy) {
    if (!el) return;
    el.style.opacity = o.toFixed(3);
    el.style.transform = (el.classList.contains('b-hero') ? 'translateY(-40%) ' : '') + 'translateY(' + ((1 - o) * (dy == null ? 24 : dy)).toFixed(1) + 'px)';
  }
  function band(p, a, b, f) { f = f || .06; return Math.min(seg(p, a, a + f), 1 - seg(p, b - f, b)); }

  /* ---------- Film-Kapitel: Video spulen oder Standbild mit Kamerafahrt ---------- */
  function Film(sec, from, to, box) {
    box = box || $('.media', sec);
    var v = $('.vid', box), stage = $('.stage', sec), ok = false, own = !box.classList.contains('media');
    var base = v.getAttribute('data-src'), key = v.getAttribute('data-key') || sec.id;
    if (base && (window.FK_VID || {})[key]) {
      var s = document.createElement('source');
      // volle 2K-Auflösung: Desktop 2560, Handy hochkant 1080x1440-Ausschnitt (-p), Handy quer 1280 (-m)
      s.src = base + (mobile() ? (innerWidth / innerHeight <= .75 ? '-p' : '-m') : '') + '.mp4?v=' + FK_VID._v; s.type = 'video/mp4'; v.appendChild(s);
      v.addEventListener('loadeddata', function () { ok = true; (own ? box : stage).classList.add('has-vid'); });
      v.load(); var pr = v.play && v.play(); if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
    }
    var want = 0, cur = 0;
    return function (p, z) {
      if (z != null) box.style.setProperty('--z', z);
      if (ok && v.duration) {
        want = from + (Math.min(to || v.duration, v.duration - .05) - from) * p;
        cur += (want - cur) * .35;
        if (Math.abs(v.currentTime - cur) > .02) v.currentTime = cur;
      }
    };
  }

  /* 1 Fassade */
  var S1 = $('#fassade'), f1 = Film(S1, 0), b1 = $$('.beat', S1), t1 = $('.tag', S1);
  // Drohnenflug ins Fenster (Film 1c): ersetzt Fenster-Standbild + Zoom, endet im Bilderrahmen von Kapitel 2
  var winEl = $('.window', S1), fD = Film(S1, 0, null, winEl), HASD = !!(window.FK_VID || {}).drohne;
  if (HASD) S1.style.setProperty('--h', '407vh');  // 560vh vor der Beschleunigung (21.11.: Scrollen 50 % schneller)
  function ch1d(p) {
    var A = .6;  // Fassade-Film bis 60 %, danach Drohnenflug
    f1(seg(p, 0, A), 1 + .14 * ease(seg(p, 0, A)));
    show(b1[0], 1 - seg(p, .05, .12), 30);
    show(b1[1], band(p, .1, .33));
    show(b1[2], band(p, .35, .58));
    t1.classList.toggle('on', p > .35 && p < .6);
    // Drohnenfilm setzt ohne Sprung am letzten Fassade-Bild an, fliegt rein, zoomt am Ende ins Innere des Rahmens
    winEl.style.opacity = seg(p, A - .015, A + .01).toFixed(3);
    fD(seg(p, A + .01, .94));
    winEl.style.setProperty('--wz', (1 + 1.6 * Math.pow(ease(seg(p, .94, 1)), 1.4)).toFixed(3));
    $('.wipe', S1).style.opacity = seg(p, .965, 1).toFixed(3);
  }
  function ch1(p) {
    if (HASD) return ch1d(p);
    f1(seg(p, 0, .72), 1 + .14 * ease(seg(p, 0, .72)));
    show(b1[0], 1 - seg(p, .06, .14), 30);
    // Film-Takt (Fassade 2K, 13,9 s): Gerüst wächst 2,5–7,5 s, Streichen 8–13,5 s
    show(b1[1], band(p, .12, .40));
    show(b1[2], band(p, .42, .70));
    t1.classList.toggle('on', p > .42 && p < .74);
    var w = seg(p, .72, 1), win = $('.window', S1);
    win.style.opacity = seg(p, .72, .78).toFixed(3);
    win.style.setProperty('--wz', (1 + 5.5 * Math.pow(ease(seg(p, .78, 1)), 1.6)).toFixed(3));
    $('.wipe', S1).style.opacity = seg(p, .9, 1).toFixed(3);
  }

  /* 2 Leistungen: Rolle rollt fünf Streifen in den Rahmen */
  var S2 = $('#leistungen'), stripes = $$('.stripe', S2), roller2 = $('.roller', S2), frameIn = $('.frame-in', S2);
  var GEO = window.FK_GEO || {};
  // Streifen-Bänder im Bild m1-streifen (Anteil der Bildhöhe) und Rahmen-Innenmaß in m2-rahmen
  var BANDS = GEO.bands || [[.10, .26], [.28, .44], [.46, .62], [.64, .80], [.82, .98]];
  var STRIPE_END = GEO.stripeEnd || .80;
  (function () {
    var hasImg = !!IMG['m1-streifen'];
    stripes.forEach(function (s, i) {
      var b = BANDS[i], hgt = b[1] - b[0];
      s.style.setProperty('--y0', (b[0] * 100) + '%');
      s.style.setProperty('--bh', (hgt * 100) + '%');
      if (hasImg) {
        s.style.setProperty('--src', 'url("' + new URL(src('m1-streifen'), location.href).href + '")');
        s.style.setProperty('--bf', hgt);
        s.style.setProperty('--bp', (b[0] / (1 - hgt) * 100) + '%');
      } else s.classList.add('noimg');
    });
  })();
  // Streifen genau in den Bilderrahmen legen; am Handy aus der echten Bildlage (object-fit: cover) berechnet
  var SW = 1;
  function placeFrame() {
    var f = GEO.frame; if (!f) return;
    if (!mobile()) {
      SW = 1;
      frameIn.style.setProperty('--fx0', f[0] * 100 + '%'); frameIn.style.setProperty('--fy0', f[1] * 100 + '%');
      frameIn.style.setProperty('--fw', (f[2] - f[0]) * 100 + '%'); frameIn.style.setProperty('--fh', (f[3] - f[1]) * 100 + '%');
    } else {
      var st = $('.stage', S2), W = st.clientWidth, H = st.clientHeight, im = IMG['m2-rahmen'] || { w: 5504, h: 3072 };
      var s = Math.max(W / im.w, H / im.h), dw = im.w * s, dh = im.h * s, ox = (W - dw) / 2, oy = (H - dh) / 2;
      var x0 = Math.max(14, ox + f[0] * dw), x1 = Math.min(W - 14, ox + f[2] * dw);
      var y0 = Math.max(62, oy + f[1] * dh), y1 = Math.min(H - 40, oy + f[3] * dh);
      frameIn.style.setProperty('--fx0', x0.toFixed(1) + 'px'); frameIn.style.setProperty('--fy0', y0.toFixed(1) + 'px');
      frameIn.style.setProperty('--fw', (x1 - x0).toFixed(1) + 'px'); frameIn.style.setProperty('--fh', (y1 - y0).toFixed(1) + 'px');
      // hochkant: Streifen breiter, damit der gemalte Teil die ganze Breite füllt
      SW = W < H ? 1.18 : 1;
    }
    stripes.forEach(function (s) { s.style.width = (SW * 100) + '%'; });
  }
  placeFrame(); addEventListener('resize', placeFrame);
  var INFO = [
    ['Innen', 'Wände & Decken', 'Abdecken, spachteln, streichen. Wir räumen auf, bevor wir gehen.', ['Altbau mit Stuck', 'Treppenhäuser', 'Büros am Wochenende']],
    ['Fassade', 'Außen', 'Gerüst, Reinigung, Risse, Anstrich. Ein Ansprechpartner von der Planung bis zum Abbau.', ['Fassadenanstrich', 'Wärmedämmung', 'Graffiti-Schutz']],
    ['Lack', 'Türen, Fenster, Treppen', 'Hochglanz oder seidenmatt, gespritzt oder gestrichen. Alte Türen sehen wieder aus wie neu.', ['Holzfenster', 'Haustüren', 'Heizkörper & Geländer']],
    ['Tapete', 'Tapezieren', 'Von Vlies bis Fototapete. Auf Wunsch mit passender Wandfarbe aus dem Farblabor.', ['Vliestapete', 'Mustertapete', 'Malervlies glatt']],
    ['Spachtel', 'Spachteltechnik', 'Beton-Optik, Kalkputz, Glanzspachtel. Flächen, die man anfassen will.', ['Venezianer Glanz', 'Beton-Optik', 'Kalk & Lehm']]
  ];
  var sheet = $('.sheet', S2);
  stripes.forEach(function (s, i) {
    s.addEventListener('click', function () {
      var d = INFO[i];
      $('.kicker', sheet).textContent = d[1]; $('h3', sheet).textContent = d[0]; $('.txt', sheet).textContent = d[2];
      $('.pts', sheet).innerHTML = d[3].map(function (x) { return '<li>' + x + '</li>'; }).join('');
      sheet.style.setProperty('--c', getComputedStyle(s).getPropertyValue('--c'));
      sheet.hidden = false;
    });
  });
  $('.sheet-x', S2).addEventListener('click', function () { sheet.hidden = true; });
  function ch2(p) {
    $('.frame-img', S2).style.setProperty('--fz', (1.5 - .5 * eout(seg(p, 0, .1))).toFixed(3));
    frameIn.style.opacity = seg(p, 0, .05).toFixed(3);
    S2.querySelector('.ch-title').style.setProperty('--to', seg(p, .04, .12).toFixed(3));
    var k = seg(p, .05, .9) * 5, act = Math.min(4, Math.floor(k));
    stripes.forEach(function (s, i) {
      var r = clamp(k - i, 0, 1), e = ease(r) * STRIPE_END * 100;
      s.style.setProperty('--rv', (r >= 1 ? STRIPE_END * 100 + 3 : e).toFixed(2) + '%');
      s.style.setProperty('--lo', seg(r, .5, 1).toFixed(3));
    });
    var r = clamp(k - act, 0, 1), b = BANDS[act];
    roller2.style.left = (ease(r) * STRIPE_END * 100 * SW).toFixed(2) + '%';
    roller2.style.top = ((b[0] + b[1]) / 2 * 100).toFixed(2) + '%';
    roller2.style.opacity = (p > .9 ? 1 - seg(p, .9, .97) : seg(p, .03, .07)).toFixed(3);
  }

  /* 3 Raum für Raum */
  var S3 = $('#raum'), f3 = Film(S3, 0), b3 = $$('.beat', S3), st3 = $$('.steps li', S3), t3 = $('.tag', S3);
  function ch3(p) {
    f3(seg(p, 0, .78), 1 + .08 * seg(p, 0, .78));
    show(b3[0], band(p, .02, .3));
    show(b3[1], band(p, .5, .74));
    // Schritte im Film-Takt (Raum 2K, 15 s): Abdecken 1 s, Spachteln 4,3 s, Grundieren 6 s, Streichen 8,6 s
    var TH3 = [.052, .224, .312, .447];
    st3.forEach(function (li, i) { li.classList.toggle('on', p > TH3[i]); });
    $('.steps', S3).style.opacity = (1 - seg(p, .74, .8)).toFixed(3);
    t3.classList.toggle('on', p > .04 && p < .76);
    $('.rollover', S3).style.setProperty('--rx', (-105 + 105 * ease(seg(p, .8, 1))).toFixed(2) + '%');
  }

  /* 4 Farblabor + Angebot per Foto */
  var S4 = $('#farblabor');
  var COLORS = [
    ['Petrol', '#13777c'], ['Ocker', '#d6963f'], ['Salbei', '#9dbcb2'], ['Terrakotta', '#c4673f'],
    ['Altrosa', '#d8a7a0'], ['Taubenblau', '#7c93a8'], ['Sand', '#d9c7a6'], ['Anthrazit', '#4a4f53']
  ];
  var chipsEl = $('.chips', S4), room = $('.room', S4), labName = $('.lab-name', S4), picked = -1;
  COLORS.forEach(function (c, i) {
    var b = document.createElement('button'); b.className = 'chip'; b.style.setProperty('--c', c[1]);
    b.setAttribute('role', 'radio'); b.setAttribute('aria-label', c[0]); b.setAttribute('aria-checked', 'false');
    b.addEventListener('click', function () { picked = i; setColor(i); });
    chipsEl.appendChild(b);
  });
  var curCol = -1;
  function setColor(i) {
    if (i === curCol) return; curCol = i;
    room.style.setProperty('--wall', COLORS[i][1]);
    // Echtes Rollen-Foto färbt sich mit: Farbton per Blend-Modus, Helligkeit nach der Farbe
    var hx = COLORS[i][1], r = parseInt(hx.substr(1, 2), 16), g = parseInt(hx.substr(3, 2), 16), bl = parseInt(hx.substr(5, 2), 16);
    var lum = (.299 * r + .587 * g + .114 * bl) / 255;
    S4.style.setProperty('--wall', hx);
    S4.style.setProperty('--lb', clamp(Math.pow(lum / .352, .7), .85, 1.6).toFixed(3));
    labName.textContent = 'Deine Wand in ' + COLORS[i][0];
    $$('.chip', S4).forEach(function (c, j) { c.setAttribute('aria-checked', j === i ? 'true' : 'false'); });
  }
  if (IMG['m5b-maske']) room.style.setProperty('--mask', 'url("' + new URL(src('m5b-maske', true), location.href).href + '")'); else room.classList.add('nomask');
  var phone = $('.phone-scene', S4), calc = $('.calc', S4);
  if (GEO.screen) { var g = GEO.screen; var sc = $('.screen', phone);
    sc.style.setProperty('--sx0', g[0] * 100 + '%'); sc.style.setProperty('--sy0', g[1] * 100 + '%');
    sc.style.setProperty('--sw', (g[2] - g[0]) * 100 + '%'); sc.style.setProperty('--sh', (g[3] - g[1]) * 100 + '%'); }
  // Rechner: jeder Regler bewegt das Messfeld und die Fläche
  var vals = { w: 4.5, h: 3.2, n: 4 };
  function calcUpd() {
    var a = vals.w * vals.h * vals.n;
    $('[data-o="w"]', calc).textContent = vals.w.toFixed(1).replace('.', ',') + ' m';
    $('[data-o="h"]', calc).textContent = vals.h.toFixed(1).replace('.', ',') + ' m';
    $('[data-o="n"]', calc).textContent = vals.n;
    $('[data-o="a"]', calc).textContent = Math.round(a);
    var m = $('.measure', phone);
    m.style.setProperty('--mw', (40 + vals.w / 9 * 52).toFixed(1) + '%');
    m.style.setProperty('--mh', (24 + vals.h / 4.2 * 40).toFixed(1) + '%');
    $('.m2', m).textContent = (vals.w * vals.h).toFixed(1).replace('.', ',') + ' m² × ' + vals.n;
  }
  $$('input[type=range]', calc).forEach(function (r) {
    r.addEventListener('input', function () { vals[r.getAttribute('data-k')] = parseFloat(r.value); calcUpd(); });
  });
  calcUpd();
  $$('.shot input, .shot2 input', S4).forEach(function (inp) {
    inp.addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      var u = URL.createObjectURL(f); $('.cam', phone).style.setProperty('--camimg', 'url(' + u + ')');
      toast('Foto bleibt auf deinem Gerät (Demo).');
    });
  });
  function ch4(p) {
    $('.fan', S4).style.setProperty('--fa', (ease(seg(p, .02, .16)) * 170 + seg(p, .16, .2) * 191).toFixed(1) + 'deg');
    if (picked < 0) setColor(Math.min(7, Math.floor(seg(p, .14, .5) * 8)));
    var t = ease(seg(p, .52, .64));
    room.style.opacity = (1 - t).toFixed(3);
    room.style.transform = 'translateY(' + (-40 * t).toFixed(1) + 'px) scale(' + (1 - .04 * t).toFixed(3) + ')';
    phone.style.opacity = t.toFixed(3);
    phone.style.transform = 'translateY(' + (40 * (1 - t)).toFixed(1) + 'px) scale(' + (.96 + .04 * t).toFixed(3) + ')';
    var labL = $('.lab-l', S4), labR = $('.lab-r', S4);
    if (mobile()) {
      // Handy: Fächer + Farben weichen, das Handy-Bild rückt nach oben über den Rechner
      var hh = $('.lab-h', S4), dy = labR.offsetTop - (labL.offsetTop + hh.offsetTop + hh.offsetHeight + 12);
      labL.querySelectorAll('.fan,.chips,.lab-name').forEach(function (e) { e.style.opacity = (1 - t).toFixed(3); });
      labR.style.transform = innerWidth < innerHeight ? 'translateY(' + (-dy * t).toFixed(1) + 'px)' : '';
    } else { labL.style.opacity = (1 - .55 * t).toFixed(3); labR.style.transform = ''; }
    calc.classList.toggle('on', p > .62 && p < .99);
    // Messfeld zieht sich beim Scrollen auf
    $('.measure', phone).style.opacity = seg(p, .64, .7).toFixed(3);
  }

  /* 5 Karriere: Film + Vorteile groß auf echten Rollstrichen */
  var S5 = $('#karriere'), f5 = Film(S5, 0), b5 = $$('.beat', S5), PK = $$('.pk', S5), dim5 = $('.pk-dim', S5);
  function absUrl(u) { return new URL(u, location.href).href; }
  PK.forEach(function (pk) {
    var n = 'stroke-' + pk.getAttribute('data-s'), el = $('.pk-s', pk);
    if (IMG[n]) el.style.backgroundImage = 'url("' + absUrl(src(n, true)) + '")';
    else el.style.background = 'var(--teal)';
  });
  // Handy: lange Vorteil-Wörter (z. B. „Eigenes Werkzeug.“) so verkleinern, dass sie in die Breite passen
  function fitPk() {
    PK.forEach(function (pk) {
      var h = $('h3', pk), w = $('.pk-w', pk); h.style.fontSize = '';
      if (!mobile()) return;
      for (var i = 0; i < 3; i++) {
        var av = pk.clientWidth - 6, ww = w.offsetWidth;
        if (ww <= av) break;
        h.style.fontSize = (parseFloat(getComputedStyle(h).fontSize) * av / ww).toFixed(1) + 'px';
      }
    });
  }
  fitPk(); addEventListener('resize', fitPk);
  // Kopfleiste sitzt direkt unter der (am Handy mehrzeiligen) Demo-Leiste
  function demoH() { var d = $('.demo'); if (d) root.style.setProperty('--dh', d.offsetHeight + 'px'); }
  demoH(); addEventListener('resize', demoH);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitPk);
  function ch5(p) {
    f5(seg(p, 0, 1), 1.02 + .1 * p);
    show(b5[0], band(p, .02, .2));
    dim5.style.opacity = (seg(p, .17, .25) * (1 - seg(p, .985, 1) * .4)).toFixed(3);
    var n = PK.length, a = .22, span = (.99 - a) / n;
    PK.forEach(function (pk, i) {
      var t = (p - a - i * span) / span, last = i === n - 1;
      var inn = eout(seg(t, 0, .34)), out = last ? 0 : ease(seg(t, .8, 1));
      pk.style.visibility = (t > -.02 && (last || t < 1.02)) ? 'visible' : 'hidden';
      pk.style.setProperty('--sv', (eout(seg(t, .02, .3)) * 100).toFixed(1) + '%');
      pk.style.setProperty('--tx', ((1 - inn) * 38).toFixed(2) + 'vw');
      pk.style.setProperty('--ty', (-out * 26).toFixed(2) + 'vh');
      pk.style.opacity = Math.min(seg(t, .04, .22), 1 - out).toFixed(3);
    });
  }

  /* 6 Bewerben: Handy mit Kartenstapel (wischen oder tippen), Uhr mit Ring */
  var S6 = $('#bewerben');
  var Q = [
    ['Lieber drinnen oder draußen?', 'Drinnen', 'Draußen'],
    ['Höhe auf dem Gerüst?', 'Lieber unten', 'Kein Problem'],
    ['Was reizt dich mehr?', 'Farbe & Gestaltung', 'Lack & Technik'],
    ['Wann kannst du starten?', 'Nach der Schule', 'Sofort'],
    ['Wie erreichen wir dich?', 'Anruf', 'WhatsApp']
  ];
  var deck = $('.deck', S6), progEl = $('.prog', S6), barEl = $('.ps-bar', S6), clockEl = $('.clock', S6);
  var qi = 0, t0 = 0, clockT, answers = [], hinted = false;
  function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + Math.floor(s % 60)).slice(-2); }
  function tickClock() {
    var s = (Date.now() - t0) / 1000;
    $('b', clockEl).textContent = fmt(s);
    clockEl.style.setProperty('--cl', Math.min(1, s / 60).toFixed(3));
  }
  function cardHtml(q, i) {
    return '<span class="stamp l">' + q[1] + '</span><span class="stamp r">' + q[2] + '</span>' +
      '<div><span class="qn">FRAGE ' + (i + 1) + '</span><h4>' + q[0] + '</h4></div>' +
      '<div class="opts"><button class="l">' + q[1] + '</button><button class="r">' + q[2] + '</button></div>';
  }
  var STEPS = Q.length + 1, sent = false;
  var FORM_HEAD = '<div><span class="qn">LETZTER SCHRITT</span><h4>Wie erreichen wir dich?</h4></div>';
  function renderForm() {
    S6.classList.add('form-on');
    progEl.textContent = 'Fast fertig';
    var c = document.createElement('form'); c.className = 'card form'; c.noValidate = true;
    c.innerHTML = FORM_HEAD +
      '<div class="fields">' +
      '<div class="row2"><input name="vn" autocomplete="given-name" placeholder="Vorname" aria-label="Vorname" required>' +
      '<input name="nn" autocomplete="family-name" placeholder="Nachname" aria-label="Nachname" required></div>' +
      '<input name="ort" autocomplete="address-level2" placeholder="Wohnort" aria-label="Wohnort" required>' +
      '<input name="mail" type="email" autocomplete="email" inputmode="email" placeholder="E-Mail" aria-label="E-Mail" required>' +
      '<input name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="Handynummer" aria-label="Handynummer" required>' +
      '</div><button class="send" type="submit">Bewerbung abschicken</button>';
    deck.appendChild(c);
    var ins = Array.prototype.slice.call(c.querySelectorAll('input'));
    ins.forEach(function (i) { i.addEventListener('input', function () { i.classList.remove('err'); }); });
    c.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = ins.filter(function (i) { return !i.value.trim() || !i.checkValidity() || (i.name === 'tel' && !/^[0-9 +()\/-]{6,}$/.test(i.value.trim())); });
      ins.forEach(function (i) { i.classList.toggle('err', bad.indexOf(i) >= 0); });
      if (bad.length) { bad[0].focus(); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); return; }
      sent = { vn: c.elements.vn.value.trim(), tel: c.elements.tel.value.trim() };
      c.style.transform = 'translateY(-120%) rotate(-6deg)'; c.style.opacity = 0;
      setTimeout(renderCard, 320);
    });
  }
  function renderCard() {
    deck.innerHTML = '';
    barEl.style.setProperty('--pb', (Math.min(qi + (sent ? 1 : 0), STEPS) / STEPS * 100) + '%');
    if (qi >= Q.length && !sent) { renderForm(); return; }
    if (qi >= Q.length) {
      clearInterval(clockT);
      var s = (Date.now() - t0) / 1000, d = document.createElement('div');
      d.className = 'card done';
      d.innerHTML = '<div class="ok">✓</div><h4></h4><p></p>';
      d.querySelector('h4').textContent = 'Danke, ' + sent.vn + '! Fertig in ' + fmt(s) + '.';
      d.querySelector('p').textContent = 'Wir melden uns per ' + (answers[4] || 'WhatsApp') + ' unter ' + sent.tel + '. Demo: Es wird nichts gesendet oder gespeichert.';
      deck.appendChild(d);
      progEl.textContent = 'Geschafft'; return;
    }
    for (var k = Math.min(2, Q.length - qi); k >= 1; k--) {
      var b = document.createElement('div'); b.className = 'card back'; b.style.setProperty('--k', k);
      b.innerHTML = qi + k < Q.length ? cardHtml(Q[qi + k], qi + k) : FORM_HEAD; deck.appendChild(b);
    }
    var q = Q[qi], c = document.createElement('div'); c.className = 'card';
    c.innerHTML = cardHtml(q, qi);
    deck.appendChild(c); progEl.textContent = 'Schritt ' + (qi + 1) + ' von ' + STEPS;
    if (!hinted && S6.classList.contains('in')) { hinted = true; c.classList.add('nudge'); }
    $('.opts .l', c).addEventListener('click', function (e) { e.stopPropagation(); answer(false); });
    $('.opts .r', c).addEventListener('click', function (e) { e.stopPropagation(); answer(true); });
    var sx = null, dx = 0, sl = $('.stamp.l', c), sr = $('.stamp.r', c);
    c.addEventListener('pointerdown', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      sx = e.clientX; c.setPointerCapture(e.pointerId); c.style.transition = 'none'; c.classList.remove('nudge');
    });
    c.addEventListener('pointermove', function (e) {
      if (sx == null) return; dx = e.clientX - sx;
      c.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 16 + 'deg)';
      sr.style.opacity = clamp(dx / 90, 0, 1); sl.style.opacity = clamp(-dx / 90, 0, 1);
    });
    c.addEventListener('pointerup', function () {
      if (sx == null) return;
      c.style.transition = '';
      if (Math.abs(dx) > 70) answer(dx > 0); else { c.style.transform = ''; sr.style.opacity = sl.style.opacity = 0; }
      sx = null; dx = 0;
    });
  }
  function answer(right) {
    if (!t0) { t0 = Date.now(); clockT = setInterval(tickClock, 200); }
    if (qi >= Q.length) return;
    answers[qi] = Q[qi][right ? 2 : 1];
    var cs = $$('.card', deck), c = cs[cs.length - 1];
    if (c) { c.style.transform = 'translateX(' + (right ? 150 : -150) + '%) rotate(' + (right ? 22 : -22) + 'deg)'; c.style.opacity = 0; }
    $$('.card.back', deck).forEach(function (b) { b.style.setProperty('--k', +b.style.getPropertyValue('--k') - 1); });
    qi++; setTimeout(renderCard, 300);
  }
  $('.deck-nav .no', S6).addEventListener('click', function () { answer(false); });
  $('.deck-nav .yes', S6).addEventListener('click', function () { answer(true); });
  $$('.roles button', S6).forEach(function (b) { b.addEventListener('click', function () { $$('.roles button', S6).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
  renderCard();
  // Einstieg: Handy dreht sich rein, Pinselstriche wischen auf
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !S6.classList.contains('in')) {
          S6.classList.add('in');
          setTimeout(function () { var c = $$('.card', deck).pop(); if (c && !hinted && !t0) { hinted = true; c.classList.add('nudge'); } }, 900);
        }
      });
    }, { threshold: .3 }).observe($(".stage", S6));
  } else S6.classList.add('in');
  // Handy folgt leicht der Maus
  var ph = $('.phone', S6);
  S6.addEventListener('pointermove', function (e) {
    if (mobile()) return;
    var r = S6.getBoundingClientRect();
    ph.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 14);
    ph.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 10);
  });
  // Echte Rollstriche als Hintergrund (Bewerben, Finale)
  $$('[data-stroke]').forEach(function (el) {
    var n = 'stroke-' + el.getAttribute('data-stroke');
    if (IMG[n]) el.style.backgroundImage = 'url("' + absUrl(src(n, true)) + '")';
    else el.style.background = 'var(--teal)';
  });

  /* 7 Finale: Rolle malt die Wortmarke */
  var S7 = $('#termin'), paint = $('.paint', S7), roller7 = $('.roller', S7);
  function ch7(p) {
    var t = ease(seg(p, 0, .62)), end = (GEO.paintEnd || .9) * 100;
    paint.style.setProperty('--pv', (t * end).toFixed(2) + '%');
    paint.style.setProperty('--wv', (seg(t * end, 8, end) * 100).toFixed(2) + '%');
    roller7.style.left = (t * end).toFixed(2) + '%'; roller7.style.top = (GEO.paintY || 50) + '%';
    roller7.style.opacity = (1 - seg(p, .64, .72)).toFixed(3);
    S7.querySelector('.fin').style.setProperty('--fo', seg(p, .55, .72).toFixed(3));
  }

  /* ---------- Schleife ---------- */
  var tick = false;
  function frame() {
    tick = false;
    root.classList.toggle('scrolled', scrollY > 30);
    var P = chs.map(prog);
    ch1(P[0]); ch2(P[1]); ch3(P[2]); ch4(P[3]); ch5(P[4]); ch7(P[6]);
    var act = 0; chs.forEach(function (c, i) { if (c.getBoundingClientRect().top < innerHeight * .5) act = i; });
    dotEls.forEach(function (d, i) { d.classList.toggle('on', i === act); });
  }
  function req() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();
  // Video-Spulen glätten: weiter rechnen, solange sich etwas bewegt
  setInterval(req, 120);
})();
