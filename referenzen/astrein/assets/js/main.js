/* ASTREIN V3 – Die Schublade */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = window.IMG || {}, VID = window.VID || {};
const mobile = () => innerWidth < 900 && innerHeight > innerWidth;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* Firma per ?firma= */
const firma = new URLSearchParams(location.search).get('firma');
if (firma) { $$('.firma').forEach(e => e.textContent = firma.toUpperCase()); document.title = document.title.replace('ASTREIN', firma); }

/* Bilder: nur vorhandene laden, fehlende ausblenden (nie Platzhalter) */
function loadImgs() {
  $$('img[data-k]').forEach(im => {
    const e = IMG[im.dataset.k];
    if (!e) { im.hidden = true; return; }
    const src = mobile() && e.m && im.dataset.crop !== 'no' ? e.m : e.d;
    if (im.getAttribute('src') !== src) im.src = src;
    im.hidden = false;
  });
  $$('video[data-v]').forEach(v => {
    const e = VID[v.dataset.v];
    if (!e) { v.hidden = true; return; }
    const src = mobile() && e.m ? e.m : e.d;
    if (v.dataset.src !== src) { v.dataset.src = src; v.src = src; if (e.poster) v.poster = e.poster; }
    v.hidden = false;
  });
}
loadImgs();
addEventListener('resize', () => { loadImgs(); layoutSpots(); layoutTeam(); });

