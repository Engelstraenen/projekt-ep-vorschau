/* LUPENREIN · Unterseite Diamanten (Storyboard LRQ3 „Am Tresen, Schritt für Schritt“, Eugen 25.11.2026).
   1 Briefchen → 2 Pinzette → 3 Lupe (Kreis wächst aus dem Stein) · Reinheit · 4 Farbe D–K · 5 Größe am Finger
   6 Ihr Diamant (4 Regler sammeln alle Schritte) · 7 Fassung · 8 Termin am Tresen · 9 Lupe zum Ziehen, zurück */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = t => t * t * (3 - 2 * t);
const IMG = window.IMG || {};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mob = () => innerWidth < 900;
const src = id => { const x = IMG[id]; return x ? 'assets/img/' + id + (mob() && x.m ? '-m' : '') + '.webp?v=' + (x.v || 1) : ''; };
const de = (n, d = 2) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

/* Messpunkte in den Fotos (Anteil der Bildbreite/-höhe) */
const P = {
  LRT1: { x: .719, y: .56 },           // Stein im Briefchen (gemessen)
  LRT2: { x: .63, y: .467 },           // Stein in der Pinzette (gemessen)
  LRT3: { x: .722, y: .50, d: .617 },  // Stein unter der Lupe (gemessen, sjinn 4K), d = Durchmesser in Bildhöhe
  LRT4: { y: .536, xs: [.391, .461, .536, .606, .678, .747, .819, .891] }, // 8 Vergleichssteine D–K (gemessen, sjinn 4K)
  LRT6: { x: .691, y: .483, d: .535 },  // Stein von oben (gemessen), d = Durchmesser in Bildhöhe
  LRT5: { x: .823, y: .56, fw: .039 },  // LRT5H: Ringposition auf dem Ringfinger (unteres Glied vor dem Knöchel), fw = Fingerbreite in Bildbreite (≈ 17 mm)
  LRT7: { x: .6875, y: .522 }          // Stein im Solitär (gemessen, sjinn 4K)
};

/* Firmenname per ?firma= */
const firma = new URLSearchParams(location.search).get('firma');
if (firma) $$('[data-brand]').forEach(e => e.textContent = firma.slice(0, 40).toUpperCase());

/* Bilder (fehlt ein neues Foto, steht ein passendes vorhandenes da, nie Schwarz) */
$$('img[data-n]').forEach(im => { let id = im.dataset.n; if (!IMG[id] && im.dataset.f && IMG[im.dataset.f]) { id = im.dataset.f; im.dataset.fb = 1; }
  if (IMG[id]) { im.decoding = 'async'; im.src = src(id); im.dataset.id = id; } else im.classList.add('miss'); });
const pt = (im, key) => (im && im.dataset.fb ? { x: .55, y: .5, d: .4 } : P[key]);

/* Zurück zur Galerie an dieselbe Stelle */
$$('[data-back]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault(); const to = a.dataset.back; const q = firma ? '?firma=' + encodeURIComponent(firma) : '';
  document.body.classList.add('leave'); setTimeout(() => location.href = 'index.html' + q + (to ? '#' + to : '#zurueck'), RM ? 0 : 450);
}));

/* Menü */
const menu = $('#menu'), burger = $('#burger');
burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
$$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

/* object-fit: cover → Bildpunkt auf dem Bildschirm (relativ zum Element) */
function cov(im) { const bw = im.offsetWidth || innerWidth, bh = im.offsetHeight || innerHeight, iw = im.naturalWidth || 16, ih = im.naturalHeight || 9;
  const s = Math.max(bw / iw, bh / ih), dw = iw * s, dh = ih * s; const op = getComputedStyle(im).objectPosition.split(' ');
  const fx = parseFloat(op[0]) / 100, fy = parseFloat(op[1] || '50%') / 100;
  return { dw, dh, ox: (bw - dw) * (isNaN(fx) ? .5 : fx), oy: (bh - dh) * (isNaN(fy) ? .5 : fy), bw, bh }; }
