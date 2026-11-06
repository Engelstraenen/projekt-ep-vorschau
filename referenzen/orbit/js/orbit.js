import Lenis from '../../../assets/vendor/lenis/lenis.mjs';
import { mountScene } from './scene.js';

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 899px)').matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

const canvas = document.getElementById('stage');
const dialog = document.getElementById('projekt');
const form = document.getElementById('projekt-form');
const result = document.getElementById('projekt-result');
const menuBtn = document.querySelector('[data-menu]');
const menu = document.getElementById('menu');
const bar = document.querySelector('.bar');

const scene = canvas ? mountScene(canvas, { mobile, reduced: reduce }) : null;
if (scene) {
  document.body.classList.add('has-webgl');
  canvas.classList.add('is-live');
}

function closeMenu() {
  if (!menuBtn || !menu) return;
  menuBtn.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    menu.classList.toggle('is-open', !open);
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function openDialog() {
  if (!dialog) return;
  if (result) result.hidden = true;
  if (form) form.hidden = false;
  dialog.showModal();
}

document.querySelectorAll('[data-open-projekt]').forEach((btn) => {
  btn.addEventListener('click', openDialog);
});

if (dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const error = form.querySelector('[data-error]');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk) {
      if (error) {
        error.hidden = false;
        error.textContent = name
          ? 'Die E-Mail braucht ein @ und eine Domain.'
          : 'Bitte Namen und E-Mail eintragen. Es wird trotzdem nichts gesendet.';
      }
      const field = form.querySelector(name ? '[name="email"]' : '[name="name"]');
      field?.focus();
      return;
    }
    if (error) error.hidden = true;
    form.hidden = true;
    if (result) {
      result.hidden = false;
      const who = result.querySelector('[data-who]');
      if (who) who.textContent = name;
    }
  });
}

let parked = false;
function parkCanvas(next) {
  if (!canvas || next === parked) return;
  parked = next;
  canvas.classList.toggle('is-parked', next);
  if (scene) scene.setActive(!next);
}

if (gsap && ScrollTrigger && scene) {
  window.addEventListener('resize', () => scene.resize(), { passive: true });
}

if (!reduce && window.matchMedia('(pointer: fine)').matches && scene) {
  window.addEventListener('pointermove', (event) => {
    scene.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
}

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 900px)', () => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('is-motion');
    const wide = window.matchMedia('(min-width: 900px)').matches;
    const heroEnd = wide ? '+=300%' : '+=165%';
    const studioEnd = wide ? '+=190%' : '+=130%';
    const workEnd = wide ? '+=240%' : '+=170%';

    const chroma = document.querySelector('[data-chroma]');
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: heroEnd,
      pin: '.hero-pin',
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => scene?.setBeat('hero', self.progress),
    });

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#wipe',
        start: 'top top',
        end: wide ? '+=150%' : '+=110%',
        pin: '.wipe-pin',
        scrub: true,
        onUpdate: (self) => scene?.setBeat('wipe', self.progress),
      },
    }).to('.wipe-sheet', { yPercent: -108 }, 0);

    ScrollTrigger.create({
      trigger: '#studio',
      start: 'top top',
      end: studioEnd,
      pin: '.manifest-pin',
      scrub: true,
      onUpdate: (self) => {
        scene?.setBeat('manifest', self.progress);
        if (!chroma) return;
        const shift = gsap.utils.clamp(-4.5, 4.5, self.getVelocity() / 1400);
        chroma.style.textShadow = shift
          ? `${shift}px 0 rgba(255,42,106,.7), ${-shift}px 0 rgba(42,212,255,.7)`
          : 'none';
      },
    });

    ScrollTrigger.create({
      trigger: '#arbeiten',
      start: 'top top',
      end: workEnd,
      pin: '.works-pin',
      scrub: true,
      onUpdate: (self) => scene?.setBeat('works', self.progress),
    });

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#kontakt',
        start: 'top top',
        end: wide ? '+=160%' : '+=120%',
        pin: '.reach-pin',
        scrub: true,
        onUpdate: (self) => scene?.setBeat('contact', self.progress),
      },
    })
      .to('[data-strip]', { yPercent: -130 }, 0)
      .fromTo('.splash', { scale: 0.92 }, { scale: 1.08 }, 0);

    ScrollTrigger.create({
      trigger: '#wipe',
      start: 'top 80px',
      endTrigger: '#studio',
      end: 'top 80px',
      toggleClass: { targets: bar, className: 'is-solid' },
    });
    ScrollTrigger.create({
      trigger: '#kontakt',
      start: 'top 80px',
      end: 'bottom top',
      toggleClass: { targets: bar, className: 'is-solid' },
    });

    return () => {
      root.classList.remove('is-motion');
      bar?.classList.remove('is-solid', 'on-cobalt');
      parkCanvas(false);
      if (scene) scene.setProgress(0);
    };
  });
} else if (scene && reduce) {
  scene.setProgress(0);
  scene.render();
}
