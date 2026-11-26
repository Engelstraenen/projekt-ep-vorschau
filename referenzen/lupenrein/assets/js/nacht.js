/* LUPENREIN · Einstieg „Schwarz mit Lichtschlitzen“ (Storyboard S2, Eugen 25.11.2026).
   Eine durchgehende Fahrt: Ring dreht sich im Lichtschlitz (Film 1) → Kamera fährt in den Diamanten (Film 2)
   → Facetten-Licht wird zum Lichtstreifen auf der Hand → Kamera zieht zurück, der Ring steht in einer Reihe von drei
   → Auswahl → Fahrt an den gewählten Ring (Detail) → in die Krappe → der Lichtstreifen öffnet die Lounge
   → durch die beleuchtete Vitrine hinten in die helle Galerie. Fotos = Storyboard-Panels als eigene 4K-Bilder. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = t => t * t * (3 - 2 * t);
const IMG = window.IMG || {};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mob = () => innerWidth < 900 || innerHeight > innerWidth;
const sec = $('#nacht'); if (!sec) return;
const src = (id) => { const x = IMG[id]; return x ? 'assets/img/' + id + (mob() && x.m ? '-m' : '') + '.webp?v=' + (x.v || 1) : ''; };

/* Bilder */
$$('img[data-n]', sec).forEach(im => { const id = im.dataset.n; if (IMG[id]) { im.decoding = 'async'; im.src = src(id); } else im.classList.add('miss'); });

/* Filme (Scroll spult). Fehlt ein Film, übernimmt das Standbild. */
const V = $$('video[data-v]', sec);
const VID = window.VID || {};
V.forEach(v => { v.muted = true; v.playsInline = true; v.preload = 'auto'; const id = v.dataset.v, x = VID[id]; if (!x) return;
  v.src = 'assets/vid/' + id + (mob() ? '-m' : '') + '.mp4?v=' + x.v; v.load(); v.addEventListener('loadeddata', () => v.classList.add('ok'), { once: true }); });

/* Punkte in Bild-Anteilen (u, v): wohin die Kamera fährt (gemessen an den Fotos LRD*) */
const PT = {
  LRD4ring: [.708, .436],                       // Ring am Finger
  LRD5: { solitaer: [.238, .505], halo: [.515, .505], klassisch: [.78, .52] },
  claw: { LRD6: [.408, .252], LRD6A: [.397, .54], LRD6B: [.40, .33] }, // obere Krappe je Detailbild
  streak: [[0, .86], [.45, .37]],             // Lichtstreifen in LRD7
  LRD8vit: [.595, .16],                        // beleuchtete Vitrine hinten in der Lounge
};
// Bild-Anteil → Bildschirm (object-fit cover/contain + object-position), ohne laufende Transformation
function pt(im, uv) {
  const W = innerWidth, H = innerHeight, iw = im.naturalWidth || 16, ih = im.naturalHeight || 9;
  const cs = getComputedStyle(im), fit = cs.objectFit, s = fit === 'contain' ? Math.min(W / iw, H / ih) : Math.max(W / iw, H / ih);
  const dw = iw * s, dh = ih * s, op = cs.objectPosition.split(' ');
  const fx = isNaN(parseFloat(op[0])) ? .5 : parseFloat(op[0]) / 100, fy = isNaN(parseFloat(op[1])) ? .5 : parseFloat(op[1]) / 100;
  return { x: (W - dw) * fx + uv[0] * dw, y: (H - dh) * fy + uv[1] * dh };
}

