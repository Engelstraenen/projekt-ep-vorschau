/* Projekt-EP-Chat-Widget (öffentliche Demo-Fassung, Antworten kommen aus chat-lokal.js im Browser) – Einbindung: <script src="/chatbot/widget/ep-chat.js" data-api="/chatbot" defer></script>
   Vanilla JS, Shadow DOM (keine Stil-Konflikte mit der Seite), barrierearm (Dialog, Live-Region, Tastatur, Fokus-Rückgabe). */
(() => {
  const me = document.currentScript;
  const API = (me && me.dataset.api) || "/chatbot";
  const BASE = new URL(".", me ? me.src : location.href).href;
  const LANG = (me && me.dataset.lang) || (document.documentElement.lang || "de").slice(0, 2);
  const T = LANG === "en" ? {
    launch: "Questions? Ask us", title: "Chat with Projekt EP", status: "Automated assistant · replies instantly", ph: "Type your question …", send: "Send",
    close: "Close chat", menu: "Options", human: "Talk to a person", del: "Delete conversation", privacy: "Privacy notice", restart: "New conversation",
    notice: "You're chatting with an automated assistant (AI system under the EU AI Act), not a person. Messages are stored to handle your request and deleted after {d} days.",
    src: "Source", formTitle: "How can we reach you?", formSub: "The team gets your request including this chat summary.", name: "Name *", email: "E-mail", tel: "Phone",
    msg: "Your request", cb: "Please call me back", when: "Best time", whenOpts: ["any time", "morning", "afternoon", "evening"], consent: "I consent to Projekt EP storing my details from this chat to handle my request and contact me about it. Deleted after 30 days or on completion; withdraw anytime at kontakt@projekt-ep.de.",
    privacyLink: "Privacy notice", submit: "Send to the team", cancel: "Not now", needConsent: "Please confirm your consent so we may store your details.", deleted: "Conversation deleted.", footL: "Automated assistant", err: "Connection problem – please try again or write to kontakt@projekt-ep.de."
  } : {
    launch: "Fragen? Frag uns", title: "Chat mit Projekt EP", status: "Automatischer Assistent · antwortet sofort", ph: "Deine Frage …", send: "Senden",
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
    <button class="launcher" type="button" aria-expanded="false" aria-controls="ep-panel" aria-haspopup="dialog" aria-label="${T.launch}"><span class="mark"><span class="dots"><i></i><i></i><i></i></span></span><span class="lbl">${T.launch}</span></button>
    <div class="backdrop" aria-hidden="true"></div>
    <section class="panel" id="ep-panel" role="dialog" aria-modal="false" aria-labelledby="ep-title" hidden>
      <div class="grip" aria-hidden="true"></div>
      <header><div class="who"><div class="brand" id="ep-title"><span>PROJEKT <b>EP</b></span><span class="ring" aria-hidden="true">···</span><span class="sr">${T.title}</span></div><div class="status">${T.status}</div></div>
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
  let sid = sessionStorage.getItem("ep-chat-sid"), meta = null, busy = false, lastFocus = null;
  const mobile = () => matchMedia("(max-width: 560px)").matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const linkify = s => esc(s).replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>').replace(/\[([^\]]*Platzhalter[^\]]*)\]/g, '<mark style="background:#FFF4C2;border-radius:4px;padding:0 3px">[$1]</mark>');
  async function call(path, body) {
    const r = await fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw Object.assign(new Error(j.fehler || T.err), { status: r.status }); return j;
  }
  function scroll() { LOG.scrollTop = LOG.scrollHeight; }
  function add(cls, html) { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; LOG.appendChild(d); scroll(); return d; }
  function bot(text, quelle) {
    add("msg bot", linkify(text));
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
  function typing(on) { const t = $(".typing"); if (on && !t) add("typing", "<i></i><i></i><i></i>").setAttribute("aria-label", LANG === "en" ? "Assistant is typing" : "Assistent schreibt"); if (!on && t) t.remove(); }
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
    LOG.innerHTML = "";
    try {
      meta = await call("/api/session", Object.assign({ lang: LANG, seite: location.pathname }, social()));
      sid = meta.sid; sessionStorage.setItem("ep-chat-sid", sid);
      root.querySelectorAll(".pl").forEach(a => { const u = meta.datenschutz_url || ""; if (/^https?:/.test(u)) a.href = u; else { a.href = "#"; a.title = u; a.onclick = e => { e.preventDefault(); bot((LANG === "en" ? "Privacy notice link: " : "Link zu den Datenschutzhinweisen: ") + u); }; } });
      add("notice", esc(T.notice.replace("{d}", meta.loeschfrist_tage)));
      bot(meta.text); chips(meta.chips);
    } catch (e) { bot(T.err); }
  }
  async function ask(text) {
    text = (text || "").trim(); if (!text || busy) return;
    busy = true; chips([]); add("msg me", esc(text)); IN.value = ""; grow(); SEND.disabled = true; typing(true);
    const t0 = performance.now();
    try {
      let r; try { r = await call("/api/message", { sid, text }); } catch (e) { if (e.status === 404) { await start(); r = await call("/api/message", { sid, text }); } else throw e; }
      await new Promise(res => setTimeout(res, Math.max(0, 450 - (performance.now() - t0))));
      typing(false); bot(r.text, r.quelle);
      if (r.aktion === "kontaktformular") form({ rueckruf: r.rueckruf, nachricht: text }); else chips(r.chips);
    } catch (e) { typing(false); bot(e.message || T.err); }
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
        c.remove(); typing(true); await new Promise(r => setTimeout(r, 400)); typing(false); bot(r.text); IN.focus();
      } catch (x) { err.textContent = x.message; btn.disabled = false; }
    };
  }
  function grow() { IN.style.height = "auto"; IN.style.height = Math.min(IN.scrollHeight, 120) + "px"; SEND.disabled = !IN.value.trim(); }
  function open() {
    lastFocus = document.activeElement; P.hidden = false; requestAnimationFrame(() => { P.classList.add("open"); B.classList.add("open"); });
    L.setAttribute("aria-expanded", "true"); P.setAttribute("aria-modal", mobile() ? "true" : "false");
    if (!LOG.children.length) start(); setTimeout(() => IN.focus(), 60);
  }
  function close() {
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
  IN.addEventListener("input", grow);
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
