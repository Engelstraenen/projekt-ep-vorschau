/* WÄRMEWERK Demo (PROJEKT EX): Wärmebild-Linse, Live-Konfigurator, Scroll-Film, Querschnitt, Vorher/Nachher. */
(() => {
  const d = document, root = d.documentElement, $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  root.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const de = (n, k = 0) => n.toLocaleString('de-DE', { minimumFractionDigits: k, maximumFractionDigits: k });
  const minus = s => String(s).replace('-', '−');
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dpr = () => Math.min(devicePixelRatio || 1, 2);
  const visible = new WeakMap();
  const io = new IntersectionObserver(es => es.forEach(e => {
    visible.set(e.target, e.isIntersecting);
    if (e.target.tagName === 'VIDEO') { if (e.isIntersecting) { e.target.play().catch(() => {}); } else e.target.pause(); }
    if (e.isIntersecting && e.target.hasAttribute('data-rv')) e.target.classList.add('in');
  }), { rootMargin: '120px 0px' });
  $$('[data-rv]').forEach(el => io.observe(el));
  $$('video.bgv,.hero video').forEach(v => { v.muted = true; io.observe(v); });

  /* Kopfzeile */
  const head = $('[data-head]');
  const onScroll = () => head.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Hero: Wärmebild-Linse */
  const hero = $('[data-hero]');
  if (hero && fine && !reduce) {
    const lt = $('[data-lens-t]');
    const [v1, v2] = $$('video', hero);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x = lerp(x, tx, .18); y = lerp(y, ty, .18);
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--x', x + 'px'); hero.style.setProperty('--y', y + 'px');
      hero.style.setProperty('--px', x + 'px'); hero.style.setProperty('--py', y + 'px');
      const t = Math.round(lerp(-6, 24, clamp(1 - (x / r.width) * .6 - (y / r.height) * .2, 0, 1)) + (x / r.width > .45 && y / r.height > .45 && y / r.height < .8 ? 8 : 0));
      lt.textContent = minus(t);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .3 ? requestAnimationFrame(tick) : 0;
    };
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (!hero.classList.contains('is-lens')) { x = tx; y = ty; hero.classList.add('is-lens'); } if (!raf) raf = requestAnimationFrame(tick); });
    hero.addEventListener('pointerleave', () => hero.classList.remove('is-lens'));
    setInterval(() => { if (v1 && v2 && Math.abs(v1.currentTime - v2.currentTime) > .15) v2.currentTime = v1.currentTime; }, 1500);
  } else if (hero) { const v2 = $('.hero__ir', hero); v2 && v2.remove(); }

  /* Zähler */
  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count; if (reduce) return;
    const ob = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; ob.disconnect(); const t0 = performance.now(), from = to > 100 ? 0 : (to < 0 ? 8 : 10);
      const f = n => { const p = clamp((n - t0) / 1600, 0, 1), k = 1 - Math.pow(1 - p, 4); el.textContent = minus(Math.round(lerp(from, to, k))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
    ob.observe(el);
  });

  /* GSAP: Hero-Zeilen, Film, Ablauf */
  const G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) G.registerPlugin(ST);
  if (G && !reduce) G.from('.hero h1 .ln>span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .09, delay: .15 });

  /* Konfigurator */
  const konf = $('[data-konf]'), cv = $('[data-viz]');
  const O = k => $$(`[data-o="${k}"]`);
  const set = (k, v) => O(k).forEach(el => { el.textContent = v; });
  const S = { fl: 140, bj: 1985, hz: 'oel', hf: 'gross', w: 80, kw: 8.4, vl: 45, jaz: 3.6, co2: 62, score: .7 };
  const A = { w: 80, size: .6, vl: 45, jaz: 3.6, score: .7, fbh: 0, old: 1 }; // animierte Werte
  const wpm = bj => bj < 1978 ? lerp(150, 110, (bj - 1950) / 28) : bj < 1995 ? lerp(110, 70, (bj - 1978) / 17) : bj < 2010 ? lerp(70, 45, (bj - 1995) / 15) : lerp(45, 30, (bj - 2010) / 14);
  const sum = $('[data-sum]');
  const hzName = { oel: 'Öl', gas: 'Gas', nsp: 'Nachtspeicher' }, hfName = { fbh: 'Fußbodenheizung', gross: 'Große Heizkörper', klein: 'Alte Heizkörper' };
  const calc = () => {
    const f = new FormData(konf);
    S.fl = +f.get('fl'); S.bj = +f.get('bj'); S.hz = f.get('hz'); S.hf = f.get('hf');
    S.w = wpm(S.bj); S.kw = S.fl * S.w / 1000 * 1.05;
    S.vl = { fbh: 35, gross: 45, klein: 55 }[S.hf] + (S.bj < 1978 && S.hf !== 'fbh' ? 4 : 0) - (S.bj > 2002 ? 3 : 0);
    S.jaz = clamp(4.9 - .07 * (S.vl - 30), 2.6, 4.8);
    const ref = { oel: .32, gas: .25, nsp: .48 }[S.hz];
    S.co2 = Math.round((1 - (.38 / S.jaz) / ref) * 100);
    S.score = clamp(1 - (S.vl - 35) / 30 - Math.max(0, S.w - 90) / 160, .15, 1);
    $$('.sl', konf).forEach(r => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%'));
    set('fl', S.fl + ' m²'); set('bj', S.bj);
    set('kw', de(S.kw, 1)); set('vl', Math.round(S.vl)); set('jaz', de(S.jaz, 1)); set('co2', Math.max(0, S.co2));
    const v = S.score > .72 ? ['Sehr gut geeignet', '#2f8f6a', `Mit ${hfName[S.hf].toLowerCase()} reicht ein Vorlauf um ${Math.round(S.vl)} °C. Ideale Bedingungen.`]
      : S.score > .45 ? ['Gut geeignet', '#c98a1b', `Ein Vorlauf um ${Math.round(S.vl)} °C ist machbar. Einzelne Heizkörper zu tauschen bringt oft noch mehr.`]
      : ['Machbar mit Vorarbeit', '#e2582f', `Bei ${Math.round(S.vl)} °C Vorlauf lohnt sich zuerst ein Blick auf Heizkörper und Dämmung. Wir zeigen Ihnen, wo.`];
    set('verdict', v[0]); set('text', v[2]); O('dot').forEach(e => e.style.background = v[1]);
    if (sum) sum.innerHTML = `<dt>Wohnfläche</dt><dd>${S.fl} m²</dd><dt>Baujahr</dt><dd>${S.bj}</dd><dt>Heute</dt><dd>${hzName[S.hz]}, ${hfName[S.hf]}</dd><dt>Einschätzung</dt><dd>${v[0]}</dd>`;
    if (!running) loop();
  };
  let running = false, parts = [], last = 0;
  const ctx = cv && cv.getContext('2d');
  const size = () => { if (!cv) return; const r = cv.getBoundingClientRect(); cv.width = r.width * dpr(); cv.height = r.height * dpr(); };
  const draw = (now) => {
    const k = dpr(), W = cv.width / k, H = cv.height / k, dt = Math.min(50, now - (last || now)) / 16.7; last = now;
    for (const [a, b] of [['w', S.w], ['vl', S.vl], ['jaz', S.jaz], ['score', S.score]]) A[a] = lerp(A[a], b, .08);
    A.size = lerp(A.size, clamp((S.fl - 60) / 260, 0, 1), .08); A.fbh = lerp(A.fbh, S.hf === 'fbh' ? 1 : 0, .08);
    ctx.setTransform(k, 0, 0, k, 0, 0); ctx.clearRect(0, 0, W, H);
    const rd = cv.parentNode.querySelector('.viz__read'), gY = H - (rd ? rd.offsetHeight : 0) - 36, av = gY - 70, hw = lerp(W * .3, W * .5, A.size), hh = Math.min(lerp(H * .26, H * .34, A.size), av * .6), hx = W * .44 - hw / 2, roof = hh * .55;
    const ins = clamp((A.w - 30) / 120, 0, 1); // 0 = gut gedämmt
    // Boden + Schnee
    const gg = ctx.createLinearGradient(0, gY, 0, H); gg.addColorStop(0, '#1a2c35'); gg.addColorStop(1, '#0b161c');
    ctx.fillStyle = gg; ctx.fillRect(0, gY, W, H - gY);
    ctx.strokeStyle = '#ffffff22'; ctx.beginPath(); ctx.moveTo(0, gY); ctx.lineTo(W, gY); ctx.stroke();
    // Innenwärme
    const glow = ctx.createRadialGradient(hx + hw / 2, gY - hh * .4, 10, hx + hw / 2, gY - hh * .4, hw * .8);
    glow.addColorStop(0, `rgba(240,138,75,${.42 + .2 * A.score})`); glow.addColorStop(1, 'rgba(240,138,75,0)');
    // Hausform
    const path = () => { ctx.beginPath(); ctx.moveTo(hx, gY); ctx.lineTo(hx, gY - hh); ctx.lineTo(hx + hw / 2, gY - hh - roof); ctx.lineTo(hx + hw, gY - hh); ctx.lineTo(hx + hw, gY); ctx.closePath(); };
    path(); ctx.fillStyle = '#132730'; ctx.fill();
    ctx.save(); path(); ctx.clip(); ctx.fillStyle = glow; ctx.fillRect(hx, gY - hh - roof, hw, hh + roof); ctx.restore();
    // Wand: Dämmstärke
    ctx.lineWidth = lerp(9, 2, ins); ctx.strokeStyle = `rgba(${Math.round(lerp(127, 226, ins))},${Math.round(lerp(178, 88, ins))},${Math.round(lerp(198, 47, ins))},.85)`; path(); ctx.stroke();
    // Geschossdecke
    ctx.strokeStyle = '#ffffff30'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx + 6, gY - hh / 2); ctx.lineTo(hx + hw - 6, gY - hh / 2); ctx.stroke();
    // Heizflächen
    const t = now / 1000;
    ctx.strokeStyle = `rgba(240,138,75,${.25 + .6 * A.fbh})`; ctx.lineWidth = 1.5;
    for (const fy of [gY - 6, gY - hh / 2 - 6]) { ctx.beginPath(); for (let x = hx + 10; x < hx + hw - 10; x += 3) { const y = fy + Math.sin(x * .12 + t * 2) * 2.2 * A.fbh; x === hx + 10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.globalAlpha = A.fbh; ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.fillStyle = `rgba(240,138,75,${.8 * (1 - A.fbh)})`;
    const rs = S.hf === 'klein' ? 16 : 28;
    for (const fy of [gY - 26, gY - hh / 2 - 26]) for (const fx of [hx + hw * .2, hx + hw * .7]) { for (let i = 0; i < rs; i += 4) ctx.fillRect(fx + i, fy, 2, 18); }
    // Fenster
    ctx.fillStyle = '#f5c79a'; for (const fy of [gY - hh * .82, gY - hh * .32]) for (const fx of [hx + hw * .32, hx + hw * .55]) { ctx.globalAlpha = .55 + .15 * Math.sin(t + fx); ctx.fillRect(fx, fy, hw * .1, hh * .16); } ctx.globalAlpha = 1;
    // Außengerät
    const ux = Math.min(W - 70, hx + hw + 36), uy = gY - 50;
    ctx.fillStyle = '#e8eef0'; ctx.fillRect(ux, uy, 54, 50); ctx.strokeStyle = '#9fb3bb'; ctx.strokeRect(ux + .5, uy + .5, 53, 49);
    ctx.save(); ctx.translate(ux + 27, uy + 25); ctx.rotate(t * (2 + A.jaz)); ctx.strokeStyle = '#4b6470'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(8, -4, 4, -15); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.arc(ux + 27, uy + 25, 17, 0, 7); ctx.strokeStyle = '#4b6470'; ctx.lineWidth = 1; ctx.stroke();
    // Leitung Gerät -> Haus
    ctx.strokeStyle = '#ffffff25'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ux, gY - 10); ctx.lineTo(hx + hw, gY - 10); ctx.stroke();
    const n = 5; for (let i = 0; i < n; i++) { const p = ((t * (.25 + A.jaz * .06)) + i / n) % 1; ctx.fillStyle = `rgba(240,138,75,${Math.sin(p * Math.PI)})`; ctx.beginPath(); ctx.arc(lerp(ux, hx + hw, p), gY - 10, 2.6, 0, 7); ctx.fill(); }
    // Partikel: Verlust (warm, aus Hülle) und Umweltluft (kalt, zum Gerät)
    const lossRate = .15 + ins * 1.4, airRate = .5 + A.jaz * .15;
    if (Math.random() < lossRate * dt) { const side = Math.random(); let x, y, vx, vy;
      if (side < .3) { x = hx; y = gY - Math.random() * hh; vx = -.6; vy = -.1; } else if (side < .6) { x = hx + hw; y = gY - Math.random() * hh; vx = .6; vy = -.1; } else { const q = Math.random(); x = hx + hw * q; y = gY - hh - roof * (1 - Math.abs(q - .5) * 2); vx = (q - .5) * .6; vy = -.7; }
      parts.push({ x, y, vx, vy, l: 1, c: 0 }); }
    if (Math.random() < airRate * dt) parts.push({ x: W + 4, y: uy + Math.random() * 50 - 10, vx: -lerp(1, 1.8, Math.random()), vy: 0, l: 1, c: 1, tx: ux + 54 });
    parts = parts.filter(p => p.l > 0);
    for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.l -= (p.c ? .006 : .012) * dt; if (p.c && p.x < p.tx) p.l = 0;
      ctx.fillStyle = p.c ? `rgba(127,178,198,${p.l * .9})` : `rgba(226,88,47,${p.l * .8})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.c ? 1.6 : 2.2, 0, 7); ctx.fill(); }
    // Kessel-Hinweis im Haus (verblasst)
    ctx.font = '500 11px Onest, sans-serif'; ctx.fillStyle = '#ffffff99'; ctx.fillText('WÄRMEVERLUST', 18, gY - hh - roof * .2); ctx.fillStyle = '#7fb2c6'; ctx.fillText('UMWELTWÄRME', Math.min(W - 100, ux - 10), uy - 16);
  };
  const loop = () => { running = true; const f = n => { if (visible.get(cv) === false || reduce) { running = false; if (reduce) draw(n); return; } draw(n); requestAnimationFrame(f); }; requestAnimationFrame(f); };
  if (konf && cv) { size(); addEventListener('resize', size); konf.addEventListener('input', calc); konf.addEventListener('submit', e => e.preventDefault()); io.observe(cv); new IntersectionObserver(([e]) => { if (e.isIntersecting && !running) loop(); }).observe(cv); calc(); }

  /* Scroll-Film */
  const film = $('[data-film]'), fc = $('[data-film-c]');
  if (film && fc) {
    const N = 97, mob = innerWidth < 760, dir = mob ? 'film/seq-m/' : 'film/seq-d/', imgs = new Array(N), fx = fc.getContext('2d');
    const load = i => { if (imgs[i]) return imgs[i]; const im = new Image(); im.decoding = 'async'; im.src = dir + String(i + 1).padStart(3, '0') + '.webp'; imgs[i] = im; im.onload = () => { if (i === cur) paint(i); }; return im; };
    let cur = 0;
    const fsize = () => { const r = fc.getBoundingClientRect(); fc.width = r.width * dpr(); fc.height = r.height * dpr(); paint(cur); };
    const paint = i => { const im = load(i); if (!im.complete || !im.naturalWidth) { for (let j = i; j >= 0; j--) if (imgs[j] && imgs[j].complete && imgs[j].naturalWidth) return cover(imgs[j]); return; } cover(im); };
    const cover = im => { const W = fc.width, H = fc.height, s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s; fx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); };
    load(0);
    new IntersectionObserver(([e]) => { if (e.isIntersecting) for (let i = 0; i < N; i++) load(i); }, { rootMargin: '100% 0px' }).observe(film);
    fsize(); addEventListener('resize', fsize);
    const caps = $$('.film__cap p', film), deg = $('[data-film-deg]'), where = $('[data-film-where]'), bar = $('.film__bar', film);
    const upd = p => { const i = Math.round(p * (N - 1)); if (i !== cur) { cur = i; paint(i); } caps.forEach((c, k) => c.classList.toggle('on', k === Math.min(2, Math.floor(p * 3)))); deg.textContent = minus(Math.round(lerp(-7, 21, clamp((p - .45) / .45, 0, 1)))); where.textContent = p < .55 ? 'Draußen' : 'Drinnen'; bar.style.setProperty('--p', p); };
    if (ST) ST.create({ trigger: film, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => upd(s.progress) });
    else addEventListener('scroll', () => { const r = film.getBoundingClientRect(); upd(clamp(-r.top / (r.height - innerHeight), 0, 1)); }, { passive: true });
  }

  /* Ablauf-Linie */
  const fl = $('[data-flowsteps]');
  if (fl && ST) ST.create({ trigger: fl, start: 'top 75%', end: 'bottom 45%', scrub: .4, onUpdate: s => { fl.style.setProperty('--p', s.progress); $$('li', fl).forEach((li, i) => li.classList.toggle('on', s.progress >= i / 3.2)); } });
  else if (fl) { fl.style.setProperty('--p', 1); $$('li', fl).forEach(li => li.classList.add('on')); }

  /* Querschnitt */
  const haus = $('[data-haus]');
  if (haus) {
    const DATA = [
      ['Außen', 'Außengerät', 'Zieht Umgebungswärme aus der Luft, auch bei minus 15 Grad. Wir planen den Aufstellort mit Abstand zum Nachbarn und auf schwingungsfreiem Sockel.'],
      ['Keller', 'Inneneinheit', 'Hier sitzen Regelung, Pumpe und Wärmetauscher. Kompakt wie ein Kühlschrank, wandhängend oder stehend.'],
      ['Keller', 'Warmwasserspeicher', 'Hält Duschwasser warm. Einmal pro Woche heizt die Anlage kurz auf 60 Grad, als Schutz vor Legionellen.'],
      ['Erdgeschoss', 'Fußbodenheizung', 'Große Fläche, niedrige Temperatur: Mit rund 35 Grad Vorlauf arbeitet die Wärmepumpe am effizientesten.'],
      ['Gebäudehülle', 'Dämmung', 'Gut gedämmte Wände senken die Heizlast. Muss aber nicht zuerst sein: Oft genügt die Wärmepumpe auch im Bestand.'],
      ['Obergeschoss', 'Bad und Warmwasser', 'Warmes Wasser in gewohnter Menge. Ein Badheizkörper sorgt für das wohlige Handtuch am Morgen.']
    ];
    const panel = $('[data-panel]', haus), hs = $$('.hs', haus), hb = $$('[data-hb]');
    let open = -1;
    const show = i => {
      open = i === open ? -1 : i;
      hs.forEach((b, k) => b.setAttribute('aria-expanded', k === open)); hb.forEach((b, k) => b.setAttribute('aria-pressed', k === open));
      if (open < 0) { panel.classList.remove('on'); return; }
      const b = hs[open], l = parseFloat(b.style.getPropertyValue('--l')), t = parseFloat(b.style.getPropertyValue('--t'));
      $('[data-p-k]', panel).textContent = DATA[open][0]; $('[data-p-h]', panel).textContent = DATA[open][1]; $('[data-p-t]', panel).textContent = DATA[open][2];
      panel.classList.remove('on'); void panel.offsetWidth;
      const W = haus.clientWidth, H = haus.clientHeight, pw = panel.offsetWidth, ph = panel.offsetHeight;
      let x = l / 100 * W + 30, y = t / 100 * H - 20, o = 'top left';
      if (x + pw > W - 12) { x = l / 100 * W - pw - 30; o = 'top right'; }
      if (y + ph > H - 12) { y = Math.max(12, H - ph - 12); }
      panel.style.left = x + 'px'; panel.style.top = y + 'px'; panel.style.setProperty('--o', o);
      requestAnimationFrame(() => panel.classList.add('on'));
    };
    hs.forEach((b, i) => b.addEventListener('click', () => show(i)));
    hb.forEach((b, i) => b.addEventListener('click', () => show(i)));
    haus.addEventListener('keydown', e => { if (e.key === 'Escape' && open > -1) show(open); });
    if (fine && !reduce) { const img = $('.haus__img', haus); haus.addEventListener('pointermove', e => { const r = haus.getBoundingClientRect(); img.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5) * -14 + 'px'); img.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5) * -10 + 'px'); }); haus.addEventListener('pointerleave', () => { img.style.setProperty('--tx', 0); img.style.setProperty('--ty', 0); }); }
    // Schnee
    const sc = $('[data-snow]', haus), sx = sc.getContext('2d'); let fl2 = [];
    const ss = () => { sc.width = haus.clientWidth * dpr(); sc.height = haus.clientHeight * dpr(); fl2 = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .4, s: Math.random() * .4 + .15, w: Math.random() * 6 })); };
    ss(); addEventListener('resize', ss); io.observe(sc);
    const snow = n => { requestAnimationFrame(snow); if (!visible.get(sc) || reduce) return; const W = sc.width, H = sc.height, k = dpr(); sx.clearRect(0, 0, W, H); sx.fillStyle = '#ffffffcc';
      for (const f of fl2) { f.y += f.s / H * k * 1.2; if (f.y > 1) { f.y = 0; f.x = Math.random(); } sx.globalAlpha = .4 + f.r / 3; sx.beginPath(); sx.arc((f.x + Math.sin(n / 1600 + f.w) * .006) * W, f.y * H, f.r * k, 0, 7); sx.fill(); } };
    requestAnimationFrame(snow);
  }

  /* Leistungszahl */
  const cop = $('[data-cop]');
  if (cop) { const r = $('input', cop), C = k => $(`[data-c="${k}"]`, cop);
    const u = () => { const T = +r.value, c = clamp(3.6 + T * .1, 2.1, 5.2); r.style.setProperty('--p', ((T + 15) / 30 * 100) + '%');
      C('t').textContent = minus(T) + ' °C'; C('cop').textContent = de(c, 1); C('u').textContent = de(c - 1, 1); C('w').textContent = de(c, 1);
      C('bs').style.setProperty('--w', (1 / 5.2 * 100) + '%'); C('bu').style.setProperty('--w', ((c - 1) / 5.2 * 100) + '%'); C('bw').style.setProperty('--w', (c / 5.2 * 100) + '%'); };
    r.addEventListener('input', u); u(); }

  /* Vorher/Nachher */
  const ba = $('[data-ba]');
  if (ba) { const r = $('input', ba); const u = () => ba.style.setProperty('--s', r.value + '%'); r.addEventListener('input', u); u();
    if (!reduce) { const ob = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; ob.disconnect(); let t0 = 0; const f = n => { t0 ||= n; const p = clamp((n - t0) / 1800, 0, 1); r.value = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p); u(); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, { threshold: .6 }); ob.observe(ba); } }

  /* Leistungen: Video folgt dem Cursor */
  const lst = $('[data-lst]'), peek = $('.peek');
  if (lst && peek && fine && !reduce) { const v = $('video', peek); v.muted = true; let px = 0, py = 0, cx = 0, cy = 0, src = '', raf = 0;
    const t = () => { cx = lerp(cx, px, .16); cy = lerp(cy, py, .16); peek.style.setProperty('--x', cx + 'px'); peek.style.setProperty('--y', cy + 'px'); peek.style.setProperty('--r', clamp((px - cx) * .05, -6, 6) + 'deg'); raf = requestAnimationFrame(t); };
    $$('li', lst).forEach(li => { li.addEventListener('pointerenter', () => { if (src !== li.dataset.peek) { src = li.dataset.peek; v.src = src; } v.play().catch(() => {}); peek.classList.add('on'); if (!raf) raf = requestAnimationFrame(t); }); });
    lst.addEventListener('pointerleave', () => { peek.classList.remove('on'); v.pause(); cancelAnimationFrame(raf); raf = 0; });
    lst.addEventListener('pointermove', e => { px = e.clientX + 48; py = e.clientY - 240; if (!peek.classList.contains('on')) { cx = px; cy = py; } }); }

  /* Tabs */
  const tabs = $('[data-tabs]');
  if (tabs) { const bs = $$('[role=tab]', tabs), pill = $('.tabs__pill', tabs);
    const sel = (i, f) => { bs.forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; $('#' + b.getAttribute('aria-controls')).hidden = k !== i; }); pill.style.width = bs[i].offsetWidth + 'px'; pill.style.transform = `translateX(${bs[i].offsetLeft}px)`; if (f) bs[i].focus(); };
    bs.forEach((b, i) => { b.addEventListener('click', () => sel(i)); b.addEventListener('keydown', e => { if (e.key === 'ArrowRight') sel((i + 1) % bs.length, 1); if (e.key === 'ArrowLeft') sel((i + bs.length - 1) % bs.length, 1); }); });
    sel(0); addEventListener('resize', () => sel(bs.findIndex(b => b.getAttribute('aria-selected') === 'true'))); d.fonts && d.fonts.ready.then(() => sel(bs.findIndex(b => b.getAttribute('aria-selected') === 'true'))); }

  /* Vergleich: ruhige Wärmeströme im Hintergrund */
  $$('[data-flow]').forEach(fcv => { const c = fcv.getContext('2d'); const sz = () => { fcv.width = fcv.clientWidth * dpr(); fcv.height = fcv.clientHeight * dpr(); }; sz(); addEventListener('resize', sz); io.observe(fcv);
    const f = n => { requestAnimationFrame(f); if (!visible.get(fcv) || reduce) return; const W = fcv.width, H = fcv.height, t = n / 4000; c.clearRect(0, 0, W, H); c.lineWidth = 1.2 * dpr();
      for (let i = 0; i < 14; i++) { c.strokeStyle = i % 3 ? 'rgba(127,178,198,.55)' : 'rgba(240,138,75,.7)'; c.beginPath(); for (let x = 0; x <= W; x += 12) { const y = H * (.15 + i * .055) + Math.sin(x / W * 5 + t * (1 + i * .08) + i) * H * .04 + Math.sin(x / W * 11 - t * 1.4 + i * 2) * H * .012; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } };
    requestAnimationFrame(f); });

  /* Stimmen */
  const qs = $('[data-quotes]');
  if (qs) { const bq = $$('blockquote', qs); let q = 0; const go = s => { bq[q].classList.remove('on'); q = (q + s + bq.length) % bq.length; bq[q].classList.add('on'); };
    $$('[data-q]').forEach(b => b.addEventListener('click', () => go(+b.dataset.q))); }

  addEventListener('load', () => ST && ST.refresh());
})();
