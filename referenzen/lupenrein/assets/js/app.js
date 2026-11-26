/* LUPENREIN · Weiße Galerie. Scrollen = Flug durch die Vitrinen: das aktuelle Fach zoomt an der Kamera vorbei,
   das nächste kommt durch die Glastür dahinter nach vorn. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const IMG = window.IMG || {};
const mobile = () => innerWidth < 900;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Eugen 26.11.2026: dunkle Galerie. Gibt es eine dunkle Fassung (…N), wird sie automatisch statt der hellen benutzt.
const dk = id => IMG[id + 'N'] ? id + 'N' : id;
const src = (id, m) => { id = dk(id); const x = IMG[id]; return x ? 'assets/img/' + id + (m && x.m ? '-m' : '') + '.webp?v=' + (x.v || 1) : ''; };

/* Firmenname per ?firma= */
const firma = new URLSearchParams(location.search).get('firma');
if (firma) { const n = firma.slice(0, 40); $$('[data-brand]').forEach(e => e.textContent = n.toUpperCase()); document.title = n + ' · Juwelier'; }

/* Bilder laden (nur was es gibt) */
$$('img[data-src]').forEach(im => { const id = im.dataset.src; if (!IMG[id]) { im.classList.add('miss'); return; } im.decoding = 'async'; im.src = src(id, mobile() && !im.closest('[data-s="0"]')); }); // Eingang wird stark gezoomt → volle Auflösung
$$('source[data-srcset]').forEach(s => { if (IMG[s.dataset.srcset]) s.srcset = src(s.dataset.srcset, false); else s.remove(); });
$$('[data-img]:not(.drawer)').forEach(el => { const id = el.dataset.img; if (!IMG[id]) { el.classList.add('miss'); return; } el.style.backgroundImage = 'url("' + src(id, mobile()) + '")'; });
const setImg = (im, id) => { if (!im || !IMG[id]) return; const n = new Image(); n.onload = () => { im.style.opacity = 0; setTimeout(() => { im.src = n.src; im.style.opacity = 1; }, 180); }; n.src = src(id, mobile()); };
$$('.shot img').forEach(im => im.style.transition = 'opacity .45s');

/* Eingang: Weitbild + deckungsgleiches 4K-Nahbild der End-Vitrine (tools/einpassen.py).
   Während der Fahrt übernimmt das Nahbild, damit das Collier scharf bleibt. */
const HO = { x: 0, y: 0 };
const NEAR = { x: .3555, y: .3254, w: .275, h: .275 }; // LRB25 im Weitbild LRB01 (tools/einpassen2.py, Korr. 0,73)
const CASE = { x: .493, y: .463 }; // Mitte der End-Vitrine im Weitbild = Zielpunkt der Fahrt
const hbox = $('#hbox'), near = NEAR && IMG.LRB25 ? $('#heroNear') : null, AR0 = 3584 / 2016, HZ = 2.9;
if (!near) $('#heroNear').classList.add('miss');
function heroLayout() {
  const W = innerWidth, H = innerHeight; let bw = W, bh = W / AR0; if (bh < H) { bh = H; bw = H * AR0; }
  const bx = (W - bw) / 2, by = (H - bh) / 2;
  Object.assign(hbox.style, { left: bx + 'px', top: by + 'px', width: bw + 'px', height: bh + 'px' });
  if (near) Object.assign(near.style, { left: NEAR.x * 100 + '%', top: NEAR.y * 100 + '%', width: NEAR.w * 100 + '%', height: NEAR.h * 100 + '%' });
  HO.x = bx + CASE.x * bw; HO.y = by + CASE.y * bh; // Zoom-Mitte des Eingangs (bleibt beim Zoomen fest)
  hbox.parentElement.style.transformOrigin = HO.x + 'px ' + HO.y + 'px';
}
heroLayout(); addEventListener('resize', heroLayout);

/* Übergänge (Regel V2.66: eine durchgehende Geschichte). Variante per Link:
   ?uebergang=licht  → Lichtstrahl aus dem Diamanten führt von Stück zu Stück (Standard, Storyboard U2)
   ?uebergang=fahrt  → Kamerafahrt: Kamera fliegt durch eine Glastür im Bild in den nächsten Raum (Storyboard U3) */
