/* FEUERRAUM – Neubau „Ein Ofen. Sieben Schichten.“ */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const Q = new URLSearchParams(location.search);
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VID = window.FR_VID || {};

  /* ---------- Personalisierung: ?firma= &ort= &typ=handel|bau ---------- */
  const firma = (Q.get('firma') || '').trim().slice(0, 40);
  const ort = (Q.get('ort') || '').trim().slice(0, 40);
  const typ = Q.get('typ');
  if (firma) { $$('[data-firma]').forEach(e => e.textContent = firma); document.title = document.title.replace('FEUERRAUM', firma); }
  if (ort) { $$('[data-ort]').forEach(e => e.textContent = 'Ausstellung in ' + ort); const z = $('[data-ort-zeile]'); if (z) z.textContent += ' · ' + ort; }
  if (typ === 'handel') {
    $('[data-typ-lead]').textContent = 'Mehr als Wärme. Ein durchdachtes Ganzes – brennend vorgeführt in unserer Ausstellung, eingebaut von unseren Monteuren.';
    $('[data-ort-zeile]').firstChild.textContent = 'Kaminöfen · Pelletöfen · Gaskamine' + (ort ? ' · ' + ort : '');
    $('[data-weg="handel"]').classList.add('vorn');
  } else if (typ === 'bau') {
    $('[data-typ-lead]').textContent = 'Mehr als Wärme. Ein durchdachtes Ganzes – geplant für Ihren Raum und Schicht für Schicht gebaut von unseren Ofenbauern.';
    $('[data-ort-zeile]').firstChild.textContent = 'Kachelöfen · Grundöfen · Heizkamine' + (ort ? ' · ' + ort : '');
    $('[data-weg="bau"]').classList.add('vorn');
  }
  // Links in Unterseiten behalten die Personalisierung
  if (location.search) $$('a[href^="schicht.html"]').forEach(a => { const u = new URL(a.href); Q.forEach((v, k) => { if (k !== 's') u.searchParams.set(k, v); }); a.href = u.pathname.split('/').pop() + u.search; });
  // Vor dem Wechsel in eine Unterseite Position merken
  $$('a[href^="schicht.html"]').forEach(a => a.addEventListener('click', () => { try { sessionStorage.setItem('fr-pos', String(scrollY)); } catch (e) {} }));

  /* ---------- Fehlende Bilder ausblenden (nie Platzhalter) ---------- */
  $$('img').forEach(im => im.addEventListener('error', () => { const box = im.closest('.weg,.schritt.foto,.brenn-bild'); (box && box.classList.contains('brenn-bild') ? box : im).style.display = 'none'; }));

  /* Ablauf: fehlt ein Schritt-Foto, alle Schritt-Fotos ausblenden (einheitlich) */
  (() => { const ims = $$('#ablauf .schritt.foto img'); const bad = () => $('#ablauf').classList.add('ohne-fotos');
    ims.forEach(im => { if (im.complete && im.naturalWidth === 0) bad(); im.addEventListener('error', bad); }); })();

  /* ---------- Menü ---------- */
  const burger = $('#burger'), menue = $('#menue');
  const zu = () => { burger.setAttribute('aria-expanded', 'false'); menue.hidden = true; document.body.style.overflow = ''; };
  burger.addEventListener('click', () => { const auf = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', String(auf)); menue.hidden = !auf; document.body.style.overflow = auf ? 'hidden' : ''; });
  $$('#menue a').forEach(a => a.addEventListener('click', zu));
  addEventListener('keydown', e => { if (e.key === 'Escape') zu(); });

  /* ---------- Smooth Scroll ---------- */
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  }
  const gehe = (ziel) => { if (lenis) lenis.scrollTo(ziel, { offset: 0, duration: 1.4 }); else (typeof ziel === 'number' ? scrollTo(0, ziel) : ziel.scrollIntoView()); };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const t = $(id); if (!t) return; e.preventDefault();
    if (id === '#schichten') { const st = buehneST; gehe(st ? st.start + (st.end - st.start) * 0.5 : t); return; }
    gehe(t);
  }));
  // Rückkehr aus Unterseite: an dieselbe Stelle
  try { const p = sessionStorage.getItem('fr-pos'); if (p && document.referrer.includes('schicht.html')) { sessionStorage.removeItem('fr-pos'); history.scrollRestoration = 'manual'; addEventListener('load', () => setTimeout(() => { scrollTo(0, +p); ScrollTrigger.refresh(); }, 60)); } } catch (e) {}

  /* ---------- Kopfzeile + Faden ---------- */
  const kopf = $('#kopf'), fill = $('#fadenFill');
  const dunkle = $$('.stapel, .handwerk .bewerbung, .ausstellung, .fuss');
  function kopfUpdate() {
    kopf.classList.toggle('fest', scrollY > 40);
    const y = kopf.offsetHeight / 2; let d = false;
    for (const el of dunkle) { const r = el.getBoundingClientRect(); if (r.top <= y && r.bottom >= y) { d = true; break; } }
    kopf.classList.toggle('dunkel', d);
    const h = document.documentElement.scrollHeight - innerHeight; fill.style.transform = `scaleY(${h > 0 ? scrollY / h : 0})`;
  }
  addEventListener('scroll', kopfUpdate, { passive: true }); kopfUpdate();
  // aktiver Menüpunkt
  const navs = $$('.nav a');
  navs.forEach(a => { const s = $(a.getAttribute('href')); if (!s) return; ScrollTrigger.create({ trigger: a.getAttribute('href') === '#schichten' ? '#start' : s, start: 'top 50%', end: 'bottom 50%', onToggle: st => a.classList.toggle('an', st.isActive) }); });

  /* ---------- 1+2: Bühne – Ofen zerlegt sich ---------- */
  const pin = $('.buehne-pin'), ganz = $('.b-ganz'), explo = $('.b-explo'), film = $('.b-film');
  const heldText = $('.held-text'), liste = $('.held-liste'), labs = $$('.lab'), svg = $('.explo-linien');
  const hinweis = $('.explo-hinweis'), zeichen = $('.scroll-zeichen');
  let filmOk = false;
  if (VID.explode && innerWidth >= 900) {
    film.src = VID.explode; film.hidden = false;
    film.addEventListener('loadeddata', () => { filmOk = true; film.style.opacity = 1; buehne(buehneST ? buehneST.progress : 0); }, { once: true });
  }
  // Haarlinien
  const NS = 'http://www.w3.org/2000/svg';
  const punkte = labs.map((l, i) => { const p = document.createElement('a'); p.className = 'punkt'; p.href = l.getAttribute('href'); p.textContent = i + 1; p.setAttribute('aria-label', l.querySelector('b').textContent); $('.explo-labels').append(p); return p; });
  const linien = labs.map(l => { const ln = document.createElementNS(NS, 'line'); const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '0.35'); svg.append(ln, c); return { l, ln, c }; });
  const EX = { s: 1, ty: 0 };
  function labLayout() {
    const W = innerWidth, H = innerHeight, mob = W < 900;
    // Bild deckt den Schirm (object-fit cover): Bildkoordinaten -> Bildschirm
    let dw, dh; if (mob) { dw = W * 2.2; dh = dw * 9 / 16; } else { const s = Math.max(W / 16, H / 9); dw = 16 * s; dh = 9 * s; }
    const ox = (W - dw) / 2, oy = (H - dh) / 2;
    EX.s = mob ? 1 : 0.86; EX.ty = mob ? 0 : H * 0.045;
    linien.forEach(({ l, ln, c }, i) => {
      if (mob) { const qx = ox + (+l.dataset.x / 100) * dw, qy = oy + (+l.dataset.y / 100) * dh; punkte[i].style.left = (qx - 22) + 'px'; punkte[i].style.top = (qy - 22) + 'px'; ['top', 'left', 'right', 'maxWidth', 'textAlign'].forEach(k => l.style[k] = ''); return; }
      const px = W / 2 + (ox + (+l.dataset.x / 100) * dw - W / 2) * EX.s, py = H / 2 + (oy + (+l.dataset.y / 100) * dh - H / 2) * EX.s + EX.ty;
      const links = l.dataset.side === 'l';
      const gap = mob ? 10 : Math.min(160, W * 0.1);
      let lx = links ? px - gap : px + gap;
      const bw = mob ? Math.min(150, W * 0.38) : 230;
      l.style.top = (py - 22) + 'px';
      if (links) { l.style.right = (W - lx + 8) + 'px'; l.style.left = 'auto'; l.style.textAlign = 'right'; if (W - (W - lx + 8) - bw < 6) { l.style.right = 'auto'; l.style.left = '6px'; lx = Math.max(lx, bw + 14); } }
      else { l.style.left = (lx + 8) + 'px'; l.style.right = 'auto'; l.style.textAlign = 'left'; if (lx + 8 + bw > W - 6) { l.style.left = 'auto'; l.style.right = '6px'; } }
      l.style.maxWidth = bw + 'px';
      ln.setAttribute('x1', (px / W) * 100); ln.setAttribute('y1', (py / H) * 100); ln.setAttribute('x2', (lx / W) * 100); ln.setAttribute('y2', (py / H) * 100);
      c.setAttribute('cx', (px / W) * 100); c.setAttribute('cy', (py / H) * 100);
      const len = Math.hypot(lx - px, 0); ln.dataset.len = len;
    });
  }
  labLayout(); addEventListener('resize', labLayout);
  let buehneST = null;
  function buehne(p) {
    // 0–0.12 Held · 0.12–0.42 zerlegen · 0.42–0.92 Schichten · 0.92–1 Übergang zu Stil
    const e = gsap.utils.clamp(0, 1, (p - 0.1) / 0.32);
    const ee = gsap.parseEase('power2.inOut')(e);
    if (filmOk && film.duration && innerWidth >= 900) {
      const t = ee * (film.duration - 0.05); if (Math.abs(film.currentTime - t) > 0.03) film.currentTime = t;
      const tf = `translate(0, ${EX.ty * ee}px) scale(${1 + ee * (EX.s - 1)})`, x = gsap.utils.clamp(0, 1, (ee - 0.86) / 0.14);
      film.style.transform = tf; explo.style.transform = tf; film.style.setProperty("--m", Math.min(1, ee * 1.6).toFixed(3)); ganz.style.opacity = 0; film.style.opacity = 1 - x; explo.style.opacity = x;
    }
    else {
      // Kamerafahrt: der Ofen wandert von rechts (71 %) in die Mitte, während er sich zerlegt
      const mob = innerWidth < 900, sh = mob ? 0 : 21;
      explo.style.opacity = ee; ganz.style.opacity = 1 - gsap.utils.clamp(0, 1, (e - 0.55) / 0.45);
      ganz.style.transform = `translateX(${-sh * ee}%) scale(${1 + ee * 0.06})`;
      explo.style.transform = mob ? '' : `translate(${sh * (1 - ee)}%, ${EX.ty * ee}px) scale(${1.06 - ee * (1.06 - EX.s)})`;
    }
    const tx = gsap.utils.clamp(0, 1, (p - 0.04) / 0.12);
    heldText.style.opacity = 1 - tx; heldText.style.transform = `translateY(calc(-46% - ${tx * 40}px))`;
    if (innerWidth < 900) heldText.style.transform = `translateY(${-tx * 40}px)`;
    liste.style.opacity = 1 - tx; zeichen.style.opacity = 1 - tx * 3;
    pin.classList.toggle('explo', e > 0.5);
    const lp = (p - 0.4) / 0.42; const n = Math.floor(gsap.utils.clamp(0, labs.length, lp * labs.length + 0.3));
    const mobil = innerWidth < 900;
    linien.forEach(({ l, ln, c }, i) => { const an = i < n; l.classList.toggle('zeig', mobil ? i === n - 1 : an); punkte[i].classList.toggle('zeig', an); punkte[i].classList.toggle('aktiv', i === n - 1); const L = +ln.dataset.len || 0; ln.style.strokeDasharray = 300; ln.style.strokeDashoffset = an ? 0 : 300; ln.style.transition = 'stroke-dashoffset .7s'; c.style.opacity = an ? 1 : 0; });
    hinweis.style.opacity = n >= labs.length ? Math.max(0, 1 - (p - 0.86) * 12) : 0;
  }
  buehneST = ScrollTrigger.create({ trigger: '.buehne', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: st => buehne(st.progress) });
  buehne(0);
  // Startbewegung: Held baut sich auf
  if (!RM) gsap.from('.h1 span, .held-text .lead, .held-wege, .held-liste li', { y: 30, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.15 });
  if (!RM) gsap.fromTo(ganz, { scale: 1.08 }, { scale: 1, duration: 2.4, ease: 'power2.out' });

  /* ---------- 3: Stil ---------- */
  const STIL = [
    { werte: [['Material', 'Naturstein, ca. 3 cm stark'], ['Wärme', 'speichert spürbar nach'], ['Oberfläche', 'matt, jeder Stein ein Unikat'], ['Pflege', 'feucht abwischen, Kratzer lassen sich anschleifen']] },
    { werte: [['Material', 'glasierte Ofenkeramik'], ['Wärme', 'gleichmäßige, milde Strahlung'], ['Oberfläche', 'glatt, cremeweiß'], ['Pflege', 'sehr leicht zu reinigen']] },
    { werte: [['Material', 'pulverbeschichteter Stahl'], ['Wärme', 'schnell warm, schnell im Raum'], ['Oberfläche', 'mattschwarz, klare Kante'], ['Pflege', 'trocken abstauben']] }];
  const stilMaske = $$('.stil-maske i'), stilBtns = $$('.stil-wahl button'), stilWerte = $('#stilWerte');
  function stilSetzen(m) {
    stilBtns.forEach((b, i) => b.setAttribute('aria-checked', String(i === m)));
    stilMaske.forEach((x, i) => x.classList.toggle('an', i === m));
    stilWerte.innerHTML = STIL[m].werte.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('');
    if (!RM) gsap.from('#stilWerte dd', { opacity: 0, x: 10, stagger: 0.05, duration: 0.5 });
  }
  stilBtns.forEach((b, i) => b.addEventListener('click', () => stilSetzen(i)));
  stilBtns.forEach((b, i) => b.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); stilBtns[(i + 1) % 3].focus(); stilSetzen((i + 1) % 3); } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); stilBtns[(i + 2) % 3].focus(); stilSetzen((i + 2) % 3); } }));
  stilSetzen(0);
  // Masken auf die drei Öfen legen (Bild 16:9, object-fit cover)
  const BANDS = [[44, 59.5], [61.5, 76], [78.5, 92.5]];
  function stilLayout() {
    const box = $('.stil-bild'), W = box.clientWidth, H = box.clientHeight, s = Math.max(W / 16, H / 9), dw = 16 * s;
    const px = innerWidth < 900 ? 0.72 : 0.6, ox = (W - dw) * px;
    stilMaske.forEach((m, i) => { const a = ox + BANDS[i][0] / 100 * dw, b = ox + BANDS[i][1] / 100 * dw; m.style.left = a + 'px'; m.style.width = (b - a) + 'px'; });
  }
  stilLayout(); addEventListener('resize', stilLayout);
  $$('.stil-bild').forEach(b => b.addEventListener('click', e => { const r = b.getBoundingClientRect(); const x = e.clientX - r.left; stilMaske.forEach((m, i) => { const l = parseFloat(m.style.left), w = parseFloat(m.style.width); if (x >= l && x <= l + w) stilSetzen(i); }); }));
  // Übergang: Bild wächst aus der Bühne
  if (!RM) gsap.fromTo('.stil-bild img', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.stil', start: 'top bottom', end: 'top top', scrub: true } });

  /* ---------- Zähler, Balken, Kurve, Einblenden ---------- */
  $$('[data-zaehl]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.zaehl, duration: 1.6, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) }); } }));
  ScrollTrigger.create({ trigger: '.bimsch', start: 'top 85%', once: true, onEnter: () => $('.bimsch').classList.add('an') });
  $$('.k-stahl, .k-stein').forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = p.classList.contains('k-stahl') ? '4 5' : L; if (!p.classList.contains('k-stahl')) p.style.strokeDashoffset = L; });
  ScrollTrigger.create({ trigger: '.kurve', start: 'top 80%', once: true, onEnter: () => {
    const st = $('.k-stein'); gsap.to(st, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' });
    gsap.from('.k-stein-f', { opacity: 0, duration: 1.6, delay: 0.8 }); gsap.from('.k-stahl', { opacity: 0, duration: 1 });
  } });
  if (!RM) {
    $$('.h2, .stil-text>p, .feuer-text>p, .speicher-text p, .symbole li, .regeln li, .weg, .schritt, .kinetik p, .as-text>*').forEach(el => { if (!el.closest('#ablauf')) el.classList.add('rein'); });
    ScrollTrigger.batch('.rein', { start: 'top 88%', once: true, onEnter: els => els.forEach((e, i) => setTimeout(() => e.classList.add('da'), i * 80)) });
    gsap.fromTo('.feuer-bild img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.feuer', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.fromTo('.speicher-bild img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.speicher', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.as-bild img', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.ausstellung', start: 'top bottom', end: 'top top', scrub: true } });
  }

  /* ---------- 6: Passt er rein? ---------- */
  const platz = $('#platz');
  ScrollTrigger.create({ trigger: platz, start: 'top 60%', once: true, onEnter: () => platz.classList.add('an') });
  const up = $('#platzUpload'), foto = $('#platzFoto'), probe = $('#probe'), reset = $('#platzReset'), tipp = $('#platzTipp');
  const fotoOrig = { src: foto.getAttribute('src'), srcset: foto.getAttribute('srcset') };
  let objUrl = null;
  up.addEventListener('change', () => {
    const f = up.files && up.files[0]; if (!f) return;
    if (objUrl) URL.revokeObjectURL(objUrl); objUrl = URL.createObjectURL(f);
    foto.removeAttribute('srcset'); foto.src = objUrl; platz.classList.add('eigen'); probe.hidden = false; reset.hidden = false; tipp.hidden = false;
    probe.style.left = '58%'; probe.style.top = '24%'; probe.style.width = innerWidth < 900 ? '26%' : '14%';
  });
  reset.addEventListener('click', () => { foto.src = fotoOrig.src; foto.setAttribute('srcset', fotoOrig.srcset); platz.classList.remove('eigen'); probe.hidden = true; reset.hidden = true; tipp.hidden = true; up.value = ''; });
  (() => { // Ziehen + Größe
    let mode = null, sx, sy, sl, st, sw; const box = $('.platz-bild');
    probe.addEventListener('pointerdown', e => { e.preventDefault(); probe.setPointerCapture(e.pointerId); mode = e.target.classList.contains('probe-griff') ? 'size' : 'move'; sx = e.clientX; sy = e.clientY; sl = probe.offsetLeft; st = probe.offsetTop; sw = probe.offsetWidth; });
    probe.addEventListener('pointermove', e => { if (!mode) return; const B = box.getBoundingClientRect(); if (mode === 'move') { probe.style.left = Math.max(-sw / 2, Math.min(B.width - sw / 2, sl + e.clientX - sx)) + 'px'; probe.style.top = Math.max(-40, Math.min(B.height - 60, st + e.clientY - sy)) + 'px'; } else { probe.style.width = Math.max(40, Math.min(B.width * 0.7, sw + e.clientX - sx)) + 'px'; } });
    const end = () => mode = null; probe.addEventListener('pointerup', end); probe.addEventListener('pointercancel', end);
  })();

  /* ---------- 7: Ofenberater ---------- */
  const qm = $('#rqm'), oM2 = $('#rM2'), oKw = $('#rKw'), oSatz = $('#rSatz'), vgl = $('#rVgl'), tippR = $('#rTipp');
  const B = {
    holz: { name: 'Holz', faktoren: [['Atmosphäre', 1, 'sichtbare Flamme'], ['Komfort', .45, 'nachlegen alle 45–60 min'], ['Lagerplatz', .3, 'trockenes Holzlager nötig'], ['Unabhängigkeit', 1, 'kein Strom nötig']], tipp: (kw) => `Kaminöfen gibt es meist ab rund 4 kW. Bei ${kw} kW Bedarf lohnt ein Speicherofen oder ein kleines Modell mit Drosselbereich. Holz mit unter 20 % Restfeuchte verwenden.` },
    pellet: { name: 'Pellet', faktoren: [['Atmosphäre', .65, 'gleichmäßige Flamme'], ['Komfort', 1, 'Thermostat, Zeitprogramm'], ['Lagerplatz', .6, 'Sackware, 15 kg je Sack'], ['Unabhängigkeit', .4, 'braucht Strom']], tipp: (kw) => `Pelletöfen regeln stufenlos herunter, oft bis rund 2,5 kW. Gut für ${kw} kW und für alle, die nicht nachlegen möchten.` },
    gas: { name: 'Gas', faktoren: [['Atmosphäre', .75, 'Flammenbild auf Keramik'], ['Komfort', 1, 'per Fernbedienung'], ['Lagerplatz', 1, 'kein Lager'], ['Unabhängigkeit', .3, 'braucht Gasanschluss']], tipp: (kw) => `Gaskamine starten auf Knopfdruck und brauchen einen Gasanschluss sowie eine passende Abgasführung. Für ${kw} kW gut regelbar.` } };
  let brenn = 'holz';
  const fmt = n => n.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  let kwAlt = 0;
  function rechne() {
    const m = +qm.value, w = +$('input[name=haus]:checked').value; const hausName = { 50: 'Neubau', 80: 'sanierten Altbau', 120: 'unsanierten Altbau' }[w];
    const kw = Math.max(1, Math.round(m * w / 100) / 10);
    oM2.textContent = m + ' m²'; oSatz.textContent = `Für ${m} m² im ${hausName}. Faustwert ${w} W pro m².`;
    const o = { v: kwAlt }; gsap.to(o, { v: kw, duration: 0.5, ease: 'power2.out', onUpdate: () => oKw.textContent = fmt(o.v) }); kwAlt = kw;
    vgl.innerHTML = B[brenn].faktoren.map(([a, v, t]) => `<div><span>${a}</span><i style="--v:0"></i><em>${t}</em></div>`).join('');
    requestAnimationFrame(() => $$('#rVgl i').forEach((el, i) => el.style.setProperty('--v', B[brenn].faktoren[i][1])));
    tippR.textContent = B[brenn].tipp(fmt(kw));
    $('.brenn-bild img').style.transform = `translateX(${-['holz', 'pellet', 'gas'].indexOf(brenn) * 33.333}%)`;
  }
  qm.addEventListener('input', rechne); $$('input[name=haus]').forEach(r => r.addEventListener('change', rechne));
  $$('.brenn button').forEach(b => b.addEventListener('click', () => { brenn = b.dataset.b; $$('.brenn button').forEach(x => x.setAttribute('aria-selected', String(x === b))); rechne(); }));
  rechne();

  /* ---------- Ablauf: horizontale Fahrt ---------- */
  const spur = $('#ablaufSpur');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    if (RM) return;
    const dist = () => Math.max(0, spur.scrollWidth - innerWidth + 40);
    gsap.to(spur, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#ablauf', start: 'top top', end: () => '+=' + dist(), scrub: 0.6, pin: true, invalidateOnRefresh: true } });
  });
  mm.add('(max-width: 900px)', () => { $('#ablauf').style.overflowX = 'auto'; });

  /* ---------- 8a: Platten stapeln sich (Schicht für Schicht) ---------- */
  (() => {
    const pl = $$('.platte'), nr = $('#stapelNr'), glut = $('.glut'), pin = $('.stapel-pin');
    if (!pl.length) return;
    if (RM) { pl.forEach(p => p.style.opacity = 1); nr.textContent = 4; return; }
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#stapel', start: 'top top', end: 'bottom bottom', scrub: 0.8,
      onUpdate: () => { nr.textContent = Math.max(0, Math.min(4, Math.floor(tl.time() / 1.05 + 0.45))); } } });
    pl.forEach((p, i) => {
      const seite = i % 2 ? 1 : -1;
      tl.fromTo(p, { opacity: 0, x: () => seite * innerWidth * 0.6, y: -160, rotation: seite * 6 },
        { opacity: 1, x: 0, y: 0, rotation: 0, duration: 1, ease: 'power3.out' }, i * 1.05)
        .to(pl.slice(0, i), { y: 3, duration: 0.15, ease: 'power1.inOut', yoyo: true, repeat: 1 }, i * 1.05 + 0.85);
    });
    tl.to(pl[3], { '--g': 1, duration: 0.8 }, 4.3).to(pin, { '--glow': 0.22, duration: 0.8 }, 4.3);
  })();

  /* ---------- 4: Feuer-Film (Schleife, nur sichtbar abspielen) ---------- */
  if (VID.feuer) { const v = $('.feuer-film'); v.src = VID.feuer; v.hidden = false; ScrollTrigger.create({ trigger: '.feuer', start: 'top 85%', end: 'bottom 15%', onToggle: s => s.isActive ? v.play().catch(() => {}) : v.pause() }); }

  /* ---------- 8: Karriere-Film + Bewerbung ---------- */
  if (VID.werkstatt) { const v = $('.hw-film'); v.src = VID.werkstatt; v.hidden = false; v.preload = 'auto'; const go = () => { v.currentTime = 0; v.play().catch(() => {}); }; ScrollTrigger.create({ trigger: '.hw-bild', start: 'top 60%', end: 'bottom 20%', onEnter: go, onEnterBack: go, onLeave: () => v.pause(), onLeaveBack: () => v.pause() }); }
  const bw = $('#bewerbung'), bwS = $$('.bw-schritt', bw), bwZ = $('[data-bw=zurueck]', bw), bwW = $('[data-bw=weiter]', bw); let bi = 0;
  function bwZeig() { bwS.forEach((s, i) => s.classList.toggle('aktiv', i === bi)); bwZ.hidden = bi === 0; bwW.textContent = bi === bwS.length - 1 ? 'Absenden' : 'Weiter'; }
  bwW.addEventListener('click', () => { if (bi < bwS.length - 1) { bi++; bwZeig(); } else { bwS.forEach(s => s.classList.remove('aktiv')); $('.bw-fertig', bw).hidden = false; $('.bw-leiste', bw).hidden = true; } });
  bwZ.addEventListener('click', () => { if (bi > 0) { bi--; bwZeig(); } });

  /* ---------- 9: Stimmen, Tage, Termin ---------- */
  const st = $$('.stimme'); let si = 0;
  if (st.length > 1) setInterval(() => { st[si].classList.remove('aktiv'); si = (si + 1) % st.length; st[si].classList.add('aktiv'); }, 5200);
  const tage = $('#tage'), WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']; const d = new Date(); let k = 0;
  while (tage.children.length < 8 && k < 20) { d.setDate(d.getDate() + 1); k++; const w = d.getDay(); if (w === 0 || w === 1) continue; const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false'); b.innerHTML = `${WT[w]}<b>${d.getDate()}.</b>${d.toLocaleDateString('de-DE', { month: 'short' })}`; b.addEventListener('click', () => { $$('button', tage).forEach(x => x.setAttribute('aria-checked', 'false')); b.setAttribute('aria-checked', 'true'); }); tage.append(b); }
  $('#termin').addEventListener('submit', e => { e.preventDefault(); $('.termin-ok').hidden = false; });

  addEventListener('load', () => { labLayout(); ScrollTrigger.refresh(); });
})();
