
/* Fotos: Storyboard-Panel zuerst (sb1 … sb8, sa2 … sa8), sonst das bisherige Seitenfoto. Nie Platzhalter. */
(function () {
  var m = matchMedia('(max-width: 900px) and (orientation: portrait)').matches;
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    var have = window.WW_IMGS || [], list = img.getAttribute('data-src').split(',').filter(function (n) { return have.indexOf(n) >= 0; }), k = 0;
    function next() { if (k >= list.length) { img.closest('figure').style.display = 'none'; return; } var n = list[k++]; img.src = '../assets/img/rund/' + n + (m && n[0] !== 's' ? '-m' : '') + '.webp'; }
    img.onerror = next; next();
  });
  /* Karten einblenden, Zahlen zählen hoch, Schalter folgt */
  var secs = [].slice.call(document.querySelectorAll('.st, .bridge')), btns = [].slice.call(document.querySelectorAll('.se')), ind = document.querySelector('.seasons .ind');
  function setInd(i) { var b = btns[i]; ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + b.offsetLeft + 'px)'; btns.forEach(function (x, j) { x.classList.toggle('on', j === i); }); }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
    if (!e.isIntersecting) return; var s = e.target; s.classList.add('in');
    setInd(+s.getAttribute('data-season')); window.WW_SEASON = +s.getAttribute('data-season');
    s.querySelectorAll('[data-n]').forEach(function (b) { if (b.dataset.done) return; b.dataset.done = 1; var to = +b.getAttribute('data-n'), t0 = performance.now(); (function f(t) { var k = Math.min(1, (t - t0) / 1200); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0); });
  }); }, { threshold: .35 });
  secs.forEach(function (s) { io.observe(s); });
  setInd(0); addEventListener('resize', function () { setInd(btns.findIndex(function (b) { return b.classList.contains('on'); })); });
  /* Schalter: an den Anfang der Jahreszeit springen */
  btns.forEach(function (b, i) { b.addEventListener('click', function () { var t = secs.find(function (s) { return +s.getAttribute('data-season') === i; }); if (t) scrollTo({ top: t.offsetTop, behavior: 'smooth' }); }); });
})();
