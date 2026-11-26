/* SCHICHTWECHSEL – Demo. Der Musterfächer führt durch die Seite. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const root = document.documentElement;
const mobile = () => innerWidth < 761 || innerHeight < 501;
const land = () => innerHeight < 501 && innerWidth > innerHeight;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Persönlicher Link ?firma=Name */
const firma = new URLSearchParams(location.search).get('firma');
if (firma) { const f = $('#demo .for'); if (f) f.textContent = ' für ' + firma.slice(0, 40); }

/* Autobilder und Makro nach dem Laden vorladen, damit Wischer und Sprünge nie leer sind */
addEventListener('load', () => setTimeout(() => $$('.cv, .h-img img').forEach(i => i.removeAttribute('loading')), 300));

/* Bilder ohne Datei ausblenden (nie Platzhalter zeigen) */
$$('img').forEach(i => i.addEventListener('error', () => { i.style.visibility = 'hidden'; }));

/* Kopfzeile + Menü */
const nav = $('#nav'), burger = $('#burger');
burger && burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Menü schließen' : 'Menü öffnen'); });
$$('#links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* Folie fühlen: Glanz folgt Maus bzw. Neigung des Handys */
let mx = .5;
const setMx = v => { mx = clamp(v); root.style.setProperty('--mx', mx.toFixed(3)); };
addEventListener('pointermove', e => setMx(e.clientX / innerWidth), { passive: true });
addEventListener('deviceorientation', e => { if (e.gamma != null) setMx(.5 + e.gamma / 70); }, { passive: true });

/* ---------- Musterfächer ---------- */
const CH = [
  { id: 'start', f: 'Color-Shift', t: 'Start', sw: 'shift' },
  { id: 'folie', f: 'Chrom Silber', t: 'Folien', sw: 'chrom', light: 1 },
  { id: 'wissen', f: 'Satin Magenta', t: 'Wissen', sw: 'satin' },
  { id: 'handwerk', f: 'Matt Schwarz', t: 'Handwerk', sw: 'matt' },
  { id: 'referenzen', f: 'Strass', t: 'Referenzen', sw: 'strass' },
  { id: 'alles', f: 'Holo', t: 'Alles folierbar', sw: 'holo', light: 1 },
  { id: 'konfigurator', f: 'Forged Carbon', t: 'Konfigurator', sw: 'carbon' },
  { id: 'karriere', f: 'Glitzer Violett', t: 'Karriere', sw: 'glitter' },
  { id: 'angebot', f: 'Lackschutz klar', t: 'Angebot', sw: 'klar' }
];
const fan = $('#fan'), bladesEl = $('#fanBlades'), label = $('#fanLabel');
const blades = CH.map((c, i) => {
  const b = document.createElement('a');
  b.className = 'blade' + (c.light ? ' light' : '');
  b.href = '#' + c.id;
  b.setAttribute('aria-label', String(i + 1).padStart(2, '0') + ' ' + c.t + ' – Folie ' + c.f);
  b.innerHTML = '<i class="sw sw-' + c.sw + '"></i><span>' + String(i + 1).padStart(2, '0') + ' · ' + c.t + '</span>';
  bladesEl.appendChild(b);
  b.addEventListener('click', e => {
    if (fan.classList.contains('compact') && mobile() && !fan.classList.contains('open')) { e.preventDefault(); fan.classList.add('open'); layoutFan(); return; }
    setTimeout(() => { fan.classList.remove('open'); layoutFan(); }, 0);
  });
  return b;
});
label.setAttribute('role', 'button'); label.tabIndex = 0; label.setAttribute('aria-label', 'Musterfächer öffnen');
const openFan = () => { fan.classList.add('open'); layoutFan(); };
label.addEventListener('click', openFan); $('#fanHit').addEventListener('click', openFan); label.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFan(); } });
fan.addEventListener('click', e => { if (e.target === fan && fan.classList.contains('open')) { fan.classList.remove('open'); layoutFan(); } });
addEventListener('keydown', e => { if (e.key === 'Escape' && fan.classList.contains('open')) { fan.classList.remove('open'); layoutFan(); } });