/* Kopfzeile, Burger, Demo */
const hdr = $('#hdr');
$('#burger').addEventListener('click', () => document.body.classList.toggle('open'));
$$('#menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('open')));
$('#demoX').addEventListener('click', e => e.target.parentElement.remove());

/* Position eines Bildpunkts (in % des Originalbilds) bei object-fit: cover */
function coverXY(img, px, py) {
  const W = img.clientWidth, H = img.clientHeight, w = img.naturalWidth || 16, h = img.naturalHeight || 9;
  const cs = getComputedStyle(img), contain = cs.objectFit === 'contain';
  const s = contain ? Math.min(W / w, H / h) : Math.max(W / w, H / h), dw = w * s, dh = h * s;
  const op = (cs.objectPosition || '50% 50%').split(' ').map(v => parseFloat(v) / 100);
  return [(W - dw) * op[0] + px / 100 * dw, (H - dh) * op[1] + py / 100 * dh];
}

/* ===== Kapitel 1: Holzproben ===== */
const WOOD = [
  { k: 'eiche', n: 'Eiche', lat: 'Quercus robur', x: 26.6, hb: [34, 41], rd: 690, t: 'Hart, zäh, lebhafte Maserung. Unser Allrounder für Tische, Treppen und Fronten.', use: 'Tische · Treppen · Fronten', sw: '#c9a57a' },
  { k: 'nuss', n: 'Nussbaum', lat: 'Juglans regia', x: 38, hb: [27, 56], rd: 640, t: 'Dunkel, warm, edel. Für Fronten und Furniere, die ins Auge fallen sollen.', use: 'Furnier · Fronten · Einzelstücke', sw: '#5a3c28' },
  { k: 'esche', n: 'Esche', lat: 'Fraxinus excelsior', x: 49.7, hb: [37, 41], rd: 690, t: 'Hell, elastisch, sehr hart. Ideal für Sitzmöbel und stark genutzte Flächen.', use: 'Stühle · Bänke · Arbeitsflächen', sw: '#e3d2b4' },
  { k: 'kirsche', n: 'Kirsche', lat: 'Prunus avium', x: 61.5, hb: [29, 31], rd: 600, t: 'Rötlich, dunkelt mit den Jahren nach. Wird mit dem Alter schöner.', use: 'Kommoden · Schränke', sw: '#b0643c' },
  { k: 'ahorn', n: 'Ahorn', lat: 'Acer pseudoplatanus', x: 73.1, hb: [27, 30], rd: 630, t: 'Fast weiß, feinporig, ruhig. Für helle, moderne Räume.', use: 'Kinderzimmer · helle Küchen', sw: '#ecdcc0' },
];
/* Lage im Foto (Prozent des Originalbilds): Proben 21–54 % hoch, je ≈ 9,6 % breit; freie Filzfläche darunter */
const SAMPLE = { y0: 21, y1: 54.5, w: 9.8 }, FELT = { x0: 19.5, x1: 80.5, y0: 58, y1: 85 };
const spots = $('#spots'), wcard = $('#wcard'), ah2 = $('img[data-k="ah2"]');
let curWood = -1;
spots.innerHTML = '<svg class="dim" id="dim" aria-hidden="true"><path fill-rule="evenodd"/></svg><div class="lift" id="lift" aria-hidden="true"></div><div class="felt" id="felt" aria-live="polite"></div>';
WOOD.forEach((w, i) => { const b = document.createElement('button'); b.className = 'sample'; b.setAttribute('aria-label', 'Holzprobe ' + w.n); b.innerHTML = '<i></i>'; b.addEventListener('click', () => showWood(i)); spots.appendChild(b); });
const feltBox = () => { const [x0, y0] = coverXY(ah2, FELT.x0, FELT.y0), [x1, y1] = coverXY(ah2, FELT.x1, FELT.y1); return [x0, y0, x1 - x0, y1 - y0]; };
const sampleBox = i => { const [x0, y0] = coverXY(ah2, WOOD[i].x - SAMPLE.w / 2, SAMPLE.y0), [x1, y1] = coverXY(ah2, WOOD[i].x + SAMPLE.w / 2, SAMPLE.y1); return [x0, y0, x1 - x0, y1 - y0]; };
const useFelt = () => { const [, , fw] = feltBox(); return fw >= 560; };
function layoutSpots() {
  if (!ah2 || ah2.hidden) return;
  $$('.sample', spots).forEach((b, i) => { const [x, y, w, h] = sampleBox(i); Object.assign(b.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); });
  const [fx, fy, fw, fh] = feltBox(), felt = $('#felt');
  Object.assign(felt.style, { left: fx + 'px', top: fy + 'px', width: fw + 'px', height: fh + 'px' });
  felt.hidden = !useFelt(); wcard.hidden = useFelt();
  if (curWood >= 0) placeLift(curWood);
}
function placeLift(i) {
  const [x, y, w, h] = sampleBox(i), W = spots.clientWidth, H = spots.clientHeight, r = 4;
  Object.assign($('#lift').style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
  const svg = $('#dim'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  $('path', svg).setAttribute('d', `M0 0H${W}V${H}H0Z M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`);
}
const bar = (lbl, val, unit, a, b, max) => `<div class="fbar"><span class="fl">${lbl}</span><span class="ft"><i style="--a:${a / max * 100}%;--b:${b / max * 100}%"></i></span><span class="fv mono" data-n="${val}">${val}</span><span class="fu">${unit}</span></div>`;
function showWood(i) {
  if (i === curWood) return; curWood = i; const w = WOOD[i];
  $$('.sample', spots).forEach((b, j) => b.classList.toggle('on', j === i));
  spots.classList.add('picked'); placeLift(i);
  const lift = $('#lift'); lift.classList.remove('go'); void lift.offsetWidth; lift.classList.add('go');
  const felt = $('#felt'); felt.classList.remove('in'); void felt.offsetWidth;
  felt.style.setProperty('--ox', (sampleBox(i)[0] + sampleBox(i)[2] / 2 - feltBox()[0]) + 'px');
  felt.innerHTML = `<div class="fcol fname"><p class="eyebrow">Probe ${i + 1} von 5</p><h3>${w.n}</h3><p class="lat">${w.lat}</p></div>
    <div class="fcol fdata">${bar('Härte', w.hb[0] === w.hb[1] ? w.hb[0] : w.hb[0] + '–' + w.hb[1], 'N/mm²', w.hb[0], w.hb[1], 60)}${bar('Rohdichte', '≈ ' + w.rd, 'kg/m³', 0, w.rd, 900)}<p class="fsrc">Richtwerte, Brinell quer zur Faser</p></div>
    <div class="fcol ftext"><p>${w.t}</p><p class="fuse">${w.use}</p><a class="more" href="#holzlabor">Im Holzlabor ansehen</a></div>`;
  $('a', felt).addEventListener('click', () => setWood(i));
  requestAnimationFrame(() => felt.classList.add('in'));
  wcard.innerHTML = `<p class="eyebrow">Probe ${i + 1} von 5</p><h3>${w.n}</h3><dl><dt>Härte</dt><dd class="mono">${w.hb[0]}–${w.hb[1]} N/mm²</dd><dt>Rohdichte</dt><dd class="mono">≈ ${w.rd} kg/m³</dd></dl><p>${w.t}</p><a class="more" href="#holzlabor">Im Holzlabor ansehen</a>`;
  $('a', wcard).addEventListener('click', () => setWood(i));
}
ah2 && ah2.addEventListener('load', layoutSpots);
/* erste Probe öffnet sich, sobald die Schublade im Bild ist */
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { layoutSpots(); setTimeout(() => showWood(0), 500); o.disconnect(); } }), { threshold: .5 }).observe($('#holz .pin'));