const shots = $$('.shot');
// Eugen 25.11.2026: Übergänge = Kamerafahrt durch Glastüren. Lichtstrahl auf Eugens Wunsch komplett gelöscht.
const FLOW = 'fahrt';
const PW = .16;            // Breite der Glastür beim Start der Fahrt (Anteil der Bildschirmbreite)
const F = {};
// Türpunkte in Bild-Anteilen (u, v) je Fach
// Türen auf echte Vitrinen/Durchgänge im Hintergrund der Fotos (Kalibrier-Screens 1440×900, 25.11.)
const PORTAL = [[.493, .47], [.15, .33], [.495, .22], [.12, .28], [.5, .42], [.168, .46], [.76, .2], [.69, .35], [.5, .4]];
// Bild-Anteil → Bildschirm-Punkt (berücksichtigt object-fit:cover, object-position und aktuelle Transformation)
function imgPt(k, uv) {
  const sh = shots[k]; if (!sh) return { x: innerWidth / 2, y: innerHeight / 2 };
  if (uv === 'vit') { const r = $('.vit', sh).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  const el = k === 0 ? hbox : (k === 4 ? $('.bgblur', sh) : $('img', sh));
  const r = el.getBoundingClientRect();
  if (k === 0) return { x: r.left + uv[0] * r.width, y: r.top + uv[1] * r.height };
  const iw = el.naturalWidth || 16, ih = el.naturalHeight || 9, s = Math.max(r.width / iw, r.height / ih);
  const dw = iw * s, dh = ih * s, cs = getComputedStyle(el).objectPosition.split(' ');
  const fx = isNaN(parseFloat(cs[0])) ? .5 : parseFloat(cs[0]) / 100, fy = isNaN(parseFloat(cs[1])) ? .5 : parseFloat(cs[1]) / 100;
  return { x: r.left + (r.width - dw) * fx + uv[0] * dw, y: r.top + (r.height - dh) * fy + uv[1] * dh };
}
// Türpunkt ohne laufende Fahrt-Transformation messen (sonst wandert er mit dem Zoom)
function portalPt(k) {
  if (k === 0) return { x: HO.x, y: HO.y }; // Tür = Glas der End-Vitrine = Zoom-Mitte
  const sh = shots[k], keep = sh.style.transform;
  sh.style.transform = 'none';
  const p = imgPt(k, PORTAL[k]); sh.style.transform = keep; return p;
}
const door = document.createElement('div'); door.className = 'door'; door.setAttribute('aria-hidden', 'true'); door.innerHTML = '<i></i><i></i>'; $('#stage').appendChild(door);

/* Bühne: Fachwechsel per Scroll */
const scenes = $$('.scene');
let geo = [];
function measure() { geo = scenes.map(s => ({ s: +s.dataset.s, top: s.offsetTop, h: s.offsetHeight })); }
measure(); addEventListener('resize', measure); new ResizeObserver(measure).observe(document.body);
const where = $('#where'), menuLinks = $$('#menu a');
let lastS = -1;
function frame() {
  const y = scrollY, vh = innerHeight;
  // aktive Szene i und Übergang t (0..1) beim Eintritt der nächsten
  let i = 0; for (let k = 0; k < geo.length; k++) if (y >= geo[k].top - vh * .001) i = k;
  const nx = geo[i + 1];
  const t = nx ? clamp((y + vh - nx.top) / (vh * .9)) : 0; // nächste Szene schiebt sich in den Bildschirm
  const e = ease(t);
  const cur = geo[i], loc = clamp((y - cur.top) / Math.max(1, cur.h - vh)); // Fortschritt innerhalb der Szene
  const W = innerWidth, Hh = innerHeight;
  shots.forEach((sh, k) => {
    let op = 0, sc = 1, bl = 0, tf = null;
    if (k === i) {
      const z = k === 0 ? 1 + ease(loc) * (HZ - 1) : 1 + loc * .07;
      if (k === 0 && near) near.style.opacity = clamp((z - 1.15) / .45).toFixed(3);
      op = 1; sc = z; // letzte Szene (ohne nächste) bleibt sichtbar
      if (FLOW === 'fahrt' && nx) {           // Kamera fährt auf die Glastür im Bild zu
        // Foto nur leicht vergrößern (max. 1,25×), sonst wird es auf Retina unscharf; die Tür wächst scharf darüber
        const P = portalPt(i), Z = 1 + .25 * e;
        sh.style.transformOrigin = P.x + 'px ' + P.y + 'px';
        sc = z * Z; op = 1 - clamp((e - .9) / .1); bl = 0;
        F.P = P;
      }
    } else if (k === i + 1) {
      if (FLOW === 'fahrt') {                   // nächster Raum steckt in der Tür und wächst mit der Fahrt
        const P = F.P || { x: W / 2, y: Hh / 2 };
        const s2 = ease(clamp(e / .95)), w = PW * W + (W - PW * W) * s2; // nächster Raum: immer ≤ 1:1, also scharf
        const cx = P.x + (W / 2 - P.x) * s2, cy = P.y + (Hh / 2 - P.y) * s2;
        op = t > .001 ? 1 : 0; sc = w / W;
        tf = 'translate(' + (cx - W / 2).toFixed(1) + 'px,' + (cy - Hh / 2).toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')';
        sh.style.transformOrigin = '50% 50%';
        door.style.cssText = 'opacity:' + (t > .001 && s2 < .999 ? 1 - s2 * s2 : 0) + ';left:' + (cx - w / 2) + 'px;top:' + (cy - w * Hh / W / 2) + 'px;width:' + w + 'px;height:' + (w * Hh / W) + 'px;--open:' + clamp(e / .3).toFixed(3);
      } else { op = clamp((e - .15) / .6); sc = .9 + .1 * e; }
    }
    if (RM) { sc = 1; bl = 0; tf = null; }
    sh.style.opacity = op.toFixed(3);
    sh.style.visibility = op > .001 ? 'visible' : 'hidden';
    if (op > .001) { sh.style.transform = tf || 'scale(' + sc.toFixed(4) + ')'; sh.style.filter = bl > .05 ? 'blur(' + bl.toFixed(2) + 'px)' : 'none'; }
  });
  if (FLOW === 'fahrt' && !(nx && t > .001)) door.style.opacity = 0;
  // Eingang: Titel weg, Fahrt-Text kurz zeigen, dann in die Vitrine
  if (i === 0) { const hc = $('.hero-copy'), ft = $('#flightTxt'), hi = $('#hint'); const l = loc; if (l > .005) { hc.style.animation = 'none'; hc.style.transform = 'none'; }
    hc.style.opacity = (1 - clamp(l / .22)).toFixed(3); hi.style.opacity = (1 - clamp(l / .12)).toFixed(3);
    ft.style.opacity = (clamp((l - .25) / .15) * (1 - clamp((l - .7) / .15))).toFixed(3); }
  // Karte zeigen, wenn die Szene steht
  scenes.forEach((s, k) => s.classList.toggle('in', k === i && t < .25 || k === i + 1 && t > .85));
  const act = t > .5 ? i + 1 : i;
  if (act !== lastS) {
    lastS = act; const sc = scenes[act];
    menuLinks.forEach(a => a.classList.toggle('on', +a.dataset.s === +sc.dataset.s && a.getAttribute('href') === '#' + sc.id || (+a.dataset.s === +sc.dataset.s && sc.id === 'karriere' && a.getAttribute('href') === '#karriere')));
    if (sc.dataset.n) { $('#whereN').textContent = sc.dataset.n; $('#whereT').textContent = sc.dataset.t; where.classList.add('on'); } else where.classList.remove('on');
    if (sc.id === 'karriere') kinGo();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* Menü */
const menu = $('#menu'), burger = $('#burger');
burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
menuLinks.forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));
// Ankerlinks: auf den Ruhepunkt der Szene springen (Karte sichtbar)
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href').slice(1); const el = id === 'stimmen' ? $('#karriere') : document.getElementById(id); if (!el || !el.classList.contains('scene')) return;
  e.preventDefault(); scrollTo({ top: el.offsetTop + innerHeight * .15, behavior: RM ? 'auto' : 'smooth' });
}));

