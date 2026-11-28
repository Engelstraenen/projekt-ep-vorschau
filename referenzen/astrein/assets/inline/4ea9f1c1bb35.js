
(() => {
const {$, $$, IMG, VID, mobile} = window.SUB;
const ST = [
  {m:0, k:'al1', h:['Drei','Jahre.','Ein','Stück.'], l:['Sicherheit an jeder Maschine','Den Betrieb und das Team kennenlernen','Ab Woche 2 an echten Aufträgen'], n:'Ziehen Sie den Zeitstrahl – so entsteht Melis Gesellenstück.'},
  {m:2, k:'al2', h:['Anreißen.'], l:['Holz und Holzwerkstoffe unterscheiden','Zeichnungen lesen, Maße übertragen','Handwerkzeuge schärfen und führen']},
  {m:8, k:'al3', v:'l3', h:['Sägen.'], l:['Formatkreissäge einrichten und sicher bedienen','Hobeln, Fräsen, Bohren','Absaugung und Gesundheitsschutz']},
  {m:14, k:'al4', h:['Programmieren.'], l:['Anwenderprogramme und CNC','Teile maßgenau herstellen','Arbeitsabläufe planen, im Team arbeiten']},
  {m:20, k:'al5', v:'l5', h:['Verbinden.','Pressen.'], l:['Teile zu Erzeugnissen zusammenbauen','Verbindungen, Leimen, Pressen','Qualität prüfen'], n:'Vor Ende des 2. Jahres: Zwischenprüfung.'},
  {m:28, k:'al6', v:'l6', h:['Furnieren.'], l:['Furniere auswählen und spiegeln','Oberflächen veredeln','Beschläge montieren']},
  {m:34, k:'al7', v:'l7', h:['Ölen.'], l:['Oberflächen behandeln: Öl, Lack, Seife','Holzschutz','Montage beim Kunden']},
  {m:36, k:'al8', h:['Gesellin.'], l:['Entwurf vom Prüfungsausschuss genehmigt','Gesellenstück in höchstens 100 Stunden','Fachgespräch, höchstens 30 Minuten'], n:'Quelle: § 9 TischlAusbV – siehe unten.'},
];
const box = $('#stages'), gs = $('#gs'), tl = $('#tl');
const avail = ST.map(s => !!(IMG[s.k] || VID[s.v]));
ST.forEach((s, i) => { const d = document.createElement('div'); d.className = 'st';
  if (VID[s.v]) d.innerHTML = `<video muted playsinline loop preload="metadata" src="${mobile() && VID[s.v].m ? VID[s.v].m : VID[s.v].d}" ${IMG[s.k] ? `poster="${mobile() ? IMG[s.k].m : IMG[s.k].d}"` : ''}></video>`;
  else if (IMG[s.k]) d.innerHTML = `<img src="${mobile() ? IMG[s.k].m : IMG[s.k].d}" alt="${s.h.join(' ')}">`;
  box.appendChild(d);
  const ms = document.createElement('span'); ms.className = 'ms'; ms.style.left = (s.m / 36 * 100) + '%'; tl.appendChild(ms); });
let month = 0, cur = -1;
const stageFor = m => { let i = 0; ST.forEach((s, j) => { if (m >= s.m) i = j; }); return i; };
function show(i) {
  if (i === cur) return; cur = i; const s = ST[i];
  // nächstes vorhandenes Bild zeigen, falls dieses fehlt (nie leer)
  let vi = i; while (vi > 0 && !avail[vi]) vi--; if (!avail[vi]) { vi = avail.indexOf(true); }
  $$('.st', box).forEach((d, j) => { d.classList.toggle('on', j === vi); const v = $('video', d); if (v) j === vi ? v.play().catch(() => {}) : v.pause(); });
  const h = $('#gsH'); h.classList.remove('in'); h.innerHTML = s.h.map(w => `<span>${w}</span>`).join(' '); requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('in')));
  $$('span', h).forEach((sp, j) => sp.style.transitionDelay = (j * .08) + 's');
  $('#gsL').innerHTML = s.l.map(x => `<li>${x}</li>`).join(''); $('#gsN').textContent = s.n || '';
}
function setMonth(m, fromDrag) {
  month = Math.max(0, Math.min(36, m));
  const p = month / 36; $('#knob').style.left = (p * 100) + '%'; $('#knob').textContent = Math.round(month); $('#fillr').style.width = (p * 100) + '%';
  $('#mon').textContent = month < .5 ? 'Monat 0 · Start' : 'Monat ' + Math.round(month) + ' · ' + (month <= 12 ? '1.' : month <= 24 ? '2.' : '3.') + ' Lehrjahr';
  $$('.ms', tl).forEach((x, j) => x.classList.toggle('done', month >= ST[j].m));
  tl.setAttribute('aria-valuenow', Math.round(month));
  show(stageFor(month));
  if (fromDrag) { const top = gs.offsetTop + p * (gs.offsetHeight - innerHeight); scrollTo({ top }); }
}
/* Ziehen */
let drag = false;
const fromX = x => { const r = tl.getBoundingClientRect(); return (x - r.left) / r.width * 36; };
tl.addEventListener('pointerdown', e => { drag = true; tl.setPointerCapture(e.pointerId); setMonth(fromX(e.clientX), true); });
tl.addEventListener('pointermove', e => { if (drag) setMonth(fromX(e.clientX), true); });
tl.addEventListener('pointerup', () => drag = false);
tl.addEventListener('keydown', e => { if (e.key === 'ArrowRight') setMonth(month + 1, true); if (e.key === 'ArrowLeft') setMonth(month - 1, true); });
/* Scrollen */
addEventListener('scroll', () => { if (drag) return; const r = gs.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / (gs.offsetHeight - innerHeight))); setMonth(p * 36); }, { passive: true });
/* Aktion ab Sekunde 1: Zeitstrahl läuft beim Laden kurz an */
setMonth(0); setTimeout(() => { if (scrollY < 10) { let m = 0; const t = setInterval(() => { m += .25; $('#knob').style.left = (m / 36 * 100) + '%'; $('#fillr').style.width = (m / 36 * 100) + '%'; if (m >= 2) { clearInterval(t); setTimeout(() => setMonth(0), 500); } }, 40); } }, 700);
})();