const at = (im, p) => { const c = cov(im); return { x: c.ox + p.x * c.dw, y: c.oy + p.y * c.dh, c }; };
// Hochkant: Bildausschnitt so legen, dass der Stein im Bild bleibt
function focus(im, key) { const p = pt(im, key); if (p && p.x != null) im.style.objectPosition = (mob() ? clamp((p.x - .5) * 1.6 + .5) * 100 : 50).toFixed(1) + '% 50%'; }

/* Zustand: jeder Schritt am Tresen stellt Ihren Diamanten mit ein */
const CUT = ['Exzellent', 'Sehr gut', 'Gut', 'Mittel', 'Gering'];
const COL = 'DEFGHIJKLM'.split('');
const CLA = [['FL', 'Lupenrein', 'Auch bei 10-facher Vergrößerung keine Einschlüsse und keine Merkmale an der Oberfläche. Sehr selten.'],
  ['IF', 'Innen lupenrein', 'Innen ohne Einschlüsse, nur winzige Merkmale an der Oberfläche.'],
  ['VVS1', 'Sehr, sehr kleine Einschlüsse', 'Selbst für geübte Augen unter der Lupe äußerst schwer zu finden.'],
  ['VVS2', 'Sehr, sehr kleine Einschlüsse', 'Unter der Lupe sehr schwer zu finden.'],
  ['VS1', 'Sehr kleine Einschlüsse', 'Unter der Lupe schwer zu sehen, mit bloßem Auge unsichtbar.'],
  ['VS2', 'Sehr kleine Einschlüsse', 'Unter der Lupe zu finden, mit bloßem Auge unsichtbar.'],
  ['SI1', 'Kleine Einschlüsse', 'Unter der Lupe leicht zu sehen, mit bloßem Auge meist nicht.'],
  ['SI2', 'Kleine Einschlüsse', 'Unter der Lupe leicht zu sehen, mit bloßem Auge teils erkennbar.'],
  ['I1', 'Einschlüsse', 'Mit bloßem Auge sichtbar.'],
  ['I2', 'Deutliche Einschlüsse', 'Mit bloßem Auge gut sichtbar, das Funkeln leidet.'],
  ['I3', 'Starke Einschlüsse', 'Deutlich sichtbar, Brillanz und Haltbarkeit können leiden.']];
const CT = [[.25, 4.1], [.5, 5.1], [.75, 5.8], [1, 6.5], [1.5, 7.4], [2, 8.2], [3, 9.3]];
const COLTXT = i => i <= 2 ? 'farblos' : i <= 6 ? 'nahezu farblos' : 'schwach getönt';
const S = { cut: 0, col: 1, cla: 4, ct: 3 };

/* Einschlüsse (viewBox 0–100, Stein = Kreis r 50): erscheinen ab ihrem Reinheitsgrad */
function crystal(cx, cy, r, seed) { let p = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + seed, rr = r * (.7 + .3 * Math.abs(Math.sin(seed * 7 + i * 1.9))); p.push((cx + Math.cos(a) * rr).toFixed(2) + ',' + (cy + Math.sin(a) * rr * .8).toFixed(2)); } return `<polygon class="c" points="${p.join(' ')}"/>`; }
const INC = [
  [2, `<circle class="p" cx="62" cy="38" r=".7"/>`],
  [3, `<circle class="p" cx="40" cy="61" r=".8"/><circle class="p" cx="41.6" cy="62.2" r=".5"/>`],
  [4, crystal(56, 55, 1.4, 1)],
  [5, crystal(33, 43, 1.8, 2) + `<circle class="p" cx="66" cy="66" r=".9"/>`],
  [6, crystal(61, 30, 2.6, 3) + `<path class="f" d="M70 50 q3 4 2 9"/>`],
  [7, crystal(45, 71, 3, 4) + [0, 1, 2, 3, 4].map(i => `<circle class="p" cx="${28 + i * 2.2}" cy="${55 + (i % 2) * 1.8}" r=".7"/>`).join('')],
  [8, crystal(50, 47, 4.4, 5) + `<path class="f" d="M24 36 q8 6 14 4 t10 7"/>`],
  [9, crystal(68, 44, 4, 6) + crystal(36, 30, 3.4, 7)],
  [10, `<path class="f" d="M18 62 q14 -10 30 -6 t34 -14"/>` + crystal(58, 66, 5, 8)]
];
const incSvg = svg => { svg.innerHTML = INC.map(([g, s]) => `<g data-g="${g}">${s}</g>`).join(''); };
const incSet = (svg, g) => $$('g', svg).forEach(e => e.classList.toggle('on', +e.dataset.g <= g));

