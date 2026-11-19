/* Testversion 3 · Stromausfall · Scrollytelling
   Scrollen steuert die Geschichte. Der Schalter oben macht das Licht aus und wieder an. */
(function () {
  'use strict';
  var root = document.documentElement, FX = window.FX, S = window.LB_SERVICES || [], VIZ = window.LB_VIZ || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR = 2752 / 1536;
  var shade = $('#shade'), hot = $('#hot'), flip = $('#flip'), flash = $('#flash'), wave = $('#wave'), lsw = $('#lsw');
  var s1 = $('#s1'), s3 = $('#s3'), s5 = $('#s5'), kwrap = $('#k-wrap');
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var isOut = function () { return root.classList.contains('out'); };
  var store = function () {}; /* die Seite startet bei jedem Öffnen dunkel, der Zustand wird nicht gemerkt */
  function cover(w, h, u, v, px, py) { var dw = Math.max(w, h * AR), dh = dw / AR; return [(w - dw) * px + u * dw, (h - dh) * py + v * dh]; }
  function prog(sec) { var r = sec.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight), 0, 1); }
  function inView(sec) { var r = sec.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }

  /* Überschrift in Wörter teilen */
  $$('.split').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/); h.textContent = '';
    words.forEach(function (w, i) {
      var o = document.createElement('span'), s = document.createElement('span');
      o.className = 'w' + (i >= 3 ? ' hi' : ''); s.textContent = w; s.style.transitionDelay = (i * 0.06) + 's';
      o.appendChild(s); h.appendChild(o); h.appendChild(document.createTextNode(' '));
    });
  });
  if ('IntersectionObserver' in window) {
    var once = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        once.unobserve(en.target);
        if (en.target.classList.contains('split')) en.target.classList.add('in');
        else if (!reduce) {
          var b = en.target, to = +b.getAttribute('data-count'), dv = +b.getAttribute('data-div') || 1, t0 = performance.now();
          (function f(t) { var k = Math.min(1, (t - t0) / 1400), val = Math.round(to * (1 - Math.pow(1 - k, 3))); b.textContent = dv > 1 ? (val / dv).toFixed(1).replace('.', ',') : val; if (k < 1) requestAnimationFrame(f); })(t0);
        }
      });
    }, { threshold: 0.4 });
    $$('.split,[data-count]:not([data-plain])').forEach(function (el) { once.observe(el); });
  } else $$('.split').forEach(function (el) { el.classList.add('in'); });

  /* ---------- Texte der Szenen ein- und ausblenden ---------- */
  var beatSets = [s1, s3, s5].map(function (sec) {
    return { sec: sec, beats: $$('.beat', sec).map(function (el) { return { el: el, a: +el.getAttribute('data-a'), b: +el.getAttribute('data-b') }; }) };
  });
  function beats(set, p) {
    set.beats.forEach(function (b) {
      var o = Math.min(ease((p - b.a) / 0.06), 1 - ease((p - b.b) / 0.06));
      b.el.style.opacity = o.toFixed(3);
      b.el.style.translate = '0 ' + ((1 - ease((p - b.a) / 0.1)) * 40 - ease((p - b.b) / 0.06) * 40).toFixed(1) + 'px';
    });
  }

  /* ---------- Szene 1: Film. Alles hängt nur an der Scroll-Position: vorwärts wie rückwärts ---------- */
  var hotX = innerWidth / 2, hotY = innerHeight / 2, p1 = 0, prevP1 = -1, override = null, first = true;
  var vid = $('#kvid'), vOK = false, vt = 0, vloopOn = false;
  /* Zeiten im Film (Sekunden): Start, Griff, Funke, Licht an, Ende. Lage des Hauptschalters im Bild. */
  var T0 = 1.7, TF = 3.5, TS = 5.45, TL = 6.7, TE = 6.95, TZ = 7.9, U0 = 0.44, V0 = 0.40, U1 = 0.445, V1 = 0.41;
  /* Scroll-Anteile der Szene: A Start, B Hand am Schalter, C Licht ist an, D Hand ist weg */
  var PA = 0.05, PB = 0.42, PC = 0.74, PD = 0.92;
  var PS = PB + (TS - TF) / (TE - TF) * (PC - PB), PL = PB + (TL - TF) / (TE - TF) * (PC - PB);
  function filmTime(p) {
    if (p <= PA) return T0;
    if (p <= PB) return T0 + (p - PA) / (PB - PA) * (TF - T0);
    if (p <= PC) return TF + (p - PB) / (PC - PB) * (TE - TF);
    return TE + clamp((p - PC) / (PD - PC), 0, 1) * (TZ - TE);
  }
  function film() { root.classList.toggle('film', vOK && override !== 'off'); }
  function vloop() {
    var target = override === 'on' ? Math.max(filmTime(p1), TZ) : filmTime(p1);
    vt += (target - vt) * 0.22;
    if (Math.abs(target - vt) < 0.012) vt = target;
    if (vOK && !vid.seeking && Math.abs(vid.currentTime - vt) > 0.02) vid.currentTime = vt;
    if (vt !== target && inView(s1)) requestAnimationFrame(vloop); else vloopOn = false;
  }
  if (vid && !reduce) {
    var ready = function () { if (vOK) return; vOK = true; kwrap.classList.add('has-vid'); vt = filmTime(prog(s1)); film(); scene1(); };
    vid.addEventListener('loadeddata', ready); if (vid.readyState >= 2) ready();
    /* iPhone lädt Videos erst beim Abspielen: kurz stumm anspielen und gleich wieder anhalten */
    try { var warm = vid.play(); if (warm && warm.then) warm.then(function () { vid.pause(); vid.currentTime = vt || T0; }).catch(function () {}); } catch (e) {}
    vid.addEventListener('error', function () { vOK = false; kwrap.classList.remove('has-vid'); film(); }, true);
  }
  function scene1() {
    p1 = prog(s1);
    var W = kwrap.offsetWidth, H = kwrap.offsetHeight, k = ease((p1 - 0.05) / 0.5);
    var zm = vOK ? (innerWidth < 720 ? 2.0 : 1.8) : (innerWidth < 720 ? 2.0 : 2.5);
    var s = 1 + (zm - 1) * k, u = vOK ? U0 + (U1 - U0) * k : 0.44, v = vOK ? V0 + (V1 - V0) * k : 0.40;
    var ox = (u - 0.5) * W, oy = (v - 0.5) * H, tx = -ox * s * k, ty = -oy * s * k;
    /* nicht über den Bildrand hinaus schieben */
    var mx = Math.max(0, (W * s - innerWidth) / 2), my = Math.max(0, (H * s - innerHeight) / 2);
    tx = clamp(tx, -mx, mx); ty = clamp(ty, -my, my);
    kwrap.style.transform = 'translate(calc(-50% + ' + tx.toFixed(1) + 'px),calc(-50% + ' + ty.toFixed(1) + 'px)) scale(' + s.toFixed(4) + ')';
    hotX = innerWidth / 2 + ox * s + tx; hotY = innerHeight / 2 + oy * s + ty;
    hot.style.transform = 'translate(' + (ox * s + tx).toFixed(1) + 'px,' + (oy * s + ty).toFixed(1) + 'px)';
    hot.classList.toggle('show', p1 > 0.3 && p1 < PB + 0.04 && isOut());
    /* wer die Schwelle überfährt, hebt den Handschalter oben wieder auf */
    if (prevP1 >= 0 && ((prevP1 < PL) !== (p1 < PL))) override = null;
    if (prevP1 >= 0 && prevP1 < PS && p1 >= PS && isOut() && !reduce) spark1();
    prevP1 = p1;
    applyLight();
    if (vOK && !vloopOn) { vloopOn = true; requestAnimationFrame(vloop); }
    beats(beatSets[0], p1);
  }

  /* ---------- Taschenlampe ---------- */
  var x = innerWidth / 2, y = innerHeight * 0.45, tx0 = x, ty0 = y, last = -9999, torchOn = false;
  function torch(t) {
    if (!isOut()) { torchOn = false; return; }
    if (t - last > 2400) {
      if (inView(s1) && p1 < 0.95) {
        var k = p1 > 0.7 ? 1 : 0.5 + 0.5 * Math.sin(t / 1500);
        tx0 = innerWidth / 2 + (hotX - innerWidth / 2) * k + Math.sin(t / 700) * 26;
        ty0 = innerHeight * 0.5 + (hotY - innerHeight * 0.5) * k + Math.cos(t / 900) * 20;
      } else { tx0 = innerWidth / 2 + Math.sin(t / 1100) * innerWidth * 0.2; ty0 = innerHeight * 0.48 + Math.cos(t / 1400) * innerHeight * 0.14; }
    }
    x += (tx0 - x) * 0.13; y += (ty0 - y) * 0.13;
    shade.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    requestAnimationFrame(torch);
  }
  function startTorch() { if (!torchOn) { torchOn = true; requestAnimationFrame(torch); } }
  addEventListener('pointermove', function (e) { tx0 = e.clientX; ty0 = e.clientY; last = performance.now(); }, { passive: true });
  addEventListener('pointerdown', function (e) { tx0 = e.clientX; ty0 = e.clientY; last = performance.now(); }, { passive: true });

  /* ---------- Licht an / aus: folgt der Scroll-Position, der Schalter oben kann es übersteuern ---------- */
  var waveA = null, waveIv = 0;
  function setSwitch() { if (lsw) lsw.setAttribute('aria-checked', isOut() ? 'false' : 'true'); }
  function stopWave() { if (waveA) { waveA.onfinish = null; waveA.cancel(); waveA = null; } clearInterval(waveIv); wave.classList.remove('go'); flash.classList.remove('go'); }
  function runWave() {
    if (!wave.animate) return;
    stopWave();
    var W = innerWidth, H = innerHeight;
    wave.classList.add('go');
    var a = waveA = wave.animate([{ transform: 'translate(-3%,-14vh)' }, { transform: 'translate(3%,112vh)' }], { duration: 1700, delay: 60, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both' });
    waveIv = setInterval(function () {
      var p = a.effect && a.effect.getComputedTiming ? (a.effect.getComputedTiming().progress || 0) : 0, ey = -0.14 * H + p * 1.26 * H + 60;
      if (ey > 0 && ey < H + 40) FX.spark(Math.random() * W, ey + (Math.random() - 0.5) * 50, 4, '#ffd166');
    }, 95);
    a.onfinish = function () { stopWave(); };
  }
  function burst(bx, by) {
    FX.strike(bx, by, { n: 6, w: 3.4, reach: 0.6, life: 700, ring: Math.max(innerWidth, innerHeight) * 0.35, sparks: 60 });
  }
  /* Funke am Schalter, in dem Moment, in dem die Hand den Hebel umlegt */
  function spark1() {
    flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
    burst(hotX, hotY);
  }
  function wantLit() { return override ? override === 'on' : p1 >= PL; }
  function applyLight() {
    var want = wantLit(), is = !isOut();
    film();
    if (want === is) { first = false; return; }
    if (want) {
      root.classList.remove('out');
      if (!first && !reduce) { if (override === 'on') burst(innerWidth * 0.5, innerHeight * 0.4); runWave(); }
    } else {
      stopWave(); root.classList.add('out'); x = hotX; y = hotY; startTorch();
    }
    first = false; setSwitch();
  }
  if (lsw) lsw.addEventListener('click', function () {
    override = isOut() ? 'on' : 'off'; applyLight(); scene1();
    if (override === 'off' && window.LB) window.LB.toast('Licht aus. Finger oder Maus sind jetzt die Taschenlampe.');
  });
  function toP1(p) { var top = s1.getBoundingClientRect().top + scrollY; scrollTo({ top: top + (s1.offsetHeight - innerHeight) * p, behavior: reduce ? 'auto' : 'smooth' }); }
  hot.addEventListener('click', function () { toP1(PC + 0.03); });
  $('#replay').addEventListener('click', function () { override = null; scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  setSwitch(); if (isOut()) startTorch();

  /* ---------- Szene 3: Kabelenden fahren zusammen, Lichtbogen ---------- */
  var stage = $('#arc'), hl = $('.hl', stage), hr = $('.hr', stage), cv = $('canvas', stage), g = cv.getContext('2d');
  var dpr = Math.min(2, devicePixelRatio || 1), w = 0, h = 0, tipL = [0, 0], tipR = [0, 0], gap = 0, power3 = 0;
  var px = 0.5, py = 0.5, ptx = 0.5, pty = 0.5, plast = -9999, vis3 = false, n = 0;
  function fit3() { var r = stage.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; }
  function scene3() {
    var p = prog(s3), e = ease(p / 0.5);
    gap = (1 - e) * w * (innerWidth < 720 ? 0.2 : 0.13);
    hl.style.transform = 'translateX(' + (-gap).toFixed(1) + 'px)'; hr.style.transform = 'translateX(' + gap.toFixed(1) + 'px)';
    tipL = cover(w, h, 0.415, 0.49, 0.5, 0.5); tipR = cover(w, h, 0.585, 0.49, 0.5, 0.5);
    tipL[0] -= gap; tipR[0] += gap;
    power3 = clamp((e - 0.55) / 0.45, 0, 1);
    beats(beatSets[1], p);
  }
  stage.addEventListener('pointermove', function (e) { var r = stage.getBoundingClientRect(); ptx = (e.clientX - r.left) / r.width; pty = (e.clientY - r.top) / r.height; plast = performance.now(); });
  stage.addEventListener('pointerdown', function (e) { FX.spark(e.clientX, e.clientY, 22, '#bfe0ff'); });
  /* stehender Lichtbogen: Formen bleiben ein paar Bilder stehen (knistern statt rauschen) */
  var strands = [], sT = 0;
  function arcLoop(t) {
    if (!vis3) return;
    var cx = (tipL[0] + tipR[0]) / 2 / w, cy = tipL[1] / h;
    if (t - plast > 1800) { ptx = cx + 0.04 * Math.sin(t / 900); pty = cy - 0.05 + 0.09 * Math.sin(t / 620); }
    px += (clamp(ptx, tipL[0] / w + 0.02, tipR[0] / w - 0.02) - px) * 0.14; py += (clamp(pty, cy - 0.28, cy + 0.28) - py) * 0.14;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
    if (power3 > 0.02) {
      var mx = px * w, my = py * h, d = tipR[0] - tipL[0];
      if (t - sT > 48) {
        sT = t; strands = [];
        /* Hauptkanal über den Zeigepunkt, dazu wilde Nebenkanäle */
        var m1 = FX.jag(tipL[0], tipL[1], mx, my, d * 0.16), m2 = FX.jag(mx, my, tipR[0], tipR[1], d * 0.16);
        strands.push({ pts: m1.concat(m2.slice(1)), w: 1, a: 1 });
        var extra = 1 + Math.round(power3 * 2);
        for (var i = 0; i < extra; i++) {
          var oy = (Math.random() - 0.5) * d * 0.5 * power3, ox = (Math.random() - 0.5) * d * 0.2;
          var e1 = FX.jag(tipL[0], tipL[1], mx + ox, my + oy, d * 0.28), e2 = FX.jag(mx + ox, my + oy, tipR[0], tipR[1], d * 0.28);
          strands.push({ pts: e1.concat(e2.slice(1)), w: 0.38, a: 0.55 });
        }
        /* kleine Ausreißer an den Kupferenden */
        [tipL, tipR].forEach(function (tp, k) {
          if (Math.random() < 0.7) { var ang = (k ? Math.PI : 0) + (Math.random() - 0.5) * 2.2, len = d * (0.12 + Math.random() * 0.2) * power3; strands.push({ pts: FX.jag(tp[0], tp[1], tp[0] + Math.cos(ang) * len, tp[1] + Math.sin(ang) * len, len * 0.35), w: 0.3, a: 0.6 }); }
        });
        if (!reduce && Math.random() < 0.35 * power3) { var r = stage.getBoundingClientRect(), tp = Math.random() < 0.5 ? tipL : tipR; FX.spark(r.left + tp[0], r.top + tp[1], 3, '#ffd9a0'); }
      }
      var fl = 0.82 + 0.18 * Math.sin(t * 0.09) * Math.sin(t * 0.023), lw = 1.4 + 3 * power3, al = (0.45 + 0.55 * power3) * fl;
      /* Plasma: breiter, weicher Schein entlang des Hauptkanals */
      var mp = strands[0].pts; g.beginPath(); g.moveTo(mp[0][0], mp[0][1]); for (var q = 1; q < mp.length; q++) g.lineTo(mp[q][0], mp[q][1]);
      g.globalAlpha = 0.07 * power3 * fl; g.strokeStyle = '#5aa2ff'; g.lineWidth = 46 + 50 * power3; g.stroke();
      g.globalAlpha = 0.1 * power3 * fl; g.lineWidth = 22 + 20 * power3; g.stroke(); g.globalAlpha = 1;
      strands.forEach(function (st) { FX.glow(g, st.pts, st.pts.length, lw * st.w, al * st.a, '#6fb0ff'); });
      FX.bloom(g, tipL[0], tipL[1], (70 + 60 * power3) * fl, 0.75 * power3, '210,232,255');
      FX.bloom(g, tipR[0], tipR[1], (70 + 60 * power3) * fl, 0.75 * power3, '210,232,255');
      FX.bloom(g, mx, my, (110 + 90 * power3) * fl, 0.4 * power3, '160,200,255');
    } else if (n++ % 3 === 0 && Math.random() < 0.22) {           /* noch zu weit weg: einzelne Überschläge an den Enden */
      var tp2 = Math.random() < 0.5 ? tipL : tipR, dir = tp2 === tipL ? 1 : -1;
      var r2 = stage.getBoundingClientRect();
      FX.bolt(r2.left + tp2[0], r2.top + tp2[1], r2.left + tp2[0] + dir * (30 + Math.random() * 90), r2.top + tp2[1] + (Math.random() - 0.5) * 90, { w: 1.2, life: 220, branches: 1, rough: 0.4 });
    }
    requestAnimationFrame(arcLoop);
  }

  /* ---------- Szene 5: selbst fotografieren, Polaroids fliegen zum Meister ---------- */
  var cam = $('#cam'), vf = $('#vf'), vfImg = $('#vf-img'), vfN = $('#vf-n'), shut = $('#shut'), pols = $$('.pol', cam);
  var camOk = $('#cam-ok'), OKIMG = true; /* OKIMG = true, sobald das Schlussbild mit Haken da ist */
  var camB = $('#cam-b'), camC = $('#cam-c'), camFlash = $('#cam-flash'), camSay = $('#cam-say');
  /* Lage im Foto (Anteile): Handy-Display im Kellerbild, Mappe und Seitenverhältnisse */
  var VF = [0.441, 0.302, 0.562, 0.778], FOLD = [0.535, 0.66], ARA = 16 / 9, FOCA = 0.5, FOCB = 0.52;
  var NAMES = ['Sicherungskasten.', 'Zähler.', 'Problemstelle.'], P5 = [0.12, 0.27, 0.42], D5 = 0.11;
  var shots = -1, motif = -1, sd = [0, 0, 0], landed = [false, false, false], p5 = 0, loop5 = false;
  var camAs = $('#cam-as'), camBgs = $$('.cam-a', cam), camCnt = $('#cam-cnt');
  var vfR = { x: 0, y: 0, w: 10, h: 10 }, fold = [0, 0], cw = 0, ch = 0, pw = 150;
  function cov(w, h, u, v, px) { var dw = Math.max(w, h * ARA), dh = dw / ARA; return [(w - dw) * px + u * dw, (h - dh) * 0.5 + v * dh]; }
  function fitPhone() {
    var r = cam.getBoundingClientRect(); cw = r.width; ch = r.height;
    var a = cov(cw, ch, VF[0], VF[1], FOCA), b = cov(cw, ch, VF[2], VF[3], FOCA);
    vfR = { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] };
    vf.style.transform = 'translate(' + a[0].toFixed(1) + 'px,' + a[1].toFixed(1) + 'px)';
    vf.style.width = vfR.w.toFixed(1) + 'px'; vf.style.height = vfR.h.toFixed(1) + 'px';
    fold = cov(cw, ch, FOLD[0], FOLD[1], FOCB);
    pw = Math.min(ch * 0.19, cw * 0.27); cam.style.setProperty('--pw', pw.toFixed(0) + 'px');
    camFlash.style.setProperty('--fx', ((vfR.x + vfR.w / 2) / cw * 100).toFixed(1) + '%');
    camFlash.style.setProperty('--fy', ((vfR.y + vfR.h * 0.1) / ch * 100).toFixed(1) + '%');
    $$('.cam-bg img', cam).forEach(function (im, i) { im.style.objectPosition = ((i ? FOCB : FOCA) * 100) + '% 50%'; });
  }
  /* Alles hängt nur an der Scroll-Position: Foto i entsteht bei P5[i], rückwärts verschwindet es wieder */
  function setMotif(m) {
    if (m === motif) return;
    var fwd = motif >= 0 && m > motif; motif = m;
    camBgs.forEach(function (el, i) { el.classList.toggle('on', i === m); });
    vfImg.src = vfImg.src.replace(/foto-\d/, 'foto-' + (m + 1)); vfN.textContent = 'Foto ' + (m + 1) + ' von 3';
    if (fwd && camAs.animate && !reduce) camAs.animate([{ transform: 'translateX(0) scale(1)' }, { transform: 'translateX(-3.5%) scale(1.06)', offset: 0.45 }, { transform: 'translateX(0) scale(1)' }], { duration: 800, easing: 'cubic-bezier(.4,0,.2,1)' });
  }
  function setShots(n) {
    if (n === shots) return;
    var fwd = shots >= 0 && n > shots; shots = n;
    cam.classList.toggle('done', n >= 3);
    if (fwd && !reduce) {
      camFlash.classList.remove('go'); void camFlash.offsetWidth; camFlash.classList.add('go');
      if (FX) { var r = cam.getBoundingClientRect(); FX.spark(r.left + vfR.x + vfR.w / 2, r.top + vfR.y, 30, '#fff3c9'); }
    }
  }
  /* Tipp auf den Auslöser: scrollt genau bis hinter das nächste Foto */
  function shoot() {
    var n = p5 < P5[0] + D5 * 0.9 ? 0 : p5 < P5[1] + D5 * 0.9 ? 1 : 2;
    var top = s5.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (s5.offsetHeight - innerHeight) * (P5[n] + D5 + 0.004), behavior: reduce ? 'auto' : 'smooth' });
  }
  function back(t) { t = clamp(t, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function placePols() {
    var cx = vfR.x + vfR.w / 2, ty = vfR.y, moving = false, r = cam.getBoundingClientRect(), nLand = 0;
    var fan = [[-1.02, 0.1, -11], [0, -0.16, 2], [1.02, 0.1, 12]], big = cw < 720 ? 2.0 : 1.9;
    pols.forEach(function (el, i) {
      var target = clamp((p5 - P5[i]) / D5, 0, 1);
      if (reduce) sd[i] = target; else { sd[i] += (target - sd[i]) * 0.16; if (Math.abs(target - sd[i]) < 0.003) sd[i] = target; else moving = true; }
      var s = sd[i];
      if (s <= 0) { el.style.opacity = 0; el.style.zIndex = 1; landed[i] = false; return; }
      /* 1. Foto poppt groß aus dem Handy, bleibt kurz stehen, legt sich dann in den Fächer */
      var a = back(s / 0.3), h = ease((s - 0.62) / 0.38);
      var bx = cw / 2, by = ch * 0.43, fx = cx + fan[i][0] * pw, fy = ty + fan[i][1] * pw + pw * 0.1;
      var x = cx + (bx - cx) * a, y = (ty + pw * 0.4) + (by - (ty + pw * 0.4)) * a, sc = 0.3 + (big - 0.3) * a, rot = (i - 1) * 3 * a, op = clamp(s * 9, 0, 1);
      x += (fx - x) * h; y += (fy - y) * h; sc += (1 - sc) * h; rot += (fan[i][2] - rot) * h;
      el.style.zIndex = s < 1 ? 9 : 2 + i;
      /* 2. einzeln zur Mappe des Meisters: Bogen, dann hineinfallen */
      var t0 = 0.6 + i * 0.08, t = ease((p5 - t0) / 0.07), d = ease((p5 - t0 - 0.065) / 0.035);
      var mx = fold[0], my = fold[1] - pw * 1.05, arc = Math.sin(t * Math.PI) * -ch * 0.1;
      x += (mx - x) * t; y += (my - y) * t + arc; sc *= 1 - 0.3 * t; rot += (-6 + i * 6 - rot) * t;
      x += (fold[0] - x) * d; y += (fold[1] - y) * d; sc *= 1 - 0.62 * d; op *= 1 - ease((d - 0.55) / 0.45);
      el.style.opacity = op.toFixed(3);
      el.style.transform = 'translate(' + (x - pw / 2).toFixed(1) + 'px,' + (y - pw * 0.62).toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      var isIn = d > 0.7;
      if (isIn && !landed[i]) {
        landed[i] = true;
        if (FX && !reduce) FX.spark(r.left + fold[0], r.top + fold[1], 34, '#ffd166');
        camCnt.classList.remove('bump'); void camCnt.offsetWidth; camCnt.classList.add('bump');
      } else if (!isIn) landed[i] = false;
      if (isIn) nLand++;
    });
    camCnt.textContent = nLand + ' von 3 in der Akte';
    return moving;
  }
  function tick5() { if (placePols() && inView(s5)) requestAnimationFrame(tick5); else loop5 = false; }
  function scene5() {
    p5 = prog(s5);
    setShots(p5 >= P5[2] ? 3 : p5 >= P5[1] ? 2 : p5 >= P5[0] ? 1 : 0);
    setMotif(p5 >= P5[2] - 0.035 ? 2 : p5 >= P5[1] - 0.035 ? 1 : 0);
    camSay.textContent = p5 >= P5[2] + D5 ? 'Zack. Zack. Zack.' : NAMES[motif];
    var k = ease((p5 - 0.56) / 0.07);
    camB.style.opacity = k.toFixed(3); vf.style.opacity = (1 - ease((p5 - 0.55) / 0.05)).toFixed(3);
    vf.style.pointerEvents = p5 > 0.55 ? 'none' : 'auto';
    camC.style.opacity = ease((p5 - 0.89) / 0.04).toFixed(3);
    if (camOk) { var ko = ease((p5 - 0.89) / 0.04); camOk.style.opacity = (OKIMG ? 0 : ko).toFixed(3); camOk.style.transform = 'translate(' + fold[0].toFixed(1) + 'px,' + fold[1].toFixed(1) + 'px) scale(' + (0.6 + 0.4 * back(ko)).toFixed(3) + ')'; }
    var co = Math.min(ease((p5 - 0.62) / 0.04), 1 - ease((p5 - 0.87) / 0.03));
    camCnt.style.opacity = co.toFixed(3);
    camCnt.style.transform = 'translate(' + fold[0].toFixed(1) + 'px,' + (fold[1] + pw * 0.55).toFixed(1) + 'px) translate(-50%,0)';
    if (!loop5) { loop5 = true; requestAnimationFrame(tick5); }
    beats(beatSets[2], p5);
  }
  if (shut) shut.addEventListener('click', shoot);

  /* ---------- eine Schleife für alles, was am Scrollen hängt ---------- */
  var tick = false;
  function frame() {
    tick = false;
    if (inView(s1)) scene1();
    if (inView(s3)) { scene3(); if (!vis3 && !reduce) { vis3 = true; requestAnimationFrame(arcLoop); } } else vis3 = false;
    if (inView(s5)) scene5();
  }
  function onScroll() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  function resize() { fit3(); fitPhone(); frame(); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', resize); addEventListener('load', resize);
  resize(); scene1(); scene3(); scene5();

  /* ---------- Karten zünden und gehen auf ---------- */
  var cards = $$('.svc');
  if (reduce || !('IntersectionObserver' in window)) cards.forEach(function (c) { c.classList.add('lit'); });
  else {
    var q = 0, io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, d = q++ * 170;
        setTimeout(function () {
          q = Math.max(0, q - 1);
          var r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
          FX.bolt(cx + (Math.random() - 0.5) * 200, Math.max(0, r.top - 300), cx, r.top + 4, { life: 420, w: 2.8 });
          FX.spark(cx, r.top + 4, 20, '#ffd166');
          setTimeout(function () { el.classList.add('lit'); }, 130);
        }, d);
      });
    }, { threshold: 0.3 });
    cards.forEach(function (c) { io.observe(c); });
  }
  var sheet = $('#sheet'), inn = $('.sheet-in', sheet), lastCard = null;
  function open(card) {
    var s = S[+card.getAttribute('data-i')]; if (!s) return;
    lastCard = card;
    $('#sh-eye').textContent = s.name; $('#sh-h').textContent = s.head; $('#sh-t').textContent = s.text;
    var ul = $('#sh-l'); ul.textContent = '';
    s.pts.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ul.appendChild(li); });
    var a = $('#sh-a');
    if (s.link) { a.href = s.link; a.textContent = s.cta; a.removeAttribute('data-demo'); }
    else { a.href = '#'; a.textContent = 'Notdienst anrufen'; a.setAttribute('data-demo', 'Demo: Hier wählt das Handy direkt den Notdienst.'); }
    $('#sh-v').innerHTML = VIZ[s.key] || '';
    sheet.hidden = false;
    var r = card.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    inn.style.setProperty('--ox', ((cx - inn.offsetLeft) / inn.offsetWidth * 100).toFixed(1) + '%');
    inn.style.setProperty('--oy', ((cy - inn.offsetTop) / inn.offsetHeight * 100).toFixed(1) + '%');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('open'); }); });
    FX.bolt(cx, cy, innerWidth / 2, innerHeight / 2, { life: 380, w: 3, color: '#ffd89a' });
    FX.spark(cx, cy, 26, '#ffd166');
    setTimeout(function () { $('#sh-x').focus(); }, 300);
  }
  function close() {
    sheet.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(function () { sheet.hidden = true; if (lastCard) lastCard.focus(); }, 320);
  }
  cards.forEach(function (c) { c.addEventListener('click', function () { c.classList.add('lit'); open(c); }); });
  $('#sh-x').addEventListener('click', close);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });
  document.addEventListener('pointerdown', function (e) { if (e.target.closest('.btn,.lsw')) FX.spark(e.clientX, e.clientY, 12, '#ffd166'); });
  /* ---------- Notdienst: Motion Design, läuft von selbst, solange der Abschnitt zu sehen ist ---------- */
  (function () {
    var st = $('#nd-stage'); if (!st) return;
    var DUR = [2300, 1900, 2400, 2400, 2500, 2800], bars = $$('.nd-bar i', st), tEl = $('#nd-time'), cur = -1, timer = 0, tick = 0, vis = false, hold = false;
    function show(i) {
      cur = i; st.setAttribute('data-s', i);
      bars.forEach(function (b, n) { b.classList.remove('run'); b.classList.toggle('done', n < i); if (n === i) { b.style.setProperty('--d', DUR[i] + 'ms'); void b.offsetWidth; b.classList.add('run'); } });
      clearInterval(tick);
      if (i === 3 && tEl) { var m = 49; tEl.textContent = '22:49'; tick = setInterval(function () { m += 3; tEl.textContent = (m >= 60 ? '23:' + ('0' + (m - 60)).slice(-2) : '22:' + m); }, 260); }
      clearTimeout(timer);
      if (vis && !hold) timer = setTimeout(function () { show((i + 1) % DUR.length); }, DUR[i]);
    }
    if (reduce) { st.setAttribute('data-s', 5); bars.forEach(function (b) { b.classList.add('done'); }); return; }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
      if (vis && !hold) show(cur < 0 ? 0 : cur); else { clearTimeout(timer); clearInterval(tick); }
    }, { threshold: 0.35 }).observe(st);
    else { vis = true; show(0); }
    $('#nd-re').addEventListener('click', function (e) { e.stopPropagation(); hold = !hold; st.classList.toggle('hold', hold); if (hold) { clearTimeout(timer); clearInterval(tick); } else show(cur < 0 ? 0 : cur); });
    bars.forEach(function (b, n) { b.style.cursor = 'pointer'; });
    st.addEventListener('click', function (e) { if (e.target.closest('.nd-re')) return; var r = st.getBoundingClientRect(); if (!hold) show(e.clientX - r.left > r.width / 2 ? (cur + 1) % DUR.length : (cur + DUR.length - 1) % DUR.length); });
  })();
})();
