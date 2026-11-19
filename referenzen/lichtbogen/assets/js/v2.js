/* Testversion 2 · Sicherungskasten: Hauptschalter, Sicherungen, Kabel stecken */
(function () {
  'use strict';
  var FX = window.FX, S = window.LB_SERVICES || [], VIZ = window.LB_VIZ || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var cab = $('#cab'), main = $('#main'), lcd = $('#lcd'), hint = $('#hint'), drawer = $('#drawer');
  var brks = $$('.brk'), leds = $$('#leds i'), volt = $('#g-volt'), load = $('#g-load');
  var typeT;
  function type(text) {
    clearInterval(typeT);
    var i = 0; lcd.textContent = '';
    typeT = setInterval(function () { lcd.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(typeT); }, 22);
  }
  function sparkAt(el, n) {
    var r = el.getBoundingClientRect();
    FX.spark(r.left + r.width / 2, r.top + r.height * 0.4, n || 16, '#ffd166');
  }
  function count() { return brks.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length; }
  function gauge() { load.style.transform = 'rotate(' + (-80 + count() / brks.length * 150) + 'deg)'; }

  function boot(quiet) {
    main.setAttribute('aria-pressed', 'true');
    cab.classList.add('live');
    volt.style.transform = 'rotate(38deg)';
    leds.forEach(function (l, i) { setTimeout(function () { l.classList.add('on'); }, quiet ? 0 : 250 + i * 140); });
    brks.forEach(function (b) { b.disabled = false; });
    type('230 V · ANLAGE BEREIT · 6 STROMKREISE');
    hint.textContent = 'Läuft. Jetzt die Sicherungen: Jede schaltet eine Leistung frei.';
    if (!quiet) { sparkAt(main, 30); var r = main.getBoundingClientRect(); FX.bolt(r.left + r.width / 2, r.top, r.left + r.width / 2 + (Math.random() - .5) * 200, Math.max(0, r.top - 260), { life: 350 }); }
    try { sessionStorage.setItem('lb2-on', '1'); } catch (e) {}
  }
  function shutdown() {
    main.setAttribute('aria-pressed', 'false');
    cab.classList.remove('live');
    volt.style.transform = ''; load.style.transform = '';
    leds.forEach(function (l) { l.classList.remove('on'); });
    brks.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.disabled = true; });
    drawer.hidden = true;
    clearInterval(typeT); lcd.textContent = 'ANLAGE AUS';
    hint.textContent = 'Alles aus. Leg den Hauptschalter wieder um.';
    try { sessionStorage.removeItem('lb2-on'); } catch (e) {}
  }
  main.addEventListener('click', function () { main.getAttribute('aria-pressed') === 'true' ? shutdown() : boot(); });

  function show(i) {
    var s = S[i]; if (!s) return;
    $('#d-eye').textContent = 'F' + (i + 1) + ' · ' + s.name;
    $('#d-h').textContent = s.head;
    $('#d-t').textContent = s.text;
    var ul = $('#d-l'); ul.textContent = '';
    s.pts.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ul.appendChild(li); });
    var a = $('#d-a');
    if (s.link) { a.href = s.link; a.textContent = s.cta; a.removeAttribute('data-demo'); }
    else { a.href = '#'; a.textContent = 'Notdienst anrufen'; a.setAttribute('data-demo', 'Demo: Hier wählt das Handy direkt den Notdienst.'); }
    $('#d-v').innerHTML = VIZ[s.key] || '';
    drawer.hidden = false;
    drawer.classList.remove('pop'); void drawer.offsetWidth; drawer.classList.add('pop');
  }
  brks.forEach(function (b) {
    b.addEventListener('click', function () {
      var i = +b.getAttribute('data-i'), on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      gauge();
      if (on) {
        sparkAt(b);
        show(i);
        if (count() === brks.length) {
          type('VOLLLAST · ALLE 6 STROMKREISE LAUFEN');
          var r = cab.getBoundingClientRect();
          for (var k = 0; k < 4; k++) FX.bolt(r.left + Math.random() * r.width, Math.max(0, r.top), r.left + Math.random() * r.width, Math.min(innerHeight, r.top + 500), { life: 420 });
        } else type('F' + (i + 1) + ' ' + S[i].name.toUpperCase() + ' · EIN');
      } else {
        type('F' + (i + 1) + ' ' + S[i].name.toUpperCase() + ' · AUS');
        var onB = brks.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; });
        if (onB.length) show(+onB[onB.length - 1].getAttribute('data-i')); else drawer.hidden = true;
      }
    });
  });
  try { if (sessionStorage.getItem('lb2-on')) boot(true); } catch (e) {}

  /* ---------- Kabel stecken ---------- */
  var svg = $('#patch');
  if (svg) {
    var cable = $('#cable'), plug = $('#plug'), dots = $('#dots'), res = $('#patch-res'), target = $('#target');
    var A = { x: 70, y: 130 }, B = { x: 530, y: 130 }, P = { x: 170, y: 196 }, drag = false, ok = false, raf = 0;
    var draw = function () {
      var dx = (P.x - A.x) * 0.35, sag = 70 + Math.abs(P.x - A.x) * 0.08;
      cable.setAttribute('d', 'M' + A.x + ' ' + A.y + 'C' + (A.x + dx) + ' ' + (A.y + sag) + ',' + (P.x - dx) + ' ' + (P.y + sag) + ',' + P.x + ' ' + P.y);
      plug.setAttribute('transform', 'translate(' + P.x + ',' + P.y + ')');
    };
    var pt = function (e) {
      var r = svg.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * 600, y: (e.clientY - r.top) / r.height * 260 };
    };
    var flow = function () {
      var len = cable.getTotalLength(), cs = [];
      dots.textContent = '';
      for (var i = 0; i < 5; i++) { var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', 4); dots.appendChild(c); cs.push(c); }
      cancelAnimationFrame(raf);
      (function step(t) {
        if (!ok) return;
        cs.forEach(function (c, i) { var p = cable.getPointAtLength(((t / 1400 + i / 5) % 1) * len); c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); });
        raf = requestAnimationFrame(step);
      })(performance.now());
    };
    var connect = function () {
      ok = true; P = { x: B.x, y: B.y }; draw();
      svg.classList.add('ok'); res.hidden = false;
      var r = target.getBoundingClientRect();
      FX.spark(r.left + r.width / 2, r.top + r.height * 0.35, 30, '#7ff0a8');
      if (!FX.reduce) flow();
    };
    var glide = function () {            /* Tipp auf die Dose: Stecker fährt selbst rüber */
      var from = { x: P.x, y: P.y }, t0 = performance.now();
      (function g(t) {
        var k = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - k, 3);
        P = { x: from.x + (B.x - from.x) * e, y: from.y + (B.y - from.y) * e }; draw();
        if (k < 1) requestAnimationFrame(g); else connect();
      })(t0);
    };
    plug.addEventListener('pointerdown', function (e) {
      if (ok) { ok = false; svg.classList.remove('ok'); dots.textContent = ''; res.hidden = true; }
      drag = true; try { plug.setPointerCapture(e.pointerId); } catch (x) {}
    });
    plug.addEventListener('pointermove', function (e) { if (drag) { P = pt(e); P.x = Math.max(110, Math.min(560, P.x)); P.y = Math.max(30, Math.min(230, P.y)); draw(); } });
    var end = function () {
      if (!drag) return; drag = false;
      if (Math.hypot(P.x - B.x, P.y - B.y) < 56) connect(); else { P = { x: 170, y: 196 }; draw(); }
    };
    plug.addEventListener('pointerup', end); plug.addEventListener('pointercancel', end);
    target.addEventListener('click', function () { if (!ok) glide(); });
    target.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !ok) { e.preventDefault(); glide(); } });
    draw();
  }
})();
