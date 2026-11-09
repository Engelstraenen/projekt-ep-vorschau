(function () {
  const api = window.EX_DEMO_API;
  if (!api) return;
  const demo = api.get();
  const panel = document.getElementById("exSocialPanel");
  const sheet = document.getElementById("exSocialSheet");
  const tab = document.getElementById("exSocialTab");
  const fab = document.getElementById("exSocialOpen");
  let ch = "all";
  let range = "30";
  let tickerTimer = null;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const shopLeads = (demo.socialLeads || []).map((l) => ({
    ...l,
    orderLabel: l.paketstadtOrderId || l.orderId || "BEST-" + l.id
  }));

  const posts = [
    { ch: "instagram", title: "Unboxing in 15 Sek.", reach: 18400, eng: "4,8 %" },
    { ch: "tiktok", title: "Hook: Paket unterwegs", reach: 42000, eng: "7,1 %" },
    { ch: "youtube", title: "So packen wir Bestellungen", reach: 9600, eng: "3,2 %" },
    { ch: "google", title: "Lokale Suche · Shop", reach: 12100, eng: "2,9 %" }
  ];
  const camps = [
    { name: "Meta · Retargeting", ch: "instagram", spend: 420, budget: 600, leads: 14 },
    { name: "TikTok · Spark Ads", ch: "tiktok", spend: 280, budget: 400, leads: 11 },
    { name: "YouTube · TrueView", ch: "youtube", spend: 510, budget: 800, leads: 9 },
    { name: "Google · Search", ch: "google", spend: 640, budget: 900, leads: 18 }
  ];
  const sentiments = ["pos", "pos", "neu", "pos", "neu", "neg"];

  function open() {
    panel.classList.add("open");
    document.body.classList.add("ex-social-open");
    panel.setAttribute("aria-hidden", "false");
    if (tab) tab.setAttribute("aria-selected", "true");
    // deselect other switch tabs visually for Social
    document.querySelectorAll("nav.switch button[data-view]").forEach((b) => b.setAttribute("aria-selected", "false"));
    render();
    startTickerPulse();
  }
  function close() {
    panel.classList.remove("open");
    document.body.classList.remove("ex-social-open");
    panel.setAttribute("aria-hidden", "true");
    if (tab) tab.setAttribute("aria-selected", "false");
    if (tickerTimer) clearInterval(tickerTimer);
  }
  function channelIds() {
    return ch === "all" ? api.channelIds() : [ch];
  }
  function org() {
    const ids = channelIds();
    if (ids.length === 1) return demo.channels[ids[0]].organic[range];
    return api.sumOrganic(range);
  }
  function ads() {
    const ids = channelIds();
    if (ids.length === 1) return { ...demo.channels[ids[0]].ads[range] };
    return api.sumAds(range);
  }
  function series() {
    const ids = channelIds();
    if (ids.length === 1) return demo.channels[ids[0]].series[range];
    const lens = ids.map((id) => demo.channels[id].series[range]);
    const len = Math.min(...lens.map((s) => s.length));
    const out = [];
    for (let i = 0; i < len; i++) out.push(ids.reduce((s, id) => s + demo.channels[id].series[range][i], 0));
    return out;
  }
  function comments() {
    const out = [];
    channelIds().forEach((id) =>
      demo.channels[id].comments.forEach((c) => out.push({ ...c, channel: id }))
    );
    return out.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 6);
  }
  function kpi(value, label) {
    return `<div class="ex-kpi"><b data-count="${value}">${value}</b><span>${label}</span></div>`;
  }
  function animateCounts(root) {
    if (reduce) return;
    root.querySelectorAll("[data-count]").forEach((el) => {
      const raw = el.getAttribute("data-count").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
      // For display we already formatted - skip complex parse; pulse opacity instead
      el.animate([{ opacity: 0.35, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], {
        duration: 420,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "both"
      });
    });
  }
  function startTickerPulse() {
    if (tickerTimer) clearInterval(tickerTimer);
    if (reduce) return;
    tickerTimer = setInterval(() => {
      const track = sheet.querySelector(".sx-track");
      if (!track) return;
      const first = track.children[0];
      if (!first) return;
      const clone = first.cloneNode(true);
      const n = 1 + Math.floor(Math.random() * 4);
      clone.textContent = `+${n} Likes · ${["Instagram", "TikTok", "YouTube", "Google"][Math.floor(Math.random() * 4)]} · Beispiel`;
      track.appendChild(clone);
      if (track.children.length > 16) track.removeChild(track.children[0]);
    }, 3200);
  }

  function render() {
    const o = org();
    const a = ads();
    const ids = channelIds();
    const s = series();
    const max = Math.max(...s, 1);
    const filteredPosts = posts.filter((p) => ch === "all" || p.ch === ch);
    const filteredCamps = camps.filter((c) => ch === "all" || c.ch === ch);
    const tickerItems = [
      "+12 Likes · Instagram · Beispiel",
      "Neuer Kommentar · TikTok · Beispiel",
      "+3 Leads · Google Ads · Beispiel",
      "Reel 84 % fertig angesehen · Beispiel",
      "+7 Saves · Instagram · Beispiel",
      "CTR 2,4 % · Meta Ads · Beispiel"
    ];

    sheet.innerHTML = `
      <div class="head">
        <div>
          <h2>Social Studio</h2>
          <p class="status">Paketstadt · Beispiel-Shop<br>Kanäle noch nicht angebunden – Beispieldaten</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <span class="badge">BEISPIELDATEN</span>
          <button type="button" class="close" id="exSocialClose">Schließen</button>
        </div>
      </div>
      <div class="sx-ticker" aria-label="Live-Ticker Beispieldaten"><div class="sx-track">${tickerItems.concat(tickerItems).map((t) => `<span>${t}</span>`).join("")}</div></div>
      <div class="chips" role="tablist" aria-label="Kanalfilter">
        <button type="button" data-ch="all" class="${ch === "all" ? "active" : ""}">Alle</button>
        ${api.channelIds().map((id) => `<button type="button" data-ch="${id}" class="${ch === id ? "active" : ""}">${demo.channels[id].name}</button>`).join("")}
      </div>
      <div class="range" role="group" aria-label="Zeitraum">
        ${["7", "30", "90"].map((r) => `<button type="button" data-range="${r}" class="${range === r ? "active" : ""}">${demo.ranges[r].label}</button>`).join("")}
      </div>
      <div class="section" aria-label="Kanalstatus">
        <h3>Kanalstatus</h3>
        ${ids.map((id) => {
          const c = demo.channels[id];
          return `<article class="com"><strong>${c.name}</strong><p>${c.statusLabel}<br>${c.handle}</p></article>`;
        }).join("")}
      </div>
      <div class="section" aria-label="Organische Kennzahlen">
        <h3>Organisch · Beispiel</h3>
        <div class="ex-kpis">
          ${kpi(api.formatNumber(o.followers), "Follower")}
          ${kpi(api.formatNumber(o.reach), "Reichweite")}
          ${kpi(api.formatNumber(o.views), "Views")}
          ${kpi(api.formatNumber(o.likes), "Likes · " + api.formatNumber(o.comments) + " Kommentare")}
        </div>
      </div>
      <div class="section">
        <h3>Verlauf · tippen/hover für Wert</h3>
        <div class="sx-bars" role="img" aria-label="Beispielserie">${s
          .slice(-24)
          .map((v, i) => `<i style="height:${Math.max(10, Math.round((v / max) * 100))}%;animation-delay:${i * 0.02}s" title="${api.formatNumber(v)} (Beispiel)"></i>`)
          .join("")}</div>
      </div>
      <div class="section" aria-label="Ads Funnel">
        <h3>Ads-Funnel (Beispiel)</h3>
        <div class="sx-funnel">
          ${kpi(api.formatNumber(a.impressions), "Impressionen")}
          ${kpi(api.formatNumber(a.clicks), "Klicks · CTR " + api.formatPct(a.ctr))}
          ${kpi(api.formatNumber(a.leads), "Leads")}
          ${kpi(api.formatNumber(a.conversions), "Aufträge · ROAS " + api.formatNumber(a.roas))}
        </div>
        <div class="ex-kpis" style="margin-top:8px">
          ${kpi(api.formatEuro(a.spend), "Ausgaben")}
          ${kpi(api.formatEuro(a.cpc), "CPC")}
        </div>
      </div>
      <div class="section">
        <h3>Top-Posts</h3>
        <div class="sx-posts">${filteredPosts
          .map(
            (p) => `<article class="sx-post"><div class="sx-thumb" aria-hidden="true"></div><div><strong>${p.title}</strong><p class="status">${demo.channels[p.ch].name} · Reichweite ${api.formatNumber(p.reach)} · Eng. ${p.eng}</p></div></article>`
          )
          .join("")}</div>
      </div>
      <div class="section sx-camp">
        <h3>Kampagnen · Budget</h3>
        ${filteredCamps
          .map((c) => {
            const pct = Math.round((c.spend / c.budget) * 100);
            return `<article class="com"><strong>${c.name}</strong><p>${api.formatEuro(c.spend)} / ${api.formatEuro(c.budget)} · ${c.leads} Leads · Beispiel</p><div class="bar" style="--w:${pct}%"><i></i></div></article>`;
          })
          .join("")}
      </div>
      <div class="section" aria-label="Kommentare">
        <h3>Kommentare · Stimmung</h3>
        ${comments()
          .map((c, i) => {
            const sent = sentiments[i % sentiments.length];
            const label = sent === "pos" ? "positiv" : sent === "neg" ? "kritisch" : "neutral";
            return `<article class="com"><strong>${c.author}</strong> · ${demo.channels[c.channel].name} <span class="sx-sent ${sent}">${label}</span><p>${c.text}</p></article>`;
          })
          .join("")}
      </div>
      <div class="section" aria-label="Social-Leads">
        <h3>Social-Leads → Shop-Aufträge</h3>
        ${shopLeads
          .filter((l) => ch === "all" || l.channel === ch)
          .map(
            (l) => `
          <article class="ord"><strong>${l.name}</strong>
            <p>${demo.channels[l.channel].name} · ${l.interest}<br>Verknüpft mit Shop-Auftrag <b>${l.orderLabel}</b> · Status ${l.status}</p>
          </article>`
          )
          .join("")}
      </div>
      <p class="status">Zahlen wechseln mit Kanal & Zeitraum. Alles Beispieldaten für den Vorzeige-Shop in der Paketstadt.</p>
    `;
    sheet.querySelector("#exSocialClose").onclick = close;
    sheet.querySelectorAll("[data-ch]").forEach((b) =>
      b.addEventListener("click", () => {
        ch = b.getAttribute("data-ch");
        render();
      })
    );
    sheet.querySelectorAll("[data-range]").forEach((b) =>
      b.addEventListener("click", () => {
        range = b.getAttribute("data-range");
        render();
      })
    );
    animateCounts(sheet);
  }

  fab && fab.addEventListener("click", open);
  tab &&
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      open();
    });
  panel.addEventListener("click", (e) => {
    if (e.target === panel) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) close();
  });
  if (location.hash === "#social") setTimeout(open, 400);
})();
