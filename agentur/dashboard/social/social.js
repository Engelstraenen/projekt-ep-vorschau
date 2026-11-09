(function () {
  const D = window.EX_AGENTUR;
  const ids = Object.keys(D.channels);
  let view = "all";
  const nf = new Intl.NumberFormat("de-DE");
  const eu = (n) => {
    const digits = Math.abs(n) < 10 && n % 1 !== 0 ? 2 : 0;
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(n);
  };
  const pct = (n) => nf.format(n) + " %";

  function metrics() {
    const list = view === "all" ? ids : [view];
    const o = {
      followers: 0, reach: 0, views: 0, likes: 0, comments: 0, shares: 0,
      spend: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0, roas: 0
    };
    list.forEach((id) => {
      const c = D.channels[id];
      Object.keys(c.organic).forEach((k) => { o[k] += c.organic[k] || 0; });
      o.spend += c.ads.spend || 0;
      o.impressions += c.ads.impressions || 0;
      o.clicks += c.ads.clicks || 0;
      o.leads += c.ads.leads || 0;
      o.conversions += c.ads.conversions || 0;
      o.roas += c.ads.roas || 0;
    });
    o.ctr = o.impressions ? Math.round((o.clicks / o.impressions) * 10000) / 100 : 0;
    o.cpc = o.clicks ? Math.round((o.spend / o.clicks) * 100) / 100 : 0;
    o.roas = Math.round((o.roas / list.length) * 10) / 10;
    return o;
  }

  function series() {
    const list = view === "all" ? ids : [view];
    const lens = list.map((id) => D.channels[id].series);
    const n = Math.min(...lens.map((s) => s.length));
    const out = [];
    for (let i = 0; i < n; i++) out.push(list.reduce((a, id) => a + D.channels[id].series[i], 0));
    return out;
  }

  function comments() {
    const list = view === "all" ? ids : [view];
    const out = [];
    list.forEach((id) => D.channels[id].comments.forEach((c) => out.push({ ...c, ch: D.channels[id].name })));
    return out;
  }

  function leads() {
    return D.leads.filter((l) => view === "all" || l.channel === view);
  }

  function render() {
    const o = metrics();
    const s = series();
    const max = Math.max(...s, 1);
    const list = view === "all" ? ids : [view];
    document.getElementById("app").innerHTML = `
  <div class="top"><div><h1>Social Media</h1><p class="sub">${D.hinweis} Verbunden mit Interessenten/CRM – nicht mit Versand.</p></div><div class="badge">${D.label}</div></div>
  <div class="filters" role="group" aria-label="Kanal">${["all", ...ids].map((id) => `<button type="button" class="chip ${view === id ? "active" : ""}" data-v="${id}">${id === "all" ? "Alle Kanäle" : D.channels[id].name}</button>`).join("")}</div>
  <section class="status" aria-label="Anbindung">${list.map((id) => `<article class="glass"><b>${D.channels[id].name}</b><span><span class="dot"></span>${D.channels[id].status}<br>${D.channels[id].handle}</span></article>`).join("")}</section>
  <div class="panel-head" style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 10px"><h2 style="font-size:16px;margin:0">Organisch</h2><span class="badge">BEISPIELDATEN · 30 Tage</span></div>
  <section class="grid" aria-label="Organische Kennzahlen">
   <article class="glass stat"><div class="stat-label">Follower</div><div class="stat-value">${nf.format(o.followers)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
   <article class="glass stat"><div class="stat-label">Reichweite</div><div class="stat-value">${nf.format(o.reach)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
   <article class="glass stat"><div class="stat-label">Views</div><div class="stat-value">${nf.format(o.views)}</div><div class="stat-meta"><strong>Beispiel</strong> · ${nf.format(o.likes)} Likes · ${nf.format(o.comments)} Kommentare · ${nf.format(o.shares)} Shares</div></article>
  </section>
  <section class="glass panel" aria-label="Ads Kennzahlen"><h2>Geschaltete Ads</h2>
   <div class="grid">
    <article class="glass stat"><div class="stat-label">Ausgaben</div><div class="stat-value">${eu(o.spend)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
    <article class="glass stat"><div class="stat-label">Impressionen</div><div class="stat-value">${nf.format(o.impressions)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
    <article class="glass stat"><div class="stat-label">Klicks</div><div class="stat-value">${nf.format(o.clicks)}</div><div class="stat-meta"><strong>Beispiel</strong> · CTR ${pct(o.ctr)} · CPC ${eu(o.cpc)}</div></article>
    <article class="glass stat"><div class="stat-label">Leads</div><div class="stat-value">${nf.format(o.leads)}</div><div class="stat-meta"><strong>Beispiel</strong> · Conversions ${nf.format(o.conversions)} · ROAS ${nf.format(o.roas)}</div></article>
   </div>
   <table class="table" style="margin-top:12px"><thead><tr><th>Kanal</th><th>Ausgaben</th><th>Impressionen</th><th>Klicks</th><th>CTR</th><th>CPC</th><th>Leads</th><th>ROAS</th></tr></thead><tbody>
   ${list.map((id) => {
     const a = D.channels[id].ads;
     return `<tr><td>${D.channels[id].name}</td><td>${eu(a.spend)}</td><td>${nf.format(a.impressions)}</td><td>${nf.format(a.clicks)}</td><td>${pct(a.ctr)}</td><td>${eu(a.cpc)}</td><td>${nf.format(a.leads)}</td><td>${nf.format(a.roas)}</td></tr>`;
   }).join("")}
   </tbody></table>
  </section>
  <div class="split">
   <section class="glass panel"><h2>Verlauf (Beispielserie)</h2><div class="bars" aria-hidden="true">${s.map((v) => `<i style="height:${Math.max(8, Math.round((v / max) * 100))}%"></i>`).join("")}</div></section>
   <section class="glass panel"><h2>Kommentare</h2><div class="list">${comments().map((c) => `<article class="item"><span class="who">${c.a}</span><span class="when">${c.d} · ${c.ch}</span><p>${c.t}</p></article>`).join("")}</div></section>
  </div>
  <section class="glass panel"><h2>Social-Leads → Interessenten / CRM</h2>
   <div class="list">${leads().map((l) => `<article class="item lead"><div><span class="who">${l.name}</span><p>${D.channels[l.channel].name} · ${l.interest}<br>${l.note} · ${l.status}</p></div><a href="../#kunden">${l.crm}</a></article>`).join("")}</div>
  </section>`;
    document.querySelectorAll("[data-v]").forEach((b) =>
      b.addEventListener("click", () => {
        view = b.getAttribute("data-v");
        render();
      })
    );
  }
  render();
})();
