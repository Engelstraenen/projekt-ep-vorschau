// Clips „Ad Creatives“ (Unterseite leistungen/werbeclips.html#clips): Sparten, Poster mit Play-Knopf, Video lädt erst beim Klick.
// Neue Arbeit hinzufügen = Dateien ablegen + eine Zeile in CLIPS:
//   video/portfolio/<id>-720.mp4 (H.264 720×1280, +faststart, 9:16)
// Pfade gelten ab Website-Wurzel; data-pf am Abschnitt gibt den Weg dorthin an (Unterseite: "../").
//   img/portfolio/<id>-480.avif|webp und <id>-960.avif|webp (Poster bzw. Motiv)
// Leere Sparten bleiben ausgeblendet und erscheinen von selbst, sobald ein Eintrag dazukommt.
// Aufbau (von Eugen gewählt): alle Sparten untereinander, je Überschrift + volle Reihe ihrer Clips im Raster.
(() => {
  const sec = document.querySelector('section.pf[data-pf]');
  if (!sec) return;
  const B = sec.dataset.pf || ''; // Pfad zur Website-Wurzel, auf der Unterseite "../"

  const SPARTEN = [
    { id: 'ugc', name: 'UGC' },
    { id: 'cgi', name: 'CGI' },
    { id: 'motion', name: 'Motion Graphics' },
    { id: 'static', name: 'Static Ads' },        // typ: 'bild' – Motiv ohne Video
    { id: 'fashion', name: 'Fashion- & Lookbook-Film' },
    { id: 'effekte', name: 'Effekte' },
  ];
  const CLIPS = [
    { id: 'ugc-spruz', sparte: 'ugc', titel: 'Gründerin dreht Werbung selbst', zweck: 'UGC-Clip für das Trockenshampoo SPRUZ.', dauer: 9.13 },
    { id: 'ugc-knista', sparte: 'ugc', titel: 'Omi testet jetzt ASMR', zweck: 'UGC-Clip für die Paprika-Chips KNISTA.', dauer: 9.03 },
    { id: 'ugc-mochimi', sparte: 'ugc', titel: 'Kalle, 72, testet Beauty', zweck: 'UGC-Clip für die Glow Sheet Mask MOCHIMI.', dauer: 9.1 },
    { id: 'schlumma', sparte: 'cgi', titel: 'So weich, wie dein Montag sein sollte.', zweck: 'CGI-Spot für SCHLUMMA: eine ultraweiche Couch im Zugabteil.', dauer: 8.83 },
    { id: 'motion-zitra', sparte: 'motion', titel: 'Durst? Drei Sorten. Null Langeweile.', zweck: 'Motion-Graphics-Spot für die Limonade ZITRA.', dauer: 12 },
    { id: 'motion-lindholz', sparte: 'motion', titel: 'Erst eine Linie. Dann ein Plan. Dann Holz.', zweck: 'Motion-Graphics-Spot für Lindholz, Möbel nach Maß.', dauer: 13 },
    { id: 'blattfon', sparte: 'motion', titel: 'Na also. Geht doch.', zweck: 'Motion-Graphics-Spot für die Gieß-App BLATTFON, mit sprechender Pflanze.', dauer: 8.83 },
    { id: 'aboschere', sparte: 'motion', titel: '14 Abos bezahlt. Nur 3 genutzt.', zweck: 'Motion-Graphics-Spot für ABOSCHERE: kündigt ungenutzte Abos.', dauer: 9.7 },
    { id: 'fleckfee', sparte: 'static', titel: 'Ein Blatt, Fleck weg.', zweck: 'Static Ad als Motion-Version für das Waschblatt FLECKFEE gegen Flecken.', dauer: 7.21 },
    { id: 'kajuete', sparte: 'fashion', titel: 'Gegen Wind hilft nur eins: der richtige Mantel.', zweck: 'Mantel-Lookbook für KAJÜTE auf dem Fährdeck.', dauer: 8.83 },
    { id: 'velournacht', sparte: 'fashion', titel: 'Feinwäsche. Wie ich.', zweck: 'Fashion-Film für VELOURNACHT: Samtanzug im Waschsalon.', dauer: 8.83 },
    { id: 'effekte-showreel', sparte: 'effekte', titel: '17 Effekte für Short-Form-Videos', zweck: 'Showreel mit 17 Videoeffekten für Short-Form-Ads.', dauer: 42.5, ton: false },
  ];

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
  };
  const picture = (id, sizes, eager) => `<picture>` +
    `<source type="image/avif" srcset="${B}img/portfolio/${id}-480.avif 480w, ${B}img/portfolio/${id}-960.avif 960w" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${B}img/portfolio/${id}-480.webp 480w, ${B}img/portfolio/${id}-960.webp 960w" sizes="${sizes}">` +
    `<img src="${B}img/portfolio/${id}-480.webp" width="480" height="853" alt="" ${eager ? 'fetchpriority="low"' : 'loading="lazy"'} decoding="async"></picture>`;
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
  const groups = sec.querySelector('.pf-groups');
  groups.innerHTML = SPARTEN.map((s) => {
    const list = CLIPS.filter((c) => c.sparte === s.id);
    return `<section class="pf-group" data-sparte="${s.id}" aria-labelledby="pf-g-${s.id}"${list.length ? '' : ' hidden'}>` +
      `<div class="pf-group-head"><h3 id="pf-g-${s.id}">${esc(s.name)}</h3><span class="pf-count">${list.length} ${list.length === 1 ? 'Arbeit' : 'Arbeiten'}</span></div>` +
      `<ul class="pf-row" data-lenis-prevent-horizontal>` + list.map((c) => `<li class="pf-card" data-id="${c.id}" data-sparte="${c.sparte}">${media(c, '(max-width: 860px) 46vw, 240px')}${caption(c)}</li>`).join('') + `</ul></section>`;
  }).join('');
  sec.dataset.ready = '';

  // ---------- Player ----------
  let soundOn = true, current = null;
  const setHold = () => { window.__pfHold = lowPower && !!current && !current.v.paused; };
  // Karten sind höchstens ~260 px breit: 720p ist auch auf Retina-Displays scharf genug
  const srcFor = (box) => `${B}video/portfolio/${box.closest('[data-id]').dataset.id}-720.mp4`;
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
      if (box.dataset.state === 'playing' || box.dataset.state === 'loading' && !v.paused) p.pause(); else p.play();
    });
    snd?.addEventListener('click', () => { soundOn = !soundOn; applySound(); });
    new IntersectionObserver(([e]) => { if (!e.isIntersecting && !v.paused) v.pause(); }, { threshold: .25 }).observe(box);
    box._p = p;
    return p;
  }
  sec.querySelectorAll('.pf-media:not(.is-bild)').forEach(wire);

  window.__pf = { CLIPS, SPARTEN, used: used.map((s) => s.id), players: () => [...sec.querySelectorAll('.pf-media')].map((m) => m._p).filter(Boolean) };
})();
