// NOTE: Shared article template renderer; one layout reused across all article pages.
function getBrowserStorageValue(storage, key) {
  try {
    return storage?.getItem(key) ?? null;
  } catch (_error) {
    return null;
  }
}

function setBrowserStorageValue(storage, key, value) {
  try {
    storage?.setItem(key, value);
    return true;
  } catch (_error) {
    return false;
  }
}

function setLikeShareStatus(statusEl, message) {
  if (!statusEl) return;
  statusEl.textContent = message;
}

// NOTE: Seed a stable browser-local starting count so each project/article can show social proof before manual likes are added.
function readLikeShareCount(storageKey) {
  const storedValue = getBrowserStorageValue(window.localStorage, storageKey);
  const parsed = Number.parseInt(storedValue || '', 10);
  if (Number.isFinite(parsed) && parsed >= 80) return parsed;

  const seededCount = Math.floor(Math.random() * (250 - 80 + 1)) + 80;
  setBrowserStorageValue(window.localStorage, storageKey, String(seededCount));
  return seededCount;
}

async function shareLikeShareUrl({ title, url, statusEl }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      setLikeShareStatus(statusEl, 'Siden ble delt.');
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setLikeShareStatus(statusEl, 'Lenken er kopiert.');
      return;
    }

    window.prompt('Kopier lenken:', url);
    setLikeShareStatus(statusEl, 'Kopier lenken fra dialogen.');
  } catch (error) {
    if (error?.name === 'AbortError') {
      setLikeShareStatus(statusEl, 'Deling avbrutt.');
      return;
    }
    setLikeShareStatus(statusEl, 'Kunne ikke dele siden akkurat nå.');
  }
}

function initializeLikeShareStrip(strip, options) {
  if (!strip || strip.dataset.likeShareInitialized === 'true') return;

  const likeButton = strip.querySelector('[data-like-share-like]');
  const countEl = strip.querySelector('[data-like-share-count]');
  const shareButton = strip.querySelector('[data-like-share-share]');
  const statusEl = strip.querySelector('[data-like-share-status]');
  if (!likeButton || !countEl || !shareButton) return;

  const {
    storageKey,
    sessionKey,
    likeLabel,
    shareLabel,
    shareTitle,
    shareUrl,
    alreadyLikedMessage,
  } = options;
  let count = readLikeShareCount(storageKey);
  let likedThisSession = getBrowserStorageValue(window.sessionStorage, sessionKey) === '1';

  const render = () => {
    countEl.textContent = `${count} likes`;
    countEl.setAttribute('aria-label', `${count} likes`);
    likeButton.setAttribute('aria-pressed', likedThisSession ? 'true' : 'false');
  };

  if (likeLabel) likeButton.setAttribute('aria-label', likeLabel);
  if (shareLabel) shareButton.setAttribute('aria-label', shareLabel);

  likeButton.addEventListener('click', () => {
    if (likedThisSession) {
      setLikeShareStatus(
        statusEl,
        alreadyLikedMessage || 'Du har allerede registrert en like i denne økten.'
      );
      return;
    }

    count += 1;
    likedThisSession = true;
    setBrowserStorageValue(window.localStorage, storageKey, String(count));
    setBrowserStorageValue(window.sessionStorage, sessionKey, '1');
    render();
    setLikeShareStatus(statusEl, 'Takk! Liken er registrert.');
  });

  shareButton.addEventListener('click', async () => {
    await shareLikeShareUrl({ title: shareTitle, url: shareUrl, statusEl });
  });

  render();
  strip.dataset.likeShareInitialized = 'true';
}

