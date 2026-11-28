
(() => {
const {$, $$, VID, mobile} = window.SUB;
/* Neun Stationen à 5 s, je eine eigene 4K-Datei tag1…tag9 (tools/tagfilm.py); die Seite blendet weich über */
const SEG = 5, XF = .6, STEP = SEG;
const DAY = [
  {t:'06:58', h:'Licht an.', p:'Die Halle ist noch blau. Kaffee in der Hand, die Absaugung läuft an.', f:'Arbeitsbeginn 07:00 · 38,5 h/Woche'},
  {t:'07:15', h:'Fünf Minuten Plan.', p:'Wer fräst, wer furniert, wer fährt raus? Alle wissen, was heute passiert.', f:'Jeden Morgen · alle am Bildschirm'},
  {t:'07:30', h:'Die CNC startet.', p:'Das Programm kommt aus dem Aufmaß von gestern. Lina tippt, die Spindel läuft.', f:'CNC ab dem 2. Lehrjahr'},
  {t:'09:00', h:'Raus zum Kunden.', p:'Fronten in Decken, Werkzeug in Kisten. Montage ist Teamsport.', f:'Fahrzeit = Arbeitszeit'},
  {t:'10:30', h:'Schleifen mit Absaugung.', p:'Staub im Gegenlicht – aber nicht in der Lunge.', f:'Absaugung an jeder Maschine'},
  {t:'12:00', h:'Mittag im Hallentor.', p:'Paletten, Sonne, zu viel Gelächter. Pause ist Pause.', f:'30 min Pause · gemeinsam'},
  {t:'13:30', h:'Einmal gezeigt.', p:'Dann machst du es. Und dann noch mal, bis die Verbindung sitzt.', f:'Ausbilder an deiner Seite'},
  {t:'14:30', h:'Die Küche hängt.', p:'Front einhängen, ausrichten, Fuge prüfen. Der Kunde kommt heim und staunt.', f:'Fuge 3 mm · überall gleich'},
  {t:'15:45', h:'Feierabend.', p:'Räder raus, Sonne tief. Freitags früher.', f:'Freitag 13:00 Schluss', kin:1},
];
const day = $('#day'), nav = $('#arcnav'), cards = $('#cards');
const films = DAY.map((d, i) => { const v = document.createElement('video'), e = VID['tag' + (i + 1)]; v.muted = true; v.playsInline = true; v.preload = i < 2 ? 'auto' : 'metadata'; if (e) { v.src = mobile() && e.m ? e.m : e.d; if (e.poster) v.poster = e.poster; } $('#films').appendChild(v); return v; });
const film = films[0];
cards.innerHTML = DAY.map((d, i) => `<div class="card"><p class="eyebrow">Station ${i + 1} von ${DAY.length}</p><h2>${d.h}</h2><p>${d.p}</p><span class="fact">${d.f}</span></div>`).join('');
/* Uhr-Bogen 06–16 Uhr */
const svg = $('#arcsvg'), R = 170, a0 = 200, a1 = 340; let s = '';
const ang = m => a0 + (m - 360) / (960 - 360) * (a1 - a0), rad = d => d * Math.PI / 180;
for (let h = 6; h <= 16; h++) for (let q = 0; q < 4 && !(h === 16 && q); q++) { const m = h * 60 + q * 15, a = rad(ang(m)), big = !q, r1 = R - (big ? 18 : 9);
  s += `<line class="tick ${big ? 'big' : ''}" x1="${Math.cos(a) * r1}" y1="${Math.sin(a) * r1}" x2="${Math.cos(a) * R}" y2="${Math.sin(a) * R}"/>`;
  if (big) s += `<text x="${Math.cos(a) * (R - 40)}" y="${Math.sin(a) * (R - 40) + 5}" text-anchor="middle">${String(h).padStart(2, '0')}</text>`; }
svg.innerHTML = s + '<path class="done" id="done"/><line class="hand" id="hand"/><circle class="dot" id="dot" r="6"/>';
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const span = () => day.offsetHeight - innerHeight;
DAY.forEach((d, i) => { const a = document.createElement('a'); a.href = '#'; a.textContent = d.t; a.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: day.offsetTop + (i + .5) / DAY.length * span(), behavior: 'smooth' }); }); nav.appendChild(a); });
/* Film läuft beim Laden kurz von selbst an (Aktion ab Sekunde 1), dann spult das Scrollen */
let auto = 0, autoT0 = performance.now(), cur = -1, shown = 0;
film.addEventListener('loadedmetadata', () => { autoT0 = performance.now(); });
function frame(now) {
  const dur = DAY.length * SEG, r = day.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, -r.top / span()));
  auto = Math.min(1.4, (now - autoT0) / 1000 * .9);
  const t = Math.min(dur - .05, Math.max(p * dur, p < .02 ? auto : 0));
  const i = Math.min(DAY.length - 1, Math.floor(t / SEG)), v = films[i], lt = Math.min(SEG - .05, t - i * SEG);
  if (v.readyState >= 1 && Math.abs(lt - v.currentTime) > .04) v.currentTime = v.currentTime + (lt - v.currentTime) * .35;
  shown = t;
  if (i !== cur) { cur = i; films.forEach((f, j) => { f.classList.toggle('on', j === i); if (Math.abs(j - i) <= 1 && f.preload !== 'auto') { f.preload = 'auto'; f.load(); } }); $$('.card', cards).forEach((c, j) => c.classList.toggle('on', j === i)); $$('a', nav).forEach((a, j) => a.classList.toggle('on', j === i)); $('#kin').classList.toggle('in', !!DAY[i].kin); }
  /* Uhr läuft mit dem Film: innerhalb einer Station von ihrer Zeit zur nächsten */
  const b = DAY[Math.min(DAY.length - 1, i + 1)], k = Math.max(0, Math.min(1, (t - i * STEP) / STEP));
  const m = Math.round(toMin(DAY[i].t) + (toMin(b.t) - toMin(DAY[i].t)) * k);
  $('#time').innerHTML = `${String(Math.floor(m / 60)).padStart(2, '0')}<b>:</b>${String(m % 60).padStart(2, '0')}`;
  const an = rad(ang(m)), st = rad(ang(360)), x = Math.cos(an), y = Math.sin(an);
  $('#done').setAttribute('d', `M${Math.cos(st) * R} ${Math.sin(st) * R}A${R} ${R} 0 0 1 ${x * R} ${y * R}`);
  const hd = $('#hand'); hd.setAttribute('x1', x * (R - 30)); hd.setAttribute('y1', y * (R - 30)); hd.setAttribute('x2', x * (R + 14)); hd.setAttribute('y2', y * (R + 14));
  $('#dot').setAttribute('cx', x * R); $('#dot').setAttribute('cy', y * R);
  $('#prog').style.width = (p * 100) + '%'; $('#hint').style.opacity = p > .03 ? 0 : 1;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
