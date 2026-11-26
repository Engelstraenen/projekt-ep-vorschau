/* LUPENREIN · Unterseite Verlobungsringe (Storyboard „Die Lupe öffnet die Seite“, Eugen 25.11.2026).
   1→2 das Glas der Lupe wächst, bis der Diamant das Bild füllt · 3 Diamanten in Originalgröße · 4 Karten-Abgleich
   5 Ringgröße per Kreis · 6 Metall und Steinform · 7 Tageslicht/Kerzenschein · 8 Fragen · 9 zurück an dieselbe Stelle */
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
const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

/* Firmenname per ?firma= */
const firma = new URLSearchParams(location.search).get('firma');
if (firma) { $$('[data-brand]').forEach(e => e.textContent = firma.slice(0, 40).toUpperCase()); }

/* Bilder */
$$('img[data-n]').forEach(im => { const id = im.dataset.n; if (IMG[id]) { im.decoding = 'async'; im.src = src(id); } else im.classList.add('miss'); });

if (!IMG.LRL7T || !IMG.LRL7K) { const l = $('#licht'); if (l) l.hidden = true; const a = $('#menu a[href="#licht"]'); if (a) a.hidden = true; }

/* Zurück zur Galerie: an dieselbe Stelle (Startseite merkt sich die Scrollposition) */
$$('[data-back]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault(); const to = a.dataset.back; const q = firma ? '?firma=' + encodeURIComponent(firma) : '';
  document.body.classList.add('leave'); setTimeout(() => location.href = 'index.html' + q + (to ? '#' + to : '#zurueck'), RM ? 0 : 450);
}));

/* Menü */
const menu = $('#menu'), burger = $('#burger');
burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
$$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

/* 1→2 · Lupe: Glas-Mitte und -Radius im Foto LRL1 (Bild-Anteile), das Glas wächst zum Vollbild */
// Glas der Lupe im Foto LRL1 (gemessen, Eugen 25.11.: genau diese Form, kein Kreis): gekippte Ellipse
const LENS = { x: .667, y: .427, rx: .2266, ry: .351, rot: -4 };
const intro = $('#lupe'), lens = $('#lpLens'), rim = $('#lpRim'), p1 = $('#lp1'), p2 = $('#lp2'), t1 = $('#lpT1'), t2 = $('#lpT2');
function cover(im) { const W = innerWidth, H = innerHeight, iw = im.naturalWidth || 16, ih = im.naturalHeight || 9, s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
  const fx = parseFloat(getComputedStyle(im).objectPosition) / 100; return { x: (W - dw) * (isNaN(fx) ? .5 : fx), y: (H - dh) / 2, w: dw, h: dh }; }
function introFrame() {
  const H = innerHeight, W = innerWidth, len = Math.max(1, intro.offsetHeight - H), p = clamp((scrollY - intro.offsetTop) / len);
  const c = cover(p1), cx = c.x + LENS.x * c.w, cy = c.y + LENS.y * c.h, rx0 = LENS.rx * c.w, ry0 = LENS.ry * c.h;
  const g = ease(clamp((p - .08) / .52));
  const far = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)), sMax = far / Math.min(rx0, ry0) * 1.08;
  const s = 1 + (sMax - 1) * g, rx = rx0 * s, ry = ry0 * s, ang = LENS.rot * Math.PI / 180, ca = Math.cos(ang), sa = Math.sin(ang);
  const pts = []; for (let i = 0; i < 72; i++) { const t = i / 72 * Math.PI * 2, ex = Math.cos(t) * rx, ey = Math.sin(t) * ry; pts.push((cx + ex * ca - ey * sa).toFixed(1) + 'px ' + (cy + ex * sa + ey * ca).toFixed(1) + 'px'); }
  lens.style.clipPath = 'polygon(' + pts.join(',') + ')';
  rim.setAttribute('viewBox', '0 0 ' + W + ' ' + H); rim.style.opacity = (1 - smooth(clamp(g / .35))).toFixed(3);
  rim.innerHTML = '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" transform="rotate(' + LENS.rot + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>';
  // im Glas: anfangs vergrößerter Ausschnitt um die Glasmitte, am Ende das volle Makrobild
  const z = 1.35 - .35 * g; p2.style.transformOrigin = cx + 'px ' + cy + 'px'; p2.style.transform = 'scale(' + z.toFixed(4) + ')';
  p1.style.transform = 'none';
  // Ende: die Kamera fährt weiter in den Diamanten (kein Schwarz), darunter beginnt der Abschnitt mit dem Facetten-Foto
  const inn = ease(clamp((p - .8) / .2));
  $('.lp-stage').style.transform = inn > 0 ? 'scale(' + (1 + inn * .35).toFixed(4) + ')' : 'none';
  $('.lp-stage').style.opacity = 1; $('.lp-stage').style.borderRadius = '0';
  const a = 1 - smooth(clamp((p - .03) / .1)), b = smooth(clamp((p - .58) / .1)) * (1 - smooth(clamp((p - .95) / .05)));
  t1.style.opacity = a.toFixed(3); t1.style.visibility = a > .01 ? 'visible' : 'hidden'; t1.style.display = a > .01 ? '' : 'none';
  t2.style.opacity = b.toFixed(3); t2.style.visibility = b > .01 ? 'visible' : 'hidden'; t2.style.display = b > .01 ? '' : 'none';
}

