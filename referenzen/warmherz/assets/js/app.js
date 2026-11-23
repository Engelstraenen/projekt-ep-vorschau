/* WARMHERZ Demo · Interaktion & Motion (Stil A) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const Q = new URLSearchParams(location.search);
  const SHOT = Q.has('shot');
  if (SHOT) document.documentElement.classList.add('shotmode');
  /* Schrift-Vorschau: ?font=inter|archivo|barlow */
  const FONTS = {
    inter: ['"Inter Tight"', '-.045em', 800, 'none', 1], archivo: ['"Archivo"', '-.025em', 800, 'none', 1], barlow: ['"Barlow Semi Condensed"', '-.005em', 800, 'none', 1.1],
    barlowc: ['"Barlow Condensed"', '0em', 800, 'uppercase', .98], anton: ['"Anton"', '.005em', 400, 'uppercase', 1.05], plex: ['"IBM Plex Sans"', '-.035em', 700, 'none', .95]
  };
  if (FONTS[Q.get('font')]) {
    const [f, ls, w, tt, sc] = FONTS[Q.get('font')], st = document.documentElement.style;
    st.setProperty('--head', f + ',Arial,sans-serif'); st.setProperty('--hls', ls); st.setProperty('--hw', w); st.setProperty('--htt', tt); st.setProperty('--hscale', sc);
  }
  const reduce = SHOT || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  const eur = n => Math.round(n).toLocaleString('de-DE');
  const pad = n => String(n).padStart(2, '0');

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });
  const burger = $('.burger'), links = $('.links');
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', links.classList.toggle('open')));
  $$('.links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  /* ---------- Countdown bis 1.2.2027 ---------- */
  const target = new Date('2027-02-01T00:00:00+01:00').getTime();
  function tick() {
    let d = Math.max(0, target - Date.now());
    const days = Math.floor(d / 864e5); d -= days * 864e5;
    const h = Math.floor(d / 36e5); d -= h * 36e5;
    const m = Math.floor(d / 6e4); d -= m * 6e4;
    const s = Math.floor(d / 1e3);
    $$('[data-days]').forEach(e => e.textContent = days);
    [['d', days], ['h', h], ['m', m], ['s', s]].forEach(([k, v]) => { const e = $(`[data-cd="${k}"]`); if (e) e.textContent = pad(v); });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- „3 Fotos schicken“ (fest unten): am Handy aus, solange die Hero-Buttons im Bild sind ----------
     Sonst liegt der feste Knopf auf „Zuschuss berechnen“ / „Jobs bei uns“. Ausblenden nur per CSS unter 641 px (pages.css). */
  const fab = $('.fab-foto'), heroCtas = $('.hero .ctas, .phero .ctas');
  if (fab && heroCtas && 'IntersectionObserver' in window) {
    const r0 = heroCtas.getBoundingClientRect();
    fab.classList.toggle('is-off', r0.bottom > 0 && r0.top < innerHeight);
    new IntersectionObserver(es => fab.classList.toggle('is-off', es[0].isIntersecting)).observe(heroCtas);
  }

  /* ---------- Punkte auf object-fit:cover-Bildern ---------- */
  function placeOn(box, img) {
    if (!box || !img) return;
    const iw = img.naturalWidth, ih = img.naturalHeight; if (!iw) return;
    const bw = box.clientWidth, bh = box.clientHeight, sc = Math.max(bw / iw, bh / ih), rw = iw * sc, rh = ih * sc;
    const op = getComputedStyle(img).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    $$('[data-fx]', box).forEach(el => {
      const x = (bw - rw) * op[0] + el.dataset.fx / 100 * rw, y = (bh - rh) * op[1] + el.dataset.fy / 100 * rh;
      el.style.left = x + 'px'; el.style.top = y + 'px';
      el.style.display = (x < 20 || x > bw - 20) ? 'none' : '';
    });
    return [(bw - rw) * op[0], (bh - rh) * op[1], rw, rh];
  }
  const heroMedia = $('.hero-media'), heroImg = $('.hero-img'), pMedia = $('.platz-media'), pImg = $('.platz-bg');
  const placeAll = () => {
    placeOn(heroMedia, heroImg);
    const r = placeOn(pMedia, pImg);
    if (r) { const s = $('.spot', pMedia); pMedia.style.transformOrigin = `${parseFloat(s.style.left)}px ${parseFloat(s.style.top)}px`; }
  };
  [heroImg, pImg].filter(Boolean).forEach(i => i.complete ? placeAll() : i.addEventListener('load', placeAll));
  addEventListener('resize', placeAll);

  /* Namenskarten */
  const card = $('.person-card');
  if (card) {
  function showCard(p) {
    $$('.person').forEach(x => x.classList.toggle('on', x === p));
    card.querySelector('small').textContent = p.dataset.role;
    card.querySelector('b').textContent = p.dataset.name;
    card.querySelector('span').textContent = '„' + p.dataset.quote + '“';
    let left = p.offsetLeft + 44, top = p.offsetTop - 34;
    if (left + 290 > heroMedia.clientWidth) left = p.offsetLeft - 330;
    card.style.left = Math.max(10, left) + 'px'; card.style.top = Math.max(10, top) + 'px';
    card.classList.add('show');
  }
  const hideCard = () => { card.classList.remove('show'); $$('.person').forEach(x => x.classList.remove('on')); };
  $$('.person').forEach(p => {
    p.setAttribute('aria-label', p.dataset.name + ', ' + p.dataset.role);
    p.addEventListener('mouseenter', () => showCard(p));
    p.addEventListener('focus', () => showCard(p));
    p.addEventListener('mouseleave', hideCard);
    p.addEventListener('blur', hideCard);
    p.addEventListener('click', e => { e.preventDefault(); p.classList.contains('on') ? hideCard() : showCard(p); });
  });

  }

  /* Wärmebild folgt der Maus */
  const hero = $('.hero');
  if (hero) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* ---------- Headline Buchstabe für Buchstabe ---------- */
  $$('.split').forEach(h => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType !== 3) return walk(n);
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(word => {
        if (!word) return;
        if (/^\s+$/.test(word)) return frag.append(' ');
        const w = document.createElement('span'); w.className = 'w';
        [...word].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.append(s); });
        frag.append(w);
      });
      n.replaceWith(frag);
    });
    walk(h);
  });
  if (hasGsap && !reduce) {
    gsap.to('.split .ch', { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9, ease: 'power4.out', stagger: .03, delay: .2 });
    gsap.from('.hero .kicker, .hero .lead, .hero .ctas', { opacity: 0, y: 30, duration: .9, ease: 'power3.out', stagger: .1, delay: .8 });
    gsap.from('.person', { scale: 0, opacity: 0, duration: .6, ease: 'back.out(2)', stagger: .07, delay: 1.3 });
    gsap.from('.hero .spot-ring', { scale: 2.4, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 1.6 });
    gsap.from('.hero .spot-tag', { y: 20, opacity: 0, duration: .7, ease: 'back.out(2)', delay: 2.2 });
  } else $$('.split .ch').forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; c.style.filter = 'none'; });

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Ein Tag mit Lukas ---------- */
  const scenes = $$('.scene'), day = $('.day');
  if (scenes.length) {
  const hh = $('[data-hh]'), mm = $('[data-mm]'), clabel = $('[data-clabel]'), prog = $('.progress span'), sun = $('.sun');
  let curMin = 6 * 60 + 58, anim;
  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  function setClock(min) {
    hh.textContent = pad(Math.floor(min / 60)); mm.textContent = pad(Math.round(min % 60));
    const p = Math.min(1, Math.max(0, (min - 360) / 810)), a = Math.PI * (1 - p);
    sun.setAttribute('cx', 100 + 90 * Math.cos(a)); sun.setAttribute('cy', 100 - 90 * Math.sin(a));
  }
  function goTo(min) {
    cancelAnimationFrame(anim);
    if (reduce) { curMin = min; return setClock(min); }
    const from = curMin, t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - k, 3); curMin = from + (min - from) * e; setClock(curMin); if (k < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  function activate(s) {
    const i = scenes.indexOf(s);
    scenes.forEach(x => x.classList.toggle('active', x === s));
    s.classList.add('seen');
    goTo(toMin(s.dataset.time));
    clabel.textContent = s.dataset.label;
    day.style.setProperty('--sky', s.dataset.sky);
    prog.style.width = ((i + 1) / scenes.length * 100) + '%';
  }
  const sio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && activate(e.target)), { rootMargin: '-45% 0px -45% 0px' });
  scenes.forEach(s => sio.observe(s));
  setClock(curMin);
  }
  if (SHOT) { $$('.reveal').forEach(e => e.classList.add('in')); scenes.forEach(x => x.classList.add('seen')); }

  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-media', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '35% top', end: 'bottom top', scrub: true } });
    $$('.shot img').forEach(img => gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.closest('.scene'), start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.fromTo('.platz-media', { scale: 2.6 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.platz-hero', start: 'top 85%', end: 'bottom 65%', scrub: true } });
    gsap.from('.svc', { y: 60, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '.svc-grid', start: 'top 80%' } });
    gsap.from('.why article', { y: 50, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.why', start: 'top 85%' } });
    gsap.from('.job', { x: -40, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '.jobs', start: 'top 85%' } });
    gsap.from('.house', { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.house', start: 'top 85%' } });
  }

  /* ---------- Tilt-Karten ---------- */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('[data-tilt]').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = `rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg) translateY(-4px)`;
        c.style.setProperty('--gx', x * 100 + '%'); c.style.setProperty('--gy', y * 100 + '%');
      });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
  }

  /* ---------- Wärmepumpe interaktiv ---------- */
  if ($('[data-temp]')) {
  const HS = [
    ['Außengerät', 'Holt Wärme aus der Luft, sogar bei −15 °C. Steht leise im Garten, etwa so laut wie ein Kühlschrank in ein paar Metern Abstand.'],
    ['Inneneinheit & Speicher', 'Im Keller, wo früher der Öltank stand. Braucht etwa so viel Platz wie ein Kühlschrank. Den Rest des Raums bekommen Sie zurück.'],
    ['Fußbodenheizung', 'Ideal für die Wärmepumpe, weil sie mit 30 bis 35 °C auskommt. Fräsen wir auch nachträglich in den alten Estrich.'],
    ['Heizkörper', 'Oft reichen die alten. Manchmal tauschen wir zwei, drei gegen größere. Das rechnen wir raumweise aus, nicht nach Gefühl.'],
    ['Bad & Warmwasser', 'Warmes Wasser kommt aus dem Speicher. Auf Wunsch bauen wir das Bad gleich mit um: ein Team, ein Termin.'],
    ['Dach & Dämmung', 'Nicht jedes Haus muss erst gedämmt werden. Wir sagen ehrlich, was sich lohnt und was nicht.']
  ];
  const infoT = $('[data-info-t]'), infoP = $('[data-info-p]');
  $$('.hs').forEach(g => {
    const act = () => {
      $$('.hs').forEach(x => x.classList.toggle('on', x === g));
      const [t, p] = HS[+g.dataset.hs]; infoT.textContent = t; infoP.textContent = p;
      if (hasGsap && !reduce) gsap.fromTo('.hp-info', { x: 14, opacity: .3 }, { x: 0, opacity: 1, duration: .45, ease: 'power3.out' });
    };
    g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', HS[+g.dataset.hs][0]);
    g.addEventListener('mouseenter', act); g.addEventListener('click', act);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  const temp = $('[data-temp]'), snow = $('[data-snow]'), house = $('.house');
  for (let i = 0; i < 46; i++) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', (Math.random() * 2 + 1).toFixed(1));
    c.setAttribute('cx', (Math.random() * 640).toFixed(0)); c.setAttribute('cy', (Math.random() * 420).toFixed(0));
    c.dataset.v = (Math.random() * .6 + .4).toFixed(2); snow.append(c);
  }
  let snowAmt = 0;
  (function fall() {
    $$('circle', snow).forEach((c, i) => {
      if (i >= snowAmt) { c.style.display = 'none'; return; }
      c.style.display = '';
      let y = +c.getAttribute('cy') + +c.dataset.v * 1.2; if (y > 425) y = -5;
      c.setAttribute('cy', y.toFixed(1));
      c.setAttribute('cx', (+c.getAttribute('cx') + Math.sin(y / 20) * .3).toFixed(1));
    });
    if (!reduce) requestAnimationFrame(fall);
  })();
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (c1, c2, t) => '#' + [1, 3, 5].map(i => Math.round(lerp(parseInt(c1.substr(i, 2), 16), parseInt(c2.substr(i, 2), 16), t)).toString(16).padStart(2, '0')).join('');
  function updateHP() {
    const T = +temp.value, t = (T + 15) / 30;
    const cop = Math.min(4.6, Math.max(2.3, 3.3 + .07 * T));
    $('[data-cop-big]').textContent = cop.toFixed(1).replace('.', ',');
    const out = $('[data-tout]');
    out.textContent = (T > 0 ? '+' : T < 0 ? '−' : '') + Math.abs(T) + ' °C';
    out.style.color = T < 0 ? '#7EC8E3' : T < 8 ? '#FFD39A' : '#FF5B1F';
    const um = $('[data-umwelt]'); um.style.flex = (cop - 1).toFixed(2); um.textContent = 'Umwelt ' + (cop - 1).toFixed(1).replace('.', ',');
    $('[data-sky1]').setAttribute('stop-color', mix('#1E2A45', '#7FA9C9', t));
    $('[data-sky2]').setAttribute('stop-color', mix('#5E6E86', '#F2C48D', t));
    $('[data-ground]').setAttribute('fill', T <= 0 ? '#E8EEF2' : '#3A3A3A');
    snowAmt = T <= 0 ? Math.round((-T + 1) / 16 * 46) : 0;
    house.style.setProperty('--fan', (.35 + t * 1.1).toFixed(2) + 's');
    house.style.setProperty('--fs', (.9 + t * 1.2).toFixed(2) + 's');
    $('.warmglow').style.opacity = (1 - t * .5).toFixed(2);
  }
  temp.addEventListener('input', updateHP); updateHP();
  }

  /* ---------- Förderrechner ---------- */
  if ($('[data-cost]')) {
  // Stand KfW 458 ab 21.07.2026: Effizienzbonus nicht mehr aufgeführt, Einkommensbonus gestaffelt, Deckel 70 % (80 % bei geringem Einkommen)
  const R = { grund: 30, klimaNow: 16, klimaLater: 12, max: 70, maxLow: 80, capNow: 28000, capLater: 27250 };
  const costIn = $('[data-cost]'), bars = $('[data-bars]');
  let shown = 0;
  function calc() {
    const owner = $('input[name=owner]:checked').value === '1';
    const fuel = $('input[name=fuel]:checked').value;
    const cost = +costIn.value, inc = +$('[data-income]').value, child = $('[data-child]').checked, t = child ? 10000 : 0;
    const incBonus = !owner ? 0 : inc <= 30000 + t ? 40 : inc <= 40000 + t ? 30 : inc <= 50000 + t ? 10 : 0;
    const cap = owner && inc <= 30000 + t ? R.maxLow : R.max;
    $('[data-cost-out]').textContent = eur(cost) + ' €';
    const parts = klima => [
      ['Grundförderung', R.grund, true],
      ['Klimageschwindigkeitsbonus', klima, owner && ['oel', 'gas', 'kohle', 'nacht'].includes(fuel)],
      ['Einkommensbonus', incBonus, incBonus > 0]
    ];
    const rate = ps => Math.min(cap, ps.reduce((s, p) => s + (p[2] ? p[1] : 0), 0));
    const pNow = parts(R.klimaNow), pLater = parts(R.klimaLater);
    const now = Math.min(cost, R.capNow) * rate(pNow) / 100;
    const later = Math.min(cost, R.capLater) * rate(pLater) / 100;
    bars.innerHTML = pNow.map(p => `<div class="bar ${p[2] ? '' : 'off'}"><span>${p[0]}</span><span>${p[2] ? p[1] + ' %' : '–'}</span><i><b style="width:${p[2] ? p[1] / R.maxLow * 100 : 0}%"></b></i></div>`).join('') +
      `<div class="bar"><span><b style="color:#fff">Zusammen</b></span><span><b style="color:#FF5B1F">${rate(pNow)} %</b> von ${eur(Math.min(cost, R.capNow))} €</span></div>`;
    $('[data-grant-later]').textContent = eur(later);
    $('[data-loss]').textContent = eur(Math.max(0, now - later));
    const el = $('[data-grant-now]');
    if (reduce) { el.textContent = eur(now); shown = now; return; }
    const from = shown, t0 = performance.now();
    clearTimeout(calc.t); calc.t = setTimeout(() => { el.textContent = eur(now); shown = now; }, 700);  // falls Animation pausiert (Hintergrund-Tab)
    (function run(n) { const k = Math.min(1, (n - t0) / 600), e = 1 - Math.pow(1 - k, 3); el.textContent = eur(from + (now - from) * e); if (k < 1) requestAnimationFrame(run); else shown = now; })(t0);
  }
  $$('.calc input, .calc select').forEach(i => i.addEventListener('input', calc)); calc();
  }

  /* ---------- Vorher / Nachher ---------- */
  const ba = $('[data-ba]');
  if (ba) {
  const baImg = $('img', ba), hideBa = () => { ba.closest('section').style.display = 'none'; };
  if (baImg.complete && !baImg.naturalWidth) hideBa(); else baImg.addEventListener('error', hideBa);
  $('[data-ba-range]').addEventListener('input', e => ba.style.setProperty('--p', e.target.value + '%'));
  if (hasGsap && !reduce) ScrollTrigger.create({ trigger: ba, start: 'top 70%', once: true, onEnter: () => gsap.fromTo(ba, { '--p': '85%' }, { '--p': '50%', duration: 1.6, ease: 'power3.inOut' }) });
  }

  /* ---------- Vorab-Check ---------- */
  if ($('[data-check-send]')) {
  $$('[data-slot]').forEach(inp => inp.addEventListener('change', () => {
    const f = inp.files[0]; if (!f) return;
    const slot = inp.closest('.slot');
    slot.style.backgroundImage = `url(${URL.createObjectURL(f)})`; slot.classList.add('filled');
    slot.querySelector('i').textContent = '✓';
  }));
  $('[data-check-send]').addEventListener('click', () => $('[data-check-done]').classList.add('show'));
  }

  /* ---------- Kontakt: Thema vorwählen ---------- */
  const topicSel = $('[data-topic-select]');
  if (topicSel) {
  $$('[data-topic]').forEach(a => a.addEventListener('click', () => { topicSel.value = a.dataset.topic; }));
  $('[data-contact]').addEventListener('submit', e => { e.preventDefault(); $('[data-form-ok]').classList.add('show'); });
  }

  /* ---------- 60-Sekunden-Bewerbung ---------- */
  if ($('[data-chat-log]')) {
  const log = $('[data-chat-log]'), quick = $('[data-chat-quick]'), form = $('[data-chat-form]'), txt = $('[data-chat-text]');
  const A = {};
  const flow = [
    { q: 'Hi! Schön, dass du da bist. Wie heißt du?', key: 'name', free: true },
    { q: () => `Freut mich, ${A.name}! Was machst du gerade?`, key: 'jetzt', opts: ['Schule', 'Ausbildung woanders', 'Gesell/in', 'Was ganz anderes'] },
    { q: 'Was reizt dich bei uns am meisten?', key: 'job', opts: ['Monteur/in', 'Ausbildung', 'Quereinstieg', 'Kundendienst'] },
    { q: 'Letzte Frage: Wann darf Heinz dich anrufen?', key: 'zeit', opts: ['Vormittags', 'Mittags', 'Ab 17 Uhr'] }
  ];
  let stepI = 0, started = false, preJob = null;
  const add = (t, who) => { const m = document.createElement('div'); m.className = 'msg ' + who; m.textContent = t; log.append(m); log.scrollTop = log.scrollHeight; };
  function ask() {
    quick.innerHTML = '';
    if (stepI < flow.length && flow[stepI].key === 'job' && preJob) { A.job = preJob; stepI++; }
    const typing = document.createElement('div'); typing.className = 'msg bot typing'; typing.innerHTML = '<i></i><i></i><i></i>'; log.append(typing); log.scrollTop = log.scrollHeight;
    setTimeout(() => {
      typing.remove();
      if (stepI >= flow.length) {
        add(`Danke, ${A.name}! Heinz ruft dich ${A.zeit.toLowerCase()} an${A.job ? ' wegen ' + A.job : ''}. Bis gleich!`, 'bot');
        add('Demo: Hier wird nichts gesendet.', 'bot');
        const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Nochmal von vorn';
        b.onclick = () => { log.innerHTML = ''; stepI = 0; preJob = null; ask(); }; quick.append(b);
        return;
      }
      const s = flow[stepI];
      add(typeof s.q === 'function' ? s.q() : s.q, 'bot');
      (s.opts || []).forEach(o => { const b = document.createElement('button'); b.type = 'button'; b.textContent = o; b.onclick = () => answer(o); quick.append(b); });
      if (s.free && matchMedia('(hover:hover)').matches && started) txt.focus({ preventScroll: true });
    }, reduce ? 50 : 700);
  }
  function answer(v) {
    v = v.trim(); if (!v || stepI >= flow.length) return;
    A[flow[stepI].key] = v; add(v, 'me'); stepI++; ask();
  }
  form.addEventListener('submit', e => { e.preventDefault(); answer(txt.value); txt.value = ''; });
  const start = () => { if (!started) { started = true; ask(); } };
  const cio = new IntersectionObserver(es => { if (es[0].isIntersecting) { start(); cio.disconnect(); } }, { threshold: .4 });
  cio.observe($('[data-chat]'));
  $$('[data-job]').forEach(b => b.addEventListener('click', () => { preJob = b.dataset.job; start(); }));
  if (SHOT && Q.has('chat')) ['Jonas', 'Gesell/in', 'Monteur/in'].forEach((a, i) => setTimeout(() => { start(); answer(a); }, 400 + i * 400));
  }

  /* ---------- Video: Pause-Knopf, spielt nur sichtbar ---------- */
  $$('[data-vid]').forEach(v => {
    const btn = v.parentElement.querySelector('[data-vid-toggle]');
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); if (btn) btn.textContent = '▶'; }
    const set = () => { if (btn) { btn.textContent = v.paused ? '▶' : '❚❚'; btn.setAttribute('aria-label', v.paused ? 'Video abspielen' : 'Video anhalten'); } };
    if (btn) btn.addEventListener('click', () => { v.paused ? v.play() : v.pause(); v.dataset.user = '1'; set(); });
    v.addEventListener('play', set); v.addEventListener('pause', set);
    new IntersectionObserver(es => es.forEach(e => { if (v.dataset.user || reduce) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }), { threshold: .25 }).observe(v);
  });
})();

