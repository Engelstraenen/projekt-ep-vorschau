/* Paketstadt · Social (v1) – bedienbares Social-Dashboard im Kundensystem.
 * Alle Inhalte sind BEISPIELDATEN. Keine Konten verbunden, nichts wird gepostet oder live geändert.
 * Zustände (beantwortet, Kampagnen, Planer) liegen nur lokal im Browser (localStorage). */
(function () {
  const api = window.EX_DEMO_API;
  if (!api) return;
  const demo = api.get();
  const gsap = window.gsap;
  const panel = document.getElementById("exSocialPanel");
  const sheet = document.getElementById("exSocialSheet");
  const tab = document.getElementById("exSocialTab");
  const fab = document.getElementById("exSocialOpen");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = api.formatNumber, eur = api.formatEuro;
  const IMG = "./social-media/";
  const LS = "ps-social-v1";

  // ---------- Beispieldaten (Shop-Inhalte) ----------
  const CH = {
    instagram: { name: "Instagram", col: "#d9735a" },
    tiktok: { name: "TikTok", col: "#2b231f" },
    youtube: { name: "YouTube", col: "#b8794f" },
    google: { name: "Google", col: "#5f6c57" }
  };
  const GLYPH = {
    all: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1" class="f"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4.5v9.3a3.6 3.6 0 1 1-3.1-3.6"/><path d="M14 4.5c.6 2 2 3.3 4.2 3.6"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10.5 9.6v4.8l4-2.4z" class="f"/></svg>',
    google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12.2c0 4.3-3 7.3-7.3 7.3a7.5 7.5 0 1 1 5-13.1"/><path d="M12.4 12h7.1"/></svg>'
  };
  const I = {
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6L5.5 10l4.6-1.9z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.5s-7-4.3-7-9.4A4 4 0 0 1 12 7.6a4 4 0 0 1 7 2.5c0 5.1-7 9.4-7 9.4z"/></svg>',
    bubble: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17.5V7.8A2.8 2.8 0 0 1 7.8 5h8.4A2.8 2.8 0 0 1 19 7.8v5.4a2.8 2.8 0 0 1-2.8 2.8H9z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2 10h9.5l2-7H7"/><circle cx="9.5" cy="19" r="1.2"/><circle cx="17" cy="19" r="1.2"/></svg>',
    box: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>',
    move: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8M8 12h8M8 17h8"/></svg>'
  };
  const POSTS = [
    { id: "p1", ch: "instagram", typ: "Reel", img: "unboxing", title: "Unboxing: Parka Nordwind", caption: "Auspacken in 15 Sekunden – warm, wasserabweisend, mit Kapuze. Jetzt im Shop.", date: "08.11.", reach: 18400, views: 24100, likes: 1320, comments: 86, shares: 141, clicks: 612, orders: 38, product: "Parka Nordwind", stock: "18 Stk. · niedrig" },
    { id: "p2", ch: "tiktok", typ: "Video", img: "packen", title: "So packen wir deine Bestellung", caption: "Behind the Scenes aus dem Lager: von der Kommissionierung bis zum Paket-Hub.", date: "07.11.", reach: 42000, views: 61800, likes: 4870, comments: 212, shares: 530, clicks: 980, orders: 41, product: "Trenchcoat Allee", stock: "89 Stk." },
    { id: "p3", ch: "instagram", typ: "Beitrag", img: "outfit", title: "Outfit der Woche", caption: "Bikerjacke Asphalt + Jeans Relaxed + Sneaker Leder Weiß. Welches Teil zuerst?", date: "06.11.", reach: 12600, views: 15800, likes: 980, comments: 64, shares: 72, clicks: 420, orders: 22, product: "Bikerjacke Asphalt", stock: "84 Stk." },
    { id: "p4", ch: "youtube", typ: "Short", img: "streetstyle", title: "Caban Hafen im Herbst", caption: "Zweireihig, Wolle, Ankerknöpfe – der Klassiker für kalte Tage.", date: "05.11.", reach: 9600, views: 14200, likes: 610, comments: 38, shares: 44, clicks: 260, orders: 12, product: "Caban Hafen", stock: "86 Stk." },
    { id: "p5", ch: "instagram", typ: "Beitrag", img: "schmuck", title: "Neu: feiner Goldschmuck", caption: "Ringe und Ketten für jeden Tag – limitierte Stückzahl.", date: "04.11.", reach: 8800, views: 10400, likes: 740, comments: 41, shares: 58, clicks: 310, orders: 17, product: "Kette Solitär", stock: "35 Stk." },
    { id: "p6", ch: "google", typ: "Google-Beitrag", img: "schuhe", title: "Chelsea Boots wieder da", caption: "Wildleder, rutschfeste Sohle – Abholung im Laden oder Versand am selben Tag.", date: "03.11.", reach: 6100, views: 7300, likes: 0, comments: 9, shares: 0, clicks: 540, orders: 26, product: "Chelsea Boot", stock: "109 Stk." }
  ];
  const COMMENTS = [
    { id: "k1", post: "p1", author: "lena.wintermode", text: "Gibt's den Parka auch noch in M? 😍", at: "vor 12 Min.", snt: "pos",
      ai: ["Hi Lena! Ja, der Parka Nordwind ist in M noch da – laut Lager sind es nur noch wenige Stück. Link ist in der Bio, Versand heute bis 21:30 Uhr. 🧥", "Hallo Lena, in M haben wir ihn aktuell noch auf Lager (nur noch wenige). Bestellst du bis 21:30 Uhr, geht er heute noch raus!"] },
    { id: "k2", post: "p2", author: "tim.bestellt", text: "Wann kommt meine Bestellung? Hab gestern bestellt.", at: "vor 25 Min.", snt: "neu",
      ai: ["Hey Tim! Schick uns kurz deine Bestellnummer per DM – dann schauen wir sofort im Lager nach, wo dein Paket gerade ist. 📦", "Hi Tim, danke für deine Geduld! Per DM mit Bestellnummer sagen wir dir in Minuten den genauen Stand."] },
    { id: "k3", post: "p3", author: "jana.style", text: "Die Bikerjacke fällt die eher klein aus?", at: "vor 1 Std.", snt: "neu",
      ai: ["Hi Jana! Die Bikerjacke Asphalt fällt normal aus – bei dicken Pullis darunter eher eine Nummer größer. Maße stehen auf der Produktseite. 🙌", "Hallo Jana, sie sitzt eher körpernah. Wenn du gern Schichten trägst, nimm eine Größe mehr."] },
    { id: "k4", post: "p2", author: "packliebe", text: "So ordentlich verpackt, liebe es!", at: "vor 2 Std.", snt: "pos",
      ai: ["Danke dir! 💛 Das geben wir direkt ans Team in der Packstation weiter.", "Wie schön, danke! Unser Pack-Team freut sich riesig."] },
    { id: "k5", post: "p4", author: "MarcoK", text: "Retoure dauert bei euch ewig …", at: "vor 3 Std.", snt: "neg",
      ai: ["Hi Marco, das tut uns leid! Schreib uns bitte deine Retourennummer per DM – wir prüfen sofort, wo sie gerade in der Retouren-Aufbereitung steckt.", "Hallo Marco, sorry für das Warten! Mit deiner Retourennummer per DM klären wir den Stand noch heute."] },
    { id: "k6", post: "p6", author: "Google-Bewertung", text: "Boots super, Abholung im Laden ging schnell.", at: "vor 5 Std.", snt: "pos",
      ai: ["Vielen Dank für die tolle Bewertung! Wir freuen uns auf Ihren nächsten Besuch im Laden.", "Danke für Ihr Feedback – schön, dass die Abholung so gut geklappt hat!"] }
  ];
  const CAMPS = [
    { id: "c1", name: "Retargeting · Winterjacken", ch: "instagram", daily: 20, spent: 420, leads: 14, orders: 31, rate: 0.068 },
    { id: "c2", name: "Spark Ads · Behind the Scenes", ch: "tiktok", daily: 15, spent: 280, leads: 11, orders: 24, rate: 0.074 },
    { id: "c3", name: "Shorts · Herbst-Looks", ch: "youtube", daily: 18, spent: 510, leads: 9, orders: 15, rate: 0.041 },
    { id: "c4", name: "Suche · Chelsea Boots lokal", ch: "google", daily: 25, spent: 640, leads: 18, orders: 36, rate: 0.058 }
  ];
  const DAYS = ["Mo 09.11.", "Di 10.11.", "Mi 11.11.", "Do 12.11.", "Fr 13.11.", "Sa 14.11.", "So 15.11."];
  const DRAFTS = [
    { id: "d1", day: 0, time: "18:00", ch: "instagram", typ: "Reel", title: "Parka-Restgrößen" },
    { id: "d2", day: 1, time: "12:30", ch: "tiktok", typ: "Video", title: "Retoure in 3 Schritten" },
    { id: "d3", day: 2, time: "17:00", ch: "youtube", typ: "Short", title: "Chelsea Boots pflegen" },
    { id: "d4", day: 3, time: "09:00", ch: "google", typ: "Google-Beitrag", title: "Abholung im Laden" },
    { id: "d5", day: 4, time: "19:00", ch: "instagram", typ: "Beitrag", title: "Wochenend-Outfit" },
    { id: "d6", day: 5, time: "11:00", ch: "tiktok", typ: "Video", title: "Packstation-Rekord" }
  ];

  // ---------- Zustand ----------
  const saved = (() => { try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch (_) { return {}; } })();
  const st = {
    ch: "all", range: "30", sec: "overview", filter: "offen",
    answered: saved.answered || {},
    camps: saved.camps || Object.fromEntries(CAMPS.map((c) => [c.id, { on: true, daily: c.daily }])),
    drafts: saved.drafts || Object.fromEntries(DRAFTS.map((d) => [d.id, d.day])),
    aiIdx: {}
  };
  const persist = () => { try { localStorage.setItem(LS, JSON.stringify({ answered: st.answered, camps: st.camps, drafts: st.drafts })); } catch (_) {} };
  const prevNum = {};
  let prevSeries = null;

  // ---------- Daten-Helfer ----------
  const ids = () => (st.ch === "all" ? api.channelIds() : [st.ch]);
  const org = () => (st.ch === "all" ? api.sumOrganic(st.range) : demo.channels[st.ch].organic[st.range]);
  const ads = () => (st.ch === "all" ? api.sumAds(st.range) : demo.channels[st.ch].ads[st.range]);
  const N = 24;
  function resample(arr, n) { const out = []; for (let i = 0; i < n; i++) { const t = (i / (n - 1)) * (arr.length - 1); const a = Math.floor(t), b = Math.min(arr.length - 1, a + 1); out.push(arr[a] + (arr[b] - arr[a]) * (t - a)); } return out; }
  function seriesFor() { return ids().map((id) => ({ id, v: resample(demo.channels[id].series[st.range], N) })); }
  function dateAt(i) { const days = +st.range; const d = new Date(2026, 10, 9); d.setDate(d.getDate() - Math.round((1 - i / (N - 1)) * (days - 1))); return d.getDate() + "." + (d.getMonth() + 1) + "."; }
  const openComments = () => COMMENTS.filter((c) => !st.answered[c.id] && (st.ch === "all" || postById(c.post).ch === st.ch));
  const postById = (id) => POSTS.find((p) => p.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- Toast ----------
  let toastEl = null, toastT = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "sxp-toast"; toastEl.setAttribute("role", "status"); toastEl.setAttribute("aria-live", "polite"); document.body.appendChild(toastEl); }
    toastEl.innerHTML = I.check + "<span>" + msg + "</span>"; toastEl.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("on"), 2600);
  }

  // ---------- Bausteine ----------
  function seg(name, opts, cur, attr) {
    return `<div class="sxp-seg" role="tablist" aria-label="${name}" data-seg="${attr}"><span class="sxp-thumb" aria-hidden="true"></span>${opts.map(([v, l]) => `<button type="button" role="tab" data-${attr}="${v}" aria-selected="${v === cur}">${l}</button>`).join("")}</div>`;
  }
  function chChips() {
    const list = [["all", "Alle"], ...api.channelIds().map((id) => [id, CH[id].name])];
    return `<div class="sxp-chips" role="tablist" aria-label="Kanal filtern">${list.map(([id, l]) => `<button type="button" role="tab" class="sxp-chip" data-ch="${id}" aria-selected="${st.ch === id}" style="--c:${id === "all" ? "#a8452e" : CH[id].col}"><span class="g">${GLYPH[id]}</span>${l}</button>`).join("")}</div>`;
  }
  function kpi(key, label, val, sub) { return `<div class="sxp-kpi"><span class="l">${label}</span><b data-k="${key}" data-n="${val}">${fmt(prevNum[key] ?? 0)}</b><small>${sub}</small></div>`; }

  function chart() {
    const S = seriesFor(); const w = 340, h = 176, L = 34, R = 8, T = 12, B = 26;
    const all = S.flatMap((s) => s.v); const max = Math.max(...all) * 1.08, min = Math.min(0, ...all);
    const X = (i) => L + (i / (N - 1)) * (w - L - R), Y = (v) => T + (1 - (v - min) / (max - min || 1)) * (h - T - B);
    const grid = [0, 0.5, 1].map((t) => { const v = min + (max - min) * t; const y = Y(v); return `<line x1="${L}" x2="${w - R}" y1="${y}" y2="${y}" class="gl"/><text x="${L - 6}" y="${y + 3}" text-anchor="end" class="ax">${fmt(Math.round(v))}</text>`; }).join("");
    const xl = [0, Math.floor((N - 1) / 2), N - 1].map((i) => `<text x="${X(i)}" y="${h - 7}" text-anchor="middle" class="ax">${dateAt(i)}</text>`).join("");
    const single = S.length === 1;
    return { w, h, L, R, T, B, X, Y, S, svg: `<svg viewBox="0 0 ${w} ${h}" class="sxp-svg" role="img" aria-label="Verlauf ${single ? CH[S[0].id].name : "alle Kanäle"} · ${demo.ranges[st.range].label} · Beispieldaten">
      <defs><linearGradient id="sxpFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${single ? CH[S[0].id].col : "#d9735a"}" stop-opacity=".22"/><stop offset="1" stop-color="${single ? CH[S[0].id].col : "#d9735a"}" stop-opacity="0"/></linearGradient></defs>
      ${grid}${xl}${single ? `<path class="ar" fill="url(#sxpFill)"/>` : ""}
      ${S.map((s) => `<path class="ln" data-id="${s.id}" stroke="${CH[s.id].col}" stroke-width="${single ? 2.6 : 2}"/>`).join("")}
      <line class="guide" y1="${T}" y2="${h - B}" x1="-10" x2="-10"/>
      ${S.map((s) => `<circle class="hd" data-id="${s.id}" r="4" fill="#fff" stroke="${CH[s.id].col}" stroke-width="2" cx="-10" cy="-10"/>`).join("")}
      <rect class="hit" x="${L}" y="0" width="${w - L - R}" height="${h}" fill="transparent"/></svg>` };
  }
  function drawChart(root, animate) {
    const C = chart(); const box = root.querySelector("#sxpChart"); if (!box) return;
    box.innerHTML = C.svg + `<div class="sxp-legend">${C.S.map((s) => `<span><i style="background:${CH[s.id].col}"></i>${CH[s.id].name}</span>`).join("")}<span class="bsp">Beispieldaten</span></div><div class="sxp-tip" hidden></div>`;
    const from = prevSeries && prevSeries.length === C.S.length && prevSeries.every((p, i) => p.id === C.S[i].id) ? prevSeries : null;
    const pathOf = (v) => v.map((y, i) => (i ? "L" : "M") + C.X(i).toFixed(1) + "," + C.Y(y).toFixed(1)).join(" ");
    const paint = (t) => {
      C.S.forEach((s, k) => {
        const v = from ? s.v.map((y, i) => from[k].v[i] + (y - from[k].v[i]) * t) : s.v;
        const d = pathOf(v);
        const el = box.querySelector(`.ln[data-id="${s.id}"]`); el.setAttribute("d", d);
        const ar = box.querySelector(".ar"); if (ar) ar.setAttribute("d", d + ` L${C.X(N - 1)},${C.h - C.B} L${C.X(0)},${C.h - C.B} Z`);
      });
    };
    if (reduce || !gsap || !animate) paint(1);
    else if (from) { const o = { t: 0 }; paint(0); gsap.to(o, { t: 1, duration: 0.7, ease: "power3.inOut", onUpdate: () => paint(o.t) }); }
    else {
      paint(1);
      box.querySelectorAll(".ln").forEach((el, i) => { const len = el.getTotalLength(); gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, delay: i * 0.06, ease: "power2.out", onComplete: () => el.style.strokeDasharray = "none" }); });
      const ar = box.querySelector(".ar"); if (ar) gsap.from(ar, { opacity: 0, duration: 0.6, delay: 0.3 });
    }
    prevSeries = C.S.map((s) => ({ id: s.id, v: s.v.slice() }));
    // Tippen/Ziehen = Wert anzeigen
    const svg = box.querySelector("svg"), tip = box.querySelector(".sxp-tip"), guide = box.querySelector(".guide");
    const show = (e) => {
      const r = svg.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * C.w;
      const i = Math.max(0, Math.min(N - 1, Math.round(((x - C.L) / (C.w - C.L - C.R)) * (N - 1))));
      const gx = C.X(i); guide.setAttribute("x1", gx); guide.setAttribute("x2", gx);
      C.S.forEach((s) => { const c = box.querySelector(`.hd[data-id="${s.id}"]`); c.setAttribute("cx", gx); c.setAttribute("cy", C.Y(s.v[i])); });
      tip.hidden = false;
      tip.innerHTML = `<b>${dateAt(i)}</b>` + C.S.map((s) => `<span><i style="background:${CH[s.id].col}"></i>${CH[s.id].name}<em>${fmt(Math.round(s.v[i]))}</em></span>`).join("");
      const px = (gx / C.w) * r.width; tip.style.left = Math.min(r.width - 150, Math.max(0, px - 75)) + "px";
    };
    svg.addEventListener("pointerdown", show); svg.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || e.buttons) show(e); });
    svg.addEventListener("pointerleave", () => { tip.hidden = true; guide.setAttribute("x1", -10); guide.setAttribute("x2", -10); C.S.forEach((s) => box.querySelector(`.hd[data-id="${s.id}"]`).setAttribute("cx", -10)); });
  }

  function postCard(p) {
    return `<button type="button" class="sxp-post" data-post="${p.id}" aria-label="${esc(p.title)} öffnen">
      <span class="ph"><img src="${IMG + p.img}-s.webp" alt="" loading="lazy" decoding="async" width="216" height="384"><span class="ch" style="--c:${CH[p.ch].col}">${GLYPH[p.ch]}${p.typ}</span><span class="bsp">Beispiel</span></span>
      <span class="mt"><b>${esc(p.title)}</b><small>${fmt(p.reach)} Reichweite · ${p.orders} Bestellungen</small></span></button>`;
  }
  function commentRow(c, inDetail) {
    const p = postById(c.post); const done = st.answered[c.id]; const idx = st.aiIdx[c.id] || 0;
    const snt = { pos: ["positiv", "g"], neu: ["Frage", "n"], neg: ["kritisch", "c"] }[c.snt];
    return `<article class="sxp-cm ${done ? "done" : ""}" data-cm="${c.id}">
      <div class="hd"><span class="av" style="--c:${CH[p.ch].col}">${esc(c.author[0].toUpperCase())}</span><div class="who"><b>${esc(c.author)}</b><small>${CH[p.ch].name} · ${inDetail ? c.at : esc(p.title) + " · " + c.at}</small></div><span class="sxp-tag ${snt[1]}">${snt[0]}</span></div>
      <p class="tx">${esc(c.text)}</p>
      ${done ? `<div class="ans">${I.check}<div><b>Beantwortet (lokal, Beispiel)</b><p>${esc(done)}</p></div><button type="button" class="lnk" data-undo="${c.id}">Rückgängig</button></div>`
        : `<div class="rp"><label class="ai" for="ta-${c.id}">${I.spark}KI-Antwortvorschlag <span>nutzt Lager- &amp; Shopdaten</span></label>
          <textarea id="ta-${c.id}" rows="3">${esc(c.ai[idx % c.ai.length])}</textarea>
          <div class="bt"><button type="button" class="sxp-btn q" data-alt="${c.id}">Neu vorschlagen</button><button type="button" class="sxp-btn p" data-ok="${c.id}">${I.check}Freigeben</button></div></div>`}
    </article>`;
  }
  function campCard(c) {
    const s = st.camps[c.id]; const fc = Math.round(s.daily * 7 * c.rate * (s.on ? 1 : 0));
    const pct = Math.min(100, Math.round((c.spent / (s.daily * 30)) * 100));
    return `<article class="sxp-camp ${s.on ? "" : "off"}" data-camp="${c.id}">
      <div class="hdr"><span class="g" style="--c:${CH[c.ch].col}">${GLYPH[c.ch]}</span><div class="nm"><b>${esc(c.name)}</b><small>${CH[c.ch].name} · ${s.on ? "aktiv" : "pausiert"}</small></div>
        <button type="button" class="sxp-sw" role="switch" aria-checked="${s.on}" data-tg="${c.id}" aria-label="${esc(c.name)} ${s.on ? "pausieren" : "aktivieren"}"><i></i></button></div>
      <div class="row3"><div><span>Ausgegeben</span><b>${eur(c.spent)}</b></div><div><span>Leads</span><b>${c.leads}</b></div><div><span>Bestellungen</span><b>${c.orders}</b></div></div>
      <div class="bar"><i style="width:${pct}%"></i></div><small class="m">${pct} % vom Monatsbudget · Beispiel</small>
      <label class="rg"><span>Tagesbudget</span><b data-bv="${c.id}">${eur(s.daily)}</b></label>
      <input type="range" min="5" max="80" step="1" value="${s.daily}" data-bud="${c.id}" aria-label="Tagesbudget ${esc(c.name)}" ${s.on ? "" : "disabled"} style="--p:${((s.daily - 5) / 75) * 100}%">
      <p class="fc">Prognose 7 Tage: <b data-fc="${c.id}">${fc}</b> Bestellungen · ${eur(s.daily * 7)} Budget</p>
    </article>`;
  }
  function planner() {
    return `<p class="sxp-hint">${I.move}Entwürfe ziehen (oder antippen) und auf einen anderen Tag legen. Nichts wird veröffentlicht.</p>
      <div class="sxp-week" id="sxpWeek">${DAYS.map((d, i) => `<section class="day" data-day="${i}" aria-label="${d}"><h4>${d.split(" ")[0]}<small>${d.split(" ")[1]}</small></h4><div class="drop">${DRAFTS.filter((x) => st.drafts[x.id] === i).map((x) => `<button type="button" class="sxp-draft" data-draft="${x.id}" style="--c:${CH[x.ch].col}"><span class="g">${GLYPH[x.ch]}</span><b>${esc(x.title)}</b><small>${x.time} · ${x.typ} · Entwurf</small></button>`).join("")}</div></section>`).join("")}</div>
      <div class="sxp-mover" id="sxpMover" hidden></div>`;
  }

  // ---------- Rendern ----------
  function render(opts = {}) {
    const o = org(), a = ads(), open = openComments();
    const posts = POSTS.filter((p) => st.ch === "all" || p.ch === st.ch);
    const camps = CAMPS.filter((c) => st.ch === "all" || c.ch === st.ch);
    const comments = COMMENTS.filter((c) => st.ch === "all" || postById(c.post).ch === st.ch).filter((c) => (st.filter === "offen" ? !st.answered[c.id] : !!st.answered[c.id]));
    const tabs = [["overview", "Überblick"], ["posts", "Posts"], ["comments", `Kommentare${open.length ? ` <span class="n">${open.length}</span>` : ""}`], ["camps", "Kampagnen"], ["plan", "Planer"]];
    sheet.innerHTML = `<div class="sxp" id="sxpRoot">
      <header class="sxp-head">
        <div class="t"><span class="sxp-eye">Paketstadt-Shop</span><h2>Social</h2></div>
        <span class="sxp-badge">BEISPIELDATEN</span>
        <button type="button" class="sxp-x" id="exSocialClose" aria-label="Social schließen">${I.x}</button>
      </header>
      <div class="sxp-filters">${chChips()}${seg("Zeitraum", [["7", "7 T"], ["30", "30 T"], ["90", "90 T"]], st.range, "range")}</div>
      <nav class="sxp-tabs" role="tablist" aria-label="Bereiche">${tabs.map(([id, l]) => `<button type="button" role="tab" data-sec="${id}" aria-selected="${st.sec === id}">${l}</button>`).join("")}</nav>
      <div class="sxp-body" data-sec-body="${st.sec}">
        ${st.sec === "overview" ? `
          <div class="sxp-kpis">${kpi("reach", "Reichweite", o.reach, demo.ranges[st.range].label)}${kpi("views", "Aufrufe", o.views, "Videos &amp; Posts")}${kpi("clicks", "Klicks in den Shop", a.clicks, "CTR " + api.formatPct(a.ctr))}${kpi("orders", "Bestellungen aus Social", a.conversions, "ROAS " + fmt(a.roas))}</div>
          <section class="sxp-card"><div class="ch"><h3>Verlauf</h3><small>tippen oder ziehen für Werte</small></div><div class="sxp-chart" id="sxpChart"></div></section>
          <section class="sxp-card"><div class="ch"><h3>Top-Posts</h3><button type="button" class="lnk" data-go="posts">alle ${I.chev}</button></div><div class="sxp-rail">${posts.slice(0, 4).map(postCard).join("")}</div></section>
          <section class="sxp-card sxp-inbox"><div class="ch"><h3>Offene Kommentare</h3><span class="sxp-tag ${open.length ? "c" : "g"}">${open.length} offen</span></div>
            ${open.slice(0, 2).map((c) => `<button type="button" class="sxp-mini" data-jump-cm="${c.id}"><span class="av" style="--c:${CH[postById(c.post).ch].col}">${esc(c.author[0].toUpperCase())}</span><span><b>${esc(c.author)}</b><small>${esc(c.text)}</small></span>${I.chev}</button>`).join("") || `<p class="sxp-empty">Alles beantwortet. 🎉</p>`}
            ${open.length ? `<button type="button" class="sxp-btn p wide" data-go="comments">${I.spark}Mit KI-Vorschlägen beantworten</button>` : ""}</section>
          <section class="sxp-card"><div class="ch"><h3>Social → Shop → Lager</h3><small>Beispiel-Kette</small></div>
            <div class="sxp-flow">${[["Klicks", a.clicks, I.cart], ["Bestellungen", a.conversions, I.box], ["Pakete versendet", Math.round(a.conversions * 0.92), I.box]].map(([l, v, ic], i) => `<div class="st"><span class="ic">${ic}</span><b data-k="flow${i}" data-n="${v}">${fmt(prevNum["flow" + i] ?? 0)}</b><small>${l}</small></div>`).join('<span class="ar" aria-hidden="true"></span>')}</div></section>`
        : st.sec === "posts" ? `<div class="sxp-grid">${posts.map(postCard).join("") || '<p class="sxp-empty">Keine Posts für diesen Kanal.</p>'}</div>`
        : st.sec === "comments" ? `${seg("Status", [["offen", `Offen · ${open.length}`], ["beantwortet", "Beantwortet"]], st.filter, "filter")}<div class="sxp-list">${comments.map((c) => commentRow(c)).join("") || `<p class="sxp-empty">${st.filter === "offen" ? "Keine offenen Kommentare. 🎉" : "Noch nichts freigegeben."}</p>`}</div>`
        : st.sec === "camps" ? `<div class="sxp-camp-sum" id="sxpCampSum"></div><div class="sxp-list">${camps.map(campCard).join("")}</div><p class="sxp-note">Beispiel: Schalter und Regler ändern nur diese Vorschau, keine echte Werbekampagne.</p>`
        : planner()}
      </div>
    </div>`;
    bind(opts);
  }

  function campSum() {
    const el = sheet.querySelector("#sxpCampSum"); if (!el) return;
    const on = CAMPS.filter((c) => st.camps[c.id].on); const daily = on.reduce((s, c) => s + st.camps[c.id].daily, 0);
    const fc = on.reduce((s, c) => s + Math.round(st.camps[c.id].daily * 7 * c.rate), 0);
    el.innerHTML = `<div><span>Aktiv</span><b>${on.length}/${CAMPS.length}</b></div><div><span>Tagesbudget</span><b>${eur(daily)}</b></div><div><span>Prognose 7 T</span><b>${fc} Best.</b></div>`;
  }

  function countUp(root) {
    root.querySelectorAll("[data-n]").forEach((el) => {
      const k = el.getAttribute("data-k"), to = +el.getAttribute("data-n"), from = prevNum[k] ?? 0; prevNum[k] = to;
      if (reduce || !gsap) { el.textContent = fmt(to); return; }
      const ob = { v: from }; gsap.to(ob, { v: to, duration: 0.8, ease: "power3.out", onUpdate: () => (el.textContent = fmt(Math.round(ob.v))) });
    });
  }
  function moveThumbs(root, instant) {
    root.querySelectorAll(".sxp-seg").forEach((s) => {
      const on = s.querySelector('[aria-selected="true"]'), th = s.querySelector(".sxp-thumb"); if (!on || !th) return;
      const x = on.offsetLeft, w = on.offsetWidth;
      if (instant || reduce || !gsap || th.dataset.x == null) { th.style.transform = `translateX(${x}px)`; th.style.width = w + "px"; }
      else gsap.fromTo(th, { x: +th.dataset.x, width: +th.dataset.w }, { x, width: w, duration: 0.35, ease: "power3.out", onComplete: () => { th.style.transform = `translateX(${x}px)`; } });
      th.dataset.x = x; th.dataset.w = w;
    });
  }

  function bind(opts) {
    const root = sheet.querySelector("#sxpRoot");
    root.querySelector("#exSocialClose").onclick = close;
    root.querySelectorAll("[data-ch]").forEach((b) => b.addEventListener("click", () => { if (st.ch === b.dataset.ch) return; st.ch = b.dataset.ch; prevSeries = null; rerender(); }));
    root.querySelectorAll("[data-range]").forEach((b) => b.addEventListener("click", () => { if (st.range === b.dataset.range) return; const old = root.querySelector('.sxp-seg[data-seg="range"] .sxp-thumb'); const ox = old?.dataset.x, ow = old?.dataset.w; st.range = b.dataset.range; rerender({ thumbFrom: { range: [ox, ow] } }); }));
    root.querySelectorAll("[data-sec]").forEach((b) => b.addEventListener("click", () => { st.sec = b.dataset.sec; rerender({ secChange: true }); }));
    root.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { st.sec = b.dataset.go; rerender({ secChange: true }); }));
    root.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => { st.filter = b.dataset.filter; rerender({ keepScroll: true }); }));
    root.querySelectorAll("[data-post]").forEach((b) => b.addEventListener("click", () => openPost(b.dataset.post)));
    root.querySelectorAll("[data-jump-cm]").forEach((b) => b.addEventListener("click", () => { const c = COMMENTS.find((x) => x.id === b.dataset.jumpCm); openPost(c.post, c.id); }));
    bindComments(root, () => rerender({ keepScroll: true }));
    // Kampagnen
    root.querySelectorAll("[data-tg]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.tg; st.camps[id].on = !st.camps[id].on; persist();
      const c = CAMPS.find((x) => x.id === id); const card = b.closest(".sxp-camp"); card.outerHTML = campCard(c);
      const nc = root.querySelector(`[data-camp="${id}"]`); bindCamp(nc); campSum();
      if (gsap && !reduce) gsap.fromTo(nc, { scale: 0.985 }, { scale: 1, duration: 0.35, ease: "power3.out" });
      toast(`${c.name}: ${st.camps[id].on ? "aktiviert" : "pausiert"} (Beispiel)`);
    }));
    root.querySelectorAll(".sxp-camp").forEach(bindCamp);
    campSum();
    // Planer
    bindPlanner(root);
    // Animationen
    if (root.querySelector("#sxpChart")) drawChart(root, true);
    countUp(root);
    const tf = opts.thumbFrom || {};
    root.querySelectorAll(".sxp-seg").forEach((s) => { const k = s.dataset.seg; const th = s.querySelector(".sxp-thumb"); if (tf[k] && tf[k][0] != null) { th.dataset.x = tf[k][0]; th.dataset.w = tf[k][1]; } });
    requestAnimationFrame(() => moveThumbs(root, !tf.range));
    const on = root.querySelector(".sxp-tabs [aria-selected=true]"); on && on.scrollIntoView({ inline: "center", block: "nearest" });
    const chOn = root.querySelector(".sxp-chips [aria-selected=true]"); chOn && chOn.scrollIntoView({ inline: "nearest", block: "nearest" });
    if (opts.secChange && gsap && !reduce) gsap.from(root.querySelectorAll(".sxp-body > *"), { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: "power3.out" });
    if (opts.first && gsap && !reduce) gsap.from(root.querySelectorAll(".sxp-head, .sxp-filters, .sxp-tabs, .sxp-body > *"), { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" });
  }
  function rerender(opts = {}) { const y = sheet.scrollTop; render(opts); if (opts.keepScroll || !opts.secChange) sheet.scrollTop = y; else sheet.scrollTop = 0; }

  function bindCamp(card) {
    const id = card.dataset.camp, c = CAMPS.find((x) => x.id === id), r = card.querySelector("[data-bud]");
    r && r.addEventListener("input", () => {
      const v = +r.value; st.camps[id].daily = v; r.style.setProperty("--p", ((v - 5) / 75) * 100 + "%");
      card.querySelector(`[data-bv="${id}"]`).textContent = eur(v);
      card.querySelector(`[data-fc="${id}"]`).textContent = Math.round(v * 7 * c.rate);
      card.querySelector(".fc").lastChild.textContent = " Bestellungen · " + eur(v * 7) + " Budget";
      campSum();
    });
    r && r.addEventListener("change", () => { persist(); toast(`Tagesbudget ${eur(+r.value)} gespeichert (nur lokal, Beispiel)`); });
  }

  function bindComments(scope, after) {
    scope.querySelectorAll("[data-alt]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.alt; st.aiIdx[id] = (st.aiIdx[id] || 0) + 1; const c = COMMENTS.find((x) => x.id === id);
      const ta = scope.querySelector("#ta-" + id); const txt = c.ai[st.aiIdx[id] % c.ai.length];
      if (reduce || !gsap) ta.value = txt; else { ta.value = ""; let i = 0; const t = setInterval(() => { ta.value = txt.slice(0, (i += 3)); if (i >= txt.length) clearInterval(t); }, 16); }
    }));
    scope.querySelectorAll("[data-ok]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.ok; const ta = scope.querySelector("#ta-" + id); st.answered[id] = (ta && ta.value.trim()) || "–"; persist();
      const card = b.closest(".sxp-cm");
      const done = () => { after(); toast("Antwort freigegeben – lokal als beantwortet markiert (Beispiel, nichts gesendet)"); };
      if (gsap && !reduce && card) gsap.to(card, { scale: 0.98, autoAlpha: 0.4, duration: 0.22, ease: "power2.in", onComplete: done }); else done();
    }));
    scope.querySelectorAll("[data-undo]").forEach((b) => b.addEventListener("click", () => { delete st.answered[b.dataset.undo]; persist(); after(); }));
  }

  // ---------- Post-Detail ----------
  let detail = null;
  function openPost(pid, focusCm) {
    const p = postById(pid); if (!p) return;
    if (!detail) { detail = document.createElement("div"); detail.className = "sxp-detail"; detail.setAttribute("role", "dialog"); detail.setAttribute("aria-modal", "true"); panel.appendChild(detail); }
    const paint = () => {
      const cms = COMMENTS.filter((c) => c.post === pid);
      const eng = p.reach ? ((p.likes + p.comments + p.shares) / p.reach) * 100 : 0;
      detail.setAttribute("aria-label", p.title);
      detail.innerHTML = `<div class="sxp-dsheet">
        <header><button type="button" class="sxp-x" data-dclose aria-label="Zurück">${I.back}</button><div><small style="color:var(--coral-ink)">${CH[p.ch].name} · ${p.typ} · ${p.date}</small><b>${esc(p.title)}</b></div><span class="sxp-badge">BEISPIEL</span></header>
        <div class="dbody">
          <div class="pv"><img src="${IMG + p.img}.webp" alt="Beispiel-Vorschau: ${esc(p.title)}" width="432" height="768"><span class="bsp">Beispiel-Vorschau</span>
            <div class="cap"><b>@paketstadt.shop</b> ${esc(p.caption)}</div></div>
          <div class="side">
            <div class="sxp-kpis s">${[["Reichweite", p.reach], ["Aufrufe", p.views], ["Likes", p.likes], ["Kommentare", p.comments], ["Klicks → Shop", p.clicks], ["Bestellungen", p.orders]].map(([l, v], i) => `<div class="sxp-kpi"><span class="l">${l}</span><b data-k="d${pid}${i}" data-n="${v}">0</b></div>`).join("")}</div>
            <p class="sxp-eng">Interaktionsrate <b>${api.formatPct(Math.round(eng * 10) / 10)}</b> · Produkt <b>${esc(p.product)}</b> · Lager ${esc(p.stock)}</p>
            <h4 class="sxp-h4">Kommentare <span class="sxp-tag ${cms.some((c) => !st.answered[c.id]) ? "c" : "g"}">${cms.filter((c) => !st.answered[c.id]).length} offen</span></h4>
            <div class="sxp-list">${cms.map((c) => commentRow(c, true)).join("") || '<p class="sxp-empty">Noch keine Kommentare.</p>'}</div>
          </div></div></div>`;
      detail.querySelector("[data-dclose]").onclick = closePost;
      bindComments(detail, () => { paint(); render({ keepScroll: true }); });
      detail.querySelectorAll("[data-n]").forEach((el) => { const to = +el.dataset.n; if (reduce || !gsap) { el.textContent = fmt(to); return; } const ob = { v: 0 }; gsap.to(ob, { v: to, duration: 0.7, ease: "power3.out", onUpdate: () => (el.textContent = fmt(Math.round(ob.v))) }); });
    };
    paint();
    detail.classList.add("on"); document.body.classList.add("sxp-detail-open");
    const ds = detail.querySelector(".sxp-dsheet");
    if (gsap && !reduce) gsap.fromTo(ds, { yPercent: 8, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "expo.out" });
    if (focusCm) setTimeout(() => { const el = detail.querySelector(`[data-cm="${focusCm}"]`); el && el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); el && el.querySelector("textarea")?.focus({ preventScroll: true }); }, 380);
    else detail.querySelector("[data-dclose]").focus({ preventScroll: true });
  }
  function closePost() {
    if (!detail || !detail.classList.contains("on")) return;
    const fin = () => { detail.classList.remove("on"); document.body.classList.remove("sxp-detail-open"); };
    const ds = detail.querySelector(".sxp-dsheet");
    if (gsap && !reduce) gsap.to(ds, { yPercent: 6, autoAlpha: 0, duration: 0.25, ease: "power2.in", onComplete: fin }); else fin();
  }

  // ---------- Planer: Ziehen & Ablegen (Pointer) + Antippen ----------
  function bindPlanner(root) {
    const week = root.querySelector("#sxpWeek"); if (!week) return;
    const mover = root.querySelector("#sxpMover");
    const moveTo = (id, day) => {
      if (st.drafts[id] === day) return; st.drafts[id] = day; persist();
      const d = DRAFTS.find((x) => x.id === id);
      rerender({ keepScroll: true });
      const el = sheet.querySelector(`[data-draft="${id}"]`);
      if (el && gsap && !reduce) gsap.fromTo(el, { scale: 0.9, autoAlpha: 0.3 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" });
      toast(`„${d.title}“ auf ${DAYS[day]} verschoben (Entwurf, Beispiel)`);
    };
    week.querySelectorAll("[data-draft]").forEach((el) => {
      let sx = 0, sy = 0, drag = false, ghost = null, pid = null;
      el.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; drag = false; pid = e.pointerId; });
      el.addEventListener("pointermove", (e) => {
        if (pid !== e.pointerId || !(e.buttons || e.pointerType === "touch")) return;
        if (!drag && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) {
          if (e.pointerType === "touch" && Math.abs(e.clientY - sy) > Math.abs(e.clientX - sx) * 1.4) { pid = null; return; }
          drag = true; el.setPointerCapture(e.pointerId);
          ghost = el.cloneNode(true); ghost.classList.add("ghost"); const r = el.getBoundingClientRect(); ghost.style.width = r.width + "px"; document.body.appendChild(ghost); el.classList.add("lift");
        }
        if (drag) {
          e.preventDefault(); ghost.style.transform = `translate(${e.clientX - 40}px,${e.clientY - 24}px) rotate(-2deg)`;
          week.querySelectorAll(".day").forEach((d) => d.classList.remove("over"));
          const t = document.elementFromPoint(e.clientX, e.clientY); const day = t && t.closest && t.closest(".day"); day && day.classList.add("over");
          const wr = week.getBoundingClientRect(); if (e.clientX > wr.right - 30) week.scrollLeft += 8; else if (e.clientX < wr.left + 30) week.scrollLeft -= 8;
        }
      });
      const end = (e) => {
        if (pid !== e.pointerId) return; pid = null;
        if (!drag) return;
        ghost && ghost.remove(); el.classList.remove("lift"); week.querySelectorAll(".day").forEach((d) => d.classList.remove("over"));
        const t = document.elementFromPoint(e.clientX, e.clientY); const day = t && t.closest && t.closest(".day");
        el.dataset.justDragged = "1"; setTimeout(() => delete el.dataset.justDragged, 50);
        if (day) moveTo(el.dataset.draft, +day.dataset.day);
      };
      el.addEventListener("pointerup", end); el.addEventListener("pointercancel", (e) => { if (ghost) ghost.remove(); el.classList.remove("lift"); pid = null; });
      el.addEventListener("click", () => {
        if (el.dataset.justDragged) return;
        const d = DRAFTS.find((x) => x.id === el.dataset.draft);
        mover.hidden = false;
        mover.innerHTML = `<b>„${esc(d.title)}“ verschieben auf</b><div class="days">${DAYS.map((n, i) => `<button type="button" data-to="${i}" ${st.drafts[d.id] === i ? 'aria-current="true"' : ""}>${n.split(" ")[0]}<small>${n.split(" ")[1]}</small></button>`).join("")}</div><button type="button" class="lnk" data-mclose>Abbrechen</button>`;
        mover.querySelectorAll("[data-to]").forEach((b) => b.addEventListener("click", () => moveTo(d.id, +b.dataset.to)));
        mover.querySelector("[data-mclose]").onclick = () => (mover.hidden = true);
        if (gsap && !reduce) gsap.from(mover, { y: 16, autoAlpha: 0, duration: 0.3, ease: "power3.out" });
      });
    });
  }

  // ---------- Öffnen / Schließen ----------
  function open() {
    panel.classList.add("open"); document.body.classList.add("ex-social-open");
    panel.setAttribute("aria-hidden", "false"); if (tab) tab.setAttribute("aria-selected", "true");
    prevSeries = null; Object.keys(prevNum).forEach((k) => delete prevNum[k]);
    render({ first: true }); sheet.scrollTop = 0;
  }
  function close() {
    closePost();
    panel.classList.remove("open"); document.body.classList.remove("ex-social-open");
    panel.setAttribute("aria-hidden", "true"); if (tab) tab.setAttribute("aria-selected", "false");
    if (location.hash === "#social") history.replaceState(null, "", location.pathname + location.search);
  }
  window.paketstadtSocial = { open, close, openPost, state: st };

  fab && fab.addEventListener("click", open);
  // capture: der native Switch bindet alle Buttons und würde dn(undefined) aufrufen
  tab && tab.addEventListener("click", (e) => { e.preventDefault(); e.stopImmediatePropagation(); open(); }, true);
  panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !panel.classList.contains("open")) return;
    if (detail && detail.classList.contains("on")) closePost(); else close();
  });
  if (location.hash === "#social") setTimeout(open, 450);
})();
