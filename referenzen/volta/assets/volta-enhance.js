(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var day = document.querySelector('[data-day]');
  var vid = document.querySelector('.day__vid');
  var neon = document.querySelectorAll('[data-neon]');
  var scenes = document.querySelectorAll('.day .scene');
  /* Mobil-Check 11/2026: Der Film wird auch auf Handy/Tablet per Scroll gespult (gewollter Effekt).
     Ursache des Ruckelns war ot.mp4 mit nur einem Schlüsselbild auf 242 Bilder: Handy/Touch laden über
     <source media> die Fassung film/ot-m.mp4 (Schlüsselbild alle 6 Bilder); Suchsprünge werden gebündelt,
     damit der Decoder nicht hinterherläuft. Desktop mit Maus: unverändert. */
  var stacked = matchMedia('(max-width: 1000px)');
  var touch = matchMedia('(max-width: 1000px), (hover: none)');
  var film = day && day.querySelector('.day__film');
  var track = day && day.querySelector('.day__track');
  var neonWrap = document.querySelector('.day__neon');

  /* Motion chips over day */
  if (day && !reduce) {
    var pin = day.querySelector('.day__pin');
    var head = day.querySelector('.day__head'), chipRow = null;
    if (stacked.matches && head) { chipRow = document.createElement('div'); chipRow.className = 'mg-row'; chipRow.setAttribute('aria-hidden', 'true'); head.appendChild(chipRow); }
    if (pin) {
      [['Tour live', '12%', '22%'], ['Route baut', 'auto', '18%'], ['Team Nord', '70%', '28%']].forEach(function (c, i) {
        var el = document.createElement('span');
        el.className = 'mg-chip';
        el.textContent = c[0];
        el.style.top = c[2];
        if (c[1] === 'auto') el.style.right = '8%'; else el.style.left = c[1];
        el.style.opacity = '0';
        // gestapelt: Chips als Statuszeile unter der Uhr (sonst über Titel/Karten der langen Kartenliste)
        (stacked.matches && chipRow ? chipRow : pin).appendChild(el);
        requestAnimationFrame(function () {
          el.style.transition = 'opacity .7s cubic-bezier(.23,1,.32,1) ' + (0.2 + i * 0.12) + 's, transform .7s cubic-bezier(.23,1,.32,1) ' + (0.2 + i * 0.12) + 's';
          el.style.opacity = '1';
        });
      });
    }
  }

  /* Gestapelt: Kennzahlen als Zeile unter den Karten statt absolut über der letzten Karte */
  if (neonWrap && film && track) {
    var placeNeon = function () {
      if (stacked.matches) { if (!neonWrap.classList.contains('is-flow')) { track.parentNode.insertBefore(neonWrap, track.nextSibling); neonWrap.classList.add('is-flow'); } }
      else if (neonWrap.classList.contains('is-flow')) { neonWrap.classList.remove('is-flow'); film.appendChild(neonWrap); }
    };
    placeNeon();
    if (stacked.addEventListener) stacked.addEventListener('change', placeNeon);
  }

  /* Hochformat: Bildausschnitt folgt dem Motiv (Sekunde -> Motiv-Mitte in Bildbreite) */
  var FOCAL = [[0, 0.25], [1.2, 0.42], [3, 0.5], [99, 0.5]];
  function focalAt(t) {
    for (var k = 1; k < FOCAL.length; k++) if (t <= FOCAL[k][0]) {
      var a = FOCAL[k - 1], b = FOCAL[k];
      return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
    }
    return 0.5;
  }
  function frame(t) {
    var portrait = vid.clientWidth / Math.max(1, vid.clientHeight) < 1;
    vid.style.objectPosition = portrait ? (focalAt(t) * 100).toFixed(1) + '% 50%' : '';
  }
  /* Touch: immer nur ein Suchsprung gleichzeitig; das jeweils neueste Ziel folgt nach 'seeked' */
  var want = -1;
  function seek() {
    if (want < 0 || !touch.matches) return;
    frame(want);
    if (vid.seeking || Math.abs(vid.currentTime - want) < 1 / 48) return;
    try { vid.currentTime = want; } catch (e) {}
  }

  function scrub(p) {
    if (vid && vid.duration && !reduce) {
      var t = Math.max(0, Math.min(vid.duration - 0.05, p * vid.duration));
      if (touch.matches) { want = t; seek(); }
      else { try { vid.currentTime = t; } catch (e) {} }
    }
    neon.forEach(function (n, i) {
      var on = p > 0.55 + i * 0.1;
      n.classList.toggle('is-on', on);
    });
    if (neonWrap) {
      neonWrap.style.opacity = String(Math.min(1, Math.max(0, (p - 0.35) / 0.25)));
      neonWrap.style.transform = 'translateY(' + (12 * (1 - Math.min(1, Math.max(0, (p - 0.35) / 0.25)))) + 'px)';
    }
    scenes.forEach(function (sc, i) {
      var mid = (i + 0.5) / Math.max(1, scenes.length);
      var d = Math.abs(p - mid);
      sc.classList.toggle('is-focus', d < 0.18);
    });
  }

  if (day && 'IntersectionObserver' in window) {
    var progress = 0;
    // Touch: Höhe nur bei Breitenänderung übernehmen (Adressleiste ändert innerHeight beim Scrollen)
    var isTouch = matchMedia('(hover: none)').matches, vh = innerHeight, vw = innerWidth;
    function measure() {
      var r = day.getBoundingClientRect();
      var h = day.offsetHeight - (isTouch ? vh : innerHeight);
      progress = h > 0 ? Math.min(1, Math.max(0, -r.top / h)) : 0;
      scrub(progress);
    }
    addEventListener('scroll', measure, { passive: true });
    addEventListener('resize', function () { if (!isTouch || innerWidth !== vw) { vh = innerHeight; vw = innerWidth; } measure(); });
    if (vid) {
      vid.addEventListener('loadedmetadata', measure);
      vid.pause();
      if (!reduce) {
        vid.addEventListener('seeked', seek);
        /* iOS lädt trotz preload keine Bilddaten, bis das Video einmal lief: beim Annähern kurz anspielen und anhalten */
        var primed = false;
        var filmIo = new IntersectionObserver(function (es) {
          if (!es[0].isIntersecting || primed || !touch.matches) return;
          primed = true;
          if (vid.readyState < 2) { var pr = vid.play(); if (pr && pr.then) pr.then(function () { vid.pause(); measure(); }).catch(function () {}); }
        }, { rootMargin: '400px 0px' });
        filmIo.observe(day);
        if (touch.addEventListener) touch.addEventListener('change', function (m) { if (!m.matches) { want = -1; vid.style.objectPosition = ''; } measure(); });
      }
    }
    measure();
  }

  /* Living loops when visible */
  document.querySelectorAll('.bgv, .cta__bgv, .foot__bgv').forEach(function (v) {
    v.muted = true;
    if (reduce) { v.pause(); return; }
    if (!('IntersectionObserver' in window)) { v.play().catch(function () {}); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isActive !== undefined) return;
        if (e.isIntersecting) v.play().catch(function () {});
        else v.pause();
      });
    }, { threshold: 0.15 });
    io.observe(v.closest('section, footer') || v);
  });

  /* Horizontal features: wheel → horizontal when over rail */
  var feats = document.querySelector('.features');
  if (feats && !reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    feats.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        feats.scrollLeft += e.deltaY;
        if (feats.scrollLeft > 0 && feats.scrollLeft < feats.scrollWidth - feats.clientWidth - 1) e.preventDefault();
      }
    }, { passive: false });
  }
})();
