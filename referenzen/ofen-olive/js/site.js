(() => {
  const C = window.OO_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // Konfiguration anwenden (Name, Ort, Logo, Zeiten, Gebiet)
  $$('[data-cfg]').forEach(el => { const v = C[el.dataset.cfg]; if (v) el.textContent = v; });
  $$('[data-cfg-logo]').forEach(el => { const v = el.dataset.cfgLogo === 'hell' ? C.logoHell : C.logo; if (v) el.src = v; if (C.name) el.alt = C.name; });
  if (C.zeiten) { const dl = $('[data-cfg-hours]'); if (dl) dl.innerHTML = C.zeiten.map(([d, t]) => `<div><dt>${d}</dt><dd>${t}</dd></div>`).join(''); }
  if (C.liefergebiet) { const ul = $('[data-cfg-areas]'); if (ul) ul.innerHTML = C.liefergebiet.map(a => `<li>${a}</li>`).join(''); }
  if (C.name) document.title = `${C.name} · Holzofen-Pizzeria ${C.ort || ''} · Demo PROJEKT EX`;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const film = $('#film'), head = $('#kopf');
  const layers = $$('.layer', film), chs = $$('.ch', film), rail = $$('.rail li', film);
  const vids = layers.map(l => $('video', l));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const sides = ['left', 'right', 'left', 'right', 'center', 'left'];

  const clip = (fx, t) => {
    const r = (1 - t) * 100;
    switch (fx) {
      case 'rise': return `inset(${r}% 0 0 0)`;
      case 'iris': return `circle(${t * 80}% at 68% 52%)`;
      case 'wipe': return `inset(0 0 0 ${r}%)`;
      case 'split': return `inset(${r / 2}% 0 ${r / 2}% 0)`;
      case 'blinds': return `polygon(0 0, ${t * 140}% 0, ${t * 140 - 40}% 100%, 0 100%)`;
      default: return 'none';
    }
  };
  const cam = (kind, u) => {
    switch (kind) {
      case 'zoom': return `scale(${1.18 - u * .18})`;                           // Dolly zurück vom Ofen
      case 'spin': return `scale(1.25) rotate(${-6 + u * 12}deg)`;              // Draufsicht, Drehung
      case 'crane': return `scale(1.15) translateY(${(u - .5) * -7}%)`;         // Kran nach oben
      case 'pan': return `scale(1.18) translateX(${(.5 - u) * 12}%)`;           // seitliche Fahrt
      case 'tilt': return `scale(${1.08 + u * .14}) translateY(${(u - .5) * 5}%)`; // Push-in von unten
      case 'dolly': return `scale(${1.02 + u * .16})`;
      default: return 'none';
    }
  };

  let active = -1, ticking = false;
  const play = i => vids.forEach((v, k) => { if (Math.abs(k - i) <= 1) { if (v.paused) v.play().catch(() => {}); } else if (!v.paused) v.pause(); });

  function frame() {
    ticking = false;
    const vh = innerHeight;
    head.classList.toggle('is-solid', scrollY > vh * .6);
    let cur = 0;
    chs.forEach((ch, i) => {
      const r = ch.getBoundingClientRect();
      const t = ease(clamp((vh - r.top) / (vh * .75)));
      const u = clamp((vh - r.top) / (r.height + vh));
      if (i > 0) layers[i].style.clipPath = reduce ? (t > .5 ? 'none' : 'inset(100% 0 0 0)') : (t >= 1 ? 'none' : clip(layers[i].dataset.fx, t));
      if (!reduce) vids[i].style.transform = cam(layers[i].dataset.cam, u);
      if (r.top < vh * .5) cur = i;
      const inn = clamp((vh * .9 - r.top) / (vh * .45)) * clamp((r.bottom - vh * .25) / (vh * .35));
      ch.style.setProperty('--in', i === 0 ? clamp((r.bottom - vh * .35) / (vh * .4)).toFixed(3) : inn.toFixed(3));
    });
    if (cur !== active) { active = cur; play(cur); rail.forEach((li, k) => li.classList.toggle('is-on', k === cur)); film.dataset.side = sides[cur]; }
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
  frame();

  // Hintergrund-Videos ausserhalb des Films erst bei Sichtbarkeit starten
  const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { rootMargin: '200px' });
  $$('video[data-lazy]').forEach(v => io.observe(v));
  // Film pausieren, wenn nicht sichtbar
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) vids.forEach(v => v.pause()); else play(active); }).observe(film);
})();
