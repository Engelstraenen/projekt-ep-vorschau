(function () {
  const path = location.pathname;
  const inPaket3d = /\/paketstadt3d\/?$/.test(path) || path.includes("/paketstadt3d/");
  const base = inPaket3d ? "./" : "../paketstadt3d/";
  const personalBase = inPaket3d ? "../personal/" : "../personal/";
  const botsHref = inPaket3d ? "../personal/#/bots" : "./#/bots".replace("./#/bots", path.includes("/personal") ? "#/bots" : "../personal/#/bots");

  function activeKey() {
    if (path.includes("/personal")) return location.hash.includes("bots") ? "bots" : "personal";
    if (path.includes("/bots")) return "bots";
    if (path.includes("/social")) return "social";
    if (path.includes("/shop-raum") || path.includes("/dashboard")) return "dashboard";
    if (location.hash === "#social") return "social";
    return "stadt";
  }

  const onPersonal = path.includes("/personal");
  const onBotsPage = path.includes("/bots/");
  const items = [
    { id: "stadt", label: "Stadt", href: (onPersonal || onBotsPage ? "../paketstadt3d/" : base) + "?style=A" },
    { id: "lager", label: "Lager", href: (onPersonal || onBotsPage ? "../paketstadt3d/" : base) + "?style=A#lager" },
    { id: "dashboard", label: "Dashboard", href: (onPersonal || onBotsPage ? "../paketstadt3d/" : base) + "?style=A#dashboard" },
    { id: "personal", label: "Personal", href: onPersonal ? "./" : (onBotsPage ? "../personal/" : "../personal/") },
    { id: "bots", label: "Bots", href: onPersonal ? "#/bots" : (onBotsPage ? "./" : "../personal/#/bots") },
    { id: "social", label: "Social", href: (onPersonal || onBotsPage ? "../paketstadt3d/" : base) + "?style=A#social" }
  ];

  if (inPaket3d && document.querySelector("nav.switch")) {
    document.body.classList.add("ex-has-native-switch");
    // Ensure Social tab stays last; Bots stays before Social (already in HTML)
    const sw = document.querySelector("nav.switch");
    // Force Bots visible via class hook already in CSS
    // Sync hash routes
    function applyHash() {
      const h = location.hash.replace("#", "");
      const api = window.paketstadt;
      if (h === "social") {
        document.getElementById("exSocialOpen")?.click();
        return;
      }
      if (h === "dashboard") {
        const btn = sw.querySelector('[data-view="dashboard"]');
        btn && btn.click();
        return;
      }
      if (h === "lager" || h === "stadt") {
        const btn = sw.querySelector('[data-view="' + h + '"]');
        btn && btn.click();
      }
    }
    window.addEventListener("hashchange", applyHash);
    if (location.hash) setTimeout(applyHash, 600);
    // Close social when other native tabs clicked
    sw.querySelectorAll("button[data-view]").forEach((b) => {
      b.addEventListener("click", () => {
        document.body.classList.remove("ex-social-open");
        const panel = document.getElementById("exSocialPanel");
        if (panel) {
          panel.classList.remove("open");
          panel.setAttribute("aria-hidden", "true");
        }
      });
    });
    // Zoom helpers
    injectZoom();
    return;
  }

  // Inject nav on sibling demos
  const wrap = document.createElement("div");
  wrap.id = "exPaketNav";
  wrap.setAttribute("role", "navigation");
  wrap.setAttribute("aria-label", "Paketstadt Bereiche");
  const cur = activeKey();
  wrap.innerHTML =
    '<div class="ex-nav-shell"><span class="ex-nav-fade l" aria-hidden="true"></span><div class="ex-nav-scroll" role="tablist">' +
    items
      .map((it) => {
        const on = it.id === cur;
        return `<a href="${it.href}" role="tab" ${on ? 'aria-current="page" class="active"' : ""}>${it.label}</a>`;
      })
      .join("") +
    '</div><span class="ex-nav-fade r" aria-hidden="true"></span></div>';
  document.body.appendChild(wrap);
  document.body.style.paddingTop = "64px";

  function injectZoom() {}
  // zoom only on 3d page
})();

(function zoomHelpers() {
  if (!/\/paketstadt3d\//.test(location.pathname) && !/\/paketstadt3d\/?$/.test(location.pathname)) return;
  function ready(fn) {
    if (window.paketstadt) return fn();
    let n = 0;
    const t = setInterval(() => {
      n++;
      if (window.paketstadt || n > 80) {
        clearInterval(t);
        if (window.paketstadt) fn();
      }
    }, 100);
  }
  ready(() => {
    if (document.getElementById("exZoomHelp")) return;
    const box = document.createElement("div");
    box.id = "exZoomHelp";
    box.innerHTML =
      '<button type="button" data-z="in" aria-label="Reinzoomen">+</button>' +
      '<button type="button" data-z="out" aria-label="Rauszoomen">−</button>' +
      '<button type="button" class="ex-zoom-back" data-z="back" aria-label="Zurück / Übersicht">Zurück</button>';
    document.body.appendChild(box);
    const canvas = document.getElementById("c");
    function wheel(delta) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      canvas.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          clientX: r.left + r.width / 2,
          clientY: r.top + r.height / 2,
          deltaY: delta,
          deltaMode: 0
        })
      );
    }
    box.addEventListener("click", (e) => {
      const z = e.target.getAttribute("data-z");
      if (!z) return;
      const api = window.paketstadt;
      if (z === "in") wheel(-120);
      else if (z === "out") wheel(120);
      else if (z === "back") {
        try {
          api.setView && api.setView("stadt");
        } catch (_) {}
        const back = document.getElementById("backBtn");
        if (back && !back.hidden) back.click();
      }
    });
    // Double-tap to zoom into pick
    let lastTap = 0;
    canvas &&
      canvas.addEventListener(
        "pointerup",
        (ev) => {
          const now = Date.now();
          if (now - lastTap < 280) {
            try {
              const id = apiPick(ev);
              if (id && window.paketstadt.zoomInto) window.paketstadt.zoomInto(id);
            } catch (_) {}
          }
          lastTap = now;
        },
        { passive: true }
      );
    function apiPick(ev) {
      return window.paketstadt.pickAt ? window.paketstadt.pickAt(ev.clientX, ev.clientY) : null;
    }
  });
})();
