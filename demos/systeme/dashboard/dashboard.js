(function () {
  const api = window.EX_DEMO_API;
  const demo = api.get();
  const org = api.sumOrganic("30");
  const ads = api.sumAds("30");
  const s = demo.systems;

  const order = ["paketstadt3d", "shopRaum", "lager", "personal", "problemCenter", "bots", "chatbot", "social"];

  function kpiPairs(sys) {
    const k = sys.kpi;
    return Object.keys(k).slice(0, 4).map((key) => {
      const labelMap = {
        ordersToday: "Bestellungen heute",
        inTransit: "Unterwegs",
        delivered: "Zugestellt",
        returns: "Retouren",
        revenueToday: "Umsatz heute",
        topProduct: "Top-Produkt",
        exceptions: "Ausnahmen",
        skus: "SKUs",
        lowStock: "Niedrig",
        reorder: "Nachbestellen",
        onDuty: "Im Dienst",
        absent: "Abwesend",
        openShifts: "Offene Schichten",
        open: "Offen",
        critical: "Kritisch",
        resolvedToday: "Heute gelöst",
        chat: "Chat",
        phone: "Telefon",
        handoff: "Übergaben",
        conversations: "Gespräche",
        leads: "Leads",
        followers: "Follower",
        reach: "Reichweite",
        adSpend: "Ad-Ausgaben",
        systems: "Systeme",
        demoLinks: "Demo-Links"
      };
      let val = k[key];
      if (typeof val === "number" && key === "revenueToday") val = api.formatEuro(val);
      else if (typeof val === "number" && key === "adSpend") val = api.formatEuro(val);
      else if (typeof val === "number") val = api.formatNumber(val);
      return { label: labelMap[key] || key, value: val };
    });
  }

  const tiles = order.map((key) => {
    const sys = s[key];
    const pairs = kpiPairs(sys);
    return `
      <a class="glass tile" href="${sys.href}">
        <div class="tile-top">
          <div>
            <div class="tile-kind">${sys.kind}</div>
            <h2>${sys.name}</h2>
            <p>${sys.meta}</p>
          </div>
          <span class="open">Öffnen ↗</span>
        </div>
        <div class="kpis">
          ${pairs.map((p) => `<div class="kpi"><b>${p.value}</b><span>${p.label}</span></div>`).join("")}
        </div>
      </a>`;
  }).join("");

  document.getElementById("app").innerHTML = `
    <nav class="mobile-bar" aria-label="Mobile Navigation">
      <a class="active" href="./">Dashboard</a>
      <a href="../social/">Social Media</a>
      <a href="../paketstadt3d/?style=A">Paketstadt</a>
      <a href="../">Alle Demos</a>
    </nav>
    <aside class="sidebar" aria-label="Seitenleiste">
      <div class="logo"><span class="logo-projekt">PROJEKT</span><span class="logo-ex">EX</span></div>
      <nav class="nav" aria-label="Hauptnavigation">
        <a class="active" href="./"><span class="nav-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></span>Dashboard</a>
        <a href="../social/"><span class="nav-icon"><svg viewBox="0 0 24 24"><circle cx="7" cy="12" r="2.5"/><circle cx="17" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M9.2 11.2l5.6-3.2M9.2 12.8l5.6 3.2"/></svg></span>Social Media</a>
        <a href="../paketstadt3d/?style=A"><span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M12 13V3"/></svg></span>Paketstadt</a>
        <a href="../shop-raum/"><span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M4 9h16l-1.2 10H5.2z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/></svg></span>Shop-Raum</a>
        <a href="../bots/"><span class="nav-icon"><svg viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="10" rx="3"/><path d="M12 4v3M9 17v2M15 17v2"/></svg></span>Bots</a>
      </nav>
      <div class="sidebar-foot">
        <a href="../">Alle System-Demos</a>
        <a href="../../leistungen/systeme.html">Systeme-Seite</a>
      </div>
    </aside>
    <main class="main">
      <div class="topbar">
        <div>
          <h1>Systeme &amp; Automatisierung</h1>
          <p class="sub">${demo.hinweis} Dieses Dashboard verbindet Paketstadt, Shop, Lager, Personal, Problem-Center, Bots und Social Media über denselben Beispieldatenbestand.</p>
        </div>
        <div class="badge" role="status">${demo.label}</div>
      </div>

      <section class="summary" aria-label="Gesamtüberblick (Beispiel)">
        <article class="glass stat"><div class="stat-label">Bestellungen heute</div><div class="stat-value">${api.formatNumber(s.paketstadt3d.kpi.ordersToday)}</div><div class="stat-meta"><strong>Beispiel</strong> · Paketstadt</div></article>
        <article class="glass stat"><div class="stat-label">Social-Reichweite</div><div class="stat-value">${api.formatNumber(org.reach)}</div><div class="stat-meta"><strong>Beispiel</strong> · 30 Tage</div></article>
        <article class="glass stat"><div class="stat-label">Ad-Ausgaben</div><div class="stat-value">${api.formatEuro(ads.spend)}</div><div class="stat-meta"><strong>Beispiel</strong> · ${api.formatNumber(ads.leads)} Leads</div></article>
        <article class="glass stat"><div class="stat-label">Offene Ausnahmen</div><div class="stat-value">${api.formatNumber(s.problemCenter.kpi.open)}</div><div class="stat-meta"><strong>Beispiel</strong> · Problem-Center</div></article>
      </section>

      <section class="tiles" aria-label="Verbundene Systeme">
        ${tiles}
      </section>

      <section class="glass panel" aria-label="Verknüpfte Social-Leads">
        <h2>Social-Leads mit Paketstadt-Aufträgen</h2>
        <div class="leads">
          ${demo.socialLeads.map((l) => `
            <article class="lead">
              <div>
                <b>${l.name}</b>
                <small>${demo.channels[l.channel].name} · ${l.interest}<br>${l.note}</small>
              </div>
              <a class="open" href="../paketstadt3d/?style=A">${l.paketstadtOrderId}</a>
            </article>`).join("")}
        </div>
      </section>
    </main>
  `;
})();
