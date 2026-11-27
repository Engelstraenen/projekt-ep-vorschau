/* DR. SCHIWAGO · V3 „Schwarzer Samt“ */
(() => {
  const IMG = window.IMG || {};
  const BASE = document.documentElement.dataset.base || '';
  const RU = document.documentElement.lang === 'ru';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const smooth = t => t * t * (3 - 2 * t);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const phone = matchMedia('(max-width: 720px)').matches;

  /* Bilder: fehlt ein Motiv, verschwindet das Element (keine Platzhalter) */
  $$('[data-need]').forEach(el => { if (!IMG[el.dataset.need]) el.classList.add('is-missing'); });
  const portrait = matchMedia('(max-aspect-ratio: 4/5)').matches;
  $$('img[data-img]').forEach(img => {
    if (img.hasAttribute('data-static')) return; // Startbild: steht schon im HTML (schneller sichtbar)
    let key = img.dataset.img;
    if (portrait && IMG[key + '-m']) key += '-m'; // eigenes Hochformat-Motiv fürs Handy
    const m = IMG[key];
    if (!m) { img.classList.add('is-missing'); return; }
    img.src = BASE + m.s;
    img.srcset = `${BASE + m.s} ${m.sw}w, ${BASE + m.l} ${m.lw}w`;
    img.sizes = img.closest('.bar, .frame, .plate, .gal__item, .course__img') ? '(max-width: 720px) 90vw, 40vw' : '100vw';
    img.decoding = 'async';
    if (!img.closest('.hero, .chero')) img.loading = 'lazy';
    img.width = m.w; img.height = m.h;
  });

  /* Nav */
  const nav = $('#nav');
  const burger = $('.nav__burger');
  burger.addEventListener('click', () => { const o = nav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o); });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); }));

  /* Hero: Licht geht langsam an */
  const hero = $('.hero, .chero');
  const heroImg = hero && $('img[data-img]', hero);
  const lightUp = () => requestAnimationFrame(() => hero && hero.classList.add('is-lit'));
  if (heroImg && !heroImg.classList.contains('is-missing')) {
    if (heroImg.complete && heroImg.naturalWidth) setTimeout(lightUp, 200);
    else { heroImg.addEventListener('load', () => setTimeout(lightUp, 120), { once: true }); setTimeout(lightUp, 2500); }
  } else lightUp();
  if (hero && !touch && !reduce) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width - .5) * -1).toFixed(2) + '%');
    hero.style.setProperty('--my', (((e.clientY - r.top) / r.height - .5) * -.8).toFixed(2) + '%');
  });

  /* Fortschritt */
  const prog = sec => { const r = sec.getBoundingClientRect(); const run = r.height - innerHeight; return run > 0 ? clamp(-r.top / run) : clamp(1 - r.bottom / (innerHeight + r.height)); };
  const pass = sec => { const r = sec.getBoundingClientRect(); return clamp(1 - (r.top + r.height) / (innerHeight + r.height)); };
  const visible = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  const scrollToFrac = (sec, f) => { const top = sec.getBoundingClientRect().top + scrollY; scrollTo({ top: top + (sec.offsetHeight - innerHeight) * f, behavior: reduce ? 'auto' : 'smooth' }); };

  /* 2 · Buffet: weiche Überblendung von Gericht zu Gericht */
  const feast = $('#buffet');
  let F = null;
  if (feast) {
    const scenes = $$('.feast__scene', feast), texts = $$('.feast__text', feast), btns = $$('.feast__nav button', feast);
    const keep = scenes.map(s => !s.classList.contains('is-missing'));
    texts.forEach((t, i) => { if (!keep[i]) t.remove(); }); btns.forEach((b, i) => { if (!keep[i]) b.remove(); });
    const S = scenes.filter((_, i) => keep[i]), T = texts.filter((_, i) => keep[i]), B = btns.filter((_, i) => keep[i]);
    if (S.length) {
      const INTRO = .7, U = INTRO + S.length;
      F = { S, T, B, U, INTRO, k: -2, tafel: $('.feast__tafel', feast) };
      B.forEach((b, i) => b.addEventListener('click', () => scrollToFrac(feast, (INTRO + i + .15) / U)));
    } else feast.classList.add('is-missing');
  }

  /* Tag / Nacht */
  const split = $('#abend');
  const splitStage = split && $('.split__stage', split);
  let manual = null;
  if (splitStage && !split.classList.contains('is-missing')) {
    const knob = $('.split__knob', split);
    let drag = false;
    const set = x => { const r = splitStage.getBoundingClientRect(); manual = clamp((x - r.left) / r.width, .04, .96); };
    knob.addEventListener('pointerdown', e => { drag = true; knob.setPointerCapture(e.pointerId); set(e.clientX); });
    knob.addEventListener('pointermove', e => { if (drag) set(e.clientX); });
    knob.addEventListener('pointerup', () => { drag = false; });
    splitStage.addEventListener('click', e => { if (e.target !== knob) set(e.clientX); });
    knob.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { manual = clamp((manual ?? .5) + (e.key === 'ArrowLeft' ? -.05 : .05), .04, .96); e.preventDefault(); } });
  }

  const wides = $$('.wide');
  const cater = $('#catering');
  const plates = $('#kueche');
  const plateImgs = plates ? $$('.plate img', plates) : [];
  const menuR = $('.menu__pic--r');
  const menuSec = $('#karte');
  const cta = $('.sticky-cta');
  const resvSec = $('#reservieren');
  const heroText = $('.hero__text, .chero__text');

  function frame() {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 40);

    if (hero && heroText) {
      const hp = clamp(y / innerHeight);
      heroText.style.opacity = 1 - hp * 1.6; heroText.style.translate = `0 ${-hp * 50}px`;
    }

    if (F && visible(feast)) {
      const x = prog(feast) * F.U;
      const ix = clamp(x / F.INTRO);
      // Einstieg: Gerichtsnamen ziehen in drei Spalten vorbei, das erste Gericht wird scharf
      const sharp = smooth(clamp((ix - .3) / .7));
      feast.style.setProperty('--io', (.55 * (1 - sharp)).toFixed(3));
      feast.style.setProperty('--iv', (1 - smooth(clamp((ix - .5) / .32))).toFixed(3));
      feast.style.setProperty('--hs', (1 + ix * .06).toFixed(4));
      feast.style.setProperty('--na', (.22 * (1 - smooth(clamp((ix - .5) / .5)))).toFixed(3));
      // Tafel mit allen Gerichten gleitet langsam unter der Überschrift durch
      if (F.tafel) { F.tafel.style.setProperty('--tx', (-ix * 4).toFixed(2) + '%'); F.tafel.style.setProperty('--ty', (-ix * 5).toFixed(2) + '%'); F.tafel.style.setProperty('--ts', (1.02 + ix * .08).toFixed(4)); }
      if (F.S[0]) { F.S[0].style.setProperty('--fb', ((1 - sharp) * 12).toFixed(2) + 'px'); F.S[0].style.setProperty('--fl', (.42 + .58 * sharp).toFixed(3)); }
      feast.style.setProperty('--nv', smooth(clamp((x - .6) / .3)).toFixed(3));
      let k = x >= .66 ? 0 : -1;
      F.S.forEach((s, i) => {
        const st = F.INTRO + i;
        if (i > 0) {
          const o = smooth(clamp((x - st + .4) / .4));
          s.style.setProperty('--o', o.toFixed(3));
          if (o >= .5) k = i;
        }
        s.style.setProperty('--s', (1.12 - .1 * clamp((x - st + .4) / 1.4)).toFixed(4));
      });
      if (k !== F.k) { F.k = k; F.T.forEach((t, i) => t.classList.toggle('is-on', i === k)); F.B.forEach((b, i) => b.classList.toggle('is-on', i === k)); }
    }

    if (menuR && visible(menuSec)) menuR.style.setProperty('--my2', ((pass(menuSec) - .5) * -60).toFixed(1) + 'px');
    if (plates && visible(plates)) { const g = pass(plates) - .5; plateImgs.forEach((im, i) => im.style.setProperty('--rot', (g * (i % 2 ? -36 : 36)).toFixed(2) + 'deg')); }

    if (splitStage && visible(split) && !split.classList.contains('is-missing')) {
      const q = prog(split);
      if (q <= 0.001) manual = null;
      const v = manual ?? (1 - .5 * smooth(clamp(q / .55)));
      splitStage.style.setProperty('--p', (v * 100).toFixed(2) + '%');
      $('.split__label--r', split).style.opacity = clamp((1 - v) * 5);
      $('.split__label--l', split).style.opacity = clamp(v * 5);
    }

    wides.forEach(w => { if (visible(w) && !w.classList.contains('is-missing')) w.style.setProperty('--py', ((pass(w) - .5) * -7).toFixed(2) + '%'); });
    if (cater && visible(cater)) cater.style.setProperty('--cy', ((pass(cater) - .5) * -7).toFixed(2) + '%');

    if (cta && resvSec) {
      const rr = resvSec.getBoundingClientRect();
      cta.classList.toggle('is-on', y > innerHeight * .9 && !(rr.top < innerHeight && rr.bottom > 0));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* 3 · Karte: Kategorie wählt das Bild links */
  const cats = $$('.menu__list li');
  if (cats.length) {
    const pics = $$('.menu__pic--l img'), right = $$('.menu__pic--r img');
    const pick = i => { cats.forEach(c => c.classList.toggle('is-on', +c.dataset.cat === i)); pics.forEach(p => p.classList.toggle('is-on', +p.dataset.cat === i)); right.forEach(p => p.classList.toggle('is-on', +p.dataset.cat === i)); };
    cats.forEach(c => { const i = +c.dataset.cat; c.addEventListener('mouseenter', () => pick(i)); c.addEventListener('click', () => pick(i)); });
    pick(0);
    if (touch && !reduce) { let n = 0; setInterval(() => { if (visible($('#karte'))) { n = (n + 1) % cats.length; pick(n); } }, 3800); }
  }

  /* Bars */
  const bars = $$('.bar:not(.is-missing)');
  const row = $('.bars__row');
  const menus = $$('.barmenu__card');
  const activate = b => {
    bars.forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); });
    menus.forEach(m => m.classList.toggle('is-on', m.dataset.bar === b.dataset.need));
  };
  bars.forEach(b => b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(b); } }));
  if (!touch) bars.forEach(b => b.addEventListener('mouseenter', () => activate(b)));
  bars.forEach(b => b.addEventListener('click', () => {
    activate(b);
    if (phone && row) row.scrollTo({ left: b.offsetLeft - (row.clientWidth - b.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  }));
  /* Maus verlässt die Reihe: gewählte Bar bleibt, damit man ihre Karte lesen kann */
  if (row && phone) {
    const mid = bars.find(b => b.dataset.need === 'bar-saal');
    if (mid) requestAnimationFrame(() => { row.scrollLeft = mid.offsetLeft - (row.clientWidth - mid.clientWidth) / 2; });
    let st;
    row.addEventListener('scroll', () => { clearTimeout(st); st = setTimeout(() => {
      const c = row.scrollLeft + row.clientWidth / 2;
      let best = bars[0], d = 1e9;
      bars.forEach(b => { const bc = b.offsetLeft + b.clientWidth / 2; if (Math.abs(bc - c) < d) { d = Math.abs(bc - c); best = b; } });
      activate(best);
    }, 80); }, { passive: true });
  }

  /* 6 · Feiern: Anlass wählen */
  const evs = $$('.ev');
  if (evs.length) {
    const D = RU ? [
      ['Свадьбы', 'От фуршета с игристым в лаунже до танцпола в большом зале, до 200 гостей.', 'Hochzeit'],
      ['Дни рождения', 'Юбилеи и дни рождения в большой компании или с семьёй. Зал, фуршет и музыку подберём под ваш праздник.', 'Geburtstag'],
      ['Корпоративы', 'Новогодние корпоративы, юбилеи компании и летние праздники с полным сервисом, удобно добираться из Дуйсбурга и Дюссельдорфа.', 'Firmenveranstaltung'],
      ['Семейные праздники', 'Помолвки, крестины и выпускные в узком кругу, с личным сопровождением.', 'Familienfest'],
    ] : [
      ['Hochzeiten', 'Vom Sektempfang in der Lounge bis zur Tanzfläche im großen Saal, mit bis zu 200 Gästen.', 'Hochzeit'],
      ['Geburtstage', 'Runde Geburtstage und Jubiläen, im großen Kreis oder mit der Familie. Raum, Buffet und Musik stimmen wir auf Ihre Feier ab.', 'Geburtstag'],
      ['Firmenfeiern', 'Weihnachtsfeiern, Firmenjubiläen und Sommerfeste mit vollem Service, gut erreichbar aus Duisburg und Düsseldorf.', 'Firmenveranstaltung'],
      ['Familienfeste', 'Verlobungen, Taufen und Abschlussfeiern im kleineren Rahmen, mit persönlicher Betreuung.', 'Familienfest'],
    ];
    const pics = $$('.evp');
    const title = $('[data-ev-title]'), text = $('[data-ev-text]'), link = $('[data-ev-link]');
    let cur = 0, touched = false;
    const show = i => {
      cur = i;
      evs.forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', j === i); });
      const ok = pics.filter(p => !p.classList.contains('is-missing'));
      const pic = pics[i] && !pics[i].classList.contains('is-missing') ? pics[i] : ok[i % Math.max(1, ok.length)];
      pics.forEach(p => p.classList.toggle('is-on', p === pic));
      title.textContent = D[i][0]; text.textContent = D[i][1];
      link.href = 'anfrage.html?anlass=' + encodeURIComponent(D[i][2]);
    };
    evs.forEach((b, i) => b.addEventListener('click', () => { touched = true; show(i); }));
    show(0);
    const stage = $('.events__stage');
    if (!reduce) setInterval(() => { if (!touched && visible(stage)) show((cur + 1) % D.length); }, 5200);
  }

  /* Instagram: neue Videos automatisch über Feed (Behold), sonst offizielle Einbettung der Reels */
  const igRow = $('[data-ig-row]');
  if (igRow) {
    const embed = () => {
      if (window.instgrm) { window.instgrm.Embeds.process(); return; }
      const sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.instagram.com/embed.js'; document.body.append(sc);
    };
    const feed = (window.DRS_IG_FEED || '').trim();
    const esc = x => String(x || '').replace(/[<>&"]/g, '');
    const go = () => {
      if (!feed) return embed();
      fetch(feed).then(r => r.json()).then(d => {
        const posts = (d.posts || d || []).slice(0, 8);
        if (!posts.length) return embed();
        igRow.innerHTML = posts.map(p => {
          const vid = p.mediaType === 'VIDEO' && p.mediaUrl;
          const thumb = p.thumbnailUrl || (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.mediaUrl;
          const media = vid ? '<video src="' + esc(vid) + '" poster="' + esc(thumb) + '" muted loop playsinline preload="none"></video>' : '<img src="' + esc(thumb) + '" alt="" loading="lazy">';
          return '<a class="igf" href="' + esc(p.permalink) + '" target="_blank" rel="noopener">' + media + '<span>' + esc(p.prunedCaption || p.caption) + '</span></a>';
        }).join('');
        const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .5 });
        $$('video', igRow).forEach(v => vio.observe(v));
      }).catch(embed);
    };
    const iio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { go(); iio.disconnect(); } }, { rootMargin: '600px 0px' });
    iio.observe(igRow);
  }

  /* Zähler (Catering-Seite) */
  const fmtN = new Intl.NumberFormat('de-DE');
  const countUp = el => {
    const to = +el.dataset.to, suf = el.dataset.suffix || '', t1 = performance.now(), dur = 1800;
    const step = n => { const t = clamp((n - t1) / dur); el.textContent = fmtN.format(Math.round(to * ease(t))) + suf; if (t < 1) requestAnimationFrame(step); };
    reduce ? (el.textContent = fmtN.format(to) + suf) : requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }), { threshold: .4 });
  $$('[data-to]').forEach(el => cio.observe(el));

  /* Einblenden */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .2 });
  $$('.reveal, .tour__item').forEach(el => io.observe(el));

  /* Lightbox (Catering-Galerie) */
  const lb = $('#lightbox');
  if (lb) {
    const lbImg = $('img', lb), lbCap = $('.lightbox__cap', lb);
    const close = () => { lb.classList.remove('is-on'); setTimeout(() => { lb.hidden = true; }, 300); };
    $$('.gal__item, .tour__item').forEach(c => c.addEventListener('click', () => {
      const m = IMG[$('img', c).dataset.img]; if (!m) return;
      lbImg.src = BASE + m.l; lbImg.alt = $('img', c).alt; lbCap.textContent = ($('figcaption', c) || {}).textContent || '';
      lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-on'));
    }));
    lb.addEventListener('click', e => { if (e.target !== lbImg) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  /* Bewertungen: Note zählt hoch, Sterne füllen sich, Beispielkarten wechseln */
  $$('.rev').forEach(card => {
    const rate = +card.dataset.rate, note = $('[data-to-dec]', card), on = $('.rev__stars-on', card);
    const fmt1 = v => v.toFixed(1).replace('.', ',');
    note.textContent = reduce ? fmt1(rate) : '0,0';
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; ob.disconnect();
      on.style.width = (rate / 5 * 100) + '%';
      if (reduce) return;
      const t1 = performance.now();
      const step = n => { const t = clamp((n - t1) / 1800); note.textContent = fmt1(rate * ease(t)); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: .4 });
    ob.observe(card);
  });
  const samples = $$('.sample');
  if (samples.length > 1 && !reduce) {
    let si = 0;
    setInterval(() => {
      if (!visible(samples[0].parentElement)) return;
      samples[si].classList.remove('is-on'); si = (si + 1) % samples.length;
      setTimeout(() => samples[si].classList.add('is-on'), 700);
    }, 5600);
  }

  /* Rundgang: Raum-Leiste zeigt den aktuellen Raum */
  const tourLinks = $$('.tour-nav a');
  if (tourLinks.length) {
    const rooms = tourLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const rio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      tourLinks.forEach(a => {
        const on = a.getAttribute('href') === '#' + e.target.id;
        a.classList.toggle('is-on', on);
        if (on && innerWidth < 720) a.parentElement.scrollTo({ left: a.offsetLeft - 40, behavior: 'smooth' });
      });
    }), { rootMargin: '-45% 0px -50% 0px' });
    rooms.forEach(r => rio.observe(r));
  }

  /* Reservierung: nur Samstage */
  const selD = $('#resv-datum'), selP = $('#resv-personen');
  if (selD && selP) {
    const fmt = new Intl.DateTimeFormat(RU ? 'ru-RU' : 'de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    const de = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    const d = new Date(); d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
    for (let i = 0; i < 10; i++) { const o = document.createElement('option'); o.value = de.format(d); o.textContent = fmt.format(d) + (i === 0 ? (RU ? ' · эта суббота' : ' · diesen Samstag') : ''); selD.append(o); d.setDate(d.getDate() + 7); }
    const ruP = n => (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? ' человека' : ' человек';
    for (let i = 1; i <= 20; i++) { const o = document.createElement('option'); o.value = i; o.textContent = i + (RU ? ruP(i) : (i === 1 ? ' Person' : ' Personen')); if (i === 2) o.selected = true; selP.append(o); }
    { const o = document.createElement('option'); o.value = 'mehr als 20'; o.textContent = RU ? 'больше 20 человек' : 'mehr als 20 Personen'; selP.append(o); }
    $('#resv').addEventListener('submit', e => {
      e.preventDefault();
      const datum = selD.value, pers = selP.value;
      const subj = RU ? `Бронирование столика ${datum}, гостей: ${pers}` : `Tischreservierung ${datum}, ${pers} ${pers === '1' ? 'Person' : 'Personen'}`;
      const body = RU ? `Здравствуйте, команда Dr. Schiwago!\n\nХочу забронировать столик:\n\nДата: ${datum}\nКоличество гостей: ${pers}\nИмя: \nТелефон: \n\nСпасибо!` : `Hallo Dr. Schiwago Team,\n\nich möchte gern einen Tisch reservieren:\n\nDatum: ${datum}\nPersonen: ${pers}\nName: \nTelefon: \n\nVielen Dank!`;
      location.href = `mailto:info@drschiwago.de?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    });
  }
})();

/* Lageplan: Bereich antippen → Infokarte; Bereiche kombinieren → Fläche */
(() => {
  const plan = document.querySelector('.plan');
  if (!plan) return;
  const areas = [...plan.querySelectorAll('.plan__area')], cards = [...plan.querySelectorAll('.plan__card')];
  const show = id => {
    areas.forEach(a => a.classList.toggle('is-on', a.dataset.area === id));
    cards.forEach(c => c.classList.toggle('is-on', c.dataset.card === id));
  };
  areas.forEach(a => {
    a.addEventListener('click', () => show(a.dataset.area));
    a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(a.dataset.area); } });
  });
  cards.forEach(c => { const go = c.querySelector('.plan__go'); if (go && !document.querySelector(go.getAttribute('href'))) go.remove(); });
  const sum = plan.querySelector('[data-sum]');
  plan.querySelectorAll('.plan__chip').forEach(ch => ch.addEventListener('click', () => {
    const on = ch.getAttribute('aria-pressed') !== 'true';
    ch.setAttribute('aria-pressed', on);
    const a = areas.find(x => x.dataset.area === ch.dataset.pick); if (a) a.classList.toggle('is-pick', on);
    if (on) show(ch.dataset.pick);
    sum.textContent = [...plan.querySelectorAll('.plan__chip[aria-pressed="true"]')].reduce((s, x) => s + +x.dataset.m2, 0);
  }));
  show('saal');
})();