/* 3 · Originalgröße: Pixel je Millimeter aus dem Karten-Abgleich (Standard: CSS-Millimeter) */
const DIA = [[.25, 4.1], [.5, 5.1], [.75, 5.8], [1, 6.5], [1.5, 7.4], [2, 8.2], [3, 9.3]];
let pxmm = parseFloat(store.get('lr_pxmm')) || 96 / 25.4, calibrated = !!store.get('lr_pxmm');
const row = $('#diaRow'); let ZM = 1;
$$('.dia-tg button').forEach(b => b.addEventListener('click', () => { ZM = +b.dataset.z; $$('.dia-tg button').forEach(o => o.setAttribute('aria-pressed', o === b)); sizeDia(); }));
row.innerHTML = DIA.map(([ct, mm], i) => '<figure style="--i:' + i + '"><b>' + String(ct).replace('.', ',') + ' ct</b><div class="dia" data-mm="' + mm + '">' + (IMG.LRL3 ? '<img src="' + src('LRL3') + '" alt="">' : '<i></i>') + '</div><figcaption>' + String(mm).replace('.', ',') + ' mm</figcaption></figure>').join('');
function sizeDia() { $$('.dia', row).forEach(d => { const s = parseFloat(d.dataset.mm) * pxmm * (IMG.LRL3 ? 1.75 : 1) * ZM; d.style.width = d.style.height = s.toFixed(2) + 'px'; });
  $('#calState').innerHTML = calibrated ? 'Abgeglichen mit Ihrer Karte: jeder Millimeter stimmt.' : 'Noch nicht abgeglichen: <a href="#messen">kurz mit einer Karte einstellen</a>, dann stimmt jeder Millimeter.'; }
sizeDia();
new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('on')), { threshold: .35 }).observe($('#groesse'));

/* 4 · Karten-Abgleich: Karte im Scheckkartenformat = 85,60 mm (ISO/IEC 7810 ID-1) */
const calR = $('#calR'), card = $('#calCard'), ruler = $('#calRuler');
calR.value = Math.round(pxmm * 85.6);
function cal(save) {
  const w = +calR.value; card.style.width = w + 'px'; card.style.height = (w * 53.98 / 85.6).toFixed(1) + 'px';
  pxmm = w / 85.6; ruler.style.width = w + 'px';
  ruler.innerHTML = Array.from({ length: 86 }, (_, i) => '<i style="left:' + (i * pxmm).toFixed(2) + 'px" class="' + (i % 10 === 0 ? 'l' : i % 5 === 0 ? 'm' : '') + '">' + (i % 10 === 0 ? '<em>' + i / 10 + '</em>' : '') + '</i>').join('');
  $('#calOut').textContent = calibrated || save ? 'Gespeichert: 1 mm = ' + pxmm.toFixed(2).replace('.', ',') + ' Bildpunkte.' : 'Ziehen Sie den Regler, bis die Fläche genau so breit ist wie Ihre Karte.';
  if (save) { calibrated = true; store.set('lr_pxmm', pxmm.toFixed(4)); }
  sizeDia(); ringFrame();
}
calR.addEventListener('input', () => cal(false)); calR.addEventListener('change', () => cal(true));

