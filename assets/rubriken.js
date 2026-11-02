// Themen-Unterseiten: Sprungleiste der Rubriken (.rb-jump). Erscheint, sobald die erste Rubrik erreicht ist,
// verschwindet nach der letzten; die aktuelle Rubrik ist blau markiert (aria-current). Styles: assets/themen.css
(() => {
  const nav = document.querySelector('.rb-jump');
  if (!nav) return;
  const ol = nav.querySelector('ol');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  let secs = [], cur = -2, on = null, ticking = false;
  const find = () => { secs = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))); };
  const update = () => {
    ticking = false;
    if (!secs.length || secs.some((s) => !s || !s.isConnected)) find();
    const live = secs.filter((s) => s && !s.hidden);
    if (!live.length) return;
    const line = 64 + 56 + innerHeight * 0.2; // Kopfzeile + Leiste + etwas Luft
    const isOn = live[0].getBoundingClientRect().top < line && live[live.length - 1].getBoundingClientRect().bottom > line;
    if (isOn !== on) { on = isOn; nav.classList.toggle('is-on', on); }
    let i = -1;
    secs.forEach((s, k) => { if (s && !s.hidden && s.getBoundingClientRect().top < line) i = k; });
    if (i === cur) return;
    cur = i;
    links.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    const a = links[i];
    if (a && on && ol.scrollWidth > ol.clientWidth) {
      const l = a.offsetLeft, r = l + a.offsetWidth;
      if (l < ol.scrollLeft || r > ol.scrollLeft + ol.clientWidth) ol.scrollTo({ left: Math.max(0, l - 16), behavior: rm.matches ? 'auto' : 'smooth' });
    }
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  addEventListener('load', req);
  update();
})();
