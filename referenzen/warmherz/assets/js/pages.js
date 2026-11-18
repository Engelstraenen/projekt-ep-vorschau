/* WARMHERZ · Mehrseitig: Untermenü, Kontakt-Thema, Foto-Check, Scroll-Video */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('shot');

  /* Untermenü: Klick öffnet (Handy/Tastatur), Hover reicht am Desktop */
  $$('.dd-btn').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); const dd = b.closest('.dd'); const o = dd.classList.toggle('open'); b.setAttribute('aria-expanded', o);
  }));
  document.addEventListener('click', e => {
    if (!e.target.closest('.dd')) $$('.dd.open').forEach(d => { d.classList.remove('open'); d.querySelector('.dd-btn').setAttribute('aria-expanded', 'false'); });
  });

  /* Kontakt: ?thema=... wählt das Thema vor */
  const sel = $('[data-topic-select]'), th = new URLSearchParams(location.search).get('thema');
  if (sel && th && [...sel.options].some(o => o.value === th)) sel.value = th;

  /* Foto-Check */
  const fc = $('[data-fc]');
  if (fc) {
    const T = {
      stoerung: ['Störung Heizung', 'Fotografieren Sie das Display mit Fehlercode, das Typenschild und die Heizung von vorn.', ['Display / Fehlercode', 'Typenschild', 'Gerät von vorn']],
      neu: ['Neue Heizung', 'Heizraum, Typenschild der alten Heizung und einen typischen Heizkörper.', ['Heizraum', 'Typenschild', 'Heizkörper']],
      bad: ['Badsanierung', 'Das Bad aus zwei Ecken und einmal Dusche oder Wanne von nah.', ['Bad Ecke 1', 'Bad Ecke 2', 'Dusche / Wanne']],
      wasser: ['Wasserschaden', 'Den Fleck oder die nasse Stelle, die Umgebung und, wenn sichtbar, das Rohr.', ['Nasse Stelle', 'Umgebung', 'Rohr / Anschluss']],
      sonst: ['Anfrage', 'Zeigen Sie uns, worum es geht: einmal von nah, einmal mit Abstand.', ['Foto 1', 'Foto 2', 'Foto 3']]
    };
    const slots = $('[data-fc-slots]'), hint = $('[data-fc-hint]'), count = $('[data-fc-count]'), text = $('[data-fc-text]');
    const steps = $$('[data-fc-step]');
    const setStep = n => steps.forEach(s => s.classList.toggle('on', +s.dataset.fcStep <= n));
    const topic = () => T[$('input[name=fc-topic]:checked').value];
    function upd() {
      const n = $$('.fc-slot.filled', slots).length;
      count.textContent = n >= 3 ? `${n} Fotos, passt.` : `${n} von 3 Pflichtfotos`;
      setStep(n >= 3 ? (text.value.trim() ? 3 : 2) : 1);
    }
    function render() {
      const t = topic();
      hint.textContent = 'Tipp: ' + t[1];
      slots.innerHTML = [...t[2], 'Optional', 'Optional'].map((l, i) =>
        `<label class="fc-slot ${i > 2 ? 'opt' : ''}"><input type="file" accept="image/*" capture="environment" aria-label="${l}"><i>+</i>${l}</label>`).join('');
      $$('input', slots).forEach(inp => inp.addEventListener('change', () => {
        const f = inp.files[0]; if (!f) return; const s = inp.closest('.fc-slot');
        s.style.backgroundImage = `url(${URL.createObjectURL(f)})`; s.classList.add('filled'); s.querySelector('i').textContent = '✓'; upd();
      }));
      upd();
    }
    $$('input[name=fc-topic]').forEach(r => r.addEventListener('change', render));
    text.addEventListener('input', upd);
    fc.addEventListener('submit', e => {
      e.preventDefault();
      const n = $$('.fc-slot.filled', slots).length;
      $('[data-fc-title]').textContent = topic()[0];
      $('[data-fc-sum]').textContent = `${n} Fotos · ${text.value.trim() ? 'mit Beschreibung' : 'ohne Beschreibung'}`;
      $('[data-fc-done]').classList.add('show'); setStep(4);
      $('[data-fc-done]').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
    render();
  }

  /* Scroll-Video „Von −10 °C auf 21 °C“: Scroll steuert Bildfolge, Temperatur und Texte */
  const wf = $('.wf');
  if (wf) {
    const cv = $('[data-seq]', wf), still = $('[data-seq-still]', wf), n = +cv.dataset.frames || 0, path = cv.dataset.path;
    const tEl = $('[data-wf-temp]', wf), bar = $('[data-wf-bar]', wf), caps = $$('.wf-cap', wf), cta = $('.wf-cta', wf);
    const frames = []; let last = -1, loaded = false;
    const ctx = cv.getContext('2d');
    // Bildfolge erst laden, wenn der Abschnitt in die Nähe kommt (Startseite bleibt schnell)
    function load() {
      if (loaded || !n) return; loaded = true;
      for (let i = 0; i < n; i++) {
        const im = new Image(); im.decoding = 'async'; im.src = `${path}${String(i + 1).padStart(3, '0')}.webp`;
        if (i === 0) im.onload = () => { still.style.display = 'none'; last = -1; update(); };
        frames.push(im);
      }
    }
    if (n) new IntersectionObserver(es => { if (es[0].isIntersecting) load(); }, { rootMargin: '150% 0px' }).observe(wf);
    function draw(i) {
      const im = frames[i]; if (!im || !im.complete || !im.naturalWidth) return;
      const w = cv.width = cv.clientWidth * devicePixelRatio, h = cv.height = cv.clientHeight * devicePixelRatio;
      const sc = Math.max(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
      ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }
    function update() {
      const r = wf.getBoundingClientRect(), total = Math.max(1, wf.offsetHeight - innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / total));
      const temp = Math.round(-10 + 31 * p);
      tEl.textContent = (temp < 0 ? '−' : '') + Math.abs(temp);
      tEl.parentElement.style.color = p < .4 ? '#7EC8E3' : p < .7 ? '#FFD39A' : '#FF5B1F';
      bar.style.width = (p * 100) + '%';
      caps.forEach(c => c.classList.toggle('on', p >= +c.dataset.from && p < +c.dataset.to));
      cta.classList.toggle('on', p > .82);
      if (frames.length) {
        let i = Math.min(n - 1, Math.round(p * (n - 1)));
        while (i > 0 && !(frames[i].complete && frames[i].naturalWidth)) i--;   // noch nicht geladen: nächstes fertiges Bild davor
        if (i !== last) { last = i; draw(i); }
      } else if (!reduce) still.style.transform = `scale(${1.15 - p * .15})`;
    }
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    addEventListener('resize', () => { last = -1; update(); });
    update();
  }
})();
