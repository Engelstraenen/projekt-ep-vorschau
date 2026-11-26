/* BAU Facility Services · W1 „Das Haus im Schnitt“ */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const A = window.ASSETS || { img: {}, video: {} };
  const mob = matchMedia('(max-width:700px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Objektart: Privat (Wohnanlage) / Gewerblich (Firmenanlage) ----------
     Je Objektart eigenes Schnitt-Bild, eigene Etagen-Lage (Anteile der 16:9-Fläche, nach dem Bild vermessen)
     und eigene Hausmeister-Aufgaben. */
  const MODES = window.MODES || {
    wohn: {
      cut: 'w1-schnitt', facade: 'w2-fassade',
      photos: { keller: ['hk1', 'Hausmeister liest im Kellerraum die Zähler ab'], eg: ['hk2', 'Hausmeister reinigt den Eingangsbereich mit Briefkastenanlage'], og: ['hk3', 'Hausmeister stellt einen Türschließer im Treppenhaus ein'], dach: ['hk4', 'Hausmeister mit Absturzsicherung reinigt die Dachrinne'], aussen: ['hk5', 'Hausmeister räumt und streut den Weg vor dem Eingang'] }, intro: 'Die ganze Wohnanlage. Vom Keller bis zum Dach.', crumb: 'Hausmeister · Wohnanlage',
      floors: { dach: { x: .40, y: .017, w: .4875, h: .19 }, og: { x: .40, y: .294, w: .4875, h: .311 }, eg: { x: .40, y: .622, w: .4875, h: .156 }, keller: { x: .40, y: .794, w: .4875, h: .161 }, aussen: { x: .006, y: .533, w: .306, h: .41 } },
      bld: { x: .006, y: .017, w: .969, h: .95 },
      names: { keller: 'Keller', eg: 'Eingang & Treppenhaus', og: 'Wohnetagen', dach: 'Dach', aussen: 'Außenanlage' },
      short: { keller: 'Keller', eg: 'Eingang', og: 'Wohnetagen', dach: 'Dach', aussen: 'Außen' },
      cards: {
        keller: ['Haustechnik im Blick.', ['Heizung kontrollieren: Druck, Störungen', 'Zählerstände ablesen und dokumentieren', 'Waschküche, Fahrrad- und Kellerräume in Ordnung', 'Sperrmüll und Gerümpel entsorgen'], 'Ein Leitungswasserschaden kostet im Schnitt über 4.600 € (GDV 2025). Wer regelmäßig nachsieht, entdeckt ihn früher.'],
        eg: ['Der erste Eindruck stimmt.', ['Treppenhausreinigung, Eingang sauber und sicher', 'Briefkasten-, Klingel- und Schließanlage', 'Beleuchtung prüfen, Leuchtmittel tauschen', 'Aufzug kontrollieren, Störungen melden']],
        og: ['Ansprechpartner für die Mieter.', ['Kleine Reparaturen: Schlösser, Dichtungen, Türschließer', 'Brandschutz-Kontrollgang: Fluchtwege frei', 'Handwerker in Wohnungen einlassen und begleiten', 'Schäden mit Foto an die Hausverwaltung melden']],
        dach: ['Dicht, bevor es regnet.', ['Dachrinnen und Fallrohre reinigen', 'Sichtkontrolle nach Sturm und Unwetter', 'Dachausstieg und Dachboden kontrollieren', 'Schäden sofort melden, bevor Wasser eindringt']],
        aussen: ['Draußen gepflegt, im Winter sicher.', ['Winterdienst: räumen, streuen, mit Protokoll', 'Grünpflege: Rasen, Hecken, Laub', 'Müllplatz sauber, Tonnen raus und rein', 'Spielplatz, Wege und Parkplätze kontrollieren']]
      }
    },
    firma: {
      cut: 'f1-schnitt', facade: 'f2-fassade',
      photos: { keller: ['hf1', 'Hausmeister prüft die Lüftungsanlage im Technikraum'], eg: ['hf2', 'Hausmeister schließt morgens den Eingang des Bürogebäudes auf'], og: ['hf3', 'Hausmeister tauscht eine Deckenleuchte im Büro'], dach: ['hf4', 'Hausmeister prüft die Klimaanlagen auf dem Dach'], aussen: ['hf5', 'Hausmeister räumt den Firmenparkplatz mit der Schneefräse'] }, intro: 'Die ganze Firmenanlage. Vom Technikraum bis zum Dach.', crumb: 'Hausmeister · Firmenanlage',
      floors: { dach: { x: .40, y: .03, w: .55, h: .16 }, og: { x: .447, y: .183, w: .49, h: .361 }, eg: { x: .447, y: .561, w: .49, h: .206 }, keller: { x: .447, y: .778, w: .49, h: .15 }, aussen: { x: .01, y: .356, w: .42, h: .567 } },
      bld: { x: .01, y: .05, w: .95, h: .9 },
      names: { keller: 'Technikräume', eg: 'Empfang & Eingang', og: 'Büroetagen', dach: 'Dach & Anlagen', aussen: 'Parkplatz & Gelände' },
      short: { keller: 'Technik', eg: 'Empfang', og: 'Büros', dach: 'Dach', aussen: 'Gelände' },
      cards: {
        keller: ['Technik läuft, bevor jemand fragt.', ['Funktionskontrolle Heizung, Lüftung und Klima', 'Zählerstände ablesen und dokumentieren', 'Wartungstermine der Fachfirmen begleiten', 'Technikräume frei und ordentlich halten']],
        eg: ['Jeden Morgen startklar.', ['Schließdienst: auf- und abschließen, Schlüsselverwaltung', 'Eingang, Türen und Automatiktüren prüfen', 'Beleuchtung und Aufzug kontrollieren', 'Ansprechpartner vor Ort für Mitarbeiter und Besucher']],
        og: ['Kleine Störungen, schnell behoben.', ['Kleine Reparaturen und Leuchtmittelwechsel', 'Möbel aufbauen, Büros umräumen', 'Brandschutz-Kontrollgang: Fluchtwege, Feuerlöscher-Standorte', 'Handwerker und Prüfdienste begleiten']],
        dach: ['Dach und Anlagen im Blick.', ['Dachrinnen und Lichtkuppeln reinigen', 'Sichtkontrolle von Klima- und Solaranlagen', 'Kontrolle nach Sturm und Unwetter', 'Schäden sofort melden']],
        aussen: ['Gelände sicher, Zufahrt frei.', ['Winterdienst für Parkplätze und Zufahrten, mit Protokoll', 'Grünflächen und Hecken pflegen', 'Müll- und Wertstoffcontainer im Blick', 'Schranke, Tore und Anlieferzone kontrollieren']]
      }
    }
  };
  const qMode = new URLSearchParams(location.search).get('anlage');
  let mode = qMode === 'firma' || qMode === 'gewerblich' ? 'firma' : 'wohn';
  try { if (!qMode && localStorage.getItem('bfs-anlage') === 'firma') mode = 'firma'; } catch (_) {}
  let FLOORS = MODES[mode].floors;
  let SHORT = MODES[mode].short;

  /* ---------- Medien: fehlende Bilder ausblenden ---------- */
  function srcFor(name) { const e = A.img[name]; if (!e) return null; return { srcset: e.sizes.map(w => `assets/img/${name}-${w}.webp ${w}w`).join(', '), src: `assets/img/${name}-${e.sizes[0]}.webp` }; }
  $$('img[data-img]').forEach(img => {
    const s = srcFor(img.dataset.img); if (!s) { img.hidden = true; return; }
    img.srcset = s.srcset; img.src = s.src; img.decoding = 'async';
    img.sizes = img.closest('.house') ? '(max-width:700px) 240vw, 260vw' : img.closest('.contact-card') ? '240px' : '(max-width:1020px) 100vw, 60vw';
  });
  $$('video[data-video]').forEach(v => { const e = A.video[v.dataset.video]; if (!e) { v.remove(); return; } v.src = (mob && e.mobile) || e.desktop; });
  const hasCut = !!A.img[MODES[mode].cut];

  /* ---------- Hero-Film: läuft sofort an, bleibt am Ende an der Tür stehen ---------- */
  const hv = $('.hero__media video');
  if (hv) { const go = () => hv.play().catch(() => {}); hv.addEventListener('canplay', go, { once: true }); if (reduced) hv.removeAttribute('autoplay'); }

  /* ---------- Menü ---------- */
  const burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = menu.hidden; menu.hidden = !o; burger.setAttribute('aria-expanded', String(o)); });

  /* ---------- Bewertungen (Beispiele) ---------- */
  const REV = ['„Ein Ansprechpartner für das ganze Haus. Genau so haben wir uns das gewünscht.“', '„Umbau termingerecht, alles sauber koordiniert, und danach kümmern sie sich weiter ums Haus.“', '„Schnell, zuverlässig, und man weiß immer, wer zuständig ist.“'];
  let ri = 0; const rt = $('#revTxt');
  if (rt) setInterval(() => { rt.parentElement.style.opacity = 0; setTimeout(() => { ri = (ri + 1) % REV.length; rt.textContent = REV[ri]; rt.parentElement.style.opacity = 1; }, 600); }, 6500);

  /* ---------- Formulare → E-Mail ---------- */
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    const body = `Name: ${f.get('name')}\nTelefon: ${f.get('tel')}\nE-Mail: ${f.get('mail')}\nThema: ${f.get('topic')}\n\n${f.get('msg')}`;
    location.href = 'mailto:info@baufacilityservices.de?subject=' + encodeURIComponent('Anfrage: ' + f.get('topic')) + '&body=' + encodeURIComponent(body);
  });
  const modal = $('#apply'); let tm, left;
  const step = i => { $$('fieldset', modal).forEach((f, k) => f.hidden = k !== i); $$('.stepbar i', modal).forEach((s, k) => s.classList.toggle('on', k <= i)); };
  const openApply = () => { modal.hidden = false; left = 60; $('#timer').textContent = left; step(0); clearInterval(tm); tm = setInterval(() => { left = Math.max(0, left - 1); $('#timer').textContent = left; }, 1000); setTimeout(() => $('select', modal).focus(), 50); };
  const closeM = () => { modal.hidden = true; clearInterval(tm); };
  $$('[data-open="apply"]').forEach(b => b.addEventListener('click', openApply));
  $$('[data-next]', modal).forEach((b, i) => b.addEventListener('click', () => step(i + 1)));
  $('[data-close]', modal).addEventListener('click', closeM);
  modal.addEventListener('click', e => { if (e.target === modal) closeM(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeM(); });
  $('#applyForm').addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    location.href = 'mailto:info@baufacilityservices.de?subject=' + encodeURIComponent('Bewerbung über die Webseite') + '&body=' + encodeURIComponent(`Bereich: ${f.get('job')}\nFührerschein B: ${f.get('fs')}\nStart: ${f.get('ab')}\nName: ${f.get('n')}\nTelefon: ${f.get('t')}`);
    closeM();
  });

  /* ---------- Hausmeister-Karten je Objektart ---------- */
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function renderCards() {
    const M = MODES[mode];
    ['keller', 'eg', 'og', 'dach', 'aussen'].forEach(k => {
      const el = $('#c-' + k); if (!el) return; const [h, li, note] = M.cards[k];
      el.setAttribute('aria-labelledby', 't-' + k);
      const ph = M.photos && M.photos[k] && srcFor(M.photos[k][0]);
      el.innerHTML = (ph ? `<div class="sc__media"><img src="${ph.src}" srcset="${ph.srcset}" sizes="(max-width:700px) 92vw, 480px" alt="${esc(M.photos[k][1])}" decoding="async"></div>` : '') + `<p class="crumb">${M.crumb} · <b>${M.names[k]}</b></p><h2 id="t-${k}">${esc(h)}</h2><ul class="ticks">${li.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` +
        (note ? `<p class="hm-note">${esc(note)}</p>` : '') + (k === 'aussen' ? '<a class="more" href="hausmeister.html">Alle Hausmeister-Leistungen <span class="arrow">→</span></a>' : '');
    });
    const ih = $('#introH'); if (ih) ih.textContent = M.intro;
    $$('.lab').forEach(l => { const k = l.dataset.f; l.querySelector('b').textContent = innerWidth < 700 ? M.short[k] : M.names[k]; });
  }
  function setImgs() {
    const M = MODES[mode];
    [['.house .cut', M.cut], ['.house .facade', M.facade]].forEach(([sel, name]) => { const im = $(sel); if (!im) return; im.dataset.img = name; const s = srcFor(name); if (!s) { im.hidden = true; return; } im.hidden = false; im.srcset = s.srcset; im.src = s.src; });
  }
  renderCards(); setImgs();

  /* ---------- Etagen-Labels + Hervorhebung ---------- */
  const house = $('#house'), stage = $('#stage'), hl = $('#hl');
  function placeLabels() {
    $$('.lab').forEach(l => {
      const f = FLOORS[l.dataset.f]; if (!f) return;
      const narrow = innerWidth < 700;
      if (l.dataset.f === 'aussen') Object.assign(l.style, { left: (f.x + f.w * .1) * 100 + '%', right: 'auto', top: (f.y + f.h * .12) * 100 + '%', transform: 'translateY(-50%)', flexDirection: 'row' });
      else Object.assign(l.style, { left: (f.x + f.w) * 100 + '%', top: (f.y + f.h / 2) * 100 + '%', transform: 'translateY(-50%)' });
      const hw = house.getBoundingClientRect().width || innerWidth * .9;
      const room = l.dataset.f === 'aussen' ? 0 : narrow ? 8 : hw * (1 - f.x - f.w) - 190;
      l.style.setProperty('--len', (l.dataset.f === 'aussen' ? 0 : Math.max(16, Math.min(110, room))) + 'px');
    });
  }
  function showHl(k) { const f = FLOORS[k]; if (!f) { hl.style.opacity = 0; return; } Object.assign(hl.style, { left: f.x * 100 + '%', top: f.y * 100 + '%', width: f.w * 100 + '%', height: f.h * 100 + '%', opacity: 1 }); }
  $$('.lab').forEach(l => { l.addEventListener('mouseenter', () => showHl(l.dataset.f)); l.addEventListener('focus', () => showHl(l.dataset.f)); l.addEventListener('mouseleave', () => showHl()); l.addEventListener('blur', () => showHl()); });
  placeLabels(); addEventListener('resize', placeLabels);
  if (!hasCut) { $('#labels').hidden = true; }

  /* ---------- Scroll-Regie ---------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  let lenis;
  if (window.Lenis && !reduced) { lenis = new Lenis({ lerp: .12 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

  /* ---------- Kamera ----------
     Akt 1: einmal in den Keller zoomen, dann OHNE Rauszoomen nach oben fahren (Keller → EG → OG → Dach → Außen).
     Akt 2: einmal ruhig zurück aufs ganze Haus, Haus steht links, Rahmen markiert, wo die Firmenleistung stattfindet. */
  const narrow = () => innerWidth <= 700;
  let BLD = MODES[mode].bld; // ganzes Gebäude inkl. Außenanlage
  const head = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head')) || 68;
  // Position, an der das Haus-Detail (Anteile im Bild) bei Skalierung s in der Bühne landen soll
  function aim(r, s, tx, ty) {
    const W = house.offsetWidth, H = house.offsetHeight, sh = stage.offsetHeight, sw = stage.offsetWidth;
    const dx = (r.x + r.w / 2 - .5) * W, dy = (r.y + r.h / 2 - .5) * H;
    const cx = sw / 2, cy = sh / 2 + head() / 2; // Mitte der Haus-Box ohne Verschiebung
    return { x: tx - cx - dx * s, y: ty - cy - dy * s, scale: s };
  }
  let sRide = 1;
  function rideScale() {
    const W = house.offsetWidth, H = house.offsetHeight, sw = stage.offsetWidth, sh = stage.offsetHeight, hd = head(), f = FLOORS.eg;
    sRide = narrow() ? Math.min(sw * .98 / (f.w * W), (sh - hd) * .36 / (f.h * H))
                     : Math.min(sw * .6 / (f.w * W), (sh - hd) * .62 / (f.h * H));
    return sRide;
  }
  function camFloor(k) {
    const sw = stage.offsetWidth, sh = stage.offsetHeight, hd = head(), s = rideScale();
    return narrow() ? aim(FLOORS[k], s, sw / 2, hd + (sh - hd) * .22) : aim(FLOORS[k], s, sw * .33, hd + (sh - hd) / 2);
  }
  function camAll() {
    const W = house.offsetWidth, H = house.offsetHeight, sw = stage.offsetWidth, sh = stage.offsetHeight, hd = head();
    if (narrow()) { const s = Math.min(sw * .9 / (BLD.w * W), (sh - hd) * .36 / (BLD.h * H)); return aim(BLD, s, sw / 2, hd + (sh - hd) * .21); }
    const card = innerWidth > 1020 ? Math.min(560, sw * .44) : Math.min(460, sw * .48);
    const free = sw - card - 2 * Math.max(16, Math.min(64, sw * .04)) - 24;
    const s = Math.min(free * .92 / (BLD.w * W), (sh - hd) * .84 / (BLD.h * H));
    return aim(BLD, s, Math.max(16, Math.min(64, sw * .04)) + free / 2, hd + (sh - hd) / 2);
  }
  const introX = () => innerWidth > 1020 ? stage.offsetWidth * .15 : 0;
  const introS = () => innerWidth > 1020 ? .74 : .8;
  const LEN = mob ? 9000 : 11000;
  /* Die ganze Fahrt ist eine reine Funktion des Fortschritts p (0..1): kein gespeicherter Animations-Zustand,
     darum kann nichts hängen bleiben (Umschalten, Größenwechsel, Zurückscrollen). */
  const clamp = v => Math.max(0, Math.min(1, v));
  const ramp = (p, a, b) => clamp((p - a) / (b - a));
  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const lerp = (a, b, k) => a + (b - a) * k;
  const RIDE = ['keller', 'eg', 'og', 'dach', 'aussen'];
  // Zeitplan: [Kamera-Start, Kamera-Ende] je Station, Karte sichtbar danach bis zur nächsten Fahrt
  const T = { facade: [0, .08], labels: [.06, .10], zoom: [.12, .18], ride: { eg: [.27, .32], og: [.41, .46], dach: [.55, .60], aussen: [.69, .74] }, out: [.83, .89], coord: [.88, .96] };
  const CARDS = { keller: [.17, .27], eg: [.31, .41], og: [.45, .55], dach: [.59, .69], aussen: [.73, .83] };
  const at = { keller: .22, eg: .36, og: .50, dach: .64, aussen: .78, koordination: .95 }; window.__at = at;
  const introCam = p => ({ x: introX(), y: 0, scale: introS() + .04 * ramp(p, 0, .08) });
  function camAt(p) {
    if (p < T.zoom[0]) return introCam(p);
    const mix = (A, B, k) => ({ x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k), scale: lerp(A.scale, B.scale, k) });
    if (p < T.zoom[1]) return mix(introCam(p), camFloor('keller'), ease(ramp(p, T.zoom[0], T.zoom[1])));
    let cur = camFloor('keller');
    for (const k of ['eg', 'og', 'dach', 'aussen']) {
      const [a, b] = T.ride[k];
      if (p < a) return cur;
      const nxt = camFloor(k);
      if (p < b) return mix(cur, nxt, ease(ramp(p, a, b)));
      cur = nxt;
    }
    if (p < T.out[0]) return cur;
    return mix(cur, camAll(), ease(ramp(p, T.out[0], T.out[1])));
  }
  const cardEls = Object.fromEntries(Object.keys(CARDS).map(k => [k, $('#c-' + k)]));
  const coordCard = $('#contactCard'), coordEl = $('#coord'), introEl = $('#intro'), labelsEl = $('#labels'), facadeEl = $('#house .facade');
  function show(el, a, b, p, fade = .015) {
    if (!el) return;
    const o = Math.min(ramp(p, a, a + fade), 1 - ramp(p, b - fade, b));
    const y = p < a + fade ? 24 * (1 - ramp(p, a, a + fade)) : -16 * ramp(p, b - fade, b);
    el.style.opacity = o; el.style.visibility = o > .01 ? 'visible' : 'hidden'; el.style.transform = `translateY(${y}px)`;
  }
  function render(p) {
    const c = camAt(p);
    house.style.transform = `translate(-50%,-50%) translate(${c.x}px,${c.y}px) scale(${c.scale})`;
    if (facadeEl) facadeEl.style.clipPath = `inset(${ramp(p, T.facade[0], T.facade[1]) * 100}% 0 0 0)`;
    const lab = Math.min(ramp(p, T.labels[0], T.labels[1]), 1 - ramp(p, T.zoom[0], T.zoom[0] + .03));
    labelsEl.style.opacity = lab; labelsEl.style.visibility = lab > .01 ? 'visible' : 'hidden';
    $$('.lab').forEach(l => l.style.opacity = 1);
    $$('.lab i').forEach(i => i.style.transform = `scaleX(${ramp(p, T.labels[0], T.labels[1])})`);
    const io = 1 - ramp(p, T.zoom[0], T.zoom[0] + .03);
    introEl.style.opacity = io; introEl.style.transform = `translateY(${-20 * (1 - io)}px)`; introEl.style.visibility = io > .01 ? 'visible' : 'hidden';
    for (const k in CARDS) show(cardEls[k], CARDS[k][0], CARDS[k][1], p);
    show(coordCard, T.coord[0], 2, p, .02);
    const co = ramp(p, T.coord[0], T.coord[0] + .02); coordEl.style.opacity = co;
    const paths = $$('#coordSvg path');
    paths.forEach((pa, i) => pa.style.strokeDashoffset = 1 - ramp(p, T.coord[0] + .01 + i * .008, T.coord[0] + .05 + i * .008));
    if (p > T.out[0]) drawCoord();
  }
  hl.style.opacity = 0;
  const st = ScrollTrigger.create({ trigger: '#haus', start: 'top top', end: '+=' + LEN, pin: '#stage', anticipatePin: 1,
    onUpdate: s => render(s.progress), onRefresh: s => render(s.progress) });
  render(0);

  /* Linien von jeder Etage zum Ansprechpartner (live gemessen) */
  function drawCoord() {
    const svg = $('#coordSvg'), card = $('#contactCard img'); if (!svg || !card || card.hidden) return;
    if (!svg.children.length) svg.innerHTML = ['dach', 'og', 'eg', 'keller'].map(() => '<path pathLength="1" stroke-dasharray="1"/><circle r="4"/>').join('');
    const or = $('#coord').getBoundingClientRect(), hr = house.getBoundingClientRect(), cr = card.getBoundingClientRect();
    const nw = narrow();
    const tx = (nw ? cr.left + cr.width / 2 : cr.left) - or.left, ty = (nw ? cr.top : cr.top + cr.height / 2) - or.top;
    const paths = svg.querySelectorAll('path'), dots = svg.querySelectorAll('circle');
    ['dach', 'og', 'eg', 'keller'].forEach((k, i) => {
      const f = FLOORS[k], x = hr.left + (f.x + f.w) * hr.width - or.left, y = hr.top + (f.y + f.h / 2) * hr.height - or.top;
      const d = nw ? `M${x},${y} C${x + 30},${y} ${tx},${(y + ty) / 2} ${tx},${ty}` : `M${x},${y} C${(x + tx) / 2},${y} ${(x + tx) / 2},${ty} ${tx},${ty}`;
      paths[i].setAttribute('d', d); dots[i].setAttribute('cx', x); dots[i].setAttribute('cy', y);
    });
  }
  drawCoord();

  /* Umschalter Privat / Gewerblich: Bild, Etagen, Aufgaben tauschen, Fahrt neu berechnen */
  function setMode(m) {
    if (m === mode || !MODES[m]) return; mode = m;
    try { localStorage.setItem('bfs-anlage', m); } catch (_) {}
    $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    house.classList.add('swap');
    setTimeout(() => {
      FLOORS = MODES[m].floors; SHORT = MODES[m].short; BLD = MODES[m].bld;
      setImgs(); renderCards(); placeLabels(); render(st.progress); drawCoord();
      house.classList.remove('swap');
    }, 300);
  }
  $$('.seg button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));

  /* Anker aus Menü/Labels springen an die passende Stelle der Fahrt */
  function goto(id) {
    const k = id.slice(1);
    if (at[k] != null) { const y = st.start + at[k] * (st.end - st.start); lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' }); return true; }
    const el = $(id); if (el) { lenis ? lenis.scrollTo(el) : el.scrollIntoView({ behavior: 'smooth' }); return true; }
    return false;
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length > 1 && goto(id)) { e.preventDefault(); menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); } }));
  if (location.hash) setTimeout(() => goto(location.hash), 400);

  /* Team: Kinetik-Typo */
  ScrollTrigger.create({ trigger: '#team', start: 'top 70%', once: true, onEnter: () => gsap.to('#kin b', { y: 0, stagger: .3, duration: .7, ease: 'power3.out' }) });
  gsap.from('.wert', { y: 40, opacity: 0, stagger: .1, duration: .7, scrollTrigger: { trigger: '#werte', start: 'top 75%' } });
  gsap.from('.hero__media', { scale: .96, opacity: 0, duration: 1.1, ease: 'power3.out' });
  addEventListener('load', () => { placeLabels(); ScrollTrigger.refresh(); render(st.progress); });
  addEventListener('resize', () => render(st.progress));
})();
