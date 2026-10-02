/**
 * NOTE: Catalogue page search — filters materials by name/facts and highlights the active group jump.
 */
(function () {
  const input = document.querySelector('[data-katalog-search-input]');
  const empty = document.querySelector('[data-katalog-empty]');
  const groups = [...document.querySelectorAll('[data-katalog-group]')];
  const materials = [...document.querySelectorAll('[data-katalog-material]')];
  const tocLinks = [...document.querySelectorAll('a[data-katalog-toc]')];

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function applySearch() {
    const query = normalize(input ? input.value : '').trim();
    let visibleCount = 0;

    for (const material of materials) {
      const haystack = normalize(material.getAttribute('data-katalog-search') || '');
      const match = !query || haystack.includes(query);
      material.hidden = !match;
      if (match) visibleCount += 1;
    }

    for (const group of groups) {
      const anyVisible = [...group.querySelectorAll('[data-katalog-material]')].some(
        (el) => !el.hidden
      );
      group.hidden = !anyVisible;
    }

    if (empty) empty.hidden = visibleCount > 0;
  }

  function setActiveToc(id) {
    for (const link of tocLinks) {
      link.classList.toggle('is-active', link.getAttribute('data-katalog-toc') === id);
    }
  }

  if (input) {
    input.addEventListener('input', applySearch);
    input.addEventListener('search', applySearch);
    applySearch();
  }

  if ('IntersectionObserver' in window && groups.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveToc(visible.target.getAttribute('data-katalog-group'));
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );
    for (const group of groups) observer.observe(group);
    setActiveToc(groups[0].getAttribute('data-katalog-group'));
  }
})();
