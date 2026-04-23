// NOTE: Shared article template renderer; one layout reused across all article pages.
function renderSharedArticle() {
  const root = document.querySelector('[data-article-layout]');
  if (!root) return;

  const path = window.location.pathname.split('/').pop() || 'article-1.html';
  const key = path.replace('.html', '');
  const dataScript = document.getElementById('article-content');
  if (!dataScript) return;

  let article;
  try {
    article = JSON.parse(dataScript.textContent || '{}');
  } catch (_error) {
    return;
  }
  if (!article || typeof article.title !== 'string' || !Array.isArray(article.blocks)) return;
  const titleEl = root.querySelector('[data-article-title]');
  const currentBreadcrumbEl = root.querySelector('[data-article-breadcrumb-current]');
  const heroImageEl = root.querySelector('[data-article-hero-image]');
  const bodyEl = root.querySelector('[data-article-body]');

  if (titleEl) titleEl.textContent = article.title;
  if (currentBreadcrumbEl) currentBreadcrumbEl.textContent = article.title;
  if (heroImageEl) {
    const getImage = window.getArticleImageForKey;
    heroImageEl.src =
      typeof getImage === 'function' ? getImage(key) : 'assets/images/Articles/USV.png';
    heroImageEl.alt = typeof article.heroAlt === 'string' ? article.heroAlt : article.title;
  }
  if (bodyEl) {
    bodyEl.innerHTML = article.blocks
      .map((block) =>
        block.type === 'h2'
          ? `<h2 class="article-row__title">${block.text}</h2>`
          : `<p>${block.text}</p>`
      )
      .join('');
  }
}

renderSharedArticle();
document.addEventListener('components:ready', renderSharedArticle);