// NOTE: Semibold lead in list items — first sentence, or text before « — » / «: » when there is no period.
function formatArticleListItem(item) {
  const text = String(item);
  const sentenceMatch = text.match(/^([\s\S]*?[.!?])(\s+)([\s\S]+)$/);
  if (sentenceMatch) {
    return `<span class="article-row__list-lead">${sentenceMatch[1]}</span>${sentenceMatch[2]}${sentenceMatch[3]}`;
  }
  const clauseMatch = text.match(/^([\s\S]+?)(\s+[—:]\s+)([\s\S]+)$/);
  if (clauseMatch) {
    return `<span class="article-row__list-lead">${clauseMatch[1]}</span>${clauseMatch[2]}${clauseMatch[3]}`;
  }
  return `<span class="article-row__list-lead">${text}</span>`;
}

// NOTE: Article keys (innsikt-{slug}) map to public /innsikt/{slug} routes.
function articleKeyToHref(key) {
  const slug = String(key).replace(/^innsikt-/, '');
  return `/innsikt/${slug}`;
}

function renderSharedArticle() {
  const root = document.querySelector('[data-article-layout]');
  if (!root) return;
  const blackPlaceholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='black'/%3E%3C/svg%3E";

  const pathname = window.location.pathname.replace(/\/+$/, '');
  const path = pathname.split('/').pop() || 'innsikt-hva-er-industridesign.html';
  const fileStem = path.replace('.html', '');
  // NOTE: Article files are innsikt-{slug}.html at repo root; hrefs use that shape for static local servers.
  const key = fileStem.startsWith('innsikt-') ? fileStem : `innsikt-${fileStem}`;
  const articleOrder = [
    'innsikt-hvordan-lage-prototype',
    'innsikt-fra-oppfinnelse-til-produksjon',
    'innsikt-produktutvikling-hardware-startup',
    'innsikt-sok-stotte-innovasjon-norge',
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
    let heroSrc = typeof getImage === 'function' ? getImage(key) : blackPlaceholderImage;
    if (heroSrc && !heroSrc.startsWith('/') && !/^https?:/i.test(heroSrc)) {
      heroSrc = `/${heroSrc.replace(/^\.\//, '')}`;
    }
    heroImageEl.src = heroSrc;
    heroImageEl.alt = typeof article.heroAlt === 'string' ? article.heroAlt : article.title;
  }
  if (bodyEl) {
    // NOTE: Article blocks support headings, paragraphs, and bullet lists (`items` on `ul`).
    bodyEl.innerHTML = article.blocks
      .map((block) => {
        if (block.type === 'h2') {
          return `<h2 class="article-row__title">${block.text}</h2>`;
        }
        if (block.type === 'ul' && Array.isArray(block.items)) {
          const items = block.items
            .map((item) => `<li>${formatArticleListItem(item)}</li>`)
            .join('');
          return `<ul class="article-row__list">${items}</ul>`;
        }
        return `<p>${block.text}</p>`;
      })
      .join('');
  }

  // NOTE: Keeps previous/next article links synchronized with the current article URL.
  if (navWrapEl && prevLinkEl && nextLinkEl) {
    const currentIndex = articleOrder.indexOf(key);
    if (currentIndex === -1) {
      navWrapEl.style.display = 'none';
    } else {
      const prevIndex = (currentIndex - 1 + articleOrder.length) % articleOrder.length;
      const nextIndex = (currentIndex + 1) % articleOrder.length;
      prevLinkEl.href = articleKeyToHref(articleOrder[prevIndex]);
      nextLinkEl.href = articleKeyToHref(articleOrder[nextIndex]);
    }
  }

  const likeShareStrip = root.querySelector('[data-article-like-share] [data-like-share-strip]');
  initializeLikeShareStrip(likeShareStrip, {
    storageKey: `formaa-like-count:article:${key}`,
    sessionKey: `formaa-like-session:article:${key}`,
    likeLabel: `Lik artikkelen ${article.title}`,
    shareLabel: `Del artikkelen ${article.title}`,
    shareTitle: article.title,
    shareUrl: new URL(path, window.location.href).href,
    alreadyLikedMessage: 'Du har allerede likt denne artikkelen i denne økten.',
  });
}

renderSharedArticle();
document.addEventListener('components:ready', renderSharedArticle);
