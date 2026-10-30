// Portfolio „Ad Creatives“: Sparten, Poster mit Play-Knopf, Video lädt erst beim Klick.
// Neue Arbeit hinzufügen = Dateien ablegen + eine Zeile in CLIPS:
//   video/portfolio/<id>-720.mp4 und <id>-1080.mp4 (H.264, +faststart, 9:16)
//   img/portfolio/<id>-480.avif|webp und <id>-960.avif|webp (Poster bzw. Motiv)
// Leere Sparten bleiben ausgeblendet und erscheinen von selbst, sobald ein Eintrag dazukommt.
// Layout-Variante per Klasse am Abschnitt: pf--a (Raster mit Reitern), pf--b (Karussell je Sparte), pf--c (Feature + Thumbnails).
// Vorschau ohne Code-Änderung: ?pf=a|b|c
(() => {
  const sec = document.getElementById('portfolio');
  if (!sec) return;

  const SPARTEN = [
    { id: 'ugc', name: 'UGC' },
    { id: 'cgi', name: 'CGI' },
    { id: 'motion', name: 'Motion Graphics' },
    { id: 'static', name: 'Static Ads' },        // typ: 'bild' – Motiv ohne Video
    { id: 'fashion', name: 'Fashion- & Lookbook-Film' },
    { id: 'effekte', name: 'Effekte' },
  ];
  const CLIPS = [
    { id: 'ugc-spruz', sparte: 'ugc', titel: 'Gründerin dreht Werbung selbst', zweck: 'UGC-Clip für das Trockenshampoo SPRUZ.', dauer: 7.6 },
    { id: 'ugc-knista', sparte: 'ugc', titel: 'Omi testet jetzt ASMR', zweck: 'UGC-Clip für die Paprika-Chips KNISTA.', dauer: 7.5 },
    { id: 'ugc-mochimi', sparte: 'ugc', titel: 'Kalle, 72, testet Beauty', zweck: 'UGC-Clip für die Glow Sheet Mask MOCHIMI.', dauer: 7.57 },
    { id: 'motion-zitra', sparte: 'motion', titel: 'Durst? Drei Sorten. Null Langeweile.', zweck: 'Motion-Graphics-Spot für die Limonade ZITRA.', dauer: 12 },
    { id: 'motion-lindholz', sparte: 'motion', titel: 'Erst eine Linie. Dann ein Plan. Dann Holz.', zweck: 'Motion-Graphics-Spot für Lindholz, Möbel nach Maß.', dauer: 13 },
    { id: 'effekte-showreel', sparte: 'effekte', titel: '17 Effekte für Short-Form-Videos', zweck: 'Showreel mit 17 Videoeffekten für Short-Form-Ads.', dauer: 42.5, ton: false },
  ];

  const q = new URLSearchParams(location.search).get('pf');
  if (/^[abc]$/.test(q || '')) { sec.classList.remove('pf--a', 'pf--b', 'pf--c'); sec.classList.add('pf--' + q); }
  const variant = () => (sec.classList.contains('pf--c') ? 'c' : sec.classList.contains('pf--b') ? 'b' : 'a');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = matchMedia('(max-width: 860px), (pointer: coarse)').matches;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mmss = (s) => { s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const sparteName = (id) => SPARTEN.find((s) => s.id === id)?.name || id;
  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 8 5.2z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    on: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.2L11.5 6v12l-4.3-3.5H4z" fill="currentColor"/><path d="M15 9.2a4 4 0 0 1 0 5.6M17.6 6.8a7.4 7.4 0 0 1 0 10.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    off: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.2L11.5 6v12l-4.3-3.5H4z" fill="currentColor"/><path d="m15.5 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  const picture = (id, sizes, eager) => `<picture>` +
    `<source type="image/avif" srcset="img/portfolio/${id}-480.avif 480w, img/portfolio/${id}-960.avif 960w" sizes="${sizes}">` +
    `<source type="image/webp" srcset="img/portfolio/${id}-480.webp 480w, img/portfolio/${id}-960.webp 960w" sizes="${sizes}">` +
    `<img src="img/portfolio/${id}-480.webp" width="480" height="853" alt="" ${eager ? 'fetchpriority="low"' : 'loading="lazy"'} decoding="async"></picture>`;
  const media = (c, sizes, eager) => {
    const bild = c.typ === 'bild', ton = c.ton !== false;
    return `<div class="pf-media${bild ? ' is-bild' : ''}">${picture(c.id, sizes, eager)}` +
      (bild ? '' : `<video preload="none" playsinline webkit-playsinline disablepictureinpicture disableremoteplayback aria-label="${esc(c.titel)}"></video>` +
      `<button type="button" class="pf-play" aria-label="Video abspielen: ${esc(c.titel)}"><span class="pf-play-ic">${ICON.play}</span></button>` +
      (ton ? `<button type="button" class="pf-sound" aria-label="Ton ausschalten" aria-pressed="true">${ICON.on}</button>` : '<span class="pf-mute-note">Ohne Ton</span>') +
      `<span class="pf-dur">${mmss(c.dauer)}</span><span class="pf-bar" aria-hidden="true"><i></i></span>`) + `</div>`;
  };
  const caption = (c, tag = 'h4') => `<div class="pf-txt"><small class="pf-sparte">${esc(sparteName(c.sparte))}</small><${tag} class="pf-title">${esc(c.titel)}</${tag}><p class="pf-zweck">${esc(c.zweck)}</p></div>`;

  // ---------- Aufbau ----------
  const used = SPARTEN.filter((s) => CLIPS.some((c) => c.sparte === s.id));
  const tabs = sec.querySelector('.pf-tabs'), groups = sec.querySelector('.pf-groups'), feature = sec.querySelector('.pf-feature');
  tabs.innerHTML = `<button type="button" aria-pressed="true" data-f="alle">Alle <span>${CLIPS.length}</span></button>` +
    SPARTEN.map((s) => { const n = CLIPS.filter((c) => c.sparte === s.id).length; return `<button type="button" aria-pressed="false" data-f="${s.id}"${n ? '' : ' hidden'}>${esc(s.name)} <span>${n}</span></button>`; }).join('');
  groups.innerHTML = SPARTEN.map((s) => {
    const list = CLIPS.filter((c) => c.sparte === s.id);
    return `<section class="pf-group" data-sparte="${s.id}" aria-labelledby="pf-g-${s.id}"${list.length ? '' : ' hidden'}>` +
      `<div class="pf-group-head"><h3 id="pf-g-${s.id}">${esc(s.name)}</h3><span class="pf-count">${list.length} ${list.length === 1 ? 'Arbeit' : 'Arbeiten'}</span>` +
      `<span class="pf-arrows"><button type="button" class="pf-arrow" data-dir="-1" aria-label="${esc(s.name)}: zurück">${ICON.prev}</button><button type="button" class="pf-arrow" data-dir="1" aria-label="${esc(s.name)}: weiter">${ICON.next}</button></span></div>` +
      `<ul class="pf-row" data-lenis-prevent-horizontal>` + list.map((c) => `<li class="pf-card" data-id="${c.id}" data-sparte="${c.sparte}">${media(c, '(max-width: 860px) 62vw, 280px')}${caption(c)}</li>`).join('') + `</ul></section>`;
  }).join('');
  const first = CLIPS[0];
  feature.innerHTML = `<div class="pf-feature-in" data-id="${first.id}">${media(first, '(max-width: 860px) 80vw, 440px', true)}${caption(first, 'p')}</div>`;
  sec.dataset.ready = '';

  // ---------- Player ----------
  let soundOn = true, current = null;
  const setHold = () => { window.__pfHold = lowPower && !!current && !current.v.paused; };
  function srcFor(box) { // 720p reicht für Karten und Handys, 1080p nur für große Darstellung auf scharfen Bildschirmen
    const big = box.clientWidth * Math.min(devicePixelRatio || 1, 2) > 760 && !navigator.connection?.saveData;
    return `video/portfolio/${box.closest('[data-id]').dataset.id}-${big ? 1080 : 720}.mp4`;
  }
  function wire(box) {
    if (box._p) return box._p;
    const v = box.querySelector('video'), btn = box.querySelector('.pf-play'), ic = box.querySelector('.pf-play-ic'), snd = box.querySelector('.pf-sound'), bar = box.querySelector('.pf-bar i');
    const titel = v.getAttribute('aria-label');
    let raf = 0;
    const tick = () => { if (v.duration) bar.style.transform = `scaleX(${(v.currentTime / v.duration).toFixed(4)})`; raf = v.paused ? 0 : requestAnimationFrame(tick); };
    const state = (s) => { box.dataset.state = s; ic.innerHTML = s === 'playing' ? ICON.pause : s === 'ended' ? ICON.replay : ICON.play; btn.setAttribute('aria-label', (s === 'playing' ? 'Pause: ' : s === 'ended' ? 'Nochmal abspielen: ' : 'Video abspielen: ') + titel); };
    const applySound = () => { if (!snd) { v.muted = true; return; } v.muted = !soundOn; snd.innerHTML = soundOn ? ICON.on : ICON.off; snd.setAttribute('aria-pressed', String(soundOn)); snd.setAttribute('aria-label', soundOn ? 'Ton ausschalten' : 'Ton einschalten'); };
    v.addEventListener('playing', () => { state('playing'); if (!raf) raf = requestAnimationFrame(tick); setHold(); });
    v.addEventListener('waiting', () => { if (!v.paused) box.dataset.state = 'loading'; });
    v.addEventListener('pause', () => { if (!v.ended) state('paused'); setHold(); });
    v.addEventListener('ended', () => { state('ended'); bar.style.transform = 'scaleX(1)'; setHold(); });
    v.addEventListener('error', () => { if (!v.getAttribute('src')) return; box.dataset.state = 'error'; btn.setAttribute('aria-label', 'Video konnte nicht geladen werden'); setHold(); });
    const p = {
      box, v,
      play() {
        if (current && current !== p) current.pause();
        current = p;
        const src = srcFor(box);
        if (v.getAttribute('src') !== src) { v.src = src; } // erst jetzt lädt das Video (preload none)
        if (v.ended) v.currentTime = 0;
        applySound();
        box.dataset.state = 'loading';
        const pr = v.play();
        if (pr) pr.catch(() => { // Browser blockt Ton ohne Geste: stumm weiterversuchen
          if (!v.muted) { v.muted = true; soundOn = false; applySound(); v.play().catch(() => state('paused')); } else state('paused');
        });
      },
      pause() { v.pause(); },
      reset() { v.pause(); v.removeAttribute('src'); v.load(); delete box.dataset.state; ic.innerHTML = ICON.play; bar.style.transform = 'scaleX(0)'; },
      applySound,
    };
    btn.addEventListener('click', () => {
      if (variant() === 'c' && !box.closest('.pf-feature')) return toFeature(box.closest('.pf-card').dataset.id, true);
      if (box.dataset.state === 'playing' || box.dataset.state === 'loading' && !v.paused) p.pause(); else p.play();
    });
    snd?.addEventListener('click', () => { soundOn = !soundOn; applySound(); });
    new IntersectionObserver(([e]) => { if (!e.isIntersecting && !v.paused) v.pause(); }, { threshold: .25 }).observe(box);
    box._p = p;
    return p;
  }
  sec.querySelectorAll('.pf-media:not(.is-bild)').forEach(wire);

  // ---------- Variante C: Feature-Video + Thumbnails ----------
  function toFeature(id, autoplay) {
    const c = CLIPS.find((x) => x.id === id); if (!c) return;
    const old = feature.querySelector('.pf-feature-in');
    old.querySelector('.pf-media')._p?.reset();
    if (current && current.box === old.querySelector('.pf-media')) current = null;
    const nu = document.createElement('div'); nu.className = 'pf-feature-in'; nu.dataset.id = id;
    nu.innerHTML = media(c, '(max-width: 860px) 80vw, 440px', true) + caption(c, 'p');
    old.replaceWith(nu);
    sec.querySelectorAll('.pf-card').forEach((k) => k.classList.toggle('is-active', k.dataset.id === id));
    const p = nu.querySelector('.pf-media:not(.is-bild)') && wire(nu.querySelector('.pf-media'));
    if (!reduced) nu.animate([{ opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
    if (autoplay && p) p.play();
    if (matchMedia('(max-width: 860px)').matches) { const r = feature.getBoundingClientRect(); if (r.top < 64 || r.top > innerHeight * .5) scrollBy({ top: r.top - 80, behavior: reduced ? 'auto' : 'smooth' }); }
  }
  sec.querySelectorAll('.pf-card').forEach((k) => k.classList.toggle('is-active', k.dataset.id === first.id));

  // ---------- Variante A: Sparten-Reiter ----------
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-f]'); if (!b) return;
    const f = b.dataset.f;
    tabs.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (current && !current.v.paused) current.pause();
    let i = 0;
    sec.querySelectorAll('.pf-card').forEach((k) => {
      const on = f === 'alle' || k.dataset.sparte === f;
      k.classList.toggle('is-out', !on);
      if (on && !reduced) k.animate([{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 240, delay: 40 * i++, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' });
    });
  });

  // ---------- Variante B: Pfeile am Karussell ----------
  sec.querySelectorAll('.pf-group').forEach((g) => {
    const row = g.querySelector('.pf-row'), arrows = [...g.querySelectorAll('.pf-arrow')];
    const upd = () => { const max = row.scrollWidth - row.clientWidth - 2; arrows[0].disabled = row.scrollLeft <= 2; arrows[1].disabled = row.scrollLeft >= max; g.classList.toggle('is-scrollable', max > 2); };
    arrows.forEach((a) => a.addEventListener('click', () => { const card = row.querySelector('.pf-card'); row.scrollBy({ left: +a.dataset.dir * ((card?.offsetWidth || 260) + 16), behavior: reduced ? 'auto' : 'smooth' }); }));
    row.addEventListener('scroll', upd, { passive: true });
    new ResizeObserver(upd).observe(row);
  });

  window.__pf = { CLIPS, SPARTEN, variant, used: used.map((s) => s.id), players: () => [...sec.querySelectorAll('.pf-media')].map((m) => m._p).filter(Boolean) };
})();
