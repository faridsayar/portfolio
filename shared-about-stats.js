// NOTE: Stats row — viewport-triggered count animation (up or down) in ~2s.
(function aboutStats() {
  const DURATION_MS = 2000;
  const initializedGroups = new WeakSet();

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function easeOutExpo(progress) {
    return progress >= 1 ? 1 : 1 - 2 ** (-10 * progress);
  }

  function getStartValue(el) {
    return el.dataset.from !== undefined ? Number(el.dataset.from) : 0;
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
        const from = getStartValue(el);
        const target = Number(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || '';
        const current = from + (target - from) * eased;
        el.textContent = formatValue(current, suffix);
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function initializeStatGroup(group) {
    if (initializedGroups.has(group)) return;

    const valueEls = [...group.querySelectorAll('[data-about-stat-value]')];
    if (valueEls.length === 0) return;

    initializedGroups.add(group);

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

    observer.observe(group);
  }

  function initializeAboutStats() {
    const groups = document.querySelectorAll('[data-about-stats-group]');
    groups.forEach(initializeStatGroup);
  }

  document.addEventListener('components:ready', initializeAboutStats);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAboutStats);
  } else {
    initializeAboutStats();
  }
})();
