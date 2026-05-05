// NOTE: Sync insights card thumbnails with shared article hero image mapping.
(function syncInnsiktThumbnails() {
  const getImage = window.getArticleImageForKey;
  if (typeof getImage !== 'function') return;

  const links = Array.from(document.querySelectorAll('.article-card__link'));
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    let key = href.replace(/^\//, '').replace('.html', '');
    if (key.startsWith('innsikt/')) {
      key = `innsikt-${key.slice('innsikt/'.length)}`;
    }
    const img = link.querySelector('.article-card__img');
    if (!img) return;
    img.src = getImage(key);
  });
})();