/* Ringwahl */
const RINGS = {
  klassisch: { id: 'LRD6', k: 'Klassisch', h: 'Klassisch <em>neu gedacht.</em>', d: 'Diamant im Smaragdschliff, gehalten von vier Doppelkrappen aus 18 kt Weißgold.', rows: [['Diamant', '3,02 ct'], ['Schliff', 'Smaragd'], ['Farbe · Reinheit', 'E · VVS1'], ['Metall', '18 kt Weißgold']] },
  solitaer: { id: 'LRD6A', k: 'Solitär', h: 'Der Brillant. <em>Für immer.</em>', d: 'Ein runder Brillant in sechs schlanken Krappen aus Platin 950.', rows: [['Diamant', '1,50 ct'], ['Schliff', 'Brillant'], ['Farbe · Reinheit', 'F · VS1'], ['Metall', 'Platin 950']] },
  halo: { id: 'LRD6B', k: 'Halo', h: 'Mehr Licht <em>rundherum.</em>', d: 'Ein ovaler Diamant im Kranz aus Pavé-Diamanten, gefasst in 18 kt Roségold.', rows: [['Diamant', '1,20 ct'], ['Pavé', '0,30 ct'], ['Farbe · Reinheit', 'G · VS1'], ['Metall', '18 kt Roségold']] },
};
let pick = 'klassisch';
const LW = { solitaer: 1, halo: 1, klassisch: 1 };
const det = $('#nDet'), detImg = $('#nDetImg');
function choose(k, jump) {
  pick = k; const r = RINGS[k];
  $$('.n-pick button', sec).forEach(b => b.setAttribute('aria-pressed', b.dataset.r === k));
  if (IMG[r.id]) { detImg.src = src(r.id); detImg.style.visibility = 'visible'; } else detImg.style.visibility = 'hidden';
  $('#nDetK').textContent = r.k; $('#nDetH').innerHTML = r.h; $('#nDetD').textContent = r.d;
  $('#nDetRows').innerHTML = r.rows.map(([a, b]) => '<div><dt>' + a + '</dt><dd>' + b + '</dd></div>').join('');
  $('#nDetRes').dataset.reserve = 'Verlobungsring ' + r.k;
  if (jump) { const y = sec.offsetTop + (sec.offsetHeight - innerHeight) * (SEG.det[0] + .01); scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' }); }
}
$$('.n-pick button', sec).forEach(b => b.addEventListener('click', () => choose(b.dataset.r, true)));
choose('klassisch');

/* Zeitplan (Anteil am Scrollweg des Abschnitts) */
const SEG = {
  f1: [0, .15],      // Film 1: Ring dreht sich im Lichtschlitz
  f2: [.15, .29],    // Film 2: Fahrt in den Diamanten
  hand: [.29, .43],  // Facetten → Hand
  drei: [.43, .57],  // zurück: drei Ringe
  det: [.57, .71],   // Fahrt an den gewählten Ring
  claw: [.71, .81],  // in die Krappe
  lounge: [.81, .95],// Lichtstreifen öffnet die Lounge
  out: [.95, 1],     // durch die Vitrine in die helle Galerie
};
const L = Object.fromEntries($$('[data-l]', sec).map(e => [e.dataset.l, e]));
const T = $$('[data-t]', sec), PB = $$('.n-pick button', sec);
const seg = (p, k) => clamp((p - SEG[k][0]) / (SEG[k][1] - SEG[k][0]));
const show = (el, o, tf) => { if (!el) return; el.style.opacity = o.toFixed(3); el.style.visibility = o > .002 ? 'visible' : 'hidden'; if (tf != null) el.style.transform = tf; };
const zoomAt = (el, P, s) => { el.style.transformOrigin = P.x.toFixed(1) + 'px ' + P.y.toFixed(1) + 'px'; return 'scale(' + s.toFixed(4) + ')'; };
const scrub = (v, q) => { if (v && v.classList.contains('ok') && v.duration) { const t = q * (v.duration - .05); if (Math.abs(v.currentTime - t) > .02) v.currentTime = t; return true; } return false; };

let auto = RM ? 1 : 0; // Film läuft beim Laden kurz von selbst an (Regel: Aktion ab der ersten Sekunde)
const t0 = performance.now();
function frame(now) {
  const H = innerHeight, top = sec.offsetTop, len = Math.max(1, sec.offsetHeight - H);
  const p = clamp((scrollY - top) / len);
  if (!RM && auto < 1) auto = clamp((now - t0) / 2200);
  document.body.classList.toggle('dark', scrollY < top + len + H * .02 && p < .985);

  // 1 · Film 1
  const a = seg(p, 'f1'), aq = Math.max(a, auto * .12);
  const v1 = $('video[data-v="LRVR1"]', sec), v2 = $('video[data-v="LRVR2"]', sec);
  const has1 = scrub(v1, aq);
  // Film-Ring auf dem Laptop etwas nach rechts, damit links Platz für die Schrift bleibt (wie im Storyboard)
  const B1 = mob() ? '' : 'translateX(12%) ';
  if (has1 && p < SEG.f2[0]) { show(L.v1, 1, B1 + 'scale(1)'); L.v1.style.filter = 'none'; }
  // ohne Film: Panel 1 → Panel 2 (Ring dreht weiter), ruhige Fahrt
  const noF1 = !has1 && p < SEG.f2[0] + .01;
  show(L.d1, noF1 ? 1 - smooth(clamp((aq - .45) / .4)) : 0, zoomAt(L.d1, { x: innerWidth * .6, y: H * .4 }, 1 + aq * .06));
  show(L.d2, noF1 ? smooth(clamp((aq - .45) / .4)) : 0, zoomAt(L.d2, { x: innerWidth * .6, y: H * .4 }, 1.04 + aq * .04));

  // 2 · Film 2: in den Diamanten. Solange Film 2 fehlt: das letzte Bild von Film 1 fährt auf den Diamanten zu,
  //     wird hell (Lichtschnitt) und aus dem Licht kommt das Facettenbild. Nie zwei Bilder übereinander.
  const b = seg(p, 'f2'), inB = p >= SEG.f2[0] && p < SEG.hand[0] + .08;
  const has2 = scrub(v2, b);
  show(L.v2, has2 && inB ? 1 : 0, mob() ? 'none' : 'translateX(' + (12 * (1 - ease(clamp(b / .5)))).toFixed(2) + '%)');
  if (has2 && p >= SEG.f2[0]) show(L.v1, 0);
  if (!has2 && inB) {
    const kb = clamp(b / .55), first = kb < 1;
    const src1 = has1 ? L.v1 : L.d2;
    if (has1) { L.v1.style.transformOrigin = '50% 42%'; show(L.v1, first ? 1 : 0, B1 + 'scale(' + (1 + ease(kb) * .25).toFixed(4) + ')'); L.v1.style.filter = first ? 'brightness(' + (1 + Math.pow(kb, 3) * 3).toFixed(2) + ')' : 'none'; }
    else show(L.d2, first ? 1 : 0, zoomAt(L.d2, { x: innerWidth * .62, y: H * .36 }, 1.08 + ease(kb) * .17));
    L.flash.style.opacity = (Math.pow(Math.sin(Math.PI * clamp((b - .35) / .4)), 2) * .95).toFixed(3);
    const k2 = clamp((b - .55) / .45);
    show(L.d3, first ? 0 : 1, 'scale(' + (1.18 - .18 * ease(k2)).toFixed(4) + ')');
    L.d3.style.filter = !first && k2 < 1 ? 'brightness(' + (1 + (1 - k2) * 3).toFixed(2) + ')' : 'none';
  } else if (!(p >= SEG.hand[0])) { show(L.d3, 0); if (p < SEG.f2[0]) L.flash.style.opacity = 0; }
  if (has1 && p >= SEG.hand[0]) show(L.v1, 0);

  // 3 · Lichtschnitt: die Kamera fährt in die hellste Facette, das Licht füllt kurz das Bild,
  //     aus dem Licht taucht die Hand im Lichtstreifen auf (nie zwei Bilder gleichzeitig sichtbar)
  const c = seg(p, 'hand'), k3 = clamp(c / .3);
  if (p >= SEG.hand[0] && p < SEG.drei[0] + .02) {
    const out = k3 < .5, el3 = has2 ? L.v2 : L.d3;
    show(el3, out ? 1 : 0, 'scale(' + (1 + k3 * .2).toFixed(4) + ')');
    el3.style.filter = out ? 'brightness(' + (1 + k3 * 3).toFixed(2) + ')' : 'none';
    L.flash.style.opacity = (Math.pow(Math.sin(Math.PI * k3), 2) * .97).toFixed(3);
    const P = pt(L.d4, PT.LRD4ring);
    show(L.d4, out ? 0 : 1, zoomAt(L.d4, P, 1.12 - .08 * ease(clamp((c - .15) / .5)) + .03 * clamp((c - .65) / .35)));
    L.d4.style.filter = !out && k3 < 1 ? 'brightness(' + (1 + (1 - k3) * 4).toFixed(2) + ')' : 'none';
  } else { if (p >= SEG.drei[0]) { L.flash.style.opacity = 0; L.d3.style.filter = L.v2.style.filter = 'none'; } if (p < SEG.hand[0] || p >= SEG.drei[0] + .02) show(L.d4, 0); }

  // 4 · die Hand versinkt im Dunkel (Kamera fährt an den Ring), dann gehen nacheinander drei Lichtsäulen an:
  //     zuerst die rechte (derselbe Smaragdschliff-Ring), dann links, dann Mitte. Kein Überblenden zweier Bilder.
  const d = seg(p, 'drei');
  if (p >= SEG.drei[0] && p < SEG.det[0] + .02) {
    const dark = smooth(clamp(d / .22));
    const P4 = pt(L.d4, PT.LRD4ring); show(L.d4, 1 - dark, zoomAt(L.d4, P4, 1.08 + dark * .17));
    const on = k => smooth(clamp((d - .22 - k * .1) / .16));   // Säule k geht an
    const order = { klassisch: 0, solitaer: 1, halo: 2 }, keys = ['solitaer', 'halo', 'klassisch'];
    const bands = keys.map(k => ({ x: pt(L.d5, PT.LRD5[k]).x / innerWidth, w: on(order[k]) }));
    keys.forEach((k, i) => LW[k] = bands[i].w);
    const all = bands.every(b => b.w > .999);
    if (all) { L.d5.style.webkitMaskImage = L.d5.style.maskImage = 'none'; }
    else {
      const g = 'linear-gradient(90deg,transparent,#000 35%,#000 65%,transparent)';
      const m = bands.map(() => g).join(',');
      const sz = bands.map(b => (b.w * 34).toFixed(2) + '% ' + (40 + b.w * 60).toFixed(1) + '%').join(',');
      const ps = bands.map(b => { const W = b.w * 34; return (W >= 100 ? 0 : ((b.x * 100 - W / 2) / (100 - W) * 100)).toFixed(2) + '% 0%'; }).join(',');
      Object.assign(L.d5.style, { webkitMaskImage: m, maskImage: m, webkitMaskSize: sz, maskSize: sz, webkitMaskPosition: ps, maskPosition: ps, webkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' });
    }
    show(L.d5, d > .22 ? 1 : 0, 'scale(' + (1.04 - .04 * ease(clamp((d - .22) / .7))).toFixed(4) + ')');
    L.d5.style.transformOrigin = '50% 50%';
  } else if (!(p >= SEG.det[0] && p < SEG.claw[0])) show(L.d5, 0);
  if (p >= SEG.claw[0]) L.d5.style.webkitMaskImage = L.d5.style.maskImage = 'none';

  // 5 · Fahrt an den gewählten Ring: die anderen Lichtsäulen gehen aus, die Kamera fährt an den Ring,
  //     das Bild versinkt kurz im Schwarz, der Ring taucht groß im Detail auf (Schnitt durchs Dunkel)
  const e = seg(p, 'det');
  const dim = (el, v) => { el.style.filter = v < .999 ? 'brightness(' + v.toFixed(3) + ')' : 'none'; };
  if (p >= SEG.det[0] && p < SEG.claw[0] + .02) {
    const k1 = clamp(e / .4), first = k1 < 1;
    const P5 = pt(L.d5, PT.LRD5[pick]);
    show(L.d5, first ? 1 : 0, zoomAt(L.d5, P5, 1 + ease(k1) * .25));
    dim(L.d5, 1 - smooth(clamp((k1 - .55) / .45)));
    // nur die Säule des gewählten Rings bleibt an
    const offO = smooth(clamp(k1 / .5)), g = 'linear-gradient(90deg,transparent,#000 35%,#000 65%,transparent)';
    if (first) { const x = P5.x / innerWidth, W = 34 + (1 - offO) * 66, pos = (W >= 100 ? 0 : (x * 100 - W / 2) / (100 - W) * 100).toFixed(2) + '% 0%';
      Object.assign(L.d5.style, { webkitMaskImage: offO > .001 ? g : 'none', maskImage: offO > .001 ? g : 'none', webkitMaskSize: W + '% 100%', maskSize: W + '% 100%', webkitMaskPosition: pos, maskPosition: pos, webkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }); }
    const k2 = clamp((e - .4) / .3);
    show(det, first ? 0 : 1, 'scale(' + (1.08 - .08 * ease(k2)).toFixed(4) + ')'); det.style.transformOrigin = '40% 45%';
    dim(det, smooth(k2));
  } else { if (!(p >= SEG.claw[0] && p < SEG.lounge[0] + .02)) show(det, 0); dim(L.d5, 1); }

  // 6 · in die Krappe: Kamera fährt auf die obere Krappe, Schnitt durchs Dunkel, Makro mit Lichtstreifen
  const f = seg(p, 'claw');
  if (p >= SEG.claw[0] && p < SEG.lounge[0] + .02) {
    const k1 = clamp(f / .4), first = k1 < 1;
    const Pc = pt(detImg, PT.claw[RINGS[pick].id]);
    show(det, first ? 1 : 0, zoomAt(det, Pc, 1 + ease(k1) * .25));
    dim(det, 1 - smooth(clamp((k1 - .5) / .5)));
    const k2 = clamp((f - .4) / .4);
    show(L.d7, first ? 0 : 1, 'scale(' + (1.1 - .1 * ease(k2)).toFixed(4) + ')');
    dim(L.d7, smooth(k2));
  } else { if (!(p >= SEG.lounge[0] && p < SEG.out[0])) show(L.d7, 0); if (p >= SEG.lounge[0]) dim(L.d7, 1); if (p < SEG.claw[0]) {} }

  // 7 · der Lichtstreifen der Krappe öffnet sich zur Lounge (Maske aus dem Streifen)
  const g = seg(p, 'lounge');
  if (p >= SEG.lounge[0] && p <= 1) {
    const w = ease(clamp(g / .45));
    show(L.d7, 1 - clamp((w - .85) / .15), 'scale(' + (1 + w * .06).toFixed(4) + ')');
    // Lichtstreifen in LRD7: von (0, .86) nach (.45, .37) im Bild → auf den Bildschirm umgerechnet und verlängert
    const A = pt(L.d7, PT.streak[0]), Bq = pt(L.d7, PT.streak[1]), Wd = innerWidth, m = (Bq.y - A.y) / (Bq.x - A.x || 1);
    const y0 = (A.y - m * A.x) / H * 100, y1 = (A.y + m * (Wd - A.x)) / H * 100, half = .6 + w * w * 160;
    L.d8w.style.clipPath = w >= .999 ? 'none' : 'polygon(0% ' + (y0 - half).toFixed(2) + '%,100% ' + (y1 - half).toFixed(2) + '%,100% ' + (y1 + half).toFixed(2) + '%,0% ' + (y0 + half).toFixed(2) + '%)';
    show(L.d8w, w > .001 ? 1 : 0);
    // 8 · hinaus: Kamera fährt in die beleuchtete Vitrine hinten, ihr Licht wird hell (Lichtschnitt in Galerie-Weiß),
    //     dann ist man in der hellen Galerie („Treten Sie ein.“)
    const o = seg(p, 'out');
    const Pv = pt(L.d8, PT.LRD8vit);
    L.d8w.style.transformOrigin = Pv.x + 'px ' + Pv.y + 'px';
    L.d8w.style.transform = 'scale(' + (1 + .04 * clamp(g) + ease(clamp(o / .6)) * .25).toFixed(4) + ')';
    L.d8w.style.filter = o > 0 ? 'brightness(' + (1 + Math.pow(clamp(o / .6), 2) * .6).toFixed(2) + ')' : 'none';
    if (p > SEG.out[0]) L.d8w.style.opacity = o < .6 ? 1 : 0;
  } else { show(L.d8w, 0); L.d8w.style.filter = 'none'; }
  const oo = seg(p, 'out');
  if (p > SEG.out[0]) {
    L.flash.style.background = '#05060c'; // Eugen 26.11.: kein Weiß mehr, Abblende ins Dunkel der Galerie
    L.flash.style.opacity = (smooth(clamp((oo - .2) / .4)) * (1 - smooth(clamp((oo - .65) / .35)))).toFixed(3);
    L.stage.style.background = oo < .6 ? '#05060c' : 'transparent';
  } else { L.flash.style.background = ''; L.stage.style.background = '#05060c'; }

  // Wahl-Knöpfe genau unter den drei Ringen
  if (p > .45 && p < .6) PB.forEach(b => { const q = pt(L.d5, PT.LRD5[b.dataset.r]); b.style.left = q.x.toFixed(1) + 'px'; b.style.opacity = p < SEG.det[0] ? LW[b.dataset.r].toFixed(3) : 1; });
  // Texte: data-t="von bis" (Anteile), weich ein und aus
  T.forEach(el => { const [x0, x1] = el.dataset.t.split(' ').map(Number); const k = x0 === 0 ? Math.max(clamp((p - x0) / .02), 1) * (1 - clamp((p - x1) / .02)) : clamp((p - x0) / .025) * (1 - clamp((p - x1) / .025));
    el.style.opacity = k.toFixed(3); el.style.visibility = k > .01 ? 'visible' : 'hidden'; el.style.transform = 'translateY(' + ((1 - k) * 18).toFixed(1) + 'px)'; });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
$$('[data-njump]', sec).forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); const k = +a.dataset.njump; scrollTo({ top: sec.offsetTop + (sec.offsetHeight - innerHeight) * k, behavior: RM ? 'auto' : 'smooth' }); }));
})();

/* Unterseiten: Die Lupe öffnet die Seite (Kreis wächst vom Klickpunkt), Rückweg an dieselbe Stelle */
(() => {
  const RMm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = location.search;
  document.querySelectorAll('[data-sub]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); try { sessionStorage.setItem('lr_y', String(scrollY)); } catch (er) {}
    const href = a.getAttribute('href') + q, r = a.getBoundingClientRect(), x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
    if (RMm) { location.href = href; return; }
    const o = document.createElement('div'); o.className = 'lupe-go'; o.style.setProperty('--x', x + 'px'); o.style.setProperty('--y', y + 'px'); document.body.appendChild(o);
    requestAnimationFrame(() => o.classList.add('on')); setTimeout(() => location.href = href, 650);
  }));
  if (location.hash === '#zurueck') { let y = null; try { y = sessionStorage.getItem('lr_y'); } catch (er) {}
    history.replaceState(null, '', location.pathname + location.search);
    if (y) { document.documentElement.style.scrollBehavior = 'auto'; const go = () => scrollTo(0, +y); go(); addEventListener('load', go); setTimeout(() => { go(); document.documentElement.style.scrollBehavior = ''; }, 300); } }
})();
