/* WARMHERZ V3 – Story-Motor der Startseite.
   Jedes Kapitel hat eine eigene Mechanik, die Wärmebild-Linse gibt es nur im Einstieg.
   Übergänge je Kapitel (data-ueber): zoom (Kamera fährt in einen Bildpunkt, nächste Szene blendet auf),
   wisch (gelbe Linie wischt die nächste Szene herein), portal (Kreis wächst aus einem Punkt), fade.
   Technik-Bausteine: Masken-Reveal (Idee getlayers „aerra“ / motionsites „ink-reveal“), Scroll-Scrubbing. */
(() => {
  const root = document.documentElement;
  const buehne = document.querySelector('.buehne');
  const linse = document.querySelector('.linse');
  const kaps = [...document.querySelectorAll('[data-szene]')];
  if (!buehne || !kaps.length) return;
  const szenen = Object.fromEntries([...buehne.querySelectorAll('.szene')].map(s => [s.dataset.k, s]));
  const touch = matchMedia('(hover: none)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let vw = innerWidth, vh = innerHeight;
  const L = { x: vw * 0.62, y: vh * 0.45, tx: vw * 0.62, ty: vh * 0.45, r: 0, tr: 0, manuell: 0, maus: false };
  let aktiv = null, kommt = null;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const linie = document.createElement('i'); linie.className = 'wischlinie'; buehne.appendChild(linie);

  /* Bildkoordinaten (% im Originalbild) -> Bildschirm, passend zu object-fit:cover + object-position */
  function bildZuSchirm(szene, px, py) {
    const img = szene && szene.querySelector('img,video');
    if (!img) return [vw * px / 100, vh * py / 100];
    const iw = img.naturalWidth || img.videoWidth || 2560, ih = img.naturalHeight || img.videoHeight || 1440;
    const s = Math.max(vw / iw, vh / ih), w = iw * s, h = ih * s;
    const op = getComputedStyle(img).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    const ox = (vw - w) * (isNaN(op[0]) ? .5 : op[0]), oy = (vh - h) * (isNaN(op[1]) ? .5 : op[1]);
    return [ox + w * px / 100, oy + h * py / 100];
  }
  const radius = () => Math.min(Math.max(vw, vh) * 0.2, touch ? 130 : 200, Math.min(vw, vh) * 0.32);
  const punkt = (s, a) => (a || '50,50').split(',').map(Number);

  function fortschritt(el) {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - vh));
  }

  /* ---------- Einstieg: Lecks finden ---------- */
  const lecks = szenen.k1 ? JSON.parse(szenen.k1.dataset.lecks || '[]') : [];
  const gefunden = new Set();
  function pruefeLecks() {
    const b = linse && linse.querySelector('b');
    if (aktiv !== 'k1' || L.r < 30) { if (b) b.textContent = ''; return; }
    let nah = null;
    lecks.forEach((l, i) => {
      const [x, y] = bildZuSchirm(szenen.k1, l.x, l.y);
      if (Math.hypot(x - L.x, y - L.y) < L.r * 0.45) { nah = l; if (!gefunden.has(i) && L.manuell) { gefunden.add(i); meldeLeck(l); } }
    });
    if (b) b.textContent = nah ? nah.name + ' · ' + nah.wert : '';
  }
  function meldeLeck(l) {
    document.querySelectorAll('.lecks i')[gefunden.size - 1]?.classList.add('ja');
    const z = document.querySelector('[data-leck-zahl]'); if (z) z.textContent = gefunden.size;
    const c = document.querySelector('.leck-chips');
    if (c) { const s = document.createElement('span'); s.innerHTML = `${l.name} <b>${l.wert}</b>`; c.appendChild(s); }
    if (gefunden.size === lecks.length) document.querySelector('.alle-lecks')?.removeAttribute('hidden');
  }
  /* Linse wandert von selbst (Start + Handy), bis jemand sie bewegt */
  function autoZiel(t) {
    const i = Math.floor(t / 2200) % lecks.length;
    const [x, y] = bildZuSchirm(szenen.k1, lecks[i].x, lecks[i].y);
    L.tx = x; L.ty = y;
  }

  /* ---------- Kapitel-Mechaniken ---------- */
  const alterIn = document.getElementById('heiz-bj');
  let teilManuell = 0, teilWert = 60;
  function mechanik(k, kap, p) {
    const sz = szenen[k];
    if (k === 'k3' && sz) {                       /* Wärmebild wischt mit dem Alter der Heizung über den Keller */
      const alterW = alterIn ? clamp((2026 - alterIn.value) / 46) * 100 : 50;
      const w = Math.max(alterW, 100 * (1 - clamp(p / 0.22)));
      sz.style.setProperty('--w', w.toFixed(1) + '%');
    }
    if (k === 'k7' && sz) {                       /* Trennlinie Foto | Wärmebild: Scrollen oder Ziehen */
      if (performance.now() - teilManuell > 5000) teilWert = 88 - clamp(p / 0.8) * 70;
      sz.style.setProperty('--s', teilWert.toFixed(1) + '%');
    }
  }

  /* ---------- Hauptschleife ---------- */
  function tick(t) {
    let idx = 0;
    kaps.forEach((k, i) => {
      const r = k.getBoundingClientRect();
      if (r.top < vh * 0.5) idx = i;
      k.style.setProperty('--pv', clamp((vh - r.top) / (vh * 0.9)).toFixed(3));
    });
    const kap = kaps[idx], p = fortschritt(kap);
    const k = kap.dataset.szene;
    kap.style.setProperty('--p', p.toFixed(3));
    const naechstes = kaps[idx + 1];
    const nk = naechstes && naechstes.dataset.szene !== k ? naechstes.dataset.szene : null;

    if (k !== aktiv) {
      if (szenen[aktiv]) { szenen[aktiv].classList.remove('an'); szenen[aktiv].style.transform = ''; }
      aktiv = k; if (szenen[k]) szenen[k].classList.add('an');
      document.body.dataset.kap = k;
      skalaAn(idx);
    }
    const sz = szenen[k];
    if (sz) sz.style.setProperty('--p', p.toFixed(3));

    /* Übergang in den letzten 22 % des Kapitels */
    const art = kap.dataset.ueber || 'fade';
    const q = nk && szenen[nk] ? clamp((p - 0.78) / 0.22) : 0;
    if (q > 0) {
      const n = szenen[nk];
      if (kommt !== nk) { if (szenen[kommt]) aufraeumen(szenen[kommt]); kommt = nk; n.classList.add('kommt'); n.dataset.ein = art; }
      const e = ease(q);
      if (art === 'zoom' && sz) {
        const [zx, zy] = bildZuSchirm(sz, ...punkt(sz, kap.dataset.zoom));
        sz.style.transformOrigin = `${zx}px ${zy}px`;
        sz.style.transform = `scale(${1 + e * 2.2})`;
        n.style.opacity = clamp((q - 0.4) / 0.6);
      } else if (art === 'portal') {
        const [ax, ay] = bildZuSchirm(n, ...punkt(n, kap.dataset.anker));
        const max = Math.hypot(Math.max(ax, vw - ax), Math.max(ay, vh - ay));
        n.style.setProperty('--px', ax + 'px'); n.style.setProperty('--py', ay + 'px');
        n.style.setProperty('--pr', (e * max) + 'px');
      } else if (art === 'wisch') {
        n.style.setProperty('--q', (e * 100).toFixed(2) + '%');
        linie.style.left = (e * 100) + '%'; linie.classList.add('an');
      } else {
        n.style.opacity = e;
      }
    } else if (kommt) {
      aufraeumen(szenen[kommt]); kommt = null;
      if (sz) sz.style.transform = '';
    }
    if (art !== 'wisch' || q === 0) linie.classList.remove('an');

    /* Linse nur im Einstieg */
    const lensOn = k === 'k1' && q < 0.15;
    L.tr = lensOn ? radius() : 0;
    if (lensOn && lecks.length && (performance.now() - L.manuell > 4000 || (!touch && !L.maus))) autoZiel(t);
    if (touch) { const m = Math.min(radius(), vw / 2 - 4); L.tx = clamp(L.tx, m, vw - m); L.ty = clamp(L.ty, m + 60, vh - m - 40); }
    const f = reduce ? 1 : (L.maus && !touch ? 0.2 : 0.08);
    L.x += (L.tx - L.x) * f; L.y += (L.ty - L.y) * f; L.r += (L.tr - L.r) * 0.12;
    root.style.setProperty('--lx', L.x.toFixed(1) + 'px');
    root.style.setProperty('--ly', L.y.toFixed(1) + 'px');
    root.style.setProperty('--lr', L.r.toFixed(1) + 'px');
    if (linse) { linse.style.setProperty('--lpx', L.x + 'px'); linse.style.setProperty('--lpy', L.y + 'px'); linse.style.opacity = L.r > 8 ? 1 : 0; }
    pruefeLecks();
    mechanik(k, kap, p);
    if (nk && q > 0) mechanik(nk, naechstes, 0);
    film(kap, p);
    kap.querySelectorAll('[data-ab]').forEach(el => { const [a, b] = el.dataset.ab.split('-').map(Number); el.classList.toggle('an', p >= a && p < b); });
    skalaZeiger();
    requestAnimationFrame(tick);
  }
  function aufraeumen(n) {
    n.classList.remove('kommt'); delete n.dataset.ein;
    ['--pr', '--q', '--px', '--py'].forEach(v => n.style.removeProperty(v)); n.style.opacity = '';
  }

  /* Scroll-Film (Kapitel mit data-film) */
  function film(kap, p) {
    if (!('film' in kap.dataset)) return;
    const v = szenen[kap.dataset.szene]?.querySelector('video'); if (!v || !v.duration) return;
    const ziel = clamp(p / 0.82) * (v.duration - 0.05);
    if (Math.abs(v.currentTime - ziel) > 0.03 && !v.seeking) v.currentTime = ziel;
  }

  /* ---------- Temperatur-Skala ---------- */
  const skala = document.querySelector('.skala .bar');
  const zeiger = document.querySelector('.skala .zeiger');
  const gradEl = document.querySelector('.skala .grad');
  const TMIN = -10, TMAX = 40, pos = t => 100 - (t - TMIN) / (TMAX - TMIN) * 100;
  const marken = kaps.filter(k => k.dataset.temp);
  if (skala) marken.forEach(k => {
    const b = document.createElement('button'); b.className = 'punkt'; b.style.top = pos(+k.dataset.temp) + '%';
    b.innerHTML = `<span>${k.dataset.temp}° · ${k.dataset.name}</span>`; b.setAttribute('aria-label', `${k.dataset.name} (${k.dataset.temp} Grad)`);
    b.onclick = () => scrollTo({ top: k.offsetTop + 2, behavior: reduce ? 'auto' : 'smooth' });
    skala.appendChild(b); k._punkt = b;
  });
  function skalaAn(idx) { marken.forEach(k => k._punkt && k._punkt.classList.toggle('an', k === kaps[idx])); }
  function skalaZeiger() {
    if (!zeiger) return;
    let t = TMIN;
    for (let i = 0; i < marken.length; i++) {
      const a = marken[i], b = marken[i + 1];
      const ta = +a.dataset.temp, top = a.getBoundingClientRect().top - vh * 0.5;
      if (top > 0) { t = i === 0 ? ta : t; break; }
      if (!b) { t = ta; break; }
      const tb = +b.dataset.temp, h = b.getBoundingClientRect().top - a.getBoundingClientRect().top;
      t = ta + (tb - ta) * Math.min(1, -top / Math.max(1, h));
    }
    zeiger.style.top = pos(t) + '%';
    if (gradEl) gradEl.textContent = (t > 0 ? '+' : '') + t.toFixed(0).replace('-', '−') + '°';
  }

  /* ---------- Eingabe ---------- */
  addEventListener('pointermove', e => {
    if (e.pointerType === 'mouse') { L.tx = e.clientX; L.ty = e.clientY; L.manuell = performance.now(); L.maus = true; document.querySelector('.linse-tipp')?.style.setProperty('opacity', 0); }
  }, { passive: true });
  const k1 = document.getElementById('k1');
  k1?.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || e.target.closest('a,button,input')) return;
    L.tx = e.clientX; L.ty = e.clientY; L.manuell = performance.now();
    document.querySelector('.linse-tipp')?.style.setProperty('opacity', 0);
  }, { passive: true });
  addEventListener('touchmove', e => {
    if (e.touches.length !== 1 || !e.target.closest('.buehne-greif')) return;
    L.tx = e.touches[0].clientX; L.ty = e.touches[0].clientY; L.manuell = performance.now();
  }, { passive: true });
  /* Trennlinie in Kapitel 21° ziehen */
  const k7 = document.getElementById('k7');
  const teil = e => { teilWert = clamp(e.clientX / vw * 100, 4, 96); teilManuell = performance.now(); };
  k7?.addEventListener('pointerdown', e => { if (!e.target.closest('a,button')) { teil(e); k7._zieh = 1; } });
  addEventListener('pointerup', () => { if (k7) k7._zieh = 0; });
  k7?.addEventListener('pointermove', e => { if (k7._zieh) teil(e); });
  addEventListener('resize', () => { vw = innerWidth; vh = innerHeight; });
  setTimeout(() => document.querySelector('.linse-tipp')?.style.setProperty('opacity', 0), 7000);
  requestAnimationFrame(tick);
})();
