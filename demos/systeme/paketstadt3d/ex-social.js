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

  const COLORS = { instagram:"#c13584", tiktok:"#111111", youtube:"#e11d48", google:"#1a73e8", all:"#0071e3" };
  const GLYPH = {
    all: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="3.2" fill="#c13584"/><circle cx="12" cy="8" r="3.2" fill="#111"/><circle cx="17" cy="12" r="3.2" fill="#e11d48"/><circle cx="12" cy="16" r="3.2" fill="#1a73e8" opacity=".9"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.3" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v9.2a3.8 3.8 0 1 1-2.6-3.6V7.2c.9.9 2.1 1.5 3.4 1.7V4H14z" fill="currentColor"/><path d="M14 4v9.2a3.8 3.8 0 1 1-2.6-3.6" fill="none" stroke="#25f4ee" stroke-width="1.4" opacity=".7"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3.5" fill="currentColor"/><path d="M11 9.5v5l5-2.5-5-2.5z" fill="#fff"/></svg>',
    google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 0 16c4.2 0 7.2-2.9 7.2-7 0-.5-.05-1-.14-1.4H12v2.9h4.1A4.2 4.2 0 1 1 12 7.8V4z" fill="currentColor"/></svg>'
  };
  function ringBtn(id, label, active, pct){
    const col = COLORS[id] || "#0071e3";
    const r=18, c=2*Math.PI*r, dash = (Math.max(0.08, Math.min(1,pct||0.72))*c).toFixed(1);
    return `<button type="button" class="sx-ring ${active?"active":""}" data-ch="${id}" style="--ch:${col}">
      <div class="orb">
        <svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="bg" cx="22" cy="22" r="${r}"/><circle class="fg" cx="22" cy="22" r="${r}" stroke-dasharray="${dash} ${c.toFixed(1)}" transform="rotate(-90 22 22)"/></svg>
        <span class="glyph" style="color:${col}">${GLYPH[id]||GLYPH.all}</span>
      </div>${label}
    </button>`;
  }

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
  function dateLabels(n) {
    const out = [];
    const now = new Date(2026, 10, 9);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      out.push(d.getDate() + "." + (d.getMonth() + 1));
    }
    return out;
  }
  function chartSVG() {
    const list = ids();
    const seriesMap = list.map((id) => ({ id, color: COLORS[id], values: demo.channels[id].series[range].slice(-18) }));
    const n = Math.min(...seriesMap.map((s) => s.values.length));
    seriesMap.forEach((s) => { s.values = s.values.slice(-n); });
    const w = 360, h = 168, padL = 36, padR = 10, padT = 12, padB = 28;
    const all = seriesMap.flatMap((s) => s.values);
    const max = Math.max(...all, 1);
    const min = Math.min(...all, 0);
    const span = Math.max(max - min, 1);
    const step = (w - padL - padR) / Math.max(n - 1, 1);
    const labels = dateLabels(n);
    const yTicks = [0, 0.5, 1].map((t) => min + span * t);
    function pts(values) {
      return values.map((v, i) => {
        const x = padL + i * step;
        const y = padT + (1 - (v - min) / span) * (h - padT - padB);
        return [x, y, v];
      });
    }
    function path(values) {
      const p = pts(values);
      return p.map((pt, i) => (i ? "L" : "M") + pt[0].toFixed(1) + "," + pt[1].toFixed(1)).join(" ");
    }
    const main = seriesMap.length === 1 ? seriesMap[0] : null;
    const sum = [];
    for (let i = 0; i < n; i++) sum.push(seriesMap.reduce((a, s) => a + s.values[i], 0));
    const sumMax = Math.max(...sum, 1);
    const sumPts = sum.map((v, i) => {
      const x = padL + i * step;
      const y = padT + (1 - v / sumMax) * (h - padT - padB);
      return [x, y, v];
    });
    const useOverlay = seriesMap.length > 1;
    const fillSrc = useOverlay ? sumPts : pts(seriesMap[0].values);
    const fillLine = fillSrc.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const area = fillLine + ` L${fillSrc[fillSrc.length-1][0]},${h-padB} L${fillSrc[0][0]},${h-padB} Z`;
    const axisY = useOverlay
      ? [0, 0.5, 1].map((t) => {
          const v = Math.round(sumMax * t);
          const y = padT + (1 - t) * (h - padT - padB);
          return `<text x="${padL-6}" y="${y+3}" text-anchor="end" class="sx-axis">${api.formatNumber(v)}</text><line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" class="sx-grid"/>`;
        }).join("")
      : yTicks.map((v) => {
          const y = padT + (1 - (v - min) / span) * (h - padT - padB);
          return `<text x="${padL-6}" y="${y+3}" text-anchor="end" class="sx-axis">${api.formatNumber(Math.round(v))}</text><line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" class="sx-grid"/>`;
        }).join("");
    const xLabs = [0, Math.floor((n-1)/2), n-1].map((i) => `<text x="${(padL + i*step).toFixed(1)}" y="${h-8}" text-anchor="middle" class="sx-axis">${labels[i]}</text>`).join("");
    const lines = (useOverlay ? seriesMap : seriesMap).map((s) => {
      const col = s.color;
      const p = path(s.values);
      const dots = pts(s.values).filter((_,i)=> i%Math.max(1,Math.floor(n/6))===0 || i===n-1).map((pt)=>`<circle class="sx-dot" data-i="${pt[0]}" data-v="${pt[2]}" data-ch="${s.id}" cx="${pt[0]}" cy="${pt[1]}" r="3.2" fill="#fff" stroke="${col}" stroke-width="2"></circle>`).join("");
      return `<path d="${p}" fill="none" stroke="${col}" stroke-width="${useOverlay?2:2.6}" stroke-linecap="round" stroke-linejoin="round" opacity="${useOverlay?0.95:1}"></path>${dots}`;
    }).join("");
    const legend = seriesMap.map((s)=>`<span class="sx-leg"><i style="background:${s.color}"></i>${demo.channels[s.id].name}</span>`).join("");
    return `<div class="sx-chart-wrap"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Verlaufskurve">
      <defs><linearGradient id="sxFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0071e3" stop-opacity=".22"/><stop offset="100%" stop-color="#0071e3" stop-opacity="0"/></linearGradient></defs>
      ${axisY}${xLabs}
      ${useOverlay ? "" : `<path d="${area}" fill="url(#sxFill)"></path>`}
      ${lines}
    </svg><div class="sx-legend">${legend}</div><div class="sx-tip" id="sxTip"></div></div>`;
  }

  function render() {
    const o = org();
    const a = ads();
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
          ${ringBtn("all","Mix",ch==="all",0.86)}
          ${api.channelIds().map((id)=>{const o=demo.channels[id].organic[range]; const pct=Math.min(0.95, (o.engagement||o.likes||1)/Math.max(o.reach||o.followers||1,1)*8); return ringBtn(id, demo.channels[id].name, ch===id, pct||0.65);}).join("")}
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
        <div class="sx-sec"><h3>Verlauf · tippen für Wert</h3><div class="sx-chart" id="sxChart">${chartSVG()}</div></div>
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