let A = 0, openT = reduce ? 1 : 0, lastLab = -1;
function layoutFan() {
  const m = mobile(), open = fan.classList.contains('open');
  const compact = fan.classList.contains('compact');
  let L = open ? (m ? innerWidth * .9 : Math.min(innerWidth * .6, 900)) : (m ? innerWidth * .8 : Math.min(innerWidth * .58, 860));
  if (land()) L = open ? innerHeight * 1.25 : innerHeight * .95;
  const s = open ? 1 : compact ? (m ? .4 : .34) : 1;
  const px = open ? (m ? 18 : innerWidth * .06) : compact ? (m ? 14 : 30) : (m ? -innerWidth * .04 : innerWidth * .02);
  const py = open ? (m ? innerHeight * .12 : innerHeight * .1) : compact ? (m ? 24 : 34) : (m ? -10 : -innerHeight * .02);
  fan.style.setProperty('--L', L + 'px'); fan.style.setProperty('--s', s); fan.style.setProperty('--px', px + 'px'); fan.style.setProperty('--py', py + 'px');
  const F = open ? -6 : compact ? -10 : -4, S = open ? (m ? 8.4 : 8.6) : compact ? (m ? 4 : 4.4) : (m ? 3.2 : 3.4);
  blades.forEach((b, i) => {
    let r, z, lift = 0;
    if (open) { r = F - i * S; z = 50 - i; }
    else {
      const d = i - A;
      if (d >= 0) { r = F - d * S * openT; z = 100 - Math.round(d * 3); }
      else { r = F - d * 1.6; z = 99 - Math.round(-d * 3); }
      if (Math.abs(d) < .5) lift = (m ? 6 : 14) * (1 - Math.abs(d) * 2);
    }
    b.style.setProperty('--r', r.toFixed(2) + 'deg');
    b.style.setProperty('--lift', lift.toFixed(1) + 'px');
    b.style.zIndex = z;
    b.classList.toggle('act', Math.round(A) === i);
    b.tabIndex = 0;
  });
  const k = Math.round(A);
  if (k !== lastLab) { lastLab = k; const c = CH[k]; label.innerHTML = '<small>Aktuelle Folie</small><b>' + c.f + '</b><i>' + String(k + 1).padStart(2, '0') + ' · ' + c.t + '</i>'; }
}
// Fächer öffnet sich beim Laden (Bewegung ab der ersten Sekunde)
if (!reduce) { const t0 = performance.now(); const op = t => { openT = clamp((t - t0 - 250) / 1300); openT = 1 - Math.pow(1 - openT, 3); layoutFan(); if (openT < 1) requestAnimationFrame(op); }; requestAnimationFrame(op); }

