/* BAU Facility Services · Seite Zusatzleistungen: Phasen, Vorher/Nachher, Schritte beim Scrollen, Koordination ohne/mit */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const A = window.ASSETS || { img: {} };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Bilder aus dem Manifest, fehlende ausblenden */
  $$('img[data-img]').forEach(img => {
    const n = img.dataset.img, e = A.img[n]; if (!e) { img.hidden = true; return; }
    img.srcset = e.sizes.map(w => `assets/img/${n}-${w}.webp ${w}w`).join(', ');
    img.src = `assets/img/${n}-${e.sizes[0]}.webp`; img.sizes = '(max-width:1020px) 100vw, 55vw'; img.decoding = 'async';
  });

  /* Menü + Fortschritt */
  const burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = menu.hidden; menu.hidden = !o; burger.setAttribute('aria-expanded', String(o)); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }));
  const bar = $('.progress');
  const onScroll = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Planung: Phasen zum Antippen */
  const PH = [
    ['Analyse', 'Wir sehen uns das Objekt an, nehmen den Bestand auf und klären mit Ihnen Ziel, Zeitraum und Budget. Hinweise Ihres Hausmeisters fließen direkt ein.', ['Begehung vor Ort', 'Bestand und Mängel dokumentiert', 'Ziel und Budgetrahmen festgelegt']],
    ['Konzeption', 'Aus der Analyse wird ein Plan: Lösung, Gewerke, Reihenfolge, Kosten und Termine. Sie wissen vor dem Start, was wann passiert.', ['Ablauf- und Terminplan', 'Gewerke und Partner ausgewählt', 'Kosten transparent aufgeschlüsselt']],
    ['Umsetzung', 'Wir koordinieren alle Gewerke auf der Baustelle, sichern die Qualität und halten Sie mit kurzen Fortschrittsberichten auf dem Laufenden.', ['Ein Ansprechpartner für alles', 'Fortschritt mit Fotos', 'Termine und Budget im Blick']],
    ['Übergabe', 'Gemeinsame Abnahme mit Protokoll. Danach betreut auf Wunsch Ihr Hausmeister das Objekt weiter, damit der neue Zustand lange hält.', ['Abnahme mit Foto-Protokoll', 'Unterlagen und Gewährleistung', 'Laufende Betreuung möglich']]
  ];
  const box = $('#phasebox'), tabs = $$('.phasetabs button');
  function setPh(i) {
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    const [h, txt, li] = PH[i];
    box.innerHTML = `<b>${i + 1} · ${h}</b><p>${txt}</p><ul class="ticks">${li.map(x => `<li>${x}</li>`).join('')}</ul>`;
    if (!reduced) box.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
  }
  tabs.forEach((t, i) => t.addEventListener('click', () => setPh(i)));
  $('.phasetabs').addEventListener('keydown', e => { const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'); if (e.key === 'ArrowRight') { setPh((i + 1) % 4); tabs[(i + 1) % 4].focus(); } if (e.key === 'ArrowLeft') { setPh((i + 3) % 4); tabs[(i + 3) % 4].focus(); } });
  setPh(0);

  /* Bau & Umbau: Vorher/Nachher, fährt beim Erscheinen einmal auf */
  const wipe = $('#wipe');
  function setX(p) { p = Math.max(0, Math.min(100, p)); wipe.style.setProperty('--x', p + '%'); wipe.setAttribute('aria-valuenow', Math.round(p)); }
  let drag = false; const px = e => { const r = wipe.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
  wipe.addEventListener('pointerdown', e => { drag = true; wipe.setPointerCapture(e.pointerId); setX(px(e)); });
  wipe.addEventListener('pointermove', e => { if (drag) setX(px(e)); });
  wipe.addEventListener('pointerup', () => drag = false); wipe.addEventListener('pointercancel', () => drag = false);
  wipe.addEventListener('keydown', e => { const v = +wipe.getAttribute('aria-valuenow'); if (e.key === 'ArrowLeft') setX(v - 5); if (e.key === 'ArrowRight') setX(v + 5); });
  setX(reduced ? 50 : 92);
  if (!reduced) new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect(); const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1400); setX(92 - 42 * (1 - Math.pow(1 - k, 3))); if (k < 1 && !drag) requestAnimationFrame(f); })(t0); }, { threshold: .5 }).observe(wipe);

  /* Sanierung: Bild folgt dem Schritt, der gerade in der Mitte steht */
  const sImgs = $$('#zsMedia img'), sBar = $('#zsBar'), steps = $$('.zstep');
  function setStep(n) { sImgs.forEach((im, i) => im.classList.toggle('on', i === n)); steps.forEach((s, i) => s.classList.toggle('on', i === n)); sBar.style.width = ((n + 1) / 3 * 100) + '%'; }
  const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setStep(+e.target.dataset.step); }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => sio.observe(s)); setStep(0);

  /* Koordination: ohne = 7 einzelne Linien zu Ihnen, mit = alles läuft über einen Ansprechpartner */
  const G = ['Sanitär', 'Elektro', 'Maler', 'Trockenbau', 'Fliesen', 'Boden', 'Garten'];
  const svg = $('#zkSvg'), map = $('#zkMap'), num = $('#zkNum'), ntx = $('#zkTxt');
  // Breit: Fächer nach rechts · Schmal (Handy): von oben nach unten, damit die Schrift groß genug bleibt
  function drawMap() {
    const nw = innerWidth <= 700;
    let you, hub, pos, rw, rh, fs, vb;
    if (nw) {
      vb = '0 0 360 540'; you = { x: 180, y: 46 }; hub = { x: 180, y: 160 }; rw = 150; rh = 46; fs = 19;
      pos = G.map((g, i) => ({ g, x: i === 6 ? 180 : (i % 2 ? 268 : 92), y: 268 + Math.floor(i / 2) * 76 }));
    } else {
      vb = '0 0 520 420'; you = { x: 60, y: 210 }; hub = { x: 220, y: 210 }; rw = 108; rh = 36; fs = 15;
      pos = G.map((g, i) => { const a = -Math.PI / 2 + (i / (G.length - 1)) * Math.PI; return { g, x: 250 + Math.cos(a) * 200, y: 210 + Math.sin(a) * 175 }; });
    }
    svg.setAttribute('viewBox', vb);
    const curve = (A, B) => nw ? `M${A.x},${A.y} C${A.x},${(A.y + B.y) / 2} ${B.x},${(A.y + B.y) / 2} ${B.x},${B.y}` : `M${A.x},${A.y} C${(A.x + B.x) / 2},${A.y} ${(A.x + B.x) / 2},${B.y} ${B.x},${B.y}`;
    svg.innerHTML = `
    <g class="l-ohne">${pos.map(p => `<path d="${curve(you, p)}"/>`).join('')}</g>
    <g class="l-mit"><path d="M${you.x},${you.y} L${hub.x},${hub.y}"/>${pos.map(p => `<path d="M${hub.x},${hub.y} L${p.x},${p.y}"/>`).join('')}</g>
    <g class="hub" style="transform-origin:${hub.x}px ${hub.y}px"><circle cx="${hub.x}" cy="${hub.y}" r="${nw ? 38 : 34}"/><text x="${hub.x}" y="${hub.y + 6}" style="font-size:${fs + 1}px">BFS</text></g>
    <g class="you"><circle cx="${you.x}" cy="${you.y}" r="${nw ? 34 : 30}"/><text x="${you.x}" y="${you.y + 6}" style="font-size:${fs + 1}px">Sie</text></g>
    ${pos.map(p => `<g class="node"><rect x="${p.x - rw / 2}" y="${p.y - rh / 2}" width="${rw}" height="${rh}" rx="${rh / 2}"/><text x="${p.x}" y="${p.y + fs / 3}" style="font-size:${fs}px">${p.g}</text></g>`).join('')}`;
  }
  drawMap(); let lastNw = innerWidth <= 700; addEventListener('resize', () => { if ((innerWidth <= 700) !== lastNw) { lastNw = !lastNw; drawMap(); } });
  function setV(v) {
    map.dataset.v = v; $$('.zswitch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    num.textContent = v === 'mit' ? '1' : String(G.length); ntx.textContent = v === 'mit' ? 'Ansprechpartner für Sie' : 'Ansprechpartner, Termine und Rechnungen für Sie';
  }
  $$('.zswitch button').forEach(b => b.addEventListener('click', () => setV(b.dataset.v)));
  setV('ohne');
  if (!reduced) new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect(); setTimeout(() => setV('mit'), 900); }, { threshold: .6 }).observe(map);

  /* Sanftes Einblenden */
  if (!reduced) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.zsec__media,.zsec__copy,.zpath li,.zcoord__copy,.zcoord__map').forEach(el => io.observe(el));
  }
})();
