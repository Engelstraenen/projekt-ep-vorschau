/* Rundgang-Varianten. Wird VOR app.js geladen (Ersatzbilder müssen vor dem Bild-Binden feststehen). */
(() => {
  const IMG = window.IMG || {};
  const BASE = document.documentElement.dataset.base || '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = t => t * t * (3 - 2 * t);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 4K-Motiv noch nicht da → echtes Originalfoto */
  $$('img[data-fb]').forEach(img => { if (!IMG[img.dataset.img]) img.dataset.img = img.dataset.fb; });

  /* nach app.js: Vollbild-Szenen in voller Auflösung und sofort laden (liegen seitlich/verdeckt) */
  document.addEventListener('DOMContentLoaded', () => {
    $$('.ride__pic img, .scene__pic img').forEach(img => { img.sizes = '(max-aspect-ratio: 1/1) 190vh, 100vw'; img.loading = 'eager'; });
  });

  const progress = el => { const r = el.getBoundingClientRect(); const run = el.offsetHeight - innerHeight; return run > 0 ? clamp(-r.top / run) : 0; };
  const scrollToT = (el, t) => { const top = el.getBoundingClientRect().top + scrollY; scrollTo({ top: top + (el.offsetHeight - innerHeight) * t, behavior: reduce ? 'auto' : 'smooth' }); };

  /* ---------- Variante 1: Die Fahrt ---------- */
  const ride = $('.ride');
  if (ride) {
    const stage = $('.ride__stage', ride), track = $('.ride__track', ride);
    const rooms = $$('.ride__room', ride), dots = $$('.ride__line button', ride);
    const N = rooms.length, LEAD = .8, HOLD = .3; // Haltezeit je Raum (Anteil vor/nach der Mitte)
    let W = stage.clientWidth;
    addEventListener('resize', () => { W = stage.clientWidth; tick(); });
    const pos = s => { // s: Rohwert 0..N-1 → Raumposition mit Haltepunkten
      const i = Math.min(N - 2, Math.floor(s)), f = s - i;
      return i + smooth(clamp((f - HOLD) / (1 - 2 * HOLD)));
    };
    const tick = () => {
      const t = progress(ride);
      const raw = t * (N - 1 + LEAD) - LEAD; // erst Titel, dann Fahrt
      const s = clamp(raw, 0, N - 1), x = pos(s);
      track.style.transform = `translate3d(${(-x * W).toFixed(1)}px,0,0)`;
      const io = 1 - smooth(clamp((raw + LEAD) / (LEAD * .5)));
      stage.style.setProperty('--io', io.toFixed(3));
      stage.style.setProperty('--p', (x / (N - 1)).toFixed(4));
      rooms.forEach((r, i) => {
        const px = clamp(i - x, -1.2, 1.2);
        r.style.setProperty('--px', px.toFixed(4));
        r.style.setProperty('--to', (clamp(1 - Math.abs(px) * 1.6) * (i === 0 ? 1 - io : 1)).toFixed(3));
        const lt = s - i; // lokale Zeit: -HOLD..HOLD = Raum steht still
        if (r.classList.contains('ride__room--split')) {
          const rv = smooth(clamp((lt + HOLD * .8) / (HOLD * 1.6)));
          r.style.setProperty('--r', rv.toFixed(4));
          r.style.setProperty('--so', (rv > .01 && rv < .99 ? 1 : 0));
        }
        const ins = $('.ride__inset', r);
        if (ins) r.style.setProperty('--ins', smooth(clamp((lt + HOLD * .7) / (HOLD * .7))).toFixed(3));
      });
      const cur = Math.round(x);
      dots.forEach((d, i) => d.classList.toggle('is-on', i <= cur));
    };
    dots.forEach((d, i) => d.addEventListener('click', () => scrollToT(ride, (i + LEAD) / (N - 1 + LEAD))));
    addEventListener('scroll', () => requestAnimationFrame(tick), { passive: true });
    tick();
  }

  /* ---------- Variante 2: Tür für Tür ---------- */
  const walk = $('.walk');
  if (walk) {
    const stage = $('.walk__stage', walk), scenes = $$('.scene', walk), N = scenes.length;
    const next = $('.walk__next', walk), nextName = $('.walk__next span', walk);
    /* Türbild auf zwei Flügel verteilen (cover, Fuge exakt in der Mitte) */
    const doorKey = () => (matchMedia('(max-aspect-ratio: 4/5)').matches && IMG['tuer-m']) ? 'tuer-m' : 'tuer';
    const fitDoor = () => {
      const m = IMG[doorKey()];
      if (!m) return;
      const W = stage.clientWidth, H = stage.clientHeight, sc = Math.max(W / m.w, H / m.h), dw = m.w * sc, dh = m.h * sc, x0 = (W - dw) / 2;
      const src = new URL(BASE + (W * devicePixelRatio > m.sw * 1.1 ? m.l : m.s), location.href).href; // absolut, sonst löst CSS den Pfad relativ zur CSS-Datei auf
      stage.style.setProperty('--door', `url("${src}")`);
      stage.style.setProperty('--dw', dw + 'px'); stage.style.setProperty('--dh', dh + 'px');
      stage.style.setProperty('--dx', x0 + 'px'); stage.style.setProperty('--dxr', (x0 - W / 2) + 'px'); stage.style.setProperty('--dy', (H - dh) / 2 + 'px');
    };
    fitDoor(); addEventListener('resize', () => { fitDoor(); tick(); });

    /* Details: Punkt antippen → Karte */
    const closeCards = () => { $$('.card.is-open', walk).forEach(c => c.classList.remove('is-open')); $$('.spot.is-open', walk).forEach(s => { s.classList.remove('is-open'); s.setAttribute('aria-expanded', 'false'); }); };
    $$('.spot', walk).forEach(sp => sp.addEventListener('click', e => {
      e.stopPropagation();
      const card = document.getElementById(sp.dataset.card), was = card.classList.contains('is-open');
      closeCards();
      if (was) return;
      if (innerWidth > 900) {
        const sr = sp.getBoundingClientRect(), st = stage.getBoundingClientRect();
        const left = sr.left - st.left > st.width * .55 ? sr.left - st.left - 300 - 30 : sr.right - st.left + 18;
        card.style.left = clamp(left, 16, st.width - 316) + 'px';
        card.style.top = clamp(sr.top - st.top - 60, 80, st.height - card.offsetHeight - 30) + 'px';
      }
      card.classList.add('is-open'); sp.classList.add('is-open'); sp.setAttribute('aria-expanded', 'true');
    }));
    $$('.card__x', walk).forEach(x => x.addEventListener('click', closeCards));
    stage.addEventListener('click', e => { if (!e.target.closest('.card')) closeCards(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') closeCards(); });

    let active = -1;
    const tick = () => {
      const t = progress(walk), s = t * N, i = Math.min(N - 1, Math.floor(s)), f = s - i;
      stage.style.setProperty('--t', t.toFixed(4));
      if (i !== active) { scenes.forEach((sc, j) => sc.classList.toggle('is-on', j === i)); closeCards(); active = i; }
      // Tür: erste Szene öffnet bei .06–.4, alle anderen öffnen bei 0–.24; außer der letzten schließen alle bei .8–1
      const open = i === 0 ? smooth(clamp((f - .06) / .34)) : smooth(clamp(f / .24));
      const shut = i < N - 1 ? smooth(clamp((f - .8) / .2)) : 0;
      const a = 90 * open * (1 - shut);
      stage.style.setProperty('--a', a.toFixed(2));
      const gap = a / 90;
      stage.style.setProperty('--gl', (gap > 0 && gap < 1 ? Math.sin(gap * Math.PI) * .9 : 0).toFixed(3));
      stage.style.setProperty('--io', (i === 0 ? 1 - smooth(clamp((f - .02) / .16)) : 0).toFixed(3));
      const sc = scenes[i];
      sc.style.setProperty('--z', (1.12 - .12 * smooth(clamp(f / .8))).toFixed(4));
      const ho = smooth(clamp((open - .55) / .4)) * (1 - smooth(clamp(shut / .5)));
      sc.style.setProperty('--ho', ho.toFixed(3));
      const spotsOn = ho > .9 && f < .8;
      sc.style.setProperty('--so', spotsOn ? 1 : 0); sc.style.setProperty('--sp', spotsOn ? 'auto' : 'none');
      if (!spotsOn) closeCards();
      // „Weiter gehen …“ auf den geschlossenen Türen
      const no = i < N - 1 ? smooth(clamp((f - .9) / .08)) : 0;
      const ni = i > 0 ? 1 - smooth(clamp(f / .08)) : 0;
      stage.style.setProperty('--no', Math.max(no, ni).toFixed(3));
      if (nextName) nextName.textContent = (no > ni ? scenes[i + 1] : sc).dataset.name || '';
    };
    addEventListener('scroll', () => requestAnimationFrame(tick), { passive: true });
    tick();
  }
})();