/* 1 → 2 → 3 · Intro */
const intro = $('#tresen'), i1 = $('#dt1'), m2 = $('#dtM2'), i2 = $('#dt2'), m3 = $('#dtM3'), i3 = $('#dt3'), rim = $('#dtRim');
const T = [$('#dtT1'), $('#dtT2'), $('#dtT3')], step = $('#dtStep');
rim.innerHTML = '<circle id="rimA"/><circle class="hi" id="rimB"/>';
const rimA = $('#rimA'), rimB = $('#rimB');
[[i1, 'LRT1'], [i2, 'LRT2'], [i3, 'LRT3']].forEach(([im, k]) => focus(im, k));
const show = (el, o) => { el.style.opacity = o.toFixed(3); el.style.visibility = o > .01 ? 'visible' : 'hidden'; el.style.transform = 'translateY(' + ((1 - o) * 18).toFixed(1) + 'px)'; };
const win = (p, a, b, f = .06) => clamp(Math.min((p - a) / f, (b - p) / f));
function introFrame() {
  const r = intro.getBoundingClientRect(), H = innerHeight, W = innerWidth, run = intro.offsetHeight - H;
  const p = clamp(-r.top / run), live = r.bottom > H * .55 && r.top < H * .5;
  const R = Math.hypot(W, H);
  const p1 = at(i1, pt(i1, 'LRT1')), a = RM ? 0 : smooth(clamp(p / .34));
  i1.style.transformOrigin = p1.x.toFixed(1) + 'px ' + p1.y.toFixed(1) + 'px'; i1.style.transform = 'scale(' + (1 + a * 1.15).toFixed(4) + ')';
  // 2 · aus dem Stein im Briefchen wächst die Pinzetten-Aufnahme
  const b = ease(clamp((p - .2) / .3)), p2 = at(i2, pt(i2, 'LRT2'));
  const c2x = p1.x + (p2.x - p1.x) * b, c2y = p1.y + (p2.y - p1.y) * b;
  m2.style.clipPath = 'circle(' + (b * R).toFixed(1) + 'px at ' + c2x.toFixed(1) + 'px ' + c2y.toFixed(1) + 'px)';
  i2.style.transformOrigin = p2.x.toFixed(1) + 'px ' + p2.y.toFixed(1) + 'px';
  i2.style.transform = 'translate(' + ((p1.x - p2.x) * (1 - b)).toFixed(1) + 'px,' + ((p1.y - p2.y) * (1 - b)).toFixed(1) + 'px) scale(' + (1.7 - .7 * b).toFixed(4) + ')';
  // 3 · die Lupe legt sich über den Stein, ihr Glas wächst bis zum Vollbild
  const c = clamp((p - .56) / .34), ce = ease(c), p3 = at(i3, pt(i3, 'LRT3'));
  const c3x = p2.x + (p3.x - p2.x) * ce, c3y = p2.y + (p3.y - p2.y) * ce;
  const r3 = c <= 0 ? 0 : (Math.min(W, H) * .16) + ce * R;
  m3.style.clipPath = 'circle(' + r3.toFixed(1) + 'px at ' + c3x.toFixed(1) + 'px ' + c3y.toFixed(1) + 'px)';
  i3.style.transformOrigin = p3.x.toFixed(1) + 'px ' + p3.y.toFixed(1) + 'px';
  i3.style.transform = 'translate(' + ((p2.x - p3.x) * (1 - ce)).toFixed(1) + 'px,' + ((p2.y - p3.y) * (1 - ce)).toFixed(1) + 'px) scale(' + (1.45 - .45 * ce).toFixed(4) + ')';
  const rw = Math.min(W, H) * .07, ro = c > 0 ? clamp(1 - (c - .7) / .3) * clamp(c / .06) : 0;
  [rimA, rimB].forEach(e => { e.setAttribute('cx', c3x.toFixed(1)); e.setAttribute('cy', c3y.toFixed(1)); });
  rimA.setAttribute('r', (r3 + rw / 2).toFixed(1)); rimA.style.setProperty('--rw', rw.toFixed(1) + 'px'); rimB.setAttribute('r', r3.toFixed(1)); rim.style.opacity = ro.toFixed(3);
  const o = [p < .16 ? 1 : clamp(1 - (p - .16) / .06), win(p, .36, .56), clamp((p - .84) / .06)];
  T.forEach((t, k) => show(t, live ? o[k] : 0));
  step.firstElementChild.textContent = p < .3 ? 1 : p < .62 ? 2 : 3; show(step, live ? 1 : 0); step.style.transform = '';
}

