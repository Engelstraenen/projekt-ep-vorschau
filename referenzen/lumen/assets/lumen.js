/* LUMEN Zahnmedizin – Demo von Projekt EX. Eigenes Script; GSAP/ScrollTrigger lokal. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const DAYN = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const HOURS = { 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 15] };
  const SLOTS = ['08:00', '09:30', '11:00', '14:30', '16:00', '17:30'];
  const REASONS = { kontrolle: 'Kontrolle und Beratung', reinigung: 'Zahnreinigung', aesthetik: 'Ästhetik-Beratung', beratung: 'Zahnersatz, Implantate', schmerz: 'Schmerzen, akut' };
  const pad2 = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const label = (d) => `${DAYN[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.`;

  /* Belegte Zeiten: deterministisch je Datum, damit es wie ein echter Kalender wirkt */
  function busy(isoDate) {
    let h = 0; for (const c of isoDate) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const set = new Set([h % 6, (h >> 3) % 6]);
    const d = new Date(isoDate + 'T12:00:00');
    if (d.getDay() === 5) { set.add(4); set.add(5); } // Freitag bis 15 Uhr
    return set;
  }
  function nextWorkdays(n) {
    const out = []; const d = new Date(); d.setHours(12, 0, 0, 0);
    while (out.length < n) { d.setDate(d.getDate() + 1); if (d.getDay() > 0 && d.getDay() < 6) out.push(new Date(d)); }
    return out;
  }


  /* ===== Liquid Glass (Apple iOS 26 / macOS Tahoe) =====
     Chromium: echte Lichtbrechung – je Glasfläche ein SVG-Filter mit Verschiebungskarte
     (abgerundetes Rechteck, konvexe Lünette bricht den Hintergrund an der Kante, leichte
     chromatische Aufspaltung), eingesetzt als backdrop-filter: url(#…).
     Safari/Firefox: dieselbe Brechung auf ein deckungsgleiches Spiegelbild des Fotos darunter
     (filter: url(#…) auf HTML geht dort), sonst bleibt die geschichtete CSS-Schattierung. */
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.documentElement;
  root.classList.add('lg-js');
  const reduceM = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lgBackdrop = false;
  try {
    const brands = (navigator.userAgentData && navigator.userAgentData.brands) || [];
    lgBackdrop = brands.some((b) => /Chromium|Google Chrome|Microsoft Edge|Opera|Brave/.test(b.brand));
  } catch (e) { /* ohne Backdrop-Brechung */ }
  if (/[?&]lg=mirror/.test(location.search)) lgBackdrop = false; // Test: Safari-Weg in Chromium ansehen
  if (lgBackdrop) root.classList.add('lg-ok');
  let lgDefs = null, lgN = 0;
  const lgMaps = new Map();
  function defs() {
    if (lgDefs) return lgDefs;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    lgDefs = document.createElementNS(NS, 'defs'); svg.appendChild(lgDefs); document.body.appendChild(svg);
    return lgDefs;
  }
  /* Verschiebungskarte: R/G = Versatz x/y (128 = keiner). Nur in der Lünette am Rand, Mitte ruhig. */
  function lensMap(w, h, r, bezel, pad = 0) {
    const key = [w, h, r, bezel, pad].join('x'); if (lgMaps.has(key)) return lgMaps.get(key);
    const s = Math.min(1, 360 / Math.max(w, h)); // Karte verkleinert rechnen, wird gestreckt
    const cw = Math.max(2, Math.round((w + 2 * pad) * s)), ch = Math.max(2, Math.round((h + 2 * pad) * s));
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d'); const img = g.createImageData(cw, ch);
    const hw = w / 2, hh = h / 2;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const px = (x + 0.5) / s - pad - hw, py = (y + 0.5) / s - pad - hh;
      const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      const inside = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r);
      let dx = 0, dy = 0;
      if (inside >= 0 && inside < bezel) {
        let nx, ny;
        if (qx > 0 && qy > 0) { const l = Math.hypot(ox, oy) || 1; nx = (ox / l) * Math.sign(px); ny = (oy / l) * Math.sign(py); }
        else if (qx > qy) { nx = Math.sign(px); ny = 0; } else { nx = 0; ny = Math.sign(py); }
        const t = 1 - inside / bezel;             // 1 an der Kante, 0 innen
        const k = Math.pow(t, 2.4) * (1 - 0.15 * t); // konvexes Squircle-Profil
        dx = -nx * k; dy = -ny * k;
      }
      const i = (y * cw + x) * 4;
      img.data[i] = Math.round(128 + dx * 127); img.data[i + 1] = Math.round(128 + dy * 127); img.data[i + 2] = 128; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const url = c.toDataURL(); lgMaps.set(key, url); return url;
  }
  /* Filter anlegen: Weichzeichner → Brechung (R/G/B leicht verschieden = Farbsaum) → Sättigung */
  function lensFilter(o) {
    const f = document.createElementNS(NS, 'filter');
    const id = `lg-${++lgN}`; f.setAttribute('id', id);
    f.setAttribute('color-interpolation-filters', 'sRGB');
    // Filterbereich = Element (objectBoundingBox); userSpaceOnUse rendert Safari auf HTML nicht
    f.setAttribute('x', '0'); f.setAttribute('y', '0'); f.setAttribute('width', '1'); f.setAttribute('height', '1');
    defs().appendChild(f);
    let last = '', ver = 0;
    const api = { id, build: null, changed: false };
    const build = (w, h, pad = 0) => {
      const key = [w, h, pad].join(); if (!w || !h || key === last) return false; last = key;
      // Safari übernimmt geänderte Filter nicht: bei jeder neuen Größe neue ID vergeben
      api.id = `${id}-${++ver}`; f.setAttribute('id', api.id);
      const r = Math.min(o.radius(w, h), w / 2, h / 2); const bezel = Math.min(o.bezel, h / 2, w / 2);
      const sc = o.scale;
      const d = (k, res) => `<feDisplacementMap in="bl" in2="map" scale="${(sc * k).toFixed(1)}" xChannelSelector="R" yChannelSelector="G" result="${res}"/>`;
      f.innerHTML = `<feImage href="${lensMap(w, h, r, bezel, pad)}" preserveAspectRatio="none" result="map"/>`
        + `<feGaussianBlur in="SourceGraphic" stdDeviation="${o.blur}" result="bl"/>`
        + (o.chroma
          ? `${d(1.06, 'dR')}${d(1, 'dG')}${d(0.94, 'dB')}`
          + `<feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>`
          + `<feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>`
          + `<feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>`
          + `<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen" result="disp"/>`
          : d(1, 'disp'))
        + `<feColorMatrix in="disp" type="saturate" values="${o.sat}"/>`;
      return true;
    };
    api.build = build;
    return api;
  }
  const small = window.matchMedia('(max-width: 700px)').matches;
  /* Glasarten: Radius, Lünettenbreite, Brechungsstärke, Weichzeichner, Sättigung */
  const KINDS = [
    ['.site-head__in', { radius: (w, h) => h / 2, bezel: 18, scale: 80, blur: 3, sat: 1.7, chroma: true }],
    ['.dock', { radius: (w, h) => h / 2, bezel: 18, scale: 76, blur: 2.4, sat: 1.7, chroma: true }],
    ['.next', { radius: () => 28, bezel: 22, scale: 90, blur: 3.2, sat: 1.6, chroma: true }],
    ['.facts', { radius: () => 28, bezel: 22, scale: 90, blur: 3.2, sat: 1.6, chroma: true }],
    ['.chap__go', { radius: (w, h) => h / 2, bezel: 15, scale: 72, blur: 0.3, sat: 1.45, chroma: true }],
    ['.chap__tag,.room__tag', { radius: (w, h) => h / 2, bezel: 13, scale: 54, blur: 1.6, sat: 1.5, chroma: !small }],
    ['.summary', { radius: () => 28, bezel: 22, scale: 84, blur: 5, sat: 1.5, chroma: true }],
  ];
  // große Formularfläche nur auf dem Desktop brechen (Leistung auf Handys)
  if (!small) KINDS.push(['.book', { radius: () => 32, bezel: 34, scale: 90, blur: 12, sat: 1.5, chroma: false }]);
  const lgEls = [];
  KINDS.forEach(([sel, o]) => $$(sel).forEach((el) => lgEls.push([el, o])));

  if (lgBackdrop) {
    /* Chromium: Brechung direkt im backdrop-filter */
    lgEls.forEach(([el, o]) => {
      const lf = lensFilter(o);
      const upd = () => { if (lf.build(el.offsetWidth, el.offsetHeight)) el.style.backdropFilter = `url(#${lf.id}) brightness(1.08) contrast(1.04)`; };
      upd(); if ('ResizeObserver' in window) new ResizeObserver(upd).observe(el);
    });
  } else {
    /* Safari/Firefox: Glas über Fotos bricht ein deckungsgleiches Spiegelbild des Fotos */
    const PAD = 10;
    const mirrors = [];
    $$('[data-lg-photo]').forEach((el) => {
      const host = el.closest('.hero__frame, .chap__img, .room__img'); const src = host && host.querySelector('img');
      const o = (lgEls.find(([e]) => e === el) || [])[1]; if (!src || !o) return;
      const box = document.createElement('span'); box.className = 'lg-mirror'; box.setAttribute('aria-hidden', 'true');
      const clip = document.createElement('span'); clip.className = 'lg-mirror__clip'; box.appendChild(clip);
      const im = document.createElement('img'); im.alt = ''; im.decoding = 'async'; clip.appendChild(im);
      el.insertBefore(box, el.firstChild); el.classList.add('lg-mir');
      const lf = lensFilter(o);
      mirrors.push({ el, src, im, lf, vis: true });
    });
    const sync = (m) => {
      const s = m.src.getBoundingClientRect(), e = m.el.getBoundingClientRect();
      const w = m.el.offsetWidth, h = m.el.offsetHeight; if (!w || !h) return;
      const k = e.width / w || 1; // Glas selbst kann skaliert sein (Drücken)
      if (m.im.getAttribute('src') !== (m.src.currentSrc || m.src.src)) m.im.src = m.src.currentSrc || m.src.src;
      m.im.style.width = `${s.width / k}px`; m.im.style.height = `${s.height / k}px`;
      m.im.style.left = `${(s.left - e.left) / k + PAD}px`; m.im.style.top = `${(s.top - e.top) / k + PAD}px`;
      if (m.lf.build(w, h, PAD)) m.el.querySelector('.lg-mirror').style.filter = `url(#${m.lf.id})`;
    };
    let raf = 0;
    const tick = () => { raf = 0; mirrors.forEach((m) => { if (m.vis) sync(m); }); };
    const req = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((ents) => ents.forEach((en) => { const m = mirrors.find((x) => x.el === en.target); if (m) { m.vis = en.isIntersecting; if (m.vis) req(); } }), { rootMargin: '200px 0px' });
      mirrors.forEach((m) => io.observe(m.el));
    }
    mirrors.forEach((m) => { m.src.addEventListener('load', req); });
    window.addEventListener('scroll', req, { passive: true }); window.addEventListener('resize', req);
    window.addEventListener('load', req); req();
    // auch während Scroll-Animationen (GSAP) mitlaufen
    if (mirrors.length) { let t = 0; const loop = () => { if (document.visibilityState === 'visible') tick(); t = setTimeout(loop, 250); }; loop(); }
  }

  /* Licht: Glanzpunkt folgt dem Zeiger, Lichtrichtung dreht sich leicht beim Scrollen */
  const aim = (g, x, y) => {
    const r = g.getBoundingClientRect();
    g.style.setProperty('--mx', `${((x - r.left) / r.width) * 100}%`);
    g.style.setProperty('--my', `${((y - r.top) / r.height) * 100}%`);
    // Lichtkante dreht sich zum Zeiger (wie Licht auf gekipptem Glas)
    const a = Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2)) * 180 / Math.PI + 90;
    g.style.setProperty('--lg-a', `${a.toFixed(1)}deg`);
  };
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let pe = null, pr = 0;
    document.addEventListener('pointermove', (e) => {
      pe = e; if (pr) return;
      pr = requestAnimationFrame(() => { pr = 0; const g = pe.target.closest && pe.target.closest('.glass, .btn, .lg'); if (g) aim(g, pe.clientX, pe.clientY); });
    }, { passive: true });
    document.addEventListener('pointerout', (e) => {
      const g = e.target.closest && e.target.closest('.glass, .btn, .lg'); if (!g || g.contains(e.relatedTarget)) return;
      g.style.removeProperty('--lg-a'); g.style.removeProperty('--mx'); g.style.removeProperty('--my');
    }, { passive: true });
  }
  if (!reduceM.matches) {
    let lr = 0;
    window.addEventListener('scroll', () => { if (lr) return; lr = requestAnimationFrame(() => { lr = 0; const a = -38 + Math.sin(window.scrollY / 480) * 24; root.style.setProperty('--lg-a', `${a.toFixed(1)}deg`); }); }, { passive: true });
  }
  /* Drücken: Glas gibt nach (kurz breiter, flacher), Licht sitzt am Finger */
  document.addEventListener('pointerdown', (e) => {
    const b = e.target.closest && e.target.closest('.btn, .next, .chap__go, .menu-btn'); if (!b) return;
    aim(b, e.clientX, e.clientY);
  }, { passive: true });

  /* Gleitende Glas-Linse: unter gewählter Pill (Termin) und unter aktivem Menüpunkt */
  function glide(lens, from, to, firstRun) {
    if (!to) { lens.classList.remove('is-on'); return; }
    lens.classList.add('is-on');
    const x = to.offsetLeft, y = to.offsetTop, w = to.offsetWidth, h = to.offsetHeight;
    const prev = { x: lens._x, y: lens._y, w: lens._w, h: lens._h };
    Object.assign(lens.style, { width: `${w}px`, height: `${h}px`, transform: `translate(${x}px,${y}px)` });
    lens._x = x; lens._y = y; lens._w = w; lens._h = h;
    if (firstRun || reduceM.matches || prev.x === undefined || !lens.animate) return;
    const dx = x - prev.x, dy = y - prev.y; if (!dx && !dy && w === prev.w) return;
    // Flüssig: Linse zieht sich in Bewegungsrichtung lang und wird dabei flacher, dann federt sie ein
    const midW = Math.max(w, prev.w) + Math.min(Math.abs(dx) * 0.35, 60);
    lens.animate([
      { transform: `translate(${prev.x}px,${prev.y}px)`, width: `${prev.w}px`, height: `${prev.h}px` },
      { transform: `translate(${(prev.x + x) / 2 - (midW - (prev.w + w) / 2) / 2}px,${(prev.y + y) / 2 + h * 0.04}px)`, width: `${midW}px`, height: `${h * 0.92}px`, offset: 0.45 },
      { transform: `translate(${x}px,${y}px)`, width: `${w}px`, height: `${h}px` },
    ], { duration: 300, easing: 'cubic-bezier(.23,1,.32,1)' });
  }
  $$('.book .chips').forEach((group) => {
    const lens = document.createElement('span'); lens.className = 'lg-thumb lg'; lens.setAttribute('aria-hidden', 'true');
    group.insertBefore(lens, group.firstChild);
    const cur = () => { const c = group.querySelector('input:checked'); const sp = c && c.nextElementSibling; if (!sp) return null; const r = sp.getBoundingClientRect(), g = group.getBoundingClientRect();
      return { offsetLeft: r.left - g.left, offsetTop: r.top - g.top, offsetWidth: sp.offsetWidth, offsetHeight: sp.offsetHeight }; };
    let first = true;
    const upd = () => { glide(lens, null, cur(), first); first = false; };
    group.addEventListener('change', upd);
    group.closest('form').addEventListener('change', () => requestAnimationFrame(upd)); // Uhrzeit kann sich mit dem Tag ändern
    if ('ResizeObserver' in window) new ResizeObserver(() => { first = true; upd(); }).observe(group);
    window.addEventListener('load', () => { first = true; upd(); });
    upd();
  });
  const navUl = $('.nav ul');
  if (navUl && window.matchMedia('(min-width: 981px)').matches) {
    const lens = document.createElement('span'); lens.className = 'lg-lens lg'; lens.setAttribute('aria-hidden', 'true');
    navUl.parentNode.insertBefore(lens, navUl);
    let act = null, first = true;
    const place = (a) => { if (!a) { glide(lens, null, null); return; } const li = a; const ul = navUl; const r = li.getBoundingClientRect(), u = ul.getBoundingClientRect();
      const fake = { offsetLeft: r.left - u.left + ul.offsetLeft, offsetTop: (ul.offsetHeight - 40) / 2 + ul.offsetTop, offsetWidth: r.width, offsetHeight: 40 };
      glide(lens, null, fake, first); first = false; };
    navUl.addEventListener('pointerover', (e) => { const a = e.target.closest('a'); if (a) place(a); });
    navUl.addEventListener('pointerleave', () => place(act));
    new MutationObserver(() => { act = navUl.querySelector('a.is-active'); place(act); }).observe(navUl, { subtree: true, attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', () => { first = true; place(act); });
  }

  /* Kopfleiste über dunklen Flächen dunkel tönen (wie iOS-Glas sich anpasst) */
  const headEl = $('[data-head]'); const darks = $$('.costs, .foot');
  if (headEl && darks.length) {
    let hr = 0;
    const chk = () => { hr = 0; const b = headEl.querySelector('.site-head__in'); if (!b) return; const y = (parseFloat(getComputedStyle(headEl).paddingTop) || 0) + b.offsetHeight / 2; // Position der sichtbaren Leiste, auch während sie eingeblendet wird
      headEl.classList.toggle('on-dark', darks.some((d) => { const q = d.getBoundingClientRect(); return q.top <= y && q.bottom >= y; })); };
    window.addEventListener('scroll', () => { if (!hr) hr = requestAnimationFrame(chk); }, { passive: true }); chk();
  }

  /* Kopf: Zustand beim Scrollen, Menü, Öffnungsstatus */
  const head = $('[data-head]');
  if (head) {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      head.classList.toggle('is-scrolled', y > 8);
      const menuOpen = $('[data-menu-btn]')?.getAttribute('aria-expanded') === 'true';
      head.classList.toggle('is-hidden', !menuOpen && y > 640 && y > lastY + 2);
      if (y < lastY - 2) head.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    head.addEventListener('focusin', () => head.classList.remove('is-hidden'));
  }
  const menuBtn = $('[data-menu-btn]'); const menu = $('[data-menu]');
  if (menuBtn && menu) {
    const set = (open) => { menuBtn.setAttribute('aria-expanded', String(open)); menu.hidden = !open; };
    menuBtn.addEventListener('click', () => set(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); menuBtn.focus(); } });
    window.matchMedia('(min-width: 981px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }
  const openEl = $('[data-open]');
  if (openEl) {
    const now = new Date(); const wd = now.getDay(); const h = now.getHours() + now.getMinutes() / 60; const hrs = HOURS[wd];
    const isOpen = !!hrs && h >= hrs[0] && h < hrs[1];
    let txt;
    if (isOpen) txt = `Jetzt geöffnet, bis ${hrs[1]} Uhr`;
    else if (hrs && h < hrs[0]) txt = `Öffnet heute um ${hrs[0]} Uhr`;
    else { let d = (wd + 1) % 7; while (!HOURS[d]) d = (d + 1) % 7; txt = `Geschlossen, öffnet ${d === (wd + 1) % 7 ? 'morgen' : DAYN[d]} um 8 Uhr`; }
    $('[data-open-text]', openEl).textContent = txt; openEl.classList.toggle('is-open', isOpen); openEl.hidden = false;
  }
  const hours = $('[data-hours]');
  if (hours) { const wd = new Date().getDay(); const row = $(`tr[data-d="${wd === 0 || wd === 6 ? 6 : wd}"]`, hours); row?.classList.add('is-today'); }

  /* Termin */
  const form = $('[data-book]');
  if (form) {
    const days = nextWorkdays(6);
    const dayInputs = $$('input[name="tag"]', form);
    dayInputs.forEach((inp, i) => {
      const d = days[i]; if (!d) return;
      inp.value = iso(d); inp.dataset.label = label(d);
      const s = inp.nextElementSibling; s.querySelector('b').textContent = DAYN[d.getDay()]; s.lastChild.textContent = `${d.getDate()}.${d.getMonth() + 1}.`;
    });
    const slotInputs = $$('input[name="zeit"]', form);
    const hint = $('[data-slot-hint]', form);
    const steps = $$('[data-step]', form);
    const sumWhat = $('[data-sum-what]'); const sumWhen = $('[data-sum-when]');
    const prog = $$('[data-progress] li');
    const val = (n) => form.querySelector(`input[name="${n}"]:checked`);
    const flash = (el) => { if (!el || reduce.matches) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); };

    function applySlots(announce) {
      const day = val('tag'); if (!day) return;
      const b = busy(day.value); let moved = false;
      slotInputs.forEach((s, i) => {
        s.disabled = b.has(i);
        const sp = s.nextElementSibling; sp.setAttribute('aria-label', b.has(i) ? `${SLOTS[i]} Uhr, belegt` : `${SLOTS[i]} Uhr`);
        if (s.disabled && s.checked) { s.checked = false; moved = true; }
      });
      if (!val('zeit')) { const f = slotInputs.find((s) => !s.disabled); if (f) f.checked = true; }
      if (hint) hint.textContent = moved && announce ? `Die gewählte Uhrzeit ist an diesem Tag belegt. Wir haben ${val('zeit')?.dataset.label || ''} vorgemerkt.` : '';
    }
    function sync(changed) {
      const a = val('anliegen'), d = val('tag'), z = val('zeit');
      const what = a ? a.dataset.label : 'Bitte Anliegen wählen';
      const when = d && z ? `${d.dataset.label} · ${z.dataset.label}` : '';
      if (sumWhat && sumWhat.textContent !== what) { sumWhat.textContent = what; if (changed) flash(sumWhat); }
      if (sumWhen && sumWhen.textContent !== when) { sumWhen.textContent = when; if (changed) flash(sumWhen); }
      const name = form.elements.name.value.trim(), kontakt = form.elements.kontakt.value.trim(), ds = form.elements.datenschutz.checked;
      const done = [!!a, !!d, !!z, !!(name && kontakt && ds)];
      steps.forEach((s, i) => s.classList.toggle('is-done', done[i]));
      prog.forEach((p, i) => p.classList.toggle('is-on', done[i]));
    }
    form.addEventListener('change', (e) => { if (e.target.name === 'tag') applySlots(true); sync(true); if (e.target.getAttribute('aria-invalid') === 'true') validate(e.target); });
    form.addEventListener('input', (e) => { sync(false); if (e.target.getAttribute('aria-invalid') === 'true') validate(e.target); });

    const rules = {
      name: (el) => el.value.trim().length > 1,
      kontakt: (el) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) || el.value.replace(/[^\d]/g, '').length >= 6,
      datenschutz: (el) => el.checked,
    };
    const errs = { name: 'f-name-err', kontakt: 'f-kontakt-err', datenschutz: 'f-ds-err' };
    function validate(el) {
      const ok = rules[el.name] ? rules[el.name](el) : true;
      el.setAttribute('aria-invalid', String(!ok));
      const e = document.getElementById(errs[el.name]); if (e) { e.hidden = ok; if (!ok) el.setAttribute('aria-describedby', e.id); else el.removeAttribute('aria-describedby'); }
      return ok;
    }
    form.addEventListener('submit', (e) => {
      const bad = ['name', 'kontakt', 'datenschutz'].map((n) => form.elements[n]).filter((el) => !validate(el));
      if (bad.length) { e.preventDefault(); bad[0].focus(); }
    });

    /* Links aus den Behandlungen wählen das passende Anliegen vor */
    $$('a[data-pick]').forEach((a) => a.addEventListener('click', () => {
      const r = form.querySelector(`input[name="anliegen"][value="${a.dataset.pick}"]`); if (r) { r.checked = true; sync(true); }
    }));

    applySlots(false); sync(false);

    /* Hero: nächster freier Termin = erster Tag, erste freie Zeit */
    const nw = $('[data-next-when]');
    if (nw && days[0]) { const b = busy(iso(days[0])); const i = SLOTS.findIndex((_, k) => !b.has(k)); nw.textContent = `${label(days[0])} · ${SLOTS[i]}`; }
    $('[data-next]')?.addEventListener('click', () => { const r = dayInputs[0]; if (r) { r.checked = true; applySlots(false); const f = slotInputs.find((s) => !s.disabled); if (f) f.checked = true; sync(true); } });
  }

  /* Danke-Seite: Auswahl nur lokal anzeigen */
  const thanks = $('[data-thanks]');
  if (thanks) {
    const q = new URLSearchParams(location.search);
    const a = REASONS[q.get('anliegen')]; const t = q.get('tag'); const z = q.get('zeit');
    if (a) $('[data-t-what]').textContent = a;
    if (t && /^\d{4}-\d{2}-\d{2}$/.test(t) && z && /^\d{2}:\d{2}$/.test(z)) { const d = new Date(t + 'T12:00:00'); if (!isNaN(d)) $('[data-t-when]').textContent = `${label(d)} · ${z} Uhr`; }
    if (q.get('ruhe') === 'ja') $('[data-t-ruhe]').hidden = false;
  }

  /* Navigation: aktiver Abschnitt */
  const navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      const a = map.get(en.target.id); if (!a) return;
      if (en.isIntersecting) { navLinks.forEach((l) => l.classList.remove('is-active')); a.classList.add('is-active'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Dock (mobil) */
  const dock = $('[data-dock]'); const hero = $('[data-hero]'); const termin = document.getElementById('termin');
  if (dock && hero && 'IntersectionObserver' in window) {
    let pastHero = false, atBooking = false;
    const upd = () => dock.classList.toggle('is-on', pastHero && !atBooking);
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; upd(); }).observe($('.hero__cta') || hero);
    if (termin) new IntersectionObserver(([en]) => { atBooking = en.isIntersecting; upd(); }, { rootMargin: '0px 0px -30% 0px' }).observe(termin);
  }

  /* Behandlungs-Index ohne GSAP */
  const idxLinks = $$('[data-idx]');
  if (idxLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) idxLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.idx === en.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('[data-chap]').forEach((c) => io.observe(c));
  }

  /* Bewegung (GSAP) */
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (!gsap || !ST) return;
  gsap.registerPlugin(ST);

  // Wörter der Haltung vorbereiten (auch ohne Bewegung harmlos)
  const words = $('[data-words]');
  if (words) {
    const walk = (node) => Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); } });
        node.replaceChild(frag, n);
      }
    });
    walk(words);
  }
  const h1 = $('[data-split]');
  if (h1) {
    const text = h1.textContent.trim(); h1.setAttribute('aria-label', text); h1.textContent = '';
    text.split(' ').forEach((w, i, arr) => { const o = document.createElement('span'); o.className = 'ln'; o.setAttribute('aria-hidden', 'true'); const s = document.createElement('span'); s.textContent = w; o.appendChild(s); h1.appendChild(o); if (i < arr.length - 1) h1.appendChild(document.createTextNode(' ')); });
  }

  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 981px)' }, (ctx) => {
    const { motion, desktop } = ctx.conditions;
    if (!motion) return;
    document.documentElement.classList.add('is-motion');

    // 1) Hero: Wörter steigen aus der Grundlinie, Glas-Karte folgt
    if (h1 && $('.hero__side')) gsap.from($$('.ln > span', h1), { yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.05 });
    if ($('.hero__side')) gsap.from('.hero__side', { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out', delay: 0.35 });
    if ($('[data-next]')) gsap.from('[data-next]', { opacity: 0, y: 16, filter: 'blur(6px)', duration: 0.6, ease: 'power3.out', delay: 0.7, clearProps: 'filter' });

    // 2) Hero-Bild öffnet sich beim Scrollen auf volle Breite
    const frame = $('[data-frame]');
    if (frame) {
      frame.classList.add('is-clip');
      const padPx = () => parseFloat(getComputedStyle(document.querySelector('.wrap')).paddingLeft) || 24;
      gsap.fromTo(frame, { clipPath: () => `inset(0px ${padPx()}px 0px ${padPx()}px round 22px)` }, {
        clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top 75%', end: 'top 8%', scrub: 0.6, invalidateOnRefresh: true },
      });
      gsap.fromTo($('img', frame), { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // 3) Haltung: Wort für Wort ins Licht (Signature)
    if (words) {
      gsap.fromTo($$('.w', words), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: words, start: 'top 82%', end: 'bottom 52%', scrub: 0.4 } });
      gsap.from('.stance__img', { scale: 0.6, opacity: 0, ease: 'none', scrollTrigger: { trigger: words, start: 'top 75%', end: 'top 45%', scrub: 0.4 } });
    }

    // 4) Behandlungsbilder: öffnen sich einmal aus der Mitte
    $$('[data-clip]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(10% 8% 10% 8% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
      gsap.fromTo($('img', el), { scale: 1.14 }, { scale: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
    });

    // 5) Praxis: horizontaler Rundgang (nur Desktop)
    const pin = $('[data-pin]'); const track = $('[data-track]');
    if (desktop && pin && track) {
      document.documentElement.classList.add('js-pin');
      const dist = () => { const last = track.lastElementChild; return Math.max(0, last.offsetLeft + last.offsetWidth - window.innerWidth + (parseFloat(getComputedStyle(track).paddingLeft) || 0)); };
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1 } });
    }

    // 6) Fußzeile: Wortmarke hebt sich
    if ($('.foot__word') && $('[data-hero]')) gsap.from('.foot__word', { yPercent: 35, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    return () => { document.documentElement.classList.remove('is-motion', 'js-pin'); frame?.classList.remove('is-clip'); };
  });
  window.addEventListener('load', () => {
    ST.refresh();
    const id = decodeURIComponent(location.hash.slice(1));
    const t = id && document.getElementById(id);
    if (t) requestAnimationFrame(() => t.scrollIntoView({ behavior: 'instant', block: 'start' }));
  });
  document.fonts?.ready.then(() => ST.refresh());
})();
