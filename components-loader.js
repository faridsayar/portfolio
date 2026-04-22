// NOTE: Lightweight HTML component loader for static pages.
(function loadComponents() {
  const inlineComponents = {
    // NOTE: Inline fallback avoids fetch issues in local/file contexts.
    'side-nav': '<nav class="side-nav" aria-label="Navigasjon" data-mobile-nav></nav>',
  };

  const slots = Array.from(document.querySelectorAll('[data-component]'));
  if (slots.length === 0) {
    document.dispatchEvent(new CustomEvent('components:ready'));
    return;
  }

  const tasks = slots.map(async (slot) => {
    const name = slot.getAttribute('data-component');
    if (!name) return;
    const fallbackMarkup = inlineComponents[name];
    try {
      const response = await fetch(`components/${name}.html`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Component fetch failed: ${name}`);
      const markup = await response.text();
      slot.outerHTML = markup;
    } catch (_error) {
      if (fallbackMarkup) slot.outerHTML = fallbackMarkup;
    }
  });

  Promise.all(tasks)
    .catch(() => {})
    .finally(() => {
      document.dispatchEvent(new CustomEvent('components:ready'));
    });
})();