/* Helfer */
function pick(box, sel, cb) { box.addEventListener('click', e => { const b = e.target.closest(sel); if (!b || !box.contains(b)) return; $$(sel, box).forEach(x => { x.classList.toggle('on', x === b); if (x.hasAttribute('role')) x.setAttribute('aria-checked', x === b); }); cb && cb(b); }); }
function toast(t) { let el = $('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 3200); }
$$('.chips:not(#ringart)').forEach(c => pick(c, '.chip'));
const fillR = r => r.style.setProperty('--v', (r.value - r.min) / (r.max - r.min) * 100 + '%');
function days(box, n = 6) { const W = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], out = []; const d = new Date(); for (let i = 1; out.length < n; i++) { const x = new Date(d.getTime() + i * 864e5); if (x.getDay() === 0) continue; out.push('<button type="button"' + (out.length === 0 ? ' class="on"' : '') + '><small>' + W[x.getDay()] + '</small>' + x.getDate() + '.' + (x.getMonth() + 1) + '.</button>'); } box.innerHTML = out.join(''); pick(box, 'button'); }

/* Diamanten: 4C + Lupe */
// Schliff = Helligkeit/Kontrast/Schärfe, Farbe = sichtbarer warmer Ton (D farblos … M deutlich gelblich)
function stoneFilter(cu, co) { const k = 3 - cu, y = Math.max(0, co - 1);
  return 'brightness(' + (1 - k * .11).toFixed(2) + ') contrast(' + (1 - k * .1).toFixed(2) + ') blur(' + (k * .18).toFixed(2) + 'px) sepia(' + (y * .05).toFixed(3) + ') saturate(' + (1 + y * .1).toFixed(2) + ') hue-rotate(' + (y * 1.2).toFixed(1) + 'deg)'; }
// Großer Stein auf dem leeren Stift im Vitrinenfoto (dunkle Fassung LRB03N): Messpunkt Steinmitte + Durchmesser bei 1 ct in Bildhöhe
const PIN = { x: .317, y: .4625, d: .13 }; // LRB03N: Stiftspitze (gemessen), d = Steindurchmesser bei 1 ct in Bildhöhe
const dStone = $('#dStone'), dPhoto = $('#dPhoto');
function bigStone(FL, svg, mm) { if (!dStone) return; if (!IMG.LRB03N) { dStone.hidden = true; return; } dStone.hidden = false;
  $('img', dStone).style.filter = FL; $('svg', dStone).innerHTML = svg; dStone.style.setProperty('--k', (mm / 6.5).toFixed(3)); placeStone(); }
function placeStone() { if (!dStone || dStone.hidden || !dPhoto.naturalWidth) return; const r = dPhoto.getBoundingClientRect(), sh = dPhoto.parentElement.getBoundingClientRect();
  const bw = dPhoto.offsetWidth, bh = dPhoto.offsetHeight, iw = dPhoto.naturalWidth, ih = dPhoto.naturalHeight, sc = Math.max(bw / iw, bh / ih), dw = iw * sc, dh = ih * sc;
  const cs = getComputedStyle(dPhoto).objectPosition.split(' '), fx = parseFloat(cs[0]) / 100, fy = parseFloat(cs[1]) / 100;
  dStone.style.left = ((bw - dw) * (isNaN(fx) ? .5 : fx) + PIN.x * dw).toFixed(1) + 'px'; dStone.style.top = ((bh - dh) * (isNaN(fy) ? .5 : fy) + PIN.y * dh).toFixed(1) + 'px';
  dStone.style.width = dStone.style.height = (PIN.d * dh).toFixed(1) + 'px'; }
addEventListener('resize', placeStone); if (dPhoto) dPhoto.addEventListener('load', placeStone);
const CUT = [['Gut', 'Gibt Licht zurück, aber nicht alles.'], ['Sehr gut', 'Viel Brillanz, kleine Verluste an den Rändern.'], ['Ausgezeichnet', 'Fast alles Licht kommt zurück.'], ['Exzellent', 'Perfekte Proportionen: maximales Feuer.']];
const COL = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const CLA = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'P1', 'P2'];
const claInfo = i => i === 0 ? 'Lupenrein: unter 10-facher Lupe keine Einschlüsse. Daher unser Name.' : i <= 2 ? 'Winzige Einschlüsse, selbst mit Lupe kaum zu finden.' : i <= 4 ? 'Mit der Lupe sichtbar, mit bloßem Auge nicht.' : i <= 6 ? 'Mit der Lupe leicht zu erkennen.' : 'Einschlüsse mit bloßem Auge erkennbar.';
const colInfo = i => i <= 2 ? 'Farblos, sehr selten.' : i <= 4 ? 'Feines Weiß, beliebte Wahl.' : i <= 6 ? 'Ein Hauch Wärme, schön in Gelbgold.' : 'Sichtbar warmer Ton.';
const CT = [[.25, 4.1], [.5, 5.2], [.75, 5.8], [1, 6.5], [1.25, 6.9], [1.5, 7.4], [2, 8.2], [3, 9.3]];
const INC = [[52, 40, 1], [44, 58, .8], [60, 55, 1.2], [36, 44, .7], [57, 33, .9], [48, 66, 1], [66, 46, .8], [40, 34, 1.1], [54, 50, .6], [30, 54, .9], [62, 64, 1], [46, 28, .7], [70, 38, .8], [34, 64, 1.2], [50, 74, .9], [26, 42, .8], [58, 72, 1], [42, 50, .7], [68, 58, 1.1], [38, 72, .9]];
const sCut = $('#sCut'), sCol = $('#sColor'), sCla = $('#sClar'), sCar = $('#sCarat');
const gem = $('#gem'), gImg = $('.gem-img', gem), tint = $('#gemTint'), inc = $('#gemInc'), spark = $('#gemSpark');
let lastCtl = 'clarity';
function c4() {
  const cu = +sCut.value, co = +sCol.value, cl = +sCla.value, ca = +sCar.value;
  $('#oCut').textContent = CUT[cu][0]; $('#oColor').textContent = COL[co]; $('#oClar').textContent = CLA[cl]; $('#oCarat').textContent = CT[ca][0].toFixed(2).replace('.', ',') + ' ct';
  const FL = stoneFilter(cu, co); gImg.style.filter = FL; spark.style.setProperty('--sp', .25 + cu * .25);
  tint.style.opacity = 0;
  const n = [0, 1, 2, 3, 5, 7, 10, 14, 20][cl], sz = [0, .5, .7, .9, 1.1, 1.4, 1.8, 2.5, 3.2][cl], op = [0, .3, .4, .55, .65, .8, .9, 1, 1][cl];
  let svg = INC.slice(0, n).map(([x, y, s]) => '<circle cx="' + x + '" cy="' + y + '" r="' + (s * sz).toFixed(2) + '" opacity="' + op + '"/>').join('');
  if (cl >= 5) svg += '<path d="M38 48 q6 -5 12 1 q5 4 10 -2" fill="none" stroke-width="' + (cl - 4) * .5 + '" opacity="' + op + '"/>';
  inc.innerHTML = svg; bigStone(FL, svg, CT[ca][1]);
  $('#c4mm').textContent = 'Ø ' + CT[ca][1].toFixed(1).replace('.', ',') + ' mm';
  gem.style.transform = 'scale(' + (.42 + .4 * CT[ca][1] / 9.3).toFixed(3) + ') translateY(-6%)';
  $('#c4info').textContent = { cut: CUT[cu][1], color: 'Farbe ' + COL[co] + ': ' + colInfo(co), clarity: 'Reinheit ' + CLA[cl] + ': ' + claInfo(cl), carat: CT[ca][0].toFixed(2).replace('.', ',') + ' ct, Ø ' + CT[ca][1].toFixed(1).replace('.', ',') + ' mm.' }[lastCtl];
  [sCut, sCol, sCla, sCar].forEach(fillR); syncLoupe();
}
[[sCut, 'cut'], [sCol, 'color'], [sCla, 'clarity'], [sCar, 'carat']].forEach(([r, k]) => r.addEventListener('input', () => { lastCtl = k; c4(); }));
const stageEl = $('#c4stage'), loupe = $('#loupe'); let lclone = null, lt;
function syncLoupe() { if (lclone) lclone.remove(); lclone = gem.cloneNode(true); lclone.removeAttribute('id'); $$('[id]', lclone).forEach(e => e.removeAttribute('id')); lclone.style.position = 'absolute'; lclone.style.transition = 'none'; loupe.appendChild(lclone); }
function moveLoupe(x, y) { const r = stageEl.getBoundingClientRect(), L = loupe.offsetWidth, Zm = 3; loupe.style.transform = 'translate(' + (x - r.left - L / 2) + 'px,' + (y - r.top - L / 2) + 'px)'; if (lclone) { const g = gem.getBoundingClientRect(), w = g.width * Zm; Object.assign(lclone.style, { width: w + 'px', height: w + 'px', transform: 'none', left: (L / 2 - (x - g.left) * Zm) + 'px', top: (L / 2 - (y - g.top) * Zm) + 'px' }); } }
stageEl.addEventListener('pointerenter', syncLoupe);
stageEl.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { stageEl.classList.add('lupe'); moveLoupe(e.clientX, e.clientY); } });
stageEl.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') stageEl.classList.remove('lupe'); });
stageEl.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { syncLoupe(); stageEl.classList.add('lupe'); moveLoupe(e.clientX, e.clientY); clearTimeout(lt); lt = setTimeout(() => stageEl.classList.remove('lupe'), 2600); } });
c4();

