/* HAARSCHARF – Eine Umdrehung. Keine Abhängigkeiten. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ?farbe=bg,akzent (z. B. ?farbe=d8d5ce,c8102e) zum Testen der Farbwelt
  const fq = new URLSearchParams(location.search).get('farbe');
  if (fq) { const [b, a] = fq.split(','); const rgb = h => [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).join(', ');
    if (b) { document.documentElement.style.setProperty('--bg', '#' + b); document.documentElement.style.setProperty('--bg-rgb', rgb(b)); }
    if (a) { document.documentElement.style.setProperty('--or', '#' + a); document.documentElement.style.setProperty('--or-rgb', rgb(a)); } }

  // Kopfzeile + Menü
  const hd = $('.hd');
  const onHd = () => hd && hd.classList.toggle('solid', scrollY > 40 || !$('.spin'));
  addEventListener('scroll', onHd, { passive: true }); onHd();
  $('.burger')?.addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); $('.burger').setAttribute('aria-expanded', o); });
  $$('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  // Einblenden
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18 });
  $$('.rv, .kin, [data-bars], [data-count]').forEach(el => io.observe(el));
  // clip-path:circle(0) verhindert Intersection am Element selbst -> Abschnitt beobachten
  const cbox = $('.colorbox'); if (cbox) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { cbox.classList.add('in'); o.disconnect(); } }), { threshold: .25 }).observe(cbox.parentElement);

  // Zähler + Balken
  const fmt = (v, d) => v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const countIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; countIO.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), d = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (reduce) { el.textContent = pre + fmt(to, d) + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => { const k = clamp((t - t0) / dur, 0, 1), e2 = 1 - Math.pow(1 - k, 3); el.textContent = pre + fmt(to * e2, d) + suf; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => countIO.observe(el));
  const barIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$('.f', e.target).forEach(f => f.style.width = f.dataset.w + '%'); barIO.unobserve(e.target); } }), { threshold: .3 });
  $$('[data-bars]').forEach(el => barIO.observe(el));

  // ---------- 360°-Bühne ----------
  const spin = $('.spin');
  if (spin) {
    const stage = $('.stage', spin), brand = $('.brand', spin), prog = $('.dial .prog', spin), deg = $('.deg', spin);
    const panels = $$('.panel', spin), calls = $$('.call', spin), navb = $$('.dialnav button', spin), cta = $('.hero-cta', spin), hint = $('.scrollhint', spin);
    const head = stage, cv = $('canvas.cv', spin), ctx = cv.getContext('2d'); ctx.imageSmoothingQuality = 'high';
    const R = 46, C = 2 * Math.PI * R;
    if (prog) { prog.style.strokeDasharray = C; prog.style.strokeDashoffset = C; }
    // Bildfolge (aus dem 360°-Film) – data-seq="assets/seq/f_###.webp" data-n="120"
    let frames = [], N = +(head.dataset.n || 0), ready = 0, lastIdx = -1, mob = innerWidth < 860;
    const seq = head.dataset[mob ? 'seqm' : 'seq'];
    const masks = []; const mpat = head.dataset[mob ? 'maskm' : 'mask'];
    const startSeq = () => {
      for (let i = 0; i < N; i++) {
        const im = new Image(); im.decoding = 'async';
        im.onload = () => { ready++; if (i === 0 && (!mpat || masks[0].complete)) { head.classList.add('seq'); draw(true); } };
        im.src = seq.replace('###', String(i).padStart(3, '0')); frames.push(im);
        if (mpat) { const m = new Image(); if (i === 0) m.onload = () => { if (frames[0].complete) { head.classList.add('seq'); draw(true); } }; m.src = mpat.replace('###', String(i).padStart(3, '0')); masks.push(m); }
      }
    };
    // Bildfolge erst nach dem Laden holen (Startbild + Titel zuerst, LCP)
    if (seq && N) { if (document.readyState === 'complete') setTimeout(startSeq, 200); else addEventListener('load', () => setTimeout(startSeq, 200)); }
    const off = document.createElement('canvas'), octx = off.getContext('2d');
    function size() { const r = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(innerWidth * r); cv.height = Math.round(innerHeight * r); off.width = cv.width; off.height = cv.height; ctx.imageSmoothingQuality = 'high'; octx.imageSmoothingQuality = 'high'; }
    function cover(img) { const W = cv.width, H = cv.height, iw = img.naturalWidth, ih = img.naturalHeight;
      if (mob && innerHeight > 500) { const h = H * .58, w = h * iw / ih; return [(W - w) / 2, H - h, w, h]; }
      const s = Math.max(W / iw, H / ih); return [(W - iw * s) * .5, (H - ih * s) * .4, iw * s, ih * s]; }
    let curP = 0;
    function draw(force) {
      if (!frames.length) return;
      let idx = clamp(Math.round(curP * (N - 1)), 0, N - 1);
      while (idx > 0 && !frames[idx].complete) idx--;
      if (idx === lastIdx && !force) return; lastIdx = idx;
      const f = frames[idx]; if (!f.complete || !f.naturalWidth) return;
      const [x, y, w, h] = cover(f);
      ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(f, x, y, w, h);
      if (mob && innerHeight > 500) { const bg = getComputedStyle(document.body).backgroundColor, g = ctx.createLinearGradient(0, y, 0, y + h * .18); g.addColorStop(0, bg); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, y - 2, cv.width, h * .18 + 2); }
      // Riesenschrift hinter den Kopf: Schrift zeichnen, dann Person (Bild ∩ Maske) darüber
      const m = masks[idx];
      if (m && m.complete && m.naturalWidth && brand) {
        brand.style.visibility = 'hidden';
        const cs = getComputedStyle(brand), br = brand.getBoundingClientRect(), k = cv.width / innerWidth;
        ctx.save(); ctx.globalAlpha = isNaN(parseFloat(cs.opacity)) ? 1 : parseFloat(cs.opacity); ctx.fillStyle = cs.color; ctx.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * k}px ${cs.fontFamily}`;
        ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
        ctx.fillText(brand.textContent, (br.left + br.width / 2) * k, (br.top + br.height * .86) * k); ctx.restore();
        octx.clearRect(0, 0, off.width, off.height); octx.globalCompositeOperation = 'source-over'; octx.drawImage(m, x, y, w, h);
        octx.globalCompositeOperation = 'source-in'; octx.drawImage(f, x, y, w, h);
        ctx.drawImage(off, 0, 0);
      } else if (brand) brand.style.visibility = '';
    }
    size(); addEventListener('resize', () => { mob = innerWidth < 860; size(); draw(true); });
    const marks = [0, .25, .5, .75, 1];
    function update() {
      const r = spin.getBoundingClientRect(), total = spin.offsetHeight - innerHeight;
      const p = clamp(-r.top / total, 0, 1); curP = p;
      if (prog) prog.style.strokeDashoffset = C * (1 - p);
      if (deg) deg.textContent = Math.round(p * 360) + '°';
      const ch = p < .09 ? -1 : p < .16 ? 0 : p < .38 ? 1 : p < .62 ? 2 : p < .86 ? 3 : 4;
      panels.forEach(el => el.classList.toggle('on', +el.dataset.ch === ch));
      calls.forEach(el => el.classList.toggle('on', +el.dataset.ch === ch));
      navb.forEach((b, i) => b.classList.toggle('on', i === Math.max(ch, 0)));
      if (brand) { brand.style.transform = `translate(calc(-50% - ${p * 140}vw), -54%)`; brand.style.opacity = clamp(1 - p * 12, 0, 1); }
      if (cta) cta.style.opacity = clamp(1 - p * 8, 0, 1), cta.style.pointerEvents = p > .08 ? 'none' : '';
      if (hint) hint.style.opacity = clamp(.7 - p * 8, 0, .7);
      draw();
    }
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true }); update();
    navb.forEach((b, i) => b.addEventListener('click', () => {
      const total = spin.offsetHeight - innerHeight; const target = spin.offsetTop + total * [0, .26, .5, .74, .95][i];
      scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
    }));
    // Film läuft beim Laden kurz von selbst an (Aktion ab der ersten Sekunde)
    if (!reduce && scrollY < 10) { let t0; const auto = t => { t0 = t0 || t; const k = (t - t0) / 1600; if (k < 1 && scrollY < 10) { curP = Math.sin(k * Math.PI) * .06; draw(); requestAnimationFrame(auto); } else if (scrollY < 10) { curP = 0; draw(true); } }; setTimeout(() => requestAnimationFrame(auto), 900); }
  }

  // ---------- Look-Finder ----------
  const quiz = $('.quiz');
  if (quiz) {
    const sel = {}, gsw = $('.gsw');
    const score = () => {
      if (!Object.keys(sel).length) return;
      const looks = $$('.grid6:not([hidden]) .look'); let best = null, bs = -1;
      looks.forEach(l => { const tags = l.dataset.tags.split(' '); const s = Object.values(sel).filter(v => tags.includes(v)).length; l.dataset.s = s; if (s > bs) { bs = s; best = l; } });
      looks.forEach(l => { const s = +l.dataset.s; l.classList.toggle('hit', s === bs && bs > 0); l.classList.toggle('dim', s < bs); });
    };
    $$('.q', quiz).forEach(q => $$('button', q).forEach(b => b.addEventListener('click', () => {
      $$('button', q).forEach(x => x.classList.toggle('on', x === b)); sel[q.dataset.q] = b.dataset.v; score();
    })));
    const setG = (g, anim) => {
      gsw.classList.toggle('w', g === 'w');
      $$('button', gsw).forEach(b => b.setAttribute('aria-selected', b.dataset.g === g));
      $$('.grid6[data-g]').forEach(gr => { gr.hidden = gr.dataset.g !== g; gr.classList.remove('in'); if (!gr.hidden) gr.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }), gr.querySelectorAll('.look.rv').forEach(l => l.classList.add('in')); if (!gr.hidden && anim) { void gr.offsetWidth; gr.classList.add('in'); } });
      score(); try { localStorage.setItem('hs-g', g); } catch (e) {}
    };
    if (gsw) {
      $$('button', gsw).forEach(b => b.addEventListener('click', () => setG(b.dataset.g, true)));
      let g0 = 'm'; try { g0 = new URLSearchParams(location.search).get('g') || localStorage.getItem('hs-g') || 'm'; } catch (e) {}
      if (g0 === 'w') setG('w', false);
    }
  }

  // ---------- Farbe ----------
  const cb = $('.colorbox');
  if (cb) {
    const imgs = $$('img', cb), chips = $$('.chip'), name = $('.cname');
    chips.forEach((c, i) => c.addEventListener('click', () => {
      chips.forEach(x => x.classList.toggle('on', x === c)); imgs.forEach((im, j) => im.classList.toggle('on', j === i));
      if (name) name.textContent = c.dataset.name;
      // Kreis-Reveal aus dem Chip
      cb.animate([{ clipPath: 'circle(8% at 50% 92%)' }, { clipPath: 'circle(80% at 50% 50%)' }], { duration: reduce ? 0 : 900, easing: 'cubic-bezier(.7,0,.2,1)' });
    }));
  }

  // ---------- Stuhl dreht beim Scrollen ----------
  const cw = $('.chairwrap');
  if (cw) addEventListener('scroll', () => { const r = cw.getBoundingClientRect(); const k = clamp(1 - (r.top + r.height / 2) / innerHeight, 0, 1); cw.style.setProperty('--ry', (-22 + k * 34) + 'deg'); }, { passive: true });

  // ---------- Team-Drehteller ----------
  const ts = $('.teamstage');
  if (ts) addEventListener('scroll', () => { const r = ts.getBoundingClientRect(); const k = clamp(1 - r.top / innerHeight, 0, 1.6); ts.style.setProperty('--sc', 1.08 - Math.min(k, 1) * .08); }, { passive: true });

  // ---------- Termin (Beispiel, keine echte Buchung) ----------
  const bk = $('#booking');
  if (bk) {
    const st = { svc: null, sty: null, day: null, slot: null };
    const days = $('.days', bk), slots = $('.slots', bk), sum = $('.sum p', bk), go = $('.sum .btn', bk);
    const wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const now = new Date(); let html = '';
    for (let i = 0, n = 0; n < 7; i++) { const d = new Date(now); d.setDate(now.getDate() + i); if (d.getDay() === 0) continue; html += `<button class="opt" data-d="${d.toISOString().slice(0, 10)}">${i === 0 ? 'Heute' : wd[d.getDay()]}<small>${d.getDate()}.${d.getMonth() + 1}.</small></button>`; n++; }
    days.innerHTML = html;
    const times = ['09:00', '09:45', '10:30', '11:15', '12:00', '13:30', '14:15', '15:00', '15:45', '16:30', '17:15', '18:00'];
    function renderSlots() {
      const seed = (st.day || '') + (st.sty || '');
      let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      slots.innerHTML = times.map((t, i) => { const busy = ((h >> (i % 24)) & 3) === 0 || ((h + i * 7) % 5 === 0); return `<button class="opt" ${busy ? 'disabled' : ''} data-t="${t}">${t}</button>`; }).join('');
      $$('button', slots).forEach(b => b.addEventListener('click', () => { $$('button', slots).forEach(x => x.classList.toggle('on', x === b)); st.slot = b.dataset.t; sync(); }));
    }
    function sync() {
      const sty = st.sty ? $(`.sty[data-s="${st.sty}"]`, bk).dataset.name : 'egal wer';
      sum.innerHTML = `<b>${st.svc || 'Leistung wählen'}</b> · ${sty}${st.day ? ' · ' + new Date(st.day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }) : ''}${st.slot ? ' · ' + st.slot + ' Uhr' : ''}`;
      go.toggleAttribute('disabled', !(st.svc && st.day && st.slot)); go.style.opacity = st.svc && st.day && st.slot ? 1 : .45;
    }
    $$('[data-svc]', bk).forEach(b => b.addEventListener('click', () => { $$('[data-svc]', bk).forEach(x => x.classList.toggle('on', x === b)); st.svc = b.dataset.svc; sync(); }));
    $$('.sty', bk).forEach(b => b.addEventListener('click', () => { $$('.sty', bk).forEach(x => x.classList.toggle('on', x === b)); st.sty = b.dataset.s; renderSlots(); st.slot = null; sync(); }));
    $$('.days .opt', bk).forEach(b => b.addEventListener('click', () => { $$('.days .opt', bk).forEach(x => x.classList.toggle('on', x === b)); st.day = b.dataset.d; renderSlots(); st.slot = null; sync(); }));
    const pre = new URLSearchParams(location.search).get('look'); if (pre) { const b = $(`[data-svc]`, bk); }
    renderSlots(); sync();
    go.addEventListener('click', () => { if (go.hasAttribute('disabled')) return; $('#dlg-ok p').innerHTML = `${sum.innerHTML}.<br>Das ist eine Demo – es wurde nichts gebucht. Im echten Betrieb kommt jetzt eine Bestätigung per SMS und 24 h vorher eine Erinnerung.`; $('#dlg-ok').classList.add('on'); });
  }
  $$('.dlg').forEach(d => d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.classList.remove('on'); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') $$('.dlg.on').forEach(d => d.classList.remove('on')); });

  // ---------- 60-Sekunden-Bewerbung ----------
  const ap = $('.apply');
  if (ap) {
    const steps = $$('.step', ap), bar = $('.prog60 i', ap), tm = $('.timer', ap); let t0 = null, iv;
    const show = i => { steps.forEach((s, j) => s.classList.toggle('on', j === i)); bar.style.width = (i / (steps.length - 1) * 100) + '%'; if (!t0 && i > 0) { t0 = Date.now(); iv = setInterval(() => { const s = Math.max(0, 60 - Math.round((Date.now() - t0) / 1000)); tm.textContent = s + ' s'; }, 500); } if (i === steps.length - 1) clearInterval(iv); };
    $$('[data-next]', ap).forEach(b => b.addEventListener('click', () => { const s = b.closest('.step'); if (b.dataset.pick) { $$('.opt', s).forEach(x => x.classList.toggle('on', x === b)); } show(steps.indexOf(s) + 1); }));
    $('form', ap)?.addEventListener('submit', e => { e.preventDefault(); show(steps.length - 1); });
  }

  // ---------- Beispiel-Bewertungen ----------
  const revs = $$('.rev'); if (revs.length) { let i = 0; revs[0].classList.add('on'); setInterval(() => { revs[i].classList.remove('on'); i = (i + 1) % revs.length; revs[i].classList.add('on'); }, 5200); }

  // ---------- mm-Lineal (Unterseite Schnitt) ----------
  const mm = $('.mm');
  if (mm) {
    const r = $('input', mm), b = $('.out b', mm), t = $('.out p', mm), hb = $('.hairbar', mm);
    const L = [[0.5, 'Fast Haut. Unterste Stufe eines Skin Fades, die Kopfhaut schimmert durch.'], [1.5, 'Sehr kurz. Übergang zwischen Haut und Haar, beliebt für Low und Mid Fades.'], [3, 'Kurz. Klassische Seitenlänge für einen Taper, Kopfhaut kaum sichtbar.'], [6, 'Kurz bis mittel. Deckt die Kopfhaut, wirkt gepflegt und weich.'], [9, 'Mittel. Obere Fade-Stufe oder Seitenlänge für einen weichen Kurzhaarschnitt.'], [12, 'Länger. Oberkopf bei sehr kurzen Schnitten, ab hier beginnt die Schere.']];
    const set = () => { const v = L[r.value]; b.textContent = String(v[0]).replace('.', ',') + ' mm'; t.textContent = v[1]; hb.style.width = (v[0] / 12 * 100) + '%'; };
    r.addEventListener('input', set); set();
  }

  // Zurück an dieselbe Stelle: Unterseiten-Links merken Scrollposition

  // Kalender-Erinnerung „Wann wieder?“ (.ics, lokal erzeugt)
  $$('[data-ics]').forEach(b => b.addEventListener('click', () => {
    const d = new Date(); d.setDate(d.getDate() + 7 * +b.dataset.ics); const z = n => String(n).padStart(2, '0');
    const day = `${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Demo//DE', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@demo', 'DTSTAMP:' + day + 'T090000', 'DTSTART;VALUE=DATE:' + day, 'SUMMARY:' + b.dataset.title, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'erinnerung.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }));
  $$('a[data-sub]').forEach(a => a.addEventListener('click', () => { try { sessionStorage.setItem('hs-back', JSON.stringify({ y: scrollY })); } catch (e) {} }));
  if (location.hash === '#zurueck') { try { const s = JSON.parse(sessionStorage.getItem('hs-back') || 'null'); if (s) { history.replaceState(null, '', location.pathname); requestAnimationFrame(() => scrollTo(0, s.y)); } } catch (e) {} }
})();