/* Reinheit */
const rh = $('#reinheit'), rhBg = $('#rhBg'), rhInc = $('#rhInc'), rhScale = $('#rhScale');
incSvg(rhInc); incSvg($('#waInc'));
rhScale.innerHTML = CLA.map((c, i) => `<button type="button" role="radio" aria-checked="false" data-i="${i}">${c[0]}</button>`).join('');
function setCla(i, from) { S.cla = i; $('#rhName').textContent = CLA[i][0]; $('#rhTxt').innerHTML = '<b>' + CLA[i][1] + '.</b> ' + CLA[i][2];
  $$('button', rhScale).forEach(b => b.setAttribute('aria-checked', +b.dataset.i === i)); incSet(rhInc, i); if (from !== 'w') { $('#wCla').value = i; wUpd(); } }
rhScale.addEventListener('click', e => { const b = e.target.closest('button'); if (b) setCla(+b.dataset.i); });
rhScale.addEventListener('keydown', e => { if (!/Arrow(Left|Right)/.test(e.key)) return; e.preventDefault(); setCla(clamp(S.cla + (e.key === 'ArrowRight' ? 1 : -1), 0, 10)); $$('button', rhScale)[S.cla].focus(); });
function placeInc() { const p = pt(rhBg, 'LRT3'), q = at(rhBg, p); rh.style.setProperty('--ix', q.x.toFixed(1) + 'px'); rh.style.setProperty('--iy', q.y.toFixed(1) + 'px'); rh.style.setProperty('--id', (p.d * q.c.dh).toFixed(1) + 'px'); }

/* Farbe */
const fa = $('#farbe'), faBg = $('#faBg'), faRow = $('#faRow'), faSlit = $('#faSlit');
const NF = P.LRT4.xs.length; faRow.innerHTML = COL.slice(0, NF).map((c, i) => `<button type="button" role="radio" aria-checked="false" data-i="${i}" aria-label="Farbe ${c}, ${COLTXT(i)}">${c}</button>`).join('');
function setCol(i, from) { if (i > NF - 1 && from !== 'w') i = NF - 1; S.col = i; $$('button', faRow).forEach(b => b.setAttribute('aria-checked', +b.dataset.i === i));
  $('#faOut').innerHTML = '<b>' + COL[i] + '</b>' + (COLTXT(i)[0].toUpperCase() + COLTXT(i).slice(1)) + '. ' + (i <= 2 ? 'Kein Farbton, auch nicht im Vergleich. Die Skala beginnt bei D.' : i <= 6 ? 'Nur im direkten Vergleich ein Hauch von Wärme, gefasst kaum zu sehen.' : 'Ein zarter warmer Ton. In Gelb- oder Roségold fällt er kaum auf.');
  placeFa(); if (from !== 'w') { $('#wCol').value = i; wUpd(); } }