/* 5 · Ringgröße: deutsche Größe = Innenumfang in mm = Durchmesser × π */
const rsR = $('#rsR'), rsRing = $('#rsRing');
const saved = parseFloat(store.get('lr_ringd')); if (saved) rsR.value = saved;
function ringFrame() {
  const d = +rsR.value, size = Math.round(d * Math.PI), px = d * pxmm;
  $('#rsNum').textContent = size; $('#rsBig').textContent = size; $('#rsMm').textContent = d.toFixed(1).replace('.', ',') + ' mm';
  const rr = $('#rsReal'), sz = (px + 8).toFixed(1); rr.setAttribute('width', sz); rr.setAttribute('height', sz); rr.setAttribute('viewBox', '0 0 ' + sz + ' ' + sz);
  rr.innerHTML = '<circle cx="' + (sz / 2) + '" cy="' + (sz / 2) + '" r="' + (px / 2).toFixed(2) + '"/>';
  rsRing.style.setProperty('--rot', ((d - 17.2) * 40).toFixed(1) + 'deg');
  const ticks = Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2, r1 = 62.5, r2 = i % 4 ? 66 : 70; return '<line x1="' + (100 + Math.cos(a) * r1).toFixed(2) + '" y1="' + (100 + Math.sin(a) * r1).toFixed(2) + '" x2="' + (100 + Math.cos(a) * r2).toFixed(2) + '" y2="' + (100 + Math.sin(a) * r2).toFixed(2) + '"/>'; }).join('');
  rsRing.innerHTML = '<circle cx="100" cy="100" r="62.5"/>' + ticks;
}
rsR.addEventListener('input', ringFrame); rsR.addEventListener('change', () => store.set('lr_ringd', rsR.value));
$('#rsNew').addEventListener('click', () => { rsR.value = 17.2; ringFrame(); rsR.focus(); });
cal(false); ringFrame();

/* 6 · Gestalten: Metall × Steinform → passendes Foto */
const MET = { W: 'Weißgold 750', G: 'Gelbgold 750', R: 'Roségold 750', P: 'Platin 950' };
const SHP = { SM: 'Smaragdschliff', RU: 'Brillant', OV: 'Oval', KI: 'Kissen' };
let cm = 'W', cs = 'SM';
const cfImg = $('#cfImg');
const pic = (s, m) => s === 'SM' ? (m === 'W' ? 'LRD6' : 'LRL6' + m) : 'LRL6' + s + m;
/* Nur Kombinationen anbieten, für die es ein Foto gibt (nie Platzhalter) */
const hasPic = (s, m) => !!IMG[pic(s, m)];
function avail() {
  $$('.cf-met button').forEach(b => { const ok = hasPic(cs, b.dataset.m); b.disabled = !ok; b.hidden = !Object.keys(SHP).some(s => hasPic(s, b.dataset.m)); });
  $$('.cf-shp button').forEach(b => { b.disabled = false; b.hidden = !Object.keys(MET).some(m => hasPic(b.dataset.s, m)); });
}
function conf() {
  if (!hasPic(cs, cm)) { const m = Object.keys(MET).find(m => hasPic(cs, m)); if (m) cm = m; else cs = 'SM'; }
  avail();
  const id = pic(cs, cm); $$('.cf-met button').forEach(b => b.setAttribute('aria-checked', b.dataset.m === cm)); $$('.cf-shp button').forEach(b => b.setAttribute('aria-checked', b.dataset.s === cs));
  $('#cfTxt').textContent = SHP[cs] + ' in ' + MET[cm] + '. Ihre Größe: ' + $('#rsNum').textContent + '.';
  $('#cfGo').dataset.reserve = 'Verlobungsring · ' + SHP[cs] + ' · ' + MET[cm];
  if (!IMG[id]) { cfImg.classList.add('wait'); return; }
  cfImg.classList.remove('wait'); const n = new Image(); n.onload = () => { cfImg.classList.add('sw'); setTimeout(() => { cfImg.src = n.src; cfImg.classList.remove('sw'); }, 220); }; n.src = src(id);
}
$$('.cf-met button').forEach(b => b.addEventListener('click', () => { cm = b.dataset.m; conf(); }));
$$('.cf-shp button').forEach(b => b.addEventListener('click', () => { cs = b.dataset.s; conf(); }));
cfImg.src = src('LRD6'); conf();

