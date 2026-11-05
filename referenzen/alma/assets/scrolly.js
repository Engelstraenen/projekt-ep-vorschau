(() => {
const gsap = window.gsap, ST = window.ScrollTrigger; gsap.registerPlugin(ST);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = matchMedia('(max-width: 800px)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => 1 - Math.pow(1 - t, 3), lerp = (a, b, t) => a + (b - a) * t;
const fmt = (n, sep) => sep ? Math.round(n).toLocaleString('de-DE') : String(Math.round(n));
const counters = (root, p) => $$('.count', root).forEach(c => c.textContent = fmt(lerp(+(c.dataset.from || 0), +c.dataset.to, ease(p)), c.dataset.sep));

$$('.kin__l').forEach(l => { const tg = l.querySelector('em') || l, tx = tg.textContent; tg.textContent = ''; [...tx].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? '\u00a0' : c; tg.appendChild(s); }); });

/* EIN Film, EIN fixer Layer: 386 Frames, eine Kamerafahrt ohne Schnitt */
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

/* Ankerpunkte: Kapitel-Mitte -> Frame im Film (Kirsche 0, Rohbohne 96, Röstung 193, Mühle 289, Crema 385) */
const ANCH = [['start', 0, 'top'], ['plantage', 40], ['ernte', 92], ['reise', 140], ['roesten', 200], ['mahlen', 280], ['bruehen', 335], ['tasse', 385, 'bottom']];
let pts = [];
function measure() { const vh = innerHeight; pts = ANCH.map(([id, f, at]) => { const el = document.getElementById(id), t = el.offsetTop; return [at === 'top' ? 0 : at === 'bottom' ? t + el.offsetHeight - vh : t + el.offsetHeight / 2 - vh / 2, f]; }); }
const frameAt = y => { if (y <= pts[0][0]) return pts[0][1]; for (let k = 1; k < pts.length; k++) if (y <= pts[k][0]) { const [y0, f0] = pts[k - 1], [y1, f1] = pts[k]; return f0 + (f1 - f0) * (y - y0) / (y1 - y0 || 1); } return pts[pts.length - 1][1]; };
measure(); ST.addEventListener('refresh', measure);

const hb = $('.hb'), hbG = $('.hb__g'), hbR = $('.hb__r'), st = $('.hb__st'), tcT = $('.tc__t'), tcC = $('.tc__c'), tcB = $('.tc b');
const route = $('.route'), rp = $('.route__p'), RL = rp.getTotalLength(); rp.style.strokeDasharray = RL; rp.style.strokeDashoffset = RL;
const ring = $('.ring'), rgp = $('.ring__p'), dust = $$('.dust');
const chap = $$('.scene[data-st]');
let intro = RM ? 14 : 0, smooth = 0, t0 = performance.now();
if (!RM) gsap.to({ v: 0 }, { v: 14, duration: 2.6, ease: 'power2.out', onUpdate() { intro = this.targets()[0].v; } }); // Hero: Film läuft sofort an
function tick(now) {
  const y = scrollY, tgt = Math.max(frameAt(y), intro);
  smooth = RM ? tgt : lerp(smooth, tgt, .14); want = smooth; draw();
  const f = smooth, t = (now - t0) / 1000;
  gsap.set(cv, { scale: 1.04 + Math.sin(t * .35) * .02, x: Math.sin(t * .2) * 6 });
  // Hero-Bohne: erscheint, wenn die Kirsche aufbricht, reist mit, röstet, verschwindet in der Mühle
  const vis = seg(f, 22, 44) * (1 - seg(f, 268, 300)), roast = seg(f, 150, 225), drop = seg(f, 255, 300);
  gsap.set([hbG, hbR], { rotate: f * .8 + Math.sin(t * .8) * 4 }); gsap.set(hb, { opacity: vis, y: Math.sin(t * 1.1) * 10 + drop * innerHeight * .35 + (1 - seg(f, 22, 50)) * 60, scale: (1 - drop * .6) * (1 + seg(f, 100, 180) * .15) });
  hbR.style.opacity = roast; hbG.style.opacity = 1 - roast;
  route.style.opacity = seg(f, 105, 125) * (1 - seg(f, 170, 185)); rp.style.strokeDashoffset = RL * (1 - seg(f, 110, 170));
  ring.style.opacity = seg(f, 180, 195) * (1 - seg(f, 245, 262)); rgp.style.strokeDashoffset = 553 * (1 - seg(f, 185, 250));
  dust.forEach((d, i) => gsap.set(d, { y: -(y * (.25 + i * .18)) % (innerHeight * 2.6), rotate: y * (.05 + i * .03) * (i % 2 ? -1 : 1), opacity: (1 - seg(f, 280, 320)) * .85 }));
  const sec = f / 12; tcT.textContent = '00:' + String(Math.floor(sec)).padStart(2, '0'); tcB.style.transform = `scaleX(${f / (N - 1)})`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
chap.forEach(s => ST.create({ trigger: s, start: 'top 55%', end: 'bottom 45%', onToggle: e => { if (e.isActive) { st.textContent = s.dataset.st; tcC.textContent = s.querySelector('.num') ? s.querySelector('.num').textContent.split('·')[1].trim() : 'Tasse'; } } }));

if (RM) { $$('.count').forEach(c => c.textContent = fmt(+c.dataset.to, c.dataset.sep)); $$('.phases li').forEach(l => l.classList.add('on')); $$('.bgv').forEach(v => { v.removeAttribute('autoplay'); v.pause(); }); return; }

/* Hero-Typo zerfällt beim Scrollen */
const hero = gsap.timeline({ scrollTrigger: { trigger: '#start', start: 'top top', end: 'bottom top', scrub: .6 } });
$$('.hero .ch').forEach((c, i) => hero.to(c, { yPercent: gsap.utils.random(-220, -80), xPercent: gsap.utils.random(-90, 90), rotate: gsap.utils.random(-35, 35), opacity: 0, ease: 'power2.inOut', duration: 1 }, i * .02));
hero.to('.sig,.hero__lead,.cue', { opacity: 0, y: -30, duration: .5 }, 0);
gsap.from('.kin .ch', { yPercent: 110, opacity: 0, stagger: .025, duration: 1, ease: 'power3.out', delay: .15 });
/* Texte fliegen über den laufenden Film ein */
$$('.txt > *, .step, .stops li').forEach(el => gsap.from(el, { y: 50, opacity: 0, filter: 'blur(6px)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
$$('.scene').forEach(s => { if ($('.count', s)) ST.create({ trigger: s, start: 'top 70%', end: 'center 40%', scrub: true, onUpdate: e => counters(s, e.progress) }); });
const phases = $$('.phases li'); ST.create({ trigger: '#roesten', start: 'top 50%', end: 'bottom 50%', onUpdate: e => phases.forEach((l, i) => l.classList.toggle('on', e.progress > .1 + i * .2)) });
gsap.from('.grind li', { y: 24, opacity: 0, stagger: .1, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.grind', start: 'top 85%' } });
gsap.timeline({ scrollTrigger: { trigger: '#tasse', start: 'top 60%', end: 'center center', scrub: .6 } }).fromTo('.mega span', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .12, duration: .3, ease: 'power3.out' });
/* Shop + Footer: Film-Loops nur, wenn sichtbar */
$$('.shop .bgv, .foot .bgv').forEach(v => { v.pause(); ST.create({ trigger: v.parentElement, start: 'top bottom', end: 'bottom top', onToggle: e => e.isActive ? (v.preload = 'auto', v.play().catch(() => {})) : v.pause() }); });
gsap.fromTo('.shop .bgv', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.shop', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.from('.menu li', { y: 40, opacity: 0, stagger: .07, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.menu', start: 'top 82%' } });
gsap.from('.foot__big', { yPercent: 35, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
gsap.to('.prog i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 } });
$$('.chap a').forEach(a => { const s = $(a.getAttribute('href')); s && ST.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: e => a.classList.toggle('on', e.isActive) }); });
addEventListener('load', () => ST.refresh());
})();
