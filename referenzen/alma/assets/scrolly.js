(() => {
'use strict';
const gsap = window.gsap, ST = window.ScrollTrigger; gsap.registerPlugin(ST);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = matchMedia('(max-width: 800px)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const fmt = (n, sep) => sep ? Math.round(n).toLocaleString('de-DE') : String(Math.round(n));

/* —— Film (unverändert): 386 Frames, eine Kamerafahrt —— */
const cv = $('.film'), ctx = cv.getContext('2d'), N = +cv.dataset.n, base = `film/ot/${MOB ? 'm' : 'd'}/`, img = new Array(N);
let cur = -1, want = 0;
const load = i => { if (img[i]) return; const im = new Image(); im.decoding = 'async'; im.src = base + String(i + 1).padStart(3, '0') + '.webp'; im.onload = () => { if (Math.abs(i - want) < 3) draw(true); }; img[i] = im; };
load(0); for (let i = 0; i < N; i += 8) load(i); setTimeout(() => { for (let i = 0; i < N; i += 2) load(i); setTimeout(() => { for (let i = 0; i < N; i++) load(i); }, 600); }, 250);
function size() { const d = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(innerWidth * d); cv.height = Math.round(innerHeight * d); cur = -1; draw(true); }
function draw(force) {
  const i = clamp(Math.round(want), 0, N - 1); if (i === cur && !force) return;
  let im = img[i]; if (!im || !im.complete || !im.naturalWidth) { im = null; for (let k = 1; k < 24 && !im; k++) for (const j of [i - k, i + k]) { const c = img[j]; if (c && c.complete && c.naturalWidth) { im = c; break; } } }
  if (!im) return; const W = cv.width, H = cv.height, s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
  ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); cur = i;
}
size(); let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); ST.refresh(); }, 150); });

/* Anker: Kapitel-Mitte → Frame (Kirsche 0, Rohbohne 96, Röstung 193, Mühle 289, Crema 385) */
const ANCH = [['start', 0, 'top'], ['plantage', 40], ['ernte', 92], ['reise', 140], ['roesten', 200], ['mahlen', 280], ['bruehen', 335], ['tasse', 385, 'bottom']];
let pts = [];
function measure() {
  const vh = innerHeight;
  pts = ANCH.map(([id, f, at]) => {
    const el = document.getElementById(id), t = el.offsetTop;
    return [at === 'top' ? 0 : at === 'bottom' ? t + el.offsetHeight - vh : t + el.offsetHeight / 2 - vh / 2, f];
  });
}
const frameAt = y => {
  if (y <= pts[0][0]) return pts[0][1];
  for (let k = 1; k < pts.length; k++) if (y <= pts[k][0]) {
    const [y0, f0] = pts[k - 1], [y1, f1] = pts[k];
    return f0 + (f1 - f0) * (y - y0) / (y1 - y0 || 1);
  }
  return pts[pts.length - 1][1];
};
measure(); ST.addEventListener('refresh', measure);

