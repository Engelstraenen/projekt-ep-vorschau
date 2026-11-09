(function () {
  const api = window.EX_DEMO_API;
  if (!api) return;
  const demo = api.get();
  const panel = document.getElementById("exSocialPanel");
  const sheet = document.getElementById("exSocialSheet");
  const tab = document.getElementById("exSocialTab");
  const fab = document.getElementById("exSocialOpen");
  let ch = "all";

  // Customer-shop oriented leads (shared file may still say paketstadtOrderId)
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
    if (ids.length === 1) return demo.channels[ids[0]].ads["30"];
    return api.sumAds("30");
  }
  function comments() {
    const out = [];
    channelIds().forEach((id) => demo.channels[id].comments.forEach((c) => out.push({ ...c, channel: id })));
    return out.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 5);
  }
  function render() {
    const o = org(), a = ads();
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
      <div class="chips" role="tablist">
        <button type="button" data-ch="all" class="${ch === "all" ? "active" : ""}">Alle</button>
        ${api.channelIds().map((id) => `<button type="button" data-ch="${id}" class="${ch === id ? "active" : ""}">${demo.channels[id].name}</button>`).join("")}
      </div>
      <div class="cards" aria-label="Organisch">
        <div class="card"><b>${api.formatNumber(o.followers)}</b><span>Follower · Beispiel</span></div>
        <div class="card"><b>${api.formatNumber(o.reach)}</b><span>Reichweite · 30 Tage</span></div>
        <div class="card"><b>${api.formatNumber(o.views)}</b><span>Views · Beispiel</span></div>
        <div class="card"><b>${api.formatNumber(o.likes)}</b><span>Likes · ${api.formatNumber(o.comments)} Kommentare</span></div>
      </div>
      <div class="section">
        <h3>Ads (Beispiel)</h3>
        <div class="cards">
          <div class="card"><b>${api.formatEuro(a.spend)}</b><span>Ausgaben</span></div>
          <div class="card"><b>${api.formatNumber(a.clicks)}</b><span>Klicks · CTR ${api.formatPct(a.ctr)}</span></div>
          <div class="card"><b>${api.formatNumber(a.leads)}</b><span>Anfragen / Leads</span></div>
          <div class="card"><b>${api.formatNumber(a.conversions)}</b><span>Conversions · ROAS ${api.formatNumber(a.roas)}</span></div>
        </div>
      </div>
      <div class="section">
        <h3>Kommentare</h3>
        ${comments().map((c) => `<article class="com"><strong>${c.author}</strong> · ${demo.channels[c.channel].name}<p>${c.text}</p></article>`).join("")}
      </div>
      <div class="section">
        <h3>Social-Leads → Shop-Aufträge</h3>
        ${shopLeads.filter((l) => ch === "all" || l.channel === ch).map((l) => `
          <article class="ord"><strong>${l.name}</strong>
            <p>${demo.channels[l.channel].name} · ${l.interest}<br>Verknüpft mit Shop-Auftrag <b>${l.orderLabel}</b> · Status ${l.status}</p>
          </article>`).join("")}
      </div>
      <p class="status">Status je Kanal: noch nicht angebunden – Beispieldaten. Zahlen gehören zum Vorzeige-Shop in der Paketstadt.</p>
    `;
    sheet.querySelector("#exSocialClose").onclick = close;
    sheet.querySelectorAll("[data-ch]").forEach((b) => b.addEventListener("click", () => { ch = b.getAttribute("data-ch"); render(); }));
  }

  fab && fab.addEventListener("click", open);
  tab && tab.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); open(); });
  panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) close(); });
  if (location.hash === "#social") open();
})();