/* Verlobungsringe: Ringart wechselt das Foto */
const ringart = $('#ringart');
$$('.chip', ringart).forEach(b => { if (!IMG[b.dataset.v]) b.hidden = true; });
const FX = { LRB04: '72%', LRB16: '32%', LRB17: '66%', LRB18: '68%' };
const ring = b => { $('#pvCap').textContent = b.dataset.c; $('#pvTxt').textContent = b.dataset.d; const im = $('#ringShot'); setImg(im, b.dataset.v); setTimeout(() => im.style.setProperty('--fx', FX[b.dataset.v] || '50%'), 180); };
pick(ringart, '.chip', ring); ring($('.chip.on', ringart));

/* Trauringe */
let gold = 'gelb'; const GI = { gelb: 'LRB05M', weiss: 'LRB19M', rose: 'LRB21M' }; // dunkle Nahaufnahmen (Eugen 26.11.), fehlt ein Metall, wird es ausgeblendet
const tW = $('#tWidth'), eng = $('#tEngr');
function trau() { const w = +tW.value; $('#wOut').textContent = w.toFixed(1).replace('.', ',') + ' mm'; fillR(tW); $('#engrOut').textContent = eng.value.trim() || ' '; }
$$('.sw').forEach(b => { if (!IMG[GI[b.dataset.gold]]) b.hidden = true; });
pick($('.swatches'), '.sw', b => { gold = b.dataset.gold; setImg($('#trauShot'), GI[gold]); });
tW.addEventListener('input', trau); eng.addEventListener('input', trau); trau();