/* —— Mittige One-Take-Bühne: Inhalte verwandeln sich an Ort und Stelle —— */
const BEATS = [
  { until: 18,  n: '', lab: 'Beginn',   title: 'Von der Bohne <em>zur Tasse.</em>', lead: 'Eine Bohne. Eine Kamerafahrt. Scrollen Sie mit.',
    a: { l: 'Höhe', v: 0, from: 0, to: 0, u: 'm', sep: 1 }, b: { l: 'Partnerhöfe', v: 0, from: 0, to: 0, u: '' }, live: 'a' },
  { until: 70,  n: '01', lab: 'Plantage', title: 'Alles beginnt auf <em>1.850&nbsp;Metern.</em>', lead: 'Im Hochland von Huila reifen die Kirschen langsam. Kühle Nächte, lange Süße.',
    a: { l: 'Höhe', v: 1850, from: 900, to: 1850, u: 'm', sep: 1 }, b: { l: 'Partnerhöfe', v: 3, from: 0, to: 3, u: '' }, live: 'ab' },
  { until: 115, n: '02', lab: 'Ernte',    title: 'Nur die <em>roten.</em>', lead: 'Fünf Runden an denselben Sträuchern. Gepflückt wird nur, was wirklich reif ist.',
    a: { l: 'Durchgänge', v: 5, from: 0, to: 5, u: '×' }, b: { l: 'Trocknung', v: 18, from: 0, to: 18, u: 'Tage' }, live: 'ab' },
  { until: 175, n: '03', lab: 'Reise',    title: 'Zehntausend Kilometer <em>im Jutesack.</em>', lead: 'Huila → Cartagena → Atlantik → Leipzig. Ein Sack, ein Hof, bis in den Speicherhof.',
    a: { l: 'Strecke', v: 10000, from: 0, to: 10000, u: 'km', sep: 1 }, b: { l: 'Auf See', v: 21, from: 0, to: 21, u: 'Tage' }, live: 'ac' },
  { until: 250, n: '04', lab: 'Rösten',   title: 'Zwölf Minuten, die <em>alles</em> entscheiden.', lead: 'Aus Grün wird Gold, aus Gold wird Braun. Beim First Crack entscheidet sich der Charakter.',
    a: { l: 'Trommel', v: 205, from: 20, to: 205, u: '°C' }, b: { l: 'Dauer', v: 12, from: 0, to: 12, u: 'min' }, live: 'ad' },
  { until: 310, n: '05', lab: 'Mahlen',   title: 'Erst jetzt <em>bricht sie auf.</em>', lead: 'Kurz vor dem Brühen geht die Bohne durchs Mahlwerk. Der Grad entscheidet über Klarheit und Körper.',
    a: { l: 'Mahlgrad', v: 250, from: 900, to: 250, u: 'µm' }, b: { l: 'Scheibe', v: 64, from: 0, to: 64, u: 'mm' }, live: 'ab' },
  { until: 355, n: '06', lab: 'Brühen',   title: '<em>93</em> Grad. Geduld.', lead: 'Das Wasser findet seinen Weg durch das Mehl und nimmt mit, wofür der lange Weg gegangen wurde.',
    a: { l: 'Wasser', v: 93, from: 20, to: 93, u: '°C' }, b: { l: 'Bezug', v: 28, from: 0, to: 28, u: 's' }, live: 'ab' },
  { until: 999, n: '07', lab: 'Tasse',    title: 'Kakao. Rote Beere. <em>Ein Hauch Honig.</em>', lead: 'Die Reise endet bei Ihnen – in der Tasse, nicht im Katalog.',
    a: { l: 'Rezept', v: 18, from: 0, to: 18, u: 'g' }, b: { l: 'In der Tasse', v: 36, from: 0, to: 36, u: 'g' }, live: 'ab' }
];

const midN = $('.mid__n'), midLab = $('.mid__lab'), midLead = $('.mid__lead');
const hA = $('.mid__h--a'), hB = $('.mid__h--b');
const slot = { a: $('[data-slot="a"]'), b: $('[data-slot="b"]'), c: $('[data-slot="c"]'), d: $('[data-slot="d"]') };
const routeP = $('.mid__route-p'), arcP = $('.mid__arc-p');
const RL = routeP.getTotalLength(); routeP.style.strokeDasharray = String(RL); routeP.style.strokeDashoffset = String(RL);
const AL = arcP.getTotalLength(); arcP.style.strokeDasharray = String(AL); arcP.style.strokeDashoffset = String(AL);
const tcT = $('.tc__t'), tcC = $('.tc__c'), tcB = $('.tc b');

let beatIdx = -1, flip = false, shownTitle = '';
function setMetric(el, meta, t) {
  if (!el || !meta) return;
  el.querySelector('.mid__ml').textContent = meta.l;
  const b = el.querySelector('b'), u = el.querySelector('i');
  const from = meta.from ?? 0, to = meta.to ?? meta.v ?? 0;
  b.textContent = fmt(lerp(from, to, ease(t)), meta.sep);
  u.textContent = meta.u || '';
}
function applyBeat(i, localT) {
  const B = BEATS[i];
  midN.textContent = B.n; midLab.textContent = B.lab; midLead.textContent = B.lead;
  if (B.title !== shownTitle) {
    shownTitle = B.title;
    const next = flip ? hA : hB, prev = flip ? hB : hA;
    next.innerHTML = B.title;
    if (RM) { prev.classList.remove('is-on'); next.classList.add('is-on'); }
    else { prev.classList.remove('is-on'); requestAnimationFrame(() => next.classList.add('is-on')); }
    flip = !flip;
  }
  setMetric(slot.a, B.a, localT); setMetric(slot.b, B.b, localT);
  ['a', 'b', 'c', 'd'].forEach(k => slot[k].classList.toggle('is-live', B.live.includes(k)));
}

