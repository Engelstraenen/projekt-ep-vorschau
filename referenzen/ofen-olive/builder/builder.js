/* Ofen & Olive · Pizza-Builder (gemeinsam fuer Website und App). Beispiel-Visualisierung von PROJEKT EX.
   Fotos: builder/img/ (Basis je Soße, gebackener Rand, Belag-Freisteller je 3 Varianten, Öl-Overlays). */
(() => {
  const eur = n => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  const BASE = (document.currentScript && document.currentScript.src || location.href).replace(/[^/]*$/, '') + 'img/';
  const SIZES = [
    { id: 's', k: 'S', name: 'Klein', cm: 26, preis: 7.9, d: .72 },
    { id: 'm', k: 'M', name: 'Mittel', cm: 30, preis: 9.5, d: .84 },
    { id: 'l', k: 'L', name: 'Groß', cm: 36, preis: 12.5, d: 1 }
  ];
  // Eine Soße ist immer aktiv
  const SAUCES = [
    { id: 'tomate', name: 'Tomatensoße', short: 'Tomate', img: 'base-roh', preis: 0 },
    { id: 'creme', name: 'Crème fraîche', short: 'Crème fraîche', img: 'base-creme', preis: .5 },
    { id: 'hollandaise', name: 'Sauce hollandaise', short: 'Hollandaise', img: 'base-hollandaise', preis: .8 },
    { id: 'bbq', name: 'Barbecue', short: 'Barbecue', img: 'base-bbq', preis: .5 },
    { id: 'pesto', name: 'Pesto', short: 'Pesto', img: 'base-pesto', preis: .9 }
  ];
  // Groesse = Anteil am Pizzadurchmesser (Fotos ~ realer Massstab)
  const TOPS = [
    { id: 'salami', name: 'Salami', preis: 1.5, sz: .12 },
    { id: 'schinken', name: 'Kochschinken', preis: 1.5, sz: .13 },
    { id: 'parma', name: 'Parmaschinken', preis: 2.5, sz: .13, late: 1 },
    { id: 'champignon', name: 'Champignon', preis: 1.0, sz: .10 },
    { id: 'artischocke', name: 'Artischocke', preis: 1.5, sz: .09 },
    { id: 'oliven', name: 'Oliven', preis: 1.2, sz: .062 },
    { id: 'kapern', name: 'Kapern', preis: .9, sz: .045 },
    { id: 'peperoni', name: 'Peperoni', preis: .9, sz: .07 },
    { id: 'paprika', name: 'Paprika', preis: .9, sz: .12 },
    { id: 'zwiebel', name: 'Rote Zwiebel', preis: .7, sz: .11 },
    { id: 'tomate', name: 'Tomate', preis: .9, sz: .105 },
    { id: 'mais', name: 'Mais', preis: .7, sz: .07 },
    { id: 'spinat', name: 'Spinat', preis: 1.0, sz: .10 },
    { id: 'rucola', name: 'Rucola', preis: 1.0, sz: .12, late: 1 },
    { id: 'basilikum', name: 'Basilikum', preis: .5, sz: .10, late: 1 }
  ];
  const CHEESE = { id: 'mozzarella', name: 'Fior di Latte', sz: .108, n: 15 };
  const OILS = [
    { id: 'knoblauch', name: 'Knoblauchöl', preis: .5 },
    { id: 'chili', name: 'Chiliöl', preis: .5 }
  ];
  const ALL = [...TOPS, CHEESE];
  const VAR = 3, R_IN = .80; // Soßenspiegel endet bei ~0.78 des Radius
  const BAKE_MS = 1300; // Mitte der Spanne 1–1,5 s
  // Stuecke pro Tippen: klein ~14, mittel ~10, grosse Scheiben ~8 (mehrere Radien)
  const perTap = t => t.id === 'mozzarella' ? t.n : t.sz < .08 ? 14 : t.sz < .115 ? 10 : 8;
  const src = (id, v) => `${BASE}${id}-${v}.webp`;
  const img = (id, v = 1) => `<img src="${src(id, v)}" alt="" draggable="false" decoding="async">`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const chip = (cls, data, label, ico, aria) => `<li><button type="button" class="bz__chip ${cls}" ${data} aria-label="${aria}"><span class="bz__ico">${ico}</span><span class="bz__lbl">${label}</span><span class="bz__badge" hidden>1</span></button>${cls === 'is-radio' ? '' : `<button type="button" class="bz__minus" data-m="${data.split('"')[1]}" aria-label="${label} entfernen" hidden>−</button>`}</li>`;

  function mount(root, opt = {}) {
    const st = { size: 1, sauce: 'tomate', cheese: true, n: {}, oil: {}, pieces: [], phase: 'build' };
    TOPS.forEach(t => st.n[t.id] = 0); OILS.forEach(o => st.oil[o.id] = 0);
    root.classList.add('bz');
    root.innerHTML = `
      <div class="bz__head">
        <h2 class="bz__h">${opt.title || 'Bau dir deine <em>Pizza</em>'}</h2>
        <div class="bz__size" role="radiogroup" aria-label="Größe">
          ${SIZES.map((s, i) => `<button type="button" role="radio" aria-checked="${i === st.size}" data-s="${i}" aria-label="${s.name} ${s.cm} cm">${s.k}</button>`).join('')}
          <span class="bz__sizepill" aria-hidden="true"></span>
        </div>
      </div>
      <div class="bz__top">
      <div class="bz__stage">
        <div class="bz__plate" aria-hidden="true"></div>
        <div class="bz__oven" aria-hidden="true"></div>
        <div class="bz__fire" aria-hidden="true">${Array.from({ length: 14 }, (_, k) => `<i style="--k:${k}"></i>`).join('')}</div>
        <div class="bz__pie" role="img" aria-label="Deine Pizza">
          ${SAUCES.map(s => `<img class="bz__base" data-b="${s.id}" src="${BASE}${s.img}.webp" alt="" draggable="false"${s.id === 'tomate' ? '' : ' loading="lazy"'}>`).join('')}
          <img class="bz__baked" src="${BASE}base-gebacken.webp" alt="" draggable="false">
          <span class="bz__char" aria-hidden="true"></span>
          <div class="bz__oils"></div><div class="bz__tops"></div><div class="bz__late"></div>
        </div>
        <div class="bz__steam" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <p class="bz__cm" aria-live="polite"></p>
        <div class="bz__heat" aria-hidden="true"><span></span></div>
      </div>
      <div class="bz__dock">
        <button type="button" class="bz__reset">Neu</button>
        <button type="button" class="bz__cta"><span class="bz__ctal">In den Ofen</span><span class="bz__ctap"></span><span class="bz__prog" aria-hidden="true"></span></button>
      </div>
      <p class="bz__hint" aria-live="polite"></p>
      </div>
      <div class="bz__sec"><h3 class="bz__st">Belag <span>antippen oder ziehen</span></h3>
        <ul class="bz__grid" role="list">${TOPS.map(t => chip('', `data-t="${t.id}"`, t.name, img(t.id, 1), `${t.name} hinzufügen, ${eur(t.preis)}`)).join('')}</ul></div>
      <div class="bz__sec"><h3 class="bz__st">Soße <span>eine zur Wahl</span></h3>
        <ul class="bz__grid bz__grid--sauce" role="radiogroup" aria-label="Soße">${SAUCES.map(s => `<li><button type="button" role="radio" class="bz__chip is-radio" data-sauce="${s.id}" aria-label="${s.name}${s.preis ? ', ' + eur(s.preis) : ''}"><span class="bz__ico bz__ico--sauce"><img src="${BASE}${s.img}.webp" alt="" draggable="false" loading="lazy"></span><span class="bz__lbl">${s.short}</span></button></li>`).join('')}</ul></div>
      <div class="bz__sec"><h3 class="bz__st">Käse &amp; Öl</h3>
        <ul class="bz__grid">${chip('', 'data-c="mozzarella"', CHEESE.name, img('mozzarella', 1), 'Fior di Latte, inklusive')}${OILS.map(o => chip('', `data-o="${o.id}"`, o.name, `<img src="${BASE}oel-${o.id}.webp" alt="" draggable="false" class="bz__oilico">`, `${o.name} hinzufügen, ${eur(o.preis)}`)).join('')}</ul></div>
`;
    const q = s => root.querySelector(s), qa = s => [...root.querySelectorAll(s)];
    const pie = q('.bz__pie'), tops = q('.bz__tops'), late = q('.bz__late'), oils = q('.bz__oils'), cta = q('.bz__cta');
    const sauceOf = () => SAUCES.find(s => s.id === st.sauce);

    const price = () => SIZES[st.size].preis + sauceOf().preis
      + TOPS.reduce((s, t) => s + (st.n[t.id] ? t.preis * Math.ceil(st.n[t.id] / perTap(t)) : 0), 0)
      + OILS.reduce((s, o) => s + o.preis * st.oil[o.id], 0);
    function sync() {
      const s = SIZES[st.size];
      root.style.setProperty('--d', s.d);
      root.dataset.sauce = st.sauce;
      q('.bz__size').dataset.i = st.size;
      qa('.bz__size button').forEach((b, i) => b.setAttribute('aria-checked', i === st.size));
      qa('[data-sauce]').forEach(b => { const on = b.dataset.sauce === st.sauce; b.setAttribute('aria-checked', on); b.classList.toggle('is-on', on); });
      qa('.bz__base').forEach(b => b.classList.toggle('is-on', b.dataset.b === st.sauce));
      q('.bz__cm').textContent = `${s.name} · ${s.cm} cm`;
      q('.bz__ctap').textContent = eur(price());
      const badge = (sel, k, minus) => {
        const b = q(sel + ' .bz__badge'); b.hidden = !k; b.textContent = k > 1 ? '×' + k : '✓';
        q(sel).classList.toggle('is-on', !!k); q(`[data-m="${minus}"]`).hidden = !k;
      };
      TOPS.forEach(t => badge(`[data-t="${t.id}"]`, Math.ceil(st.n[t.id] / perTap(t)), t.id));
      OILS.forEach(o => badge(`[data-o="${o.id}"]`, st.oil[o.id], o.id));
      badge('[data-c="mozzarella"]', +st.cheese, 'mozzarella');
      q('[data-c="mozzarella"]').setAttribute('aria-label', st.cheese ? 'Fior di Latte, inklusive' : 'Fior di Latte wieder hinzufügen');
      if (st.phase === 'build') {
        const any = Object.values(st.n).some(Boolean) || Object.values(st.oil).some(Boolean);
        q('.bz__hint').textContent = !st.cheese && !any ? 'Ohne Käse, ganz wie du magst. Jetzt Belag drauf.' : any ? 'Sieht gut aus. Ab in den Ofen?' : `${sauceOf().name} und Fior di Latte sind drauf. Jetzt Belag.`;
      }
    }
    function bump(el) { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }

    // Verteilung wie beim Pizzaiolo: pro Tippen MEHRERE konzentrische Ringe (außen + mitte + innen),
    // mit Winkel-/Radius-Jitter. Kein center-bias; Kruste frei via lim(). spot() hält Abstände.
    const seed = Math.random() * 6.283, GOLD = 2.39996;
    const lim = t => R_IN - t.sz * .8;
    function targets(t, count) {
      const rmax = lim(t), out = [], batch = Math.max(1, perTap(t));
      const j = Math.floor(st.pieces.filter(p => p.t === t.id).length / batch);
      const off = seed + t.id.length * 1.3 + j * GOLD + Math.random() * .45;
      // Mehrere Radien gleichzeitig: innen (nicht tot Mitte) + mitte + außen nah am Soßenrand
      const fracs = t.id === 'mozzarella'
        ? [.2, .4, .62, .9]
        : t.sz >= .1 ? [.22, .5, .92] : [.24, .52, .96];
      const nR = fracs.length;
      // Außen bekommt klar die Mehrheit
      const shares = nR === 4
        ? [Math.max(2, Math.round(count * .15)), Math.max(3, Math.round(count * .22)), Math.max(4, Math.round(count * .28))]
        : [Math.max(1, Math.round(count * .18)), Math.max(2, Math.round(count * .28))];
      const plan = [];
      let used = 0;
      for (let ring = 0; ring < nR - 1; ring++) {
        const take = Math.min(shares[ring], count - used - (nR - 1 - ring));
        plan.push([fracs[ring], Math.max(0, take)]); used += Math.max(0, take);
      }
      plan.push([fracs[nR - 1], Math.max(0, count - used)]);
      plan.forEach(([f, take], ring) => {
        if (!take) return;
        const ringOff = off + ring * (.62 + j * .19);
        for (let i = 0; i < take; i++) {
          const a = ringOff + i / take * 6.283 + (Math.random() - .5) * (6.283 / take) * .38;
          // Jitter asymmetrisch nach außen, damit Soßenrand gefüllt bleibt
          const jitter = (Math.random() * .14) - .04;
          const r = Math.max(rmax * .14, Math.min(rmax, rmax * (f + jitter)));
          out.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
        }
      });
      return out;
    }
    function clampIn(x, y, rmax) { const rr = Math.hypot(x, y); return rr > rmax ? { x: x * rmax / rr, y: y * rmax / rr } : { x, y }; }
    function spot(near, t, aim) {
      const rmax = lim(t), goal = near ? clampIn(near.x, near.y, rmax) : aim || { x: 0, y: 0 }, reach = near ? .16 : .09;
      let best = goal, bd = -Infinity;
      for (let i = 0; i < 24; i++) {
        const a = Math.random() * 6.283, r = i ? Math.sqrt(Math.random()) * reach : 0;
        const c = clampIn(goal.x + Math.cos(a) * r, goal.y + Math.sin(a) * r, rmax);
        let d = 9;
        for (const p of st.pieces) {
          const k = p.t === t.id ? .88 : p.t === 'mozzarella' || t.id === 'mozzarella' ? .32 : .52;
          d = Math.min(d, Math.hypot(p.x - c.x, p.y - c.y) / k);
        }
        d = Math.min(d, t.sz * 3.2) - Math.hypot(c.x - goal.x, c.y - goal.y) * (near ? 1.2 : 2.1);
        if (d > bd) { bd = d; best = c; }
      }
      return { x: best.x, y: best.y };
    }
    function place(t, p) {
      const el = document.createElement('span');
      el.className = 'bz__pc bz__pc--' + t.id;
      p.v = p.v || 1 + Math.floor(Math.random() * VAR);
      p.sc = p.sc || (t.id === 'mozzarella' ? .78 + Math.random() * .38 : .82 + Math.random() * .32);
      p.rot = p.rot ?? Math.random() * 360;
      el.innerHTML = img(t.id, p.v);
      el.style.cssText = `left:${50 + p.x * 50}%;top:${50 + p.y * 50}%;width:${t.sz * p.sc * 100}%;--r:${p.rot}deg`;
      (t.late ? late : tops).appendChild(el); return el;
    }
    const tOf = id => ALL.find(x => x.id === id);
    // Belag springt aus dem Feld auf die Pizza
    function fly(id, from, count) {
      const tt = tOf(id), pr = pie.getBoundingClientRect(), aims = targets(tt, count);
      for (let i = 0; i < count; i++) {
        const piece = { t: id, ...spot(null, tt, aims[i]) };
        st.pieces.push(piece); if (id in st.n) st.n[id]++;
        const land = place(tt, piece); piece.el = land;
        if (reduce.matches || !from) continue;
        land.style.opacity = '0';
        const s0 = from.getBoundingClientRect(), size = tt.sz * piece.sc * pr.width;
        const x0 = s0.left + s0.width / 2, y0 = s0.top + s0.height / 2;
        const x1 = pr.left + pr.width * (.5 + piece.x / 2), y1 = pr.top + pr.height * (.5 + piece.y / 2);
        const g = document.createElement('span');
        g.className = 'bz__ghost'; g.innerHTML = img(id, piece.v);
        g.style.cssText = `width:${size}px;left:${x0 - size / 2}px;top:${y0 - size / 2}px`;
        document.body.appendChild(g);
        const lift = Math.min(220, Math.abs(y1 - y0) * .55 + 90), frames = [], N = 14, r0 = piece.rot - 120 + Math.random() * 60;
        for (let k = 0; k <= N; k++) {
          const u = k / N, x = (x1 - x0) * u, y = (y1 - y0) * u - lift * 4 * u * (1 - u);
          const sc = u < .18 ? 1.6 + u * 2 : 1.96 - u * .96;
          frames.push({ transform: `translate(${x}px,${y}px) rotate(${r0 + (piece.rot - r0) * u}deg) scale(${sc})`, offset: u });
        }
        const anim = g.animate(frames, { duration: 620 + i * 30, delay: i * 55, easing: 'cubic-bezier(.3,.1,.3,1)', fill: 'both' });
        anim.onfinish = () => { g.remove(); land.style.opacity = ''; land.classList.add('is-land'); if (i === count - 1) bump(pie); };
      }
      if (from) bump(from.closest('.bz__chip'));
      sync();
    }
    function removeTop(id, all) {
      let k = 0;
      for (let i = st.pieces.length - 1; i >= 0; i--) {
        if (st.pieces[i].t !== id) continue;
        const el = st.pieces[i].el; st.pieces.splice(i, 1); k++;
        if (id in st.n) st.n[id]--;
        el.classList.add('is-out'); setTimeout(() => el.remove(), 260);
        if (!all && (k >= perTap(tOf(id)) || st.n[id] % perTap(tOf(id)) === 0)) break;
      }
      sync();
    }
    // Öl: echter Guss als Foto-Overlay (Screen-Blend), je Tipp ein Schwung in anderer Drehung
    function addOil(id) {
      if (st.oil[id] >= 2) return;
      st.oil[id]++;
      const el = document.createElement('img');
      el.className = 'bz__oil bz__oil--' + id; el.src = `${BASE}oel-${id}.webp`; el.alt = ''; el.dataset.o = id;
      const sc = st.oil[id] === 1 ? .9 : .72;
      el.style.cssText = `--r:${Math.random() * 360}deg;--s:${sc};--x:${(Math.random() - .5) * 8}%;--y:${(Math.random() - .5) * 8}%`;
      oils.appendChild(el); if (!reduce.matches) el.classList.add('is-pour');
      bump(pie); sync();
    }
    function removeOil(id) {
      const els = qa(`.bz__oil[data-o="${id}"]`); const el = els[els.length - 1]; if (!el) return;
      st.oil[id]--; el.classList.add('is-out'); setTimeout(() => el.remove(), 300); sync();
    }
    function setCheese(on, from) {
      if (on === st.cheese) return;
      st.cheese = on;
      if (on) fly('mozzarella', from, CHEESE.n); else removeTop('mozzarella', true);
      sync();
    }
    function reset() {
      st.phase = 'build'; root.classList.remove('is-baking', 'is-done'); root.style.setProperty('--bake', 0);
      st.pieces = []; tops.innerHTML = ''; late.innerHTML = ''; oils.innerHTML = '';
      TOPS.forEach(t => st.n[t.id] = 0); OILS.forEach(o => st.oil[o.id] = 0);
      st.sauce = 'tomate'; st.cheese = true; fly('mozzarella', null, CHEESE.n);
      q('.bz__ctal').textContent = 'In den Ofen'; cta.disabled = false; sync();
    }

    // Groesse
    qa('.bz__size button').forEach(b => b.addEventListener('click', () => { if (st.phase !== 'build') return; st.size = +b.dataset.s; sync(); bump(pie); }));
    // Soße (eine zur Zeit)
    qa('[data-sauce]').forEach(b => b.addEventListener('click', () => { if (st.phase !== 'build' || st.sauce === b.dataset.sauce) return; st.sauce = b.dataset.sauce; bump(b); bump(pie); sync(); }));
    // Käse + Öl
    q('[data-c]').addEventListener('click', e => { if (st.phase === 'build' && !st.cheese) setCheese(true, e.currentTarget.querySelector('.bz__ico')); });
    q('[data-m="mozzarella"]').addEventListener('click', () => { if (st.phase === 'build') setCheese(false); });
    qa('[data-o]').forEach(b => b.addEventListener('click', () => { if (st.phase === 'build') { addOil(b.dataset.o); bump(b); } }));
    OILS.forEach(o => q(`[data-m="${o.id}"]`).addEventListener('click', () => { if (st.phase === 'build') removeOil(o.id); }));
    // Belag: Tippen + Ziehen
    qa('[data-t]').forEach(b => {
      let sx, sy, drag = null;
      b.addEventListener('pointerdown', e => { if (st.phase !== 'build') return; sx = e.clientX; sy = e.clientY; drag = null; b.setPointerCapture(e.pointerId); });
      b.addEventListener('pointermove', e => {
        if (sx == null || st.phase !== 'build') return;
        if (!drag && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) {
          drag = document.createElement('span'); drag.className = 'bz__ghost bz__ghost--drag'; drag.innerHTML = img(b.dataset.t, 1 + Math.floor(Math.random() * VAR));
          document.body.appendChild(drag); root.classList.add('is-drag');
        }
        if (drag) { drag.style.left = e.clientX - 28 + 'px'; drag.style.top = e.clientY - 28 + 'px'; }
      });
      const end = e => {
        if (sx == null) return; sx = null;
        if (drag) {
          drag.remove(); root.classList.remove('is-drag');
          const r = pie.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 2 - 1, y = (e.clientY - r.top) / r.height * 2 - 1;
          if (e.type === 'pointerup' && Math.hypot(x, y) < .9) {
            const t = b.dataset.t, tt = tOf(t), piece = { t, ...spot({ x, y }, tt) };
            st.pieces.push(piece); st.n[t]++;
            piece.el = place(tt, piece); piece.el.classList.add('is-land'); bump(pie); sync();
          }
          drag = null; b.dataset.dragged = '1'; setTimeout(() => delete b.dataset.dragged, 50);
        }
      };
      b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
      b.addEventListener('click', () => {
        if (b.dataset.dragged || st.phase !== 'build') return;
        const t = b.dataset.t, n = perTap(tOf(t)); fly(t, b.querySelector('.bz__ico'), st.n[t] % n === 0 ? n : n - st.n[t] % n);
      });
    });
    TOPS.forEach(t => q(`[data-m="${t.id}"]`).addEventListener('click', () => { if (st.phase === 'build') removeTop(t.id); }));
    q('.bz__reset').addEventListener('click', reset);

    // Backen: Zeitraffer, gebackener Rand blendet ein, Belag wird waermer
    cta.addEventListener('click', () => {
      if (st.phase === 'done') { opt.onDone && opt.onDone(order()); return; }
      if (st.phase !== 'build') return;
      st.phase = 'bake'; cta.disabled = true;
      root.classList.add('is-baking');
      const top = q('.bz__top'), r = top.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) top.scrollIntoView({ block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
      const dur = reduce.matches ? 0 : BAKE_MS, t0 = performance.now(), lbl = q('.bz__ctal');
      q('.bz__hint').textContent = 'Zeitraffer: knusprig bei 450 Grad.';
      (function tick(now) {
        const u = dur ? Math.min(1, (now - t0) / dur) : 1;
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
      const s = SIZES[st.size], so = sauceOf();
      const belag = TOPS.filter(t => st.n[t.id]).map(t => ({ ...t, x: Math.ceil(st.n[t.id] / perTap(t)) }))
        .concat(OILS.filter(o => st.oil[o.id]).map(o => ({ ...o, x: st.oil[o.id] })));
      const parts = [so.name, st.cheese ? 'Fior di Latte' : 'ohne Käse', ...belag.map(t => (t.x > 1 ? t.x + '× ' : '') + t.name)];
      return { size: s, preis: price(), sauce: so, kaese: st.cheese, belag, label: `${s.name} ${s.cm} cm · ${parts.join(', ')}` };
    }
    root.style.setProperty('--bake', 0);
    fly('mozzarella', null, CHEESE.n);
    sync();
    return { reset, order };
  }
  window.OOBuilder = { mount, eur };
})();