/* Schmuck: Vitrine wechselt */
const dr = $('#drawers');
$$('.drawer', dr).forEach(b => { if (!IMG[b.dataset.img]) b.hidden = true; });
const drawer = b => { $('#dTxt').textContent = b.dataset.d; $('#dRes').dataset.reserve = b.dataset.t; setImg($('#dShot'), b.dataset.img); };
pick(dr, '.drawer', drawer); drawer($('.drawer.on', dr));

/* Uhrenservice */
$('#tGo').addEventListener('click', () => {
  const v = $('#tNr').value.trim(), tl = $('#timeline');
  if (!v) { $('#tMsg').textContent = 'Bitte eine Auftragsnummer eingeben (Demo: beliebig).'; return; }
  const s = [...v].reduce((a, c) => a + c.charCodeAt(0), 0) % 3 + 1;
  $$('li', tl).forEach(li => li.className = '');
  $$('li', tl).forEach((li, i) => setTimeout(() => { li.className = i + 1 < s ? 'done' : i + 1 === s ? 'now' : ''; }, i * 450));
  $('#tMsg').textContent = 'Auftrag ' + v.toUpperCase() + ': ' + ['Annahme', 'Prüfung', 'Übergabe'][s - 1] + '. (Demo-Daten)';
});

/* Ankauf */
const FT = { 333: '333 = 33,3 % Feingold, häufig bei älterem Schmuck.', 585: '585 = 58,5 % Feingold, der Klassiker bei Ringen und Ketten.', 750: '750 = 75 % Feingold, satte Farbe, hochwertiger Schmuck.', 999: '999 = 99,9 % Feingold, meist Barren und Münzen.' };
const setF = f => { $('#feinFill').style.width = f / 10 + '%'; $('#feinTxt').textContent = FT[f]; $$('.stamp').forEach(s => s.classList.toggle('on', s.dataset.f == f)); };
// Gold-Rechner (Eugen 26.11.): Gewicht + Stempel → Feingoldanteil in Gramm (keine Preise auf der Demo)
let goldF = 585; const goldG = $('#goldG');
const calcGold = () => { if (!goldG) return; const g = +goldG.value, f = g * goldF / 1000; $('#goldGo').textContent = g + ' g'; fillR(goldG);
  const el = $('#goldF'), from = parseFloat((el.dataset.v || '0')), t0 = performance.now(); el.dataset.v = f;
  const run = t => { const k = Math.min(1, (t - t0) / 450), v = from + (f - from) * (1 - Math.pow(1 - k, 3)); el.textContent = v.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' g'; if (k < 1) requestAnimationFrame(run); }; requestAnimationFrame(run); };
