// NOTE: Shared article template renderer; one layout reused across all article pages.
function renderSharedArticle() {
  const root = document.querySelector('[data-article-layout]');
  if (!root) return;

  const path = window.location.pathname.split('/').pop() || 'innsikt-hva-er-industridesign.html';
  const key = path.replace('.html', '');
  const articleOrder = [
    'innsikt-hva-er-industridesign',
    'innsikt-ux-er-ikke-produktdesign',
    'innsikt-hvem-trenger-design',
    'innsikt-hvordan-design-sparer-penger',
    'innsikt-branding-og-produktdesign',
    'innsikt-design-for-crowdfunding',
  ];
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
  const navWrapEl = root.querySelector('[data-article-nav]');
  const prevLinkEl = root.querySelector('[data-article-nav-prev]');
  const nextLinkEl = root.querySelector('[data-article-nav-next]');

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

  // NOTE: Keeps previous/next article links synchronized with the current article URL.
  if (navWrapEl && prevLinkEl && nextLinkEl) {
    const currentIndex = articleOrder.indexOf(key);
    if (currentIndex === -1) {
      navWrapEl.style.display = 'none';
      return;
    }

    const prevIndex = (currentIndex - 1 + articleOrder.length) % articleOrder.length;
    const nextIndex = (currentIndex + 1) % articleOrder.length;
    prevLinkEl.href = `${articleOrder[prevIndex]}.html`;
    nextLinkEl.href = `${articleOrder[nextIndex]}.html`;
  }
}

renderSharedArticle();
document.addEventListener('components:ready', renderSharedArticle);
