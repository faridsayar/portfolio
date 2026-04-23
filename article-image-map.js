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

  function articleKeyToNumber(key) {
    const match = String(key || '').match(/article-(\d+)/);
    if (!match) return 1;
    return Number(match[1]) || 1;
  }

  function getArticleImageForKey(key) {
    // NOTE: Keep article-1 fixed to itac image asset.
    if (String(key) === 'article-1') return 'assets/images/Articles/itac.jpg';
    // NOTE: Keep article-2 fixed to the dedicated duck image asset.
    if (String(key) === 'article-2') return 'assets/images/Articles/DUX-article2.avif';
    // NOTE: Keep article-3 fixed to product-design-image asset.
    if (String(key) === 'article-3') return 'assets/images/Articles/product-design-image.jpg';
    // NOTE: Keep article-4 fixed to bike7 image asset.
    if (String(key) === 'article-4') return 'assets/images/Articles/bike7.jpg';
    // NOTE: Keep article-5 fixed to Kalash image asset.
    if (String(key) === 'article-5') return 'assets/images/Articles/Kalash.jpg';
    const n = articleKeyToNumber(key);
    const index = (((n - 1) % imagePool.length) + imagePool.length) % imagePool.length;
    return imagePool[index];
  }

  window.getArticleImageForKey = getArticleImageForKey;
})();
