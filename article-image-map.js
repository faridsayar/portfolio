// NOTE: Single source of truth for article images (used by article pages + insights cards).
(function exposeArticleImageMap() {
  const imagePool = [
    '/assets/images/Articles/Memorium.jpg',
    '/assets/images/Articles/usv.png',
    '/assets/images/Articles/itac.webp',
    '/assets/images/Articles/kalash.webp',
    '/assets/images/Articles/serviett.jpg',
    '/assets/images/Articles/ak-background-image.jpg',
  ];

  // NOTE: Root-absolute paths so hero/cards work on /blogg/{slug}/ nested routes, not only site root.
  function toRootAssetPath(path) {
    if (!path || path.startsWith('/') || /^https?:/i.test(path)) return path;
    return `/${String(path).replace(/^\.\//, '')}`;
  }

  function getArticleImageForKey(key) {
    // NOTE: Maps each SEO slug to a fixed image used in shares and insight cards.
    if (String(key) === 'blogg-sok-stotte-innovasjon-norge')
      return toRootAssetPath('assets/images/Projects/H2O/h2o-18.webp');
    if (String(key) === 'blogg-hva-er-industridesign')
      return toRootAssetPath('assets/images/Articles/itac.webp');
    if (String(key) === 'blogg-ux-er-ikke-produktdesign')
      return toRootAssetPath('assets/images/Articles/dux-article2.avif');
    if (String(key) === 'blogg-hvem-trenger-design')
      return toRootAssetPath('assets/images/Articles/product-design-image.webp');
    if (String(key) === 'blogg-hvordan-design-sparer-penger')
      return toRootAssetPath('assets/images/Articles/bike7.webp');
    if (String(key) === 'blogg-branding-og-produktdesign')
      return toRootAssetPath('assets/images/Articles/memorium-branding.webp');
    if (String(key) === 'blogg-design-for-crowdfunding')
      return toRootAssetPath('assets/images/Articles/kalash.webp');
    if (String(key) === 'blogg-hvordan-lage-prototype')
      return toRootAssetPath('assets/images/Articles/prototype2.webp');
    if (String(key) === 'blogg-fra-oppfinnelse-til-produksjon')
      return toRootAssetPath('assets/images/Articles/CAD.webp');
    if (String(key) === 'blogg-produktutvikling-hardware-startup')
      return toRootAssetPath('assets/images/prosess/3d-modelering.webp');
    return imagePool[0];
  }

  window.getArticleImageForKey = getArticleImageForKey;
})();
