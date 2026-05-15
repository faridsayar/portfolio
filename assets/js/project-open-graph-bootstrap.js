// NOTE: Sets Open Graph / Twitter meta on advanced-project.html from the project manifest before deferred app JS runs (for link previews).
(function () {
  'use strict';

  const SITE_ORIGIN = 'https://formaa.no';

  // NOTE: Public /prosjekter/{seo-slug} segment → catalog slug in projects-manifest.
  const SEO_SLUG_TO_CATALOG = {
    'obseed-custom-8-string-guitar': 'obseed',
    'undo-desertification': 'undo',
    'nomos-branding': 'nomos',
    'proton-headphones': 'proton',
    'nordic-restaurant-branding': 'nordic',
    'monocopter-drone': 'monocopter',
    'rafaels-ren-melk': 'rafaels',
    'eco-mate-closet': 'eco-mate-closet',
    'h2o-bottle-pedometer': 'h2o',
  };

  function getCatalogSlugForSeoSlug(seoSlug) {
    return SEO_SLUG_TO_CATALOG[String(seoSlug || '').toLowerCase()] || '';
  }

  function getSeoSlugForCatalogSlug(catalogSlug) {
    const entry = Object.entries(SEO_SLUG_TO_CATALOG).find(([, slug]) => slug === catalogSlug);
    return entry ? entry[0] : catalogSlug;
  }

  function upsertMeta(attr, value, isProperty) {
    const selector = isProperty ? `meta[property="${attr}"]` : `meta[name="${attr}"]`;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (isProperty) el.setAttribute('property', attr);
      else el.name = attr;
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function toAbsoluteAssetUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${SITE_ORIGIN}/${String(path).replace(/^\//, '')}`;
  }

  function applyOpenGraph({ title, description, image, url, imageAlt }) {
    document.title = title;
    upsertMeta('description', description, false);
    upsertMeta('og:title', title, true);
    upsertMeta('og:description', description, true);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:url', url, true);
    upsertMeta('og:image', image, true);
    upsertMeta('og:image:alt', imageAlt, true);
    upsertMeta('twitter:card', 'summary_large_image', false);
    upsertMeta('twitter:title', title, false);
    upsertMeta('twitter:description', description, false);
    upsertMeta('twitter:image', image, false);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  function resolveCatalogSlug() {
    const params = new URLSearchParams(window.location.search);
    const fromProjectQuery = (params.get('project') || '').trim().toLowerCase();
    if (fromProjectQuery) return fromProjectQuery;

    const fromSeoQuery = (params.get('seoSlug') || '').trim().toLowerCase();
    if (fromSeoQuery) return getCatalogSlugForSeoSlug(fromSeoQuery);

    const pathMatch = window.location.pathname.match(/\/prosjekter\/([a-z0-9-]+)\/?$/i);
    if (pathMatch) return getCatalogSlugForSeoSlug(pathMatch[1]);

    const fileMatch = window.location.pathname.match(/prosjekt-([a-z0-9-]+)\.html$/i);
    if (fileMatch) return getCatalogSlugForSeoSlug(fileMatch[1]);

    return '';
  }

  function applyFromProject(project) {
    if (!project || typeof project.slug !== 'string') return;
    const seoSlug = getSeoSlugForCatalogSlug(project.slug);
    const thumb = project.thumbnail || (Array.isArray(project.images) ? project.images[0] : '');
    const image = toAbsoluteAssetUrl(thumb);
    const title = `${project.title} | Industridesign og produktdesign`;
    const description = project.desc || '';
    const url = `${SITE_ORIGIN}/prosjekter/${seoSlug}`;

    applyOpenGraph({
      title,
      description,
      image,
      url,
      imageAlt: project.title,
    });
  }

  function bootstrap() {
    const catalogSlug = resolveCatalogSlug();
    if (!catalogSlug) return;
    const projects = window.__PROJECTS_MANIFEST?.projects;
    if (!Array.isArray(projects)) return;
    const project = projects.find((entry) => entry.slug === catalogSlug);
    if (!project) return;
    applyFromProject(project);
  }

  window.FormaaProjectOpenGraph = {
    SEO_SLUG_TO_CATALOG,
    resolveCatalogSlug,
    applyFromProject,
    bootstrap,
  };

  bootstrap();
})();
