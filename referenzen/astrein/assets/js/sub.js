/* ASTREIN V3 – gemeinsame Funktionen der Unterseiten */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = window.IMG || {}, VID = window.VID || {};
const mobile = () => innerWidth < 900 && innerHeight > innerWidth;
const firma = new URLSearchParams(location.search).get('firma');
if (firma) { $$('.firma').forEach(e => e.textContent = firma.toUpperCase()); document.title = document.title.replace('ASTREIN', firma); $$('a[href]').forEach(a => { const h = a.getAttribute('href'); if (/^[a-z]+\.html|^\.\/|^index/.test(h)) { const [p, hash] = h.split('#'); a.setAttribute('href', p + '?firma=' + encodeURIComponent(firma) + (hash ? '#' + hash : '')); } }); }
function load() {
  $$('img[data-k]').forEach(im => { const e = IMG[im.dataset.k]; if (!e) { (im.closest('[data-hide]') || im).hidden = true; return; } const s = mobile() && e.m && im.dataset.crop !== 'no' ? e.m : e.d; if (im.getAttribute('src') !== s) im.src = s; });
  $$('video[data-v]').forEach(v => { const e = VID[v.dataset.v]; if (!e) { v.hidden = true; return; } const s = mobile() && e.m ? e.m : e.d; if (v.dataset.src !== s) { v.dataset.src = s; v.src = s; } v.hidden = false; });
}
load(); addEventListener('resize', load);
const b = $('#burger'); b && b.addEventListener('click', () => document.body.classList.toggle('open'));
$$('#menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('open')));
const hdr = $('#hdr'); addEventListener('scroll', () => hdr && hdr.classList.toggle('solid', scrollY > 60), { passive: true });
const dx = $('#demoX'); dx && dx.addEventListener('click', e => e.target.parentElement.remove());
$$('.seg .chip').forEach(c => c.addEventListener('click', () => $$('.chip', c.parentElement).forEach(x => x.classList.toggle('on', x === c))));
$$('form').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); f.classList.add('sent'); }));
const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); $$('.pay', e.target).forEach((p, i) => setTimeout(() => p.classList.add('in'), i * 110)); $$('.bar i', e.target).forEach(i => i.style.width = i.dataset.w + '%'); io.unobserve(e.target); }), { threshold: .2 });
$$('.reveal,.paycards,.bars').forEach(x => io.observe(x));
const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (v.hidden) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }), { threshold: .3 });
$$('video[data-v][loop]').forEach(v => vio.observe(v));
window.SUB = { $, $$, IMG, VID, mobile };
})();
