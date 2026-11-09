(function () {
  const path = location.pathname;
  const inPaket3d = path.includes("/paketstadt3d");
  const onPersonal = path.includes("/personal");
  const onBotsPage = path.includes("/bots");
  const onDashboard = path.includes("/dashboard") && path.includes("/systeme/");
  const onShop = path.includes("/shop-raum");
  const root3d = inPaket3d ? "./" : "../paketstadt3d/";
  const dashHref = inPaket3d ? "../dashboard/" : (onDashboard ? "./" : "../dashboard/");

  function ensureLogin() {
    try {
      const cur = JSON.parse(localStorage.getItem("ep-login") || "null");
      if (!cur || !cur.ma) {
        localStorage.setItem(
          "ep-login",
          JSON.stringify({ rolle: "gf", ma: "ma17", name: "Markus B.", rollenname: "Geschäftsführung" })
        );
      }
    } catch (_) {}
  }
  ensureLogin();

  if (onPersonal && (location.hash === "#/bots" || location.hash.startsWith("#/bots"))) {
    location.replace("../bots/");
    return;
  }

  function activeKey() {
    if (onBotsPage) return "bots";
    if (onPersonal) return "personal";
    if (onDashboard || onShop) return "dashboard";
    if (path.includes("/social")) return "social";
    if (location.hash === "#social" || document.body.classList.contains("ex-social-open")) return "social";
    if (location.hash === "#lager" || /view=lager/.test(location.search)) return "lager";
    return "stadt";
  }

  const items = [
    { id: "stadt", label: "Stadt", href: root3d + "?style=A" },
    { id: "lager", label: "Lager", href: root3d + "?style=A#lager" },
    { id: "dashboard", label: "Dashboard", href: dashHref },
    { id: "personal", label: "Personal", href: onPersonal ? "#/" : "../personal/" },
    { id: "bots", label: "Bots", href: onBotsPage ? "./" : "../bots/" },
    { id: "social", label: "Social", href: root3d + "?style=A#social" }
  ];

  function setActive(root, key) {
    root.querySelectorAll("a[data-ex-tab]").forEach((a) => {
      const on = a.getAttribute("data-ex-tab") === key;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const on = root.querySelector("a.active");
    if (on) on.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  function buildNav() {
    let wrap = document.getElementById("exPaketNav");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "exPaketNav";
      wrap.setAttribute("role", "navigation");
      wrap.setAttribute("aria-label", "Paketstadt Bereiche");
      wrap.innerHTML =
        '<div class="ex-nav-shell"><span class="ex-nav-fade l" aria-hidden="true"></span><div class="ex-nav-scroll" role="tablist"></div><span class="ex-nav-fade r" aria-hidden="true"></span></div>';
      document.body.appendChild(wrap);
      const scroll = wrap.querySelector(".ex-nav-scroll");
      items.forEach((it) => {
        const a = document.createElement("a");
        a.href = it.href;
        a.setAttribute("role", "tab");
        a.setAttribute("data-ex-tab", it.id);
        a.textContent = it.label;
        a.addEventListener("click", (e) => {
          if (it.id === "bots" || it.id === "personal") ensureLogin();
          if (inPaket3d && (it.id === "stadt" || it.id === "lager")) {
            e.preventDefault();
            document.body.classList.remove("ex-social-open");
            const panel = document.getElementById("exSocialPanel");
            if (panel) {
              panel.classList.remove("open");
              panel.setAttribute("aria-hidden", "true");
            }
            const api = window.paketstadt;
            try {
              if (api && api.setView) api.setView(it.id);
              else location.href = it.href;
            } catch (_) {
              location.href = it.href;
            }
            history.replaceState(null, "", it.id === "lager" ? "?style=A#lager" : "?style=A");
            setActive(wrap, it.id);
            return;
          }
          if (inPaket3d && it.id === "social") {
            e.preventDefault();
            document.getElementById("exSocialTab")?.click();
            setActive(wrap, "social");
            return;
          }
        });
        scroll.appendChild(a);
      });
    }
    document.body.classList.add("ex-paket-nav-on");
    if (inPaket3d) document.body.classList.add("ex-has-native-switch");
    setActive(wrap, activeKey());
    return wrap;
  }

  const nav = buildNav();

  // Intercept native switch (hidden) for bots/dashboard if somehow clicked
  if (inPaket3d) {
    document.addEventListener(
      "click",
      (e) => {
        const b = e.target.closest && e.target.closest("nav.switch button[data-view]");
        if (!b) return;
        const v = b.getAttribute("data-view");
        if (v === "bots") {
          e.preventDefault();
          e.stopPropagation();
          ensureLogin();
          location.href = "../bots/";
        } else if (v === "dashboard") {
          e.preventDefault();
          e.stopPropagation();
          location.href = "../dashboard/";
        } else if (v === "personal") {
          e.preventDefault();
          e.stopPropagation();
          ensureLogin();
          location.href = "../personal/";
        }
      },
      true
    );

    const obs = new MutationObserver(() => {
      if (document.body.classList.contains("ex-social-open")) setActive(nav, "social");
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    function applyHash() {
      const h = location.hash.replace("#", "");
      if (h === "social") document.getElementById("exSocialTab")?.click();
      else if (h === "lager" || h === "stadt") {
        try {
          window.paketstadt && window.paketstadt.setView && window.paketstadt.setView(h);
        } catch (_) {}
        setActive(nav, h || "stadt");
      } else if (h === "dashboard") location.replace("../dashboard/");
    }
    window.addEventListener("hashchange", applyHash);
    if (location.hash) setTimeout(applyHash, 500);

    // Zoom + marker
    (function zoom() {
      let n = 0;
      const t = setInterval(() => {
        n++;
        if (!window.paketstadt && n < 80) return;
        clearInterval(t);
        if (!window.paketstadt || document.getElementById("exZoomHelp")) return;
        const box = document.createElement("div");
        box.id = "exZoomHelp";
        box.innerHTML =
          '<button type="button" data-z="in" aria-label="Reinzoomen">+</button>' +
          '<button type="button" data-z="out" aria-label="Rauszoomen">−</button>' +
          '<button type="button" class="ex-zoom-back" data-z="back" aria-label="Zurück">Zurück</button>';
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
              deltaY: delta
            })
          );
        }
        box.addEventListener("click", (e) => {
          const z = e.target.getAttribute("data-z");
          if (z === "in") wheel(-140);
          else if (z === "out") wheel(140);
          else if (z === "back") {
            try {
              window.paketstadt.setView("stadt");
            } catch (_) {}
            document.getElementById("backBtn")?.click();
            setActive(nav, "stadt");
          }
        });
      }, 100);
    })();

    if (!document.getElementById("exSocialMarker")) {
      const btn = document.createElement("button");
      btn.id = "exSocialMarker";
      btn.type = "button";
      btn.innerHTML = "<b>Social Studio</b><small>Kanäle &amp; Ads · tippen</small>";
      btn.addEventListener("click", () => document.getElementById("exSocialTab")?.click());
      document.body.appendChild(btn);
    }
  }
})();
