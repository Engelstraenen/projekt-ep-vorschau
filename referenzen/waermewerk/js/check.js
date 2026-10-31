/* WÄRMEWERK Demo (Projekt EP): Wärmepumpen-Check. Vanilla JS, keine Bibliotheken, keine Datenübertragung.
   Antworten bleiben nur im LocalStorage dieses Browsers. Rechenwerte sind grobe Demo-Annahmen. */
(() => {
  const root = document.querySelector('[data-check]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const KEY = 'waermewerk-check-v1';
  const LABEL = {
    typ: { efh: 'Einfamilienhaus', dhh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus' },
    daemm: { alt: 'Unsaniert', teil: 'Teilsaniert', gut: 'Gut gedämmt' },
    heiz: { fbh: 'Fußbodenheizung', hkg: 'Große Heizkörper', hkk: 'Kleine oder alte Heizkörper' },
  };
  const fmt = n => n.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

  function calc(s) {
    const spez = { alt: 120, teil: 80, gut: 50 }[s.daemm];           // W/m²
    const lage = { efh: 1, dhh: 0.92, rh: 0.85, mfh: 0.8 }[s.typ];     // Anbau spart Außenwand
    const kw = Math.round((s.flaeche * spez * lage / 1000 + 0.6) * 10) / 10; // + Warmwasser grob
    const vl = { fbh: 35, hkg: 45, hkk: 55 }[s.heiz];
    let score = 100 - { fbh: 0, hkg: 10, hkk: 30 }[s.heiz] - { gut: 0, teil: 10, alt: 30 }[s.daemm];
    if (kw > 18) score -= 5;
    score = Math.max(25, score);
    const gross = kw > 16;
    const hybrid = score < 55;
    const rec = hybrid ? 'Hybrid-Lösung oder Luft-Wasser nach Heizkörper-Tausch'
      : gross ? (s.typ === 'efh' || s.typ === 'mfh' ? 'Sole-Wasser (Erdwärme) oder zwei Geräte in Kaskade' : 'Leistungsstarke Luft-Wasser-Wärmepumpe')
      : 'Luft-Wasser-Wärmepumpe';
    let verdict, text, next;
    if (score >= 80) { verdict = 'Sehr gut geeignet'; text = 'Ihr Haus bringt beste Voraussetzungen mit.'; next = 'Vor-Ort-Termin und Heizlastberechnung'; }
    else if (score >= 55) { verdict = 'Gut geeignet'; text = 'Eine Wärmepumpe passt, mit kleinen Anpassungen arbeitet sie noch effizienter.'; next = 'Heizflächen und Dämmung vor Ort prüfen'; }
    else { verdict = 'Machbar, mit Vorbereitung'; text = 'Möglich ist es fast immer. Bei Ihrem Haus lohnt sich vorher ein genauer Blick.'; next = 'Energie-Check vor Ort'; }
    const tipps = [];
    if (s.heiz === 'fbh') tipps.push('Ihre Fußbodenheizung ist ideal, weil sie mit niedriger Vorlauftemperatur auskommt.');
    if (s.heiz === 'hkg') tipps.push('Ein hydraulischer Abgleich holt aus Ihren Heizkörpern noch mehr heraus.');
    if (s.heiz === 'hkk') tipps.push('Einzelne größere Heizkörper senken die nötige Vorlauftemperatur deutlich.');
    if (s.daemm === 'alt') tipps.push('Neue Fenster oder ein gedämmtes Dach senken die Heizlast spürbar.');
    if (s.daemm === 'gut') tipps.push('Die gute Dämmung hält die nötige Leistung klein.');
    text += ' ' + tipps.join(' ');
    return { kw, vl, score, rec, verdict, text, next };
  }

  /* Zusammenfassung im Anfrage-Bereich (auch ohne Check-Bereich nutzbar) */
  function summary(s, r) {
    const list = document.querySelector('[data-summary-list]');
    const empty = document.querySelector('[data-summary-empty]');
    if (!list) return;
    if (!s || !s.done) { list.hidden = true; empty.hidden = false; return; }
    const rows = [['Gebäude', LABEL.typ[s.typ]], ['Dämmstand', LABEL.daemm[s.daemm]], ['Wohnfläche', s.flaeche + ' m²'], ['Heizflächen', LABEL.heiz[s.heiz]], ['Einschätzung', r.verdict + ' (' + r.score + ' %)'], ['Empfehlung', r.rec]];
    list.replaceChildren(...rows.map(([k, v]) => { const d = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; d.append(dt, dd); return d; }));
    list.hidden = false; empty.hidden = true;
  }

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { saved = null; }

  if (root) {
    const form = root.querySelector('[data-steps]');
    const steps = [...form.querySelectorAll('[data-step]')];
    const result = form.querySelector('[data-result]');
    const prev = form.querySelector('[data-prev]'), next = form.querySelector('[data-next]');
    const toForm = form.querySelector('[data-to-form]'), reset = form.querySelector('[data-reset]');
    const count = root.querySelector('[data-count]'), prog = root.querySelector('[data-progress]');
    const out = k => root.querySelectorAll(`[data-out="${k}"]`);
    const set = (k, v) => out(k).forEach(el => { el.textContent = v; });
    let state = { typ: 'efh', daemm: 'teil', flaeche: 140, heiz: 'hkg', step: 1, done: false };
    if (saved && LABEL.typ[saved.typ]) state = { ...state, ...saved };

    const read = () => {
      const fd = new FormData(form);
      state.typ = fd.get('typ'); state.daemm = fd.get('daemm'); state.heiz = fd.get('heiz'); state.flaeche = +fd.get('flaeche');
    };
    const write = () => {
      for (const n of ['typ', 'daemm', 'heiz']) { const el = form.querySelector(`input[name="${n}"][value="${state[n]}"]`); if (el) el.checked = true; }
      form.querySelector('input[name="flaeche"]').value = state.flaeche;
    };
    const store = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* privat-Modus */ } };

    function paint() {
      const r = calc(state);
      root.dataset.typ = state.typ; root.dataset.daemm = state.daemm; root.dataset.heiz = state.heiz;
      root.style.setProperty('--scale', (0.8 + (Math.min(state.flaeche, 400) - 60) / 340 * 0.28).toFixed(3));
      root.style.setProperty('--score', (r.score / 100).toFixed(2));
      set('kw', fmt(r.kw) + ' kW'); set('vl', r.vl + ' °C'); set('score', r.score + ' %'); set('area', state.flaeche + ' m²');
      set('verdict', r.verdict); set('text', r.text); set('rec', r.rec); set('kw2', 'ca. ' + fmt(r.kw) + ' kW'); set('vl2', 'ca. ' + r.vl + ' °C'); set('next', r.next);
      form.querySelector('input[name="flaeche"]').setAttribute('aria-valuetext', state.flaeche + ' Quadratmeter');
      summary(state, r);
      return r;
    }

    function show(step, focus) {
      const swap = () => {
        state.step = step;
        steps.forEach(f => { f.hidden = +f.dataset.step !== step; });
        const fin = step > steps.length;
        result.hidden = !fin;
        prev.hidden = step === 1 && !fin; prev.disabled = step === 1;
        next.hidden = fin; toForm.hidden = !fin; reset.hidden = !fin;
        next.innerHTML = step === steps.length ? 'Ergebnis anzeigen <span aria-hidden="true">→</span>' : 'Weiter <span aria-hidden="true">→</span>';
        count.textContent = fin ? 'Fertig: Ihr Ergebnis' : `Frage ${step} von ${steps.length}`;
        prog.style.transform = `scaleX(${Math.min(step - (fin ? 0 : 1), steps.length) / steps.length})`;
        if (fin) state.done = true;
        paint(); store();
      };
      if (document.startViewTransition && !reduce.matches && focus) document.startViewTransition(swap); else swap();
      if (focus) {
        const target = step > steps.length ? result : steps[step - 1].querySelector('legend');
        if (target) { if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
      }
    }

    write(); paint(); show(Math.min(state.step || 1, steps.length + (state.done ? 1 : 0)), false);
    form.addEventListener('input', () => { read(); paint(); store(); });
    form.addEventListener('submit', e => { e.preventDefault(); next.click(); });
    next.addEventListener('click', () => show(state.step + 1, true));
    prev.addEventListener('click', () => show(Math.max(1, state.step > steps.length ? steps.length : state.step - 1), true));
    reset.addEventListener('click', () => { state = { typ: 'efh', daemm: 'teil', flaeche: 140, heiz: 'hkg', step: 1, done: false }; write(); show(1, true); });
  } else if (saved && saved.done) {
    summary(saved, calc(saved));
  }

  /* Tabs (WAI-ARIA Muster, Pfeiltasten) */
  document.querySelectorAll('[data-tabs]').forEach(box => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const select = (t, focus) => {
      const go = () => tabs.forEach(x => {
        const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (document.startViewTransition && !reduce.matches) document.startViewTransition(go); else go();
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t, false));
      t.addEventListener('keydown', e => {
        const k = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
        if (k === undefined) return; e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true);
      });
    });
  });
})();
