(() => {
const gsap = window.gsap, ST = window.ScrollTrigger; gsap.registerPlugin(ST);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = matchMedia('(max-width: 800px)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => 1 - Math.pow(1 - t, 3), lerp = (a, b, t) => a + (b - a) * t;
const fmt = (n, sep) => sep ? Math.round(n).toLocaleString('de-DE') : String(Math.round(n));
const counters = (root, p) => $$('.count', root).forEach(c => c.textContent = fmt(lerp(+(c.dataset.from || 0), +c.dataset.to, ease(p)), c.dataset.sep));

/* Kinetic-Typo + Wasserzeichen */
$$('.kin__l').forEach(l => { const tg = l.querySelector('em') || l, tx = tg.textContent; tg.textContent = ''; [...tx].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? '\u00a0' : c; tg.appendChild(s); }); });
$$('[data-word]').forEach(s => { const w = document.createElement('p'); w.className = 'wordbg'; w.setAttribute('aria-hidden', 'true'); w.textContent = s.dataset.word; s.querySelector('.pin').prepend(w); });

/* Film-Sequenz: Canvas-Renderer, Frames je Kapitel lazy geladen (Apple-Prinzip) */
class Film {
  constructor(cv) {
    this.cv = cv; this.ctx = cv.getContext('2d'); this.n = +cv.dataset.n;
    this.base = `film/${cv.dataset.clip}/${MOB ? 'm' : 'd'}/`; this.img = new Array(this.n); this.p = 0; this.cur = -1; this.loaded = false;
    this.size(); this.load(0, 1);
  }
  url(i) { return this.base + String(i + 1).padStart(3, '0') + '.webp'; }
  load(a, b) { for (let i = a; i < b; i++) if (!this.img[i]) { const im = new Image(); im.decoding = 'async'; im.src = this.url(i); im.onload = () => { if (i === this.target() || this.cur < 0) this.draw(true); }; this.img[i] = im; } }
  loadAll() { if (this.loaded) return; this.loaded = true; // erst grob (jedes 4.), dann alle
    for (let i = 0; i < this.n; i += 4) this.load(i, i + 1); setTimeout(() => this.load(0, this.n), 300); }
  size() { const d = Math.min(devicePixelRatio || 1, 2), r = this.cv.getBoundingClientRect(); this.cv.width = Math.round(r.width * d) || 1; this.cv.height = Math.round(r.height * d) || 1; this.cur = -1; this.draw(true); }
  target() { return Math.round(this.p * (this.n - 1)); }
  set(p) { this.p = p; this.draw(); }
  draw(force) {
    const i = this.target(); if (i === this.cur && !force) return;
    const ok = im => im && im.complete && im.naturalWidth;
    let im = this.img[i];
    if (!ok(im)) { im = null; for (let k = 1; k < this.n && !im; k++) { if (ok(this.img[i - k])) im = this.img[i - k]; else if (ok(this.img[i + k])) im = this.img[i + k]; } }
    if (!im) return;
    const { width: W, height: H } = this.cv, s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    this.ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); this.cur = im === this.img[i] ? i : -1;
  }
}
const films = {}; $$('.film').forEach(cv => films[cv.closest('section').id] = new Film(cv));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { films[e.target.id].loadAll(); io.unobserve(e.target); } }), { rootMargin: '150% 0px' });
Object.keys(films).forEach(id => io.observe(document.getElementById(id)));
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => Object.values(films).forEach(f => f.size()), 150); });

if (RM) { // ruhig: kein Pinning, kein Scrubbing, Loops stehen
  Object.values(films).forEach(f => { f.loadAll(); f.set(.6); });
  $$('.bgv').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
  $$('.count').forEach(c => c.textContent = fmt(+c.dataset.to, c.dataset.sep)); $$('.phases li').forEach(l => l.classList.add('on'));
  return;
}