faRow.addEventListener('click', e => { const b = e.target.closest('button'); if (b) setCol(+b.dataset.i); });
faRow.addEventListener('keydown', e => { if (!/Arrow(Left|Right)/.test(e.key)) return; e.preventDefault(); setCol(clamp(Math.min(S.col, NF - 1) + (e.key === 'ArrowRight' ? 1 : -1), 0, NF - 1)); $$('button', faRow)[Math.min(S.col, NF - 1)].focus(); });
function placeFa() { const p = faBg.dataset.fb ? { y: .7, xs: [.2, .29, .385, .48, .575, .67, .765, .86, .93] } : P.LRT4, sel = Math.min(S.col, NF - 1);
  // Handy: die Kamera fährt am Tablett entlang zum gewählten Stein
  if (mob()) { const vis = innerWidth / (faBg.offsetHeight * 16 / 9); faBg.style.objectPosition = (clamp((p.xs[sel] - vis / 2) / Math.max(.01, 1 - vis)) * 100).toFixed(2) + '% 50%'; } else { const vis = Math.min(1, (innerWidth / fa.offsetHeight) / (16 / 9)), mid = (p.xs[0] + p.xs[p.xs.length - 1]) / 2; faBg.style.objectPosition = (vis >= 1 ? 50 : clamp((mid - vis / 2) / (1 - vis)) * 100).toFixed(2) + '% 50%'; }
  const c = cov(faBg);
  const xs = p.xs.map(x => c.ox + x * c.dw), y = c.oy + p.y * c.dh, H = fa.offsetHeight;
  // Buttons sitzen im .lp-in-Kasten: dessen Versatz zur Sektion abziehen
  if (!mob()) { const op = faRow.offsetParent.getBoundingClientRect(), sr = fa.getBoundingClientRect(), dx = op.left - sr.left, dy = op.top - sr.top;
    $$('button', faRow).forEach((b, i) => b.style.setProperty('--x', (clamp(xs[i], 26, innerWidth - 26) - dx).toFixed(1) + 'px')); faRow.style.top = (y + (xs[1] - xs[0]) * .62 - dy).toFixed(1) + 'px'; }
  fa.style.setProperty('--sx', xs[sel].toFixed(1) + 'px'); fa.style.setProperty('--sw', ((xs[1] - xs[0]) * 1.1).toFixed(1) + 'px'); }

/* Größe am Finger */
const gr = $('#groesse'), grBg = $('#grBg'), grR = $('#grR'), grRing = $('#grRing'), grBars = $('#grBars'), grRuler = $('#grRuler');
focus(grBg, 'LRT5');
// Der Diamant selbst (freigestellt aus LRT6) liegt an der Ringposition und wächst mit dem Karat, maßstäblich zur Fingerbreite
grBars.innerHTML = CT.map((c, i) => `<div data-i="${i}" role="button" tabindex="0" aria-label="${de(c[0])} Karat, ${de(c[1], 1)} Millimeter"><b>${de(c[1], 1)}</b><i></i><em>${de(c[0])}</em></div>`).join('');
function setCt(i, from) { S.ct = i; grR.value = i; const [ct, mm] = CT[i]; $('#grOut').textContent = de(ct) + ' ct · Ø ' + de(mm, 1) + ' mm';
  $$('div', grBars).forEach(d => d.classList.toggle('on', +d.dataset.i === i)); placeGr(); if (from !== 'w') { $('#wCt').value = i; wUpd(); } }
grR.addEventListener('input', () => setCt(+grR.value));
grBars.addEventListener('click', e => { const d = e.target.closest('[data-i]'); if (d) setCt(+d.dataset.i); });
grBars.addEventListener('keydown', e => { const d = e.target.closest('[data-i]'); if (d && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setCt(+d.dataset.i); } });
function placeGr() { const p = grBg.dataset.fb ? { x: .55, y: .5, fw: .07 } : P.LRT5, q = at(grBg, p), pxmm = p.fw * q.c.dw / 17;
  gr.style.setProperty('--gx', q.x.toFixed(1) + 'px'); gr.style.setProperty('--gy', q.y.toFixed(1) + 'px'); gr.style.setProperty('--gd', (pxmm * CT[S.ct][1]).toFixed(1) + 'px');
  const w = pxmm * 10; gr.style.setProperty('--rx0', clamp(q.x - w / 2, 16, innerWidth - w - 16).toFixed(1) + 'px'); gr.style.setProperty('--rw0', w.toFixed(1) + 'px'); gr.style.setProperty('--mm', pxmm.toFixed(2) + 'px');
  grRuler.innerHTML = [0, 5, 10].map(m => `<span style="left:${m * 10}%">${m}${m === 10 ? ' mm' : ''}</span>`).join(''); }