/* ---------- 01/02 Held: Wischer über das Auto ---------- */
const duo = $('#duo'), cars = $$('.cv'), sweep = $('#sweep'), heroCopy = $('#heroCopy'), folieCopy = $('#folieCopy'), progBar = $('#progBar');
const carBy = k => cars.find(c => c.dataset.k === k);
let base = carBy('k0'), top = null, anim = null;
const NAMES = { k0: ['Color-Shift Chrom', 'Türkis, Violett, Gold<br>Wechselt mit dem Blickwinkel<br>Gegossene Spezialfolie'], k1: ['Chrom Silber', 'Spiegelchrom<br>Hochglanz<br>Für maximale Präsenz'], k2: ['Satin Magenta', 'Seidenglanz<br>Weiche Reflexe<br>Wirkt wie teurer Lack'], k3: ['Matt Schwarz', 'Keine Spiegelung<br>Klare Linien<br>Der Klassiker'], k4: ['Glitzer Violett', 'Metallflocken<br>Funkelt in der Sonne<br>Spezialfolie'], k5: ['Forged Carbon', 'Marmorierte Carbon-Optik<br>Satin versiegelt<br>Auch für Teile'] };
function paintWipe(t) {
  if (!top) return;
  const w = 100 - t * 100;
  top.style.clipPath = 'inset(0 0 0 ' + w.toFixed(2) + '%)';
  sweep.style.setProperty('--sx', (w - 9).toFixed(2)); sweep.style.setProperty('--so', t > 0 && t < 1 ? 1 : 0);
}
function setTop(k) {
  if (top && top.dataset.k === k) return;
  if (top) { top.style.clipPath = ''; top.classList.remove('on'); }
  top = k ? carBy(k) : null;
  cars.forEach(c => { c.style.zIndex = c === base ? 1 : c === top ? 2 : 0; if (c !== base && c !== top) c.style.clipPath = 'inset(0 0 0 100%)'; });
  if (top) { top.removeAttribute('loading'); top.style.clipPath = 'inset(0 0 0 100%)'; }
  base.style.clipPath = 'inset(0 0 0 0)';
}
function commit() { if (!top) return; base = top; top = null; cars.forEach(c => { c.style.zIndex = c === base ? 1 : 0; c.style.clipPath = c === base ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)'; }); sweep.style.setProperty('--so', 0); }
let userPick = null;
function wipeTo(k) {
  if (base.dataset.k === k) return;
  if (anim) cancelAnimationFrame(anim);
  commit(); setTop(k);
  const t0 = performance.now(), D = reduce ? 1 : 950;
  const step = t => { const p = clamp((t - t0) / D), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; paintWipe(e); if (p < 1) anim = requestAnimationFrame(step); else { anim = null; commit(); } };
  anim = requestAnimationFrame(step);
  const n = NAMES[k]; $('#fName').textContent = n[0]; $('#fDesc').innerHTML = n[1];
  $$('#finishes button').forEach(b => { const on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
}
$$('#finishes button').forEach(b => b.addEventListener('click', () => { userPick = b.dataset.k; wipeTo(b.dataset.k); }));

function duoFrame(p) {
  // p 0..1 über die Länge des Abschnitts
  progBar.style.setProperty('--p', clamp(p / .55).toFixed(3));
  const tw = clamp((p - .36) / .2); // Lamelle dreht, Chrom wischt über das Auto
  if (!userPick && !anim) {
    if (tw <= 0) { if (base.dataset.k !== 'k0') { top = null; base = carBy('k0'); cars.forEach(c => { c.style.zIndex = c === base ? 1 : 0; c.style.clipPath = c === base ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)'; }); } sweep.style.setProperty('--so', 0); }
    else if (tw >= 1) { if (base.dataset.k !== 'k1') { setTop('k1'); commit(); } }
    else { if (base.dataset.k !== 'k0') { top = null; base = carBy('k0'); } setTop('k1'); paintWipe(tw); }
  }
  heroCopy.style.opacity = clamp(1 - (p - .26) / .1); heroCopy.style.transform = 'translateY(' + (-clamp((p - .26) / .1) * 30) + 'px)';
  heroCopy.style.pointerEvents = p > .3 ? 'none' : '';
  folieCopy.classList.toggle('on', p > .5);
  return clamp((p - .36) / .2); // Anteil der Fächer-Drehung 0 -> 1
}

/* ---------- 03 Wissen ---------- */
const W_TXT = {
  aufbau: 'Vier Schichten, zusammen etwa so dick wie ein Blatt Papier. Die Farbe sitzt in der Folie, nicht auf deinem Lack.',
  haltbarkeit: 'Gegossene Folie wird flüssig gegossen und hat keine Spannung. Sie hält laut Herstellern bis zu 10 Jahre. Kalandrierte Folie wird gewalzt, will zurück in ihre Form und hält meist 3 bis 5 Jahre.',
  pflege: 'Handwäsche oder Waschanlage ohne harte Bürsten. Kein Hochdruck direkt auf die Kanten. Matt und Satin nie polieren oder wachsen.',
  technologie: 'Luftkanäle im Kleber lassen Luft entweichen, so entstehen keine Blasen. Gegossene Folie ist 50 bis 110 µm dünn und lässt sich mit Wärme in Sicken und um Kanten legen.'
};
$$('.w-tabs button').forEach(b => b.addEventListener('click', () => {
  $$('.w-tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
  $('#wText').textContent = W_TXT[b.dataset.t];
}));
const lays = $$('.lay');
const calcOut = $('#cOut');
function calc() {
  const base = { cast: [7, 10], metal: [4, 6], cal: [3, 5], ppf: [7, 10] }[$('#cF').value];
  let f = 1; if ($('#cG').value === 's') f *= .8; if ($('#cS').value === 'h') f *= .6;
  const a = Math.max(1, Math.round(base[0] * f)), b = Math.max(a, Math.round(base[1] * f));
  calcOut.innerHTML = '<b>' + (a === b ? a : a + '–' + b) + '</b> Jahre';
}
['#cF', '#cG', '#cS'].forEach(s => $(s).addEventListener('change', calc)); calc();

/* ---------- 05 Bewertungen (Beispiele, nacheinander) ---------- */
const rvs = $$('.rv'); let rvI = 0;
if (rvs.length) { rvs[0].classList.add('on'); setInterval(() => { rvs[rvI].classList.remove('on'); rvI = (rvI + 1) % rvs.length; rvs[rvI].classList.add('on'); }, 5200); }

/* ---------- 07 Konfigurator ---------- */
const cmp = $('#cmp'), handle = $('#handle');
let cpos = 50;
const setC = v => { cpos = clamp(v, 2, 98); cmp.style.setProperty('--c', cpos.toFixed(1)); handle.setAttribute('aria-valuenow', Math.round(cpos)); };
const fromX = x => { const r = cmp.getBoundingClientRect(); setC((x - r.left) / r.width * 100); };
let drag = false;
handle.addEventListener('pointerdown', e => { drag = true; handle.setPointerCapture(e.pointerId); });
handle.addEventListener('pointermove', e => { if (drag) fromX(e.clientX); });
handle.addEventListener('pointerup', () => drag = false);
cmp.addEventListener('click', e => { if (e.target !== handle) fromX(e.clientX); });
handle.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') setC(cpos - 4); if (e.key === 'ArrowRight') setC(cpos + 4); });
const cBimg = $('#cBimg'), cLab = $('#cLab'), konfCta = $('#konfCta'), phFolie = $('#phFolie');
$$('#chips button').forEach(b => {
  const pre = new Image(); pre.src = 'assets/img/' + b.dataset.s + '.webp';
  b.setAttribute('aria-label', b.dataset.n);
  b.addEventListener('click', () => {
    $$('#chips button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    cBimg.src = 'assets/img/' + b.dataset.s + '.webp'; cLab.textContent = b.dataset.n;
    konfCta.textContent = b.dataset.n + ' anfragen'; phFolie.value = b.dataset.n;
    // kurzer Wischer: Regler fährt einmal durch
    if (!reduce) { const t0 = performance.now(), from = 96, to = 50; const st = t => { const p = clamp((t - t0) / 700), e = 1 - Math.pow(1 - p, 3); setC(from + (to - from) * e); if (p < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); }
  });
});

/* ---------- 08 Karriere: Bewerbung in 60 Sekunden ---------- */
const dlg = $('#jobDlg');
$('#jobBtn').addEventListener('click', () => { showQ(1); dlg.showModal(); });
function showQ(n) { $$('.jd-q', dlg).forEach(q => q.classList.toggle('on', +q.dataset.q === n)); $('#jdStep').textContent = n <= 4 ? n + ' / 4' : ''; }
$$('.jd-q .opts button', dlg).forEach(b => b.addEventListener('click', () => showQ(+b.closest('.jd-q').dataset.q + 1)));
$('#jdSend').addEventListener('click', () => showQ(5));

/* ---------- 09 Angebot per Foto ---------- */
const track = $$('#track li');
$$('.slot input').forEach(inp => inp.addEventListener('change', () => {
  const f = inp.files && inp.files[0]; if (!f) return;
  const s = inp.closest('.slot'); s.style.backgroundImage = 'url(' + URL.createObjectURL(f) + ')'; s.classList.add('has');
  const n = $$('.slot.has').length; track.forEach((t, i) => t.classList.toggle('on', i === 0 || (i === 1 && n >= 3)));
}));
$('#phMain').addEventListener('click', () => $('.slot input').click());
$('#phSend').addEventListener('click', () => { track.forEach(t => t.classList.add('on')); $('#phOk').hidden = false; });

/* Weiches Springen zu Kapiteln (auch über den Fächer) */
const jump = id => { const t = document.getElementById(id); if (!t) return false; scrollTo({ top: id === 'start' ? 0 : t.getBoundingClientRect().top + scrollY, behavior: reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', '#' + id); return true; };
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  if (a.classList.contains('blade') && fan.classList.contains('compact') && mobile() && !fan.classList.contains('open')) return;
  if (jump(a.getAttribute('href').slice(1))) e.preventDefault();
});

/* ---------- Scroll-Steuerung ---------- */
const secs = $$('[data-ch]');
const prog = el => { const r = el.getBoundingClientRect(); const h = r.height - innerHeight; return h > 0 ? clamp(-r.top / h) : clamp((innerHeight - r.top) / (innerHeight + r.height)); };
const enter = el => { const r = el.getBoundingClientRect(); return clamp((innerHeight - r.top) / innerHeight); };
let ticking = false, barsDone = false, kinN = 0;
function frame() {
  ticking = false;
  const y = scrollY;
  nav.classList.toggle('solid', y > 40);
  // aktives Kapitel
  const dp = prog(duo);
  let a;
  const dr = duo.getBoundingClientRect();
  if (dr.bottom > innerHeight * .5) a = duoFrame(dp);
  else {
    duoFrame(1);
    a = 1;
    for (const s of secs) { const r = s.getBoundingClientRect(); if (r.top <= innerHeight * .5) a = +s.dataset.ch; }
    const last = document.body.getBoundingClientRect().bottom - innerHeight < 4; if (last) a = 8;
  }
  A = a;
  fan.classList.toggle('compact', dp > .3 || dr.bottom < innerHeight * .5);
  layoutFan();
  // Wissen: Schichten fahren auseinander
  const wp = prog($('#wissen'));
  const sep = mobile() ? clamp(enter($('#layers')) * 1.6 - .3) : clamp(enter($('#wissen')) * 1.1 - .25 + wp * 1.2);
  lays.forEach((l, i) => l.style.setProperty('--z', ((1.5 - i) * (mobile() ? 46 : 78) * sep).toFixed(1)));
  if (!barsDone && enter($('#chart')) > .35) { barsDone = true; $$('.bar').forEach(b => b.style.setProperty('--g', 1)); }
  // Handwerk: Folie öffnet sich zum Makro
  const hand = $('#handwerk');
  if (!mobile()) { const hp = prog(hand); hand.style.setProperty('--rv', clamp(enter(hand) * 1.25 - .15).toFixed(3)); hand.style.setProperty('--hp', hp.toFixed(3)); }
  // Referenzen: Lichtleisten
  $('#referenzen').style.setProperty('--bl', enter($('#referenzen')) > .4 ? 1 : 0);
  // Alles folierbar: Lamellen werden Karten
  if (!mobile()) { const ap = clamp(prog($('#alles')) * 2.2); $$('.card').forEach((c, i) => c.style.setProperty('--o', clamp(ap * 1.6 - i * .18).toFixed(3))); }
  // Karriere: Wörter einzeln
  const jp = mobile() ? enter($('.j-copy')) : prog($('#karriere'));
  const n = Math.floor(clamp(jp * (mobile() ? 1.6 : 2.2)) * 4.01);
  if (n !== kinN) { kinN = n; $$('.kin span').forEach((s, i) => s.classList.toggle('in', i < n)); }
  // Angebot: Handy fährt hoch
  $('#phone').style.setProperty('--pp', clamp(enter($('#angebot')) * 1.5).toFixed(3));
}
const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
addEventListener('scroll', req, { passive: true });
addEventListener('resize', req);
frame();
})();
