/* Praxisbeispiele, Teil 2: Bild-Umschalter, Tageszeit, Galerie, Messestand 3D. Ohne Abhängigkeiten. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const io = (els, fn, opt = { threshold: 0.4 }) => {
    if (!('IntersectionObserver' in window)) { els.forEach((e) => fn(e)); return; }
    const o = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { o.unobserve(en.target); fn(en.target); } }), opt);
    els.forEach((e) => o.observe(e));
  };

  // Bild-Umschalter: [data-pp-switch] mit .px-seg-Knöpfen (data-set) und Bildern (data-v) in .pp-pics
  $$('[data-pp-switch]').forEach((w) => {
    const btns = $$('.px-seg button', w); const pics = $$('.pp-pics > [data-v]', w); const cap = w.querySelector('.pp-cap');
    const time = w.querySelector('.pp-time'); let touched = false;
    const set = (k) => {
      w.dataset.state = k;
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.set === k)));
      pics.forEach((p) => p.classList.toggle('on', p.dataset.v === k || (k === 'entwurf' && p.dataset.v === 'tag')));
      const b = btns.find((x) => x.dataset.set === k); if (cap && b && b.dataset.cap) cap.textContent = b.dataset.cap;
      if (time) { const off = k !== 'entwurf'; time.setAttribute('aria-disabled', String(off)); time.querySelector('input').disabled = off; upd(); }
    };
    // Tageszeit: Abend-Bild blendet zwischen 17 und 21 Uhr ein
    const abend = w.querySelector('[data-v="abend"]');
    const upd = () => {
      if (!time) return; const r = time.querySelector('input'); const h = +r.value;
      time.querySelector('output').textContent = `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
      const k = w.dataset.state === 'entwurf' ? Math.min(1, Math.max(0, (h - 17) / 4)) : 0;
      abend.style.opacity = k; abend.style.transition = 'none';
      if (cap && w.dataset.state === 'entwurf') cap.textContent = k > .5 ? 'Entwurf am Abend' : 'Entwurf am Tag';
    };
    if (time) time.querySelector('input').addEventListener('input', () => { touched = true; upd(); });
    btns.forEach((b) => b.addEventListener('click', () => { touched = true; set(b.dataset.set); }));
    set(btns.find((b) => b.getAttribute('aria-pressed') === 'true').dataset.set);
    const auto = w.dataset.ppAuto;
    const sweep = () => { if (!time || RM || touched) return; const r = time.querySelector('input'); const a = +r.min, b = 21.5, ts = performance.now();
      const step = (t) => { if (touched) return; const k = Math.min(1, (t - ts) / 2600); const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; r.value = Math.round((a + (b - a) * e) * 2) / 2; upd(); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); };
    if (auto) io([w], () => setTimeout(() => { if (touched) return; set(auto); setTimeout(sweep, 1100); }, RM ? 0 : 1200));
  });

  // Galerie: Pfeile, Zähler, Punkte
  $$('.pp-galw').forEach((g) => {
    const box = g.querySelector('.pp-gal'); const items = $$('figure', box); const cnt = g.querySelector('.cnt'); const dots = $$('.pp-dots i', g);
    const cur = () => { const bl = box.getBoundingClientRect().left; let k = 0, best = 1e9; items.forEach((p, i) => { const d = Math.abs(p.getBoundingClientRect().left - bl); if (d < best) { best = d; k = i; } }); return k; };
    const upd = () => { const k = cur(); if (cnt) cnt.textContent = `${k + 1} / ${items.length}`; dots.forEach((d, i) => d.classList.toggle('on', i === k)); };
    const go = (d) => { const k = Math.max(0, Math.min(items.length - 1, cur() + d)); box.scrollTo({ left: items[k].offsetLeft - box.offsetLeft, behavior: RM ? 'auto' : 'smooth' }); };
    $$('[data-dir]', g).forEach((b) => b.addEventListener('click', () => go(+b.dataset.dir)));
    box.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
  });

  // Messestand 3D: Boxen aus CSS-Flächen, drehen per Ziehen, Pfeiltasten oder Ansicht-Knöpfen
  $$('[data-pp-stand]').forEach((st) => {
    const world = st.querySelector('.pp-world'); const shadow = st.querySelector('.pp-shadow');
    const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(Math.min(255, v * f))); return `rgb(${c.join(',')})`; };
    const face = (w, h, tf, bg, html = '', cls = '') => `<div class="f ${cls}" style="width:${w}px;height:${h}px;transform:${tf};background:${bg}">${html}</div>`;
    // x/z Grundfläche, y nach oben; c = Grundfarbe; o = Inhalte je Fläche
    const box = (x, y, z, w, h, d, c, o = {}) => {
      const t = -(y + h); let s = '';
      s += face(w, h, `translate3d(${x}px,${t}px,${z + d}px)`, o.frontBg || c, o.front || '', o.frontCls || '');
      s += face(w, h, `translate3d(${x + w}px,${t}px,${z}px) rotateY(180deg)`, shade(c, .78));
      s += face(d, h, `translate3d(${x + w}px,${t}px,${z + d}px) rotateY(90deg)`, o.rightBg || shade(c, .86), o.right || '', o.rightCls || '');
      s += face(d, h, `translate3d(${x}px,${t}px,${z}px) rotateY(-90deg)`, shade(c, .7));
      s += face(w, d, `translate3d(${x}px,${t}px,${z}px) rotateX(90deg)`, o.topBg || shade(c, 1.08), o.top || '');
      return s;
    };
    const L = '../img/logo/';
    let h = '';
    h += box(-320, -14, -220, 640, 14, 440, '#D9CBB5', { topBg: 'repeating-linear-gradient(90deg,#E6D9C4 0 58px,#DCCDB4 58px 60px)', frontBg: '#BFAE93', rightBg: '#B3A286' }); // Boden
    h += box(-320, 0, -220, 640, 290, 14, '#F4F1EC', { front: `<div style="position:absolute;left:40px;top:34px;width:300px"><img src="${L}waermewerk.svg" alt="" style="width:100%;height:auto"></div><div class="scr" style="position:absolute;right:40px;top:30px;width:230px;height:136px;border-radius:10px;background:linear-gradient(160deg,#1B2440,#0E1428);color:#fff;font:700 22px/1.15 Inter,sans-serif;letter-spacing:-.03em;text-align:center;padding:14px">Heizen<br>mit Luft.<span style="display:block;font-size:12px;font-weight:600;color:#F2A33A;margin-top:8px;letter-spacing:0">Live-Beratung am Stand</span></div><div style="position:absolute;left:0;right:0;bottom:0;height:46px;background:#E8602C"></div>` }); // Rückwand
    h += box(-320, 0, -206, 14, 290, 426, '#EDE7DF', { right: `<div style="position:absolute;left:56px;top:40px;right:40px;height:170px;border-radius:12px;background:linear-gradient(135deg,#F2A33A,#E8602C);display:grid;place-items:center"><img src="${L}waermewerk-zeichen.svg" alt="" style="width:96px;height:96px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.2))"></div><div style="position:absolute;left:0;right:0;bottom:0;height:46px;background:#E8602C"></div>` }); // Seitenwand
    h += box(-210, 0, -150, 100, 124, 54, '#F7F7F7', { front: '<div style="position:absolute;left:12px;top:14px;width:76px;height:76px;border-radius:50%;background:repeating-radial-gradient(circle,#2E333B 0 3px,#9AA0A8 3px 6px);box-shadow:inset 0 0 0 4px #D4D7DC"></div><div style="position:absolute;left:12px;right:12px;bottom:12px;height:8px;border-radius:4px;background:#E8602C"></div>' }); // Wärmepumpe
    h += box(-80, 0, -150, 100, 124, 54, '#F7F7F7', { front: '<div style="position:absolute;left:12px;top:14px;width:76px;height:76px;border-radius:50%;background:repeating-radial-gradient(circle,#2E333B 0 3px,#9AA0A8 3px 6px);box-shadow:inset 0 0 0 4px #D4D7DC"></div><div style="position:absolute;left:12px;right:12px;bottom:12px;height:8px;border-radius:4px;background:#12305C"></div>' });
    h += box(60, 0, 30, 190, 104, 70, '#FFFFFF', { front: `<div style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(#fff,#F1EEE9)"><img src="${L}waermewerk-zeichen.svg" alt="" style="width:56px;height:56px"></div><div style="position:absolute;left:0;right:0;bottom:0;height:10px;background:#E8602C"></div>`, topBg: '#2B2B2E' }); // Theke
    h += box(260, 0, 130, 40, 250, 34, '#E8602C', { front: '<div style="position:absolute;inset:0;display:grid;place-items:center"><span style="writing-mode:vertical-rl;transform:rotate(180deg);font:800 22px Inter,sans-serif;color:#fff;letter-spacing:.12em">WÄRMEWERK</span></div>' }); // Banner
    h += box(-40, 0, 90, 60, 44, 60, '#7C9A84', {}); // Hocker / Pflanzkübel
    h += box(-30, 44, 100, 40, 70, 40, '#5E8A63', { frontBg: 'radial-gradient(circle at 50% 40%,#7FB27F,#3F6B47)', topBg: '#6FA070' });
    world.innerHTML = h;
    let ang = -28, tilt = -16, raf = 0, drag = null, idle = !RM, t0 = performance.now();
    const views = { vorne: 0, ecke: -32, seite: -62 };
    const apply = () => {
      const s = Math.min(1, st.clientWidth / (st.clientWidth < 600 ? 780 : 860));
      world.style.transform = `scale(${s}) rotateX(${tilt}deg) rotateY(${ang}deg)`; if (shadow) shadow.style.setProperty('--s', s);
    };
    const loop = (t) => { if (!idle) return; ang = -28 + Math.sin((t - t0) / 2600) * 22; apply(); raf = requestAnimationFrame(loop); };
    const stop = () => { idle = false; cancelAnimationFrame(raf); };
    let anim = 0; const to = (a) => { stop(); cancelAnimationFrame(anim); if (RM) { ang = a; apply(); return; } const a0 = ang, ts = performance.now();
      const step = (t) => { const k = Math.min(1, (t - ts) / 520); const e = 1 - Math.pow(1 - k, 4); ang = a0 + (a - a0) * e; apply(); if (k < 1) anim = requestAnimationFrame(step); }; anim = requestAnimationFrame(step); };
    st.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; stop(); drag = { x: e.clientX, y: e.clientY, a: ang, tl: tilt }; st.setPointerCapture(e.pointerId); });
    st.addEventListener('pointermove', (e) => { if (!drag) return; ang = Math.max(-80, Math.min(80, drag.a + (e.clientX - drag.x) * .35)); tilt = Math.max(-34, Math.min(-6, drag.tl - (e.clientY - drag.y) * .15)); apply(); });
    const end = () => { drag = null; }; st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
    st.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') { to(Math.max(-80, ang - 15)); e.preventDefault(); } if (e.key === 'ArrowRight') { to(Math.min(80, ang + 15)); e.preventDefault(); } });
    $$('.px-seg button', st.parentElement).forEach((b) => b.addEventListener('click', () => { $$('.px-seg button', st.parentElement).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); to(views[b.dataset.set]); }));
    addEventListener('resize', apply); apply();
    if (!RM && 'IntersectionObserver' in window) new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting) { cancelAnimationFrame(raf); } else if (idle) { raf = requestAnimationFrame(loop); } }), { threshold: .2 }).observe(st);
  });
})();

/* Print: Optionen als data-Attribute, Muster-Größe, Rapport */
(() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  $$('[data-pp-opts]').forEach((w) => {
    $$('[data-key]', w).forEach((g) => {
      const bs = $$('button', g);
      bs.forEach((b) => b.addEventListener('click', () => { w.dataset[g.dataset.key] = b.dataset.set; bs.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
    });
    const sc = w.querySelector('[data-pp-scale]');
    if (sc) { const pat = document.getElementById(sc.dataset.ppScale); const out = sc.parentElement.querySelector('output'); const rap = w.querySelector('.pp-rap');
      const upd = () => { const v = +sc.value; pat.setAttribute('patternTransform', `scale(${v})`); out.textContent = `${Math.round(v * 100)} %`; if (rap) { rap.setAttribute('x', 120 * v); rap.setAttribute('y', 120 * v); rap.setAttribute('width', 120 * v); rap.setAttribute('height', 120 * v); } };
      sc.addEventListener('input', upd); upd(); }
    const cb = w.querySelector('[data-pp-rap]');
    if (cb) cb.addEventListener('change', () => { w.dataset.rap = cb.checked ? '1' : '0'; });
  });
})();

/* Systeme: Schichtplan, Handy-Klickprototyp, Baustellen-Board */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']; const NAME = { F: 'Früh', S: 'Spät', N: 'Nacht' };

  // Schichtplan: Dienste ziehen (Maus/Finger) oder antippen und Ziel antippen
  $$('[data-pp-shift]').forEach((w) => {
    const rows = ['Anna', 'Ben', 'Carla', 'Deniz', 'Emil', 'Offen'];
    const plan = { Anna: 'FF.FF..', Ben: 'SSSS..S', Carla: 'NNF.SS.', Deniz: '..NNN.N', Emil: '.....FF', Offen: '.....N.' };
    const G = rows.map((r) => plan[r].split('').map((c) => (c === '.' ? '' : c)));
    const tb = w.querySelector('tbody'); const th = w.querySelector('thead tr'); const sum = w.querySelector('.pp-shift-sum .st');
    th.innerHTML = '<th scope="col"><span class="px-vh">Person</span></th>' + DAYS.map((d) => `<th scope="col">${d}</th>`).join('');
    let sel = null;
    const draw = () => {
      tb.innerHTML = G.map((row, r) => `<tr><th scope="row">${rows[r] === 'Offen' ? 'Offen' : rows[r]}</th>${row.map((c, d) => `<td data-r="${r}" data-d="${d}" class="${rows[r] === 'Offen' ? 'free' : ''}" tabindex="-1">${c ? `<button type="button" class="pp-chip ${c.toLowerCase()}${sel && sel[0] === r && sel[1] === d ? ' sel' : ''}" data-r="${r}" data-d="${d}" aria-label="${NAME[c]}dienst ${rows[r]} ${DAYS[d]}">${c}</button>` : ''}</td>`).join('')}</tr>`).join('');
      // Prüfen
      const prob = []; const miss = new Set();
      DAYS.forEach((d, i) => { ['F', 'S', 'N'].forEach((s) => { if (!G.slice(0, 5).some((row) => row[i] === s)) { prob.push(`${d}: ${NAME[s]}dienst fehlt`); miss.add(i); } }); });
      G.slice(0, 5).forEach((row, r) => { row.forEach((c, i) => { if (i < 6 && (c === 'N' || c === 'S') && row[i + 1] === 'F') prob.push(`${rows[r]}: Ruhezeit ${DAYS[i]}→${DAYS[i + 1]} zu kurz`); });
        if (row.filter(Boolean).length > 5) prob.push(`${rows[r]}: mehr als 5 Dienste`); });
      $$('th', th).forEach((h, i) => h.classList.toggle('warn', miss.has(i - 1)));
      sum.classList.toggle('bad', prob.length > 0);
      sum.textContent = prob.length ? `${prob.length} ${prob.length === 1 ? 'Problem' : 'Probleme'}: ${prob.join(' · ')}` : 'Plan vollständig · alle Ruhezeiten eingehalten ✓';
    };
    const move = (a, b) => { if (!a || !b || (a[0] === b[0] && a[1] === b[1])) return; const t = G[b[0]][b[1]]; G[b[0]][b[1]] = G[a[0]][a[1]]; G[a[0]][a[1]] = t; };
    let drag = null;
    w.addEventListener('pointerdown', (e) => { const c = e.target.closest('.pp-chip'); if (!c) return; drag = { r: +c.dataset.r, d: +c.dataset.d, x: e.clientX, y: e.clientY, el: null, src: c }; c.setPointerCapture(e.pointerId); });
    w.addEventListener('pointermove', (e) => { if (!drag) return; if (!drag.el && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) { drag.el = drag.src.cloneNode(true); drag.el.classList.add('drag'); document.body.appendChild(drag.el); drag.src.style.opacity = '.3'; }
      if (drag.el) { drag.el.style.left = (e.clientX - 32) + 'px'; drag.el.style.top = (e.clientY - 18) + 'px'; $$('td.over', w).forEach((t) => t.classList.remove('over')); const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('td[data-r]'); if (t && w.contains(t)) t.classList.add('over'); } });
    const up = (e) => { if (!drag) return; const d = drag; drag = null;
      if (d.el) { d.el.remove(); const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('td[data-r]'); if (t && w.contains(t)) move([d.r, d.d], [+t.dataset.r, +t.dataset.d]); sel = null; draw(); }
      else { if (sel && !(sel[0] === d.r && sel[1] === d.d)) { move(sel, [d.r, d.d]); sel = null; } else sel = sel ? null : [d.r, d.d]; draw(); } };
    w.addEventListener('pointerup', up); w.addEventListener('pointercancel', () => { if (drag?.el) drag.el.remove(); drag = null; draw(); });
    w.addEventListener('click', (e) => { if (e.target.closest('.pp-chip')) return; const t = e.target.closest('td[data-r]'); if (t && sel) { move(sel, [+t.dataset.r, +t.dataset.d]); sel = null; draw(); } });
    w.addEventListener('keydown', (e) => { const c = e.target.closest('.pp-chip'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); sel = [+c.dataset.r, +c.dataset.d]; draw(); w.querySelector('.pp-chip.sel')?.focus(); }
      if (sel && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); const [r, d] = sel; const n = [r + (e.key === 'ArrowDown') - (e.key === 'ArrowUp'), d + (e.key === 'ArrowRight') - (e.key === 'ArrowLeft')];
        if (n[0] >= 0 && n[0] < rows.length && n[1] >= 0 && n[1] < 7) { move(sel, n); sel = n; draw(); w.querySelector('.pp-chip.sel')?.focus(); } } });
    w.querySelector('[data-reset]')?.addEventListener('click', () => { rows.forEach((r, i) => { G[i] = plan[r].split('').map((c) => (c === '.' ? '' : c)); }); sel = null; draw(); });
    draw();
  });

  // Handy-Klickprototyp: Ansichten per data-go
  $$('[data-pp-phone]').forEach((w) => {
    const views = $$('.pp-view', w); const steps = $$('.pp-steps li', w);
    const go = (id) => { const k = views.findIndex((v) => v.dataset.view === id); views.forEach((v, i) => { v.setAttribute('aria-hidden', String(i !== k)); v.classList.toggle('back', i < k); });
      steps.forEach((s, i) => s.classList.toggle('on', i === k)); if (id === 'lager' && w.dataset.done) w.classList.add('sent'); };
    w.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) { if (b.dataset.go === 'fertig') w.dataset.done = '1'; go(b.dataset.go); }
      const s = e.target.closest('[data-step]'); if (s) { const o = s.parentElement.querySelector('output'); const v = Math.max(0, +o.textContent + +s.dataset.step * +o.dataset.inc); o.textContent = v; } });
    go('lager');
  });

  // Baustellen-Board: Karte antippen = nächste Spalte; zeigt sich beim Hineinscrollen einmal selbst
  $$('[data-pp-kan]').forEach((w) => {
    const cols = $$('.pp-col', w); let touched = false;
    const count = () => cols.forEach((c) => { c.querySelector('h6 em').textContent = c.querySelectorAll('.pp-card').length; });
    const adv = (card) => { const i = cols.indexOf(card.closest('.pp-col')); const ni = (i + 1) % cols.length; const pr = card.querySelector('.pr i'); if (pr) pr.style.width = [12, 35, 70, 100][ni] + '%';
      cols[ni].appendChild(card); card.classList.remove('flash'); void card.offsetWidth; if (!RM) card.classList.add('flash'); count(); };
    w.addEventListener('click', (e) => { const c = e.target.closest('.pp-card'); if (c) { touched = true; adv(c); } });
    count();
    if (!RM && 'IntersectionObserver' in window) { let n = 0; const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { o.disconnect(); const tick = () => { if (touched || n >= 3) return; const c = cols[n === 2 ? 1 : n].querySelector('.pp-card'); if (c) adv(c); n++; setTimeout(tick, 1800); }; setTimeout(tick, 1400); } }, { threshold: .5 }); o.observe(w); }
  });
})();
