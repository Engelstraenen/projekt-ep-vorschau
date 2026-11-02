/* LUMEN Zahnmedizin – Demo von Projekt EP. Eigenes Script; GSAP/ScrollTrigger lokal. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const DAYN = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const HOURS = { 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 15] };
  const SLOTS = ['08:00', '09:30', '11:00', '14:30', '16:00', '17:30'];
  const REASONS = { kontrolle: 'Kontrolle und Beratung', reinigung: 'Zahnreinigung', aesthetik: 'Ästhetik-Beratung', beratung: 'Zahnersatz, Implantate', schmerz: 'Schmerzen, akut' };
  const pad2 = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const label = (d) => `${DAYN[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.`;

  /* Belegte Zeiten: deterministisch je Datum, damit es wie ein echter Kalender wirkt */
  function busy(isoDate) {
    let h = 0; for (const c of isoDate) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const set = new Set([h % 6, (h >> 3) % 6]);
    const d = new Date(isoDate + 'T12:00:00');
    if (d.getDay() === 5) { set.add(4); set.add(5); } // Freitag bis 15 Uhr
    return set;
  }
  function nextWorkdays(n) {
    const out = []; const d = new Date(); d.setHours(12, 0, 0, 0);
    while (out.length < n) { d.setDate(d.getDate() + 1); if (d.getDay() > 0 && d.getDay() < 6) out.push(new Date(d)); }
    return out;
  }

  /* Kopf: Zustand beim Scrollen, Menü, Öffnungsstatus */
  const head = $('[data-head]');
  if (head) {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      head.classList.toggle('is-scrolled', y > 8);
      const menuOpen = $('[data-menu-btn]')?.getAttribute('aria-expanded') === 'true';
      head.classList.toggle('is-hidden', !menuOpen && y > 640 && y > lastY + 2);
      if (y < lastY - 2) head.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    head.addEventListener('focusin', () => head.classList.remove('is-hidden'));
  }
  const menuBtn = $('[data-menu-btn]'); const menu = $('[data-menu]');
  if (menuBtn && menu) {
    const set = (open) => { menuBtn.setAttribute('aria-expanded', String(open)); menu.hidden = !open; };
    menuBtn.addEventListener('click', () => set(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); menuBtn.focus(); } });
    window.matchMedia('(min-width: 981px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }
  const openEl = $('[data-open]');
  if (openEl) {
    const now = new Date(); const wd = now.getDay(); const h = now.getHours() + now.getMinutes() / 60; const hrs = HOURS[wd];
    const isOpen = !!hrs && h >= hrs[0] && h < hrs[1];
    let txt;
    if (isOpen) txt = `Jetzt geöffnet, bis ${hrs[1]} Uhr`;
    else if (hrs && h < hrs[0]) txt = `Öffnet heute um ${hrs[0]} Uhr`;
    else { let d = (wd + 1) % 7; while (!HOURS[d]) d = (d + 1) % 7; txt = `Geschlossen, öffnet ${d === (wd + 1) % 7 ? 'morgen' : DAYN[d]} um 8 Uhr`; }
    $('[data-open-text]', openEl).textContent = txt; openEl.classList.toggle('is-open', isOpen); openEl.hidden = false;
  }
  const hours = $('[data-hours]');
  if (hours) { const wd = new Date().getDay(); const row = $(`tr[data-d="${wd === 0 || wd === 6 ? 6 : wd}"]`, hours); row?.classList.add('is-today'); }

  /* Termin */
  const form = $('[data-book]');
  if (form) {
    const days = nextWorkdays(6);
    const dayInputs = $$('input[name="tag"]', form);
    dayInputs.forEach((inp, i) => {
      const d = days[i]; if (!d) return;
      inp.value = iso(d); inp.dataset.label = label(d);
      const s = inp.nextElementSibling; s.querySelector('b').textContent = DAYN[d.getDay()]; s.lastChild.textContent = `${d.getDate()}.${d.getMonth() + 1}.`;
    });
    const slotInputs = $$('input[name="zeit"]', form);
    const hint = $('[data-slot-hint]', form);
    const steps = $$('[data-step]', form);
    const sumWhat = $('[data-sum-what]'); const sumWhen = $('[data-sum-when]');
    const prog = $$('[data-progress] li');
    const val = (n) => form.querySelector(`input[name="${n}"]:checked`);
    const flash = (el) => { if (!el || reduce.matches) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); };

    function applySlots(announce) {
      const day = val('tag'); if (!day) return;
      const b = busy(day.value); let moved = false;
      slotInputs.forEach((s, i) => {
        s.disabled = b.has(i);
        const sp = s.nextElementSibling; sp.setAttribute('aria-label', b.has(i) ? `${SLOTS[i]} Uhr, belegt` : `${SLOTS[i]} Uhr`);
        if (s.disabled && s.checked) { s.checked = false; moved = true; }
      });
      if (!val('zeit')) { const f = slotInputs.find((s) => !s.disabled); if (f) f.checked = true; }
      if (hint) hint.textContent = moved && announce ? `Die gewählte Uhrzeit ist an diesem Tag belegt. Wir haben ${val('zeit')?.dataset.label || ''} vorgemerkt.` : '';
    }
    function sync(changed) {
      const a = val('anliegen'), d = val('tag'), z = val('zeit');
      const what = a ? a.dataset.label : 'Bitte Anliegen wählen';
      const when = d && z ? `${d.dataset.label} · ${z.dataset.label}` : '';
      if (sumWhat && sumWhat.textContent !== what) { sumWhat.textContent = what; if (changed) flash(sumWhat); }
      if (sumWhen && sumWhen.textContent !== when) { sumWhen.textContent = when; if (changed) flash(sumWhen); }
      const name = form.elements.name.value.trim(), kontakt = form.elements.kontakt.value.trim(), ds = form.elements.datenschutz.checked;
      const done = [!!a, !!d, !!z, !!(name && kontakt && ds)];
      steps.forEach((s, i) => s.classList.toggle('is-done', done[i]));
      prog.forEach((p, i) => p.classList.toggle('is-on', done[i]));
    }
    form.addEventListener('change', (e) => { if (e.target.name === 'tag') applySlots(true); sync(true); if (e.target.getAttribute('aria-invalid') === 'true') validate(e.target); });
    form.addEventListener('input', (e) => { sync(false); if (e.target.getAttribute('aria-invalid') === 'true') validate(e.target); });

    const rules = {
      name: (el) => el.value.trim().length > 1,
      kontakt: (el) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) || el.value.replace(/[^\d]/g, '').length >= 6,
      datenschutz: (el) => el.checked,
    };
    const errs = { name: 'f-name-err', kontakt: 'f-kontakt-err', datenschutz: 'f-ds-err' };
    function validate(el) {
      const ok = rules[el.name] ? rules[el.name](el) : true;
      el.setAttribute('aria-invalid', String(!ok));
      const e = document.getElementById(errs[el.name]); if (e) { e.hidden = ok; if (!ok) el.setAttribute('aria-describedby', e.id); else el.removeAttribute('aria-describedby'); }
      return ok;
    }
    form.addEventListener('submit', (e) => {
      const bad = ['name', 'kontakt', 'datenschutz'].map((n) => form.elements[n]).filter((el) => !validate(el));
      if (bad.length) { e.preventDefault(); bad[0].focus(); }
    });

    /* Links aus den Behandlungen wählen das passende Anliegen vor */
    $$('a[data-pick]').forEach((a) => a.addEventListener('click', () => {
      const r = form.querySelector(`input[name="anliegen"][value="${a.dataset.pick}"]`); if (r) { r.checked = true; sync(true); }
    }));

    applySlots(false); sync(false);

    /* Hero: nächster freier Termin = erster Tag, erste freie Zeit */
    const nw = $('[data-next-when]');
    if (nw && days[0]) { const b = busy(iso(days[0])); const i = SLOTS.findIndex((_, k) => !b.has(k)); nw.textContent = `${label(days[0])} · ${SLOTS[i]}`; }
    $('[data-next]')?.addEventListener('click', () => { const r = dayInputs[0]; if (r) { r.checked = true; applySlots(false); const f = slotInputs.find((s) => !s.disabled); if (f) f.checked = true; sync(true); } });
  }

  /* Danke-Seite: Auswahl nur lokal anzeigen */
  const thanks = $('[data-thanks]');
  if (thanks) {
    const q = new URLSearchParams(location.search);
    const a = REASONS[q.get('anliegen')]; const t = q.get('tag'); const z = q.get('zeit');
    if (a) $('[data-t-what]').textContent = a;
    if (t && /^\d{4}-\d{2}-\d{2}$/.test(t) && z && /^\d{2}:\d{2}$/.test(z)) { const d = new Date(t + 'T12:00:00'); if (!isNaN(d)) $('[data-t-when]').textContent = `${label(d)} · ${z} Uhr`; }
    if (q.get('ruhe') === 'ja') $('[data-t-ruhe]').hidden = false;
  }

  /* Navigation: aktiver Abschnitt */
  const navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      const a = map.get(en.target.id); if (!a) return;
      if (en.isIntersecting) { navLinks.forEach((l) => l.classList.remove('is-active')); a.classList.add('is-active'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Dock (mobil) */
  const dock = $('[data-dock]'); const hero = $('[data-hero]'); const termin = document.getElementById('termin');
  if (dock && hero && 'IntersectionObserver' in window) {
    let pastHero = false, atBooking = false;
    const upd = () => dock.classList.toggle('is-on', pastHero && !atBooking);
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; upd(); }).observe($('.hero__cta') || hero);
    if (termin) new IntersectionObserver(([en]) => { atBooking = en.isIntersecting; upd(); }, { rootMargin: '0px 0px -30% 0px' }).observe(termin);
  }

  /* Behandlungs-Index ohne GSAP */
  const idxLinks = $$('[data-idx]');
  if (idxLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) idxLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.idx === en.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('[data-chap]').forEach((c) => io.observe(c));
  }

  /* Bewegung (GSAP) */
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (!gsap || !ST) return;
  gsap.registerPlugin(ST);

  // Wörter der Haltung vorbereiten (auch ohne Bewegung harmlos)
  const words = $('[data-words]');
  if (words) {
    const walk = (node) => Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); } });
        node.replaceChild(frag, n);
      }
    });
    walk(words);
  }
  const h1 = $('[data-split]');
  if (h1) {
    const text = h1.textContent.trim(); h1.setAttribute('aria-label', text); h1.textContent = '';
    text.split(' ').forEach((w, i, arr) => { const o = document.createElement('span'); o.className = 'ln'; o.setAttribute('aria-hidden', 'true'); const s = document.createElement('span'); s.textContent = w; o.appendChild(s); h1.appendChild(o); if (i < arr.length - 1) h1.appendChild(document.createTextNode(' ')); });
  }

  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 981px)' }, (ctx) => {
    const { motion, desktop } = ctx.conditions;
    if (!motion) return;
    document.documentElement.classList.add('is-motion');

    // 1) Hero: Wörter steigen aus der Grundlinie, Glas-Karte folgt
    if (h1 && $('.hero__side')) gsap.from($$('.ln > span', h1), { yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.05 });
    if ($('.hero__side')) gsap.from('.hero__side', { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out', delay: 0.35 });
    if ($('[data-next]')) gsap.from('[data-next]', { opacity: 0, y: 16, filter: 'blur(6px)', duration: 0.6, ease: 'power3.out', delay: 0.7, clearProps: 'filter' });

    // 2) Hero-Bild öffnet sich beim Scrollen auf volle Breite
    const frame = $('[data-frame]');
    if (frame) {
      frame.classList.add('is-clip');
      const padPx = () => parseFloat(getComputedStyle(document.querySelector('.wrap')).paddingLeft) || 24;
      gsap.fromTo(frame, { clipPath: () => `inset(0px ${padPx()}px 0px ${padPx()}px round 22px)` }, {
        clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top 75%', end: 'top 8%', scrub: 0.6, invalidateOnRefresh: true },
      });
      gsap.fromTo($('img', frame), { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // 3) Haltung: Wort für Wort ins Licht (Signature)
    if (words) {
      gsap.fromTo($$('.w', words), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: words, start: 'top 82%', end: 'bottom 52%', scrub: 0.4 } });
      gsap.from('.stance__img', { scale: 0.6, opacity: 0, ease: 'none', scrollTrigger: { trigger: words, start: 'top 75%', end: 'top 45%', scrub: 0.4 } });
    }

    // 4) Behandlungsbilder: öffnen sich einmal aus der Mitte
    $$('[data-clip]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(10% 8% 10% 8% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
      gsap.fromTo($('img', el), { scale: 1.14 }, { scale: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
    });

    // 5) Praxis: horizontaler Rundgang (nur Desktop)
    const pin = $('[data-pin]'); const track = $('[data-track]');
    if (desktop && pin && track) {
      document.documentElement.classList.add('js-pin');
      const dist = () => { const last = track.lastElementChild; return Math.max(0, last.offsetLeft + last.offsetWidth - window.innerWidth + (parseFloat(getComputedStyle(track).paddingLeft) || 0)); };
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1 } });
    }

    // 6) Fußzeile: Wortmarke hebt sich
    if ($('.foot__word') && $('[data-hero]')) gsap.from('.foot__word', { yPercent: 35, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    return () => { document.documentElement.classList.remove('is-motion', 'js-pin'); frame?.classList.remove('is-clip'); };
  });
  window.addEventListener('load', () => {
    ST.refresh();
    const id = decodeURIComponent(location.hash.slice(1));
    const t = id && document.getElementById(id);
    if (t) requestAnimationFrame(() => t.scrollIntoView({ behavior: 'instant', block: 'start' }));
  });
  document.fonts?.ready.then(() => ST.refresh());
})();
