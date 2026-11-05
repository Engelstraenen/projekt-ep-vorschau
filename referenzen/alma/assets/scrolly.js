(() => {
const gsap = window.gsap, ST = window.ScrollTrigger; gsap.registerPlugin(ST);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = matchMedia('(max-width: 800px)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => 1 - Math.pow(1 - t, 3), lerp = (a, b, t) => a + (b - a) * t;
const fmt = (n, sep) => sep ? Math.round(n).toLocaleString('de-DE') : String(Math.round(n));
const counters = (root, p) => $$('.count', root).forEach(c => c.textContent = fmt(lerp(+(c.dataset.from || 0), +c.dataset.to, ease(p)), c.dataset.sep));

/* Etappen-Infos für die rechte Bohnen-Karte (keine Preise) */
const STAGES = [
  { id: 'start', st: 'Kirsche', farm: 'Finca Alta, Huila', alt: '1.850 m', v: 'Caturra', det: 'Reife Kirsche am Strauch' },
  { id: 'plantage', st: 'Herkunft', farm: 'Finca Alta, Huila', alt: '1.850 m', v: 'Caturra', det: 'Ernte März · washed' },
  { id: 'ernte', st: 'Rohbohne', farm: 'Handverlesen', alt: '1.850 m', v: 'Caturra', det: 'Fall aus der Kirsche' },
  { id: 'band', st: 'Auf dem Band', farm: 'Packhalle', alt: '—', v: 'Caturra', det: 'Sortiert · in Jute' },
  { id: 'reise', st: 'Auf See', farm: 'Huila → Leipzig', alt: '10.000 km', v: 'Caturra', det: 'Cartagena · 3 Wochen' },
  { id: 'roesten', st: 'Im Feuer', farm: 'Speicherhof', alt: '205 °C', v: '12 Min', det: 'First Crack · Entwicklung' },
  { id: 'mahlen', st: 'Gemahlen', farm: 'Speicherhof', alt: 'Filter', v: 'mittel', det: 'Espresso fein · Press grob' },
  { id: 'bruehen', st: 'Gebrüht', farm: 'Café', alt: '93 °C', v: 'Geduld', det: 'Durchs Mehl in die Tasse' },
  { id: 'tasse', st: 'Ihre Tasse', farm: 'Aromen', alt: 'Kakao', v: 'Rote Beere', det: 'Ein Hauch Honig' }
];

$$('.kin__l').forEach(l => {
  const tg = l.querySelector('em') || l, tx = tg.textContent; tg.textContent = '';
  [...tx].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? '\u00a0' : c; tg.appendChild(s); });
});

const cv = $('.film'), ctx = cv.getContext('2d', { alpha: false }), N = +cv.dataset.n || 240, base = `film/ot/${MOB ? 'm' : 'd'}/`, img = new Array(N);
let cur = -1, want = 0;
const load = i => {
  if (img[i]) return;
  const im = new Image(); im.decoding = 'async';
  im.src = base + String(i + 1).padStart(3, '0') + '.webp';
  im.onload = () => { if (Math.abs(i - want) < 4) draw(true); };
  img[i] = im;
};
load(0); for (let i = 0; i < N; i += 6) load(i);
setTimeout(() => { for (let i = 0; i < N; i += 2) load(i); setTimeout(() => { for (let i = 0; i < N; i++) load(i); }, 500); }, 180);

function size() {
  const d = Math.min(devicePixelRatio || 1, MOB ? 1.5 : 2);
  cv.width = Math.round(innerWidth * d); cv.height = Math.round(innerHeight * d); cur = -1; draw(true);
}
function draw(force) {
  const i = clamp(Math.round(want), 0, N - 1); if (i === cur && !force) return;
  let im = img[i];
  if (!im || !im.complete || !im.naturalWidth) {
    im = null;
    for (let k = 1; k < 28 && !im; k++) for (const j of [i - k, i + k]) {
      const c = img[j]; if (c && c.complete && c.naturalWidth) { im = c; break; }
    }
  }
  if (!im) return;
  const W = cv.width, H = cv.height, s = Math.max(W / im.naturalWidth, H / im.naturalHeight);
  ctx.drawImage(im, (W - im.naturalWidth * s) / 2, (H - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s);
  cur = i;
}
size(); let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); ST.refresh(); }, 160); });