function driveMid(f) {
  let i = 0; while (i < BEATS.length - 1 && f >= BEATS[i].until) i++;
  const prev = i === 0 ? 0 : BEATS[i - 1].until;
  const end = i === BEATS.length - 1 ? (N - 1) : BEATS[i].until;
  const localT = seg(f, prev, end);
  if (i !== beatIdx) { beatIdx = i; applyBeat(i, localT); }
  else {
    setMetric(slot.a, BEATS[i].a, localT);
    setMetric(slot.b, BEATS[i].b, localT);
  }
  /* Route & Temperatur-Bogen zeichnen sich kontinuierlich – kein Opacity-Pop */
  const routeOn = seg(f, 100, 165); routeP.style.strokeDashoffset = String(RL * (1 - routeOn));
  slot.c.classList.toggle('is-live', routeOn > .05 && f < 185);
  const cB = slot.c.querySelector('b'); if (cB) cB.textContent = fmt(lerp(0, 10000, ease(routeOn)), 1);

  const roast = seg(f, 175, 245); arcP.style.strokeDashoffset = String(AL * (1 - roast));
  slot.d.classList.toggle('is-live', roast > .04 && f < 265);
  if (BEATS[i].live.includes('d')) {
    const tb = slot.d.querySelector('b'); if (tb) tb.textContent = fmt(lerp(20, 205, ease(roast)));
  }
  tcC.textContent = BEATS[i].lab;
}

let intro = RM ? 14 : 0, smooth = 0, t0 = performance.now();
if (!RM) gsap.to({ v: 0 }, { v: 14, duration: 2.6, ease: 'power2.out', onUpdate() { intro = this.targets()[0].v; } });

function tick(now) {
  const y = scrollY, tgt = Math.max(frameAt(y), intro);
  smooth = RM ? tgt : lerp(smooth, tgt, .14); want = smooth; draw();
  const f = smooth, t = (now - t0) / 1000;
  if (!RM) gsap.set(cv, { scale: 1.03 + Math.sin(t * .35) * .015, x: Math.sin(t * .2) * 4 });
  driveMid(f);
  const sec = f / 12; tcT.textContent = '00:' + String(Math.floor(sec)).padStart(2, '0');
  tcB.style.transform = `scaleX(${f / (N - 1)})`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
applyBeat(0, 0);

/* Shop + Footer: sichtbar ohne Einflug-Muster */
$$('.shop .bgv, .foot .bgv').forEach(v => {
  v.pause();
  ST.create({ trigger: v.parentElement, start: 'top bottom', end: 'bottom top',
    onToggle: e => e.isActive ? (v.preload = 'auto', v.play().catch(() => {})) : v.pause() });
});
if (!RM) {
  gsap.fromTo('.shop .bgv', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.shop', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.foot__big', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}
gsap.to('.prog i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 } });
$$('.chap a').forEach(a => {
  const s = $(a.getAttribute('href'));
  s && ST.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: e => a.classList.toggle('on', e.isActive) });
});

/* Mid ausblenden, wenn Shop den Film verlässt */
ST.create({
  trigger: '#shop', start: 'top 70%', end: 'bottom top',
  onEnter: () => gsap.to('.mid,.tc', { autoAlpha: 0, duration: RM ? 0 : .45, ease: 'power2.out' }),
  onLeaveBack: () => gsap.to('.mid,.tc', { autoAlpha: 1, duration: RM ? 0 : .45, ease: 'power2.out' })
});

addEventListener('load', () => ST.refresh());
})();
