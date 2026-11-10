(function () {
  const api = window.EX_DEMO_API;
  const demo = api.get();
  const state = {
    view: "overview", // overview | instagram | tiktok | youtube | google
    range: "30",
    channelFilter: "all"
  };

  const icons = {
    overview: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M14 4v10.2a3.8 3.8 0 1 1-2.6-3.6V8.2A6.2 6.2 0 0 0 9 8.5V11a3.8 3.8 0 1 0 5.8 3.2V7.4A7 7 0 0 0 19 8.5V6a4.8 4.8 0 0 1-5-2z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="3"/><path d="M10 9.5v5l5-2.5z" fill="currentColor" stroke="none"/></svg>',
    google: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24"><path d="M4 13h6V4H4zm10 7h6v-9h-6zM4 20h6v-5H4zm10-9h6V4h-6z"/></svg>',
    paket: '<svg viewBox="0 0 24 24"><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M12 13V3M3 8l9 5 9-5"/></svg>'
  };

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function setActive(container, sel, attr, value) {
    container.querySelectorAll(sel).forEach((n) => {
      n.classList.toggle("active", n.getAttribute(attr) === value);
    });
  }

  function channelList() {
    if (state.view !== "overview") return [state.view];
    if (state.channelFilter === "all") return api.channelIds();
    return [state.channelFilter];
  }

  function organicForView() {
    const ids = channelList();
    if (ids.length === 1) return demo.channels[ids[0]].organic[state.range];
    return api.sumOrganic(state.range);
  }

  function adsForView() {
    const ids = channelList();
    if (ids.length === 1) return demo.channels[ids[0]].ads[state.range];
    return api.sumAds(state.range);
  }

  function seriesForView() {
    const ids = channelList();
    if (ids.length === 1) return demo.channels[ids[0]].series[state.range];
    const lens = ids.map((id) => demo.channels[id].series[state.range]);
    const len = Math.min(...lens.map((s) => s.length));
    const out = [];
    for (let i = 0; i < len; i++) {
      out.push(ids.reduce((sum, id) => sum + demo.channels[id].series[state.range][i], 0));
    }
    return out;
  }

  function commentsForView() {
    const ids = channelList();
    const list = [];
    ids.forEach((id) => {
      demo.channels[id].comments.forEach((c) => list.push({ ...c, channel: id }));
    });
    return list.sort((a, b) => (a.at < b.at ? 1 : -1));
  }

  function leadsForView() {
    const ids = channelList();
    return demo.socialLeads.filter((l) => ids.includes(l.channel));
  }

  function titleForView() {
    if (state.view === "overview") return "Social Media";
    return demo.channels[state.view].name;
  }

  function renderBars(series) {
    const max = Math.max(...series, 1);
    return series
      .map((v) => `<span style="height:${Math.max(8, Math.round((v / max) * 100))}%" title="${api.formatNumber(v)} (Beispiel)"></span>`)
      .join("");
  }

  function render() {
    const root = document.getElementById("app");
    const org = organicForView();
    const ads = adsForView();
    const series = seriesForView();
    const comments = commentsForView();
    const leads = leadsForView();

    root.innerHTML = `
      <nav class="mobile-bar" aria-label="Mobile Navigation">
        <button type="button" data-view="overview" class="${state.view === "overview" ? "active" : ""}">Übersicht</button>
        ${api.channelIds().map((id) => `<button type="button" data-view="${id}" class="${state.view === id ? "active" : ""}">${demo.channels[id].name}</button>`).join("")}
        <a href="../shop-raum/?from=paketstadt3d&amp;style=A">Dashboard</a>
        <a href="../paketstadt3d/?style=A#social">Paketstadt 3D</a>
      </nav>
      <aside class="sidebar" aria-label="Seitenleiste">
        <div class="logo" aria-label="PROJEKT EX"><span class="logo-projekt">PROJEKT</span><span class="logo-ex">EX</span></div>
        <nav class="nav" aria-label="Hauptnavigation">
          <button type="button" data-view="overview" class="${state.view === "overview" ? "active" : ""}"><span class="nav-icon">${icons.overview}</span>Übersicht</button>
          ${api.channelIds().map((id) => `<button type="button" data-view="${id}" class="${state.view === id ? "active" : ""}"><span class="nav-icon">${icons[id]}</span>${demo.channels[id].name}</button>`).join("")}
        </nav>
        <div class="sidebar-foot">
          <a href="../paketstadt3d/?style=A"><span class="nav-icon" style="display:inline-grid;margin-right:8px;vertical-align:middle">${icons.dashboard}</span>Paketstadt 3D</a>
          <a href="../paketstadt3d/?style=A#social"><span class="nav-icon" style="display:inline-grid;margin-right:8px;vertical-align:middle">${icons.paket}</span>Zur Paketstadt (Kundensystem)</a>
          <a href="../">Alle System-Demos</a>
        </div>
      </aside>
      <main class="main">
        <div class="topbar">
          <div>
            <h1>${titleForView()}</h1>
            <p class="sub">${demo.hinweis}</p>
          </div>
          <div class="badge" role="status">${demo.label}</div>
        </div>

        <div class="filters" role="group" aria-label="Zeitraum">
          ${Object.keys(demo.ranges).map((r) => `<button type="button" class="chip-btn ${state.range === r ? "active" : ""}" data-range="${r}">${demo.ranges[r].label}</button>`).join("")}
        </div>
        ${state.view === "overview" ? `
        <div class="filters" role="group" aria-label="Kanalfilter">
          <button type="button" class="chip-btn ${state.channelFilter === "all" ? "active" : ""}" data-ch="all">Alle Kanäle</button>
          ${api.channelIds().map((id) => `<button type="button" class="chip-btn ${state.channelFilter === id ? "active" : ""}" data-ch="${id}">${demo.channels[id].name}</button>`).join("")}
        </div>` : ""}

        <section class="status-row" aria-label="Verbindungsstatus">
          ${(state.view === "overview" ? api.channelIds() : [state.view]).map((id) => {
            const ch = demo.channels[id];
            return `<article class="glass status-card"><div class="name">${ch.name}</div><div class="state"><span class="dot" aria-hidden="true"></span>${ch.statusLabel}<br><span>${ch.handle}</span></div></article>`;
          }).join("")}
        </section>

        <section aria-label="Organische Kennzahlen (Beispiel)">
          <div class="panel-head"><h2>Organisch</h2><span class="badge">BEISPIELDATEN</span></div>
          <div class="grid">
            <article class="glass stat"><div class="stat-label">Follower</div><div class="stat-value">${api.formatNumber(org.followers)}</div><div class="stat-meta"><strong>Beispiel</strong> · Wachstum ${api.formatPct(org.growth)}</div></article>
            <article class="glass stat"><div class="stat-label">Reichweite</div><div class="stat-value">${api.formatNumber(org.reach)}</div><div class="stat-meta"><strong>Beispiel</strong> · ${demo.ranges[state.range].label}</div></article>
            <article class="glass stat"><div class="stat-label">Views</div><div class="stat-value">${api.formatNumber(org.views)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
            <article class="glass stat"><div class="stat-label">Likes</div><div class="stat-value">${api.formatNumber(org.likes)}</div><div class="stat-meta"><strong>Beispiel</strong> · ${api.formatNumber(org.comments)} Kommentare · ${api.formatNumber(org.shares)} Shares</div></article>
          </div>
        </section>

        <section class="glass panel" aria-label="Ads Kennzahlen (Beispiel)">
          <div class="panel-head"><h2>Geschaltete Ads</h2><span class="badge">BEISPIELDATEN</span></div>
          <div class="grid">
            <article class="glass stat"><div class="stat-label">Ausgaben</div><div class="stat-value">${api.formatEuro(ads.spend)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
            <article class="glass stat"><div class="stat-label">Impressionen</div><div class="stat-value">${api.formatNumber(ads.impressions)}</div><div class="stat-meta"><strong>Beispiel</strong> · CTR ${api.formatPct(ads.ctr)}</div></article>
            <article class="glass stat"><div class="stat-label">Klicks</div><div class="stat-value">${api.formatNumber(ads.clicks)}</div><div class="stat-meta"><strong>Beispiel</strong> · CPC ${api.formatEuro(ads.cpc)}</div></article>
            <article class="glass stat"><div class="stat-label">Leads / Conversions</div><div class="stat-value">${api.formatNumber(ads.leads)} / ${api.formatNumber(ads.conversions)}</div><div class="stat-meta"><strong>Beispiel</strong> · ROAS ${api.formatNumber(ads.roas)}</div></article>
          </div>
          <table class="table" aria-label="Ads je Kanal (Beispiel)">
            <thead><tr><th>Kanal</th><th>Ausgaben</th><th>Klicks</th><th>CTR</th><th>Leads</th><th>ROAS</th></tr></thead>
            <tbody>
              ${channelList().map((id) => {
                const a = demo.channels[id].ads[state.range];
                return `<tr><td>${demo.channels[id].name}</td><td>${api.formatEuro(a.spend)}</td><td>${api.formatNumber(a.clicks)}</td><td>${api.formatPct(a.ctr)}</td><td>${api.formatNumber(a.leads)}</td><td>${api.formatNumber(a.roas)}</td></tr>`;
              }).join("")}
            </tbody>
          </table>
        </section>

        <div class="split">
          <section class="glass panel" aria-label="Verlauf (Beispiel)">
            <div class="panel-head"><h2>Verlauf Views / Reichweite</h2><span class="badge">Beispielserie</span></div>
            <div class="bars" aria-hidden="true">${renderBars(series)}</div>
          </section>
          <section class="glass panel" aria-label="Kommentare (Beispiel)">
            <div class="panel-head"><h2>Kommentare</h2><span class="badge">Beispielliste</span></div>
            <div class="comments">
              ${comments.slice(0, 6).map((c) => `
                <article class="comment">
                  <div><span class="who">${c.author}</span><span class="when">${api.formatDate(c.at)}${c.channel ? " · " + demo.channels[c.channel].name : ""}</span></div>
                  <p class="txt">${c.text}</p>
                </article>`).join("") || "<p class=\"stat-meta\">Keine Beispielkommentare in diesem Filter.</p>"}
            </div>
          </section>
        </div>

        <section class="glass panel" aria-label="Social-Leads und Paketstadt">
          <div class="panel-head"><h2>Social-Leads → Shop-Aufträge</h2><a href="../paketstadt3d/?style=A#social" style="font-size:13px;font-weight:700;color:var(--blue)">Zum Shop in der Paketstadt</a></div>
          <div class="leads">
            ${leads.map((l) => `
              <article class="lead">
                <div>
                  <b>${l.name}</b>
                  <small>${demo.channels[l.channel].name} · ${l.interest}<br>${l.note}<br>Status: ${l.status} · ${api.formatDate(l.created_at)}</small>
                </div>
                <a href="../paketstadt3d/?style=A#social" title="Shop-Auftrag (Beispiel)">${l.paketstadtOrderId}</a>
              </article>`).join("") || "<p class=\"stat-meta\">Keine Beispiel-Leads in diesem Filter.</p>"}
          </div>
        </section>
      </main>
    `;

    root.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = btn.getAttribute("data-view");
        if (state.view !== "overview") state.channelFilter = "all";
        render();
      });
    });
    root.querySelectorAll("[data-range]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.range = btn.getAttribute("data-range");
        render();
      });
    });
    root.querySelectorAll("[data-ch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.channelFilter = btn.getAttribute("data-ch");
        render();
      });
    });
  }

  render();
})();
