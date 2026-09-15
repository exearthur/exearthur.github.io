/**
 * Progressive enhancements for the site. Everything here is optional:
 * the pages are fully readable with JavaScript disabled, and every
 * effect respects the user's reduced-motion preference.
 */
(function () {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;

  /**
   * Run `onEnter` once for each matched element the first time it scrolls
   * into view. Falls back to running immediately when observation isn't
   * possible or motion is reduced.
   */
  function onFirstView(selector, onEnter, options) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    if (reduceMotion || !canObserve) {
      elements.forEach(onEnter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        observer.unobserve(entry.target);
      });
    }, options);

    elements.forEach((el) => observer.observe(el));
  }

  /* Nav: show a soft shadow once the page has scrolled. */
  const nav = document.getElementById('nav');
  if (nav) {
    const update = () => nav.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Scroll reveal: elements fade and rise into place as they appear. */
  onFirstView('.reveal', (el) => el.classList.add('is-in'), {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1,
  });

  /* Stat counters: "68K+" counts up from 0 while keeping its suffix. */
  onFirstView('[data-count]', (el) => {
    const match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match || reduceMotion) return;

    const target = Number(match[1]);
    const suffix = match[2];
    const duration = 1400;
    let start;

    const step = (now) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });

  /* Hero portrait: a subtle 3D tilt that follows a fine pointer. */
  const photo = document.querySelector('.hero-photo-wrap');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (photo && finePointer && !reduceMotion) {
    const hero = photo.closest('.hero');
    const maxTilt = 6;

    hero.addEventListener('mousemove', (e) => {
      const r = photo.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      photo.style.transform =
        `perspective(1200px) rotateY(${(x * maxTilt).toFixed(2)}deg) rotateX(${(-y * maxTilt).toFixed(2)}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      photo.style.transform = '';
    });
  }
})();