/* Konfigurator: Holz und Oberfläche wechseln mit einem Wisch wie ein Tuch über die Front */
const konfImg = $('#konfImg'), FIN = [
  { k: 'oel', p: 'ak', n: 'Geölt', d: 'Offenporig und warm, die Maserung wird tiefer. Wasser zieht nach einer Weile ein – Flecken lassen sich ausschleifen und nachölen.' },
  { k: 'lack', p: 'akl', n: 'Matt lackiert', d: 'Geschlossene, seidige Oberfläche mit leichtem Schimmer. Wasser perlt ab – pflegeleicht für Küchen und Bäder.' },
  { k: 'seife', p: 'aks', n: 'Geseift', d: 'Hell, trocken und samtig matt wie frisch geschliffen. Gepflegt mit Seifenlauge, Wasser zieht langsam ein.' },
];
let curFin = 0, curK = 0;
/* echte Fotos je Holz × Oberfläche: ak<n> geölt, akl<n> matt lackiert, aks<n> geseift */
if (!IMG.ak1) konfImg.hidden = true;
konfImg.innerHTML = '<img class="kbase" alt=""><div class="klbl"><b></b><span></span></div>';
const kbase = $('.kbase', konfImg);
function kSrc(i) { const e = IMG[FIN[curFin].p + (i + 1)] || IMG['ak' + (i + 1)] || IMG.ak1 || {}; return e.d; }
function kApply(img) { konfImg.dataset.fin = FIN[curFin].k; }
/* alle 15 Fotos vorladen, damit der Wisch sofort sitzt */
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { FIN.forEach(f => WOOD.forEach((w, i) => { const e = IMG[f.p + (i + 1)]; if (e) (new Image()).src = e.d; })); o.disconnect(); } }, { rootMargin: '600px' }).observe(konfImg);
function kLabel() { $('.klbl b', konfImg).textContent = WOOD[curK].n; $('.klbl span', konfImg).textContent = FIN[curFin].n; const l = $('.klbl', konfImg); l.classList.remove('in'); void l.offsetWidth; l.classList.add('in'); }
function kWipe() {
  const top = document.createElement('img'); top.className = 'kwipe'; top.alt = 'Sideboard in ' + WOOD[curK].n + ', ' + FIN[curFin].n; top.src = kSrc(curK); kApply(top);
  const cloth = document.createElement('i'); cloth.className = 'kcloth'; konfImg.style.setProperty('--kw', konfImg.clientWidth + 'px');
  konfImg.appendChild(top); konfImg.appendChild(cloth);
  requestAnimationFrame(() => requestAnimationFrame(() => { top.classList.add('go'); cloth.classList.add('go'); }));
  setTimeout(() => { kbase.src = top.src; kbase.alt = top.alt; kApply(kbase); top.remove(); cloth.remove(); }, 1250);
  kLabel();
}
kbase.src = kSrc(0); kbase.alt = 'Sideboard in Eiche, geölt'; kApply(kbase);
WOOD.forEach((w, i) => { const b = document.createElement('button'); b.className = 'chip' + (i ? '' : ' on'); b.innerHTML = `<span class="sw" style="background:${w.sw}"></span>${w.n}`; b.addEventListener('click', () => setWood(i)); $('#konfWood').appendChild(b); });
FIN.forEach((f, i) => { const b = document.createElement('button'); b.className = 'chip' + (i ? '' : ' on'); b.textContent = f.n; b.addEventListener('click', () => setFin(i)); $('#konfFinish').appendChild(b); });
function setWood(i) { if (i === curK) return; curK = i; $$('#konfWood .chip').forEach((b, j) => b.classList.toggle('on', j === i)); kWipe(); dropWood(); }
function setFin(i, quiet) { curFin = i; $$('#konfFinish .chip').forEach((b, j) => b.classList.toggle('on', j === i)); $('#finTxt').textContent = FIN[i].d; if (!quiet) kWipe(); dropGo(); }
const drop = $('#drop');
function dropWood() { drop.style.setProperty('--wood', WOOD[curK].sw); }
function dropGo() { drop.className = 'drop'; void drop.offsetWidth; drop.classList.add('go', FIN[curFin].k); $('#dropTxt').textContent = FIN[curFin].k === 'lack' ? 'perlt ab' : FIN[curFin].k === 'oel' ? 'zieht ein' : 'zieht langsam ein'; }
drop.addEventListener('click', dropGo);
dropWood(); setFin(0, true); kLabel();

