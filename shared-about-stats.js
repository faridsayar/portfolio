// NOTE: Stats row — viewport-triggered count-up animation (0 → target in ~2s).
(function aboutStats() {
  const DURATION_MS = 2000;
  let initialized = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function easeOutExpo(progress) {
    return progress >= 1 ? 1 : 1 - 2 ** (-10 * progress);
  }

  function formatValue(value, suffix) {
    return `${Math.round(value)}${suffix}`;
  }

  function setFinalValues(valueEls) {
    valueEls.forEach((el) => {
      const target = Number(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || '';
      el.textContent = formatValue(target, suffix);
    });
  }

  function animateValues(valueEls) {
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = easeOutExpo(progress);

      valueEls.forEach((el) => {
        const target = Number(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || '';
        el.textContent = formatValue(target * eased, suffix);
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function initializeAboutStats() {
    if (initialized) return;

    const strip = document.querySelector('.about-stats');
    if (!strip) return;

    const valueEls = [...strip.querySelectorAll('[data-about-stat-value]')];
    if (valueEls.length === 0) return;

    initialized = true;

    if (prefersReducedMotion()) {
      setFinalValues(valueEls);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setFinalValues(valueEls);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animateValues(valueEls);
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(strip);
  }

  document.addEventListener('components:ready', initializeAboutStats);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAboutStats);
  } else {
    initializeAboutStats();
  }
})();
