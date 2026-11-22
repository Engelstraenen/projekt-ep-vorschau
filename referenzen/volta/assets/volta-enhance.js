(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var day = document.querySelector('[data-day]');
  var vid = document.querySelector('.day__vid');
  var neon = document.querySelectorAll('[data-neon]');
  var scenes = document.querySelectorAll('.day .scene');
  /* Mobil-Check 11/2026: gestapelter Tag (≤1000 px) bzw. Touch ohne Maus -> Film läuft als Schleife statt
     per Scroll gespult zu werden (ot.mp4 hat nur ein Schlüsselbild, Spulen ruckelt auf Handys stark). */
  var stacked = matchMedia('(max-width: 1000px)');
  var touchPlay = matchMedia('(max-width: 1000px), (hover: none)');
  var film = day && day.querySelector('.day__film');
  var track = day && day.querySelector('.day__track');
  var neonWrap = document.querySelector('.day__neon');

  /* Motion chips over day */
  if (day && !reduce) {
    var pin = day.querySelector('.day__pin');
    if (pin) {
      [['Tour live', '12%', '22%'], ['Route baut', 'auto', '18%'], ['Team Nord', '70%', '28%']].forEach(function (c, i) {
        var el = document.createElement('span');
        el.className = 'mg-chip';
        el.textContent = c[0];
        el.style.top = c[2];
        if (c[1] === 'auto') el.style.right = '8%'; else el.style.left = c[1];
        el.style.opacity = '0';
        // gestapelt: Chips schweben im Film-Bühnenbild (hinter den Karten), nicht quer über der langen Kartenliste
        (stacked.matches && film ? film : pin).appendChild(el);
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
  var focusRaf = 0;
  function focusLoop() {
    focusRaf = 0;
    if (!vid || !touchPlay.matches) return;
    var portrait = vid.clientWidth / Math.max(1, vid.clientHeight) < 1;
    vid.style.objectPosition = portrait ? (focalAt(vid.currentTime || 0) * 100).toFixed(1) + '% 50%' : '';
    if (!vid.paused) focusRaf = requestAnimationFrame(focusLoop);
  }

  function scrub(p) {
    if (vid && vid.duration && !reduce && !touchPlay.matches) {
      try { vid.currentTime = Math.max(0, Math.min(vid.duration - 0.05, p * vid.duration)); } catch (e) {}
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
      /* Touch/gestapelt: stumme Schleife, läuft nur sichtbar */
      if (!reduce) {
        var filmIo = new IntersectionObserver(function (es) {
          var vis = es[0].isIntersecting;
          if (touchPlay.matches && vis) { vid.loop = true; var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else if (touchPlay.matches) vid.pause();
        }, { threshold: 0.05 });
        filmIo.observe(day);
        vid.addEventListener('play', function () { if (!focusRaf) focusRaf = requestAnimationFrame(focusLoop); });
        vid.addEventListener('seeked', function () { if (!focusRaf) focusRaf = requestAnimationFrame(focusLoop); });
        if (touchPlay.addEventListener) touchPlay.addEventListener('change', function (m) { if (!m.matches) { vid.pause(); vid.loop = false; vid.style.objectPosition = ''; measure(); } });
        focusLoop();
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
