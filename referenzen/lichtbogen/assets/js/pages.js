/* LICHTBOGEN · Rechner, Foto-Check, Jobs. Nichts wird gesendet. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var toast = function (m) { if (window.LB) window.LB.toast(m); };
  var nf = function (n, d) { return n.toLocaleString('de-DE', { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); };
  var val = function (id) { return parseFloat($('#' + id).value); };
  var radio = function (name) { var r = $('input[name="' + name + '"]:checked'); return r ? r.value : null; };
  var txt = function (id, t) { $('#' + id).textContent = t; };
  var bar = function (id, p) { $('#' + id).style.transform = 'scaleX(' + Math.max(0, Math.min(1, p)).toFixed(3) + ')'; };

  /* ================= Rechner ================= */
  if ($('#p-wb')) {
    var tabs = $$('[role="tab"]');
    var show = function (id) {
      tabs.forEach(function (t) {
        var on = t.id === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        $('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.id); }); });
    if (location.hash === '#pv') show('t-pv');

    var outs = function () {
      $$('input[type=range]').forEach(function (r) {
        $('#' + r.id + '-o').textContent = nf(parseFloat(r.value)) + r.getAttribute('data-unit');
      });
    };
    var hm = function (h) {
      var m = Math.round(h * 60), H = Math.floor(m / 60), M = m % 60;
      return H ? H + ' h' + (M ? ' ' + M + ' min' : '') : M + ' min';
    };
    /* ---------- Szenen zum Rechner: jede Zahl bewegt etwas im Bild ---------- */
    /* Lage im Bild (Raster 1600 x 900): Ladekabel, Dachfläche, Hauskörper, Energiewege */
    var GEO = {
      cable: 'M517 516 C 514 610, 520 700, 560 765 S 660 818, 715 795 S 742 738, 800 725 S 896 706, 913 625 S 925 566, 937 549',
      roof: [[24.3, 17.9], [62.8, 30.0], [76.8, 51.3], [35.0, 43.9]],          /* links oben, rechts oben, rechts unten, links unten, in Prozent */
      body: [[16.9, 52.6], [24.3, 17.9], [35.0, 43.9], [76.8, 51.3], [77.2, 60.5], [94.0, 61.4], [94.0, 80.6], [36.9, 86.2], [18.4, 81.7]],
      f1: 'M880 440 L880 548', f2: 'M880 548 L1180 548 L1180 640', f3: 'M1180 640 L1180 705 L1370 705',
      bat: [68.5, 64], car: [79, 79]
    };
    if (window.LB_GEO) for (var gk in window.LB_GEO) GEO[gk] = window.LB_GEO[gk];
    var sv = function (id, k, v) { var e = $('#' + id); if (e) e.style.setProperty(k, v); };
    var setD = function (ids, d) { ids.forEach(function (id) { var e = $('#' + id); if (e) e.setAttribute('d', d); }); };
    setD(['wb-c1', 'wb-c2', 'wb-c3'], GEO.cable); setD(['pv-f1'], GEO.f1); setD(['pv-f2'], GEO.f2); setD(['pv-f3'], GEO.f3);
    var poly = function (pts) { return 'polygon(' + pts.map(function (q) { return q[0].toFixed(2) + '% ' + q[1].toFixed(2) + '%'; }).join(',') + ')'; };
    var place = function (id, q) { var e = $('#' + id); if (e) { e.style.left = q[0] + '%'; e.style.top = q[1] + '%'; } };
    place('pv-chip-bat', GEO.bat); place('pv-chip-car', GEO.car);
    /* ---------- Miniaturwelt: ein Tag in vier Abschnitten, alle Werte kommen von den Reglern ---------- */
    /* Wege vom Carport zum Ziel, je Welt (Raster 1600 x 900) */
    var WELT = window.LB_WELT || [
      { path: 'M655 505 C 640 560, 680 598, 760 614 S 940 636, 1040 592 S 1212 560, 1236 512 S 1218 468, 1186 456', name: 'zum Bäcker und zurück' },
      { path: 'M610 545 C 560 580, 580 612, 680 622 S 900 650, 1010 612 S 1100 545, 1070 500 S 960 455, 880 435 S 700 420, 692 385 S 760 335, 860 332 S 1080 385, 1180 400 S 1290 420, 1330 422', name: 'durch den Ort ins Büro und zurück' },
      { path: 'M560 548 C 470 560, 380 580, 400 610 S 500 648, 580 636 S 760 580, 860 510 S 1080 410, 1200 360 S 1380 310, 1392 282 S 1340 250, 1280 246', name: 'über die Brücke in die Stadt und zurück' }
    ];
    var mw = { o: null, t0: 0, world: -1, len: 1, run: false, cells: 0 }, mwEl = $('#viz-wb');
    var carEl = $('#mw-car'), trailEl = $('#mw-trail'), s1 = $('#mw-s1'), s2 = $('#mw-s2'), pubEl = $('#mw-pub'), nightEl = $('#mw-night'), dawnEl = $('#mw-dawn'), stepsEl = mwEl ? mwEl.querySelectorAll('.mw-steps i') : [];
    var mwReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cl01 = function (x) { return Math.max(0, Math.min(1, x)); }, ez = function (x) { x = cl01(x); return x * x * (3 - 2 * x); };
    var clock = function (h) { var H = Math.floor(h) % 24, M = Math.floor((h - Math.floor(h)) * 60); return H + ':' + ('0' + M).slice(-2); };
    function mwCells(full, home, pub) {           /* full grün, danach orange (zuhause geladen), blau (unterwegs geladen), Rest leer */
      var box = $('#wp-cells'); if (!box) return;
      if (box.children.length !== mw.cells) { var h = ''; for (var c = 0; c < mw.cells; c++) h += '<i></i>'; box.innerHTML = h; box.style.width = (mw.cells * 2.6 + 1) + 'cqw'; }
      for (var i = 0; i < mw.cells; i++) { var e = box.children[i]; e.className = i < full ? '' : i < full + home ? 'h' : i < full + home + pub ? 'u' : 'e'; }
    }
    function mwPlan() {                            /* aus den Reglern: Strecke, Zellen, Zeiten */
      var o = mw.o, dayKm = o.km / 365, dayKwh = dayKm * o.v / 100, w = dayKm < 26 ? 0 : dayKm < 62 ? 1 : 2;
      mw.dayKm = dayKm; mw.dayKwh = dayKwh;
      mw.cells = Math.round(o.akku / 10);
      mw.use = Math.max(1, Math.min(mw.cells, Math.round(mw.cells * dayKwh / o.akku)));
      mw.pub = Math.round(mw.use * (1 - o.home)); mw.homeC = mw.use - mw.pub;
      mw.hrs = dayKwh * o.home * 1.1 / o.kw; mw.ok = mw.hrs <= 8;
      mw.dOut = 1500 + w * 700; mw.dStop = mw.pub > 0 ? 900 : 350; mw.dPlug = 700; mw.dNight = 2200 + 3600 * cl01(mw.hrs / 8); mw.dDawn = 2000;
      mw.total = mw.dOut * 2 + mw.dStop + mw.dPlug + mw.dNight + mw.dDawn;
      if (w !== mw.world) {
        mw.world = w;
        [].forEach.call(mwEl.querySelectorAll('.mw-img'), function (im, i) { im.classList.toggle('on', i === w); });
        [trailEl, s1, s2].forEach(function (e) { e.setAttribute('d', WELT[w].path); });
        mw.len = trailEl.getTotalLength();
        var end = trailEl.getPointAtLength(mw.len); pubEl.setAttribute('cx', end.x); pubEl.setAttribute('cy', end.y - 34);
      }
      var hot = (o.v - 13) / 13, k = o.kw < 5 ? 0 : o.kw < 20 ? 1 : 2;
      sv('viz-wb', '--tk', (4 + hot * 9).toFixed(1)); sv('viz-wb', '--tc', 'hsl(' + Math.round(140 - hot * 130) + ' 85% 58%)');
      sv('viz-wb', '--sw', [5, 9, 15][k]); sv('viz-wb', '--sp', [1.5, 0.8, 0.4][k] + 's');
      txt('mw-bat-t', nf(o.akku) + ' kWh'); txt('mw-bat-s', mw.cells + ' Zellen · ' + Math.round(dayKwh / o.akku * 100) + ' % pro Tag');
    }
    function mwCar(d, back) {
      var q = trailEl.getPointAtLength(d), q2 = trailEl.getPointAtLength(Math.min(mw.len, d + 2)), q0 = trailEl.getPointAtLength(Math.max(0, d - 2));
      var ang = Math.atan2(q2.y - q0.y, q2.x - q0.x) * 180 / Math.PI + (back ? 180 : 0);
      carEl.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(1.55)');
      trailEl.style.strokeDasharray = d.toFixed(1) + ' ' + (mw.len + 10);
    }
    function mwStep(i, f) { for (var n = 0; n < stepsEl.length; n++) stepsEl[n].style.setProperty('--f', n < i ? 1 : n === i ? f.toFixed(3) : 0); }
    function mwFrame(now) {
      if (!mw.run) return;
      var t = (now - mw.t0) % mw.total, o = mw.o, cap = $('.mw-cap', mwEl), W = WELT[mw.world];
      var a1 = mw.dOut, a2 = a1 + mw.dStop, a3 = a2 + mw.dOut, a4 = a3 + mw.dPlug, a5 = a4 + mw.dNight;
      var night = 0, dawn = 0, so = 0, pub = 0, beam = 1;
      if (t < a3) {                                 /* 1 Fahrt hin, kurzer Halt, Fahrt zurück */
        var out = t < a1, stop = !out && t < a2, f = out ? ez(t / a1) : stop ? 1 : 1 - ez((t - a2) / mw.dOut);
        mwCar(f * mw.len, !out && !stop);
        var used = Math.round(mw.use * (out ? ez(t / a1) * 0.5 : stop ? 0.5 : 0.5 + 0.5 * ez((t - a2) / mw.dOut)));
        var pubNow = out ? 0 : stop ? Math.round(mw.pub * cl01((t - a1) / mw.dStop)) : mw.pub; pub = stop && mw.pub ? 1 : 0;
        mwCells(mw.cells - used, 0, Math.min(pubNow, used));
        txt('mw-time', clock(7.5 + (t / a3) * 10)); txt('mw-phase', stop ? (mw.pub ? 'lädt unterwegs' : 'am Ziel') : 'unterwegs');
        txt('mw-cap-t', nf(mw.dayKm) + ' km am Tag'); txt('mw-cap-s', W.name + ' · ' + nf(mw.dayKwh, 1) + ' kWh bei ' + nf(o.v) + ' kWh auf 100 km');
        cap.classList.remove('bad'); mwStep(0, t / a3);
      } else if (t < a4) {                          /* 2 einstecken */
        mwCar(0, true); beam = 0; mwCells(mw.cells - mw.use, 0, mw.pub);
        txt('mw-time', '22:00'); txt('mw-phase', 'eingesteckt');
        txt('mw-cap-t', nf(o.kw, o.kw < 5 ? 1 : 0) + ' kW Wallbox'); txt('mw-cap-s', 'lädt ' + nf(o.kw / o.v * 100) + ' km Reichweite je Stunde');
        night = ez((t - a3) / mw.dPlug); mwStep(1, (t - a3) / mw.dPlug);
      } else if (t < a5) {                          /* 3 Nacht: Strom fließt, Zellen füllen sich, der Mond wandert */
        var n = (t - a4) / mw.dNight, hNow = Math.min(mw.hrs, 8) * n;
        mwCar(0, true); beam = 0; night = 1; so = 1;
        var got = mw.ok ? Math.round(mw.homeC * n) : Math.round(mw.homeC * n * 8 / mw.hrs);
        mwCells(mw.cells - mw.use, got, mw.pub);
        sv('mw-moon', '--mx', (8 + 84 * hNow / 8).toFixed(1) + '%'); sv('mw-moon', '--my', (26 - 16 * Math.sin(Math.PI * hNow / 8)).toFixed(1) + '%');
        txt('mw-time', clock(22 + hNow)); txt('mw-phase', 'lädt zuhause');
        txt('mw-cap-t', mw.ok ? 'fertig um ' + clock(22 + mw.hrs) + ' Uhr' : 'reicht nicht über Nacht');
        txt('mw-cap-s', mw.ok ? 'die Tagesstrecke ist in ' + hm(mw.hrs) + ' nachgeladen' : 'die Tagesstrecke bräuchte ' + hm(mw.hrs) + ' Ladezeit');
        cap.classList.toggle('bad', !mw.ok); mwStep(2, n);
      } else {                                      /* 4 Morgen */
        var m = (t - a5) / mw.dDawn; mwCar(0, false); night = 1 - ez(m * 2); dawn = Math.sin(Math.PI * cl01(m)) ; beam = ez(m * 3);
        var gotEnd = mw.ok ? mw.homeC : Math.round(mw.homeC * 8 / mw.hrs);
        mwCells(mw.cells - mw.use + (m > 0.25 ? gotEnd : 0), m > 0.25 ? 0 : gotEnd, mw.pub);
        txt('mw-time', '6:00'); txt('mw-phase', mw.ok ? 'voll, los geht es' : 'nicht ganz voll');
        mwStep(3, m);
      }
      nightEl.style.opacity = night.toFixed(2); dawnEl.style.opacity = dawn.toFixed(2);
      sv('viz-wb', '--so', so); sv('viz-wb', '--beam', beam); sv('viz-wb', '--led', so ? '#58c8ff' : '#ffb347');
      pubEl.setAttribute('r', pub ? (10 + 8 * Math.sin(now / 120)).toFixed(1) : 0); pubEl.style.opacity = pub ? 0.9 : 0;
      requestAnimationFrame(mwFrame);
    }
    var lastWb = null;
    var vizWb = function (o) {
      if (!mwEl || !carEl) return;
      mw.o = o; mwPlan();
      var now = performance.now();
      /* an die Stelle springen, an der man die Änderung sieht: Strecke und Verbrauch zur Fahrt, alles andere zur Nacht */
      if (!lastWb || lastWb.km !== o.km || lastWb.v !== o.v) mw.t0 = now;
      else if (lastWb.akku !== o.akku || lastWb.home !== o.home || lastWb.kw !== o.kw) mw.t0 = now - (mw.dOut * 2 + mw.dStop + mw.dPlug * 0.6);
      lastWb = { km: o.km, v: o.v, akku: o.akku, home: o.home, kw: o.kw };
      if (mwReduce) { mw.run = true; mw.t0 = now - (mw.total - mw.dDawn * 0.5); mwFrame(now); mw.run = false; return; }
      if (!mw.run) { mw.run = true; requestAnimationFrame(mwFrame); }
    };
    var vizPv = function (area, f, self, aut, bat, car, kwp) {
      var t = Math.max(0.1, Math.min(1, (area - 10) / 110)), R = GEO.roof;
      var top = [R[0][0] + (R[1][0] - R[0][0]) * t, R[0][1] + (R[1][1] - R[0][1]) * t], bot = [R[3][0] + (R[2][0] - R[3][0]) * t, R[3][1] + (R[2][1] - R[3][1]) * t];
      var roof = $('#pv-roof'); if (roof) { roof.style.clipPath = poly([R[0], top, bot, R[3]]); roof.style.opacity = 1; }
      var lit = $('#pv-lit'); if (lit) { lit.style.clipPath = poly(GEO.body); lit.style.opacity = Math.min(1, 0.15 + aut * 1.05).toFixed(2); }
      sv('pv-sun', '--sx', f > 0.9 ? '50%' : f > 0.7 ? '80%' : '12%'); sv('pv-sun', '--so', f > 0.9 ? 0.75 : f > 0.7 ? 0.5 : 0.16);
      var str = Math.min(1, kwp * f / 14), fs = (1.7 - 1.2 * str).toFixed(2) + 's';
      sv('pv-f1', '--fo', (0.35 + 0.65 * str).toFixed(2)); sv('pv-f1', '--fs', fs);
      sv('pv-f2', '--fo', bat > 0 ? (0.35 + 0.65 * str).toFixed(2) : 0); sv('pv-f2', '--fs', fs);
      sv('pv-f3', '--fo', car ? (0.35 + 0.65 * str).toFixed(2) : 0); sv('pv-f3', '--fs', fs);
      var cb = $('#pv-chip-bat'); if (cb) { cb.classList.toggle('on', bat > 0); cb.querySelector('b').textContent = 'Speicher ' + nf(bat) + ' kWh'; cb.querySelector('i').style.setProperty('--bf', Math.round(40 + 55 * str) + '%'); }
      var cc = $('#pv-chip-car'); if (cc) cc.classList.toggle('on', car);
      txt('pv-hud-kwp', nf(kwp, 1) + ' kWp'); txt('pv-hud-mod', 'ca. ' + Math.round(kwp / 0.43) + ' Module');
      sv('pv-ring', '--rv', Math.round(aut * 100)); txt('pv-hud-aut', Math.round(aut * 100 / 5) * 5 + ' %');
    };
    var wallbox = function () {
      var km = val('wb-km'), v = val('wb-v'), akku = val('wb-akku'), home = val('wb-home') / 100, kw = parseFloat(radio('wb-kw'));
      var loss = 1.1;
      var year = km * v / 100 * home * loss;
      txt('wb-time', hm(0.6 * akku * loss / kw));
      txt('wb-kmh', 'ca. ' + nf(kw / v * 100) + ' km');
      txt('wb-year', 'ca. ' + nf(Math.round(year / 50) * 50) + ' kWh');
      txt('wb-week', 'ca. ' + nf(year / 52 / kw, 1) + ' h');
      var night = Math.min(1, kw * 8 / loss / akku);
      txt('wb-night', night >= 1 ? 'Ja, komplett' : 'ca. ' + nf(night * 100) + ' % vom Akku');
      bar('wb-bar', night);
      var t;
      if (kw < 5) t = 'Mit 3,7 kW lädst du langsam, aber über Nacht kommt bei den meisten Pendelstrecken genug zusammen. Gut, wenn das Auto lange steht.';
      else if (kw < 20) t = '11 kW passt für die meisten Haushalte: über Nacht ist der Akku voll, und der Hausanschluss kommt in der Regel gut damit klar.';
      else t = '22 kW lädt schnell, aber nur, wenn Auto und Hausanschluss das mitmachen. Das klären wir mit einem Blick in deinen Zählerschrank.';
      txt('wb-verdict', t);
      vizWb({ km: km, v: v, akku: akku, home: home, kw: kw });
    };
    var pv = function () {
      var area = val('pv-area'), f = parseFloat(radio('pv-dir')), use = val('pv-use'), bat = parseFloat(radio('pv-bat')), car = radio('pv-car') === '1';
      if (car) use += 2500;
      var kwp = area / 5.5;
      var lo = kwp * 800 * f, hi = kwp * 950 * f, mid = (lo + hi) / 2;
      var r = mid / use;
      var s0 = Math.min(0.95, 0.32 / Math.pow(r, 0.75));
      var direct = mid * s0;
      var extra = Math.max(0, Math.min(bat * 250, (mid - direct) * 0.8, use * 0.92 - direct));
      var selfKwh = Math.min(direct + extra, use * 0.95);
      var self = selfKwh / mid, aut = selfKwh / use;
      var span = function (p) {
        var a = Math.max(0, Math.round(p * 100 / 5) * 5 - 5), b = Math.min(100, a + 10);
        return 'ca. ' + a + ' bis ' + b + ' %';
      };
      txt('pv-kwp', 'ca. ' + nf(kwp, 1) + ' kWp');
      txt('pv-yield', nf(Math.round(lo / 100) * 100) + ' bis ' + nf(Math.round(hi / 100) * 100) + ' kWh');
      txt('pv-self', span(self)); bar('pv-self-bar', self);
      txt('pv-aut', span(aut)); bar('pv-aut-bar', aut);
      var t;
      if (f < 0.7) t = 'Ein Norddach bringt deutlich weniger. Ob es sich trotzdem rechnet, hängt von Neigung und Schatten ab. Schick uns ein Foto, wir sagen es dir ehrlich.';
      else if (r > 1.8 && bat === 0) t = 'Dein Dach liefert deutlich mehr, als du verbrauchst. Ein Speicher oder ein E-Auto würden viel mehr davon im Haus halten.';
      else if (r < 0.6) t = 'Dein Dach ist klein im Verhältnis zum Verbrauch. Fast jede Kilowattstunde bleibt im Haus, ein großer Speicher bringt hier wenig.';
      else t = 'Dach und Verbrauch passen gut zusammen. Die genaue Größe von Anlage und Speicher legen wir nach deinem Tagesablauf fest.';
      if (car) t += ' Das E-Auto ist mit rund 2.500 kWh pro Jahr eingerechnet.';
      txt('pv-verdict', t);
      vizPv(area, f, self, aut, bat, car, kwp);
    };
    var all = function () { outs(); wallbox(); pv(); };
    document.addEventListener('input', all);
    all();
  }

  /* ================= Foto-Check ================= */
  var fForm = $('#foto-form');
  if (fForm) {
    var slots = $$('.slot'), akte = $('#akte');
    var fill = function (slot, url) {
      var img = $('img', slot) || slot.appendChild(document.createElement('img'));
      img.alt = 'Vorschau ' + $('b', slot).textContent;
      img.src = url;
      slot.classList.add('full');
    };
    slots.forEach(function (s) {
      $('input', s).addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (file) fill(s, URL.createObjectURL(file));
      });
    });
    var sample = function (label, hue) {
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'><rect width='300' height='400' fill='hsl(" + hue + ",18%,24%)'/>" +
        "<rect x='60' y='70' width='180' height='230' rx='10' fill='hsl(" + hue + ",12%,78%)'/>" +
        "<g fill='hsl(" + hue + ",14%,30%)'><rect x='82' y='100' width='22' height='56' rx='4'/><rect x='112' y='100' width='22' height='56' rx='4'/><rect x='142' y='100' width='22' height='56' rx='4'/><rect x='172' y='100' width='22' height='56' rx='4'/><rect x='82' y='190' width='136' height='74' rx='6'/></g>" +
        "<text x='150' y='352' font-family='sans-serif' font-size='22' font-weight='700' fill='#fff' text-anchor='middle'>" + label + "</text></svg>";
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    };
    $('#foto-demo').addEventListener('click', function () {
      [['Zählerschrank', 38], ['Problemstelle', 205], ['Raum', 150]].forEach(function (d, i) { fill(slots[i], sample('Beispiel: ' + d[0], d[1])); });
    });
    fForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = slots.filter(function (s) { return !s.classList.contains('full'); }).length;
      if (missing) { toast('Es fehlen noch ' + missing + (missing === 1 ? ' Foto.' : ' Fotos.') + ' Oder nimm die Beispielfotos.'); return; }
      var name = $('#f-name').value.trim() || 'dich';
      var thema = radio('thema');
      $('#akte-no').textContent = 'LB-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      $('#akte-sub').textContent = 'Für ' + name + (thema ? ' · Thema: ' + thema : '') + '. So kommt deine Anfrage im Betrieb an.';
      var pics = $('#akte-pics');
      pics.textContent = '';
      slots.forEach(function (s) { var i = document.createElement('img'); i.src = $('img', s).src; i.alt = ''; pics.appendChild(i); });
      var rows = $$('.akte-row', akte);
      rows.forEach(function (r) { r.classList.remove('in'); });
      fForm.hidden = true; akte.hidden = false;
      akte.scrollIntoView({ block: 'center', behavior: 'smooth' });
      $$('img', pics).forEach(function (im, i) { setTimeout(function () { im.classList.add('in'); }, 150 + i * 160); });
      rows.forEach(function (r, i) { setTimeout(function () { r.classList.add('in'); }, 800 + i * 550); });
    });
    $('#foto-again').addEventListener('click', function () {
      akte.hidden = true; fForm.hidden = false; fForm.reset();
      slots.forEach(function (s) { s.classList.remove('full'); var i = $('img', s); if (i) i.remove(); });
      fForm.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  /* ================= Jobs ================= */
  var jForm = $('#job-form');
  if (jForm) {
    var step = 1, t0 = 0, tick = 0;
    var steps = $$('.qstep', jForm), dots = $$('.dots i', jForm);
    var next = $('#job-next'), back = $('#job-back'), timer = $('#timer'), done = $('#job-done');
    var render = function () {
      steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== step; });
      dots.forEach(function (d, i) { d.classList.toggle('on', i < step); });
      back.hidden = step === 1;
      next.textContent = step === 4 ? 'Bewerbung abschicken' : 'Weiter';
    };
    var start = function () {
      if (t0) return;
      t0 = performance.now();
      timer.hidden = false;
      (function loop() {
        if (!t0) return;
        var s = (performance.now() - t0) / 1000;
        $('#timer-bar').style.transform = 'scaleX(' + Math.max(0, 1 - s / 60).toFixed(4) + ')';
        $('#timer-t').textContent = s < 60 ? Math.ceil(60 - s) + ' s' : '+' + Math.floor(s - 60) + ' s';
        tick = requestAnimationFrame(loop);
      })();
    };
    var ok = function () {
      if (step === 1) return !!radio('was');
      if (step === 2) return $$('input[name="lieb"]:checked').length > 0;
      if (step === 3) return !!radio('wann');
      return $('#j-name').value.trim().length > 1 && $('#j-tel').value.replace(/\D/g, '').length >= 6;
    };
    jForm.addEventListener('input', start);
    jForm.addEventListener('change', function (e) {
      start();
      if (e.target.type === 'radio' && step < 4) setTimeout(function () { if (ok()) { step++; render(); } }, 220);
    });
    next.addEventListener('click', function () {
      start();
      if (!ok()) { toast(step === 4 ? 'Vorname und Handynummer fehlen noch.' : 'Tipp bitte eine Antwort an.'); return; }
      if (step < 4) { step++; render(); if (step === 4) $('#j-name').focus(); return; }
      var secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
      cancelAnimationFrame(tick); t0 = 0;
      $('#job-time').textContent = secs + (secs === 1 ? ' Sekunde' : ' Sekunden');
      $('#job-thanks').textContent = 'Danke, ' + $('#j-name').value.trim() + '. Jonas ruft dich an.';
      $('#job-sum').textContent = radio('was') + ' · ' + $$('input[name="lieb"]:checked').map(function (i) { return i.value; }).join(', ') + ' · Start: ' + radio('wann') + '. Demo: Es wurde nichts gesendet.';
      jForm.hidden = true; timer.hidden = true; done.hidden = false;
    });
    back.addEventListener('click', function () { if (step > 1) { step--; render(); } });
    jForm.addEventListener('submit', function (e) { e.preventDefault(); next.click(); });
    $('#job-again').addEventListener('click', function () {
      jForm.reset(); step = 1; render(); done.hidden = true; jForm.hidden = false;
    });
    render();
  }
})();