if (goldG) goldG.addEventListener('input', calcGold);
$$('.stamp').forEach(s => s.addEventListener('click', () => { setF(s.dataset.f); goldF = +s.dataset.f; calcGold(); })); setF(585); calcGold();

/* Termin: Monatskalender wie im Storyboard */
(function cal() {
  const box = $('#cal'), d = new Date(), y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), off = (first.getDay() + 6) % 7;
  const MN = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  let h = '<p class="mh">' + MN[m] + ' ' + y + '</p>' + ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(w => '<span class="wd">' + w + '</span>').join('');
  for (let k = 0; k < off; k++) h += '<span></span>';
  let sel = false;
  for (let k = 1; k <= days; k++) { const dt = new Date(y, m, k), past = k <= d.getDate(), sun = dt.getDay() === 0; const on = !past && !sun && !sel; if (on) sel = true; h += '<button type="button"' + (past || sun ? ' disabled' : '') + (on ? ' class="on"' : '') + '>' + k + '</button>'; }
  box.innerHTML = h; pick(box, 'button:not(:disabled)');
  if (!sel) box.insertAdjacentHTML('beforeend', '<p class="small" style="grid-column:1/-1">Nächster Monat: Termine auf Anfrage.</p>');
})();
const SL = ['10:00', '14:00', '17:30', '19:30', '20:30'];
$('#slots').innerHTML = SL.map((t, i) => '<button type="button" class="' + (i > 2 ? 'eve' : '') + (i === 3 ? ' on' : '') + '">' + t + (i > 2 ? ' · abends' : '') + '</button>').join('');
pick($('#slots'), 'button');
$('#bookGo').addEventListener('click', () => { $('#bookMsg').hidden = false; toast('Terminanfrage gespeichert (Demo).'); });
$$('[data-topic]').forEach(a => a.addEventListener('click', () => { const t = a.dataset.topic; $$('#book .chip').forEach(c => { if (c.textContent === t) c.click(); }); }));

