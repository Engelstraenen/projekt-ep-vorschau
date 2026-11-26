/* WURZELWERK Unterseiten: Bilder mit Ersatz, Ebenen-Scroll, Lupe, Diagramm, Rechner */
(function () {
  var H = window.WW_IMGS || [], mob = matchMedia('(max-width: 760px)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function src(k) { return '../assets/img/rund/' + k + (mob ? '-m' : '') + '.webp'; }

  // Bilder: vorhandenes Foto, sonst Ersatz (data-alt), sonst Element ausblenden (nie Platzhalter)
  $$('img[data-k]').forEach(function (im) {
    var k = im.dataset.k, a = im.dataset.alt, use = H.indexOf(k) >= 0 ? k : (a && H.indexOf(a) >= 0 ? a : null);
    if (!use) { var f = im.closest('[data-hide]') || im; f.hidden = true; return; }
    im.src = im.dataset.wide ? '../assets/img/rund/' + use + '.webp' : src(use);
    if (im.dataset.lens) { var l = $(im.dataset.lens); if (l) l.style.backgroundImage = 'url(' + im.src + ')'; }
  });

  // Einblenden + Diagramm/Zeitleiste starten
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .25 });
  $$('.rv, .chart, .flow, .macro').forEach(function (el) { io.observe(el); });

  // Ebenen: Scroll-Fortschritt -> aktive Ebene, Leuchtlinie, Callout, Bildunterschrift
  var L = $('.layers');
  if (L) {
    var data = JSON.parse($('#layers-data').textContent), cut = $('.cut', L), call = $('.call span', L), cap = $('.capbar', L), rail = $$('.rail button', L), cur = -1;
    function set(i) {
      if (i === cur) return; cur = i; var d = data[i];
      cut.classList.toggle('nol', d.h >= 100);
      cut.style.setProperty('--y', d.y + '%');
      cut.style.setProperty('--y1', Math.max(0, d.y - d.h / 2) + '%');
      cut.style.setProperty('--y2', Math.min(100, d.y + d.h / 2) + '%');
      call.innerHTML = d.c;
      cap.innerHTML = '<span class="n">' + (i + 1) + '</span><b>' + d.t + '</b><p>' + d.p + '</p>';
      cap.classList.remove('fade'); void cap.offsetWidth; cap.classList.add('fade');
      rail.forEach(function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-current', j === i ? 'step' : 'false'); });
    }
    function onScroll() {
      var r = L.getBoundingClientRect(), span = L.offsetHeight - innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
      set(Math.min(data.length - 1, Math.floor(p * data.length)));
    }
    rail.forEach(function (b, j) { b.addEventListener('click', function () {
      var span = L.offsetHeight - innerHeight; scrollTo({ top: L.offsetTop + span * (j + .5) / data.length, behavior: 'smooth' });
    }); });
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
  }

  // Rechner (ohne Euro): Mengen aus Länge × Breite
  var C = $('.calc[data-calc]');
  if (C) {
    var k = JSON.parse(C.dataset.calc), ins = $$('input[type=range]', C), mat = $$('.chips button', C), mi = 0;
    function fmt(v, d) { return v.toLocaleString('de-DE', { maximumFractionDigits: d, minimumFractionDigits: d }); }
    function calc() {
      var a = +ins[0].value, b = +ins[1].value, M = k.mat[mi], m2 = a * b * (k.area_mat ? M[k.area_mat] : 1);
      if (k.hedge) m2 = a * (2 * b + .6);
      ins.forEach(function (x) { $('output[for=' + x.id + ']', C).textContent = fmt(+x.value, k.unit === 'm' ? 1 : 0) + ' ' + k.unit; });
      $$('[data-r]', C).forEach(function (o) {
        var f = k.res[o.dataset.r], v = f.fix ? M[f.fix] : (f.m2 == null ? m2 : f.m2 * a * b * (f.mat ? M[f.mat] : 1));
        if (k.hedge && f.m2 != null) v = f.m2 * m2;
        if (k.wall && f.m2 == null) v = b * 12;
        o.textContent = fmt(f.ceil ? Math.ceil(v) : v, f.d);
      });
      $('[data-area]', C).textContent = fmt(m2, 1);
      $('.mat', C).innerHTML = M.txt;
    }
    ins.forEach(function (x) { x.addEventListener('input', calc); });
    mat.forEach(function (b, j) { b.addEventListener('click', function () { mi = j; mat.forEach(function (o, n) { o.classList.toggle('on', n === j); o.setAttribute('aria-pressed', n === j); }); calc(); }); });
    calc();
  }
})();
