(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var day = document.querySelector('[data-day]');
  var vid = document.querySelector('.day__vid');
  var neon = document.querySelectorAll('[data-neon]');
  var scenes = document.querySelectorAll('.day .scene');

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
        pin.appendChild(el);
        requestAnimationFrame(function () {
          el.style.transition = 'opacity .7s cubic-bezier(.23,1,.32,1) ' + (0.2 + i * 0.12) + 's, transform .7s cubic-bezier(.23,1,.32,1) ' + (0.2 + i * 0.12) + 's';
          el.style.opacity = '1';
        });
      });
    }
  }

  function scrub(p) {
    if (vid && vid.duration && !reduce) {
      try { vid.currentTime = Math.max(0, Math.min(vid.duration - 0.05, p * vid.duration)); } catch (e) {}
    }
    neon.forEach(function (n, i) {
      var on = p > 0.55 + i * 0.1;
      n.classList.toggle('is-on', on);
    });
    var neonWrap = document.querySelector('.day__neon');
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
    function measure() {
      var r = day.getBoundingClientRect();
      var h = day.offsetHeight - innerHeight;
      progress = h > 0 ? Math.min(1, Math.max(0, -r.top / h)) : 0;
      scrub(progress);
    }
    addEventListener('scroll', measure, { passive: true });
    addEventListener('resize', measure);
    if (vid) {
      vid.addEventListener('loadedmetadata', measure);
      vid.pause();
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
