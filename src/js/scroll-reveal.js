// src/js/scroll-reveal.js
// Lightweight scroll reveal system for the portfolio.
// No dependencies. Safe for mobile. Respects reduced motion.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setRevealDelay(elements, step = 70, max = 420) {
  elements.forEach((el, index) => {
    const delay = Math.min(index * step, max);
    el.style.setProperty('--reveal-delay', `${delay}ms`);
  });
}

function prepareRevealElements() {
  const selectors = [
    '.section',
    '.section__head',
    '.skill-card',
    '.project',
    '.xp',
    '.stack-group',
    '.contact-row',
    '.contact-form',
    '.hero__system',
    '.hero__terminal',
    '.hero__stack-line',
  ];

  const revealElements = document.querySelectorAll(selectors.join(', '));

  revealElements.forEach((el) => {
    el.classList.add('reveal');
  });

  setRevealDelay(document.querySelectorAll('.skill-card'), 90, 360);
  setRevealDelay(document.querySelectorAll('.project'), 110, 440);
  setRevealDelay(document.querySelectorAll('.stack-group'), 90, 360);
  setRevealDelay(document.querySelectorAll('.contact-row'), 80, 240);
  setRevealDelay(document.querySelectorAll('.project .tag'), 35, 260);
  setRevealDelay(document.querySelectorAll('.stack-group .tag'), 28, 260);

  document.querySelectorAll('.project .tag, .stack-group .tag').forEach((tag) => {
    tag.classList.add('reveal', 'reveal--compact');
  });

  return document.querySelectorAll('.reveal');
}

function revealImmediately(elements) {
  elements.forEach((el) => {
    el.classList.add('is-visible');
  });
}

function initScrollReveal() {
  const elements = prepareRevealElements();

  if (!elements.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealImmediately(elements);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    },
  );

  elements.forEach((el) => observer.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}
