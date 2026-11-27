/* WARMHERZ V3 – Rechner, Zähler, Einblenden, Formulare. Alles läuft lokal im Browser (Demo, nichts wird gesendet). */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const eur = n => Math.round(n).toLocaleString('de-DE') + ' €';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menü */
  const menue = $('.menue');
  $$('.burger').forEach(b => b.onclick = () => { menue.classList.add('auf'); $('.zu', menue).focus(); });
  $$('.menue .zu, .menue a').forEach(b => b.addEventListener('click', () => menue.classList.remove('auf')));
  addEventListener('keydown', e => { if (e.key === 'Escape') menue?.classList.remove('auf'); });

  /* Zahlen rollen (Idee getlayers „brewns“: Ziffern rollen statt springen) */
  function zaehle(el) {
    const ziel = parseFloat(el.dataset.zaehl), nk = (el.dataset.zaehl.split(',')[1] || el.dataset.zaehl.split('.')[1] || '').length;
    const vor = el.dataset.vor || '', nach = el.dataset.nach || '', t0 = performance.now(), d = reduce ? 1 : 1400;
    const f = t => { const q = Math.min(1, (t - t0) / d), v = ziel * (1 - Math.pow(1 - q, 3));
      el.textContent = vor + v.toLocaleString('de-DE', { minimumFractionDigits: nk, maximumFractionDigits: nk }) + nach; if (q < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el);
    if (el.dataset.zaehl) zaehle(el);
    if (el.classList.contains('rein')) el.classList.add('da');
    if (el.classList.contains('kinetik')) $$('span', el).forEach((s, i) => setTimeout(() => s.classList.add('da'), 250 + i * 380));
    if (el.classList.contains('balken')) $$('.s i', el).forEach(i => i.style.width = i.dataset.w);
  }), { threshold: 0.35 });
  $$('[data-zaehl], .rein, .kinetik, .balken').forEach(el => io.observe(el));

  /* Zahlen weich umrollen (Rechner) */
  const roll = (el, ziel, fmt) => { if (!el) return; const von = el._v ?? ziel, t0 = performance.now(), d = reduce ? 1 : 520; el._v = ziel;
    const f = t => { const q = Math.min(1, (t - t0) / d), v = von + (ziel - von) * (1 - Math.pow(1 - q, 3)); el.textContent = fmt(v); if (q < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const kwf = v => v.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  /* Wärmebild-Farbskala (gleich wie --t0 … --t5) */
  const STOPS = [[0, [22, 10, 51]], [.22, [59, 26, 138]], [.48, [176, 30, 142]], [.72, [255, 106, 0]], [.9, [255, 200, 61]], [1, [255, 244, 194]]];
  const farbe = (i, a = 1) => { i = Math.min(1, Math.max(0, i)); let k = 1; while (STOPS[k][0] < i) k++;
    const [p0, c0] = STOPS[k - 1], [p1, c1] = STOPS[k], q = (i - p0) / (p1 - p0 || 1);
    return `rgba(${c0.map((c, j) => Math.round(c + (c1[j] - c) * q)).join(',')},${a})`; };

  /* Heizungsalter: Regler = Zeitmaschine (Wärmebild-Wisch steuert linse.js) */
  const alt = $('#heiz-bj');
  if (alt) { const out = $('#heiz-alt'), msg = $('#heiz-msg'), jahr = $('#heiz-jahr');
    const f = () => { const a = 2026 - alt.value; out.textContent = a + ' Jahre'; jahr.textContent = alt.value;
      alt.style.setProperty('--f', ((alt.value - 1980) / 45 * 100) + '%');
      msg.textContent = a >= 30 ? 'Über 30 Jahre: Wir prüfen, ob eine Austauschpflicht nach GEG greift.'
        : a >= 20 ? 'Älter als 20 Jahre, wie die große Mehrheit der alten Kessel.'
        : a >= 15 ? 'Jetzt den Wechsel planen, ohne Druck.' : 'Noch jung. Wir übernehmen die Wartung.'; };
    alt.oninput = f; f(); }

  /* Heizlast: Haus als Wärmebild-Grafik + Wärmeströme (Richtwerte, ersetzt keine Berechnung nach DIN EN 12831) */
  const hl = $('#heizlast');
  if (hl) {
    const WM2 = { '1977': 130, '1994': 100, '2001': 80, '2015': 60, 'neu': 40 };
    let bj = '1977', san = false, last = 1;
    const fl = $('#hl-flaeche'), out = $('#hl-flaeche-out');
    const rechne = () => {
      out.textContent = fl.value + ' m²';
      const w = WM2[bj] * (san ? 0.7 : 1), kw = fl.value * w / 1000, i = (w - 25) / 130;
      roll($('#hl-kw'), kw, v => kwf(v) + ' kW');
      $('#hl-wm2').textContent = Math.round(w) + ' W/m²';
      $$('.raum', hl).forEach(r => { const ii = i + parseFloat(r.dataset.v);
        r.querySelector('rect').style.fill = farbe(ii); r.classList.toggle('hell', ii > .74);
        r.querySelector('.w').textContent = kwf(kw * parseFloat(r.dataset.a)) + ' kW'; });
      last = Math.max(.08, i);
    };
    $$('#hl-bj button').forEach(b => b.onclick = () => { bj = b.dataset.v; $$('#hl-bj button').forEach(x => x.setAttribute('aria-pressed', x === b)); rechne(); });
    $$('#hl-san button').forEach(b => b.onclick = () => { san = b.dataset.v === '1'; $$('#hl-san button').forEach(x => x.setAttribute('aria-pressed', x === b)); rechne(); });
    fl.oninput = rechne; rechne();
    /* Linien zeichnen sich beim Reinscrollen */
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { hl.classList.add('da'); o.disconnect(); } }), { threshold: .3 }).observe(hl);
    /* Wärmeströme: Teilchen verlassen das Haus an Dach, Wänden, Fenstern, Keller */
    const cv = $('canvas', hl), cx = cv.getContext('2d'); let sicht = false, T = [], sc = 1, ox = 0, oy = 0;
    const groesse = () => { const r = hl.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      cv.width = r.width * d; cv.height = r.height * d; sc = Math.min(r.width / 600, r.height / 560) * d; ox = (r.width * d - 600 * sc) / 2; oy = (r.height * d - 560 * sc) / 2; };
    groesse(); addEventListener('resize', groesse);
    new IntersectionObserver(es => { sicht = es[0].isIntersecting; }).observe(hl);
    const QUELLEN = [
      [.18, () => { const u = Math.random(); return u < .5 ? [30 + 270 * u * 2, 230 - 180 * u * 2, -.55, -1] : [300 + 270 * (u - .5) * 2, 50 + 180 * (u - .5) * 2, .55, -1]; }],
      [.12, () => [70, 230 + Math.random() * 240, -1, -.15]], [.12, () => [530, 230 + Math.random() * 240, 1, -.15]],
      [.24, () => { const r = [[140, 290], [270, 290], [385, 290], [485, 290], [180, 410], [355, 410], [475, 410]][Math.random() * 7 | 0]; return [r[0] + (Math.random() - .5) * 50, r[1] + (Math.random() - .5) * 40, (Math.random() - .5) * .8, -.9]; }],
      [.08, () => [Math.random() < .5 ? 70 : 530, 480 + Math.random() * 55, Math.random() < .5 ? -1 : 1, -.3]]];
    const sum = QUELLEN.reduce((s, q) => s + q[0], 0);
    const schritt = () => {
      if (sicht && !reduce) {
        const n = last * last * 7;
        for (let k = 0; k < n; k++) { let u = Math.random() * sum, q = QUELLEN[0]; for (const x of QUELLEN) { if ((u -= x[0]) <= 0) { q = x; break; } }
          const [x, y, dx, dy] = q[1](); const v = .6 + Math.random() * 1.2; T.push({ x, y, vx: dx * v, vy: dy * v - .3, l: 1 }); }
        cx.clearRect(0, 0, cv.width, cv.height); cx.globalCompositeOperation = 'lighter';
        T = T.filter(p => (p.l -= .012) > 0);
        for (const p of T) { p.x += p.vx; p.y += p.vy; p.vy -= .01; p.vx *= .995;
          cx.fillStyle = farbe(.55 + p.l * .45, p.l * .8); cx.beginPath(); cx.arc(ox + p.x * sc, oy + p.y * sc, (2 + (1 - p.l) * 5) * sc, 0, 7); cx.fill(); }
      }
      requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  }

  /* Förderung KfW 458 (Stand 21.07.2026) als Thermometer */
  const fr = $('#foerder');
  if (fr) {
    let selbst = true, eink = 'hoch';
    const k = $('#fr-kosten'), ko = $('#fr-kosten-out');
    const striche = $('.thermo .striche');
    if (striche) striche.innerHTML = [0, 10, 20, 30, 40, 50, 60, 70, 80].map(v => { const y = 450 - v * 5.25; return `<line x1="${v % 20 ? 112 : 108}" x2="122" y1="${y}" y2="${y}"/>` + (v % 20 ? '' : `<text x="128" y="${y + 7}">${v}</text>`); }).join('');
    const teil = (id, von, h) => { const r = document.getElementById(id); if (!r) return; const a = r._h ?? 0, ay = r._y ?? 450, t0 = performance.now(); r._h = h; r._y = 450 - von - h;
      const f = t => { const q = Math.min(1, (t - t0) / (reduce ? 1 : 700)), e = 1 - Math.pow(1 - q, 3);
        r.setAttribute('height', a + (h - a) * e); r.setAttribute('y', ay + (r._y - ay) * e); if (q < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
    const rechne = () => {
      const kosten = +k.value; ko.textContent = eur(kosten);
      const faehig = Math.min(kosten, 28000), ek = { '30': 40, '40': 30, '50': 10, 'hoch': 0 }[eink];
      const satzRoh = 30 + (selbst ? 16 + ek : 0), deckel = selbst && eink === '30' ? 80 : 70;
      const satz = Math.min(satzRoh, deckel), z = faehig * satz / 100;
      const g = 30, kl = selbst ? Math.min(16, satz - 30) : 0, e = satz - g - kl;
      teil('th-g', 0, g * 5.25); teil('th-k', g * 5.25, kl * 5.25); teil('th-e', (g + kl) * 5.25, e * 5.25);
      $('#fr-satz').textContent = satz + ' %';
      roll($('#fr-zuschuss'), z, eur); roll($('#fr-eigen'), kosten - z, eur);
      const bz = $('#fr-bz'); if (bz) bz.style.width = (z / kosten * 100) + '%';
      $('#fr-teile').innerHTML = [['g', 'Grundförderung', g], ['k', 'Klimabonus', kl], ['e', 'Einkommensbonus', e]]
        .map(([c, n, v]) => `<li class="${c}${v ? '' : ' leer'}"><i></i>${n}<b>${v} %</b></li>`).join('')
        + (satzRoh > deckel ? `<li class="deckel">gedeckelt auf ${deckel} %</li>` : '');
    };
    $$('#fr-selbst button').forEach(b => b.onclick = () => { selbst = b.dataset.v === '1'; $$('#fr-selbst button').forEach(x => x.setAttribute('aria-pressed', x === b)); rechne(); });
    $$('#fr-eink button').forEach(b => b.onclick = () => { eink = b.dataset.v; $$('#fr-eink button').forEach(x => x.setAttribute('aria-pressed', x === b)); rechne(); });
    k.oninput = rechne;
    let erst = true; new IntersectionObserver(es => { if (es[0].isIntersecting && erst) { erst = false; rechne(); } }, { threshold: .25 }).observe(fr);
  }

  /* Countdown bis 01.02.2027 (Klimabonus sinkt von 16 auf 12 %) */
  const cd = $('#countdown');
  if (cd) { const ziel = new Date('2027-02-01T00:00:00+01:00').getTime();
    const f = () => { let s = Math.max(0, (ziel - Date.now()) / 1000);
      const t = Math.floor(s / 86400); s -= t * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s = Math.floor(s - m * 60);
      cd.innerHTML = [[t, 'Tage'], [h, 'Std.'], [m, 'Min.'], [s, 'Sek.']].map(([v, n]) => `<div><b>${String(v).padStart(2, '0')}</b><span>${n}</span></div>`).join(''); };
    f(); setInterval(f, 1000); }

  /* Wärmepumpe: Außentemperatur → Leistungszahl als Wärme-Blöcke (Richtwert Luft/Wasser bei 35 °C Vorlauf) */
  const wetter = $('#wetter');
  if (wetter) {
    const cop = t => Math.min(5.5, Math.max(2.2, 3.8 + 0.11 * (t - 2)));
    const reg = $('#w-regler'), bl = $('#w-bloecke');
    bl.innerHTML = '<i></i>'.repeat(6);
    const zeige = () => { const t = +reg.value, c = cop(t);
      $('#w-temp').textContent = (t > 0 ? '+' : '') + String(t).replace('-', '−') + ' °C';
      $('#w-cop').textContent = c.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
      $$('i', bl).forEach((b, j) => b.style.setProperty('--f', Math.min(1, Math.max(0, c - j))));
      reg.style.setProperty('--f', ((t + 15) / 30 * 100) + '%'); };
    reg.oninput = () => { zeige(); $('#w-stand').textContent = 'Ihr Wert.'; };
    let live = null;
    const holen = () => fetch('https://api.open-meteo.com/v1/forecast?latitude=52.02&longitude=8.53&current=temperature_2m')
      .then(r => r.json()).then(d => { live = Math.round(d.current.temperature_2m); reg.value = live; zeige(); $('#w-stand').textContent = 'Bielefeld gerade ' + String(live).replace('-', '−') + ' °C (open-meteo.com).'; })
      .catch(() => { $('#w-stand').textContent = 'Beispielwert, Wetter gerade nicht abrufbar.'; });
    $('#w-live').onclick = holen; zeige(); holen();
  }

  /* Foto-Check-Kapitel: Fotos fliegen nacheinander ins Handy, sobald es sichtbar wird */
  const k9 = $('#k9');
  if (k9) { const n = $('#fc-n'), slots = $$('.handy-fotos i', k9), fl = $$('.flug img', k9);
    new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect();
      [1, 2, 3].forEach(c => setTimeout(() => { k9.dataset.n = c; n.textContent = c;
        const im = fl[c - 1]; if (im && slots[c - 1]) slots[c - 1].style.backgroundImage = 'url("' + (im.currentSrc || im.src) + '")'; }, reduce ? 0 : 500 + c * 900)); }, { threshold: .55 }).observe(k9); }

  /* Bewerbung in 60 Sekunden */
  const bw = $('#bewerbung');
  if (bw) {
    let i = 0, t0 = 0, iv;
    const zeige = n => { $$('.schritt', bw).forEach((s, k) => s.classList.toggle('an', k === n)); i = n; };
    $$('[data-stelle]', bw).forEach(b => b.onclick = () => { $$('[data-stelle]', bw).forEach(x => x.setAttribute('aria-pressed', x === b)); bw.dataset.stelle = b.dataset.stelle;
      if (!t0) { t0 = Date.now(); iv = setInterval(() => { $('.uhr', bw).textContent = Math.max(0, 60 - Math.round((Date.now() - t0) / 1000)) + ' s'; }, 500); } zeige(1); });
    $$('[data-erf]', bw).forEach(b => b.onclick = () => { $$('[data-erf]', bw).forEach(x => x.setAttribute('aria-pressed', x === b)); zeige(2); });
    $('form', bw).onsubmit = e => { e.preventDefault(); clearInterval(iv); zeige(3);
      $('#bw-zeit').textContent = Math.round((Date.now() - t0) / 1000) + ' Sekunden'; };
    const vor = new URLSearchParams(location.search).get('stelle');
    if (vor) $(`[data-stelle="${vor}"]`, bw)?.click();
  }

  /* Foto-Check: Vorschau lokal, nichts wird hochgeladen */
  const fc = $('#fotocheck');
  if (fc) {
    $$('.fotos input', fc).forEach(inp => inp.onchange = () => {
      const f = inp.files[0], l = inp.closest('label'); if (!f) return;
      const u = URL.createObjectURL(f); l.classList.add('voll'); l.querySelector('span').innerHTML = `<img src="${u}" alt="">`;
      $('#fc-zahl').textContent = $$('.fotos label.voll', fc).length;
    });
    $('form', fc).onsubmit = e => { e.preventDefault(); $('form', fc).hidden = true; $('.fc-danke', fc).hidden = false; };
  }

  /* Stimmen (Beispiele, keine echten Bewertungen) */
  const st = $$('.stimme');
  if (st.length) { let i = 0; st[0].classList.add('an'); setInterval(() => { st[i].classList.remove('an'); i = (i + 1) % st.length; st[i].classList.add('an'); }, 6500); }

  /* Vorher/Nachher-Schieber */
  $$('.schieber').forEach(s => {
    const set = x => { const r = s.getBoundingClientRect(); s.style.setProperty('--s', Math.min(100, Math.max(0, (x - r.left) / r.width * 100)) + '%'); };
    s.addEventListener('pointerdown', e => { set(e.clientX); s.setPointerCapture(e.pointerId); });
    s.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'mouse') set(e.clientX); });
  });
})();