/* Brinell-Balken */
const HB = [['Esche', 39], ['Eiche', 37], ['Buche', 33], ['Kirsche', 30], ['Ahorn', 28], ['Kiefer', 19], ['Fichte', 12]];
$('#bars').innerHTML = HB.map(([n, v]) => `<div class="bar"><span>${n}</span><span class="t"><i data-w="${v / 42 * 100}"></i></span><span class="v">≈ ${v}</span></div>`).join('');
/* Holz-arbeitet-Rechner: 90 cm Eiche, tangential 0,34 %/% ab 8 % */
const fe = $('#feuchte');
function calc() { const u = +fe.value, mm = 900 * 0.0034 * (u - 8); $('#hfOut').textContent = u + ' %'; $('#mmOut').textContent = (mm >= 0 ? '+' : '−') + Math.abs(mm).toFixed(0) + ' mm'; $('#plank').style.width = (80 + mm / 900 * 100 * 2.2) + '%'; }
fe.addEventListener('input', calc); calc();

/* Team-Badges + Personen */
const TEAM = [
  { n: 'LINA', x: 56.1, y: 52.7, role: 'CNC-Programmiererin', t: 'Seit 4 Jahren dabei, Gesellin, macht gerade den CNC-Fachkraft-Schein.', px: 73.5 },
  { n: 'JONAS', x: 69.8, y: 52.7, role: 'Furnier & Oberfläche', t: 'Gesellenstück: Nussbaum-Kommode. Liebt gespiegelte Furniere.', px: 60.3 },
  { n: 'MELI', x: 56.4, y: 66.9, role: 'Azubi, 2. Lehrjahr', t: 'Vorher Abi, dann Tischlerei statt Hörsaal. Ihr Gesellenstück entsteht gerade – siehe „Was du lernst“.', px: 48.8 },
  { n: 'TIMO', x: 70.1, y: 66.9, role: 'Montage', t: 'Baut beim Kunden ein. Seine Schattenfugen sind gleich breit. Immer.', px: 85 },
];
const teamA = $('#teamA'), teamB = $('#teamB'), badges = $('#badges'), people = $('#people');
TEAM.forEach(p => { const b = document.createElement('span'); b.className = 'badge'; b.textContent = p.n;  badges.appendChild(b);
  const d = document.createElement('div'); d.className = 'person'; d.innerHTML = `<div class="pc"><b>${p.n[0] + p.n.slice(1).toLowerCase()}</b>${p.role}<br>${p.t}</div><button>${p.n[0] + p.n.slice(1).toLowerCase()}</button>`; $('button', d).addEventListener('click', () => { $$('.person').forEach(x => x !== d && x.classList.remove('open')); d.classList.toggle('open'); }); people.appendChild(d); });
