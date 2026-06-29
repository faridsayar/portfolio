// NOTE: Injects per-project CreativeWork JSON-LD on advanced-project.html when URL matches a manifest project.
(function injectProjectSchema() {
  const graphs = window.__PROJECT_SCHEMA_BY_SLUG;
  if (!graphs) return;

  const catalogSlug = window.FormaaProjectOpenGraph?.resolveCatalogSlug?.() || '';
  if (!catalogSlug) return;

  const seoSlug =
    Object.entries(window.FormaaProjectOpenGraph.SEO_SLUG_TO_CATALOG).find(
      ([, catalog]) => catalog === catalogSlug
    )?.[0] || catalogSlug;

  if (!seoSlug || !graphs[seoSlug]) return;

  const existing = document.querySelector('script[data-project-schema]');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-project-schema', seoSlug);
  script.textContent = JSON.stringify(graphs[seoSlug]);
  document.head.appendChild(script);
})();