/* 7 · Vergleich Tageslicht / Kerzenschein */
const cmp = $('#cmp'), cmpR = $('#cmpR');
if (!mob()) { cmpR.value = 27; cmp.style.setProperty('--p', '27%'); } // Trennlinie auf dem Ring (Ring steht im Foto links)
cmpR.addEventListener('input', () => cmp.style.setProperty('--p', cmpR.value + '%'));
let cmpDrag = false;
const cmpSet = e => { const r = cmp.getBoundingClientRect(), v = clamp((e.clientX - r.left) / r.width) * 100; cmpR.value = v; cmp.style.setProperty('--p', v.toFixed(1) + '%'); };
cmp.addEventListener('pointerdown', e => { cmpDrag = true; cmp.setPointerCapture(e.pointerId); cmpSet(e); e.preventDefault(); });
cmp.addEventListener('pointermove', e => { if (cmpDrag) cmpSet(e); });
['pointerup', 'pointercancel'].forEach(t => cmp.addEventListener(t, () => cmpDrag = false));

/* Reservieren */
const rm = $('#resModal');
document.addEventListener('click', e => { const b = e.target.closest('[data-reserve]'); if (!b) return; $('#resTitle').textContent = b.dataset.reserve; rm.showModal(); });

/* Szenen, die sich beim Scrollen bewegen */
const RS = { x: .652, y: .476, w: .32 }; // Ring im Foto LRL5 (gemessen), Kreis wie im Storyboard
function placeRing() { const im = $('#ringgroesse .lp-bg'); if (!im || !im.naturalWidth) return; const sec = im.parentElement.getBoundingClientRect(), r = im.getBoundingClientRect();
  const iw = im.naturalWidth, ih = im.naturalHeight, bw = im.offsetWidth, bh = im.offsetHeight, s = Math.max(bw / iw, bh / ih), dw = iw * s, dh = ih * s;
  const fx = parseFloat(getComputedStyle(im).objectPosition) / 100; const ox = im.offsetLeft + (bw - dw) * (isNaN(fx) ? .5 : fx), oy = im.offsetTop + (bh - dh) / 2;
  const k = (+rsR.value) / 17.2, rx = ox + RS.x * dw, ry = oy + RS.y * dh;
  im.style.transformOrigin = (RS.x * 100).toFixed(2) + '% ' + (RS.y * 100).toFixed(2) + '%'; im.style.transform = 'scale(' + k.toFixed(4) + ')';
  rsRing.style.setProperty('--rx', rx.toFixed(1) + 'px'); rsRing.style.setProperty('--ry', ry.toFixed(1) + 'px'); rsRing.style.setProperty('--rw', (RS.w * dw * k).toFixed(1) + 'px'); }
function frame() { introFrame(); placeRing();
  $$('.lp-photo .lp-bg').filter(im => !im.closest('#ringgroesse') && !im.classList.contains('lp-facets')).forEach(im => { const r = im.parentElement.getBoundingClientRect(), k = clamp(1 - (r.top + r.height) / (innerHeight + r.height)); im.style.transform = RM ? 'none' : 'scale(' + (1.06 - .06 * k).toFixed(4) + ')'; });
  requestAnimationFrame(frame); }
requestAnimationFrame(frame);
addEventListener('resize', () => { sizeDia(); ringFrame(); });
})();