function layoutTeam() {
  if (teamA && !teamA.hidden) { const [x0] = coverXY(teamA, 0, 0), [x1] = coverXY(teamA, 100, 0), iw = x1 - x0; $$('.badge', badges).forEach((b, i) => { const [x, y] = coverXY(teamA, TEAM[i].x, TEAM[i].y); b.style.left = x + 'px'; b.style.top = y + 'px'; b.style.fontSize = Math.max(11, iw * 0.0125) + 'px'; }); }
  const row = innerWidth < 900 && innerHeight > innerWidth; people.classList.toggle('row', row);
  if (row && teamB && !teamB.hidden) { const [, yb] = coverXY(teamB, 0, 100); people.style.top = Math.max(0, yb - 58) + 'px'; } else people.style.top = '';
  if (!row && teamB && !teamB.hidden) $$('.person', people).forEach((d, i) => { const [x, y] = coverXY(teamB, TEAM[i].px, 62); d.style.left = x + 'px'; d.style.top = Math.min(y, innerHeight - 140) + 'px'; });
}
/* Lohnkarten in Schublade 5 (Tarif Berlin 2026) */
const PAYL = [['Azubi · 1. Jahr', '810 €', 32, 35.6], ['Azubi · 2. Jahr', '900 €', 50, 35.6], ['Azubi · 3. Jahr', '1.050 €', 68.1, 35.6], ['Geselle', '16,97 €/h', 30.9, 57.6], ['CNC-Fachkraft', '23,76 €/h', 50, 57.6], ['Meister', 'bis 29,70 €/h', 69, 57.6]];
const payImg = $('#payImg'), payLbl = $('#payLbl');
PAYL.forEach(([a, b]) => { const d = document.createElement('span'); d.className = 'badge paylbl'; d.innerHTML = `<small>${a}</small>${b}`; payLbl.appendChild(d); });
function layoutPay() { if (!payImg || payImg.hidden) return; const [x0] = coverXY(payImg, 0, 0), [x1] = coverXY(payImg, 100, 0), iw = x1 - x0; $$('.paylbl', payLbl).forEach((d, i) => { const [x, y] = coverXY(payImg, PAYL[i][2], PAYL[i][3]); d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.fontSize = Math.max(12, iw * 0.019) + 'px'; }); }
payImg && payImg.addEventListener('load', layoutPay); addEventListener('resize', layoutPay);
const vort = $('#vorteile');
teamA && teamA.addEventListener('load', layoutTeam); teamB && teamB.addEventListener('load', layoutTeam);

