import Lenis from "../../../assets/vendor/lenis/lenis.mjs";
import { HERO_EDGE, MANIFEST_EDGE, clipPolygon } from "./clip.js";
import { createScene } from "./scene.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(pointer: fine)").matches;

function span(p, a, b) {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function bootChrome() {
  const menu = document.querySelector("[data-menu]");
  const links = document.querySelector("#menu");
  menu?.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    menu.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      links.classList.remove("is-open");
      menu?.setAttribute("aria-expanded", "false");
    }
  });

  const dialog = document.querySelector("#projekt");
  const form = document.querySelector("#projekt-form");
  const result = document.querySelector("#projekt-result");
  const error = document.querySelector("[data-error]");
  document.querySelectorAll("[data-open-projekt]").forEach((btn) => {
    btn.addEventListener("click", () => {
      form.hidden = false;
      result.hidden = true;
      dialog.showModal();
    });
  });
  dialog.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => dialog.close());
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    if (name.length < 2 || !email.includes("@")) {
      error.hidden = false;
      error.textContent = "Name und E-Mail werden nur hier geprüft. Nichts wird verschickt.";
      return;
    }
    error.hidden = true;
    result.querySelector("[data-who]").textContent = name;
    form.hidden = true;
    result.hidden = false;
  });
}

function bootMotion() {
  const stage = document.querySelector("#stage");
  const world = document.querySelector("#world");
  const pieces = document.querySelector("#pieces");
  let scene;
  try {
    scene = createScene(stage, world, pieces);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return;
  }
  document.body.classList.add("is-motion");

  const heroSheet = document.querySelector("#hero");
  const heroUi = document.querySelector(".hero-ui");
  const manifestSheet = document.querySelector(".manifest-sheet");
  const manifestCopy = document.querySelector(".manifest-copy");
  const ink = document.querySelector("#ink");
  const inkB = document.querySelector("#ink-b");
  const contact = document.querySelector("#kontakt");
  const darkNote = document.querySelector(".dark-note");
  const bar = document.querySelector(".bar");
  const dots = [...document.querySelectorAll(".dots i")];
  const captions = [...document.querySelectorAll("#captions li")];

  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.92 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  gsap.registerPlugin(ScrollTrigger);

  let progress = 0;
  let velocity = 0;
  ScrollTrigger.create({
    trigger: "#track",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      progress = self.progress;
      velocity = Math.min(1, Math.abs(self.getVelocity()) / 2800);
    },
  });

  document.querySelectorAll("[data-jump]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const trigger = ScrollTrigger.getAll()[0];
      const target = trigger.start + (trigger.end - trigger.start) * Number(link.dataset.jump);
      lenis.scrollTo(target, { duration: 1.15 });
    });
  });

  if (fine) {
    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      scene.setPointer(x, y);
    });
  }
  window.addEventListener("resize", () => {
    scene.resize();
    ScrollTrigger.refresh();
  });

  function paint(p, v) {
    const wipe = span(p, 0.17, 0.31);
    const reveal = span(p, 0.42, 0.54);
    const fly = span(p, 0.5, 0.68);
    const grid = span(p, 0.64, 0.86);
    const contactIn = span(p, 0.82, 0.95);
    const heroClip = clipPolygon(HERO_EDGE, wipe, "hero");
    const manifestClip = clipPolygon(MANIFEST_EDGE, reveal, "manifest");
    heroSheet.style.clipPath = heroClip;
    heroUi.style.clipPath = heroClip;
    stage.style.clipPath = heroClip;
    manifestSheet.style.clipPath = manifestClip;
    manifestCopy.style.clipPath = manifestClip;
    pieces.style.clipPath = manifestClip;
    manifestCopy.style.opacity = String(1 - span(p, 0.6, 0.7));
    if (ink) {
      ink.style.transform = `translate3d(${lerp(62, -78, fly)}vw, ${Math.sin(fly * Math.PI) * 4}vh, 0) rotate(${lerp(-12, 8, fly)}deg)`;
      ink.classList.toggle("is-hot", v > 0.28 && fly > 0.08 && fly < 0.9);
    }
    if (inkB) {
      inkB.style.transform = `translate3d(${lerp(-70, 74, span(p, 0.54, 0.72))}vw, ${lerp(8, -6, fly)}vh, 0) rotate(${lerp(16, -6, fly)}deg)`;
    }
    contact.style.transform = `translate3d(0, ${(1 - contactIn) * 112}%, 0)`;
    if (darkNote) darkNote.style.opacity = String(span(p, 0.26, 0.34) * (1 - span(p, 0.4, 0.48)));
    const solid = (p > 0.22 && p < 0.48) || p > 0.86;
    bar.classList.toggle("is-solid", solid);
    const dot = p < 0.2 ? 0 : p < 0.62 ? 1 : 2;
    dots.forEach((node, index) => node.classList.toggle("is-on", index === dot));
    const cue = document.querySelector(".scroll-cue");
    if (cue) cue.style.opacity = String(1 - span(p, 0.04, 0.14));

    captions.forEach((li) => {
      const found = scene.works.find((item) => item.name === li.dataset.name);
      if (!found || !found.mesh.visible || grid < 0.55) {
        li.style.opacity = "0";
        return;
      }
      const point = scene.project(found.mesh);
      const onScreen = point.z < 1 && point.x > 80 && point.x < window.innerWidth - 80;
      li.style.opacity = onScreen ? String(Math.min(1, (grid - 0.55) * 3)) : "0";
      li.style.transform = `translate3d(${point.x}px, ${point.y + (window.innerWidth < 860 ? 46 : 72)}px, 0) translate(-50%, 0)`;
    });
  }

  gsap.ticker.add(() => {
    scene.update(progress, velocity);
    scene.render();
    paint(progress, velocity);
  });
  paint(0, 0);
}

bootChrome();
if (!reduced) bootMotion();
