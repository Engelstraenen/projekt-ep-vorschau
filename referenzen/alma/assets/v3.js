(() => {
'use strict';
const gsap = window.gsap;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mq = matchMedia('(max-width: 800px)');
let MOB = mq.matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eo = t => 1 - Math.pow(1 - t, 3);
const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const N = 10, F = 25, W = 0.14; // Kapitel, Frames je Kapitel, halbe Übergangsbreite
const NAMES = ['Kirsche','Ernte','Auf dem Band','Sortiert','In Jute','Richtung Hafen','Schiff','Röstung','Mühle','Tasse'];
const STATES = ['Kirsche','Geöffnet','Rohbohne','Sortiert','Im Jutesack','Unterwegs','Auf See','Geröstet','Gemahlen','Crema'];
const ACC = ['#e0453a','#e8623c','#a9c46c','#cfd77e','#d2a868','#f0a24a','#6fb3db','#ef7a2e','#c99a62','#e0a465'];
const OBJ = [0,1,2,2,3,3,3,4,6,7]; // Bild je Kapitel (Röstung blendet 4 -> 5)
// Position des Objekts je Kapitel: x,y (Anteil Viewport), Skala, Neigung
const POS_D = Array(10).fill([.5,.46,.92,0]);
const POS_M = Array(10).fill([.5,.42,.78,0]);

const root = document.documentElement, body = document.body;
const cv = $('.film'), ctx = cv.getContext('2d', { alpha: false });
const track = $('.film-track'), chs = $$('.ch'), rail = $$('.rail a');
const obj = $('.obj'), objI = $$('.obj__i'), objSt = $('.obj__st'), objNo = $('.obj__no');
const wm = $('.wm'), tcN = $('.tc__n'), tcC = $('.tc__c'), tcB = $('.top__tc b');

/* ---------- Frames ---------- */
let frames = [], dir = '';
function setupFrames() {
  dir = MOB ? 'm' : 'd';
  frames = Array.from({ length: N * F }, (_, i) => ({ src: `film/v3/${dir}/${String(i + 1).padStart(3, '0')}.webp`, img: null, ok: false }));
}
function load(i) {
  const f = frames[i]; if (!f || f.img) return Promise.resolve();
  return new Promise(res => { const im = new Image(); im.decoding = 'async'; f.img = im;
    im.onload = () => { f.ok = true; res(); dirty = true; }; im.onerror = res; im.src = f.src; });
}
let loadCh = 0;
async function loader() {
  const done = new Set();
  const next = () => { // Kapitel nach Nähe zum aktuellen
    for (let d = 0; d < N; d++) for (const c of [loadCh + d, loadCh - d]) if (c >= 0 && c < N && !done.has(c)) return c;
    return -1;
  };
  for (;;) { const c = next(); if (c < 0) break; done.add(c);
    const idx = []; for (let k = 0; k < F; k += 3) idx.push(c * F + k); for (let k = 0; k < F; k++) if (k % 3) idx.push(c * F + k);
    for (let j = 0; j < idx.length; j += 5) await Promise.all(idx.slice(j, j + 5).map(load)); }
}
function frameAt(p) { // p global 0..N
  const c = clamp(Math.floor(p), 0, N - 1), t = clamp(p - c);
  let i = c * F + Math.round(t * (F - 1));
  if (frames[i] && frames[i].ok) return frames[i].img;
  for (let d = 1; d < F; d++) for (const j of [i - d, i + d]) if (j >= c * F && j < (c + 1) * F && frames[j].ok) return frames[j].img;
  return null;
}

/* ---------- Canvas ---------- */
let cw = 0, ch = 0;
function size() {
  const dpr = Math.min(devicePixelRatio || 1, MOB ? 2 : 1.5);
  cw = cv.width = Math.round(innerWidth * dpr); ch = cv.height = Math.round(innerHeight * dpr); dirty = true;
}
function img(im, o = {}) {
  if (!im) return;
  const s = Math.max(cw / im.width, ch / im.height) * (o.s || 1);
  const w = im.width * s, h = im.height * s;
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  ctx.translate(cw / 2 + (o.x || 0), ch / 2 + (o.y || 0)); if (o.r) ctx.rotate(o.r);
  ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
}
const fill = (c, a, op) => { ctx.save(); ctx.globalAlpha = a; if (op) ctx.globalCompositeOperation = op; ctx.fillStyle = c; ctx.fillRect(0, 0, cw, ch); ctx.restore(); };
const acc = b => ACC[b];
// Übergänge: b = Index des neuen Kapitels (1..9), u = 0..1
const TX = {
  1(A, B, u) { // Zoom durch die Kirsche
    img(A, { s: 1 + eio(u) * 1.8, a: 1 }); fill('#1a0503', clamp(u * 1.6) * .5);
    img(B, { s: 1.35 - .35 * eo(u), a: clamp((u - .35) / .5) });
  },
  2(A, B, u) { // Reißschwenk nach rechts
    const e = eio(u), d = cw * 1.1;
    for (let g = 0; g < 6; g++) { const o = g * cw * .03 * Math.sin(Math.PI * u);
      img(A, { x: -e * d - o, a: g ? .18 : 1 }); img(B, { x: (1 - e) * d + o, a: g ? .18 : 1 }); }
  },
  3(A, B, u) { // Lamellen wie Sortiersiebe
    img(A, { s: 1 + u * .06 }); const n = MOB ? 5 : 9, sw = cw / n;
    for (let k = 0; k < n; k++) { const l = eo(clamp(u * 1.7 - k * .07));
      if (l <= 0) continue; ctx.save(); ctx.beginPath(); ctx.rect(k * sw, 0, sw + 1, ch * l); ctx.clip(); img(B, { s: 1.06 - .06 * l }); ctx.restore();
      ctx.fillStyle = acc(3); ctx.fillRect(k * sw, ch * l - 2, sw + 1, l < 1 ? 2 : 0); }
  },
  4(A, B, u) { // Iris-Maske, rund wie die Sacköffnung
    img(A, { s: 1 + u * .2 }); const r = eio(u) * Math.hypot(cw, ch) * .6;
    ctx.save(); ctx.beginPath(); ctx.arc(cw * .5, ch * .5, r, 0, 7); ctx.clip(); img(B, { s: 1.2 - .2 * u }); ctx.restore();
    ctx.save(); ctx.strokeStyle = acc(4); ctx.lineWidth = 2; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(cw * .5, ch * .5, r, 0, 7); ctx.stroke(); ctx.restore();
  },
  5(A, B, u) { // Kran hebt: Bild schiebt nach oben
    const e = eio(u); img(A, { y: -e * ch, s: 1 + e * .1 }); img(B, { y: (1 - e) * ch });
    ctx.fillStyle = acc(5); ctx.fillRect(0, (1 - e) * ch - 1, cw, 2);
  },
  6(A, B, u) { // Farbumschlag Meerblau + Diagonal-Wipe
    img(A); fill('#0d3550', clamp(u * 2) * .85, 'multiply');
    const e = eio(clamp((u - .2) / .8)), x = lerp(-cw * .4, cw * 1.4, e);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-cw, 0); ctx.lineTo(x + cw * .2, 0); ctx.lineTo(x - cw * .2, ch); ctx.lineTo(-cw, ch); ctx.clip(); img(B, { s: 1.1 - .1 * e }); ctx.restore();
  },
  7(A, B, u) { // Hitzeblitz
    const bell = Math.sin(Math.PI * u);
    if (u < .5) img(A, { s: 1 + u * .3 }); else img(B, { s: 1.12 - .12 * eo((u - .5) * 2) });
    fill('#ff7a1a', bell * .75, 'screen'); fill('#fff1d6', Math.pow(bell, 6) * .7, 'lighter');
  },
  8(A, B, u) { // Spiral-Zoom wie das Mahlwerk
    const e = eio(u);
    img(A, { s: 1 + e * 1.2, r: e * .5, a: 1 }); img(B, { s: 1.9 - .9 * e, r: -(1 - e) * .5, a: clamp(e * 1.4 - .2) });
  },
  9(A, B, u) { // Tropfen fällt, Fläche läuft voll
    img(A); const e = eio(u), cx = cw * .5, cy = lerp(-ch * .1, ch * .55, eo(clamp(u * 1.6))), R = e * Math.hypot(cw, ch) * .75 + 4;
    ctx.save(); ctx.beginPath();
    for (let k = 0; k <= 64; k++) { const a = k / 64 * Math.PI * 2, rr = R * (1 + .05 * Math.sin(a * 7 + u * 12) * (1 - e));
      const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * (a > Math.PI ? 1.25 : 1); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.clip(); img(B, { s: 1.15 - .15 * e }); ctx.restore();
  }
};
let P = -1, tP = -1, dirty = true;
function render() {
  if (P < 0) { img(frameAt(0), { s: 1 + Math.min(1, -P) * .08 }) || 0; return; }
  const b = Math.round(P);
  if (b >= 1 && b <= N - 1 && Math.abs(P - b) < W) {
    const u = (P - (b - W)) / (2 * W), A = frameAt(b - .001), B = frameAt(b);
    if (A && B) { if (RM) { img(A); img(B, { a: u }); } else TX[b](A, B, u); return; }
  }
  const f = frameAt(P); if (f) img(f);
}

/* ---------- Text & HUD ---------- */
function split(h) {
  const walk = (n, em) => { const out = [];
    n.childNodes.forEach(c => { if (c.nodeType === 3) c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) out.push(document.createTextNode(' ')); else { const s = document.createElement('span'); s.className = 'w'; const i = document.createElement('span'); i.textContent = w; s.append(i); out.push(s); } });
      else if (c.nodeType === 1) { const e = c.cloneNode(false); walk(c).forEach(x => e.append(x)); out.push(e); } });
    return out; };
  const parts = walk(h); h.textContent = ''; parts.forEach(p => h.append(p));
}
$$('.ch__h').forEach(split);
// SVG-Skalen erzeugen
const NS = 'http://www.w3.org/2000/svg', el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
$$('.alt__ticks').forEach(g => { for (let m = 0; m <= 2000; m += 250) { const y = 300 - m / 2000 * 300; g.append(el('line', { x1: 0, x2: m % 1000 ? 6 : 12, y1: y, y2: y })); if (!(m % 1000)) { const t = el('text', { x: 16, y: y + 3 }); t.textContent = m; g.append(t); } } });
$$('.gauge__ticks').forEach(g => { for (let k = 0; k <= 20; k++) { const a = Math.PI * (1 - k / 20), r1 = 72, r2 = k % 5 ? 66 : 60; g.append(el('line', { x1: 100 + Math.cos(a) * r1, y1: 104 - Math.sin(a) * r1, x2: 100 + Math.cos(a) * r2, y2: 104 - Math.sin(a) * r2 })); } });
$$('.ring__t').forEach(g => { for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; g.append(el('line', { x1: 80 + Math.cos(a) * 74, y1: 80 + Math.sin(a) * 74, x2: 80 + Math.cos(a) * (k % 10 ? 76 : 79), y2: 80 + Math.sin(a) * (k % 10 ? 76 : 79) })); } });
$$('.map__grid').forEach(g => { for (let x = 0; x <= 360; x += 30) g.append(el('line', { x1: x, x2: x, y1: 0, y2: 200 })); for (let y = 0; y <= 200; y += 30) g.append(el('line', { x1: 0, x2: 360, y1: y, y2: y })); });
$$('.curve__grid').forEach(g => { [60, 120, 180, 240].forEach(T => { const y = 10 + (240 - T) / 1.2; g.append(el('line', { x1: 10, x2: 310, y1: y, y2: y })); const t = el('text', { x: 0, y: y - 3 }); t.textContent = T + '°'; g.append(t); }); });