/* Anker an neue Story: Fall → Hand → Band (horizontal) → Schiff → Röst → Mühle → Tasse */
const ANCH = [
  ['start', 0, 'top'],
  ['plantage', 18],
  ['ernte', 50],
  ['band', 100],
  ['reise', 138],
  ['roesten', 165],
  ['mahlen', 190],
  ['bruehen', 210],
  ['tasse', N - 1, 'bottom']
];
let pts = [];
function measure() {
  const vh = innerHeight;
  pts = ANCH.map(([id, f, at]) => {
    const el = document.getElementById(id); if (!el) return [0, f];
    const t = el.offsetTop;
    return [at === 'top' ? 0 : at === 'bottom' ? t + el.offsetHeight - vh : t + el.offsetHeight / 2 - vh / 2, f];
  });
}
const frameAt = y => {
  if (!pts.length) return 0;
  if (y <= pts[0][0]) return pts[0][1];
  for (let k = 1; k < pts.length; k++) if (y <= pts[k][0]) {
    const [y0, f0] = pts[k - 1], [y1, f1] = pts[k];
    return f0 + (f1 - f0) * (y - y0) / (y1 - y0 || 1);
  }
  return pts[pts.length - 1][1];
};
measure(); ST.addEventListener('refresh', measure);

const hb = $('.hb'), hbG = $('.hb__g'), hbR = $('.hb__r'), st = $('.hb__st'), tcT = $('.tc__t'), tcC = $('.tc__c'), tcB = $('.tc b');
const farm = $('.hb__farm'), alt = $('.hb__alt'), vari = $('.hb__var'), det = $('.hb__det');
const route = $('.route'), rp = $('.route__p'), RL = rp ? rp.getTotalLength() : 0;
if (rp) { rp.style.strokeDasharray = RL; rp.style.strokeDashoffset = RL; }
const ring = $('.ring'), rgp = $('.ring__p'), dust = $$('.dust');
const chap = $$('.scene[data-st], .scene--hz[data-st]');

function applyStage(stage) {
  if (!stage) return;
  if (st) st.textContent = stage.st;
  if (farm) farm.textContent = stage.farm;
  if (alt) alt.textContent = stage.alt;
  if (vari) vari.textContent = stage.v;
  if (det) det.textContent = stage.det;
}

let intro = RM ? 10 : 0, smooth = 0, t0 = performance.now();
if (!RM) gsap.to({ v: 0 }, { v: 10, duration: 2.2, ease: 'power2.out', onUpdate() { intro = this.targets()[0].v; } });

