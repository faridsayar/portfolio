/**
 * NOTE: Catalogue page search — filters materials by name/facts, pins the group
 * nav to the viewport top while scrolling, and highlights the active section.
 */
(function () {
  const input = document.querySelector('[data-katalog-search-input]');
  const empty = document.querySelector('[data-katalog-empty]');
  const groups = [...document.querySelectorAll('[data-katalog-group]')];
  const materials = [...document.querySelectorAll('[data-katalog-material]')];
  const tocLinks = [...document.querySelectorAll('a[data-katalog-toc]')];
  const toc = document.querySelector('.katalog-toc');
  const layout = document.querySelector('.katalog-layout');

  /** NOTE: Placeholder keeps layout height when TOC switches to fixed. */
  let sentinel = null;
  if (toc && toc.parentNode) {
    sentinel = document.createElement('div');
    sentinel.className = 'katalog-toc-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    toc.parentNode.insertBefore(sentinel, toc);
  }

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
    updateStickyToc();
    updateActiveToc();
  }

  function setActiveToc(id) {
    for (const link of tocLinks) {
      link.classList.toggle('is-active', link.getAttribute('data-katalog-toc') === id);
    }
  }

  /** NOTE: Pick the group whose top has crossed just below the sticky TOC. */
  function updateActiveToc() {
    const visibleGroups = groups.filter((group) => !group.hidden);
    if (!visibleGroups.length) return;

    const tocBottom = toc ? toc.getBoundingClientRect().bottom : 0;
    const offset = Math.max(tocBottom, 0) + 8;
    let current = visibleGroups[0];

    for (const group of visibleGroups) {
      if (group.getBoundingClientRect().top <= offset) {
        current = group;
      }
    }

    setActiveToc(current.getAttribute('data-katalog-group'));
  }

  /**
   * NOTE: Fixed pin fallback — CSS sticky fails when ancestors use overflow-x
   * clipping; switch to fixed once the sentinel reaches the top of the viewport.
   * Desktop keeps the left column width; stacked layout uses the full list width.
   */
  function updateStickyToc() {
    if (!toc || !sentinel || !layout) return;

    const stacked = window.matchMedia('(max-width: 1024px)').matches;
    const sentinelTop = sentinel.getBoundingClientRect().top;
    const shouldStick = sentinelTop <= 0;
    const layoutRect = layout.getBoundingClientRect();
    const columnWidth = stacked
      ? layoutRect.width
      : toc.classList.contains('is-stuck')
        ? parseFloat(toc.style.width) || toc.offsetWidth
        : toc.offsetWidth;

    if (shouldStick) {
      if (!toc.classList.contains('is-stuck')) {
        sentinel.style.height = `${toc.offsetHeight}px`;
      }
      toc.classList.add('is-stuck');
      toc.style.left = `${layoutRect.left}px`;
      toc.style.width = `${columnWidth}px`;
    } else {
      toc.classList.remove('is-stuck');
      toc.style.left = '';
      toc.style.width = '';
      sentinel.style.height = '';
    }
  }

  if (input) {
    input.addEventListener('input', applySearch);
    input.addEventListener('search', applySearch);
    applySearch();
  }

  for (const link of tocLinks) {
    link.addEventListener('click', () => {
      setActiveToc(link.getAttribute('data-katalog-toc'));
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      updateStickyToc();
      updateActiveToc();
    },
    { passive: true }
  );
  window.addEventListener('resize', () => {
    updateStickyToc();
    updateActiveToc();
  });

  updateStickyToc();
  updateActiveToc();
})();
