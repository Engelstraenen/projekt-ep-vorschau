/* SPALTMASS „Die Prüfstraße“ (Storyboard SPSB-7B): eine Bühne, das Auto fährt beim Scrollen durch den Prüftunnel.
   Scroll-Fortschritt p (0–1) steuert Bilder, Film, Texte und Grafik. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var eio = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var IMG = window.SP_IMG || {}, VID = window.SP_VID || {};
  var root = document.documentElement;

  var fq = new URLSearchParams(location.search).get('farbe');
  if (fq) { var c = fq.split(','); var rgb = function (h) { return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join(','); };
    if (c[0]) { root.style.setProperty('--bg', '#' + c[0]); root.style.setProperty('--bg-rgb', rgb(c[0])); }
    if (c[1]) { root.style.setProperty('--or', '#' + c[1]); root.style.setProperty('--or-rgb', rgb(c[1])); } }

  var stage = $('#stage'), fahrt = $('#fahrt');
  var W = 0, H = 0, MOB = false, PORT = false;

  /* ---------- Haltepunkte ---------- */
  var CH = { 0: 0, messen: .12, werte: .49, gutachten: .62, karriere: .845, bewertungen: .935, kontakt: .985 };

  /* ---------- Bildebenen: Sichtbarkeit [an-start, an-ende, aus-start, aus-ende], Kamera [p, fx, fy, zoom] ---------- */
  var HAS_V1 = !!VID.v1;
  var L = {
    p01: { vis: [-1, -1, HAS_V1 ? .07 : .10, HAS_V1 ? .08 : .14], cam: [[0, .5, .55, 1], [.14, .5, .55, 1.12]] },
    v1:  { vis: [.06, .07, .27, .31], cam: [[.06, .5, .55, 1], [.31, .5, .55, 1.08]], scrub: [.07, .30] },
    p04: { vis: [.28, .32, .41, .44], cam: [[.28, .5, .5, 1.35], [.33, .5, .5, 1.04], [.44, .5, .5, 1.12]] },
    p05: { vis: [.42, .45, .55, .58], cam: [[.42, .5, .55, 1.26], [.5, .45, .55, 1.12], [.58, .45, .55, 1.1]] },
    p06: { vis: [.56, .59, .68, .70], cam: [[.56, .5, .5, 1.12], [.70, .5, .5, 1]] },
    p07: { vis: [.69, .705, .79, .82], cam: [[.69, .5, .55, 1.3], [.82, .5, .55, 1]] },
    p08: { vis: [.80, .83, .89, .92], cam: [[.80, .6, .5, 1.1], [.92, .62, .5, 1]] },
    p05b: { src: 'p05', vis: [.90, .93, 2, 2], cam: [[.9, .5, .55, 1.1], [1, .5, .55, 1.25]] }
  };
  if (!HAS_V1) delete L.v1;

  var lys = {};
  $$('.ly').forEach(function (el) { lys[el.getAttribute('data-ly')] = el; });
  var p05b = lys.p05.cloneNode(true); p05b.setAttribute('data-ly', 'p05b'); lys.p08.parentNode.insertBefore(p05b, lys.p08.nextSibling); lys.p05b = p05b;

  function srcOf(n) { return 'assets/img/' + n + '.webp?v=' + (IMG._v || 1); }
  function nat(n) { var m = IMG[n]; return m ? [m.w, m.h] : [2560, 1440]; }
  $$('img[data-src]').forEach(function (im) { var n = im.getAttribute('data-src'); if (!IMG[n]) { im.style.display = 'none'; return; } im.decoding = 'async'; im.src = srcOf(n); });
  Object.keys(L).forEach(function (k) { if (k === 'v1') return; var im = lys[k] && $('img', lys[k]); if (!im || !IMG[im.getAttribute('data-src')]) { if (lys[k]) lys[k].style.display = 'none'; delete L[k]; } });

  /* Film (Scroll spult) */
  var film = null;
  if (HAS_V1) { var v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('playsinline', '');
    v.src = 'assets/vid/v1.mp4?v=' + (VID._v || 1); lys.v1.appendChild(v); film = { v: v, ok: false, w: VID.v1.w || 1284, h: VID.v1.h || 716 };
    v.addEventListener('loadeddata', function () { film.ok = true; }); v.load(); }

  function natOf(k) { if (k === 'v1') return [film.w, film.h]; var im = $('img', lys[k]); return nat(im ? im.getAttribute('data-src') : k); }
  function mediaOf(k) { return k === 'v1' ? film.v : $('img', lys[k]); }
  function target() { return MOB ? (PORT ? [.5, .34] : [.62, .5]) : [.5, .54]; }
  function camAt(k, p) {
    var c = L[k].cam, i = 0; if (p <= c[0][0]) return c[0].slice(1); if (p >= c[c.length - 1][0]) return c[c.length - 1].slice(1);
    while (i < c.length - 1 && p > c[i + 1][0]) i++;
    var a = c[i], b = c[i + 1], t = eio(seg(p, a[0], b[0]));
    return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), t))];
  }
  var CAMS = {};
  function place(k, p) {
    if (!L[k]) return;
    var n = natOf(k), iw = n[0], ih = n[1], s0 = MOB && PORT ? 1.7 * W / iw : Math.max(W / iw, H / ih), c = camAt(k, p), s = s0 * c[2];
    var t = target(), dw = iw * s, dh = ih * s, x = t[0] * W - c[0] * dw, y = t[1] * H - c[1] * dh;
    x = dw > W ? clamp(x, W - dw, 0) : (W - dw) / 2; y = dh > H ? clamp(y, H - dh, 0) : clamp(y, Math.min(0, H - dh), Math.max(0, H - dh));
    CAMS[k] = { x: x, y: y, s: s };
    var m = mediaOf(k); if (!m) return;
    m.style.width = iw + 'px'; m.style.height = ih + 'px';
    m.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(5) + ')';
  }
  function scr(k, fx, fy) { var c = CAMS[k], n = natOf(k); if (!c) return [-999, -999]; return [c.x + fx * n[0] * c.s, c.y + fy * n[1] * c.s]; }
  function visOf(k, p) { var v = L[k].vis; return Math.min(v[0] < 0 ? 1 : seg(p, v[0], v[1]), 1 - seg(p, v[2], v[3])); }

  /* ---------- Texte ---------- */
  var TX = { hero: [-1, 0, .045, .065], licht: [.10, .13, .26, .29], messen: [.32, .345, .40, .43], werte: [.455, .48, .54, .57], gutachten: [.59, .61, .665, .685], wie: [.72, .74, .78, .80], karriere: [.825, .845, .88, .90], bewertungen: [.915, .93, .955, .968], kontakt: [.968, .982, 2, 2] };
  var txs = {}; $$('.tx').forEach(function (el) { txs[el.getAttribute('data-tx')] = el; });
  function showTx(k, p) {
    var r = TX[k], el = txs[k], o = Math.min(r[0] < 0 ? 1 : seg(p, r[0], r[1]), 1 - seg(p, r[2], r[3]));
    el.style.opacity = o.toFixed(3); el.classList.toggle('vis', o > .02); el.inert = o < .5;
    el.style.translate = '0 ' + ((1 - eout(r[0] < 0 ? 1 : seg(p, r[0], r[1]))) * 28 - seg(p, r[2], r[3]) * 28).toFixed(1) + 'px';
  }
  function band(p, a, b, c, d) { return Math.min(seg(p, a, b), 1 - seg(p, c, d)); }

  /* ---------- Grafik ---------- */
  var wall = $('.wall'), screens = $('.screens'), strip = $('.strip'), paper = $('.paper'), phone = $('.phone'), flash = $('.flash'), prog = $('.prog'), hint = $('.hint');
  var calls = $('.calls'), CALL = [[.45, .42], [.72, .25]]; // Messwert-Schilder in p04: Fuge, Messgerät
  var SLOT = window.SP_SLOT || [.483, .172, .27];
  var PAN = [[.165, .19], [.83, .19]]; // Oberkante der beiden Tafeln in p05 (Bildanteile) // Druckerschlitz in p06: Mitte x, y, Breite (Bildanteile)
  function count(el, t) { var v = +el.getAttribute('data-count') * t, d = +(el.getAttribute('data-dec') || 0); el.textContent = v.toFixed(d).replace('.', ','); }
  var readsB = $$('.tx-messen .reads b'), stars = $('.stars'), scoreB = $('.score b'), gmeta = $('.g-meta b');
  var quotes = $$('.quotes blockquote'), qi = 0;
  setInterval(function () { qi = (qi + 1) % quotes.length; quotes.forEach(function (q, i) { q.classList.toggle('on', i === qi); }); }, 4200);
  var kKar = $('.tx-karriere .kin'), perks = $$('.perks li');
  function kin(el, p, a, step) { $$('span', el).forEach(function (s, i) { var t = eout(seg(p, a + i * step, a + i * step + .012)); s.style.opacity = t; s.style.transform = 'translateX(' + ((1 - t) * -6) + 'vw)'; }); }
  function stagger(list, p, a, step) { list.forEach(function (li, i) { var t = eout(seg(p, a + i * step, a + i * step + .01)); li.style.opacity = t; li.style.transform = 'translateY(' + ((1 - t) * 18) + 'px)'; }); }
  var navA = $$('.links a');

  /* ---------- Hauptschleife ---------- */
  var want = 0, cur = 0, t0 = performance.now(), lastP = -1;
  function readScroll() { var max = fahrt.offsetHeight - H; want = clamp((scrollY - fahrt.offsetTop) / max, 0, 1); }
  function frame(now) {
    cur += (want - cur) * (Math.abs(want - cur) > .2 ? .35 : .14);
    var intro = eout(Math.min(1, (now - t0) / 1800)) * .012 * (want < .02 ? 1 : 0); // kleine Eigenbewegung beim Laden
    var p = Math.max(cur, intro);
    if (Math.abs(p - lastP) > 1e-5) { render(p); lastP = p; }
    requestAnimationFrame(frame);
  }
  function render(p) {
    Object.keys(L).forEach(function (k) {
      var el = lys[k]; if (!el) return; var o = visOf(k, p);
      el.style.opacity = o.toFixed(3); el.style.visibility = o > .002 ? 'visible' : 'hidden';
      if (o > .002 || k === 'p01') place(k, p);
      if (L[k].scrub && film && film.ok && film.v.duration) { var t = seg(p, L[k].scrub[0], L[k].scrub[1]) * (film.v.duration - .05); if (Math.abs(film.v.currentTime - t) > .03) film.v.currentTime = t; }
    });
    Object.keys(TX).forEach(function (k) { showTx(k, p); });
    $('.shade').style.setProperty('--sh', (MOB ? 1 : 1 - .6 * band(p, -1, 0, .045, .07)).toFixed(3));
    wall.style.opacity = band(p, .13, .16, .26, .29).toFixed(3);
    $$('li', wall).forEach(function (li, i) { li.style.opacity = eout(seg(p, .14 + i * .02, .16 + i * .02)); });
    readsB.forEach(function (b, i) { count(b, eout(seg(p, .34 + i * .01, .37 + i * .01))); });
    screens.style.opacity = band(p, .455, .48, .55, .575).toFixed(3);
    if (!MOB && CAMS.p05) { var l = scr('p05', PAN[0][0], PAN[0][1]), r = scr('p05', PAN[1][0], PAN[1][1]); screens.style.setProperty('--lx', l[0] + 'px'); screens.style.setProperty('--rx', Math.min(r[0], W - 150) + 'px'); screens.style.setProperty('--ty', Math.max(80, l[1]) + 'px'); } screens.style.setProperty('--g', eout(seg(p, .47, .51)).toFixed(3));
    var so = band(p, .595, .61, .67, .69); strip.style.opacity = so.toFixed(3);
    if (so > .01 && CAMS.p06) { var a = scr('p06', SLOT[0] - SLOT[2] / 2, SLOT[1]), b = scr('p06', SLOT[0] + SLOT[2] / 2, SLOT[1]);
      strip.style.setProperty('--sx', a[0] + 'px'); strip.style.setProperty('--sy', a[1] + 'px'); strip.style.setProperty('--sw', (b[0] - a[0]) + 'px');
      paper.style.setProperty('--feedpx', (eio(seg(p, .6, .665)) * paper.offsetHeight).toFixed(1) + 'px'); paper.style.setProperty('--rot', (seg(p, .64, .68) * 3).toFixed(2) + 'deg'); }
    var co = band(p, .345, .365, .40, .425); calls.style.opacity = co.toFixed(3);
    if (co > .01 && CAMS.p04) { CALL.forEach(function (c, i) { var pt = scr('p04', c[0], c[1]), el = calls.children[i]; el.style.left = clamp(pt[0], 12, W - 190) + 'px'; el.style.top = clamp(pt[1], 80, H - 60) + 'px'; }); }
    flash.style.opacity = (Math.max(0, 1 - Math.abs(p - .698) / .014) * .85).toFixed(3);
    kin(kKar, p, .83, .012); stagger(perks, p, .845, .007);
    phone.style.opacity = band(p, .915, .935, 2, 2).toFixed(3);
    var g = eout(seg(p, .925, .945)); count(scoreB, g); count(gmeta, g); stars.style.setProperty('--f', eout(seg(p, .93, .95)).toFixed(3));
    prog.style.setProperty('--p', p.toFixed(4)); hint.style.opacity = (1 - seg(p, .005, .03)).toFixed(3);
    var act = null; Object.keys(CH).forEach(function (k) { if (k !== '0' && p >= CH[k] - .03) act = k; });
    navA.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-go') === act); });
    pinsTick(p);
  }

  function resize() { W = stage.clientWidth; H = stage.clientHeight; MOB = innerWidth < 900; PORT = H > W; readScroll(); lastP = -1; }
  addEventListener('resize', resize); addEventListener('scroll', readScroll, { passive: true });

  /* ---------- Schaden antippen (Panel 1) ---------- */
  var PINS = [{ fx: .645, fy: .6, txt: 'Delle Tür hinten rechts' }, { fx: .555, fy: .575, txt: 'Kratzer Kotflügel hinten' }, { fx: .505, fy: .71, txt: 'Stoßfänger eingedrückt' }], pc = -1, pinsEl = $('.pins'), pe = $('.pin-edit'), rp = $('.report'), rpList = $('.rp-list'), rpN = $('.rp-n'), rpEmpty = $('.rp-empty'), peText = $('.pe-text');
  function heroOn() { return lastP < .04; }
  function toImg(x, y) { var c = CAMS.p01, n = natOf('p01'); if (!c) return null; return [(x - c.x) / (n[0] * c.s), (y - c.y) / (n[1] * c.s)]; }
  function listHtml() { return PINS.map(function (pn, i) { return '<li><b>' + (i + 1) + '</b><span>' + (pn.txt || 'Kommentar fehlt') + '</span></li>'; }).join(''); }
  function drawPins() {
    pinsEl.innerHTML = '';
    PINS.forEach(function (pn, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'pin' + (i === pc ? ' on' : ''); b.textContent = i + 1; b.setAttribute('data-lb', pn.txt || ''); b.setAttribute('aria-label', 'Markierung ' + (i + 1) + ': ' + (pn.txt || 'ohne Kommentar'));
      b.addEventListener('click', function (e) { e.stopPropagation(); edit(i); }); pinsEl.appendChild(b); });
    rpN.textContent = PINS.length; rpEmpty.hidden = PINS.length > 0; rp.classList.toggle('has', PINS.length > 0); rpList.innerHTML = listHtml();
    pinsTick(lastP);
  }
  function edit(i) {
    pc = i; drawPins(); if (i < 0) { pe.hidden = true; return; }
    var pt = scr('p01', PINS[i].fx, PINS[i].fy), w = Math.min(300, W - 32);
    pe.style.left = clamp(pt[0] - w / 2, 16, W - w - 16) + 'px'; pe.style.top = clamp(pt[1] + 28, 70, H - 240) + 'px'; pe.style.width = w + 'px';
    peText.value = PINS[i].txt || ''; pe.hidden = false;
  }
  stage.addEventListener('click', function (e) {
    if (!heroOn() || e.target.closest('button,a,input,.pin-edit,.report,.tx,.nav')) return;
    var r = stage.getBoundingClientRect(), q = toImg(e.clientX - r.left, e.clientY - r.top);
    if (!q || q[0] < .15 || q[0] > .85 || q[1] < .25 || q[1] > .92) return;
    PINS.push({ fx: q[0], fy: q[1], txt: '' }); edit(PINS.length - 1);
  });
  $$('.pe-chips button').forEach(function (c) { c.addEventListener('click', function () { if (pc < 0) return; var rest = peText.value.replace(/^(Delle|Kratzer|Riss|Scheibe|Licht|Stoßfänger)(, )?/, ''); peText.value = c.textContent + (rest ? ', ' + rest : ''); PINS[pc].txt = peText.value; drawPins(); edit(pc); }); });
  peText.addEventListener('input', function () { if (pc >= 0) { PINS[pc].txt = peText.value; rpList.innerHTML = listHtml(); } });
  $('.pe-ok').addEventListener('click', function () { edit(-1); });
  $('.pe-del').addEventListener('click', function () { if (pc >= 0) PINS.splice(pc, 1); edit(-1); });
  drawPins();
  function pinsTick(p) {
    var o = p < .04; pinsEl.style.opacity = o ? 1 : 0; pinsEl.style.pointerEvents = o ? '' : 'none';
    rp.style.opacity = (1 - seg(p, .02, .045)).toFixed(3); rp.style.visibility = p < .045 ? 'visible' : 'hidden';
    if (!o && !pe.hidden) edit(-1);
    PINS.forEach(function (pn, i) { var b = pinsEl.children[i]; if (!b) return; var pt = scr('p01', pn.fx, pn.fy); b.style.left = pt[0] + 'px'; b.style.top = pt[1] + 'px'; });
  }

  /* ---------- 130-%-Check (Panel 5) ---------- */
  var T130 = { 60: 'Reparatur lohnt sich. Dazu kommen Wertminderung und Nutzungsausfall.', 115: '130-%-Regel: Reparieren erlaubt, wenn fachgerecht nach Gutachten repariert wird und Sie das Auto weiter nutzen. Der Gegner zahlt.', 145: 'Wirtschaftlicher Totalschaden: Sie bekommen Wiederbeschaffungswert minus Restwert, den Restwert belegen wir mit echten Angeboten.' };
  var gv = $('.g-v'), gf = $('.scr-r'); gf.style.setProperty('--gv', 72); gv.textContent = '72 %'; // Reparaturkosten 62 / WBW 86
  $$('.t130 button').forEach(function (b) { b.addEventListener('click', function () { var r = +b.getAttribute('data-r'); $$('.t130 button').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); $('.t130-out').textContent = T130[r]; gf.style.setProperty('--gv', r); gv.textContent = r + ' %'; }); });

  /* ---------- Start, Rücksprung, Navigation ---------- */
  resize();
  var qp = parseFloat(new URLSearchParams(location.search).get('p'));
  if (qp > 0 && qp <= 1) { scrollTo(0, fahrt.offsetTop + qp * (fahrt.offsetHeight - H)); readScroll(); cur = want; t0 = -1e5; }
  requestAnimationFrame(frame);
  $$('[data-go]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var p = CH[a.getAttribute('data-go')] || 0; root.classList.remove('menu-open'); $('.burger').setAttribute('aria-expanded', false); scrollTo({ top: fahrt.offsetTop + p * (fahrt.offsetHeight - H), behavior: 'smooth' }); }); });
  $('.burger').addEventListener('click', function () { var o = root.classList.toggle('menu-open'); this.setAttribute('aria-expanded', o); });

  var toastT; function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }
  $$('[data-demo]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast(a.getAttribute('data-demo')); }); });

  /* ---------- Schaden melden: abschicken, danach anrufen ---------- */
  var dm = $('#m-melden'), HINT = { gegner: 'Gut zu wissen: Sie wählen den Gutachter, die gegnerische Versicherung zahlt.', teil: 'Wir klären mit Ihnen, wer zahlt, bevor Kosten entstehen.', ich: 'Auch für Kasko-Schäden erstellen wir Gutachten.' };
  function hintU() { var v = ($('input[name=s]:checked', dm) || {}).value; $('[data-hint]', dm).textContent = HINT[v] || ''; }
  function fillPins() { $('.mm-pins', dm).innerHTML = PINS.length ? '<p class="small">Ihre Markierungen</p><ol>' + PINS.map(function (pn) { return '<li>' + (pn.txt || 'Kommentar fehlt') + '</li>'; }).join('') + '</ol>' : ''; }
  $$('input[name=s]', dm).forEach(function (r) { r.addEventListener('change', hintU); });
  $$('[data-open="melden"]').forEach(function (b) { b.addEventListener('click', function () { fillPins(); dm.showModal(); hintU(); }); });
  $('.shot input', dm).addEventListener('change', function () { var box = $('.thumbs', dm); box.innerHTML = ''; Array.prototype.slice.call(this.files, 0, 8).forEach(function (f) { var i = new Image(); i.alt = 'Ihr Foto'; i.src = URL.createObjectURL(f); box.appendChild(i); }); });
  var mf = $('form', dm), done = $('.done', dm);
  mf.addEventListener('submit', function (e) { if (e.submitter && e.submitter.value === 'x') return; e.preventDefault(); mf.hidden = true; done.hidden = false; });
  $('.mm-close', dm).addEventListener('click', function () { dm.close(); });
  dm.addEventListener('close', function () { mf.hidden = false; done.hidden = true; });

  /* ---------- 60-Sekunden-Bewerbung ---------- */
  var db = $('#m-bewerben'), qs = $$('.q', db), secs = 60, tmr = null;
  function go(i) { qs.forEach(function (q, k) { q.classList.toggle('on', k === i); }); if (i >= 3) { clearInterval(tmr); tmr = null; } }
  $$('[data-open="bewerben"]').forEach(function (b) { b.addEventListener('click', function () { secs = 60; $('[data-sec]', db).textContent = 60; go(0); db.showModal(); }); });
  qs.forEach(function (q, i) { $$('.opts button, .send', q).forEach(function (b) { b.addEventListener('click', function () { if (!tmr) tmr = setInterval(function () { secs = Math.max(0, secs - 1); $('[data-sec]', db).textContent = secs; }, 1000); go(i + 1); }); }); });
  db.addEventListener('close', function () { clearInterval(tmr); tmr = null; });
})();