function tick(now) {
  const y = scrollY, tgt = Math.max(frameAt(y), intro);
  smooth = RM ? tgt : lerp(smooth, tgt, MOB ? .22 : .18);
  want = smooth; draw();
  const f = smooth, t = (now - t0) / 1000, nf = N - 1;
  if (!MOB) gsap.set(cv, { scale: 1.025 + Math.sin(t * .25) * .01, x: Math.sin(t * .14) * 2, force3D: true });

  /* Bohne: sichtbar ab Fall, Röst-Übergang, verschwindet in Mühle */
  const vis = seg(f, 20, 42) * (1 - seg(f, nf * .78, nf * .88));
  const roast = seg(f, nf * .58, nf * .7);
  const drop = seg(f, nf * .74, nf * .88);
  gsap.set([hbG, hbR], { rotate: f * .5 + Math.sin(t * .7) * 3, force3D: true });
  gsap.set(hb, {
    opacity: vis,
    y: Math.sin(t * 1.05) * (MOB ? 5 : 9) + drop * innerHeight * .28 + (1 - seg(f, 20, 45)) * 40,
    scale: (1 - drop * .5) * (1 + seg(f, nf * .35, nf * .55) * .1),
    force3D: true
  });
  if (hbR) hbR.style.opacity = String(roast);
  if (hbG) hbG.style.opacity = String(1 - roast);

  if (route) {
    route.style.opacity = String(seg(f, nf * .48, nf * .54) * (1 - seg(f, nf * .62, nf * .68)));
    if (rp) rp.style.strokeDashoffset = String(RL * (1 - seg(f, nf * .5, nf * .62)));
  }
  if (ring) {
    ring.style.opacity = String(seg(f, nf * .62, nf * .66) * (1 - seg(f, nf * .74, nf * .8)));
    if (rgp) rgp.style.strokeDashoffset = String(553 * (1 - seg(f, nf * .64, nf * .76)));
  }
  if (!MOB) dust.forEach((d, i) => {
    gsap.set(d, {
      y: -(y * (.2 + i * .15)) % (innerHeight * 2.4),
      rotate: y * (.04 + i * .02) * (i % 2 ? -1 : 1),
      opacity: seg(f, 30, 50) * (1 - seg(f, nf * .8, nf * .9)) * .65,
      force3D: true
    });
  });

  const sec = f / 10;
  if (tcT) tcT.textContent = '00:' + String(Math.min(99, Math.floor(sec))).padStart(2, '0');
  if (tcB) tcB.style.transform = `scaleX(${f / nf})`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

chap.forEach(s => ST.create({
  trigger: s, start: 'top 55%', end: 'bottom 45%',
  onToggle: e => {
    if (!e.isActive) return;
    const stage = STAGES.find(x => x.id === s.id) || STAGES.find(x => x.st === s.dataset.st);
    applyStage(stage || { st: s.dataset.st, farm: '—', alt: '—', v: '—', det: '—' });
    if (tcC) {
      const n = s.querySelector('.num');
      tcC.textContent = n ? n.textContent.split('·').pop().trim() : (s.dataset.st || '');
    }
  }
}));

/* Horizontaler Band-Abschnitt */
const hz = $('#hz-track'), band = $('#band');
if (hz && band && !RM) {
  const getScroll = () => Math.max(0, hz.scrollWidth - innerWidth);
  gsap.to(hz, {
    x: () => -getScroll(),
    ease: 'none',
    scrollTrigger: {
      trigger: band,
      start: 'top top',
      end: () => '+=' + getScroll(),
      scrub: .45,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });
}

if (RM) {
  $$('.count').forEach(c => c.textContent = fmt(+c.dataset.to, c.dataset.sep));
  $$('.phases li').forEach(l => l.classList.add('on'));
  $$('.bgv').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
  applyStage(STAGES[0]);
  return;
}

const hero = gsap.timeline({ scrollTrigger: { trigger: '#start', start: 'top top', end: 'bottom top', scrub: .55 } });
$$('.hero .ch').forEach((c, i) => hero.to(c, {
  yPercent: gsap.utils.random(-200, -70), xPercent: gsap.utils.random(-80, 80),
  rotate: gsap.utils.random(-28, 28), opacity: 0, ease: 'power2.inOut', duration: 1
}, i * .018));
hero.to('.sig,.hero__lead,.cue', { opacity: 0, y: -24, duration: .45 }, 0);
gsap.from('.kin .ch', { yPercent: 110, opacity: 0, stagger: .022, duration: .95, ease: 'power3.out', delay: .12 });

$$('.txt, .hz__panel').forEach(el => gsap.from(el, {
  y: 32, opacity: 0, duration: .85, ease: 'power3.out',
  scrollTrigger: { trigger: el, start: 'top 88%' }
}));
$$('.step, .stops li').forEach(el => gsap.from(el, {
  y: 36, opacity: 0, duration: .8, ease: 'power3.out',
  scrollTrigger: { trigger: el, start: 'top 86%' }
}));
$$('.scene').forEach(s => {
  if ($('.count', s)) ST.create({ trigger: s, start: 'top 72%', end: 'center 42%', scrub: true, onUpdate: e => counters(s, e.progress) });
});
const phases = $$('.phases li');
ST.create({ trigger: '#roesten', start: 'top 50%', end: 'bottom 50%', onUpdate: e => phases.forEach((l, i) => l.classList.toggle('on', e.progress > .08 + i * .2)) });
gsap.from('.grind li', { y: 20, opacity: 0, stagger: .08, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.grind', start: 'top 85%' } });
gsap.timeline({ scrollTrigger: { trigger: '#tasse', start: 'top 62%', end: 'center center', scrub: .55 } })
  .fromTo('.mega span', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .1, duration: .28, ease: 'power3.out' });
$$('.shop .bgv, .foot .bgv').forEach(v => {
  v.pause();
  ST.create({ trigger: v.parentElement, start: 'top bottom', end: 'bottom top', onToggle: e => e.isActive ? (v.preload = 'auto', v.play().catch(() => {})) : v.pause() });
});
gsap.fromTo('.shop .bgv', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.shop', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.from('.menu li', { y: 32, opacity: 0, stagger: .06, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: '.menu', start: 'top 84%' } });
gsap.from('.foot__big', { yPercent: 28, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
gsap.to('.prog i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .25 } });
$$('.chap a').forEach(a => {
  const s = $(a.getAttribute('href'));
  s && ST.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: e => a.classList.toggle('on', e.isActive) });
});
applyStage(STAGES[0]);
addEventListener('load', () => ST.refresh());
})();