const scrub = MOB ? .5 : .8;
/* Hero zuerst anlegen (Pins in Dokument-Reihenfolge) */
const hero = gsap.timeline({ scrollTrigger: { trigger: '#start', start: 'top top', end: () => '+=' + innerHeight * 1.1, scrub, pin: true } });
$$('.hero .ch').forEach((c, i) => hero.to(c, { yPercent: gsap.utils.random(-220, -80), xPercent: gsap.utils.random(-90, 90), rotate: gsap.utils.random(-35, 35), opacity: 0, ease: 'power2.inOut', duration: 1 }, i * .02));
hero.to('#start .bgv', { scale: 1.25, duration: 1.3, ease: 'none' }, 0).to('.sig,.hero__lead,.cue', { opacity: 0, y: -30, duration: .5 }, 0);

const LEN = { plantage: 1.6, ernte: 2, reise: 2.6, roesten: 2.4, mahlen: 1.8, bruehen: 2, tasse: 2 };
const steps = $$('.step'), phases = $$('.phases li'), grind = $$('.grind li'), track = $('.track');
gsap.set(steps, { opacity: 0, y: 30 }); gsap.set(grind, { opacity: 0, y: 24 });
const on = {
  plantage: p => counters($('#plantage'), seg(p, .05, .7)),
  ernte: p => steps.forEach((s, i) => { const a = seg(p, .1 + i * .3, .22 + i * .3), b = i < 2 ? seg(p, .34 + i * .3, .42 + i * .3) : 0; gsap.set(s, { opacity: a - b, y: (1 - a) * 30 - b * 30, filter: `blur(${(1 - a + b) * 4}px)` }); }),
  reise: p => { counters($('#reise'), p); gsap.set(track, { x: -(track.scrollWidth - innerWidth) * p }); },
  roesten: p => { counters($('#roesten'), seg(p, .02, .95)); phases.forEach((l, i) => l.classList.toggle('on', p > .05 + i * .24)); },
  mahlen: p => grind.forEach((l, i) => { const t = ease(seg(p, .4 + i * .08, .6 + i * .08)); gsap.set(l, { opacity: t, y: (1 - t) * 24 }); }),
  bruehen: p => counters($('#bruehen'), seg(p, .1, .7)),
  tasse: () => {}
};
for (const [id, len] of Object.entries(LEN)) {
  const sec = document.getElementById(id), f = films[id];
  ST.create({ trigger: sec, start: 'top top', end: () => '+=' + innerHeight * len, pin: true, scrub, anticipatePin: 1, onUpdate: s => { f.set(s.progress); on[id](s.progress); } });
  const el = sec.querySelectorAll('.txt > *:not(.steps), .panel--intro > *');
  if (el.length) gsap.from(el, { y: 40, opacity: 0, stagger: .06, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 65%' } });
  const w = sec.querySelector('.wordbg'); if (w) gsap.fromTo(w, { xPercent: -38 }, { xPercent: -62, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: () => '+=' + innerHeight * (len + 2), scrub: true } });
}
gsap.timeline({ scrollTrigger: { trigger: '#tasse', start: 'top top', end: () => '+=' + innerHeight * 2, scrub } })
  .fromTo('.mega span', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .12, duration: .3, ease: 'power3.out' }, .55);
/* Shop + Footer: Film-Loops nur, wenn sichtbar */
$$('.shop .bgv, .foot .bgv').forEach(v => { v.pause(); ST.create({ trigger: v.parentElement, start: 'top bottom', end: 'bottom top', onToggle: e => e.isActive ? (v.preload = 'auto', v.play().catch(() => {})) : v.pause() }); });
gsap.fromTo('.shop .bgv', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.shop', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.from('.menu li', { y: 40, opacity: 0, stagger: .07, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.menu', start: 'top 82%' } });
gsap.from('.foot__big', { yPercent: 35, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
gsap.to('.prog i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 } });
$$('.chap a').forEach(a => { const s = $(a.getAttribute('href')); s && ST.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: e => a.classList.toggle('on', e.isActive) }); });
addEventListener('load', () => ST.refresh());
})();
