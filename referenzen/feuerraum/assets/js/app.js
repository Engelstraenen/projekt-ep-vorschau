/* FEUERRAUM – Demo (PROJEKT EX). Vanilla-JS, Kapitel hängen an der Scroll-Position. */
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
  var IMG = window.FR_IMG || {}, VID = window.FR_VID || {};

  /* Bilder: data-img="name" → assets/img/name(-m).webp; fehlt es, Element ausblenden (nie Platzhalter) */
  function src(n, png) { return 'assets/img/' + n + (mobile() ? '-m' : '') + (png ? '.png' : '.webp') + '?v=' + (IMG._v || 1); }
  $$('[data-img]').forEach(function (el) {
    var n = el.getAttribute('data-img');
    if (IMG[n]) { el.src = src(n, el.hasAttribute('data-png')); el.loading = el.closest('.ch') ? 'eager' : 'lazy'; }
    else el.style.visibility = 'hidden';
  });
  $$('[data-need]').forEach(function (el) { if (!IMG[el.getAttribute('data-need')]) el.style.display = 'none'; });

  /* Persönlicher Link ?firma=Name */
  (function () {
    var f = null;
    try { f = new URLSearchParams(location.search).get('firma'); if (f) sessionStorage.setItem('fr-firma', f); else f = sessionStorage.getItem('fr-firma'); } catch (e) {}
    if (!f) return;
    $$('[data-firma]').forEach(function (el) { el.textContent = f; });
    root.classList.add('has-firma');
  })();

  /* Menü, Modals, Toast */
  var mb = $('.nav-menu');
  mb.addEventListener('click', function () { var o = root.classList.toggle('menu-open'); mb.setAttribute('aria-expanded', o); });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); mb.setAttribute('aria-expanded', 'false'); }); });
  var toastT;
  function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]'); if (!b) return;
    var m = $('#m-' + b.getAttribute('data-open')); if (m && m.showModal) { root.classList.remove('menu-open'); m.showModal(); }
  });
  $$('.modal form').forEach(function (f) {
    f.addEventListener('submit', function () { if (f.returnValue !== 'x' && f.closest('dialog').returnValue !== 'x') {} });
    f.closest('dialog').addEventListener('close', function () { if (this.returnValue === 'ok') toast('Demo: Anfrage wäre jetzt beim Ofenbauer.'); this.returnValue = ''; });
  });

  /* Kapitel-Punkte */
  var secs = $$('main > section'), dots = $('.dots');
  secs.forEach(function () { dots.appendChild(document.createElement('i')); });
  var dotEls = $$('i', dots);

  function prog(sec) {
    var r = sec.getBoundingClientRect(), h = sec.offsetHeight - innerHeight;
    return h > 0 ? clamp(-r.top / h, 0, 1) : clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
  }
  function show(el, o, dy) {
    if (!el) return;
    el.style.opacity = o.toFixed(3);
    el.style.transform = (el.classList.contains('b-hero') ? 'translateY(-40%) ' : '') + 'translateY(' + ((1 - o) * (dy == null ? 28 : dy)).toFixed(1) + 'px)';
  }
  function band(p, a, b, f) { f = f || .06; return Math.min(seg(p, a, a + f), 1 - seg(p, b - f, b)); }

  /* Film: Video spulen (All-Intra, volle Auflösung) oder Standbild mit langsamer Kamerafahrt */
  function Film(sec) {
    var box = $('.media', sec), v = $('.vid', box), stage = $('.stage', sec), ok = false, key = sec.id;
    if (v && VID[key]) {
      var s = document.createElement('source');
      s.src = v.getAttribute('data-src') + (mobile() ? (innerWidth / innerHeight <= .75 ? '-p' : '-m') : '') + '.mp4?v=' + (VID._v || 1); s.type = 'video/mp4'; v.appendChild(s);
      v.addEventListener('loadeddata', function () { ok = true; stage.classList.add('has-vid'); });
      v.load(); var pr = v.play && v.play(); if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
    }
    var cur = 0;
    return {
      set: function (p, z) {
        box.style.setProperty('--z', z == null ? 1 : z);
        if (ok && v.duration) { var want = (v.duration - .05) * p; cur += (want - cur) * .35; if (Math.abs(v.currentTime - cur) > .02) v.currentTime = cur; }
      },
      has: function () { return ok; }
    };
  }

  /* 1 Erste Flamme */
  var S1 = $('#flamme'), F1 = Film(S1), b1 = $$('.beat', S1), warm = $('.warm', S1), glow = $('.glow', S1);
  function ch1(p) {
    F1.set(seg(p, 0, .86), 1 + .1 * ease(seg(p, 0, .86)));
    show(b1[0], 1 - seg(p, .04, .12), 30);
    show(b1[1], band(p, .16, .48));
    show(b1[2], band(p, .54, .86));
    // ohne Video: Kalt-Bild blendet in Warm-Bild über (Licht-Variante, deckungsgleich)
    if (!F1.has() && warm) warm.style.opacity = ease(seg(p, .2, .6)).toFixed(3);
    glow.style.opacity = (seg(p, .88, 1) * .95).toFixed(3);
  }

  /* 2 Showroom-Fahrt */
  var S2 = $('#oefen'), F2 = Film(S2), track = $('.track', S2), cards = $$('.card', S2), rbar = $('.ride-bar', S2), rn = $('.ride-n', S2), head2 = $('.ride-head', S2);
  function ch2(p) {
    F2.set(p, 1.12 - .12 * p);
    var q = ease(seg(p, .08, .92)), max = Math.max(0, track.scrollWidth - innerWidth), n = cards.length, k, x;
    if (mobile()) {
      // Handy: je Karte eine Haltestrecke, Karte steht mittig und ganz im Bild
      var idx = seg(p, .06, .94) * (n - 1), f = Math.floor(idx), fr = idx - f, gap = cards[1].offsetLeft - cards[0].offsetLeft;
      fr = ease(seg(fr, .35, .65)); f = Math.min(f, n - 1);
      x = cards[0].offsetLeft + (f + fr) * gap - (innerWidth - cards[0].offsetWidth) / 2;
      k = clamp(Math.round(f + fr), 0, n - 1); q = (f + fr) / (n - 1);
    } else {
      x = q * max;
      var cw = cards[0].offsetWidth + 20, center = x + innerWidth * .35; k = clamp(Math.floor((center - 16) / cw), 0, n - 1);
    }
    track.style.transform = 'translateX(' + (-x).toFixed(1) + 'px)';
    cards.forEach(function (c, i) { c.classList.toggle('on', i === k); var r = c.getBoundingClientRect(); c.style.setProperty('--cv', r.right < 0 || r.left > innerWidth ? 'hidden' : 'visible'); c.classList.toggle('part', i !== k && (r.left < 0 || r.right > innerWidth)); });
    rn.textContent = '0' + (k + 1) + ' / 05';
    rbar.style.setProperty('--rp', q.toFixed(3));
    head2.style.opacity = (1 - seg(p, .9, 1) * .6).toFixed(3);
  }
  var INFO = [
    ['Holz · freistehend', 'Kaminofen', 'Der Klassiker: frei im Raum, schnell gesetzt, sichtbares Holzfeuer. Ideal, wenn ein Schornstein da ist.', ['Einbau meist an einem Tag', 'Große Sichtscheibe', 'Auch mit Wärmespeicher-Steinen']],
    ['Holz · eingebaut', 'Kamineinsatz', 'Fest in Wand oder Verkleidung eingebaut. Das Feuer wirkt wie ein Bild, die Verkleidung planen wir passend zum Raum.', ['Rahmenlos oder mit Rahmen', 'Ein-, zwei- oder dreiseitige Scheibe', 'Verkleidung aus Putz, Stein oder Stahl']],
    ['Pellet · automatisch', 'Pelletofen', 'Heizt nach Zeitplan und Wunschtemperatur. Pellets einfüllen, den Rest macht der Ofen.', ['Start per Zeitplan oder App', 'Gleichmäßige Wärme', 'Wenig Asche']],
    ['Holz · speichert', 'Kachelofen', 'Wird vom Ofenbauer Stein für Stein gesetzt und gibt die Wärme über Stunden ab. Gern mit warmer Bank.', ['Wärme noch Stunden nach dem Feuer', 'Kacheln in jeder Farbe', 'Individuell geplant']],
    ['Gas · per Knopfdruck', 'Gaskamin', 'Flamme per Fernbedienung, kein Holz, keine Asche. Passt auch in Wohnungen ohne klassischen Schornstein.', ['Sofort an, sofort aus', 'Kein Brennstoff-Lager', 'Abgas über Außenwand möglich']]
  ];
  var sheet = $('.sheet');
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      var d = INFO[+c.getAttribute('data-k')];
      $('.kicker', sheet).textContent = d[0]; $('h3', sheet).textContent = d[1]; $('.txt', sheet).textContent = d[2];
      $('.pts', sheet).innerHTML = d[3].map(function (x) { return '<li>' + x + '</li>'; }).join('');
      sheet.hidden = false; root.classList.add('sheet-open');
    });
  });
  $('.sheet-x').addEventListener('click', function (e) { e.stopPropagation(); sheet.hidden = true; root.classList.remove('sheet-open'); });

  /* 3 Rechner */
  var calc = $('#rechner'), tiles = $$('.tile', calc), rng = $('input[type=range]', calc), m2el = $('.m2', calc), kwN = $('.kw-n', calc), resLine = $('.res-line', calc), room = $('.plan .room', calc), heat = $('.plan .heat', calc);
  var shown = 0, kwAnim;
  function calcRun() {
    var t = $('.tile.on', calc), f = +t.getAttribute('data-f'), a = +rng.value, kw = Math.max(3, Math.round(a * f));
    m2el.textContent = a;
    rng.style.setProperty('--v', ((a - 15) / 105 * 100) + '%');
    room.style.setProperty('--s', (.55 + .45 * (a - 15) / 105).toFixed(3));
    heat.style.setProperty('--hs', (.6 + kw / 5).toFixed(2));
    resLine.textContent = 'passt zu ' + a + ' m² ' + ({ Altbau: 'im Altbau', Neubau: 'im Neubau', Wohnung: 'in der Wohnung' })[$('span', t).textContent];
    cancelAnimationFrame(kwAnim); var from = shown, t0 = performance.now();
    (function step(now) { var k = Math.min(1, (now - t0) / 600); shown = Math.round(from + (kw - from) * eout(k)); kwN.textContent = shown; if (k < 1) kwAnim = requestAnimationFrame(step); })(t0);
  }
  tiles.forEach(function (t) { t.addEventListener('click', function () { tiles.forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-checked', x === t); }); calcRun(); }); });
  rng.addEventListener('input', calcRun);
  var FUEL = {
    holz: [[95, 20, 40, 70], 'Holz: echtes Knistern, das schönste Flammenbild. Dafür Holz lagern und nachlegen.'],
    pellet: [[60, 95, 75, 45], 'Pellet: startet nach Zeitplan und hält die Temperatur. Pellets kommen als Sackware oder lose.'],
    gas: [[50, 85, 95, 5], 'Gas: Flamme per Knopfdruck, kein Lager, keine Asche. Braucht einen Gasanschluss.']
  };
  var fb = $$('.fuel button', calc), bars = $$('.bar b', calc), ft = $('.fuel-txt', calc);
  function fuel(k) {
    fb.forEach(function (b) { var on = b.getAttribute('data-k') === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    FUEL[k][0].forEach(function (w, i) { bars[i].style.setProperty('--w', (i === 3 ? 100 - w : w) + '%'); });
    ft.textContent = FUEL[k][1];
  }
  // Lagerplatz-Balken: viel Balken = wenig Platz nötig
  $$('.bar span', calc)[3].textContent = 'Wenig Lagerplatz nötig';
  fb.forEach(function (b) { b.addEventListener('click', function () { fuel(b.getAttribute('data-k')); }); });
  var calcSeen = false;
  function calcIn() { if (!calcSeen && calc.getBoundingClientRect().top < innerHeight * .7) { calcSeen = true; calcRun(); fuel('holz'); } }

  /* 4 Passt er rein? Ofen ziehen, Größe ändern, eigenes Foto (bleibt lokal) */
  (function () {
    var scr = $('.passt .screen'); if (!scr) return;
    var st = $('.stove-x', scr), sz = $('.passt .sz'), x = 50, y = 44, drag = null;
    function place() { st.style.left = x + '%'; st.style.top = y + '%'; st.style.setProperty('--sz', sz.value / 100); }
    st.addEventListener('pointerdown', function (e) { drag = { px: e.clientX, py: e.clientY, x: x, y: y }; st.setPointerCapture(e.pointerId); st.classList.add('drag'); $('.hud', scr).style.opacity = 0; });
    st.addEventListener('pointermove', function (e) {
      if (!drag) return; var r = scr.getBoundingClientRect();
      x = clamp(drag.x + (e.clientX - drag.px) / r.width * 100, 10, 90); y = clamp(drag.y + (e.clientY - drag.py) / r.height * 100, 5, 80); place();
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { st.addEventListener(t, function () { drag = null; st.classList.remove('drag'); }); });
    sz.addEventListener('input', place);
    $('.passt input[type=file]').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      var u = URL.createObjectURL(f); $('.room-img', scr).src = u; $('.room-img', scr).style.visibility = 'visible'; toast('Dein Foto ist drin. Jetzt den Ofen platzieren.');
    });
    place();
  })();

  /* 5 Ofen-Check */
  var S5 = $('#service'), m5 = $('.media', S5), li5 = $$('.svc-list li', S5);
  function ch5(p) {
    m5.style.setProperty('--z', (1.12 - .12 * ease(p)).toFixed(3));
    li5.forEach(function (l, i) { var o = eout(seg(p, .15 + i * .15, .32 + i * .15)); l.style.opacity = o; l.style.transform = 'translateX(' + ((1 - o) * -30) + 'px)'; });
  }

  /* 6 Planen: Monatsbalken wachsen, Herbst läuft voll */
  var S6 = $('#planen'), m6 = $('.media', S6), mos = $$('.mo', S6);
  function ch6(p) {
    m6.style.setProperty('--z', (1 + .08 * p).toFixed(3));
    mos.forEach(function (m, i) { var w = +m.getAttribute('data-w'), o = eout(seg(p, .1 + i * .08, .3 + i * .08)); m.querySelector('b').style.setProperty('--h0', (o * w / 12 * 100).toFixed(1)); });
  }

  /* 7 Karriere: Kinetik-Typo Wort für Wort */
  var S7 = $('#karriere'), F7 = Film(S7), kins = $$('.kin', S7), t7 = $('.tag', S7);
  var KW = [[.04, .26], [.30, .44], [.48, .62], [.66, .80], [.84, .98]];
  function ch7(p) {
    F7.set(p, 1 + .08 * p);
    kins.forEach(function (k, i) {
      var a = KW[i][0], b = KW[i][1], sp = $$('span', k), n = sp.length;
      sp.forEach(function (s, j) {
        var inn = eout(seg(p, a + j * .025, a + j * .025 + .05)), out = seg(p, b - .04, b);
        s.style.opacity = (inn * (1 - out)).toFixed(3);
        s.style.transform = 'translateY(' + ((1 - inn) * 60 - out * 40).toFixed(1) + 'px)';
      });
    });
    t7.classList.toggle('on', p > .05 && p < .95);
  }

  /* 8 Bewerbung in 60 Sekunden */
  (function () {
    var qs = $$('.quiz .q'), sec = $('.clock .sec'), clk = $('.clock'), t = 60, timer = null, i = 0;
    function go(n) { qs.forEach(function (q, k) { q.classList.toggle('on', k === n); }); i = n; }
    function tick() { t = Math.max(0, t - 1); sec.textContent = t; clk.style.setProperty('--t', t / 60); if (!t) clearInterval(timer); }
    function start() { if (!timer) timer = setInterval(tick, 1000); }
    $$('.quiz .opts button').forEach(function (b) { b.addEventListener('click', function () { start(); go(i + 1); }); });
    $('.quiz form').addEventListener('submit', function (e) { e.preventDefault(); clearInterval(timer); go(4); toast('Demo: Bewerbung wäre jetzt beim Meister (' + (60 - t) + ' Sekunden).'); });
    $('.quiz .again').addEventListener('click', function () { $('.quiz form').reset(); t = 60; sec.textContent = 60; clk.style.setProperty('--t', 1); timer = null; go(0); });
  })();

  /* 9 Bewertungen: Beispielkarten nacheinander */
  (function () { var rv = $$('.rv'), k = 0; setInterval(function () { rv[k].classList.remove('on'); k = (k + 1) % rv.length; rv[k].classList.add('on'); }, 5200); })();

  /* 10 Ausstellung: Kalender */
  (function () {
    var cal = $('.cal'), mEl = $('.cal-m', cal), grid = $('.cal-grid', cal), go = $('.cal-go', cal), slot = null, day = null;
    var now = new Date(), view = new Date(now.getFullYear(), now.getMonth(), 1);
    var MN = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    function upd() { go.disabled = !(slot && day); }
    function draw() {
      mEl.textContent = MN[view.getMonth()] + ' ' + view.getFullYear();
      var h = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(function (d) { return '<b>' + d + '</b>'; }).join('');
      var off = (view.getDay() + 6) % 7, dim = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var k = 0; k < off; k++) h += '<span></span>';
      for (var d = 1; d <= dim; d++) {
        var dt = new Date(view.getFullYear(), view.getMonth(), d), past = dt < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), sun = dt.getDay() === 0;
        h += '<button ' + (past || sun ? 'disabled' : '') + ' data-d="' + d + '">' + d + '</button>';
      }
      grid.innerHTML = h; day = null; upd();
    }
    grid.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; $$('button', grid).forEach(function (x) { x.classList.toggle('on', x === b); }); day = b.getAttribute('data-d'); upd(); });
    $$('.slots button', cal).forEach(function (b) { b.addEventListener('click', function () { $$('.slots button', cal).forEach(function (x) { x.classList.toggle('on', x === b); }); slot = b.textContent; upd(); }); });
    $('.cal-prev', cal).addEventListener('click', function () { if (view > new Date(now.getFullYear(), now.getMonth(), 1)) { view.setMonth(view.getMonth() - 1); draw(); } });
    $('.cal-next', cal).addEventListener('click', function () { view.setMonth(view.getMonth() + 1); draw(); });
    go.addEventListener('click', function () { toast('Demo: Termin am ' + day + '. ' + MN[view.getMonth()] + ' um ' + slot + ' Uhr wäre gebucht.'); });
    draw();
  })();
  var vimg = $('.visit-img img');

  /* Scroll-Schleife */
  var ticking = false;
  function frame() {
    ticking = false;
    ch1(prog(S1)); ch2(prog(S2)); ch5(prog(S5)); ch6(prog(S6)); ch7(prog(S7)); calcIn();
    if (vimg) vimg.style.setProperty('--vz', (1.12 - .12 * prog(vimg.parentNode)).toFixed(3));
    var mid = innerHeight / 2, act = 0;
    secs.forEach(function (s, i) { if (s.getBoundingClientRect().top < mid) act = i; });
    dotEls.forEach(function (d, i) { d.classList.toggle('on', i === act); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();
})();