const fmt = (v, b) => b.dataset.dec ? v.toFixed(1).replace('.', ',') : b.dataset.sep ? Math.round(v).toLocaleString('de-DE') : String(Math.round(v));
function hud(c, t) {
  const a = chs[c]; if (!a) return; const e = eo(clamp((t - .08) / .62));
  a.style.setProperty('--hp', (t * 100).toFixed(1) + '%');
  $$('.hud', a).forEach(h => h.style.setProperty('--hp', (t * 100).toFixed(1) + '%'));
  $$('.hv b[data-to]', a).forEach(b => b.textContent = fmt(lerp(+(b.dataset.from || 0), +b.dataset.to, e), b));
  const q = s => $(s, a);
  if (c === 0) { q('.alt__mk').setAttribute('transform', `translate(0 ${300 - e * 1850 / 2000 * 300})`); $$('.months i', a).forEach((m, k) => m.classList.toggle('on', k < Math.round(e * 9))); }
  if (c === 1 || c === 9) q('.ring__p').style.strokeDasharray = `${(c === 1 ? 96 : 100) * e} 100`;
  if (c === 2) { const v = lerp(60, 11, e); q('.gauge__p').style.strokeDasharray = `${v} 100`; q('.gauge__n').style.transform = `rotate(${-90 + v * 1.8}deg)`; $$('.flow i', a).forEach(i => i.style.setProperty('--fx', (-((t * 400) % 24)) + 'px')); }
  if (c === 3) q('.bars').style.setProperty('--bp', e);
  if (c === 4) { q('.scale__fill').style.transform = `scaleX(${e * .875})`; const ty = q('.type'), s = ty.dataset.text; ty.textContent = s.slice(0, Math.round(e * s.length)); }
  if (c === 5 || c === 6) { const r1 = q('.map__r1'), r2 = q('.map__r2'), d = q('.map__dot');
    const e1 = c === 5 ? e : 1, e2 = c === 6 ? e : 0; r1.style.strokeDasharray = `${e1 * 100} 100`; r2.style.strokeDasharray = `${e2 * 100} 100`;
    const pth = c === 5 ? r1 : r2, L = pth.getTotalLength(), pt = pth.getPointAtLength(L * (c === 5 ? e1 : e2)); d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y); }
  if (c === 7) { const p = q('.curve__p'), L = p.getTotalLength(), pt = p.getPointAtLength(L * e); p.style.strokeDasharray = `${e * 100} 100`;
    const dot = q('.curve__dot'); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    q('.tempv').textContent = Math.round(240 - (pt.y - 10) * 1.2); const s = Math.round(e * 720); q('.timev').textContent = `${String(s / 60 | 0).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    q('.curve__fc').classList.toggle('on', pt.x >= 232); q('.roast').style.setProperty('--rp', (e * 96) + '%'); }
  if (c === 8) q('.grind').style.setProperty('--gp', lerp(100, 12, e) + '%');
}
let cur = -1;
function enter(c, dirn) {
  chs.forEach((a, i) => a.classList.toggle('is-on', i === c || i === cur));
  const old = chs[cur], nu = chs[c]; cur = c; loadCh = c;
  rail.forEach((r, i) => r.classList.toggle('on', i === c));
  root.style.setProperty('--acc', ACC[c]);
  tcN.textContent = String(c + 1).padStart(2, '0'); tcC.textContent = NAMES[c];
  objSt.textContent = STATES[c]; objNo.textContent = 'Zustand ' + String(c + 1).padStart(2, '0');
  wm.textContent = NAMES[c];
  if (RM || !gsap) {
    if (old && old !== nu) old.classList.remove('is-on');
    gsap.set([nu, $('.ch__k', nu), $('.ch__lead', nu), $('.ch__h', nu), ...$$('.hud', nu), wm], { clearProps: 'all', autoAlpha: 1, x: 0, y: 0, yPercent: 0, xPercent: wm ? -50 : 0 });
    return;
  }
  /* One-Take: Slots bleiben. Nur Crossfade / Morph in place — kein Flug, kein Wipe. */
  const leftNew = [$('.ch__k', nu), $('.ch__h', nu), $('.ch__lead', nu)].filter(Boolean);
  const hudNew = $$('.hud', nu);
  if (old && old !== nu) {
    const leftOld = [$('.ch__k', old), $('.ch__h', old), $('.ch__lead', old)].filter(Boolean);
    const hudOld = $$('.hud', old);
    gsap.killTweensOf([...leftOld, ...hudOld, ...leftNew, ...hudNew, wm]);
    gsap.to([...leftOld, ...hudOld], {
      autoAlpha: 0, duration: .45, ease: 'power2.out', overwrite: true,
      onComplete: () => { if (cur !== +old.dataset.i) old.classList.remove('is-on'); }
    });
  }
  gsap.set([...leftNew, ...hudNew], { x: 0, y: 0, yPercent: 0, xPercent: 0, filter: 'none', clipPath: 'none' });
  gsap.fromTo(leftNew, { autoAlpha: 0 }, { autoAlpha: 1, duration: .55, ease: 'power2.out', stagger: .04, overwrite: true });
  gsap.fromTo(hudNew, { autoAlpha: 0 }, { autoAlpha: 1, duration: .55, ease: 'power2.out', stagger: .06, delay: .05, overwrite: true });
  gsap.fromTo(wm, { autoAlpha: 0 }, { autoAlpha: 1, xPercent: -50, duration: .7, ease: 'power2.out', overwrite: true });
}

/* ---------- Objekt ---------- */
function objUpdate() {
  const POS = MOB ? POS_M : POS_D, vw = innerWidth, vh = innerHeight, base = obj.offsetWidth;
  if (P < -.4) { obj.style.opacity = 0; return; }
  const pc = clamp(P, 0, N - .0001), c = Math.floor(pc), t = pc - c, b = Math.round(pc);
  let p0 = POS[c], p1 = p0, m = 0, ca = c, cb = c;
  if (b >= 1 && b <= N - 1 && Math.abs(pc - b) < W) { ca = b - 1; cb = b; p0 = POS[ca]; p1 = POS[cb]; m = eio((pc - (b - W)) / (2 * W)); }
  /* Fester Platz in der Mitte — nur Motiv/Scale morphen, nicht über den Frame wandern */
  const x = .5, y = MOB ? .42 : .62; // Desktop: unter dem mittigen Textblock
  const s = lerp(p0[2], p1[2], m);
  const fl = RM ? 0 : Math.sin(performance.now() / 1800) * 3;
  const fadeIn = clamp((P + .4) / .4);
  obj.style.opacity = fadeIn;
  obj.style.transform = `translate3d(${x * vw - base / 2}px,${y * vh - base / 2 + fl}px,0) scale(${s})`;
  const ia = OBJ[ca], ib = OBJ[cb];
  objI.forEach((im, k) => {
    let o = 0, bl = 0, sc = 1;
    if (ca === cb) {
      o = k === ia ? 1 : 0;
      if (c === 7) { const e = eo(clamp((t - .15) / .7)); o = k === 4 ? 1 - e : k === 5 ? e : 0; }
    } else if (ia === ib) {
      o = k === ia ? 1 : 0;
    } else {
      if (k === (ca === 7 ? 5 : ia)) { o = 1 - m; bl = m * 10; sc = 1 + m * .08; }
      if (k === ib) { o = m; bl = (1 - m) * 10; sc = .94 + .06 * m; }
    }
    im.style.opacity = o;
    im.style.filter = `blur(${bl.toFixed(1)}px) drop-shadow(0 30px 40px rgba(0,0,0,.55))`;
    im.style.transform = `scale(${sc})`;
  });
}

/* ---------- Schleife ---------- */
let trackTop = 0, trackH = 1;
function measure() { const r = track.getBoundingClientRect(); trackTop = r.top + scrollY; trackH = chs[0].offsetHeight; }
function readScroll() { tP = (scrollY - trackTop) / trackH; }
function tick() {
  const d = tP - P; P = Math.abs(d) < .0005 ? tP : P + d * (RM ? 1 : .16);
  const inFilm = P > -.05 && P < N; body.classList.toggle('is-film', inFilm);
  const c = clamp(Math.floor(clamp(P, 0, N - .001) + W * 0), 0, N - 1);
  const show = P >= -.02 && P < N + .3;
  if (show && c !== cur) enter(c, c > cur ? 1 : -1);
  if (!show && cur !== -1) { chs.forEach(a => a.classList.remove('is-on')); cur = -1; }
  if (cur >= 0) hud(cur, clamp(P - cur));
  tcB.style.transform = `scaleX(${clamp(P / N)})`;
  if (Math.abs(d) > .0001 || dirty) { render(); dirty = false; }
  objUpdate();
  requestAnimationFrame(tick);
}
rail.forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); const i = +a.dataset.i; scrollTo({ top: trackTop + (i + .2) * trackH, behavior: RM ? 'auto' : 'smooth' }); }));
function init() {
  setupFrames(); size(); measure(); readScroll(); P = tP;
  load(0).then(() => { dirty = true; addEventListener('load', loader, { once: true }); if (document.readyState === 'complete') loader(); });
  if (gsap && !RM) gsap.from('.hero .ln>span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: .1, delay: .1 });
  requestAnimationFrame(tick);
}
addEventListener('scroll', readScroll, { passive: true });
addEventListener('resize', () => { const m = mq.matches; if (m !== MOB) { MOB = m; setupFrames(); loader(); } size(); measure(); readScroll(); });
init();
})();
