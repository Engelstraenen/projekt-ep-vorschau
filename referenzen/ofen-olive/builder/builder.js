/* Ofen & Olive · Pizza-Builder (gemeinsam fuer Website und App). Beispiel-Visualisierung von PROJEKT EX. */
(() => {
  const eur = n => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  const SIZES = [
    { id: 's', k: 'S', name: 'Klein', cm: 26, preis: 7.9, d: .70 },
    { id: 'm', k: 'M', name: 'Mittel', cm: 30, preis: 9.5, d: .84 },
    { id: 'l', k: 'L', name: 'Groß', cm: 36, preis: 12.5, d: 1 }
  ];
  // Belag-Sprites als SVG (viewBox 0 0 40 40)
  const SV = {
    salami: '<circle cx="20" cy="20" r="17" fill="#A3271F"/><circle cx="20" cy="20" r="17" fill="none" stroke="#7A1A14" stroke-width="2"/><circle cx="13" cy="15" r="2.4" fill="#E9A28E"/><circle cx="25" cy="12" r="1.8" fill="#E9A28E"/><circle cx="22" cy="25" r="2.6" fill="#E9A28E"/><circle cx="12" cy="25" r="1.6" fill="#E9A28E"/><circle cx="28" cy="21" r="1.5" fill="#E9A28E"/>',
    champignon: '<path d="M6 19c0-8 6.5-13 14-13s14 5 14 13c0 2-1.5 3-3.5 3H9.5C7.5 22 6 21 6 19z" fill="#E8DCCB" stroke="#B9A68C" stroke-width="1.4"/><path d="M15 22h10l-1.5 11c-.2 1.4-1.3 2-2.5 2h-2c-1.2 0-2.3-.6-2.5-2z" fill="#F3EADB" stroke="#B9A68C" stroke-width="1.4"/><path d="M11 19.5c2-1 5-1.4 9-1.4s7 .4 9 1.4" fill="none" stroke="#C7B394" stroke-width="1.2"/>',
    oliven: '<circle cx="20" cy="20" r="13" fill="#2B2620"/><circle cx="20" cy="20" r="5.5" fill="#6B5A3A"/><circle cx="20" cy="20" r="13" fill="none" stroke="#4A4034" stroke-width="2"/><path d="M12 13a11 11 0 0 1 7-4" stroke="#7D6E57" stroke-width="2" fill="none" stroke-linecap="round"/>',
    basilikum: '<path d="M20 4C10 9 7 20 11 31c1.3 3.5 3.5 5 6 5 1 0 2-.4 3-1 1 .6 2 1 3 1 2.5 0 4.7-1.5 6-5 4-11 1-22-9-27z" fill="#3E7A2E"/><path d="M20 6v29" stroke="#2C5A20" stroke-width="1.6" fill="none"/><path d="M20 15l-6 5M20 22l-6 5M20 15l6 5M20 22l6 5" stroke="#2C5A20" stroke-width="1.1" fill="none"/>',
    paprika: '<path d="M8 26c3-11 13-17 24-15 2 .4 2 3 0 3.6-8 2-14 7-18 15-1 2-3.5 2-4.5.5C8.6 29 7.6 27.6 8 26z" fill="#4E9A2C"/><path d="M12 25c3-7 9-11 17-12.4" stroke="#8BC456" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    zwiebel: '<circle cx="20" cy="20" r="14" fill="none" stroke="#8E3E73" stroke-width="3.4"/><circle cx="20" cy="20" r="8.5" fill="none" stroke="#B5679A" stroke-width="2.6"/><circle cx="20" cy="20" r="14" fill="none" stroke="#F0D9E6" stroke-width=".8" opacity=".7"/>',
    tomate: '<circle cx="20" cy="20" r="15" fill="#D63A26"/><circle cx="20" cy="20" r="11" fill="#E8604A"/><path d="M20 11v18M12 15l16 10M12 25l16-10" stroke="#F4C0A8" stroke-width="2.4" stroke-linecap="round" opacity=".9"/><circle cx="20" cy="20" r="3" fill="#F7E3C9"/>',
    mozzarella: '<path d="M8 21c-1-7 4-13 11-13 6-.5 13 3 13 10 1 7-5 13-12 13S8 28 8 21z" fill="#FBF6EA"/><path d="M11 21c0-5 4-9 9-9" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M8 21c-1-7 4-13 11-13 6-.5 13 3 13 10 1 7-5 13-12 13S8 28 8 21z" fill="none" stroke="#E8DEC6" stroke-width="1.2"/>'
  };
  const TOPS = [
    { id: 'salami', name: 'Salami', preis: 1.5, sz: .17 },
    { id: 'champignon', name: 'Champignon', preis: 1.0, sz: .15 },
    { id: 'oliven', name: 'Oliven', preis: 1.2, sz: .1 },
    { id: 'basilikum', name: 'Basilikum', preis: .5, sz: .13 },
    { id: 'paprika', name: 'Paprika', preis: .9, sz: .14 },
    { id: 'zwiebel', name: 'Rote Zwiebel', preis: .7, sz: .14 },
    { id: 'tomate', name: 'Tomate', preis: .9, sz: .14 },
    { id: 'mozzarella', name: 'Mozzarella', preis: 2.5, sz: .17 }
  ];
  const PER = 5; // Stuecke pro Tipp
  const svg = id => `<svg viewBox="0 0 40 40" aria-hidden="true">${SV[id]}</svg>`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  function mount(root, opt = {}) {
    const st = { size: 1, n: {}, pieces: [], phase: 'build' };
    TOPS.forEach(t => st.n[t.id] = 0);
    root.classList.add('bz');
    root.innerHTML = `
      <div class="bz__fire" aria-hidden="true">${'<i></i>'.repeat(9)}</div>
      <div class="bz__head">
        <h2 class="bz__h">${opt.title || 'Bau dir deine <em>Pizza</em>'}</h2>
        <div class="bz__size" role="radiogroup" aria-label="Größe">
          ${SIZES.map((s, i) => `<button type="button" role="radio" aria-checked="${i === st.size}" data-s="${i}" aria-label="${s.name} ${s.cm} cm">${s.k}</button>`).join('')}
          <span class="bz__sizepill" aria-hidden="true"></span>
        </div>
      </div>
      <div class="bz__stage">
        <div class="bz__plate" aria-hidden="true"></div>
        <div class="bz__pie" role="img" aria-label="Deine Pizza">
          <div class="bz__crust"></div><div class="bz__sauce"></div><div class="bz__tops"></div><div class="bz__char"></div>
        </div>
        <p class="bz__cm" aria-live="polite"></p>
        <div class="bz__heat" aria-hidden="true"><span></span></div>
      </div>
      <p class="bz__hint" aria-live="polite">Belag antippen oder auf die Pizza ziehen.</p>
      <ul class="bz__grid" role="list">
        ${TOPS.map(t => `<li><button type="button" class="bz__chip" data-t="${t.id}" aria-label="${t.name} hinzufügen, ${eur(t.preis)}"><span class="bz__ico">${svg(t.id)}</span><span class="bz__lbl">${t.name}</span><span class="bz__badge" hidden>1</span></button><button type="button" class="bz__minus" data-m="${t.id}" aria-label="${t.name} entfernen" hidden>−</button></li>`).join('')}
      </ul>
      <div class="bz__dock">
        <button type="button" class="bz__reset">Neu</button>
        <button type="button" class="bz__cta"><span class="bz__ctal">In den Ofen</span><span class="bz__ctap"></span><span class="bz__prog" aria-hidden="true"></span></button>
      </div>`;
    const q = s => root.querySelector(s), qa = s => [...root.querySelectorAll(s)];
    const pie = q('.bz__pie'), tops = q('.bz__tops'), cta = q('.bz__cta');

    const price = () => SIZES[st.size].preis + TOPS.reduce((s, t) => s + (st.n[t.id] ? t.preis * Math.ceil(st.n[t.id] / PER) : 0), 0);
    function sync() {
      const s = SIZES[st.size];
      root.style.setProperty('--d', s.d);
      q('.bz__size').dataset.i = st.size;
      qa('.bz__size button').forEach((b, i) => b.setAttribute('aria-checked', i === st.size));
      q('.bz__cm').textContent = `${s.name} · ${s.cm} cm`;
      q('.bz__ctap').textContent = eur(price());
      TOPS.forEach(t => {
        const k = Math.ceil(st.n[t.id] / PER), b = q(`[data-t="${t.id}"] .bz__badge`);
        b.hidden = !k; b.textContent = k > 1 ? '×' + k : '✓';
        q(`[data-t="${t.id}"]`).classList.toggle('is-on', !!k);
        q(`[data-m="${t.id}"]`).hidden = !k;
      });
      const any = Object.values(st.n).some(Boolean);
      if (st.phase === 'build') q('.bz__hint').textContent = any ? 'Sieht gut aus. Ab in den Ofen?' : 'Belag antippen oder auf die Pizza ziehen.';
    }
    function bump(el) { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }

    // freie Position auf der Pizza (in % vom Radius)
    function spot(near) {
      let best = null, bd = -1;
      for (let i = 0; i < 18; i++) {
        let x, y;
        if (near && i < 6) { x = near.x + (Math.random() - .5) * .3; y = near.y + (Math.random() - .5) * .3; }
        else { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * .66; x = Math.cos(a) * r; y = Math.sin(a) * r; }
        if (Math.hypot(x, y) > .68) continue;
        const d = st.pieces.reduce((m, p) => Math.min(m, Math.hypot(p.x - x, p.y - y)), 9);
        if (d > bd) { bd = d; best = { x, y }; }
      }
      return best || { x: 0, y: 0 };
    }
    function place(t, p) {
      const el = document.createElement('span');
      el.className = 'bz__pc bz__pc--' + t.id; el.innerHTML = svg(t.id);
      const rot = Math.random() * 360;
      el.style.cssText = `left:${50 + p.x * 50}%;top:${50 + p.y * 50}%;width:${t.sz * 100}%;--r:${rot}deg`;
      tops.appendChild(el); return el;
    }
    // Belag springt aus dem Feld auf die Pizza
    function fly(t, from, drop) {
      const tt = TOPS.find(x => x.id === t);
      const count = drop ? 1 : (st.n[t] % PER === 0 ? PER : 1);
      const pr = pie.getBoundingClientRect();
      for (let i = 0; i < count; i++) {
        const p = spot(drop), piece = { t, ...p };
        st.pieces.push(piece); st.n[t]++;
        const land = place(tt, p); piece.el = land; land.style.opacity = '0';
        const s0 = from.getBoundingClientRect();
        const size = tt.sz * pr.width;
        const x0 = s0.left + s0.width / 2, y0 = s0.top + s0.height / 2;
        const x1 = pr.left + pr.width * (.5 + p.x / 2), y1 = pr.top + pr.height * (.5 + p.y / 2);
        if (reduce.matches) { land.style.opacity = ''; continue; }
        const g = document.createElement('span');
        g.className = 'bz__ghost'; g.innerHTML = svg(t);
        g.style.cssText = `width:${size}px;height:${size}px;left:${x0 - size / 2}px;top:${y0 - size / 2}px`;
        document.body.appendChild(g);
        const lift = Math.min(220, Math.abs(y1 - y0) * .55 + 90), frames = [], N = 14, rot = Math.random() * 300 - 150;
        for (let k = 0; k <= N; k++) {
          const u = k / N, x = (x1 - x0) * u, y = (y1 - y0) * u - lift * 4 * u * (1 - u);
          const sc = u < .18 ? 1.5 + u * 2 : 1.86 - u * .86;
          frames.push({ transform: `translate(${x}px,${y}px) rotate(${rot * u}deg) scale(${sc})`, offset: u });
        }
        const anim = g.animate(frames, { duration: 620 + i * 40, delay: i * 70, easing: 'cubic-bezier(.3,.1,.3,1)', fill: 'both' });
        anim.onfinish = () => { g.remove(); land.style.opacity = ''; land.classList.add('is-land'); if (i === count - 1) bump(pie); };
      }
      bump(from); sync();
    }
    function remove(t) {
      const tt = TOPS.find(x => x.id === t);
      let k = 0;
      for (let i = st.pieces.length - 1; i >= 0 && k < PER && st.n[t]; i--) {
        if (st.pieces[i].t !== t) continue;
        const el = st.pieces[i].el; st.pieces.splice(i, 1); st.n[t]--; k++;
        el.classList.add('is-out'); setTimeout(() => el.remove(), 260);
        if (st.n[t] % PER === 0) break;
      }
      sync(); return tt;
    }
    function reset() {
      st.phase = 'build'; root.classList.remove('is-baking', 'is-done'); st.pieces = []; tops.innerHTML = '';
      TOPS.forEach(t => st.n[t.id] = 0); q('.bz__ctal').textContent = 'In den Ofen'; cta.disabled = false; sync();
    }

    // Groesse
    qa('.bz__size button').forEach(b => b.addEventListener('click', () => { if (st.phase !== 'build') return; st.size = +b.dataset.s; sync(); bump(pie); }));
    // Tippen + Ziehen
    qa('.bz__chip').forEach(b => {
      let sx, sy, drag = null;
      b.addEventListener('pointerdown', e => { if (st.phase !== 'build') return; sx = e.clientX; sy = e.clientY; drag = null; b.setPointerCapture(e.pointerId); });
      b.addEventListener('pointermove', e => {
        if (sx == null || st.phase !== 'build') return;
        if (!drag && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) {
          drag = document.createElement('span'); drag.className = 'bz__ghost bz__ghost--drag'; drag.innerHTML = svg(b.dataset.t);
          document.body.appendChild(drag); root.classList.add('is-drag');
        }
        if (drag) { drag.style.left = e.clientX - 28 + 'px'; drag.style.top = e.clientY - 28 + 'px'; }
      });
      const end = e => {
        if (sx == null) return; sx = null;
        if (drag) {
          drag.remove(); root.classList.remove('is-drag');
          const r = pie.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 2 - 1, y = (e.clientY - r.top) / r.height * 2 - 1;
          if (e.type === 'pointerup' && Math.hypot(x, y) < .8) {
            const t = b.dataset.t, tt = TOPS.find(z => z.id === t), p = { x: x * .85, y: y * .85 };
            const piece = { t, ...p }; st.pieces.push(piece); st.n[t]++;
            piece.el = place(tt, p); piece.el.classList.add('is-land'); bump(pie); sync();
          }
          drag = null; b.dataset.dragged = '1'; setTimeout(() => delete b.dataset.dragged, 50);
        }
      };
      b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
      b.addEventListener('click', () => { if (b.dataset.dragged || st.phase !== 'build') return; fly(b.dataset.t, b.querySelector('.bz__ico')); });
    });
    qa('.bz__minus').forEach(b => b.addEventListener('click', () => { if (st.phase === 'build') remove(b.dataset.m); }));
    q('.bz__reset').addEventListener('click', reset);

    // Backen
    cta.addEventListener('click', () => {
      if (st.phase === 'done') { opt.onDone && opt.onDone(order()); return; }
      if (st.phase !== 'build') return;
      st.phase = 'bake'; cta.disabled = true;
      root.classList.add('is-baking');
      const dur = reduce.matches ? 600 : 3200, t0 = performance.now(), lbl = q('.bz__ctal');
      q('.bz__hint').textContent = 'Zeitraffer: 90 Sekunden bei 450 Grad.';
      (function tick(now) {
        const u = Math.min(1, (now - t0) / dur);
        root.style.setProperty('--bake', u.toFixed(3));
        lbl.textContent = `Im Ofen · ${Math.round(u * 450)} °C`;
        if (u < 1) return requestAnimationFrame(tick);
        st.phase = 'done'; root.classList.remove('is-baking'); root.classList.add('is-done'); cta.disabled = false;
        lbl.textContent = opt.doneLabel || 'Fertig · Bestellen';
        q('.bz__hint').textContent = 'Fertig gebacken. Knusprig, mit Leopardenmuster.';
        bump(pie); opt.onBaked && opt.onBaked(order());
      })(t0);
    });
    function order() {
      const s = SIZES[st.size];
      return { size: s, preis: price(), belag: TOPS.filter(t => st.n[t.id]).map(t => ({ ...t, x: Math.ceil(st.n[t.id] / PER) })) };
    }
    root.style.setProperty('--bake', 0);
    sync();
    return { reset, order };
  }
  window.OOBuilder = { mount, eur };
})();