const barsIn = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$('div', grBars).forEach((d, i) => d.querySelector('i').style.height = (CT[i][1] / 9.3 * 100).toFixed(1) + '%'); barsIn.disconnect(); } }), { threshold: .3 });
barsIn.observe(grBars);

/* Ihr Diamant: vier Regler */
const wCut = $('#wCut'), wCol = $('#wCol'), wCla = $('#wCla'), wCt = $('#wCt'), waImg = $('#waImg'), waStone = $('#waStone');
function wUpd() { S.cut = +wCut.value; S.col = +wCol.value; S.cla = +wCla.value; S.ct = +wCt.value;
  $('#oCut').textContent = CUT[S.cut]; $('#oCol').textContent = COL[S.col]; $('#oCla').textContent = CLA[S.cla][0]; $('#oCt').textContent = de(CT[S.ct][0]) + ' ct';
  [wCut, wCol, wCla, wCt].forEach(r => r.style.setProperty('--v', (r.value / r.max * 100) + '%'));
  waImg.style.filter = `sepia(${(S.col * .055).toFixed(3)}) saturate(${(1 + S.col * .14).toFixed(2)}) brightness(${(1 - S.cut * .085).toFixed(3)}) contrast(${(1 - S.cut * .075).toFixed(3)})`;
  waStone.style.setProperty('--ws', (CT[S.ct][1] / 9.3).toFixed(3)); incSet($('#waInc'), S.cla);
  $('#waSum').textContent = CUT[S.cut] + ' · ' + COL[S.col] + ' · ' + CLA[S.cla][0] + ' · ' + de(CT[S.ct][0]) + ' ct · Ø ' + de(CT[S.ct][1], 1) + ' mm';
  $('#waTip').textContent = S.cut >= 2 ? 'Der Schliff entscheidet am meisten über das Funkeln. Ein geringerer Schliff wirft spürbar weniger Licht zurück.'
    : S.cla >= 8 ? 'Ab I1 sieht man Einschlüsse mit bloßem Auge. Wir zeigen Ihnen gern Steine ab SI zum Vergleich.'
    : S.col >= 7 ? 'Ab K ist ein warmer Ton zu sehen. In Gelb- oder Roségold wirkt er stimmig.'
    : 'Gute Wahl: Ab VS und G sieht man mit bloßem Auge keinen Unterschied zu höheren Graden.';
  $('#waGo').dataset.reserve = 'Diamant ' + $('#waSum').textContent; }
[wCut, wCol, wCla, wCt].forEach(r => r.addEventListener('input', () => { wUpd(); setCla(S.cla, 'w'); setCol(S.col, 'w'); setCt(S.ct, 'w'); }));

// Stein in „Ihr Diamant“: Foto so legen, dass der Stein 90 % des Kreises füllt
function placeWa() { if (waImg.dataset.cut) { Object.assign(waImg.style, { width: '92%', height: '92%', left: '4%', top: '4%' }); return; } const p = waImg.dataset.fb ? { x: .5, y: .5, d: .6 } : P.LRT6, k = .9 / p.d, hh = k * 100, ww = hh * 16 / 9;
  Object.assign(waImg.style, { width: ww.toFixed(2) + '%', height: hh.toFixed(2) + '%', left: (50 - p.x * ww).toFixed(2) + '%', top: (50 - p.y * hh).toFixed(2) + '%' }); }

/* Termin am Tresen */
const rm = $('#resModal'), days = $('#tmDays');
(() => { const out = []; const d = new Date(); while (out.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push(new Date(d)); }
  days.innerHTML = out.map((x, i) => `<button type="button" role="radio" aria-checked="${i === 0}">${x.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' })}</button>`).join(''); })();
days.addEventListener('click', e => { const b = e.target.closest('button'); if (b) $$('button', days).forEach(x => x.setAttribute('aria-checked', x === b)); });
function openRes(title) { $('#resTitle').textContent = title; $('#resInfo').textContent = 'Ihre Auswahl: ' + $('#waSum').textContent + '. Wir legen passende Steine bereit, Sie sehen in Ruhe unter der Lupe, ohne Kaufpflicht.'; rm.showModal(); }
document.addEventListener('click', e => { const b = e.target.closest('[data-reserve]'); if (b) openRes('Diamant am Tresen ansehen'); });
$('#tmGo').addEventListener('click', () => openRes('Termin am Tresen'));