/* Unterseiten-Kopf: Wärmebild-Linse im Hero */
(() => {
  document.querySelectorAll('.u-hero').forEach(h => {
    if (!h.querySelector('.waerme')) return;
    const touch = matchMedia('(hover: none)').matches;
    let x = h.clientWidth * .6, y = h.clientHeight * .45, tx = x, ty = y, man = 0, r = 0;
    const R = () => Math.min(170, Math.max(h.clientWidth, h.clientHeight) * .18);
    h.addEventListener('pointermove', e => { const b = h.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; man = performance.now(); });
    h.addEventListener('pointerdown', e => { const b = h.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; man = performance.now(); });
    const ring = h.querySelector('.u-linse');
    const f = t => {
      if (touch && performance.now() - man > 4000) { tx = h.clientWidth * (.5 + .25 * Math.sin(t / 1900)); ty = h.clientHeight * (.45 + .15 * Math.sin(t / 1300)); }
      x += (tx - x) * .14; y += (ty - y) * .14; r += (R() - r) * .08;
      h.style.setProperty('--lx', x + 'px'); h.style.setProperty('--ly', y + 'px'); h.style.setProperty('--lr', r + 'px');
      if (ring) { ring.style.setProperty('--lpx', x + 'px'); ring.style.setProperty('--lpy', y + 'px'); }
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  });
})();