/* Lohnrechner (Tarif Tischlerhandwerk Berlin ab 01.01.2026) */
const LOHN = [
  ['Azubi 1. Jahr (fest)', 0, 810], ['Azubi 2. Jahr (fest)', 0, 900], ['Azubi 3. Jahr (fest)', 0, 1050],
  ['Geselle ohne Erfahrung · EG 3.1', 14.76], ['Geselle nach 12 Monaten · EG 3.2', 16.12], ['Geselle · Eckentgelt EG 3.3', 16.97],
  ['Facharbeit mit Zusatzkenntnissen · EG 4', 18.67], ['Teamleitung · EG 5', 21.21], ['CNC-Fachkraft / Techniker · EG 6', 23.76], ['Meister mit Erfahrung · EG 7', 26.30], ['Meister mit Leitung · EG 8', 29.70],
];
const st = $('#lrStufe'), sd = $('#lrStd');
st.innerHTML = LOHN.map((l, i) => `<option value="${i}" ${i === 5 ? 'selected' : ''}>${l[0]}</option>`).join('');
const eur = v => v.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
function lohn() { const l = LOHN[+st.value]; sd.disabled = !!l[2]; $('#lrOut').textContent = l[2] ? eur(l[2]) : eur(l[1] * (+sd.value || 38.5) * 4.35); }
st.addEventListener('change', lohn); sd.addEventListener('input', lohn); lohn();

/* Formulare (senden nichts) */
$$('.seg .chip').forEach(b => b.addEventListener('click', () => { $$('.chip', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); }));
$$('form').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); f.classList.add('sent'); }));

/* Postkarten (Beispiele) */
const POST = [
  ['Das Sideboard ist genau so geworden, wie wir es uns vorgestellt haben. Jeden Tag schön.', -2],
  ['Endlich Stauraum unter der Treppe – und man sieht keine einzige Schraube.', 1.5],
  ['Von der ersten Skizze bis zur Montage: pünktlich, sauber, freundlich.', -1],
  ['Die Holzmuster zum Anfassen haben uns die Entscheidung leicht gemacht.', 2],
];
const posts = $('#posts');
POST.forEach(([t, r], i) => { const d = document.createElement('div'); d.className = 'post' + (i ? '' : ' on'); d.style.setProperty('--r', r + 'deg'); d.innerHTML = `${t}<small>Beispiel · noch keine echte Bewertung</small>`; posts.appendChild(d); });
let pi = 0; setInterval(() => { const p = $$('.post', posts); p[pi].classList.remove('on'); pi = (pi + 1) % p.length; p[pi].classList.add('on'); }, 5200);

/* A4-Maßstab-Werkzeug (läuft nur im Browser) */
const a4file = $('#a4file'), a4 = $('#a4'), a4out = $('#a4out');
a4file.addEventListener('change', () => {
  const f = a4file.files[0]; if (!f) return; const im = new Image();
  im.onload = () => {
    const cv = document.createElement('canvas'), sc = Math.min(1, 1600 / im.width); cv.width = im.width * sc; cv.height = im.height * sc;
    const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, cv.width, cv.height); a4.innerHTML = ''; a4.appendChild(cv);
    const pts = [];
    const draw = () => { cx.drawImage(im, 0, 0, cv.width, cv.height); cx.lineWidth = 4 / sc * sc * 2; pts.forEach((p, i) => { cx.fillStyle = i < 2 ? '#f3c27a' : '#7CFF6B'; cx.beginPath(); cx.arc(p[0], p[1], 10, 0, 7); cx.fill(); }); for (let i = 0; i + 1 < pts.length; i += 2) { cx.strokeStyle = i ? '#7CFF6B' : '#f3c27a'; cx.beginPath(); cx.moveTo(...pts[i]); cx.lineTo(...pts[i + 1]); cx.stroke(); } };
    cv.addEventListener('pointerdown', e => {
      const r = cv.getBoundingClientRect(); if (pts.length >= 4) pts.length = 0;
      pts.push([(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]); draw();
      const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (pts.length === 2) a4out.textContent = 'Gut. Jetzt Anfang und Ende der Nische antippen.';
      if (pts.length === 4) { const cm = d(pts[2], pts[3]) / d(pts[0], pts[1]) * 29.7; a4out.textContent = `Geschätzt: ca. ${Math.round(cm)} cm (± 10 %, je nach Blickwinkel). Wir übernehmen das ins Formular.`; $('#anfMasse').value = `ca. ${Math.round(cm)} cm breit (A4-Schätzung)`; }
    });
    a4out.textContent = 'Tippen Sie die beiden Enden der langen Kante des A4-Blatts an.';
  };
  im.src = URL.createObjectURL(f);
});

