// NOTE: Single source of truth for article images (used by article pages + insights cards).
(function exposeArticleImageMap() {
  const imagePool = [
    'assets/images/Articles/Memorium.jpg',
    'assets/images/Articles/usv.png',
    'assets/images/Articles/itac.webp',
    'assets/images/Articles/kalash.webp',
    'assets/images/Articles/serviett.jpg',
    'assets/images/Articles/ak-background-image.jpg',
  ];

  function getArticleImageForKey(key) {
    // NOTE: Maps each SEO slug to a fixed image used in shares and insight cards.
    if (String(key) === 'innsikt-hva-er-industridesign') return 'assets/images/Articles/itac.webp';
    if (String(key) === 'innsikt-ux-er-ikke-produktdesign')
      return 'assets/images/Articles/dux-article2.avif';
    if (String(key) === 'innsikt-hvem-trenger-design')
      return 'assets/images/Articles/product-design-image.webp';
    if (String(key) === 'innsikt-hvordan-design-sparer-penger')
      return 'assets/images/Articles/bike7.webp';
    if (String(key) === 'innsikt-branding-og-produktdesign')
      return 'assets/images/Articles/memorium-branding.webp';
    if (String(key) === 'innsikt-design-for-crowdfunding')
      return 'assets/images/Articles/kalash.webp';
    return imagePool[0];
  }

  window.getArticleImageForKey = getArticleImageForKey;
})();
