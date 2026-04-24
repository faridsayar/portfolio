// NOTE: Single source of truth for article images (used by article pages + insights cards).
(function exposeArticleImageMap() {
  const imagePool = [
    'assets/images/Articles/Memorium.jpg',
    'assets/images/Articles/USV.png',
    'assets/images/Articles/itac.jpg',
    'assets/images/Articles/Kalash.jpg',
    'assets/images/Articles/serviett.jpg',
    'assets/images/Articles/ak-background-image.jpg',
  ];

  function getArticleImageForKey(key) {
    // NOTE: Maps each SEO slug to a fixed image used in shares and insight cards.
    if (String(key) === 'innsikt-hva-er-industridesign') return 'assets/images/Articles/itac.jpg';
    if (String(key) === 'innsikt-ux-er-ikke-produktdesign')
      return 'assets/images/Articles/DUX-article2.avif';
    if (String(key) === 'innsikt-hvem-trenger-design')
      return 'assets/images/Articles/product-design-image.jpg';
    if (String(key) === 'innsikt-hvordan-design-sparer-penger')
      return 'assets/images/Articles/bike7.jpg';
    if (String(key) === 'innsikt-branding-og-produktdesign')
      return 'assets/images/Articles/serviett.jpg';
    if (String(key) === 'innsikt-design-for-crowdfunding')
      return 'assets/images/Articles/Kalash.jpg';
    return imagePool[0];
  }

  window.getArticleImageForKey = getArticleImageForKey;
})();
