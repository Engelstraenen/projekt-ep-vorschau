/* Angebots-Assistent (5 Schritte) wie auf angerhof-duisburg.de/angebot. Versand per E-Mail-Programm an den Angerhof. */
(() => {
  const RU = document.documentElement.lang === 'ru';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const form = $('#wizard'), back = $('[data-back]'), stepN = $('[data-step-n]'), line = $('.ah-prog__line');
  const steps = $$('.ah-step', form);
  const data = { anlass: '', gaeste: '', termin: '', wuensche: [] };
  let cur = 1;

  const go = n => {
    cur = n;
    steps.forEach(s => s.classList.toggle('is-on', +s.dataset.step === n));
    stepN.textContent = '0' + Math.min(n, 5);
    line.style.setProperty('--p', Math.min(n, 5) / 5);
    back.hidden = n === 1 || n === 6;
    $('.ah-prog').hidden = n === 6;
    const first = $('.ah-step.is-on .ah-pill, .ah-step.is-on .ah-cal__d:not(:disabled), .ah-step.is-on input', form);
    if (first && n > 1 && matchMedia('(hover: hover)').matches) first.focus({ preventScroll: true });
  };
  back.addEventListener('click', () => go(Math.max(1, cur - 1)));

  /* Auswahl-Knöpfe */
  $$('.ah-pills', form).forEach(group => {
    const name = group.dataset.name, multi = group.hasAttribute('data-multi');
    $$('.ah-pill', group).forEach(p => p.addEventListener('click', () => {
      const v = p.textContent.trim();
      if (multi) {
        p.classList.toggle('is-on');
        data[name] = $$('.ah-pill.is-on', group).map(x => x.textContent.trim());
        const nx = $('[data-multi-next]', form), has = data[name].length > 0;
        nx.classList.toggle('is-go', has);
        $('[data-l="skip"]', nx).hidden = has; $('[data-l="next"]', nx).hidden = !has;
      } else {
        $$('.ah-pill', group).forEach(x => x.classList.toggle('is-on', x === p));
        data[name] = v;
        setTimeout(() => go(cur + 1), 180);
      }
    }));
  });
  $$('[data-next]', form).forEach(b => b.addEventListener('click', () => go(cur + 1)));

  /* Kalender: vergangene Tage und Samstage (Dr. Schiwago) gesperrt */
  const loc = RU ? 'ru-RU' : 'de-DE';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEl = $('[data-cal-month]'), daysEl = $('[data-cal-days]'), prev = $('[data-cal="-1"]');
  const wd = [...Array(7)].map((_, i) => new Intl.DateTimeFormat(loc, { weekday: 'short' }).format(new Date(2024, 0, 1 + i)).replace('.', '').slice(0, 2).toUpperCase());
  const draw = () => {
    monthEl.textContent = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' }).format(view).replace(/^./, c => c.toUpperCase());
    prev.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    const lead = (view.getDay() + 6) % 7, n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let h = wd.map(w => `<span class="ah-cal__wd">${w}</span>`).join('') + '<span></span>'.repeat(lead);
    for (let d = 1; d <= n; d++) {
      const dt = new Date(view.getFullYear(), view.getMonth(), d), sat = dt.getDay() === 6, past = dt < today;
      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const lbl = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(dt) + (sat ? (RU ? ', суббота: Dr. Schiwago' : ', Samstag: Dr. Schiwago') : '');
      h += `<button type="button" class="ah-cal__d${sat ? ' is-sat' : ''}${data.termin === iso ? ' is-on' : ''}" data-d="${iso}" aria-label="${lbl}"${sat || past ? ' disabled' : ''}>${d}</button>`;
    }
    daysEl.innerHTML = h;
  };
  $$('[data-cal]').forEach(b => b.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.cal, 1); draw(); }));
  daysEl.addEventListener('click', e => {
    const b = e.target.closest('.ah-cal__d'); if (!b || b.disabled) return;
    data.termin = b.dataset.d; draw(); setTimeout(() => go(4), 200);
  });
  draw();

  /* Anlass aus dem Link (?anlass=Hochzeit) vorwählen, wie beim Angerhof */
  const alias = { geburtstag: 'Geburtstag & Jubiläum', jubilaeum: 'Geburtstag & Jubiläum', firmenveranstaltung: 'Firmenfeier', firma: 'Firmenfeier', 'konferenz / tagung': 'Konferenz & Tagung', tagung: 'Konferenz & Tagung', 'sonstige veranstaltung': 'Etwas anderes', sonstiges: 'Etwas anderes' };
  const want = new URLSearchParams(location.search).get('anlass');
  if (want) {
    const key = want.trim().toLowerCase(), target = (alias[key] || want).toLowerCase();
    const p = $$('[data-name="anlass"] .ah-pill', form).find(x => x.dataset.de ? x.dataset.de.toLowerCase() === target : x.textContent.trim().toLowerCase() === target);
    if (p) { p.classList.add('is-on'); data.anlass = p.textContent.trim(); go(2); }
  }

  /* Absenden: E-Mail an den Angerhof vorbereiten */
  const fmtD = iso => iso ? new Intl.DateTimeFormat(loc, { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso + 'T12:00:00')) : (RU ? 'пока не определена' : 'noch offen');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form.elements, need = [f.name, f.email, f.telefon];
    let ok = true;
    need.forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('is-bad', bad); if (bad) ok = false; });
    if (!f.datenschutz.checked) ok = false;
    $('[data-err]').hidden = ok;
    if (!ok) return;
    const L = RU
      ? { s: 'Запрос предложения', a: 'Повод', g: 'Гостей', t: 'Дата', w: 'Пожелания', n: 'Имя', e: 'E-mail', p: 'Телефон', m: 'Сообщение', hi: 'Здравствуйте, команда Angerhof!\n\nПрошу прислать предложение:', bye: 'Спасибо!', none: '—' }
      : { s: 'Angebotsanfrage', a: 'Anlass', g: 'Gäste', t: 'Termin', w: 'Wünsche', n: 'Name', e: 'E-Mail', p: 'Telefon', m: 'Nachricht', hi: 'Guten Tag,\n\nich bitte um ein Angebot für folgende Feier:', bye: 'Vielen Dank!', none: '–' };
    const sum = `${L.a}: ${data.anlass || L.none}\n${L.g}: ${data.gaeste || L.none}\n${L.t}: ${fmtD(data.termin)}\n${L.w}: ${data.wuensche.join(', ') || L.none}`;
    const body = `${L.hi}\n\n${sum}\n\n${L.n}: ${f.name.value.trim()}\n${L.e}: ${f.email.value.trim()}\n${L.p}: ${f.telefon.value.trim()}${f.nachricht.value.trim() ? `\n${L.m}: ${f.nachricht.value.trim()}` : ''}\n\n${L.bye}`;
    const subj = `${L.s}: ${data.anlass || L.none}, ${fmtD(data.termin)}`;
    $('[data-summary]').textContent = sum;
    go(6);
    location.href = `mailto:kontakt@angerhof-restaurant.de?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  });
})();