/* ===== Scroll-Motor ===== */
const prog = el => { const r = el.getBoundingClientRect(), h = el.offsetHeight - innerHeight; return h > 0 ? clamp(-r.top / h) : (r.top < innerHeight / 2 ? 1 : 0); };
const scrub = (v, p) => { if (!v || v.hidden || !v.duration) return; const t = p * (v.duration - .05); if (Math.abs(v.currentTime - t) > .03) v.currentTime = t; };

const hero = $('#hero'), heroImg = $('img', hero), heroVid = $('video', hero), glow = $('#heroGlow'), flash = $('#heroFlash'), heroCopy = $('.copy', hero);
const makro = $('#makro'), makroImg = $('#makroImg'), planPath = $('#planPath'), makroTxt = $('#makroTxt');
const planen = $('#planen'), planA = $('#planA'), planB = $('#planB'), planVid = $('video', planen);
const ums = $('#umsetzen'), umsVid = $('video', ums), toolPath = $('#toolPath');
const team = $('#team');

/* Pfade: Hirnholz-Jahrringe (Bögen) → Nischen-Zeichnung */
const N = 7;
const ringPath = t => { let d = ''; for (let i = 0; i < N; i++) { const r = 140 + i * 95; const k = t; // t=0 Bögen, t=1 Rechtecke/Schräge
  const x0 = 800 - r, x1 = 800 + r, y = 820 - i * 8; const ty = 820 - r * .9;
  const cx = 800, sy = 820 - (180 + i * 70); const slope = 380 + i * 60;
  // gemischter Pfad: Bogen ↔ Nischen-Polygon
  const ax = x0 * (1 - k) + (220 + i * 30) * k, ay = y * (1 - k) + 820 * k;
  const bx = cx * (1 - k) + (220 + i * 30) * k, by = ty * (1 - k) + sy * k;
  const cxp = x1 * (1 - k) + (1380 - i * 30) * k, cyp = y * (1 - k) + (sy + slope) * (k) + 0;
  d += `M${ax},${ay} Q${bx},${by} ${cxp},${Math.min(cyp, 820)} `; } return d; };
const toolD = (() => { let d = ''; for (let i = 0; i < 6; i++) { const x = 160 + i * 230, y = 470 + (i % 2) * 40; d += `M${x},${y} h180 v${200 - (i % 3) * 30} h-180 Z `; } return d; })();
toolPath.setAttribute('d', toolD);
const tLen = 6 * (360 + 2 * 200);
toolPath.style.strokeDasharray = tLen; toolPath.style.strokeDashoffset = tLen;

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); if (e.target.id === 'paycards') $$('.pay', e.target).forEach((p, i) => setTimeout(() => p.classList.add('in'), i * 120)); if (e.target.id === 'bars') $$('.bar i', e.target).forEach(i => i.style.width = i.dataset.w + '%'); if (e.target.id === 'track') { const s = $$('.step', e.target); s.forEach((x, i) => setTimeout(() => x.classList.toggle('on', i < 3), 300 + i * 250)); $('#trackFill').style.width = '40%'; } } }), { threshold: .25 });
['#paycards', '#bars', '#track'].forEach(s => $(s) && io.observe($(s)));
const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (v.hidden) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }), { threshold: .3 });
$$('.vcard video').forEach(v => vio.observe(v));

