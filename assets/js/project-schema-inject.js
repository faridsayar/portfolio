// NOTE: Injects per-project CreativeWork JSON-LD on advanced-project.html when ?seoSlug= matches a manifest project.
(function injectProjectSchema() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('seoSlug');
  const graphs = window.__PROJECT_SCHEMA_BY_SLUG;
  if (!slug || !graphs || !graphs[slug]) return;

  const existing = document.querySelector('script[data-project-schema]');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-project-schema', slug);
  script.textContent = JSON.stringify(graphs[slug]);
  document.head.appendChild(script);
})();