/* Karriere: Bewerbung in 60 Sekunden */
let kinDone = false; function kinGo() { if (kinDone) return; kinDone = true; $$('#kin p').forEach((p, i) => setTimeout(() => p.classList.add('in'), 300 + i * 260)); }
let tStart = 0, tInt = 0; const ap = $('#apply');
function startTimer() { if (tStart) return; tStart = Date.now(); tInt = setInterval(() => { const s = Math.max(0, 60 - Math.floor((Date.now() - tStart) / 1000)); $('#tSec').textContent = s; if (!s) clearInterval(tInt); }, 250); }
$$('.apply-step .chip', ap).forEach(c => c.addEventListener('click', () => { startTimer(); const st = c.closest('.apply-step'), n = +st.dataset.st; setTimeout(() => { st.classList.remove('on'); const nx = $('.apply-step[data-st="' + (n + 1) + '"]', ap); if (nx) nx.classList.add('on'); }, 350); }));
$('#applyGo').addEventListener('click', () => { clearInterval(tInt); const s = tStart ? Math.round((Date.now() - tStart) / 1000) : 0; $$('.apply-step', ap).forEach(x => x.classList.remove('on')); const m = $('#applyMsg'); m.hidden = false; m.textContent = 'Geschafft in ' + s + ' Sekunden! Wir melden uns innerhalb von 48 Stunden. (Demo: nichts gesendet.)'; });

