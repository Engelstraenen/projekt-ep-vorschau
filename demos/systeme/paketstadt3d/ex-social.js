(function () {
  const api = window.EX_DEMO_API;
  if (!api) return;
  const demo = api.get();
  const panel = document.getElementById("exSocialPanel");
  const sheet = document.getElementById("exSocialSheet");
  const tab = document.getElementById("exSocialTab");
  const fab = document.getElementById("exSocialOpen");
  let ch = "all";

  const shopLeads = (demo.socialLeads || []).map((l) => ({
    ...l,
    orderLabel: l.paketstadtOrderId || l.orderId || "BEST-" + l.id
  }));

  function open() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    if (tab) tab.setAttribute("aria-selected", "true");
    render();
  }
  function close() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    if (tab) tab.setAttribute("aria-selected", "false");
  }
  function channelIds() {
    return ch === "all" ? api.channelIds() : [ch];
  }
  function org() {
    const ids = channelIds();
    if (ids.length === 1) return demo.channels[ids[0]].organic["30"];
    return api.sumOrganic("30");
  }
  function ads() {
    const ids = channelIds();
    if (ids.length === 1) return { ...demo.channels[ids[0]].ads["30"] };
    return api.sumAds("30");
  }
  function comments() {
    const out = [];
    channelIds().forEach((id) =>
      demo.channels[id].comments.forEach((c) => out.push({ ...c, channel: id }))
    );
    return out.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 6);
  }
  function kpi(value, label) {
    return `<div class="ex-kpi"><b>${value}</b><span>${label}</span></div>`;
  }
  function render() {
    const o = org();
    const a = ads();
    const ids = channelIds();
    sheet.innerHTML = `
      <div class="head">
        <div>
          <h2>Social Media</h2>
          <p class="status">Bereich in der Paketstadt · Beispiel-Shop<br>Kanäle noch nicht angebunden – Beispieldaten</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <span class="badge">BEISPIELDATEN</span>
          <button type="button" class="close" id="exSocialClose">Schließen</button>
        </div>
      </div>
      <div class="chips" role="tablist" aria-label="Kanalfilter">
        <button type="button" data-ch="all" class="${ch === "all" ? "active" : ""}">Alle</button>
        ${api.channelIds().map((id) => `<button type="button" data-ch="${id}" class="${ch === id ? "active" : ""}">${demo.channels[id].name}</button>`).join("")}
      </div>
      <div class="section" aria-label="Kanalstatus">
        <h3>Kanalstatus</h3>
        ${ids.map((id) => {
          const c = demo.channels[id];
          return `<article class="com"><strong>${c.name}</strong><p>${c.statusLabel}<br>${c.handle}</p></article>`;
        }).join("")}
      </div>
      <div class="section" aria-label="Organische Kennzahlen">
        <h3>Organisch (30 Tage · Beispiel)</h3>
        <div class="ex-kpis">
          ${kpi(api.formatNumber(o.followers), "Follower")}
          ${kpi(api.formatNumber(o.reach), "Reichweite")}
          ${kpi(api.formatNumber(o.views), "Views")}
          ${kpi(api.formatNumber(o.likes), "Likes · " + api.formatNumber(o.comments) + " Kommentare")}
        </div>
      </div>
      <div class="section" aria-label="Ads Kennzahlen">
        <h3>Ads (Beispiel)</h3>
        <div class="ex-kpis">
          ${kpi(api.formatEuro(a.spend), "Ausgaben")}
          ${kpi(api.formatNumber(a.impressions), "Impressionen")}
          ${kpi(api.formatNumber(a.clicks), "Klicks")}
          ${kpi(api.formatPct(a.ctr), "CTR")}
          ${kpi(api.formatEuro(a.cpc), "CPC")}
          ${kpi(api.formatNumber(a.leads), "Leads / Anfragen")}
          ${kpi(api.formatNumber(a.conversions), "Conversions")}
          ${kpi(api.formatNumber(a.roas), "ROAS")}
        </div>
      </div>
      <div class="section" aria-label="Kommentare">
        <h3>Kommentare</h3>
        ${comments().map((c) => `<article class="com"><strong>${c.author}</strong> · ${demo.channels[c.channel].name}<p>${c.text}</p></article>`).join("")}
      </div>
      <div class="section" aria-label="Social-Leads">
        <h3>Social-Leads → Shop-Aufträge</h3>
        ${shopLeads.filter((l) => ch === "all" || l.channel === ch).map((l) => `
          <article class="ord"><strong>${l.name}</strong>
            <p>${demo.channels[l.channel].name} · ${l.interest}<br>Verknüpft mit Shop-Auftrag <b>${l.orderLabel}</b> · Status ${l.status}</p>
          </article>`).join("")}
      </div>
      <p class="status">Zahlen wechseln mit dem Kanalfilter. Alles Beispieldaten für den Vorzeige-Shop in der Paketstadt.</p>
    `;
    sheet.querySelector("#exSocialClose").onclick = close;
    sheet.querySelectorAll("[data-ch]").forEach((b) =>
      b.addEventListener("click", () => {
        ch = b.getAttribute("data-ch");
        render();
      })
    );
  }

  fab && fab.addEventListener("click", open);
  tab && tab.addEventListener("click", (e) => {
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
  if (location.hash === "#social") open();
})();
