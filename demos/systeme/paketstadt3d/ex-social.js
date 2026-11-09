(function () {
  const api = window.EX_DEMO_API;
  if (!api) return;
  const demo = api.get();
  const gsap = window.gsap;
  const panel = document.getElementById("exSocialPanel");
  const sheet = document.getElementById("exSocialSheet");
  const tab = document.getElementById("exSocialTab");
  const fab = document.getElementById("exSocialOpen");
  let ch = "all";
  let range = "30";
  let section = "overview";
  let feedTimer = null;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const shopLeads = (demo.socialLeads || []).map((l) => ({
    ...l,
    orderLabel: l.paketstadtOrderId || l.orderId || "BEST-" + l.id
  }));
  const posts = [
    { ch: "instagram", title: "Unboxing in 15 Sek.", reach: 18400, eng: "4,8 %" },
    { ch: "tiktok", title: "Hook: Paket unterwegs", reach: 42000, eng: "7,1 %" },
    { ch: "youtube", title: "So packen wir", reach: 9600, eng: "3,2 %" },
    { ch: "google", title: "Lokale Suche", reach: 12100, eng: "2,9 %" }
  ];
  const camps = [
    { name: "Meta · Retargeting", ch: "instagram", spend: 420, budget: 600, leads: 14 },
    { name: "TikTok · Spark", ch: "tiktok", spend: 280, budget: 400, leads: 11 },
    { name: "YouTube · TrueView", ch: "youtube", spend: 510, budget: 800, leads: 9 },
    { name: "Google · Search", ch: "google", spend: 640, budget: 900, leads: 18 }
  ];
  const short = { instagram: "IG", tiktok: "TT", youtube: "YT", google: "G" };
  const sentiments = ["pos", "pos", "neu", "pos", "neu", "neg"];

  function open() {
    panel.classList.add("open");
    document.body.classList.add("ex-social-open");
    panel.setAttribute("aria-hidden", "false");
    if (tab) tab.setAttribute("aria-selected", "true");
    render();
  }
  function close() {
    panel.classList.remove("open");
    document.body.classList.remove("ex-social-open");
    panel.setAttribute("aria-hidden", "true");
    if (tab) tab.setAttribute("aria-selected", "false");
    if (feedTimer) clearInterval(feedTimer);
  }
  function ids() {
    return ch === "all" ? api.channelIds() : [ch];
  }
  function org() {
    const list = ids();
    return list.length === 1 ? demo.channels[list[0]].organic[range] : api.sumOrganic(range);
  }
  function ads() {
    const list = ids();
    return list.length === 1 ? { ...demo.channels[list[0]].ads[range] } : api.sumAds(range);
  }
  function series() {
    const list = ids();
    if (list.length === 1) return demo.channels[list[0]].series[range];
    const lens = list.map((id) => demo.channels[id].series[range]);
    const len = Math.min(...lens.map((s) => s.length));
    const out = [];
    for (let i = 0; i < len; i++) out.push(list.reduce((s, id) => s + demo.channels[id].series[range][i], 0));
    return out;
  }
  function comments() {
    const out = [];
    ids().forEach((id) => demo.channels[id].comments.forEach((c) => out.push({ ...c, channel: id })));
    return out.sort((a, b) => (a.at < b.at ? 1 : -1));
  }
  function chartSVG(values) {
    const w = 320, h = 140, pad = 8;
    const max = Math.max(...values, 1);
    const step = (w - pad * 2) / Math.max(values.length - 1, 1);
    const pts = values.map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - (v / max) * (h - pad * 2);
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const area = line + ` L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="sxFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0071e3" stop-opacity=".35"/><stop offset="100%" stop-color="#0071e3" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#sxFill)"></path>
      <path d="${line}" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
      ${pts.map((p, i) => `<circle class="sx-dot" data-i="${i}" data-v="${values[i]}" cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#fff" stroke="#0071e3" stroke-width="2"></circle>`).join("")}
    </svg><div class="sx-tip" id="sxTip"></div>`;
  }

  function render() {
    const o = org();
    const a = ads();
    const s = series().slice(-18);
    const funnel = [
      ["Impressionen", a.impressions, 1],
      ["Klicks", a.clicks, a.impressions ? a.clicks / a.impressions : 0],
      ["Leads", a.leads, a.clicks ? a.leads / a.clicks : 0],
      ["Aufträge", a.conversions, a.leads ? a.conversions / a.leads : 0]
    ];
    const filteredPosts = posts.filter((p) => ch === "all" || p.ch === ch);
    const filteredCamps = camps.filter((c) => ch === "all" || c.ch === ch);

    sheet.innerHTML = `<div class="sx" id="sxRoot">
      <div class="sx-hero">
        <div class="sx-hero-top">
          <div>
            <h2>Social Studio</h2>
            <p class="sub">Beispiel-Shop in der Paketstadt · Kanäle noch nicht angebunden</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
            <span class="sx-badge">BEISPIELDATEN</span>
            <button type="button" class="sx-close" id="exSocialClose">Schließen</button>
          </div>
        </div>
        <div class="sx-rings" role="tablist" aria-label="Kanäle">
          <button type="button" class="sx-ring ${ch === "all" ? "active" : ""}" data-ch="all"><div class="orb">Alle</div>Mix</button>
          ${api.channelIds().map((id) => `<button type="button" class="sx-ring ${ch === id ? "active" : ""}" data-ch="${id}"><div class="orb">${short[id]}</div>${demo.channels[id].name}</button>`).join("")}
        </div>
        <div class="sx-kpis">
          <div class="sx-kpi"><b data-n="${o.followers}">0</b><span>Follower</span></div>
          <div class="sx-kpi"><b data-n="${o.reach}">0</b><span>Reichweite · ${demo.ranges[range].label}</span></div>
          <div class="sx-kpi"><b data-n="${o.views}">0</b><span>Views</span></div>
          <div class="sx-kpi"><b data-n="${a.leads}">0</b><span>Ads-Leads · ROAS ${api.formatNumber(a.roas)}</span></div>
        </div>
      </div>
      <div class="sx-tabs" role="tablist">
        ${[["overview","Überblick"],["ads","Ads"],["posts","Posts"],["live","Live"],["camp","Kampagnen"]].map(([id,l])=>`<button type="button" data-sec="${id}" class="${section===id?"active":""}">${l}</button>`).join("")}
        ${["7","30","90"].map((r)=>`<button type="button" data-range="${r}" class="${range===r?"active":""}">${demo.ranges[r].label}</button>`).join("")}
      </div>

      <div class="sx-panel ${section==="overview"?"on":""}" data-panel="overview">
        <div class="sx-sec"><h3>Verlauf · tippen für Wert</h3><div class="sx-chart" id="sxChart">${chartSVG(s)}</div></div>
        <div class="sx-sec"><h3>Kanalstatus</h3>
          ${ids().map((id)=>{const c=demo.channels[id];return `<div class="sx-feed"><div class="item on"><strong>${c.name}</strong> · ${c.handle}<div class="sub">${c.statusLabel}</div></div></div>`;}).join("")}
        </div>
      </div>

      <div class="sx-panel ${section==="ads"?"on":""}" data-panel="ads">
        <div class="sx-sec"><h3>Ads-Funnel</h3>
          <div class="sx-funnel">${funnel.map(([lab,val,ratio])=>`<div class="sx-funnel-row"><span>${lab}</span><i style="--r:${Math.max(0.08,ratio)}"></i><b>${api.formatNumber(val)}</b></div>`).join("")}</div>
          <p class="sub" style="margin-top:8px">Ausgaben ${api.formatEuro(a.spend)} · CTR ${api.formatPct(a.ctr)} · CPC ${api.formatEuro(a.cpc)}</p>
        </div>
      </div>

      <div class="sx-panel ${section==="posts"?"on":""}" data-panel="posts">
        <div class="sx-sec"><h3>Top-Posts</h3>
          <div class="sx-carousel">${filteredPosts.map((p)=>`<article class="sx-post"><div class="ph"><b>${demo.channels[p.ch].name}</b></div><div class="meta"><strong>${p.title}</strong><span class="sub">${api.formatNumber(p.reach)} Reichweite · Eng. ${p.eng}</span></div></article>`).join("")}</div>
        </div>
      </div>

      <div class="sx-panel ${section==="live"?"on":""}" data-panel="live">
        <div class="sx-sec"><h3>Live-Feed</h3><div class="sx-feed" id="sxFeed"></div></div>
        <div class="sx-sec"><h3>Kommentare · Stimmung</h3>
          ${comments().slice(0,5).map((c,i)=>{const snt=sentiments[i%sentiments.length];const lab=snt==="pos"?"positiv":snt==="neg"?"kritisch":"neutral";return `<div class="sx-feed"><div class="item on"><strong>${c.author}</strong> · ${demo.channels[c.channel].name}<span class="sx-sent ${snt}">${lab}</span><div>${c.text}</div></div></div>`;}).join("")}
        </div>
        <div class="sx-sec"><h3>Social-Leads → Shop</h3>
          ${shopLeads.filter((l)=>ch==="all"||l.channel===ch).map((l)=>`<div class="sx-feed"><div class="item on"><strong>${l.name}</strong><div class="sub">${demo.channels[l.channel].name} · ${l.interest}<br>Auftrag <b>${l.orderLabel}</b> · ${l.status}</div></div></div>`).join("")}
        </div>
      </div>

      <div class="sx-panel ${section==="camp"?"on":""}" data-panel="camp">
        <div class="sx-sec sx-camp"><h3>Kampagnen · Budget</h3>
          ${filteredCamps.map((c)=>{const pct=Math.round((c.spend/c.budget)*100);return `<article><strong>${c.name}</strong><div class="sub">${api.formatEuro(c.spend)} / ${api.formatEuro(c.budget)} · ${c.leads} Leads</div><div class="bar"><i data-w="${pct}"></i></div></article>`;}).join("")}
        </div>
      </div>
    </div>`;

    sheet.querySelector("#exSocialClose").onclick = close;
    sheet.querySelectorAll("[data-ch]").forEach((b) => b.addEventListener("click", () => { ch = b.getAttribute("data-ch"); render(); }));
    sheet.querySelectorAll("[data-range]").forEach((b) => b.addEventListener("click", () => { range = b.getAttribute("data-range"); render(); }));
    sheet.querySelectorAll("[data-sec]").forEach((b) => b.addEventListener("click", () => { section = b.getAttribute("data-sec"); render(); }));
    bindChart();
    animateIn();
    startFeed();
  }

  function bindChart() {
    const tip = sheet.querySelector("#sxTip");
    const chart = sheet.querySelector("#sxChart");
    if (!tip || !chart) return;
    chart.querySelectorAll(".sx-dot").forEach((dot) => {
      const show = () => {
        tip.textContent = api.formatNumber(+dot.getAttribute("data-v")) + " · Beispiel";
        tip.style.left = dot.getAttribute("cx") / 320 * 100 + "%";
        tip.style.top = dot.getAttribute("cy") / 140 * 100 + "%";
        tip.style.opacity = "1";
      };
      dot.addEventListener("pointerenter", show);
      dot.addEventListener("pointerdown", show);
      dot.addEventListener("pointerleave", () => { tip.style.opacity = "0"; });
    });
  }

  function animateIn() {
    const root = sheet.querySelector("#sxRoot");
    if (!root) return;
    // counters
    root.querySelectorAll(".sx-kpi b[data-n]").forEach((el) => {
      const target = +el.getAttribute("data-n");
      if (reduce || !gsap) { el.textContent = api.formatNumber(target); return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 0.85,
        ease: "power3.out",
        onUpdate: () => { el.textContent = api.formatNumber(Math.round(obj.v)); }
      });
    });
    if (reduce || !gsap) {
      root.querySelectorAll(".sx-funnel-row i").forEach((el) => { el.style.transform = "scaleX(" + (el.style.getPropertyValue("--r") || 1) + ")"; });
      root.querySelectorAll(".sx-camp .bar>i").forEach((el) => { el.style.width = el.getAttribute("data-w") + "%"; });
      return;
    }
    gsap.from(root.querySelectorAll(".sx-kpi"), { y: 12, autoAlpha: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" });
    root.querySelectorAll(".sx-funnel-row i").forEach((el, i) => {
      gsap.fromTo(el, { scaleX: 0.08 }, { scaleX: parseFloat(el.style.getPropertyValue("--r") || "1"), duration: 0.7, delay: i * 0.08, ease: "power3.out" });
    });
    root.querySelectorAll(".sx-camp .bar>i").forEach((el) => {
      gsap.to(el, { width: el.getAttribute("data-w") + "%", duration: 0.8, ease: "power3.out" });
    });
  }

  function startFeed() {
    if (feedTimer) clearInterval(feedTimer);
    const feed = sheet.querySelector("#sxFeed");
    if (!feed || section !== "live") return;
    const pool = [
      "+12 Likes · Instagram · Beispiel",
      "Neuer Kommentar · TikTok · Beispiel",
      "+3 Leads · Google · Beispiel",
      "Reel 84 % fertig · Beispiel",
      "+7 Saves · Instagram · Beispiel"
    ];
    let i = 0;
    const push = () => {
      const el = document.createElement("div");
      el.className = "item";
      el.textContent = pool[i % pool.length];
      i++;
      feed.prepend(el);
      requestAnimationFrame(() => el.classList.add("on"));
      while (feed.children.length > 6) feed.removeChild(feed.lastChild);
    };
    push();
    if (!reduce) feedTimer = setInterval(push, 2800);
  }

  fab && fab.addEventListener("click", open);
  // capture: native switch binds all buttons and calls dn(undefined) for Social (no data-view)
  tab && tab.addEventListener("click", (e) => { e.preventDefault(); e.stopImmediatePropagation(); open(); }, true);
  panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) close(); });
  if (location.hash === "#social") setTimeout(open, 450);
})();