const chapters = $$('[data-ch]'), komLinks = $$('#kom a');
let lastCh = -1;
function frame() {
  const y = scrollY;
  hdr.classList.toggle('solid', y > innerHeight * .5);
  /* Hero: Schublade fährt auf (Video) bzw. Zoom in die leuchtende Schublade */
  const p0 = prog(hero);
  if (heroVid && !heroVid.hidden && heroVid.duration) { if (!heroVid.dataset.auto) scrub(heroVid, clamp(p0 / .8)); heroImg.style.opacity = p0 > .02 ? 0 : 1; }
  else heroImg.style.transform = `scale(${1 + ease(clamp(p0 / .9)) * 1.6})`;
  heroImg.style.transformOrigin = '30% 26%';
  glow.style.opacity = clamp((p0 - .2) / .6);
  flash.style.opacity = clamp((p0 - .82) / .18);
  heroCopy.style.opacity = 1 - clamp(p0 / .25);
  /* Makro: Zoom ins Hirnholz, Linien ziehen sich zur Nische */
  const pm = prog(makro);
  makroImg.style.transform = `scale(${1.25 - .25 * clamp(pm / .4)})`;
  const k = ease(clamp((pm - .3) / .55));
  planPath.setAttribute('d', ringPath(k));
  planPath.style.opacity = clamp((pm - .1) / .2);
  makroImg.style.opacity = 1 - clamp((pm - .55) / .35) * .85;
  makroTxt.innerHTML = k > .5 ? 'Und jede Linie<br>wird ein Maß.' : 'Jeder Jahrring<br>wird eine Linie.';
  /* Planen: Schublade → Laser-Film */
  const pp = prog(planen);
  planB.style.opacity = clamp((pp - .25) / .15);
  if (planVid && !planVid.hidden && planVid.duration) { planVid.style.opacity = clamp((pp - .3) / .1); scrub(planVid, clamp((pp - .3) / .6)); }
  /* Umsetzen: Fräsbahn zeichnet sich, CNC-Film */
  const pu = prog(ums);
  toolPath.style.strokeDashoffset = tLen * (1 - clamp(pu / .45));
  toolPath.style.opacity = 1 - clamp((pu - .5) / .2);
  if (umsVid && !umsVid.hidden && umsVid.duration) { umsVid.style.opacity = clamp((pu - .35) / .15); scrub(umsVid, clamp((pu - .35) / .6)); }
  /* Team: Schublade mit Schildern → Porträt */
  const pt = prog(team);
  $$('.badge', badges).forEach((b, i) => b.classList.toggle('in', pt > .08 + i * .06 && pt < .5));
  teamB.style.opacity = clamp((pt - .45) / .15);
  people.style.opacity = clamp((pt - .6) / .1);
  people.style.pointerEvents = pt > .6 ? 'auto' : 'none';
  $('#teamH').textContent = pt > .5 ? 'Lina, Jonas, Meli, Timo.' : 'Vier Namen. Ein Anspruch.';
  const pv = prog(vort); $$('.paylbl', payLbl).forEach((d, i) => d.classList.toggle('in', pv > .05 + i * .07));
  /* aktives Kapitel → Kommode */
  let ch = 0; chapters.forEach(c => { if (c.getBoundingClientRect().top < innerHeight * .5) ch = +c.dataset.ch; });
  if (ch !== lastCh) { komLinks.forEach(a => a.classList.toggle('on', +a.dataset.n === ch)); lastCh = ch; }
  /* Footer: Schubladen schließen */
  const f = $('#foot').getBoundingClientRect(); const pf = clamp(1 - (f.top - innerHeight * .3) / (innerHeight * .6));
  $$('#fronts i').forEach((x, i) => x.style.setProperty('--o', ((1 - pf) * (40 + i * 18) * (i % 2 ? 1 : -1)).toFixed(1)));
  $('#kom').style.opacity = f.top < innerHeight * .7 ? 0 : 1;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
/* Hero-Video läuft beim Laden kurz an (Aktion ab Sekunde 1) */
if (heroVid && !heroVid.hidden) heroVid.addEventListener('loadedmetadata', () => { if (scrollY < 10) { heroVid.dataset.auto = 1; heroVid.play().catch(() => {}); setTimeout(() => { heroVid.pause(); heroVid.currentTime = 0; delete heroVid.dataset.auto; }, 1200); } }, { once: true });
})();