/* Reservieren */
const rm = $('#resModal');
document.addEventListener('click', e => { const b = e.target.closest('[data-reserve]'); if (!b) return; $('#resTitle').textContent = b.dataset.reserve; days($('#resDays')); rm.showModal(); });
rm.addEventListener('close', () => { if (rm.returnValue === 'ok') toast('Reserviert: ' + $('#resTitle').textContent + ' (Demo)'); });

/* AR-Anprobe */
const am = $('#arModal'), arS = $('#arStart'), arX = $('#arStop'), vid = $('#arVideo'), cv = $('#arCanvas'), scr = $('#arScreen'), msg = $('#arMsg');
let stream = null, lm = null, raf = 0, tone = 'white';
const ringImg = new Image(); let ringOk = false; if (IMG.ring_ar) { ringImg.onload = () => ringOk = true; ringImg.src = 'assets/img/ring-ar.png?v=' + (IMG.ring_ar.v || 1); }
$('#arOpen').addEventListener('click', () => am.showModal());
$('#arClose').addEventListener('click', () => { arStop(); am.close(); });
am.addEventListener('close', arStop);
$$('[data-ar]').forEach(b => b.addEventListener('click', () => tone = b.dataset.ar));
async function arStart() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = 'Ihr Browser erlaubt keine Kamera. Probieren Sie es auf dem Handy.'; return; }
  arS.disabled = true; msg.textContent = 'Kamera wird gestartet …';
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    vid.srcObject = stream; await vid.play(); scr.classList.add('ar-on'); arX.hidden = false; msg.textContent = 'Handerkennung wird geladen …';
    if (!lm) {
      const v = await import(new URL('assets/vendor/mediapipe/vision_bundle.mjs', location.href).href);
      const fs = await v.FilesetResolver.forVisionTasks(new URL('assets/vendor/mediapipe/wasm', location.href).href);
      lm = await v.HandLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: new URL('assets/vendor/mediapipe/hand_landmarker.task', location.href).href, delegate: 'GPU' }, runningMode: 'VIDEO', numHands: 1 });
    }
    msg.textContent = 'Halten Sie Ihre Hand mit dem Handrücken zur Kamera.'; loop();
  } catch (e) { msg.textContent = 'Kamera nicht verfügbar oder nicht erlaubt.'; arStop(); }
  arS.disabled = false;
}
function arStop() { cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; scr.classList.remove('ar-on'); arX.hidden = true; cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); }
function drawRing(c, x, y, w, a) { c.save(); c.translate(x, y); c.rotate(a); c.filter = tone === 'white' ? 'saturate(0) brightness(1.18)' : tone === 'rose' ? 'hue-rotate(-18deg) saturate(1.35)' : 'none'; if (ringOk) { const sh = ringImg.height * .62, dh = w * sh / ringImg.width * .55; c.drawImage(ringImg, 0, 0, ringImg.width, sh, -w / 2, -dh * .62, w, dh); } c.restore(); }
let lastT = -1;
function loop() { raf = requestAnimationFrame(loop); if (!lm || vid.readyState < 2) return; if (cv.width !== vid.videoWidth) { cv.width = vid.videoWidth; cv.height = vid.videoHeight; } const t = performance.now(); if (t === lastT) return; lastT = t; const r = lm.detectForVideo(vid, t), c = cv.getContext('2d'); c.clearRect(0, 0, cv.width, cv.height); const h = r.landmarks && r.landmarks[0]; if (!h) return; const P = i => ({ x: h[i].x * cv.width, y: h[i].y * cv.height }); const a = P(13), b = P(14), k9 = P(9), k17 = P(17); drawRing(c, a.x + (b.x - a.x) * .38, a.y + (b.y - a.y) * .38, Math.hypot(k9.x - k17.x, k9.y - k17.y) * .72, Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2); }
arS.addEventListener('click', arStart); arX.addEventListener('click', arStop);
})();

/* Service: Uhren / Schmuck umschalten (Eugen 26.11.: Verkauf und Service getrennt) */
(() => { const box = document.getElementById('svcTabs'); if (!box) return;
  box.addEventListener('click', e => { const b = e.target.closest('[data-svc]'); if (!b) return;
    box.querySelectorAll('[data-svc]').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
    document.querySelectorAll('.svc-list').forEach(l => l.hidden = l.dataset.svc !== b.dataset.svc); }); })();