/* Ende: die Lupe zum Ziehen (2,5-fach über dem Facetten-Foto) */
const en = $('#ende'), enBg = $('#enBg'), lo = $('#enLoupe'), loI = lo.querySelector('i'); let L = { x: .7, y: .4 }, drag = false, touched = false;
function placeLoupe() { if (!enBg.naturalWidth) return; const c = cov(enBg), W = en.offsetWidth, H = en.offsetHeight, x = L.x * W, y = L.y * H, s = lo.offsetWidth, Z = 2.2;
  lo.style.setProperty('--lx', x.toFixed(1) + 'px'); lo.style.setProperty('--ly', y.toFixed(1) + 'px');
  loI.style.backgroundImage = 'url("' + enBg.currentSrc + '")'; loI.style.backgroundSize = (c.dw * Z).toFixed(0) + 'px ' + (c.dh * Z).toFixed(0) + 'px';
  loI.style.backgroundPosition = (s / 2 - (x - c.ox) * Z).toFixed(1) + 'px ' + (s / 2 - (y - c.oy) * Z).toFixed(1) + 'px'; }
const loSet = e => { const r = en.getBoundingClientRect(); L = { x: clamp((e.clientX - r.left) / r.width, .08, .92), y: clamp((e.clientY - r.top) / r.height, .1, .9) }; placeLoupe(); };
lo.addEventListener('pointerdown', e => { drag = true; touched = true; lo.setPointerCapture(e.pointerId); e.preventDefault(); });
lo.addEventListener('pointermove', e => { if (drag) loSet(e); });
['pointerup', 'pointercancel'].forEach(t => lo.addEventListener(t, () => drag = false));
if (mob()) L = { x: .7, y: .3 };
// Solange niemand zieht, wandert die Lupe langsam über die Facetten (zeigt, dass man sie bewegen kann)
const t0 = performance.now(); function drift(now) { if (!touched && !RM) { const r = en.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) { const t = (now - t0) / 1000; L = { x: (mob() ? .62 : .7) + Math.sin(t * .23) * .14, y: (mob() ? .3 : .42) + Math.sin(t * .31 + 1) * .12 }; placeLoupe(); } } }

/* Kamerafahrten beim Hereinscrollen: Farbe und Fassung kommen aus dem Stein (Zoom heraus) */
function pull() { $$('.dt-pull').forEach(sec => { const im = $('.dt-fix', sec), r = sec.getBoundingClientRect(), k = RM ? 1 : smooth(clamp(1 - r.top / innerHeight));
  const key = sec.dataset.pull, p = im.dataset.fb ? { x: .5, y: .5 } : (key === 'LRT4' ? { x: P.LRT4.xs[Math.min(S.col, NF - 1)], y: P.LRT4.y } : P[key]), q = at(im, p);
  im.style.setProperty('--ox', q.x.toFixed(1) + 'px'); im.style.setProperty('--oy', q.y.toFixed(1) + 'px'); im.style.setProperty('--z', (1 + (1 - k) * 1.4).toFixed(4));
  const ui = sec === fa ? [faRow, faSlit, $('#faOut')] : []; ui.forEach(u => u.style.opacity = clamp((k - .75) / .2).toFixed(3)); }); }

function frame(now) { introFrame(); pull(); drift(now || 0); requestAnimationFrame(frame); }
function layout() { placeInc(); placeFa(); placeGr(); placeLoupe(); placeWa(); }
$$('img').forEach(im => im.addEventListener('load', layout));
addEventListener('resize', () => { [[i1, 'LRT1'], [i2, 'LRT2'], [i3, 'LRT3']].forEach(([im, k]) => focus(im, k)); focus(grBg, 'LRT5'); layout(); });
setCla(4); setCol(1); setCt(3); wUpd(); layout(); requestAnimationFrame(frame);
})();
