/* Praxisbeispiele auf Themen-Unterseiten: Vorher/Nachher-Slider, Ladezeit-Ringe, Themen-Netz, KI-Antwort, Report-Blättern,
   A/B-Test, Kampagnen-Ablauf, Feed-Clips, Logo-Wechsel. Ohne Abhängigkeiten. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const io = (els, fn, opt = { threshold: 0.35 }) => {
    if (!('IntersectionObserver' in window)) { els.forEach((e) => fn(e)); return; }
    const o = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { o.unobserve(en.target); fn(en.target); } }), opt);
    els.forEach((e) => o.observe(e));
  };

  // Vorher/Nachher
  const narrow = matchMedia('(max-width: 700px)');
  $$('.px-ba').forEach((ba) => {
    // Handy: Umschalter Vorher/Nachher vor dem Slider einfügen
    const tg = document.createElement('div'); tg.className = 'px-ba-tg';
    tg.innerHTML = '<div class="px-seg" role="group" aria-label="Ansicht wählen"><button type="button" data-v="100" aria-pressed="true">Vorher</button><button type="button" data-v="0" aria-pressed="false">Nachher</button></div>';
    ba.before(tg); let tgTouched = false;
    const tset = (v) => { ba.style.setProperty('--pos', v + '%'); tg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === String(v)))); };
    tg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { tgTouched = true; tset(+b.dataset.v); }));
    if (narrow.matches) { tset(100); io([ba], () => setTimeout(() => { if (!tgTouched && narrow.matches) tset(0); }, RM ? 0 : 1300)); }
    const r = ba.querySelector('input[type=range]');
    const set = (v) => ba.style.setProperty('--pos', v + '%');
    r.addEventListener('input', () => set(r.value)); set(r.value);
    if (!RM && !narrow.matches) io([ba], () => { // kurzer Hinweis-Schwenk, nur wenn noch nicht bedient
      let t0 = null, done = false; r.addEventListener('pointerdown', () => { done = true; }, { once: true });
      const step = (t) => { if (done) return; t0 ??= t; const k = Math.min(1, (t - t0) / 1400); const v = 50 + Math.sin(k * Math.PI * 2) * 18; r.value = v; set(v); if (k < 1) requestAnimationFrame(step); };
      setTimeout(() => requestAnimationFrame(step), 300);
    });
  });

  // Einblenden
  io($$('[data-px-in]'), (e) => e.classList.add('is-in'), { threshold: 0.25 });

  // Ladezeit-Ringe
  $$('[data-px-speed]').forEach((w) => {
    const btns = $$('.px-seg button', w); let touched = false;
    const show = (st) => {
      w.dataset.state = st;
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.set === st)));
      $$('.px-ring', w).forEach((r) => {
        const [v, tone, label] = r.dataset[st].split('|');
        r.style.setProperty('--v', v); r.dataset.tone = tone; r.querySelector('.val').textContent = label;
      });
    };
    btns.forEach((b) => b.addEventListener('click', () => { touched = true; show(b.dataset.set); }));
    show('before');
    io([w], () => { if (!touched) setTimeout(() => { if (!touched) show('after'); }, RM ? 0 : 1100); });
  });

  // Themen-Netz: Linien vom Hub zu jedem Knoten
  $$('.px-net').forEach((net) => {
    const svg = net.querySelector('svg'); const hub = net.querySelector('.hub'); const nodes = $$('.px-node:not(.hub)', net);
    const draw = () => {
      const b = net.getBoundingClientRect(); const c = (el) => { const r = el.getBoundingClientRect(); return [r.left - b.left + r.width / 2, r.top - b.top + r.height / 2]; };
      const [hx, hy] = c(hub);
      svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
      svg.innerHTML = nodes.map((n, i) => { const [x, y] = c(n); return `<line x1="${hx}" y1="${hy}" x2="${x}" y2="${y}" style="--i:${i}"${RM ? '' : ' class="pulse"'}/>`; }).join('');
    };
    draw(); addEventListener('resize', draw); setTimeout(draw, 900);
  });

  // KI-Antwort tippen
  $$('[data-px-ai]').forEach((w) => {
    const out = w.querySelector('.txt'); const src = out.dataset.text;
    const html = (s) => s.replace(/\[\[(.+?)\]\]/g, '<mark>$1</mark>');
    const finish = () => { out.innerHTML = html(src); w.classList.add('done'); };
    if (RM) { finish(); return; }
    out.innerHTML = '<span class="caret"></span>';
    io([w], () => {
      const plain = src.replace(/\[\[|\]\]/g, ''); let i = 0;
      const tick = () => {
        i = Math.min(plain.length, i + 2);
        // Markierung erst zeigen, wenn der Text komplett ist
        out.innerHTML = plain.slice(0, i).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '<span class="caret"></span>';
        if (i < plain.length) setTimeout(tick, 22); else setTimeout(finish, 250);
      };
      setTimeout(tick, 500);
    });
  });

  // Report blättern
  $$('.px-rep').forEach((rep) => {
    const box = rep.querySelector('.px-pages'); const pages = $$('.px-page', box); const cnt = rep.querySelector('.cnt');
    const cur = () => { const bl = box.getBoundingClientRect().left; let k = 0, best = 1e9; pages.forEach((p, i) => { const d = Math.abs(p.getBoundingClientRect().left - bl); if (d < best) { best = d; k = i; } }); return k; };
    const upd = () => { cnt.textContent = `Seite ${cur() + 1} / ${pages.length}`; };
    const go = (d) => { const k = Math.max(0, Math.min(pages.length - 1, cur() + d)); box.scrollTo({ left: pages[k].offsetLeft - box.offsetLeft - 4, behavior: RM ? 'auto' : 'smooth' }); };
    rep.querySelector('[data-dir="-1"]').addEventListener('click', () => go(-1));
    rep.querySelector('[data-dir="1"]').addEventListener('click', () => go(1));
    box.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
  });

  // Segment-Umschalter allgemein (A/B-Test, Logo-Wechsel …): data-px-switch, Ziel-Attribut data-state
  $$('[data-px-switch]').forEach((w) => {
    const btns = $$('.px-seg button', w);
    btns.forEach((b) => b.addEventListener('click', () => { w.dataset.state = b.dataset.set; btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
  });

  // Stumme Clips: nur abspielen, solange sichtbar
  const vids = $$('video[data-px-auto]');
  if (vids.length && 'IntersectionObserver' in window) {
    const o = new IntersectionObserver((es) => es.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting && !RM) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    }), { threshold: 0.4 });
    vids.forEach((v) => o.observe(v));
  }
})();
