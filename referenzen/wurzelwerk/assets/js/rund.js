/* WURZELWERK „Rundgang“: Scrollen = einmal um den Apfelbaum, durch ein ganzes Jahr. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var eio = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var root = document.documentElement;
  var mob = function () { return innerWidth < 900; };

  /* Parameter: ?firma=Name  ·  ?farbe=2f3a24,e8b4b0 (Grundton, Akzent) */
  var qs = new URLSearchParams(location.search);
  if (qs.get('firma')) { $('[data-firma]').textContent = qs.get('firma').slice(0, 60); $('.demo .for').hidden = false; }
  if (/^[0-9a-f]{6},[0-9a-f]{6}$/i.test(qs.get('farbe') || '')) {
    var f = qs.get('farbe').split(','), rgb = function (h) { return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join(','); };
    root.style.setProperty('--bg', '#' + f[0]); root.style.setProperty('--bg-rgb', rgb(f[0]));
    root.style.setProperty('--or', '#' + f[1]); root.style.setProperty('--or-rgb', rgb(f[1]));
  }

  /* Szenenliste = alle Haltepunkte (Seiten des Baums + Natur-Brücken). Jede Szene hat ein Foto,
     eine Jahreszeit und die Art des Übergangs zur nächsten:
     clip = Film spult (Kamera kreist) · iris = Zoom in ein Objekt, Kreis öffnet die nächste Szene ·
     rect = Handy-Display wächst zur nächsten Szene · veil = Kamera fährt durch Nebel/Sprühnebel/Schnee ·
     fade = weicher Übergang mit Partikel-Brücke (Tropfen werden Lichter, Atem wird Schnee). */
  /* Ansicht: ?v=natur (Version 1: nur Natur-Brücken) · ?v=kamera (Version 2: eine Kamerafahrt durch Schleier)
     · ?v=kombi (beides zusammen). Ohne Angabe: natur. */
  var VIEW = ({ natur: 1, kamera: 1, kombi: 1 })[qs.get('v')] ? qs.get('v') : 'kombi';   // Storyboard = Kamerafahrt + Natur-Brücken
  root.dataset.view = VIEW;
  $$('.views a').forEach(function (a) { var v = a.getAttribute('data-v'); a.classList.toggle('on', v === VIEW); a.href = '?v=' + v + (qs.get('firma') ? '&firma=' + encodeURIComponent(qs.get('firma')) : ''); });
  /* Version 2 zeigt die Brücken-Szenen nicht: sie werden aus der Szenenliste genommen */
  if (VIEW === 'kamera') $$('.stop.bridge').forEach(function (b) { b.parentNode.removeChild(b); });
  /* Version 1: jeder Wechsel bekommt eine Natur-Brücke (keine Schleier, kein Kamera-Film) */
  var NATUR = { s1: { tr: 'fade' }, s4: { tr: 'fade' }, s6: { tr: 'iris', cx: 62, cy: 26 }, b5: { tr: 'fade' } };
  if (VIEW === 'natur') Object.keys(NATUR).forEach(function (id) { var el = document.getElementById(id), o = NATUR[id]; if (!el) return; el.dataset.tr = o.tr; if (o.cx) { el.dataset.cx = o.cx; el.dataset.cy = o.cy; } delete el.dataset.clip; });
  /* Version 2: jeder Wechsel ist eine Kamerafahrt durch einen Schleier, zwischen Nord und Ost der echte Film */
  if (VIEW === 'kamera') $$('.stop').forEach(function (el) { if (el.dataset.tr && el.dataset.tr !== 'clip') el.dataset.tr = 'veil'; });
  var stops = $$('.stop'), N = stops.length, stage = $('.stage');
  var SC = stops.map(function (s) {
    var r = (s.dataset.r || '').split(',').map(Number);
    return { img: (function () { var h = window.WW_IMGS || [], a = s.dataset.img, b = s.dataset.alt; return h.indexOf(a) >= 0 || !b ? a : b; })(), se: +s.dataset.se, tr: (function () { var k = +(s.dataset.chain || 0); return k && (window.WW_CLIPS || []).indexOf(k) >= 0 ? 'clip' : (s.dataset.tr || 'veil'); })(), cx: +(s.dataset.cx || 50), cy: +(s.dataset.cy || 50), r: r.length === 4 ? r : null, side: s.dataset.side || '', clip: (function () { var k = +(s.dataset.chain || 0); return k && (window.WW_CLIPS || []).indexOf(k) >= 0 ? k : +(s.dataset.clip || 0); })(), trf: s.dataset.trf || s.dataset.tr || 'veil', rev: s.dataset.rev === '1' };  /* data-chain: Anschluss-Clip Bild n → n+1 (ein durchgehender Film), sobald vorhanden */
  });
  var pics = SC.map(function (o) { var d = document.createElement('div'); d.className = 'pic'; stage.insertBefore(d, $('.shade')); return d; });
  var have = [];
  /* Einstieg: Morgennebel hebt sich beim Laden und gibt den Garten frei (Bewegung ab der ersten Sekunde) */
  var mist = document.createElement('div'); mist.className = 'pic mist'; stage.insertBefore(mist, $('.shade'));
  function loadPics() {
    var m = mob() && innerHeight > innerWidth;
    pics.forEach(function (el, i) {
      var src = 'assets/img/rund/' + SC[i].img + (m ? '-m' : '') + '.webp';
      if (i === 0) mist.style.backgroundImage = 'url(assets/img/rund/b6' + (m ? '-m' : '') + '.webp)';
      if (el.dataset.src === src) return;
      el.dataset.src = src;
      var im = new Image();
      im.onload = function () { el.style.backgroundImage = 'url(' + src + ')'; have[i] = true; req(); };
      im.onerror = function () { have[i] = false; req(); };
      im.src = src;
    });
  }
  /* Fehlt ein Brücken-Foto, wird die Brücke übersprungen (nie Platzhalter) */
  function use(i) { for (var d = 0; d < N; d++) { if (have[i - d]) return i - d; if (have[i + d]) return i + d; } return -1; }

  var clips = [];
  /* Ladezeit: nur die aktuelle Station und die nächsten zwei laden (nicht alle Filme auf einmal) */
  var near = 0;
  function loadClips(at) {
    if (at !== undefined) near = at;
    var m = mob() && innerHeight > innerWidth, list = window.WW_CLIPS || [];
    SC.forEach(function (o, i) {
      if (!o.clip || list.indexOf(o.clip) < 0) return;
      if (i < near - 1 || i > near + 1) return;
      var src = 'assets/vid/rund/c' + o.clip + (m ? '-p' : '') + '.mp4', c = clips[i];
      if (c && c.src === src) return;
      if (!c) { var v = document.createElement('video'); v.className = 'clip'; v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto'; stage.insertBefore(v, $('.shade')); c = clips[i] = { v: v, ok: false }; }
      c.src = src; c.ok = false;
      c.v.onloadeddata = function () { c.ok = true; req(); };
      c.v.src = src; c.v.load();
      var pr = c.v.play && c.v.play(); if (pr && pr.then) pr.then(function () { c.v.pause(); }).catch(function () {});
    });
  }

  /* Schritte-Rechner in der Foto-Karte: Schritte -> m² (1 Schritt ≈ 0,75 m) */
  (function () { var l = document.getElementById('sc-l'), b = document.getElementById('sc-b'), r = $('[data-sc]'); if (!l || !b || !r) return;
    function upd() { $('output[for=sc-l]').textContent = l.value; $('output[for=sc-b]').textContent = b.value; r.textContent = Math.round(l.value * b.value * .5625).toLocaleString('de-DE'); }
    l.addEventListener('input', upd); b.addEventListener('input', upd); upd(); })();
  stops.forEach(function (s) { var w = document.createElement('div'); w.className = 'in'; while (s.firstChild) w.appendChild(s.firstChild); s.appendChild(w); });

  var sideTxt = $('.sideTxt'), needle = $('.needle'), veil = $('.veil'), ind = $('.seasons .ind'), seBtns = $$('.seasons .se');
  var ANG = { p1: 0, p2: 90, b1: 110, p3: 125, p4: 180, b2: 190, p5: 205, b3: 240, p6: 270, b4: 290, p7: 305, b5: 335, p8: 360 };
  var t0 = performance.now(), intro = 1, curSe = 0, lastY = scrollY, vel = 0;

  function qOf(s) { var r = s.getBoundingClientRect(), h = s.offsetHeight - innerHeight; return { q: h > 0 ? clamp(-r.top / h, 0, 1) : 0, enter: clamp(1 - r.top / innerHeight, 0, 1), top: r.top }; }
  function show(el, o, dx, dy) { if (!el) return; el.style.opacity = o.toFixed(3); el.style.transform = 'translate(' + ((1 - o) * (dx || 0)).toFixed(1) + 'px,' + ((1 - o) * (dy || 0)).toFixed(1) + 'px)'; }
  function setPic(el, o, z, tf, mask, clip, filt) {
    el.style.opacity = o; el.style.zIndex = z;
    if (o > 0) el.style.transform = tf;
    el.style.webkitMaskImage = el.style.maskImage = mask || '';
    el.style.clipPath = clip || '';
    el.style.filter = filt || '';
  }

  function frame(now) {
    tick = false;
    var cur = 0, qs2 = stops.map(qOf);
    qs2.forEach(function (o, i) { if (o.top <= 1) cur = i; });
    if (cur !== near) loadClips(cur);
    var q = qs2[cur].q, t = cur < N - 1 ? eio(seg(q, .5, 1)) : 0;
    intro = eout(clamp((now - t0) / 2200, 0, 1));
    vel = vel * .85 + Math.abs(scrollY - lastY) * .15; lastY = scrollY;

    var A = use(cur), B = use(cur + 1), o = SC[cur], tr = o.tr, mv = mob() ? 6 : 9;
    if (B === A) t = 0;
    var last = cur === N - 1, tt = last ? q : t;  /* letzte Station: Film läuft beim Lesen (Winter, Kontakt) */
    var cl = clips[cur], isClip = tr === 'clip' && cl && cl.ok;
    /* Film-Station: der Clip läuft über die GANZE Station und spult mit dem Scrollen (Bild 0 = Storyboard-Foto),
       erst am Ende blendet er in die nächste Szene. So bleibt die Kamera in Bewegung statt Fotos zu zeigen. */
    if (isClip) tt = last ? q : clamp(q / .92, 0, 1);
    var film = isClip && tt < 1;
    if (tr === 'clip' && !film) tr = o.trf;  /* Clip fehlt noch: Übergang aus dem Storyboard A */
    var drift = -q * 2;   // leichte Kamerabewegung in jeder Szene, damit nie Stillstand ist

    clips.forEach(function (c, i) {
      if (!c) return;
      if (film && i === cur) {
        var d = c.v.duration || 5, want = (o.rev ? 1 - tt : tt) * (d - .05);  /* rev: Film endet genau auf dem Storyboard-Foto der nächsten Station */
        if (Math.abs(c.v.currentTime - want) > .02 && !c.v.seeking) c.v.currentTime = want;
        c.v.style.opacity = (last ? 1 : 1 - seg(tt, .9, 1)).toFixed(3);
        c.v.style.transform = 'translate3d(' + (drift * (1 - tt)).toFixed(2) + '%,0,0) scale(1.05)';
      } else c.v.style.opacity = 0;
    });

    var veilO = 0;
    pics.forEach(function (el, i) {
      el.style.transformOrigin = '';
      if (i !== A && i !== B) { setPic(el, 0, 1, '', '', '', ''); return; }
      var isA = i === A, sc0 = 1.05 + (isA && cur === 0 ? (1 - intro) * .1 : 0) + (isA ? q * (stops[cur].classList.contains('bridge') ? .22 : .06) : 0);
      if (isClip && !last && B !== A) { var fo = seg(tt, .9, 1); setPic(el, isA ? 1 - fo : fo, 1, 'scale(1.05)'); return; }
      if (B === A || t <= 0) { if (isA) setPic(el, 1, 1, 'translate3d(' + drift + '%,0,0) scale(' + sc0 + ')'); else setPic(el, 0, 1, ''); return; }
      if (tr === 'clip') { /* Film deckt den Wechsel ab */
        var vis = isA ? (t < .5 ? 1 : 0) : (t >= .5 ? 1 : 0);
        setPic(el, vis, 1, 'translate3d(' + (isA ? drift : 0) + '%,0,0) scale(1.05)');
      } else if (tr === 'iris' || tr === 'rect') {
        /* Kamera zoomt in das Objekt; die nächste Szene öffnet sich genau dort */
        var cx = o.cx, cy = o.cy, rr = o.r;
        if (tr === 'rect' && rr) { cx = (rr[0] + rr[2]) / 2; cy = (rr[1] + rr[3]) / 2; }
        if (isA) setPic(el, 1, 1, 'scale(' + (sc0 + t * t * 2.2).toFixed(4) + ')', '', '', 'brightness(' + (1 - t * .3).toFixed(3) + ')'), el.style.transformOrigin = cx + '% ' + cy + '%';
        else {
          el.style.transformOrigin = cx + '% ' + cy + '%';
          if (tr === 'rect' && rr && !mob()) {
            var k = eout(t), ins = [rr[1] * (1 - k), 100 - rr[2] - (100 - rr[2]) * k, 100 - rr[3] - (100 - rr[3]) * k, rr[0] * (1 - k)];
            setPic(el, 1, 2, 'scale(' + (1.05 + (1 - k) * .25).toFixed(4) + ')', '', 'inset(' + ins.map(function (v) { return v.toFixed(2) + '%'; }).join(' ') + ' round ' + (14 * (1 - k)).toFixed(1) + 'px)');
          } else {
            var rad = (eio(t) * 125).toFixed(2);
            setPic(el, 1, 2, 'scale(' + (1.05 + (1 - t) * .35).toFixed(4) + ')', 'radial-gradient(circle at ' + cx + '% ' + cy + '%, #000 ' + rad + '%, transparent ' + (+rad + 6) + '%)');
          }
        }
      } else if (tr === 'fade') {
        if (isA) setPic(el, 1, 1, 'translate3d(' + drift + '%,0,0) scale(' + (sc0 + t * .08) + ')', '', '', 'blur(' + (t * 6).toFixed(1) + 'px)');
        else setPic(el, eio(t), 2, 'scale(' + (1.12 - t * .07).toFixed(4) + ')', '', '', 'blur(' + ((1 - t) * 8).toFixed(1) + 'px)');
      } else { /* veil: Kamera kreist weiter und fährt durch einen Schleier (Nebel, Sprühnebel, Schnee) */
        veilO = Math.sin(Math.PI * t);
        if (isA) setPic(el, 1, 1, 'translate3d(' + (drift - t * mv) + '%,0,0) scale(' + (sc0 + t * .04) + ')');
        else { setPic(el, 1, 2, 'translate3d(' + ((1 - t) * mv) + '%,0,0) scale(' + (1.08 - t * .03) + ')', 'linear-gradient(90deg, transparent ' + ((1 - t) * 114 - 14).toFixed(2) + '%, #000 ' + ((1 - t) * 114).toFixed(2) + '%)'); }
      }
    });
    var mo = Math.max(0, 1 - eout(clamp((now - t0) / 3200, 0, 1)) - (cur > 0 ? 1 : q * 3));
    mist.style.opacity = mo.toFixed(3); mist.style.zIndex = 3; mist.style.transform = 'scale(' + (1.05 + (1 - mo) * .12).toFixed(4) + ')';
    veil.style.opacity = (veilO * .85).toFixed(3);
    veil.dataset.se = SC[t > .5 ? Math.min(cur + 1, N - 1) : cur].se;

    /* Jahreszeiten-Schalter folgt dem Scrollen */
    var seF = SC[cur].se + (SC[Math.min(cur + 1, N - 1)].se - SC[cur].se) * t;
    var se = Math.round(seF);
    if (se !== curSe) { curSe = se; root.dataset.season = se; }
    seBtns.forEach(function (b, i) { b.classList.toggle('on', i === se); b.setAttribute('aria-pressed', i === se); });
    var b0 = seBtns[Math.floor(seF)], b1 = seBtns[Math.min(Math.ceil(seF), 3)], fr = seF - Math.floor(seF);
    var sd = $('.sundot'); if (sd) { var uu = .06 + seF / 3 * .88, aa = 1 - uu; sd.style.left = ((aa * aa * 20 + 2 * aa * uu * 500 + uu * uu * 980) / 10) + '%'; sd.style.top = ((aa * aa * 110 + 2 * aa * uu * -40 + uu * uu * 110) / 1.2) + '%'; }
    if (b0 && b1 && !$('.sunarc')) { ind.style.width = (b0.offsetWidth + (b1.offsetWidth - b0.offsetWidth) * fr) + 'px'; ind.style.transform = 'translateX(' + (b0.offsetLeft + (b1.offsetLeft - b0.offsetLeft) * fr) + 'px)'; }
    var ang = (ANG[o.img] || 0) + ((ANG[SC[Math.min(cur + 1, N - 1)].img] || 0) - (ANG[o.img] || 0)) * t;
    if (needle) needle.style.setProperty('--rot', ang + 'deg');
    var st = SC[t > .5 ? Math.min(cur + 1, N - 1) : cur].side;
    if (sideTxt.textContent !== st) sideTxt.textContent = st;
    FX.set(seF, (tr === 'fade' || tr === 'iris' || tr === 'veil') && t > 0 ? Math.sin(Math.PI * t) : 0, vel);

    /* Texte je Haltepunkt */
    stops.forEach(function (sec, i) {
      var oo = qs2[i], last = i === N - 1;
      var vis = i === 0 ? 1 - seg(oo.q, .42, .58) : Math.min(seg(oo.enter, .55, 1), last ? 1 : 1 - seg(oo.q, .42, .58));
      if (i === 0) vis = Math.min(vis, intro * 1.4);
      var inn = sec.firstChild; inn.style.opacity = vis.toFixed(3); inn.style.visibility = vis < .01 ? 'hidden' : 'visible';
      inn.style.transform = 'translateY(' + ((1 - vis) * 24).toFixed(1) + 'px)';
      var p = i === 0 ? 0 : oo.q + (1 - oo.enter) * -.2;
      var sl2 = $$('.steps li', sec), nowK = -1;
      sl2.forEach(function (li, k) { var on = p >= k * .1 - .04; li.classList.toggle('on', on); if (on) nowK = k; });
      sl2.forEach(function (li, k) { li.classList.toggle('now', k === nowK); });
      $$('.kin li', sec).forEach(function (li, k) { show(li, eout(seg(p, -.1 + k * .1, k * .1)), -60, 0); });
      $$('.big-kin li', sec).forEach(function (li, k) { show(li, eout(seg(p, -.12 + k * .12, k * .12 + .02)), -140, 0); });
      $$('.stars i', sec).forEach(function (st, k) { st.style.setProperty('--f', seg(p, -.1 + k * .05, -.04 + k * .05).toFixed(3)); });
      /* Erzähl-Ebene: Beats nacheinander (Handy: immer nur der aktuelle), Zahlen und Grafiken laufen mit dem Scrollen */
      var bs = $$('.beat', sec), nb = bs.length, M = mob() && sec.classList.contains('story');
      if (nb) {
        var span = sec.classList.contains('story') ? .4 : .3, aa = bs.map(function (b, k) { return eout(seg(p, k * span / nb - .03, k * span / nb + .05)); });
        bs.forEach(function (b, k) {
          var a2 = M && k < nb - 1 ? aa[k] * (1 - seg(aa[k + 1], 0, .35)) : aa[k];
          show(b, a2, 0, 26);
          $$('.cnt', b).forEach(function (c) { var to = +c.dataset.to, d = +(c.dataset.d || 0); c.textContent = (to * aa[k]).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }); });
          $$('[data-w]', b).forEach(function (e, n) { e.style.width = (+e.dataset.w * eout(seg(aa[k], n * .2, n * .2 + .6))) + '%'; });
          $$('[data-h]', b).forEach(function (e, n) { e.style.height = (+e.dataset.h * eout(seg(aa[k], n * .1, n * .1 + .5))) + '%'; });
          $$('.cal i.y', b).forEach(function (e, n) { e.style.setProperty('--a', eout(seg(aa[k], n * .12, n * .12 + .4)).toFixed(3)); });
        });
        if (mob() && sec.classList.contains('right')) sec.classList.toggle('cards', aa[nb - 1] > .95 && p > span + .02);
      }
      var qq = $$('.q', sec);
      if (qq.length) {
        if (mob()) { var k1 = Math.floor(clamp(p, 0, .999) / .1) % qq.length; qq.forEach(function (e, k) { e.classList.toggle('on', k === k1 && vis > .3); }); }
        else qq.forEach(function (e, k) { e.classList.toggle('on', p >= -.08 + k * .07 && vis > .3); });
      }
    });
    root.classList.toggle('past', $('#rund').getBoundingClientRect().bottom < innerHeight * .75);
    if (now - t0 < 3300 || vel > .5) req();
  }

  /* Partikel je Jahreszeit: Blüten → Tropfen → Laub → Schnee. Laufen leise immer mit,
     werden in den Übergängen dichter und tragen das Bild in die nächste Szene. */
  var FX = (function () {
    var cv = $('.fx'), cx = cv.getContext('2d'), P = [], seF = 0, boost = 0, w = 0, h = 0, dpr = 1, run = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    function size() { dpr = Math.min(devicePixelRatio || 1, 2); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; }
    size(); addEventListener('resize', size);
    function make(top) { return { x: Math.random() * w, y: top ? -20 * dpr : Math.random() * h, s: (.5 + Math.random()) * dpr, r: Math.random() * 6.28, vr: (Math.random() - .5) * .04, vx: (Math.random() - .5) * .6, vy: .4 + Math.random() * .9, k: Math.random() }; }
    for (var i = 0; i < 90; i++) P.push(make(false));
    function col(se, a) {
      if (se === 0) return 'rgba(255,240,244,' + a + ')';
      if (se === 1) return 'rgba(255,230,170,' + a + ')';
      if (se === 2) return ['rgba(214,110,40,', 'rgba(232,160,60,', 'rgba(170,70,30,'][Math.floor(a * 30) % 3] + a + ')';
      return 'rgba(255,255,255,' + a + ')';
    }
    function draw() {
      cx.clearRect(0, 0, w, h);
      var se = Math.round(seF), n = Math.round(18 + boost * 72);
      for (var i = 0; i < n && i < P.length; i++) {
        var p = P[i], sp = 1 + boost * 2.2;
        p.x += (p.vx + (se === 2 ? Math.sin(p.y / 60 / dpr + p.k * 6) * .8 : 0)) * sp * dpr; p.y += p.vy * sp * dpr * (se === 1 ? .35 : 1); p.r += p.vr * sp;
        if (p.y > h + 30 * dpr || p.x < -40 || p.x > w + 40) P[i] = make(true);
        var a = .35 + boost * .5;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
        if (se === 0) { cx.fillStyle = col(0, a); cx.beginPath(); cx.ellipse(0, 0, 5 * p.s, 3 * p.s, 0, 0, 6.28); cx.fill(); }
        else if (se === 1) { var g = cx.createRadialGradient(0, 0, 0, 0, 0, 6 * p.s); g.addColorStop(0, col(1, a)); g.addColorStop(1, col(1, 0)); cx.fillStyle = g; cx.beginPath(); cx.arc(0, 0, 6 * p.s, 0, 6.28); cx.fill(); }
        else if (se === 2) { cx.fillStyle = col(2, a); cx.beginPath(); cx.moveTo(0, -7 * p.s); cx.quadraticCurveTo(5 * p.s, 0, 0, 7 * p.s); cx.quadraticCurveTo(-5 * p.s, 0, 0, -7 * p.s); cx.fill(); }
        else { cx.fillStyle = col(3, a); cx.beginPath(); cx.arc(0, 0, 2.2 * p.s, 0, 6.28); cx.fill(); }
        cx.restore();
      }
      if (run && !root.classList.contains('past')) requestAnimationFrame(draw); else setTimeout(function () { requestAnimationFrame(draw); }, 400);
    }
    if (run) requestAnimationFrame(draw);
    return { set: function (s, b, v) { seF = s; boost = clamp(Math.max(b, v / 60), 0, 1); } };
  })();

  var tick = false;
  function req() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', function () { loadPics(); loadClips(); req(); });
  loadPics(); loadClips(); req();

  /* Sprünge: Jahreszeiten-Schalter, Menü, Knöpfe */
  function goEl(s) { if (!s) return; scrollTo({ top: s.offsetTop + (s === stops[0] ? 0 : innerHeight * .05), behavior: 'smooth' }); }
  function go(i) { goEl(stops[clamp(i, 0, N - 1)]); }
  $$('[data-goid]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); root.classList.remove('menu-open'); goEl(document.getElementById(b.getAttribute('data-goid'))); }); });
  var burger = $('.burger');
  burger.addEventListener('click', function () { var o = root.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Menü schließen' : 'Menü öffnen'); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') root.classList.remove('menu-open'); });

  /* Handy: seitlich wischen = nächste Szene */
  var sx = 0, sy = 0, swipeHint = $('.swipe');
  addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', function (e) {
    if (e.target.closest('dialog, .menu, input, .card, label, .seasons')) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      var cur = 0; stops.forEach(function (s, i) { if (s.getBoundingClientRect().top <= 1) cur = i; });
      go(cur + (dx < 0 ? 1 : -1)); swipeHint.style.opacity = 0;
    }
  }, { passive: true });
  addEventListener('scroll', function () { if (scrollY > innerHeight) swipeHint.style.opacity = 0; }, { passive: true });

  /* Dialoge + Demo-Formulare */
  var toastEl = $('.toast'), toastT;
  function toast(t) { toastEl.textContent = t; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 3200); }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { var d = $('#m-' + b.getAttribute('data-open')); if (d && d.showModal) { resetApp(d); d.showModal(); } }); });
  $$('dialog form[data-demo]').forEach(function (f) { f.addEventListener('submit', function (e) { if (e.submitter && e.submitter.value === 'ok') toast(f.getAttribute('data-demo')); }); });
  $$('dialog').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); });
  var mini = $('.mini');
  if (mini) mini.addEventListener('submit', function (e) { e.preventDefault(); toast(mini.getAttribute('data-demo')); });
  var fi = $('.file input'), fs = $('.file span');
  if (fi) fi.addEventListener('change', function () { if (fi.files[0]) { fs.textContent = '✓ ' + fi.files[0].name.slice(0, 28); fi.parentNode.classList.add('has'); } });
  var rg = $('.rng input'), ro = $('.rng output');
  if (rg) rg.addEventListener('input', function () { ro.textContent = rg.value; });

  /* 60-Sekunden-Bewerbung: Antippen = nächste Karte */
  function resetApp(d) { if (d.id !== 'm-bewerbung') return; setCard(0); }
  var sc = $$('.sc'), barI = $('.bar i');
  function setCard(k) { sc.forEach(function (c, i) { c.classList.toggle('on', i === k); }); barI.style.width = ((k + 1) / sc.length * 100) + '%'; }
  sc.forEach(function (c, i) { $$('input[type=radio]', c).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { setCard(i + 1); }, 260); }); }); });
})();
