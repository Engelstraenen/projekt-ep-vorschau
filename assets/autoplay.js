/* Alle Videos: stumm, in Schleife, inline; starten automatisch, sobald sichtbar, pausieren außerhalb des Bildes.
   prefers-reduced-motion: kein Autoplay, Klick/Play startet trotzdem.
   Videos mit Stimme (data-ton) bekommen einen gut sichtbaren „Ton an“-Knopf: startet von vorn mit Ton.
   Ausgenommen: Portfolio-Karten (.pf-media, eigene Logik in portfolio.js) und [data-no-auto] (z. B. Kino-Dialog). */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const vids = [...document.querySelectorAll('video')].filter((v) => !v.closest('.pf-media') && !v.hasAttribute('data-no-auto'));
  if (!vids.length) return;
  const load = (v) => { if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src; if (v.preload === 'none') v.preload = 'auto'; };
  const play = (v) => { load(v); const p = v.play(); if (p && p.catch) p.catch(() => { if (!v.muted) { v.muted = true; setTon(v); v.play().catch(() => {}); } }); };
  const setTon = (v) => { const b = v._tonBtn; if (!b) return; b.innerHTML = v.muted ? '<span aria-hidden="true">🔊</span> Ton an' : '<span aria-hidden="true">🔇</span> Ton aus'; b.setAttribute('aria-pressed', String(!v.muted)); b.setAttribute('aria-label', v.muted ? 'Ton an: Video von vorn mit Ton abspielen' : 'Ton ausschalten'); };
  vids.forEach((v) => {
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('loop', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    if (!RM.matches) v.autoplay = true;
    else if (v.preload === 'none') { if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src; v.preload = 'metadata'; } // Bedienleiste/Play muss sofort reagieren
    v.addEventListener('pause', () => { if (!v._auto && !document.hidden && v._vis) v._user = true; v._auto = false; });
    v.addEventListener('play', () => { v._user = false; });
    // Klick auf die Videofläche startet/pausiert (nur ohne native Bedienleiste, die das selbst macht)
    v.addEventListener('click', () => { if (v.controls) return; if (v.paused) play(v); else v.pause(); });
    if (v.hasAttribute('data-ton')) {
      const host = v.parentElement; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      const b = document.createElement('button'); b.type = 'button'; b.className = 'ton-an'; v._tonBtn = b; host.appendChild(b); setTon(v);
      b.addEventListener('click', (e) => { e.stopPropagation();
        if (v.muted) { v.muted = false; v.currentTime = 0; v.controls = true; play(v); } else { v.muted = true; }
        setTon(v); });
      v.addEventListener('volumechange', () => setTon(v));
    }
  });
  const css = document.createElement('style');
  css.textContent = '.ton-an{position:absolute;left:14px;top:14px;z-index:5;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:999px;border:0;background:#fff;color:#1D1D1F;font:600 16px/1 inherit;font-family:inherit;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.35)}.ton-an:hover{background:#F5F5F7}.ton-an:focus-visible{outline:3px solid #0071E3;outline-offset:2px}.film-stage .ton-an{left:50%;top:50%;transform:translate(-50%,-50%);height:56px;padding:0 28px;font-size:17px}.film-stage .ton-an[aria-pressed="true"]{left:14px;top:84px;transform:none;height:44px;padding:0 18px;font-size:15px}';
  document.head.appendChild(css);
  const auto = (v) => !RM.matches && !v._user;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target; v._vis = e.isIntersecting;
      if (e.isIntersecting) { if (v.paused && auto(v)) play(v); }
      else if (!v.paused) { v._auto = true; v.pause(); }
    }), { threshold: 0.25 });
    vids.forEach((v) => io.observe(v));
  } else if (!RM.matches) vids.forEach(play);
  document.addEventListener('visibilitychange', () => vids.forEach((v) => {
    if (document.hidden) { if (!v.paused) { v._auto = true; v.pause(); } } else if (v._vis && v.paused && auto(v)) play(v);
  }));
})();
