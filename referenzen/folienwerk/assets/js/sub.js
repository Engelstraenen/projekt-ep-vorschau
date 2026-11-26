/* SCHICHTWECHSEL – Unterseiten */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const firma = new URLSearchParams(location.search).get('firma');
if (firma) { const f = $('#demo .for'); if (f) f.textContent = ' für ' + firma.slice(0, 40); }
$$('img').forEach(i => i.addEventListener('error', () => { const b = i.closest('.ss-img,.sh-img'); (b || i).style.display = 'none'; const s = i.closest('.sub-split'); if (s) s.classList.add('noimg'); }));
const nav = $('#nav'), burger = $('#burger');
burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
addEventListener('pointermove', e => document.documentElement.style.setProperty('--mx', (e.clientX / innerWidth).toFixed(3)), { passive: true });
// Blöcke beim Reinscrollen einblenden, Zahlen hochzählen
const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target); }), { threshold: .15 });
$$('.sub-split,.sub-steps li,.sub-facts .f,.sub-sw article,.sub-table').forEach(el => io.observe(el));
// aktive Lamelle in Sicht schieben
const on = $('.sub-fan .on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
})();
