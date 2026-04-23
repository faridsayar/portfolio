// NOTE: Sync insights card thumbnails with shared article hero image mapping.
(function syncInnsiktThumbnails() {
  const getImage = window.getArticleImageForKey;
  if (typeof getImage !== 'function') return;

  const links = Array.from(document.querySelectorAll('.article-card__link[href^="article-"]'));
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const key = href.replace('.html', '');
    const img = link.querySelector('.article-card__img');
    if (!img) return;
    img.src = getImage(key);
  });
})();
