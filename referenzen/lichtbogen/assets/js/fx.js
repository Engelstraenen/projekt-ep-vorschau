/* LICHTBOGEN · Blitze und Funken auf einer Leinwand über der Seite
   Ein Blitz hat eine feste Form mit Ästen. Er schießt vom Start zum Ziel (Vorentladung),
   zündet hell durch (Hauptentladung), flackert mit ein bis zwei Nachschlägen und glüht aus.
   Das Glühen entsteht aus mehreren übereinander gezeichneten Strichen, ohne teure Schatten. */
window.FX = (function () {
  'use strict';
  var c, ctx, bolts = [], sparks = [], rings = [], raf = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rnd = Math.random;

  function init() {
    if (c) return;
    c = document.createElement('canvas');
    c.className = 'fx';
    document.body.appendChild(c);
    ctx = c.getContext('2d');
    size();
    addEventListener('resize', size);
  }
  function size() { c.width = innerWidth * dpr; c.height = innerHeight * dpr; }

  /* gezackter Weg per Mittelpunkt-Verschiebung */
  function jag(x1, y1, x2, y2, disp) {
    var pts = [[x1, y1], [x2, y2]];
    while (disp > 2.5) {
      var n = [];
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1];
        n.push(a, [(a[0] + b[0]) / 2 + (rnd() - 0.5) * disp, (a[1] + b[1]) / 2 + (rnd() - 0.5) * disp]);
      }
      n.push(pts[pts.length - 1]);
      pts = n; disp *= 0.52;
    }
    return pts;
  }

  /* Form eines Blitzes: Hauptkanal plus Äste, die sich weiter verzweigen */
  function shape(x1, y1, x2, y2, o) {
    var d = Math.hypot(x2 - x1, y2 - y1), base = Math.atan2(y2 - y1, x2 - x1);
    var main = jag(x1, y1, x2, y2, d * (o.rough || 0.26)), segs = [{ pts: main, w: 1, a: 1, at: 0 }];
    if (o.branch === false || d < 60) return segs;
    var nb = o.branches == null ? 2 + Math.floor(rnd() * 3) : o.branches;
    for (var b = 0; b < nb; b++) {
      var f = 0.12 + rnd() * 0.66, i = Math.floor(main.length * f), p = main[i];
      var ang = base + (rnd() < 0.5 ? -1 : 1) * (0.3 + rnd() * 0.75), len = d * (0.16 + rnd() * 0.3) * (1 - f * 0.45);
      var ex = p[0] + Math.cos(ang) * len, ey = p[1] + Math.sin(ang) * len, br = jag(p[0], p[1], ex, ey, len * 0.3);
      segs.push({ pts: br, w: 0.5, a: 0.8, at: f });
      if (rnd() < 0.6) {
        var q = br[Math.floor(br.length * (0.35 + rnd() * 0.3))], a2 = ang + (rnd() < 0.5 ? -1 : 1) * (0.35 + rnd() * 0.6), l2 = len * (0.35 + rnd() * 0.3);
        segs.push({ pts: jag(q[0], q[1], q[0] + Math.cos(a2) * l2, q[1] + Math.sin(a2) * l2, l2 * 0.3), w: 0.28, a: 0.6, at: Math.min(0.95, f + 0.12) });
      }
    }
    return segs;
  }

  /* ein Weg mit Glühen: breite, schwache Striche außen, heller Kern innen */
  var LAYERS = [[13, 0.045, 0], [7, 0.09, 0], [3.4, 0.2, 0], [1.7, 0.65, 1], [0.75, 1, 2]];
  function glow(g, pts, n, w, I, color) {
    if (n < 2 || I <= 0.01) return;
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < n; i++) g.lineTo(pts[i][0], pts[i][1]);
    for (var l = 0; l < LAYERS.length; l++) {
      var L = LAYERS[l];
      g.globalAlpha = Math.min(1, I * L[1]);
      g.lineWidth = w * L[0];
      g.strokeStyle = L[2] === 0 ? color : L[2] === 1 ? '#dceeff' : '#ffffff';
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  function bloom(g, x, y, R, a, rgb) {
    if (a <= 0.01 || R < 2) return;
    var rg = g.createRadialGradient(x, y, 0, x, y, R);
    rg.addColorStop(0, 'rgba(' + rgb + ',' + Math.min(1, a).toFixed(3) + ')');
    rg.addColorStop(0.35, 'rgba(' + rgb + ',' + Math.min(1, a * 0.35).toFixed(3) + ')');
    rg.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = rg; g.fillRect(x - R, y - R, R * 2, R * 2);
  }

  /* Sofort-Blitz für eigene Leinwände (z. B. der stehende Lichtbogen): Form wird bei jedem Aufruf neu gewürfelt */
  function draw(g, x1, y1, x2, y2, o) {
    o = o || {};
    var segs = shape(x1, y1, x2, y2, { rough: o.rough || 0.22, branch: o.branch, branches: o.branches == null ? (rnd() < 0.6 ? 1 : 0) : o.branches });
    var a = o.alpha == null ? 1 : o.alpha;
    for (var i = 0; i < segs.length; i++) glow(g, segs[i].pts, segs[i].pts.length, (o.w || 2.2) * segs[i].w, a * segs[i].a, o.color || '#7db8ff');
  }

  /* ein Blitz auf der großen Leinwand */
  function bolt(x1, y1, x2, y2, o) {
    if (reduce) return;
    init(); o = o || {};
    var life = o.life || 560;
    bolts.push({ x1: x1, y1: y1, x2: x2, y2: y2, t: performance.now() + (o.delay || 0), life: life, o: o, segs: shape(x1, y1, x2, y2, o),
      grow: Math.min(110, life * 0.18), re: life * (0.34 + rnd() * 0.12), re2: rnd() < 0.5 ? life * (0.56 + rnd() * 0.08) : 9e9, did: 0, ph: rnd() * 6 });
    kick();
  }
  /* Einschlag: mehrere Blitze strahlen von einem Punkt aus, dazu Druckwelle und Funken */
  function strike(x, y, o) {
    if (reduce) return;
    o = o || {};
    var n = o.n || 5, R = (o.reach || 0.55) * Math.max(innerWidth, innerHeight), a0 = o.angle == null ? -Math.PI / 2 : o.angle, spread = o.spread == null ? Math.PI * 1.5 : o.spread;
    for (var i = 0; i < n; i++) {
      var a = a0 + (i / (n - 1 || 1) - 0.5) * spread + (rnd() - 0.5) * 0.35, len = R * (0.45 + rnd() * 0.55);
      bolt(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, { life: (o.life || 620) * (0.75 + rnd() * 0.5), w: (o.w || 3) * (0.7 + rnd() * 0.6), color: o.color, delay: i * 26, rough: 0.24 });
    }
    ring(x, y, o.ring || 260);
    spark(x, y, o.sparks == null ? 46 : o.sparks, o.sparkColor || '#eaf4ff');
  }
  function ring(x, y, R) { if (reduce) return; init(); rings.push({ x: x, y: y, R: R, t: performance.now(), life: 520 }); kick(); }

  function spark(x, y, n, color) {
    if (reduce) return;
    init();
    for (var i = 0; i < (n || 12); i++) {
      var a = rnd() * Math.PI * 2, v = 2 + rnd() * rnd() * 11;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2.2, t: performance.now(), life: 380 + rnd() * 720, color: color || '#ffd166', w: 0.8 + rnd() * 1.5 });
    }
    kick();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  function frame(now) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    var sum = 0;
    bolts = bolts.filter(function (b) { return now - b.t < b.life; });
    bolts.forEach(function (b) {
      var age = now - b.t; if (age < 0) return;
      var o = b.o, w = o.w || 2.4, color = o.color || '#6fb0ff';
      /* Nachschlag: neue Form, kurzer heller Stoß */
      if (b.did === 0 && age > b.re) { b.did = 1; b.segs = shape(b.x1, b.y1, b.x2, b.y2, o); }
      if (b.did === 1 && age > b.re2) { b.did = 2; b.segs = shape(b.x1, b.y1, b.x2, b.y2, o); }
      var gr = Math.min(1, age / b.grow), I;
      if (age < b.grow) I = 0.7;
      else {
        var since = age - (b.did === 2 ? b.re2 : b.did === 1 ? b.re : b.grow);
        I = 0.5 + 1.25 * Math.exp(-since / 70) + 0.22 * Math.sin(age * 0.05 + b.ph);
        var k = age / b.life; if (k > 0.6) I *= Math.pow(1 - (k - 0.6) / 0.4, 1.4);
      }
      b.segs.forEach(function (s) {
        var g2 = s.at ? (gr - s.at) / (1 - s.at) : gr; if (g2 <= 0) return;
        glow(ctx, s.pts, Math.max(2, Math.ceil(s.pts.length * Math.min(1, g2))), w * s.w, I * s.a, color);
      });
      bloom(ctx, b.x1, b.y1, 46 * w * Math.min(1.4, I), 0.5 * I, '200,228,255');
      if (gr >= 1) bloom(ctx, b.x2, b.y2, 26 * w * Math.min(1.4, I), 0.32 * I, '200,228,255');
      sum += I;
    });
    /* der ganze Bildschirm leuchtet kurz mit auf */
    if (sum > 0.05) { ctx.globalAlpha = Math.min(0.2, sum * 0.035); ctx.fillStyle = '#a9ccff'; ctx.fillRect(0, 0, innerWidth, innerHeight); ctx.globalAlpha = 1; }
    rings = rings.filter(function (r) { return now - r.t < r.life; });
    rings.forEach(function (r) {
      var k = (now - r.t) / r.life, e = 1 - Math.pow(1 - k, 3);
      ctx.globalAlpha = (1 - k) * 0.55; ctx.strokeStyle = '#cfe6ff'; ctx.lineWidth = 2 + 10 * (1 - k);
      ctx.beginPath(); ctx.arc(r.x, r.y, 8 + r.R * e, 0, 6.3); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    sparks = sparks.filter(function (s) { return now - s.t < s.life; });
    sparks.forEach(function (s) {
      var k = 1 - (now - s.t) / s.life, ox = s.x, oy = s.y;
      s.vy += 0.26; s.vx *= 0.985; s.vy *= 0.985; s.x += s.vx; s.y += s.vy;
      ctx.globalAlpha = k * 0.35; ctx.strokeStyle = s.color; ctx.lineWidth = s.w * 3.2;
      ctx.beginPath(); ctx.moveTo(ox - s.vx, oy - s.vy); ctx.lineTo(s.x, s.y); ctx.stroke();
      ctx.globalAlpha = k; ctx.strokeStyle = k > 0.6 ? '#ffffff' : s.color; ctx.lineWidth = s.w;
      ctx.beginPath(); ctx.moveTo(ox - s.vx * 0.6, oy - s.vy * 0.6); ctx.lineTo(s.x, s.y); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    if (bolts.length || sparks.length || rings.length) raf = requestAnimationFrame(frame);
    else { raf = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  return { bolt: bolt, strike: strike, ring: ring, spark: spark, draw: draw, jag: jag, shape: shape, glow: glow, bloom: bloom, reduce: reduce };
})();
