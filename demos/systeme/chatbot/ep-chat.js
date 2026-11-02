/* Projekt-EP-Chat-Widget (öffentliche Demo-Fassung, Antworten kommen aus chat-lokal.js im Browser) – Einbindung: <script src="/chatbot/widget/ep-chat.js" data-api="/chatbot" defer></script>
   Vanilla JS, Shadow DOM (keine Stil-Konflikte mit der Seite), barrierearm (Dialog, Live-Region, Tastatur, Fokus-Rückgabe). */
(() => {
  const me = document.currentScript;
  const API = (me && me.dataset.api) || "/chatbot";
  const BASE = new URL(".", me ? me.src : location.href).href;
  const LANG = (me && me.dataset.lang) || (document.documentElement.lang || "de").slice(0, 2);
  const T = LANG === "en" ? {
    launch: "Questions? Ask us", hi: "Hey, I'm Bit!", team: "Talk to the team", sent: "Sent", bitl: "Bit, the Projekt EP assistant", title: "Chat with Projekt EP", status: "Automated assistant · replies instantly", ph: "Type your question …", send: "Send",
    close: "Close chat", menu: "Options", human: "Talk to a person", del: "Delete conversation", privacy: "Privacy notice", restart: "New conversation",
    notice: "You're chatting with an automated assistant (AI system under the EU AI Act), not a person. Messages are stored to handle your request and deleted after {d} days.",
    src: "Source", formTitle: "How can we reach you?", formSub: "The team gets your request including this chat summary.", name: "Name *", email: "E-mail", tel: "Phone",
    msg: "Your request", cb: "Please call me back", when: "Best time", whenOpts: ["any time", "morning", "afternoon", "evening"], consent: "I consent to Projekt EP storing my details from this chat to handle my request and contact me about it. Deleted after 30 days or on completion; withdraw anytime at kontakt@projekt-ep.de.",
    privacyLink: "Privacy notice", submit: "Send to the team", cancel: "Not now", needConsent: "Please confirm your consent so we may store your details.", deleted: "Conversation deleted.", footL: "Automated assistant", err: "Connection problem – please try again or write to kontakt@projekt-ep.de."
  } : {
    launch: "Fragen? Frag uns", hi: "Hey, ich bin Bit!", team: "Mit dem Team sprechen", sent: "Gesendet", bitl: "Bit, der Projekt-EP-Assistent", title: "Chat mit Projekt EP", status: "Automatischer Assistent · antwortet sofort", ph: "Deine Frage …", send: "Senden",
    close: "Chat schließen", menu: "Optionen", human: "Mit Mensch sprechen", del: "Verlauf löschen", privacy: "Datenschutzhinweise", restart: "Neues Gespräch",
    notice: "Demo: Du schreibst mit einem automatischen Assistenten (KI-System im Sinne der EU-KI-Verordnung), nicht mit einem Menschen. Alles läuft in deinem Browser, nichts wird gespeichert oder gesendet.",
    src: "Quelle", formTitle: "Wie erreichen wir dich?", formSub: "Demo: Das Formular zeigt nur den Ablauf. Es wird nichts gesendet oder gespeichert.", name: "Name *", email: "E-Mail", tel: "Telefon",
    msg: "Dein Anliegen", cb: "Bitte ruft mich zurück", when: "Am besten erreichbar", whenOpts: ["egal", "vormittags", "nachmittags", "abends"], consent: "",
    privacyLink: "Datenschutzhinweise", submit: "Ans Team senden", cancel: "Jetzt nicht", needConsent: "Bitte bestätige die Einwilligung, damit wir deine Angaben speichern dürfen.", deleted: "Verlauf gelöscht.", footL: "Automatischer Assistent", err: "Verbindung gestört – bitte nochmal versuchen oder an kontakt@projekt-ep.de schreiben."
  };
  const ICON = {
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    more: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    doc: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>'
  };
  const host = document.createElement("div"); host.id = "ep-chat";
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<link rel="stylesheet" href="${BASE}ep-chat.css"><div class="root">
    <button class="launcher" type="button" aria-expanded="false" aria-controls="ep-panel" aria-haspopup="dialog" aria-label="${T.launch}"><span class="mark" aria-hidden="true"></span><span class="lbl">${T.launch}</span></button>
    <div class="backdrop" aria-hidden="true"></div>
    <section class="panel" id="ep-panel" role="dialog" aria-modal="false" aria-labelledby="ep-title" hidden>
      <div class="grip" aria-hidden="true"></div>
      <header><span class="hav" aria-hidden="true"><span class="hb"></span><i class="on"></i></span><div class="who"><div class="brand" id="ep-title"><span>PROJEKT <b>EP</b></span><span class="sr">${T.title}</span></div><div class="status">${T.status}</div></div>
        <button class="icon-btn m" type="button" aria-label="${T.menu}" aria-haspopup="menu" aria-expanded="false">${ICON.more}</button>
        <button class="icon-btn x" type="button" aria-label="${T.close}">${ICON.close}</button>
        <div class="menu" role="menu" hidden><button role="menuitem" data-a="human">${T.human}</button><a role="menuitem" class="pl" href="#" target="_blank" rel="noopener">${T.privacy}</a><button role="menuitem" data-a="restart">${T.restart}</button><button role="menuitem" data-a="delete" class="danger">${T.del}</button></div>
      </header>
      <div class="log" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
      <form class="composer" novalidate><label class="sr" for="ep-in">${T.ph}</label><textarea id="ep-in" class="input" rows="1" maxlength="1000" placeholder="${T.ph}" autocomplete="off"></textarea><button class="send" type="submit" aria-label="${T.send}" disabled>${ICON.send}</button></form>
      <div class="foot"><span>${T.footL} · <a class="pl" href="#" target="_blank" rel="noopener">${T.privacy}</a></span><button class="human" type="button" data-a="human">${T.human}</button></div>
    </section></div>`;
  const $ = s => root.querySelector(s);
  const L = $(".launcher"), P = $(".panel"), B = $(".backdrop"), LOG = $(".log"), IN = $("#ep-in"), SEND = $(".send"), MENU = $(".menu"), MB = $(".m");
  /* BIT:START · Chat-Avatar „Bit“ (Entwurf A) · SVG + CSS + Web Animations API, ohne Bibliothek · Werte aus avatar/bit-storyboard/STORYBOARD.md */
  const Bit = (() => {
    const RM = matchMedia("(prefers-reduced-motion: reduce)"), still = () => RM.matches, now = () => Date.now();
    const EPE = "cubic-bezier(.22,1,.36,1)", SINE = "cubic-bezier(.37,0,.63,1)", POP = "cubic-bezier(.34,1.56,.64,1)";
    const sg = k => { try { return sessionStorage.getItem("ep-bit-" + k); } catch (e) { return 0; } };
    const ss = k => { try { sessionStorage.setItem("ep-bit-" + k, "1"); } catch (e) {} };
    // Pixelgesichter im Raster 22 × 15: [x, y, Helligkeit, Gruppe]
    const P = (l, v = 1, g = "") => l.map(p => [p[0], p[1], v, g]);
    const R = (c, r, w, h, v) => { const o = []; for (let x = c; x < c + w; x++) for (let y = r; y < r + h; y++) o.push([x, y]); return P(o, v); };
    const O = (c, r, w, h) => { const o = []; for (let x = c; x < c + w; x++) for (let y = r; y < r + h; y++) { const a = x == c || x == c + w - 1, b = y == r || y == r + h - 1; if ((a || b) && !(a && b)) o.push([x, y]); } return P(o); };
    const Q = s => s.split(" ").map(p => p.split(",").map(Number));
    const SM = Q("8,10 13,10 9,11 10,11 11,11 12,11"), HE = Q("1,0 3,0 0,1 1,1 2,1 3,1 4,1 0,2 1,2 2,2 3,2 4,2 1,3 2,3 3,3 2,4");
    const eyes = (dx, dy) => [...O(4 + dx, 2 + dy, 4, 6), ...O(14 + dx, 2 + dy, 4, 6)];
    const F = {
      neutral: l => [...eyes(l[0], l[1]), ...P(SM)],
      half: () => [...R(4, 5, 4, 2), ...R(14, 5, 4, 2), ...P(SM)],
      shut: () => [...R(4, 6, 4, 1), ...R(14, 6, 4, 1), ...P(SM)],
      freude: () => P(Q("3,5 4,4 5,3 6,3 7,4 8,5 13,5 14,4 15,3 16,3 17,4 18,5 7,9 14,9 8,10 9,10 10,10 11,10 12,10 13,10 9,11 10,11 11,11 12,11")),
      wink1: () => [...O(4, 2, 4, 6), ...R(14, 5, 4, 2), ...P(Q("9,11 10,11 11,11 12,11 13,10 14,9"))],
      wink2: () => [...O(4, 2, 4, 6), ...P(Q("14,6 15,5 16,5 17,6 9,11 10,11 11,11 12,11 13,10 14,9"))],
      denken: i => [...eyes(i < 0 ? 0 : i - 1, 0), ...[7, 10, 13].flatMap((c, j) => R(c, 10, 2, 2, i < 0 || i == j ? 1 : .3))],
      staunen: () => [...O(3, 1, 6, 7), ...O(13, 1, 6, 7), ...O(9, 9, 4, 4)],
      // Schweißtropfen (#CFE8FF) bewusst 3 Pixel neben dem Auge (Storyboard: zu nah)
      fehler: k => [...P(Q("6,3 7,4 8,5 7,6 6,7 15,3 14,4 13,5 14,6 15,7 7,11 8,10 9,11 10,10 11,11 12,10 13,11 14,10")), ...P(Q("0,0 -1,1 0,1 1,1 -1,2 0,2 1,2 0,3").map(([x, y]) => [20 + x, y + k]), 1, "d")],
      danke: () => [...P(HE.map(([x, y]) => [3 + x, 2 + y]), 1, "h1"), ...P(HE.map(([x, y]) => [14 + x, 2 + y]), 1, "h2"), ...P(SM)],
      unsicher: () => [...O(4, 2, 4, 6), ...O(15, 4, 3, 3), ...P(Q("8,11 9,11 10,11 11,11 12,10 13,10"))],
      schlafen: () => [...P(Q("4,7 5,8 6,8 7,7 14,7 15,8 16,8 17,7 10,11 11,11")), ...P(Q("18,2 19,2 20,2 21,2 20,3 19,4 18,5 19,5 20,5 21,5"), .8, "z")]
    };
    const GR = ["", "d", "h1", "h2", "z"];
    function draw(b, px) { // ≤ 40 px: Grob-Raster 11 × 8
      const c = b.c, p = c ? 7.4 : 3.7, s = c ? 6.4 : 3.1, x0 = 59.3 + (p - s) / 2, y0 = (c ? 59.4 : 61.25) + (p - s) / 2, m = {}, h = {};
      for (const [X, Y, v, g] of px) { const x = c ? X >> 1 : X, y = c ? Y >> 1 : Y, k = x + "," + y, o = m[k]; m[k] = [x, y, Math.max(v, o ? o[2] : 0), g || (o ? o[3] : "")]; }
      GR.forEach(g => h[g] = "");
      for (const k in m) { const [x, y, v, g] = m[k]; h[g] += `<rect x="${(x0 + x * p).toFixed(1)}" y="${(y0 + y * p).toFixed(1)}" width="${s}" height="${s}" rx="${c ? 1.3 : .6}"${v < 1 ? ` opacity="${v}"` : ""}/>`; }
      GR.forEach((g, i) => { if (b.g[i].innerHTML !== h[g]) b.g[i].innerHTML = h[g]; });
    }
    // Figur: Keramik-Kopf (Squircle), Glas-Display #161619, Antenne als Status-LED; Ganzkörper nur im großen Bit; Arme liegen vor dem Kopf (Storyboard)
    let n = 0;
    const QM = Q("1,0 2,0 3,0 0,1 4,1 4,2 3,3 2,4 2,6").map(([x, y]) => `<rect x="${113 + x * 3.4}" y="${2 + y * 3.4}" width="3" height="3" rx=".6"/>`).join("");
    function svg(full, size, label) {
      const id = "bit" + (++n), c = `url(#${id}c)`, st = 'stroke="#000" stroke-opacity=".08"', fine = size > 40;
      const arm = (x, cls, extra) => `<g class="${cls}"><rect x="${x - 8.5}" y="146" width="17" height="44" rx="8.5" fill="${c}" ${st}/><circle cx="${x}" cy="192" r="10.5" fill="${c}" ${st}/>${extra}</g>`;
      return `<svg class="bit ${full ? "full" : "head"}" viewBox="${full ? "0 0 200 250" : "26 0 148 148"}" width="${full ? size * .8 : size}" height="${size}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">
<defs><linearGradient id="${id}c" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#F5F5F7"/><stop offset="1" stop-color="#D9D9DF"/></linearGradient>
<filter id="${id}f" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="a"/><feFlood flood-color="#2997FF" flood-opacity=".9"/><feComposite in2="a" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
${full ? '<ellipse class="sh" cx="100" cy="240" rx="38" ry="5.5"/>' : ""}<g class="fig"><g class="br">${full ? `<rect x="76" y="196" width="20" height="34" rx="9" fill="${c}" ${st}/><rect x="104" y="196" width="20" height="34" rx="9" fill="${c}" ${st}/><rect x="73" y="224" width="26" height="10" rx="5" fill="#2C2C30"/><rect x="101" y="224" width="26" height="10" rx="5" fill="#2C2C30"/>
<rect x="80" y="130" width="40" height="14" rx="7" fill="#2C2C30"/><rect x="62" y="138" width="76" height="68" rx="30" fill="${c}" ${st}/><ellipse cx="100" cy="174" rx="13" ry="8.5" fill="#1D1D1F"/><ellipse cx="96" cy="171" rx="5" ry="2" fill="#fff" opacity=".25"/>
<g class="kb"><rect x="66" y="196" width="68" height="12" rx="3" fill="#D2D2D7"/><path d="M71 202h58" stroke="#6E6E73" stroke-width="2.4" stroke-dasharray="4 2.5"/></g>
` : ""}
<g class="hd"><g class="an"><rect x="97" y="18" width="6" height="24" rx="3" fill="#D8D8DE"/>${fine ? '<circle class="ha" cx="100" cy="15" r="15" fill="#2997FF"/>' : ""}<circle class="led" cx="100" cy="15" r="9" fill="#2997FF"/>${fine ? '<circle cx="97" cy="12" r="2.6" fill="#fff" opacity=".75"/>' : ""}</g>
<g class="q" fill="#2997FF">${QM}</g><rect x="40" y="38" width="120" height="104" rx="36" fill="${c}" ${st}/><rect x="52" y="50" width="96" height="78" rx="22" fill="#161619"/>
<g class="px"${fine ? ` filter="url(#${id}f)"` : ""}>${GR.map(g => `<g class="g-${g || "m"}"></g>`).join("")}</g>${fine ? '<path d="M62 70q1-12 14-13h16" stroke="#fff" stroke-opacity=".13" stroke-width="4" stroke-linecap="round" fill="none"/>' : ""}</g>${full ? arm(65.5, "al", "") + arm(134.5, "ar", `<rect class="th" x="126.5" y="189" width="11" height="25" rx="5.5" fill="${c}" ${st}/><rect class="fi" x="130.5" y="194" width="8.5" height="25" rx="4.25" fill="${c}" ${st}/>`) : ""}</g></g></svg>`;
    }
    // ---- Instanzen
    const live = new Set(), cls = new Set();
    let lk = [0, 0], cur = ["neutral", 0], base = "neutral", tmp = null, ft = [], bt = 0, lastB = 0, floatRate = 1, avatar = null;
    const alive = () => [...live].filter(b => b.el.isConnected || !live.delete(b));
    const pix = (f, k) => F[f](f == "neutral" ? lk : k);
    function mount(host, size, full, label, keep) {
      host.innerHTML = svg(full, size, label);
      const el = host.firstElementChild, q = s => el.querySelector(s);
      const b = { el, size, full, c: size <= 40, g: [...el.querySelectorAll(".px > g")], run: [], loops: [] };
      "fig br hd an px sh al ar th fi kb q".split(" ").forEach(k => b[k] = q("." + k));
      cls.forEach(k => el.classList.add(k)); live.add(b); draw(b, pix(...cur)); loops(b);
      if (!keep && !full && size == 28) { if (avatar) { live.delete(avatar); draw(avatar, F.neutral([0, 0])); avatar.el.classList.remove(...cls); } avatar = b; }
      return b;
    }
    function loops(b) {
      b.loops.forEach(a => a.cancel()); b.loops = [];
      if (still() || b.c) return;
      const k = (el, kf, d, o) => el && b.loops.push(el.animate(kf, Object.assign({ duration: d, iterations: Infinity }, o)));
      const amp = 3 * b.size / 120; // Schweben: −3 px bei 120 px, proportional
      k(b.el, [{ transform: "none", easing: SINE }, { transform: `translateY(${-amp}px)`, easing: SINE }, { transform: "none" }], 4000);
      k(b.sh, [{ transform: "none", easing: SINE }, { transform: "scale(.9)", easing: SINE }, { transform: "none" }], 4000);
      k(b.br, [{ transform: "none", easing: SINE }, { transform: "scale(1.015)", easing: SINE }, { transform: "none" }], 3200);
      k(b.an, [{ transform: "rotate(-3deg)", easing: SINE }, { transform: "rotate(3deg)", easing: SINE }, { transform: "rotate(-3deg)" }], 4000, { delay: 120 });
      b.loops.forEach(a => a.playbackRate = floatRate);
    }
    // ---- Mimik
    const T = (f, ms) => ft.push(setTimeout(f, ms));
    function paint(f, k) { cur = [f, k]; alive().forEach(b => draw(b, pix(f, k))); }
    function fx(part, kf, d, o) { if (still()) return; alive().forEach(b => !b.c && b[part] && b.run.push(b[part].animate(kf, Object.assign({ duration: d }, o)))); }
    function fxg(sel, kf, d, o) { if (still()) return; alive().forEach(b => b.c || b.el.querySelectorAll(sel).forEach(e => e.animate(kf, Object.assign({ duration: d }, o)))); }
    function klass(k, on) { on ? cls.add(k) : cls.delete(k); alive().forEach(b => b.el.classList.toggle(k, on)); }
    const HOLD = { freude: 1560, zwinkern: 300, staunen: 1120, fehler: 2100, danke: 1600, unsicher: 1800 };
    function face(f) {
      ft.forEach(clearTimeout); ft = []; klass("qq", f == "unsicher"); klass("dk", f == "denken");
      if (HOLD[f]) { tmp = f; T(() => { tmp = null; face(base); }, HOLD[f]); } else { tmp = null; base = f; }
      if (f == "freude") { paint(f); fx("px", [{ transform: "scale(.9)" }, { transform: "none" }], 160, { easing: POP }); T(() => { paint("neutral"); fx("px", [{ transform: "scale(.96)" }, { transform: "none" }], 200, { easing: EPE }); }, 1360); }
      else if (f == "zwinkern") { paint("wink1"); T(() => paint("wink2"), 100); T(() => paint("wink1"), 200); }
      else if (f == "staunen") { paint(f); fx("px", [{ transform: "none" }, { transform: "scale(1.06)" }], 120, { easing: POP, fill: "forwards" }); T(() => { alive().forEach(b => b.px.getAnimations().forEach(a => a.cancel())); fx("px", [{ transform: "scale(1.06)" }, { transform: "none" }], 200, { easing: EPE }); }, 920); }
      else if (f == "fehler") { if (still()) paint(f, 4); else [0, 300, 424, 520, 600].forEach((t, k) => T(() => paint(f, k), t)); } // Tropfen fällt 4 Pixel, ease-in
      else if (f == "danke") { paint(f); fxg(".g-h1,.g-h2", [{ transform: "none" }, { transform: "scale(1.15)" }, { transform: "none" }], 400, { iterations: 2, easing: POP }); }
      else if (f == "denken") { let i = 0; const st = () => { if (!document.hidden) paint(f, still() ? -1 : i++ % 3); T(st, 300); }; st(); }
      else paint(f);
      if (f == "neutral") blink();
    }
    function blink() { // zufällig alle 3–6 s, nie zweimal gleich
      clearTimeout(bt); if (still()) return;
      let w; do w = 3000 + Math.round(Math.random() * 30) * 100; while (w == lastB); lastB = w;
      bt = setTimeout(() => { if (base == "neutral" && !tmp && !document.hidden) { paint("half"); T(() => paint("shut"), 40); T(() => paint("half"), 120); T(() => cur[0] == "half" && paint("neutral"), 240); } blink(); }, w);
    }
    function look(dx, dy) { lk = [dx, dy]; if (cur[0] == "neutral") paint("neutral"); }
    // ---- Gesten (nur großer Bit, 120 px); Werte = Storyboard Abschnitt 3
    const K = (d, l, f) => l.map(([t, v, e]) => Object.assign({ offset: t / d, easing: e || "linear" }, f(v)));
    const rot = v => ({ transform: `rotate(${v}deg)` }), op = v => ({ opacity: v });
    const an = (b, el, kf, d, o) => el && b.run.push(el.animate(kf, Object.assign({ duration: d }, o)));
    const GE = {
      wave: [1400, b => an(b, b.ar, K(1400, [[0, -8, EPE], [240, -140, SINE], [460, -125, SINE], [680, -155, SINE], [900, -125, SINE], [1120, -155, EPE], [1400, -8]], rot), 1400)],
      wave1: [900, b => an(b, b.ar, K(900, [[0, -8, EPE], [240, -140, SINE], [460, -155, SINE], [680, -140, EPE], [900, -8]], rot), 900)],
      thumb: [1150, b => { an(b, b.ar, K(1150, [[0, -8, POP], [200, -126, EPE], [300, -120], [900, -120, EPE], [1150, -8]], rot), 1150); an(b, b.th, K(1150, [[0, 0], [90, 1], [1060, 1], [1150, 0]], op), 1150); }],
      shrug: [1020, b => { const L = [[0, 0, EPE], [220, 1], [720, 1, EPE], [1020, 0]];
        an(b, b.al, K(1020, L, v => rot(8 + 97 * v)), 1020); an(b, b.ar, K(1020, L, v => rot(-8 - 97 * v)), 1020);
        an(b, b.fig, K(1020, L, v => ({ transform: `translateY(${-6.25 * v}px)` })), 1020); an(b, b.hd, K(1020, L, v => rot(-6 * v)), 1020); an(b, b.q, K(1020, L, op), 1020); }],
      point: [2800, b => { look(1, 0); setTimeout(() => look(0, 0), 2800);
        an(b, b.ar, K(2800, [[0, [-8, 0], EPE], [260, [-90, 0], EPE], [410, [-90, 6.25], EPE], [560, [-90, 0], EPE], [710, [-90, 6.25], EPE], [860, [-90, 0]], [2500, [-90, 0], EPE], [2800, [-8, 0]]], ([r, x]) => ({ transform: `translateX(${x}px) rotate(${r}deg)` })), 2800);
        an(b, b.fi, K(2800, [[0, 0], [200, 1], [2620, 1], [2800, 0]], op), 2800); }],
      hop: [660, b => { an(b, b.fig, K(660, [[0, [1, 1, 0]], [120, [1.04, .94, 0], "ease-out"], [340, [1, 1, -25], "ease-in"], [540, [1, .97, 0], EPE], [660, [1, 1, 0]]], ([x, y, t]) => ({ transform: `translateY(${t}px) scale(${x},${y})` })), 660);
        an(b, b.sh, K(660, [[0, 1], [120, 1, "ease-out"], [340, .7, "ease-in"], [540, 1], [660, 1]], v => ({ transform: `scale(${v})` })), 660); }]
    };
    function rest(b) { // zurück in die Grundpose (120 ms)
      const ps = [b.al, b.ar, b.hd, b.fig].filter(Boolean), m = ps.map(p => getComputedStyle(p).transform);
      b.run.forEach(a => a.cancel()); b.run = [];
      ps.forEach((p, i) => { const to = getComputedStyle(p).transform; if (m[i] != to) an(b, p, [{ transform: m[i] }, { transform: to }], 120, { easing: EPE }); });
    }
    let lastG = -1e9, gMsg = -1, msg = 0, stg = null, tilt = null, typeT = 0;
    function vis(b) {
      if (!b || !b.full || !b.el.isConnected || document.hidden || !ctx.panel.classList.contains("open")) return false;
      const r = b.el.getBoundingClientRect(), l = ctx.log.getBoundingClientRect(); return r.height > 0 && r.top >= l.top - 30 && r.bottom <= l.bottom + 30;
    }
    const stage = () => alive().filter(vis).pop();
    function gesture(seq, b, msgLess) { // max. 1 Geste pro Bot-Nachricht, danach 8 s Pause; Winken/Hüpfer 1× pro Sitzung
      if (still() || !b || (!msgLess && gMsg == msg) || now() < lastG + 8000) return false;
      for (const g of seq) if (/wave|hop/.test(g) && sg(g.slice(0, 4))) return false;
      seq.forEach(g => /wave|hop/.test(g) && ss(g.slice(0, 4)));
      gMsg = msg; rest(b); let t = 120; seq.forEach(g => { setTimeout(() => b.el.isConnected && GE[g][1](b), t); t += GE[g][0]; }); lastG = now() + t; return true;
    }
    // ---- Zustandsmaschine · Priorität: Fehler > Übergabe > Antwort > Nutzer tippt > Idle/Schlafen
    const PR = { error: 5, handoff: 4, answer: 3, typing: 2, idle: 1, sleep: 0 };
    let st = "idle", until = 0, zz = 0, ctx = {};
    function want(s, ms) { if (PR[s] < PR[st] && now() < until) return false; if (PR[s] > PR[st] && now() < until) alive().forEach(b => b.full && rest(b)); st = s; until = now() + ms; return true; }
    function act() { clearTimeout(zz); zz = setTimeout(sleep, 60000); if (base == "schlafen") { st = "idle"; klass("zz", false); floatRate = 1; alive().forEach(b => b.loops.forEach(a => a.playbackRate = 1)); base = "neutral"; face("staunen"); } }
    function sleep() { if (base != "neutral" || tmp || (now() < until && st != "idle")) return act(); st = "sleep"; klass("zz", true); floatRate = 4000 / 4800; alive().forEach(b => b.loops.forEach(a => a.playbackRate = floatRate)); face("schlafen"); }
    function typing(on) {
      const b = stage();
      if (on) { if (tilt || !want("typing", 1e9)) return; look(0, 1); if (b && !still() && now() > lastG + 8000) { rest(b); tilt = [b, b.hd.animate([rot(0), rot(8)], { duration: 300, easing: EPE, fill: "forwards" }), b.hd.animate([rot(8), rot(6), rot(8)], { duration: 1600, delay: 300, iterations: Infinity, easing: SINE })]; } else tilt = [0]; }
      else if (tilt) { const [tb, a1, a2] = tilt; tilt = null; if (st == "typing") { st = "idle"; until = 0; } look(0, 0);
        if (tb) { const m = getComputedStyle(tb.hd).transform; a1.cancel(); a2.cancel(); tb.hd.animate([{ transform: m }, rot(0)], { duration: 250, easing: EPE }); } }
    }
    let tg = [];
    function think(on) {
      clearTimeout(typeT); tg.forEach(a => a.cancel()); tg = [];
      if (!on) { if (base == "denken") face("neutral"); return; }
      typing(false); face("denken");
      typeT = setTimeout(() => { const b = stage(); if (!b || still() || now() < lastG + 8000) return; rest(b); // > 4 s: Tippen-Geste, max. 8 s
        const kf = (x, y) => [[0, x], [.5, x], [.5, y], [1, y]].map(([t, v]) => Object.assign({ offset: t }, rot(v))), o = { duration: 280, iterations: Infinity };
        tg = [b.al.animate(kf(-20, -30), o), b.ar.animate(kf(30, 20), o), b.kb.animate([op(0), op(1)], { duration: 150, fill: "forwards" })];
        typeT = setTimeout(() => { tg.forEach(a => a.cancel()); tg = []; }, 8000); }, 4000);
    }
    return {
      init(c) { ctx = c; act(); RM.addEventListener && RM.addEventListener("change", () => { alive().forEach(loops); face(base); });
        let paused = [];
        document.addEventListener("visibilitychange", () => { if (document.hidden) { paused = (c.root.getAnimations ? c.root.getAnimations() : []).filter(a => a.playState == "running"); paused.forEach(a => a.pause()); } else { paused.forEach(a => a.play()); paused = []; blink(); } });
        face("neutral"); },
      mount, look, act, typing,
      msg() { msg++; },
      hover(on, x) { act(); klass("hv", on); look(on ? (x > 0 ? 1 : -1) : 0, 0); },
      appear(el) { if (still()) return; el.animate([{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: EPE, delay: 1200, fill: "backwards" }); },
      greet(b) { act(); if (!sg("wave") && !still()) setTimeout(() => { if (vis(b) && gesture(["wave"], b, 1)) face("freude"); }, 320); },
      think,
      answer(r, said, ho) { think(false); act(); if (ho || !want("answer", 1500)) return; const b = stage();
        if (/^\s*(danke|vielen dank|thx|thanks|thank you|tsch|bye)/i.test(said) || /danke|tschuess/.test(r.intent)) return face("danke");
        if (r.intent == "ja_kontakt") { if (!sg("wink")) { ss("wink"); face("zwinkern"); } else face("freude"); return gesture(["thumb"], b); }
        face("neutral"); if ((r.quelle && r.quelle.url) || /\]\(\.{1,2}\//.test(r.text || "")) gesture(["point"], b); },
      error() { think(false); if (!want("error", 2100)) return; face("fehler"); const b = stage(); if (b && !still()) an(b, b.hd, K(2100, [[0, [0, 0], EPE], [200, [4, 3]], [1900, [4, 3], EPE], [2100, [0, 0]]], ([r, y]) => ({ transform: `translateY(${y}px) rotate(${r}deg)` })), 2100); },
      handoff(host) { think(false); const b = mount(host, 120, true); want("handoff", 3820); face("unsicher"); setTimeout(() => gesture(["shrug", "point"], b), 60); },
      success(host) { const b = mount(host, 120, true); act(); face("freude"); setTimeout(() => gesture([sg("hop") ? "thumb" : "hop"], b), 60); },
      bye() { face("danke"); const b = stage(); if (b) gesture(["wave1"], b, 1); return !still(); }
    };
  })();
  /* BIT:END */
  const theme = (me && me.dataset.theme) || "light", DM = matchMedia("(prefers-color-scheme: dark)"); // Dunkelmodus: data-theme="dark" | "auto"
  const dark = () => $(".root").classList.toggle("dark", theme === "dark" || (theme === "auto" && DM.matches)); dark(); DM.addEventListener && DM.addEventListener("change", dark);
  Bit.init({ root, panel: P, log: LOG }); Bit.mount($(".mark"), 56, false, "", 1); Bit.mount($(".hav .hb"), 32, false, "", 1); Bit.appear(L);
  let unklar = 0, closing = 0, tipS = 0, tipE = 0;
  let sid = sessionStorage.getItem("ep-chat-sid"), meta = null, busy = false, lastFocus = null;
  const mobile = () => matchMedia("(max-width: 560px)").matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const linkify = s => esc(s).replace(/\[([^\]]+)\]\((\.{1,2}\/[\w./#-]*)\)/g, '<a href="$2">$1</a>').replace(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g, '<a href="mailto:$1">$1</a>').replace(/\[([^\]]*Platzhalter[^\]]*)\]/g, '<mark style="background:#FFF4C2;border-radius:4px;padding:0 3px">[$1]</mark>');
  async function call(path, body) {
    const ac = window.AbortController && new AbortController(), to = ac && setTimeout(() => ac.abort(), 15000); // Timeout > 15 s = Fehler
    const r = await fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}), signal: ac ? ac.signal : undefined }).finally(() => clearTimeout(to));
    const j = await r.json().catch(() => ({})); if (!r.ok) throw Object.assign(new Error(j.fehler || T.err), { status: r.status }); return j;
  }
  function scroll() { LOG.scrollTop = LOG.scrollHeight; }
  function add(cls, html) { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; LOG.appendChild(d); scroll(); return d; }
  function bot(text, quelle) {
    const row = add("brow", `<span class="bav"></span><div class="msg bot">${linkify(text)}</div>`); Bit.mount(row.firstChild, 28, false); Bit.msg();
    if (quelle && quelle.label) add("src", `${ICON.doc}<span>${T.src}: ${quelle.url ? `<a href="${esc(quelle.url)}" target="_blank" rel="noopener">${esc(quelle.label)}</a>` : esc(quelle.label)}</span>`);
  }
  function chips(list) {
    root.querySelectorAll(".chips").forEach(c => c.remove());
    if (!list || !list.length) return;
    const d = add("chips", ""); d.setAttribute("role", "group"); d.setAttribute("aria-label", LANG === "en" ? "Suggestions" : "Vorschläge");
    list.forEach(t => { const b = document.createElement("button"); b.type = "button"; b.className = "chip" + (/Mensch|person/i.test(t) ? " human" : ""); b.textContent = t;
      b.onclick = () => (/Mensch sprechen|Talk to a person/.test(t) ? form() : ask(t)); d.appendChild(b); });
    scroll(); requestAnimationFrame(scroll);
  }
  function typing(on) { const t = $(".typ"); if (on && !t) { const r = add("brow typ", '<span class="bav"></span><div class="typing"><i></i><i></i><i></i></div>'); r.lastChild.setAttribute("aria-label", LANG === "en" ? "Assistant is typing" : "Assistent schreibt"); Bit.mount(r.firstChild, 28, false, "", 1); } if (!on && t) t.remove(); }
  // Modus „Social-Besucher“: Herkunft aus ?utm_source=/?ref= (instagram, tiktok …) oder manuell ?chat=social bzw. data-modus="social" am Script-Tag.
  // Wird für den Seitenbesuch gemerkt (sessionStorage), damit der Modus beim Weiterklicken bleibt. Es wird nur die Plattform übertragen.
  function social() {
    const q = new URLSearchParams(location.search), m = (me && me.dataset.modus) || q.get("chat") || q.get("modus") || "";
    const src = (q.get("utm_source") || q.get("ref") || "").toLowerCase().slice(0, 30);
    let v = null;
    if (m.toLowerCase() === "social") v = { modus: "social", quelle: src || "manuell" };
    else if (src) v = { utm_source: src };
    try { if (v) sessionStorage.setItem("ep-chat-social", JSON.stringify(v)); else v = JSON.parse(sessionStorage.getItem("ep-chat-social") || "null"); } catch (e) {}
    return v || {};
  }
  async function start() {
    LOG.innerHTML = ""; const g = add("greet", `<span class="gbit"></span><p class="gt">${T.hi}</p>`); Bit.greet(Bit.mount(g.firstChild, 120, true, T.bitl));
    try {
      meta = await call("/api/session", Object.assign({ lang: LANG, seite: location.pathname }, social()));
      sid = meta.sid; sessionStorage.setItem("ep-chat-sid", sid);
      root.querySelectorAll(".pl").forEach(a => { const u = meta.datenschutz_url || ""; if (/^https?:/.test(u)) a.href = u; else { a.href = "#"; a.title = u; a.onclick = e => { e.preventDefault(); bot((LANG === "en" ? "Privacy notice link: " : "Link zu den Datenschutzhinweisen: ") + u); }; } });
      add("notice", esc(T.notice.replace("{d}", meta.loeschfrist_tage)));
      bot(meta.text); chips(meta.chips); requestAnimationFrame(() => requestAnimationFrame(() => { LOG.scrollTop = 0; })); // Begrüßungs-Bit (120 px) bleibt ganz im Blick (nach dem rAF-Scroll von chips)
    } catch (e) { bot(T.err); Bit.error(); }
  }
  async function ask(text) {
    text = (text || "").trim(); if (!text || busy) return;
    busy = true; chips([]); clearTimeout(tipS); clearTimeout(tipE); tipS = 0; Bit.think(true); add("msg me", esc(text)); IN.value = ""; grow(); SEND.disabled = true; typing(true);
    const t0 = performance.now();
    try {
      let r; try { r = await call("/api/message", { sid, text }); } catch (e) { if (e.status === 404) { await start(); r = await call("/api/message", { sid, text }); } else throw e; }
      await new Promise(res => setTimeout(res, Math.max(0, 450 - (performance.now() - t0))));
      typing(false); bot(r.text, r.quelle);
      const ho = r.intent === "mensch" || (/fallback|rueckfrage/.test(r.intent || "") && ++unklar >= 2); Bit.answer(r, text, ho); // Übergabe: „Mensch“ oder 2× unklar
      if (ho) { unklar = 0; handoff({ rueckruf: r.rueckruf, nachricht: text }); } else if (r.aktion === "kontaktformular") form({ rueckruf: r.rueckruf, nachricht: text }); else chips(r.chips);
    } catch (e) { typing(false); bot(e.status ? e.message : T.err); Bit.error(); }
    busy = false; IN.focus();
  }
  function form(pre = {}) {
    chips([]); if ($(".card")) { $(".card input").focus(); return; }
    const c = document.createElement("form"); c.className = "card"; c.noValidate = true; c.setAttribute("aria-labelledby", "ep-ft");
    const consent = T.consent || (meta && meta.einwilligung_text) || "";
    c.innerHTML = `<h3 id="ep-ft">${T.formTitle}</h3><p>${T.formSub}</p>
      <div class="field"><label for="f-n">${T.name}</label><input id="f-n" name="name" autocomplete="name" required></div>
      <div class="row2"><div class="field"><label for="f-e">${T.email}</label><input id="f-e" name="email" type="email" autocomplete="email" inputmode="email"></div>
      <div class="field"><label for="f-t">${T.tel}</label><input id="f-t" name="telefon" type="tel" autocomplete="tel" inputmode="tel"></div></div>
      <div class="field"><label for="f-m">${T.msg}</label><textarea id="f-m" name="nachricht" rows="2">${esc(pre.nachricht || "")}</textarea></div>
      <label class="check"><input type="checkbox" name="rueckruf" ${pre.rueckruf ? "checked" : ""}> <span>${T.cb}</span></label>
      <div class="field cbw" ${pre.rueckruf ? "" : "hidden"}><label for="f-w">${T.when}</label><select id="f-w" name="zeitraum">${T.whenOpts.map(o => `<option>${o}</option>`).join("")}</select></div>
      <label class="check"><input type="checkbox" name="einwilligung" required> <span>${esc(consent)} <a class="pl2" href="#">${T.privacyLink}</a></span></label>
      <div class="err" role="alert"></div>
      <div style="display:flex;gap:8px;align-items:center"><button class="btn" type="submit">${T.submit}</button><button class="btn ghost" type="button" data-x>${T.cancel}</button></div>`;
    LOG.appendChild(c); scroll(); c.querySelector("#f-n").focus();
    c.rueckruf.onchange = () => { c.querySelector(".cbw").hidden = !c.rueckruf.checked; };
    c.querySelector(".pl2").onclick = e => { e.preventDefault(); bot((LANG === "en" ? "Privacy notice: " : "Datenschutzhinweise: ") + ((meta && meta.datenschutz_url) || "")); };
    c.querySelector("[data-x]").onclick = () => { c.remove(); chips(LANG === "en" ? ["Services", "Pricing"] : ["Leistungen", "Was kostet das?"]); IN.focus(); };
    c.onsubmit = async e => {
      e.preventDefault(); const err = c.querySelector(".err"); err.textContent = "";
      if (!c.einwilligung.checked) { err.textContent = T.needConsent; c.einwilligung.focus(); return; }
      const btn = c.querySelector(".btn"); btn.disabled = true;
      try {
        const r = await call("/api/contact", { sid, name: c.name.value, email: c.email.value, telefon: c.telefon.value, nachricht: c.nachricht.value, rueckruf: c.rueckruf.checked, zeitraum: c.zeitraum.value, einwilligung: true });
        c.remove(); typing(true); await new Promise(r => setTimeout(r, 400)); typing(false); bot(r.text); Bit.success(add("bitcard ok", `<span class="cbit"></span><p>✓ ${T.sent}</p>`).firstChild); IN.focus();
      } catch (x) { err.textContent = x.message; btn.disabled = false; }
    };
  }
  function handoff(pre) { chips([]); const c = add("bitcard", `<span class="cbit"></span><button class="btn" type="button">${T.team}</button>`); c.lastChild.onclick = () => form(pre); Bit.handoff(c.firstChild); }
  function grow() { IN.style.height = "auto"; IN.style.height = Math.min(IN.scrollHeight, 120) + "px"; SEND.disabled = !IN.value.trim(); }
  function open() {
    clearTimeout(closing); closing = 0; Bit.act();
    lastFocus = document.activeElement; P.hidden = false; requestAnimationFrame(() => { P.classList.add("open"); B.classList.add("open"); });
    L.setAttribute("aria-expanded", "true"); P.setAttribute("aria-modal", mobile() ? "true" : "false");
    if (!LOG.children.length) start(); setTimeout(() => IN.focus(), 60);
  }
  function close() { if (closing || !P.classList.contains("open")) return; if (Bit.bye()) closing = setTimeout(() => { closing = 0; doClose(); }, 900); else doClose(); } // Abschied: Danke-Gesicht, 900 ms
  function doClose() {
    P.classList.remove("open"); B.classList.remove("open"); L.setAttribute("aria-expanded", "false"); MENU.hidden = true;
    setTimeout(() => { if (!P.classList.contains("open")) P.hidden = true; }, 260);
    if (sid) navigator.sendBeacon && navigator.sendBeacon(API + "/api/end", new Blob([JSON.stringify({ sid })], { type: "application/json" }));
    (lastFocus && lastFocus.focus ? lastFocus : L).focus();
  }
  L.onclick = open; $(".x").onclick = close; B.onclick = close;
  // Ausweichen: Die Bubble verdeckt keine wichtigen Seitenelemente (abschaltbar mit data-avoid="off").
  //  - über Links/Buttons im Inhalt: kompakt (nur Kreis)
  //  - über Footer, Cookie-Banner, Dialogen, festen Leisten: kompakt + nach oben über das Element
  //  - bei Vollbild-Overlays (Lightbox, Cookie-Einstellungen): ausblenden
  if (!(me && me.dataset.avoid === "off")) {
    const INTER = "a[href],button,input,select,textarea,summary,label,video[controls],[role=button],[role=link],[tabindex]:not([tabindex='-1'])";
    const HARD = "footer,[role=contentinfo],#cc-main,[class*=cookie],[id*=cookie],[class*=consent],[id*=consent],[role=dialog],[role=alertdialog],[aria-modal=true]";
    let fullW = 0, lift = 0, tick = 0;
    const fixedAnc = el => { for (let e = el; e && e !== document.body; e = e.parentElement) if (getComputedStyle(e).position === "fixed") return e; return null; };
    const topAt = (x, y) => { for (const el of document.elementsFromPoint(x, y)) { if (el === host || host.contains(el)) continue; return el; } return null; };
    function scan(rect) {
      const res = { soft: false, hardTop: Infinity, overlay: false };
      for (let x = rect.left + 3; x < rect.right - 1; x += 9) for (let y = rect.top + 3; y < rect.bottom - 1; y += 9) {
        const el = topAt(x, y); if (!el) continue;
        let fx = fixedAnc(el);
        if (fx) { // feste Ebene: Vollbild-Overlay → ausblenden; durchklickbare Vollbild-Bühne (pointer-events: none) zählt als normaler Inhalt
          const r = fx.getBoundingClientRect(), st = getComputedStyle(fx);
          if (st.pointerEvents === "none") fx = null;
          else if (r.width * r.height > innerWidth * innerHeight * 0.75) { if (+st.opacity > 0.05 && st.visibility !== "hidden") { res.overlay = true; continue; } fx = null; } }
        let hard = el.closest(HARD); if (hard === document.documentElement || hard === document.body) hard = null;
        const foot = el.closest("footer,[role=contentinfo]"), it = el.closest(INTER); hard = foot || hard;
        if (hard || (fx && it)) {
          // Oberkante des ganzen Bereichs: Footer, Cookie-Box, Dialog bzw. feste Leiste
          const box = foot || (hard ? (hard.id === "cc-main" ? (el.closest(".cm,.pm") || el) : hard) : fx);
          const t = box.getBoundingClientRect().top; if (t < res.hardTop) res.hardTop = t;
        } else if (it) res.soft = true;
      }
      return res;
    }
    function place() {
      tick = 0;
      if (L.getAttribute("aria-expanded") === "true") return;
      const r = L.getBoundingClientRect(); if (!r.width) return;
      if (!L.classList.contains("compact")) fullW = r.width;
      const bottom = r.bottom + lift, h = r.height;
      const full = { left: r.right - (fullW || r.width), right: r.right, top: bottom - h, bottom };
      let s = scan(full), compact = false, nl = 0, away = false;
      if (s.overlay) away = true;
      else if (s.soft || s.hardTop < Infinity) {
        compact = true;
        const c = scan({ left: r.right - h, right: r.right, top: bottom - h, bottom });
        if (c.overlay) away = true;
        else if (c.hardTop < Infinity) nl = Math.min(Math.max(0, bottom - c.hardTop + 12), innerHeight * 0.6);
      }
      L.classList.toggle("compact", compact); L.classList.toggle("away", away);
      if (Math.abs(nl - lift) > 2) { lift = nl; L.style.setProperty("--lift", Math.round(lift) + "px"); }
    }
    const req = () => { if (!tick) tick = requestAnimationFrame(place); };
    addEventListener("scroll", req, { passive: true }); addEventListener("resize", req); setInterval(req, 700); req();
    window.EPChat_place = place;
  }
  MB.onclick = () => { MENU.hidden = !MENU.hidden; MB.setAttribute("aria-expanded", String(!MENU.hidden)); if (!MENU.hidden) MENU.querySelector("button").focus(); };
  root.addEventListener("click", async e => {
    const a = e.target.closest("[data-a]"); if (!a) return; MENU.hidden = true; MB.setAttribute("aria-expanded", "false");
    if (a.dataset.a === "human") ask(T.human);
    if (a.dataset.a === "restart") { sessionStorage.removeItem("ep-chat-sid"); start(); }
    if (a.dataset.a === "delete" && sid) { try { await call("/api/delete", { sid }); } catch (_) {} sessionStorage.removeItem("ep-chat-sid"); sid = null; LOG.innerHTML = ""; add("notice", T.deleted); setTimeout(start, 900); }
  });
  IN.addEventListener("input", () => { grow(); Bit.act(); clearTimeout(tipE); if (!IN.value.trim()) { clearTimeout(tipS); tipS = 0; return Bit.typing(false); }
    if (!tipS) tipS = setTimeout(() => Bit.typing(true), 300); tipE = setTimeout(() => { clearTimeout(tipS); tipS = 0; Bit.typing(false); }, 1500); });
  LOG.addEventListener("scroll", () => Bit.act(), { passive: true }); P.addEventListener("focusin", () => Bit.act()); L.addEventListener("focus", () => Bit.act());
  const hov = e => { if (e.pointerType !== "mouse") return; const r = $(".mark").getBoundingClientRect(); Bit.hover(e.type !== "pointerleave", e.clientX - r.left - r.width / 2); };
  ["pointerenter", "pointermove", "pointerleave"].forEach(t => L.addEventListener(t, hov));
  IN.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(IN.value); } });
  $(".composer").onsubmit = e => { e.preventDefault(); ask(IN.value); };
  root.addEventListener("keydown", e => {
    if (e.key === "Escape") { if (!MENU.hidden) { MENU.hidden = true; MB.focus(); } else if (P.classList.contains("open")) close(); }
    if (e.key === "Tab" && mobile() && P.classList.contains("open")) {  // Fokusfalle im Bottom-Sheet
      const f = [...P.querySelectorAll("button:not([disabled]),a[href],input,textarea,select,[tabindex='0']")].filter(x => x.offsetParent);
      const i = f.indexOf(root.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.EPChat = { open, close, ask: t => { open(); setTimeout(() => ask(t), 300); }, form: () => { open(); setTimeout(form, 300); } };
  if (/[?&#]chat=open/.test(location.href)) open();
})();
