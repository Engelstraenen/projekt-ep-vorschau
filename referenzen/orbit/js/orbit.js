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
const workCount = document.querySelector('[data-work-count]');
const workNames = ['Beispiel 1 von 3, Funke', 'Beispiel 2 von 3, Nordlicht', 'Beispiel 3 von 3, Salon'];

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

    const hero = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: heroEnd,
        pin: '.hero-pin',
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (scene) scene.setProgress(self.progress);
          if (canvas) {
            const fade = self.progress <= 0.82 ? 1 : Math.max(0, 1 - (self.progress - 0.82) / 0.16);
            canvas.style.opacity = fade.toFixed(3);
          }
          parkCanvas(self.progress > 0.98);
        },
        onLeave: () => parkCanvas(true),
        onEnterBack: () => parkCanvas(false),
      },
    });
    hero
      .to('.hero-copy', { yPercent: -16, opacity: 0, duration: 0.38 }, 0.4)
      .to('.bubble', { y: 30, opacity: 0, duration: 0.22 }, 0.28)
      .to('#hero', { backgroundColor: '#111111', duration: 0.26 }, 0.64);

    const lines = gsap.utils.toArray('.statements p');
    if (lines.length) {
      gsap.set(lines, { opacity: (i) => (i === 0 ? 1 : 0), yPercent: (i) => (i === 0 ? 0 : 28) });
      const studio = gsap.timeline({
        scrollTrigger: {
          trigger: '#studio',
          start: 'top top',
          end: studioEnd,
          pin: '.studio-pin',
          scrub: true,
        },
      });
      lines.forEach((line, index) => {
        if (index === 0) return;
        const at = index * 1.4;
        studio
          .to(lines[index - 1], { opacity: 0, yPercent: -18, duration: 0.45 }, at)
          .to(line, { opacity: 1, yPercent: 0, duration: 0.5 }, at + 0.2);
      });
    }

    const panels = gsap.utils.toArray('#arbeiten article');
    if (panels.length > 1) {
      gsap.set(panels.slice(1), { opacity: 0, rotateY: 16, z: 80 });
      const works = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#arbeiten',
          start: 'top top',
          end: workEnd,
          pin: '.work-pin',
          scrub: true,
          onUpdate: (self) => {
            const index = Math.min(panels.length - 1, Math.floor(self.progress * panels.length * 0.999));
            if (workCount && workCount.textContent !== workNames[index]) workCount.textContent = workNames[index];
            bar?.classList.toggle('on-cobalt', index === 1);
          },
        },
      });
      let at = 0;
      for (let i = 1; i < panels.length; i += 1) {
        at += 1.15;
        works
          .to(panels[i - 1], { opacity: 0, rotateY: -12, z: -80, duration: 0.4 }, at)
          .to(panels[i], { opacity: 1, rotateY: 0, z: 0, duration: 0.4 }, at);
        at += 0.4;
      }
      if (workCount) workCount.textContent = workNames[0];
    }

    const steps = gsap.utils.toArray('.steps li');
    if (steps.length) {
      const rail = document.querySelector('.steps-rail i');
      gsap.timeline({
        scrollTrigger: {
          trigger: '#zusammenarbeit',
          start: 'top 72%',
          end: 'bottom 55%',
          scrub: true,
        },
      }).to(rail, { scaleX: 1, ease: 'none', duration: steps.length }, 0);
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 75%',
          end: 'bottom 45%',
          toggleClass: 'is-on',
        });
      });
    }

    gsap.to('.swoosh path', {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#kontakt',
        start: 'top 75%',
        end: 'bottom 70%',
        scrub: true,
      },
    });

    ScrollTrigger.create({
      trigger: '#studio',
      start: 'top 72px',
      endTrigger: '#kontakt',
      end: 'top 72px',
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
