(function () {
  const api = window.EX_DEMO_API;
  const demo = api.get();
  const org = api.sumOrganic("30");
  const ads = api.sumAds("30");
  const s = demo.systems;
  const order = ["paketstadt3d", "shopRaum", "lager", "personal", "problemCenter", "bots", "chatbot", "social"];
  function kpiPairs(sys) {
    const k = sys.kpi;
    const labelMap = {
      ordersToday: "Bestellungen heute", inTransit: "Unterwegs", delivered: "Zugestellt", returns: "Retouren",
      revenueToday: "Umsatz heute", topProduct: "Top-Produkt", exceptions: "Ausnahmen", skus: "SKUs", lowStock: "Niedrig", reorder: "Nachbestellen",
      onDuty: "Im Dienst", absent: "Abwesend", openShifts: "Offene Schichten", open: "Offen", critical: "Kritisch", resolvedToday: "Heute gelöst",
      chat: "Chat", phone: "Telefon", handoff: "Übergaben", conversations: "Gespräche", leads: "Leads", followers: "Follower", reach: "Reichweite", adSpend: "Ad-Ausgaben"
    };
    return Object.keys(k).slice(0, 4).map((key) => {
      let val = k[key];
      if (typeof val === "number" && (key === "revenueToday" || key === "adSpend")) val = api.formatEuro(val);
      else if (typeof val === "number") val = api.formatNumber(val);
      return { label: labelMap[key] || key, value: val };
    });
  }
  const tiles = order.map((key) => {
    const sys = s[key];
    const href = key === "social" ? "../paketstadt3d/?style=A#social" : (key === "paketstadt3d" ? "../paketstadt3d/?style=A" : sys.href);
    const pairs = kpiPairs(sys);
    return `<a class="glass tile" href="${href}"><div class="tile-top"><div><div class="tile-kind">${sys.kind}</div><h2>${sys.name}</h2><p>${sys.meta}</p></div><span class="open">Öffnen ↗</span></div><div class="kpis">${pairs.map((p) => `<div class="kpi"><b>${p.value}</b><span>${p.label}</span></div>`).join("")}</div></a>`;
  }).join("");

  document.getElementById("app").innerHTML = `
    <nav class="mobile-bar" aria-label="Mobile Navigation">
      <a class="active" href="./">Dashboard</a>
      <a href="../paketstadt3d/?style=A#social">Social in Paketstadt</a>
      <a href="../social/">Social-Demo</a>
      <a href="../paketstadt3d/?style=A">Paketstadt</a>
    </nav>
    <aside class="sidebar" aria-label="Seitenleiste">
      <div class="logo"><span class="logo-projekt">PROJEKT</span><span class="logo-ex">EX</span></div>
      <nav class="nav" aria-label="Hauptnavigation">
        <a class="active" href="./">Dashboard</a>
        <a href="../paketstadt3d/?style=A#social">Social Media</a>
        <a href="../paketstadt3d/?style=A">Paketstadt 3D</a>
        <a href="../shop-raum/">Shop-Raum</a>
        <a href="../bots/">Bots</a>
      </nav>
      <div class="sidebar-foot">
        <a href="../">Alle Kundensystem-Demos</a>
        <a href="../../leistungen/systeme.html">Systeme-Seite</a>
      </div>
    </aside>
    <main class="main">
      <div class="topbar">
        <div>
          <h1>Kundensystem · Übersicht</h1>
          <p class="sub">${demo.hinweis} Dieses Dashboard gehört zur <b>Paketstadt-Demo für Kunden</b> (Shop, Lager, Personal, Bots und Social Media) – nicht zum Agentur-Backend von projektex.de.</p>
        </div>
        <div class="badge" role="status">${demo.label}</div>
      </div>
      <section class="summary" aria-label="Gesamtüberblick (Beispiel)">
        <article class="glass stat"><div class="stat-label">Bestellungen heute</div><div class="stat-value">${api.formatNumber(s.paketstadt3d.kpi.ordersToday)}</div><div class="stat-meta"><strong>Beispiel</strong> · Paketstadt-Shop</div></article>
        <article class="glass stat"><div class="stat-label">Social-Reichweite</div><div class="stat-value">${api.formatNumber(org.reach)}</div><div class="stat-meta"><strong>Beispiel</strong> · 30 Tage</div></article>
        <article class="glass stat"><div class="stat-label">Ad-Ausgaben</div><div class="stat-value">${api.formatEuro(ads.spend)}</div><div class="stat-meta"><strong>Beispiel</strong> · ${api.formatNumber(ads.leads)} Leads</div></article>
        <article class="glass stat"><div class="stat-label">Offene Ausnahmen</div><div class="stat-value">${api.formatNumber(s.problemCenter.kpi.open)}</div><div class="stat-meta"><strong>Beispiel</strong> · Problem-Center</div></article>
      </section>
      <section class="glass panel" aria-label="Social Media integriert">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:12px">
          <div>
            <h2 style="margin:0 0 6px">Social Media im Kundensystem</h2>
            <p style="margin:0;color:#5a6a7e;font-size:13px;max-width:54ch">Instagram, TikTok, YouTube und Google mit Beispiel-Kennzahlen. Direkt in der Paketstadt 3D als eigener Bereich geöffnet – verbunden mit Shop-Aufträgen.</p>
          </div>
          <a class="open" href="../paketstadt3d/?style=A#social">In Paketstadt öffnen ↗</a>
        </div>
        <div class="summary" style="margin:0">
          <article class="glass stat"><div class="stat-label">Follower</div><div class="stat-value">${api.formatNumber(org.followers)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
          <article class="glass stat"><div class="stat-label">Views</div><div class="stat-value">${api.formatNumber(org.views)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
          <article class="glass stat"><div class="stat-label">Ad-Klicks</div><div class="stat-value">${api.formatNumber(ads.clicks)}</div><div class="stat-meta"><strong>Beispiel</strong> · CTR ${api.formatPct(ads.ctr)}</div></article>
          <article class="glass stat"><div class="stat-label">Social-Leads</div><div class="stat-value">${api.formatNumber(ads.leads)}</div><div class="stat-meta"><strong>Beispiel</strong> → Shop-Aufträge</div></article>
        </div>
      </section>
      <section class="tiles" aria-label="Verbundene Kundensysteme">${tiles}</section>
      <section class="glass panel" aria-label="Social-Leads">
        <h2>Social-Leads mit Shop-Aufträgen</h2>
        <div class="leads">
          ${demo.socialLeads.map((l) => `
            <article class="lead"><div><b>${l.name}</b><small>${demo.channels[l.channel].name} · ${l.interest}<br>${l.note}</small></div>
            <a class="open" href="../paketstadt3d/?style=A#social">${l.paketstadtOrderId}</a></article>`).join("")}
        </div>
      </section>
    </main>`;
})();