/* Vorschau-Hilfe für First Frames: ?shot=<id>[&scene=n][&hover=sel][&hide=sel][&y=px] */
(() => {
  const q = new URLSearchParams(location.search), id = q.get('shot');
  if (!id) return;
  document.documentElement.style.scrollBehavior = 'auto';
  if (id !== 'top') {
    document.querySelectorAll('body > section, body > footer, .demo-bar').forEach(s => { if (s.id !== id) s.style.display = 'none'; });
    if (q.get('hide')) document.querySelectorAll(q.get('hide')).forEach(e => e.style.display = 'none');
    const sc0 = q.get('scene');
    if (sc0 !== null) { document.querySelector('.day-intro').style.display = 'none'; document.querySelectorAll('.scene').forEach((s, i) => { if (i !== +sc0) s.style.display = 'none'; }); document.querySelector('.day-stage').style.paddingTop = '60px'; }
  }
  const go = () => {
    const sc = q.get('scene');
    if (sc !== null) {
      const all = [...document.querySelectorAll('.scene')], s = all[+sc];
      all.forEach(x => x.classList.toggle('active', x === s));
      const [h, m] = s.dataset.time.split(':');
      document.querySelector('[data-hh]').textContent = h; document.querySelector('[data-mm]').textContent = m;
      document.querySelector('[data-clabel]').textContent = s.dataset.label;
      document.querySelector('.day').style.setProperty('--sky', s.dataset.sky);
      document.querySelector('.progress span').style.width = ((+sc + 1) / all.length * 100) + '%';
      const p = Math.min(1, Math.max(0, (h * 60 + +m - 360) / 810)), a = Math.PI * (1 - p), sun = document.querySelector('.sun');
      sun.setAttribute('cx', 100 + 90 * Math.cos(a)); sun.setAttribute('cy', 100 - 90 * Math.sin(a));
    }
    const sel = q.get('hover');
    if (sel) { const e = document.querySelector(sel); if (e) e.dispatchEvent(new Event(e.matches('.person') ? 'mouseenter' : 'click')); }
  };
  addEventListener('load', () => { go(); setTimeout(go, 300); });
})();
