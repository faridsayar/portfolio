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

function renderSharedArticle() {
  const root = document.querySelector('[data-article-layout]');
  if (!root) return;

  const pathname = window.location.pathname.replace(/\/+$/, '');
  const path = pathname.split('/').pop() || 'innsikt-hva-er-industridesign.html';
  const fileStem = path.replace('.html', '');
  // NOTE: Article files are innsikt-{slug}.html at repo root; hrefs use that shape for static local servers.
  const key = fileStem.startsWith('innsikt-') ? fileStem : `innsikt-${fileStem}`;
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
      typeof getImage === 'function' ? getImage(key) : 'assets/images/Articles/usv.png';
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
    } else {
      const prevIndex = (currentIndex - 1 + articleOrder.length) % articleOrder.length;
      const nextIndex = (currentIndex + 1) % articleOrder.length;
      prevLinkEl.href = `/${articleOrder[prevIndex]}.html`;
      nextLinkEl.href = `/${articleOrder[nextIndex]}.html`;
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
