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
    const n = articleKeyToNumber(key);
    const index = (((n - 1) % imagePool.length) + imagePool.length) % imagePool.length;
    return imagePool[index];
  }

  window.getArticleImageForKey = getArticleImageForKey;
})();
