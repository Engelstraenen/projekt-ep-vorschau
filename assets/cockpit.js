/* NIVORA Cockpit: Live-Demo eines Business-Dashboards für einen Ski-Shop. Alle Zahlen sind Beispielwerte, NIVORA ist ein eigenes Projekt von PROJEKT EP.
   Rendert in jedes [data-cockpit]. Ohne Abhängigkeiten. Bewegung: kurz, ease-out, prefers-reduced-motion respektiert. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = [ // Name, Kategorie, Preis (nur intern für Umsatz), Lager, Mindestbestand, Gewicht (Beliebtheit)
    ['Altitude 96', 'Ski', 890, 14, 10, 1.0], ['Freeride 106', 'Ski', 940, 6, 8, .7], ['Apex 88', 'Ski', 760, 22, 8, .8],
    ['Glacier Shell', 'Bekleidung', 520, 9, 12, 1.4], ['Summit Shell', 'Bekleidung', 495, 31, 12, 1.1], ['Alpine Pants', 'Bekleidung', 320, 18, 15, 1.2], ['Ivory Shell', 'Bekleidung', 540, 4, 6, .6],
    ['Vista Pro', 'Accessoires', 185, 46, 20, 1.6], ['Apex Helmet', 'Accessoires', 225, 12, 15, 1.0], ['Junior Helmet', 'Accessoires', 129, 27, 10, .7]];
  const CATS = ['Alle', 'Ski', 'Bekleidung', 'Accessoires'];
  const PER = { '7': { n: 7, lab: (i) => ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i], name: 'letzte 7 Tage', unit: 'Tag' },
    '30': { n: 30, lab: (i) => (i % 5 === 0 ? `${i + 1}.` : ''), name: 'letzte 30 Tage', unit: 'Tag' },
    '12w': { n: 12, lab: (i) => `KW ${36 + i}`, name: 'letzte 12 Wochen', unit: 'Woche' } };
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  // Verkaufte Stück je Produkt und Zeitpunkt (deterministisch, Saisonanstieg, Wochenende stärker)
  const DATA = {};
  Object.entries(PER).forEach(([k, p]) => { seed = k === '7' ? 11 : k === '30' ? 23 : 37;
    DATA[k] = P.map((pr) => Array.from({ length: p.n }, (_, i) => { const trend = k === '12w' ? 1 + i * .16 : 1 + i / p.n * .5; const wk = k === '7' ? [1, .9, 1, 1.1, 1.3, 1.6, 1.2][i] : 1;
      const base = k === '12w' ? 9 : 1.3; return Math.max(0, Math.round(base * pr[5] * trend * wk * (.7 + rnd() * .6))); })); });
  const eur = (n) => Math.round(n).toLocaleString('de-DE') + ' €';
  const num = (n) => Math.round(n).toLocaleString('de-DE');
  const pct = (n) => (n >= 0 ? '+' : '−') + Math.abs(n).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' %';
  const ic = { box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    up: '<path d="M7 14l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>' };
  const svg = (k, c = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${c}">${ic[k]}</svg>`;

  document.querySelectorAll('[data-cockpit]').forEach((root) => {
    const S = { per: root.dataset.per || '30', cat: 'Alle', sort: 'u', dir: -1, ordered: new Set(), live: 0 };
    root.innerHTML = `
      <div class="ck-top"><div class="ck-brand"><span class="ck-logo" aria-hidden="true">N</span><b>NIVORA</b><span>Cockpit</span></div>
        <div class="ck-live" aria-hidden="true"><i></i>Live-Demo</div>
        <div class="ck-filters"><div class="ck-seg" role="group" aria-label="Zeitraum">${Object.entries(PER).map(([k]) => `<button type="button" data-per="${k}">${k === '12w' ? '12 Wochen' : k + ' Tage'}</button>`).join('')}</div>
        <div class="ck-chips" role="group" aria-label="Kategorie">${CATS.map((c) => `<button type="button" data-cat="${c}">${c}</button>`).join('')}</div></div></div>
      <div class="ck-kpis">${['Umsatz', 'Bestellungen', 'Ø Warenkorb', 'Retourenquote'].map((t, i) => `<div class="ck-kpi" data-i="${i}"><small>${t}</small><b>–</b><em></em></div>`).join('')}</div>
      <div class="ck-row">
        <section class="ck-card ck-chart" aria-label="Umsatzverlauf"><header><h4>Umsatz</h4><span class="ck-per"></span></header>
          <div class="ck-plot"><svg viewBox="0 0 640 220" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ckG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3FF" stop-opacity=".35"/><stop offset="1" stop-color="#8FD3FF" stop-opacity="0"/></linearGradient></defs>
            <g class="ck-gl"></g><path class="ck-prev" fill="none"/><path class="ck-area"/><path class="ck-line" fill="none"/><line class="ck-x" y1="0" y2="220"/><circle class="ck-dot" r="5"/></svg>
            <div class="ck-tip" aria-hidden="true"></div><div class="ck-xl"></div></div>
          <p class="ck-leg"><span><i></i>Aktueller Zeitraum</span><span><i class="p"></i>Vorperiode</span></p></section>
        <section class="ck-card ck-mix" aria-label="Umsatz nach Kanal"><header><h4>Kanäle</h4></header><div class="ck-donut"><svg viewBox="0 0 120 120" aria-hidden="true"></svg><div class="ck-dc"><b></b><small>Online-Anteil</small></div></div><ul class="ck-dl"></ul></section>
      </div>
      <div class="ck-row">
        <section class="ck-card ck-tbl" aria-label="Top-Produkte"><header><h4>Top-Produkte</h4><span class="ck-hint">Spalte antippen zum Sortieren</span></header>
          <div class="ck-scroll"><table><thead><tr><th scope="col">Produkt</th><th scope="col"><button type="button" data-sort="u">Verkauft</button></th><th scope="col"><button type="button" data-sort="r">Umsatz</button></th><th scope="col"><button type="button" data-sort="s">Lager</button></th></tr></thead><tbody></tbody></table></div></section>
        <section class="ck-card ck-alert" aria-label="Lager-Warnungen"><header><h4>${svg('bell')} Nachbestellen</h4><span class="ck-cnt"></span></header><ul class="ck-al"></ul><p class="ck-toast" role="status" aria-live="polite"></p></section>
      </div>
      <p class="ck-foot">Beispielwerte · NIVORA ist ein eigenes Projekt von PROJEKT EP · Daten aus Shop, Kasse und Lager in einer Ansicht</p>`;
    const $ = (s) => root.querySelector(s); const $$ = (s) => [...root.querySelectorAll(s)];
    const sel = () => P.map((p, i) => i).filter((i) => S.cat === 'Alle' || P[i][1] === S.cat);
    const series = (k, f = 1) => { const ids = sel(); const n = PER[k].n; return Array.from({ length: n }, (_, t) => ids.reduce((a, i) => a + DATA[k][i][t] * P[i][2] * f, 0)); };
    let last = null;
    const tween = (el, to, fmt) => { const from = +el.dataset.v || 0; el.dataset.v = to; if (RM) { el.textContent = fmt(to); return; } const t0 = performance.now();
      const st = (t) => { const k = Math.min(1, (t - t0) / 520); const e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); };
    const render = () => {
      $$('[data-per]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.per === S.per)));
      $$('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === S.cat)));
      const p = PER[S.per]; const cur = series(S.per); const prev = series(S.per, .84).map((v, i) => v * (.9 + .2 * Math.sin(i * 1.7)));
      const rev = cur.reduce((a, b) => a + b, 0) + S.live * 520; const rp = prev.reduce((a, b) => a + b, 0);
      const units = sel().reduce((a, i) => a + DATA[S.per][i].reduce((x, y) => x + y, 0), 0);
      const orders = Math.round(units * .78) + S.live; const op = Math.round(orders / 1.12); const ret = S.cat === 'Bekleidung' ? 9.8 : S.cat === 'Ski' ? 3.1 : S.cat === 'Accessoires' ? 4.4 : 6.2;
      const k = [[rev, eur, (rev / rp - 1) * 100], [orders, num, (orders / op - 1) * 100], [rev / Math.max(1, orders), eur, 2.4], [ret, (v) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' %', -0.8]];
      $$('.ck-kpi').forEach((e, i) => { tween(e.querySelector('b'), k[i][0], k[i][1]); const d = k[i][2]; const good = i === 3 ? d < 0 : d >= 0; const em = e.querySelector('em'); em.textContent = pct(d) + ' ggü. Vorperiode'; em.className = good ? 'g' : 'b'; });
      // Diagramm
      const W = 640, H = 220, mx = Math.max(...cur, ...prev) * 1.12; const xs = (i) => i / (cur.length - 1) * W; const ys = (v) => H - v / mx * (H - 12);
      const pth = (a) => a.map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');
      const line = pth(cur);
      $('.ck-line').setAttribute('d', line); $('.ck-area').setAttribute('d', line + ` L${W} ${H} L0 ${H} Z`); $('.ck-prev').setAttribute('d', pth(prev));
      $('.ck-gl').innerHTML = [0.25, .5, .75].map((f) => `<line x1="0" x2="${W}" y1="${H * f}" y2="${H * f}"/>`).join('');
      $('.ck-xl').innerHTML = cur.map((_, i) => p.lab(i) ? `<span style="left:${i / (cur.length - 1) * 100}%">${p.lab(i)}</span>` : '').join('');
      $('.ck-per').textContent = p.name; last = { cur, xs, ys, p };
      if (!RM) { const L = $('.ck-line').getTotalLength(); const ln = $('.ck-line'); ln.style.transition = 'none'; ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L; ln.getBoundingClientRect(); ln.style.transition = 'stroke-dashoffset .9s cubic-bezier(.23,1,.32,1)'; ln.style.strokeDashoffset = 0; }
      // Kanäle (Beispielwerte)
      const mix = S.cat === 'Ski' ? [52, 18, 30] : S.cat === 'Bekleidung' ? [64, 22, 14] : S.cat === 'Accessoires' ? [58, 30, 12] : [60, 22, 18];
      const cols = ['#8FD3FF', '#D8C3A5', '#5B6B8C']; const names = ['Online-Shop', 'Marktplätze', 'Laden'];
      let a0 = 0; $('.ck-donut svg').innerHTML = mix.map((m, i) => { const c = 2 * Math.PI * 46; const s = `<circle cx="60" cy="60" r="46" fill="none" stroke="${cols[i]}" stroke-width="16" stroke-dasharray="${c * m / 100 - 2} ${c}" stroke-dashoffset="${-c * a0 / 100}" transform="rotate(-90 60 60)"/>`; a0 += m; return s; }).join('');
      $('.ck-dc b').textContent = (mix[0] + mix[1]) + ' %';
      $('.ck-dl').innerHTML = mix.map((m, i) => `<li><i style="background:${cols[i]}"></i>${names[i]}<b>${m} %</b></li>`).join('');
      // Tabelle
      const rows = sel().map((i) => { const u = DATA[S.per][i].reduce((a, b) => a + b, 0); return { i, n: P[i][0], c: P[i][1], u, r: u * P[i][2], s: P[i][3], m: P[i][4] }; });
      rows.sort((a, b) => (a[S.sort] - b[S.sort]) * S.dir);
      $$('[data-sort]').forEach((b) => { b.dataset.on = b.dataset.sort === S.sort ? (S.dir < 0 ? 'down' : 'up') : ''; });
      const smax = Math.max(...P.map((x) => x[3]));
      $('.ck-tbl tbody').innerHTML = rows.map((r) => `<tr><th scope="row"><span>${r.n}</span><small>${r.c}</small></th><td>${num(r.u)}</td><td>${eur(r.r)}</td><td><span class="ck-st ${r.s < r.m && !S.ordered.has(r.i) ? 'low' : ''}"><i style="width:${r.s / smax * 100}%"></i><em style="left:${r.m / smax * 100}%"></em></span><b>${r.s}</b></td></tr>`).join('');
      // Warnungen
      const low = sel().filter((i) => P[i][3] < P[i][4]);
      $('.ck-cnt').textContent = low.filter((i) => !S.ordered.has(i)).length + ' offen';
      $('.ck-al').innerHTML = low.length ? low.map((i) => { const need = P[i][4] * 2 - P[i][3]; const done = S.ordered.has(i);
        return `<li class="${done ? 'done' : ''}"><div><b>${P[i][0]}</b><small>${P[i][3]} auf Lager · Mindestbestand ${P[i][4]}</small></div><button type="button" data-ord="${i}" ${done ? 'disabled' : ''}>${done ? 'Bestellt ✓' : `${need} Stück bestellen`}</button></li>`; }).join('') : '<li class="ok"><div><b>Alles im grünen Bereich</b><small>Kein Artikel unter Mindestbestand</small></div></li>';
    };
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.per) { S.per = b.dataset.per; S.live = 0; render(); }
      else if (b.dataset.cat) { S.cat = b.dataset.cat; render(); }
      else if (b.dataset.sort) { if (S.sort === b.dataset.sort) S.dir *= -1; else { S.sort = b.dataset.sort; S.dir = -1; } render(); }
      else if (b.dataset.ord) { const i = +b.dataset.ord; S.ordered.add(i); render(); const t = $('.ck-toast'); t.textContent = `Bestellvorschlag für ${P[i][0]} an den Lieferanten vorbereitet (Demo)`; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 3200); }
    });
    // Tooltip im Diagramm
    const plot = $('.ck-plot'); const tip = $('.ck-tip');
    const move = (cx) => { if (!last) return; const r = plot.getBoundingClientRect(); const f = Math.max(0, Math.min(1, (cx - r.left) / r.width)); const i = Math.round(f * (last.cur.length - 1));
      const x = last.xs(i), y = last.ys(last.cur[i]); $('.ck-x').setAttribute('x1', x); $('.ck-x').setAttribute('x2', x); $('.ck-dot').setAttribute('cx', x); $('.ck-dot').setAttribute('cy', y);
      plot.classList.add('hov'); tip.innerHTML = `<small>${last.p.unit} ${i + 1}</small><b>${eur(last.cur[i])}</b>`; tip.style.left = (x / 640 * 100) + '%'; tip.style.top = (y / 220 * 100) + '%'; };
    plot.addEventListener('pointermove', (e) => move(e.clientX)); plot.addEventListener('pointerdown', (e) => move(e.clientX)); plot.addEventListener('pointerleave', () => plot.classList.remove('hov'));
    render();
    // Live: gelegentlich neue Bestellung (nur sichtbar, nur ohne reduzierte Bewegung)
    if (!RM && 'IntersectionObserver' in window) { let vis = false; new IntersectionObserver((es) => { vis = es[0].isIntersecting; }, { threshold: .3 }).observe(root);
      setInterval(() => { if (!vis || document.hidden || S.live > 40) return; S.live += 1; const k = root.querySelectorAll('.ck-kpi b'); tween(k[0], +k[0].dataset.v + 520, eur); tween(k[1], +k[1].dataset.v + 1, num); root.classList.remove('ping'); void root.offsetWidth; root.classList.add('ping'); }, 5200); }
  });
})();
