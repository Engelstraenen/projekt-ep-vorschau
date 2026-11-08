// Clips „Ad Creatives“ (Unterseite leistungen/werbeclips.html#clips): Sparten, Poster mit Play-Knopf, Video lädt erst beim Klick.
// Neue Arbeit hinzufügen = Dateien ablegen + eine Zeile in CLIPS:
//   video/portfolio/<id>-720.mp4 (H.264 720×1280, +faststart, 9:16; mit quer: true 1280×720, 16:9, eigene Reihe)
//   mit hd: true stattdessen volle Auflösung: <id>-1440.webm (AV1 10 bit + Opus, bevorzugt) und <id>-1440.mp4 (H.264, Rückfall);
//   hd: 1080 entsprechend <id>-1080.webm/.mp4 (Original ist 1080p)
// Pfade gelten ab Website-Wurzel; data-pf am Abschnitt gibt den Weg dorthin an (Unterseite: "../").
//   img/portfolio/<id>-480.avif|webp und <id>-960.avif|webp (Poster bzw. Motiv)
// Leere Sparten bleiben ausgeblendet und erscheinen von selbst, sobald ein Eintrag dazukommt.
// Kennzeichnung: jede Karte trägt das Label „Inspiration“ am Video; Clips mit erfundener Marke (Standard, fiktiv:false = keine Marke)
//   zeigen über dem Titel „Inspiration · erfundene Marke“. Die Clips dürfen nie wie echte Kundenprojekte wirken.
// Aufbau (von Eugen gewählt): alle Sparten untereinander, je Überschrift + volle Reihe ihrer Clips im Raster.
(() => {
  const sec = document.querySelector('section.pf[data-pf]');
  if (!sec) return;
  const B = sec.dataset.pf || ''; // Pfad zur Website-Wurzel, auf der Unterseite "../"

  // label = Rubrik-Label (blau, „01 · UGC-Ads“), h = Rubrik-Überschrift, lead = was die Sparte ist und was sie besonders macht
  const SPARTEN = [
    { id: 'viral', name: 'Virale Ads', label: 'Virale Ads', h: 'Clips, die man weiterleitet.', lead: 'Kurze Filme mit einem starken ersten Moment, die im Feed halten und zum Mitreden einladen.' },
    { id: 'ugc', name: 'UGC', label: 'UGC-Ads', h: 'Echte Gesichter, echter Alltag.', lead: 'Clips im Stil echter Nutzer: nahbar, mit Untertiteln und in Sekunden erklärt.' },
    { id: 'cgi', name: 'CGI', label: 'CGI-Ads', h: 'Das Produkt in einer eigenen Welt.', lead: 'Computergenerierte Bilder, die so kaum zu drehen wären und im Feed hängen bleiben.' },
    { id: 'motion', name: 'Motion Graphics', label: 'Motion Graphics', h: 'Auf den Punkt animiert.', lead: 'Bewegte Formen und Schrift machen auch Erklärungsbedürftiges sofort verständlich.' },
    { id: 'static', name: 'Static Ads', label: 'Static Ads', h: 'Ein Motiv, das sofort wirkt.', lead: 'Starke Einzelmotive und Carousels, auf Wunsch mit bewegter Version für Story und Reels.' },        // typ: 'bild' – Motiv ohne Video
    { id: 'fashion', name: 'Fashion- & Lookbook-Film', label: 'Fashion & Lookbook', h: 'Mode mit einer kleinen Geschichte.', lead: 'Kurze Filme, die Kleidung in Szene setzen, für jede Plattform im passenden Format.' },
  ];
  const CLIPS = [
    { id: 'viral-friseur', sparte: 'viral', titel: 'Friseur', zweck: 'Viraler Clip für den erfundenen Salon Schnittwerk: ein Haarschnitt mit Pointe.', dauer: 10, hd: 1080, av1: false },
    { id: 'studio', sparte: 'viral', titel: 'Studio', zweck: 'Ein Blick ins Studio von PROJEKT EX — ein Clip, der im Feed hält und zum Mitreden einlädt.', dauer: 25.4, hd: 1080, fiktiv: false },
    { id: 'ugc-spruz', sparte: 'ugc', titel: 'Gründerin dreht Werbung selbst', zweck: 'UGC-Clip für SPRUZ, ein erfundenes Trockenshampoo.', dauer: 9.13 },
    { id: 'ugc-knista', sparte: 'ugc', titel: 'Omi testet jetzt ASMR', zweck: 'UGC-Clip für KNISTA, erfundene Paprika-Chips.', dauer: 9.03 },
    { id: 'ugc-mochimi', sparte: 'ugc', titel: 'Kalle, 72, testet Beauty', zweck: 'UGC-Clip für MOCHIMI, eine erfundene Glow Sheet Mask.', dauer: 9.1 },
    { id: 'spot-kleinfeld', sparte: 'ugc', quer: true, titel: 'Kleinfeld Haustechnik', zweck: 'Image-Spot für einen Kölner Handwerksbetrieb.', dauer: 20 },
    { id: 'schlumma', sparte: 'cgi', titel: 'So weich, wie dein Montag sein sollte.', zweck: 'CGI-Spot für die erfundene Marke SCHLUMMA: eine ultraweiche Couch im Zugabteil.', dauer: 8.83 },
    { id: 'cgi-polar-husky', sparte: 'cgi', quer: true, hd: true, titel: 'POLAR · Husky', zweck: 'CGI-Spot für POLAR: Eine Dose öffnet sich, und die Küche versinkt mit einem Husky-Welpen im Schnee.', dauer: 10.14 },
    { id: 'cgi-polar-office', sparte: 'cgi', quer: true, hd: true, titel: 'POLAR · Office', zweck: 'CGI-Spot für POLAR: Ein heißer Büronachmittag, ein Schluck, und der ganze Arbeitsplatz friert ein.', dauer: 10.14 },
    { id: 'cgi-kleinfeld', sparte: 'cgi', quer: true, hd: 1080, titel: 'Kleinfeld Haustechnik', zweck: 'Image-Film für einen Kölner Haustechnik-Betrieb: Elektrik, Sanitär und Heizung aus einer Hand.', dauer: 19.96 },
    { id: 'cgi-lindner-kruse', sparte: 'cgi', quer: true, hd: 1080, titel: 'Lindner & Kruse Steuerberatung', zweck: 'Image-Film für eine Frankfurter Steuerkanzlei: klar, verlässlich und persönlich.', dauer: 25 },
    { id: 'cgi-hartmann', sparte: 'cgi', quer: true, hd: 1080, titel: 'Autoservice Hartmann', zweck: 'Image-Film für eine Hamburger Kfz-Werkstatt: Inspektion, Reparatur und HU/AU.', dauer: 15 },
    { id: 'cgi-katze', sparte: 'cgi', quer: true, hd: true, titel: 'FAUCH · Spiegelbild', zweck: 'CGI-Spot für das erfundene Streetwear-Label FAUCH: Ein Kätzchen trifft auf das fauchende Motiv-Shirt und macht vorsichtshalber einen Buckel.', dauer: 10.04 },
    { id: 'motion-zitra', sparte: 'motion', titel: 'Durst? Drei Sorten. Null Langeweile.', zweck: 'Motion-Graphics-Spot für ZITRA, eine erfundene Limonade.', dauer: 12 },
    { id: 'motion-lindholz', sparte: 'motion', titel: 'Erst eine Linie. Dann ein Plan. Dann Holz.', zweck: 'Motion-Graphics-Spot für Lindholz, eine erfundene Tischlerei für Möbel nach Maß.', dauer: 13 },
    { id: 'blattfon', sparte: 'motion', titel: 'Na also. Geht doch.', zweck: 'Motion-Graphics-Spot für BLATTFON, eine erfundene Gieß-App, mit sprechender Pflanze.', dauer: 8.83 },
    { id: 'aboschere', sparte: 'motion', titel: '14 Abos bezahlt. Nur 3 genutzt.', zweck: 'Motion-Graphics-Spot für ABOSCHERE, eine erfundene App, die ungenutzte Abos kündigt.', dauer: 9.7 },
    { id: 'fleckfee', sparte: 'static', titel: 'Ein Blatt, Fleck weg.', zweck: 'Static Ad als Motion-Version für FLECKFEE, ein erfundenes Waschblatt gegen Flecken.', dauer: 7.21 },
    { id: 'feierwarm', sparte: 'static', titel: 'Heiß bis Feierabend.', zweck: 'Static Ad als Motion-Version für FEIERWARM, ein erfundener Thermobecher.', dauer: 8.51 },
    { id: 'durchblix', sparte: 'static', titel: 'Reinkommen. Und klar sehen.', zweck: 'Static Ad als Motion-Version für DURCHBLIX, ein erfundenes Antibeschlag-Spray für Brillen.', dauer: 8.51 },
    { id: 'kajuete', sparte: 'fashion', titel: 'Gegen Wind hilft nur eins: der richtige Mantel.', zweck: 'Mantel-Lookbook für das erfundene Label KAJÜTE, auf dem Fährdeck.', dauer: 8.83 },
    { id: 'velournacht', sparte: 'fashion', titel: 'Feinwäsche. Wie ich.', zweck: 'Fashion-Film für das erfundene Label VELOURNACHT: Samtanzug im Waschsalon.', dauer: 8.83 },
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
  const picture = (id, sizes, eager, quer) => `<picture>` +
    `<source type="image/avif" srcset="${B}img/portfolio/${id}-480.avif 480w, ${B}img/portfolio/${id}-960.avif 960w" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${B}img/portfolio/${id}-480.webp 480w, ${B}img/portfolio/${id}-960.webp 960w" sizes="${sizes}">` +
    `<img src="${B}img/portfolio/${id}-480.webp" width="480" height="${quer ? 270 : 853}" alt="" ${eager ? 'fetchpriority="low"' : 'loading="lazy"'} decoding="async"></picture>`;
  const media = (c, sizes, eager) => {
    const bild = c.typ === 'bild', ton = c.ton !== false;
    return `<div class="pf-media${bild ? ' is-bild' : ''}${c.quer ? ' is-quer' : ''}">${picture(c.id, sizes, eager, c.quer)}<span class="pf-insp">Inspiration</span>` +
      (bild ? '' : `<video preload="none" muted loop playsinline webkit-playsinline disablepictureinpicture disableremoteplayback aria-label="${esc(c.titel)}"></video>` +
      `<button type="button" class="pf-play" aria-label="Video abspielen: ${esc(c.titel)}"><span class="pf-play-ic">${ICON.play}</span></button>` +
      (ton ? `<button type="button" class="pf-sound" aria-label="Ton an: Video von vorn mit Ton abspielen" aria-pressed="false"><span aria-hidden="true">🔊</span> Ton an</button>` : '<span class="pf-mute-note">Ohne Ton</span>') +
      `<span class="pf-dur">${mmss(c.dauer)}</span><span class="pf-bar" aria-hidden="true"><i></i></span>`) + `</div>`;
  };
  const caption = (c, tag = 'h4') => `<div class="pf-txt"><small class="pf-sparte">${c.fiktiv === false ? 'Inspiration · ' + esc(sparteName(c.sparte)) : 'Inspiration · erfundene Marke'}</small><${tag} class="pf-title">${esc(c.titel)}</${tag}><p class="pf-zweck">${esc(c.zweck)}</p></div>`;

  // ---------- Aufbau ----------
  const used = SPARTEN.filter((s) => CLIPS.some((c) => c.sparte === s.id));
  const groups = sec.querySelector('.pf-groups');
  let nr = 0;
  groups.innerHTML = SPARTEN.map((s) => {
    const list = CLIPS.filter((c) => c.sparte === s.id);
    nr += list.length ? 1 : 0;
    // Rubrik (assets/themen.css .rb): Linie, Nummer + Label, Überschrift, Kurztext, dann die Clips
    return `<section class="pf-group rb" id="sparte-${s.id}" data-sparte="${s.id}" aria-labelledby="pf-g-${s.id}"${list.length ? '' : ' hidden'}>` +
      `<header class="pf-group-head rb-head"><p class="rb-label"><span class="rb-nr">${String(nr).padStart(2, '0')}</span><span class="rb-dot" aria-hidden="true"> · </span>${esc(s.label || s.name)}</p>` +
      `<h2 id="pf-g-${s.id}" class="rb-h">${esc(s.h || s.name)}</h2>${s.lead ? `<p class="rb-lead">${esc(s.lead)}</p>` : ''}<span class="pf-count">${list.length} ${list.length === 1 ? 'Beispiel' : 'Beispiele'}</span></header>` +
      `<ul class="pf-row" data-lenis-prevent-horizontal>` + list.filter((c) => !c.quer).map((c) => `<li class="pf-card" data-id="${c.id}" data-sparte="${c.sparte}">${media(c, '(max-width: 860px) 46vw, 240px')}${caption(c)}</li>`).join('') + `</ul>` +
      // 16:9-Spots (quer: true): eigene zweispaltige Reihe unter den 9:16-Kacheln, ohne Beschnitt
      (list.some((c) => c.quer) ? `<ul class="pf-row pf-row-quer">` + list.filter((c) => c.quer).map((c) => `<li class="pf-card pf-card-quer" data-id="${c.id}" data-sparte="${c.sparte}">${media(c, '(max-width: 860px) 92vw, 640px')}${caption(c)}</li>`).join('') + `</ul>` : '') + `</section>`;
  }).join('');
  sec.dataset.ready = '';

  // ---------- Player ----------
  let soundOn = false, current = null; // Start stumm (Autoplay); „Ton an“ startet von vorn mit Ton
  const RMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const setHold = () => { window.__pfHold = lowPower && !!current && !current.v.paused; };
  // Karten sind höchstens ~260 px breit: 720p ist auch auf Retina-Displays scharf genug.
  // hd-Clips laufen in voller 1440p-Auflösung: AV1 (WebM), wenn der Browser es flüssig (auf Handys stromsparend) dekodiert, sonst H.264.
  const AV1 = 'video/webm; codecs="av01.0.12M.10, opus"';
  let av1 = false;
  if (document.createElement('video').canPlayType(AV1) === 'probably') {
    if (navigator.mediaCapabilities?.decodingInfo) {
      navigator.mediaCapabilities.decodingInfo({ type: 'file', video: { contentType: 'video/webm; codecs="av01.0.12M.10"', width: 2560, height: 1440, bitrate: 2500000, framerate: 24 } })
        .then((i) => { av1 = i.supported && i.smooth && (i.powerEfficient || !lowPower); }, () => {});
    } else av1 = !lowPower;
  }
  const srcFor = (box) => {
    const id = box.closest('[data-id]').dataset.id;
    if (!CLIPS.find((c) => c.id === id)?.hd) return `${B}video/portfolio/${id}-720.mp4`;
    const h = CLIPS.find((c) => c.id === id).hd === true ? 1440 : CLIPS.find((c) => c.id === id).hd; // hd: true = 1440p, sonst Zahl (z. B. 1080)
    return `${B}video/portfolio/${id}-${h}.${av1 && !box._noAv1 && CLIPS.find((c) => c.id === id).av1 !== false ? 'webm' : 'mp4'}`;
  };
  function wire(box) {
    if (box._p) return box._p;
    const v = box.querySelector('video'), btn = box.querySelector('.pf-play'), ic = box.querySelector('.pf-play-ic'), snd = box.querySelector('.pf-sound'), bar = box.querySelector('.pf-bar i');
    const titel = v.getAttribute('aria-label');
    let raf = 0;
    const tick = () => { if (v.duration) bar.style.transform = `scaleX(${(v.currentTime / v.duration).toFixed(4)})`; raf = v.paused ? 0 : requestAnimationFrame(tick); };
    const state = (s) => { box.dataset.state = s; ic.innerHTML = s === 'playing' ? ICON.pause : s === 'ended' ? ICON.replay : ICON.play; btn.setAttribute('aria-label', (s === 'playing' ? 'Pause: ' : s === 'ended' ? 'Nochmal abspielen: ' : 'Video abspielen: ') + titel); };
    let snd1 = false; // Ton je Karte
    v.muted = true; v.loop = true;
    const applySound = () => { if (!snd) { v.muted = true; return; } v.muted = !snd1; snd.innerHTML = snd1 ? '<span aria-hidden="true">🔇</span> Ton aus' : '<span aria-hidden="true">🔊</span> Ton an'; snd.setAttribute('aria-pressed', String(snd1)); snd.setAttribute('aria-label', snd1 ? 'Ton ausschalten' : 'Ton an: Video von vorn mit Ton abspielen'); };
    v.addEventListener('playing', () => { state('playing'); if (!raf) raf = requestAnimationFrame(tick); setHold(); });
    v.addEventListener('waiting', () => { if (!v.paused) box.dataset.state = 'loading'; });
    v.addEventListener('pause', () => { if (!v.ended) state('paused'); setHold(); });
    v.addEventListener('ended', () => { state('ended'); bar.style.transform = 'scaleX(1)'; setHold(); });
    v.addEventListener('error', () => {
      if (!v.getAttribute('src')) return;
      if (/\.webm$/.test(v.getAttribute('src'))) { box._noAv1 = true; v.src = srcFor(box); v.play().catch(() => state('paused')); return; } // AV1 klappt doch nicht: H.264
      box.dataset.state = 'error'; btn.setAttribute('aria-label', 'Video konnte nicht geladen werden'); setHold(); });
    const p = {
      box, v,
      play() {
        if (current && current !== p && !current.v.muted) current.pause(); // nur ein Clip mit Ton gleichzeitig
        current = p;
        const src = srcFor(box);
        if (v.getAttribute('src') !== src) { v.src = src; } // erst jetzt lädt das Video (preload none)
        if (v.ended) v.currentTime = 0;
        applySound();
        box.dataset.state = 'loading';
        const pr = v.play();
        if (pr) pr.catch(() => { // Browser blockt Ton ohne Geste: stumm weiterversuchen
          if (!v.muted) { snd1 = false; applySound(); v.play().catch(() => state('paused')); } else state('paused');
        });
      },
      pause() { v.pause(); },
      auto() { // stummes Autoplay, solange sichtbar
        const src = srcFor(box); if (v.getAttribute('src') !== src) v.src = src;
        applySound(); v.play().catch(() => {});
      },
      reset() { v.pause(); v.removeAttribute('src'); v.load(); delete box.dataset.state; ic.innerHTML = ICON.play; bar.style.transform = 'scaleX(0)'; },
      applySound,
    };
    btn.addEventListener('click', () => {
      if (box.dataset.state === 'playing' || box.dataset.state === 'loading' && !v.paused) p.pause(); else p.play();
    });
    snd?.addEventListener('click', () => { snd1 = !snd1; if (snd1) { v.currentTime = 0; p.play(); } else applySound(); });
    let userPaused = false;
    btn.addEventListener('click', () => { userPaused = v.paused; }); // läuft nach dem Play/Pause-Handler
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (v.paused && !RMQ.matches && !userPaused) p.auto(); }
      else if (!v.paused) v.pause();
    }, { threshold: .25 }).observe(box);
    box._p = p;
    return p;
  }
  sec.querySelectorAll('.pf-media:not(.is-bild)').forEach(wire);

  window.__pf = { CLIPS, SPARTEN, used: used.map((s) => s.id), players: () => [...sec.querySelectorAll('.pf-media')].map((m) => m._p).filter(Boolean) };
})();
