(function () {
  var root = document.documentElement;
  var heroA = document.getElementById("hero-a");
  var heroB = document.getElementById("hero-b");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var playing = null;

  var beats = [
    ["#weine", 2.55, 0.7],
    ["#lage", 4.4, 0.65],
    ["#lese", 5.7, 0.55],
    ["#keller", 6.55, 0.5],
    [".quote", 7.9, 0.45],
    ["#besuch", 8.7, 0.5],
    [".trio", 9.7, 0.55],
    [".arrival", 11.05, 0.55],
    ["#haus", 12.2, 0.7]
  ];

  function topOf(sel) {
    var el = document.querySelector(sel);
    return el.getBoundingClientRect().top + window.scrollY;
  }

  function stop() {
    if (playing) {
      playing.kill();
      playing = null;
    }
  }

  function play() {
    if (typeof gsap === "undefined" || reduce) return;
    stop();
    window.scrollTo(0, 0);
    gsap.set(heroB, { autoAlpha: 0 });
    gsap.set(heroA, { autoAlpha: 1 });
    var proxy = { y: 0 };
    var tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tl.to(heroB, { autoAlpha: 1, duration: 2.2, ease: "power1.inOut" }, 0.45);
    tl.to(heroA, { autoAlpha: 0, duration: 2.2, ease: "power1.inOut" }, 0.45);
    beats.forEach(function (beat) {
      tl.to(proxy, {
        y: function () { return topOf(beat[0]); },
        duration: beat[2],
        onUpdate: function () { window.scrollTo(0, proxy.y); }
      }, beat[1]);
    });
    playing = tl;
  }

  document.querySelectorAll(".pill a, .foot a").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      stop();
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  window.addEventListener("wheel", function () {
    if (playing) stop();
  }, { passive: true });

  function easeInOut(p) {
    return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  }

  function yAt(t) {
    var y = 0;
    for (var i = 0; i < beats.length; i++) {
      var dest = topOf(beats[i][0]);
      var start = beats[i][1];
      var dur = beats[i][2];
      if (t < start) return y;
      if (t >= start + dur) {
        y = dest;
        continue;
      }
      return y + (dest - y) * easeInOut((t - start) / dur);
    }
    return y;
  }

  function seek(t) {
    var fade = Math.min(1, Math.max(0, (t - 0.45) / 2.2));
    if (typeof gsap !== "undefined") {
      gsap.set(heroB, { autoAlpha: fade });
      gsap.set(heroA, { autoAlpha: 1 - fade });
    } else {
      heroB.style.opacity = String(fade);
      heroA.style.opacity = String(1 - fade);
    }
    window.scrollTo(0, yAt(t));
  }

  window.__seek = seek;

  function boot() {
    root.classList.add("ready");
    var still = new URLSearchParams(location.search).get("t");
    if (still !== null) {
      seek(parseFloat(still) || 0);
      return;
    }
    if (reduce) {
      if (typeof gsap !== "undefined") {
        gsap.set(heroB, { autoAlpha: 1 });
        gsap.set(heroA, { autoAlpha: 0 });
      }
      return;
    }
    play();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(boot);
  } else {
    boot();
  }
})();
