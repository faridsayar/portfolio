// NOTE: Shared navigation component rendered on every page.

/** NOTE: Canonical public path for LANG_ROUTES lookup (extensionless, home = `/` or `/en/`). */
function getLangRoutePath() {
  let pathname = window.location.pathname || '/';
  if (pathname.endsWith('.html')) {
    pathname = pathname.slice(0, -'.html'.length);
  }
  if (pathname === '/en/index' || pathname === '/en') {
    return '/en/';
  }
  if (pathname === '/index' || pathname === '') {
    return '/';
  }
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

/** NOTE: Resolve NO ↔ EN target from LANG_ROUTES; fallback hubs when no pair exists. */
function resolveLangSwitchHref(wantEnglish) {
  const currentPath = getLangRoutePath();
  const pair = window.LANG_ROUTES && window.LANG_ROUTES[currentPath];
  if (pair) return pair;
  return wantEnglish ? '/en/' : '/';
}

/** NOTE: Load shared route map once so every page can resolve language pairs without per-HTML script tags. */
function ensureLangRoutes() {
  if (window.LANG_ROUTES) return Promise.resolve();
  if (window.__langRoutesPromise) return window.__langRoutesPromise;

  window.__langRoutesPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = '/assets/data/lang-routes.js?v=1';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

  return window.__langRoutesPromise;
}

/** NOTE: Side-nav items — keep aligned with scripts/lib/shared-nav-markup.mjs. */
function getSharedNavItems(segments, path) {
  const isEnglish = segments[0] === 'en';

  if (isEnglish) {
    const enSlug = segments[1] || '';
    const isEnHome = segments.length === 1;
    const isEnServices =
      enSlug === 'services' ||
      enSlug === 'product-rendering' ||
      enSlug === 'cad-modeling' ||
      enSlug === 'product-animation';

    return [
      { href: '/en/', label: 'Home', current: isEnHome },
      { href: '/en/about', label: 'About', current: enSlug === 'about' },
      { href: '/en/services', label: 'Services', current: isEnServices },
      { href: '/en/projects', label: 'Projects', current: enSlug === 'projects' },
      { href: '/en/contact', label: 'Contact', current: enSlug === 'contact' },
    ];
  }

  const isApplicationFormPage =
    path === 'application-form.html' ||
    (segments.length === 1 && segments[0] === 'application-form');

  const isProjectPage =
    segments[0] === 'prosjekter' ||
    path === 'advanced-project.html' ||
    path.startsWith('project-') ||
    path.startsWith('prosjekt-');

  const isBloggPage = path === 'blogg.html' || path.startsWith('blogg-') || segments[0] === 'blogg';

  const isArrangementPage =
    path === 'arrangement.html' || (segments.length === 1 && segments[0] === 'arrangement');

  const isSkaperverkstedPage =
    path === 'formaa-skaperverksted.html' ||
    (segments.length === 1 && segments[0] === 'formaa-skaperverksted');

  return [
    { href: '/', label: 'Hjem', current: segments.length === 0 },
    {
      href: '/oss',
      label: 'Oss',
      current: path === 'oss.html' || (segments.length === 1 && segments[0] === 'oss'),
    },
    {
      href: '/tjenester-prosess',
      label: 'Tjenester',
      current:
        path === 'tjenester-prosess.html' ||
        (segments.length === 1 && segments[0] === 'tjenester-prosess'),
    },
    { href: '/prosjekter', label: 'Prosjekter', current: isProjectPage },
    { href: '/blogg', label: 'Blogg', current: isBloggPage },
    {
      href: '/arrangement',
      label: 'Arrangement',
      current: isArrangementPage,
    },
    {
      href: '/formaa-skaperverksted',
      label: 'Skaperverksted',
      current: isSkaperverkstedPage,
    },
    {
      href: '/application-form',
      label: 'Kontakt',
      current: isApplicationFormPage,
    },
  ];
}

function renderSharedNav() {
  const navRoots = Array.from(document.querySelectorAll('nav.side-nav[data-mobile-nav]'));
  if (navRoots.length === 0) return;

  const rawPath = window.location.pathname.replace(/\/+$/, '');
  const segments = rawPath.split('/').filter(Boolean);
  const path = segments.length ? segments[segments.length - 1] : '';
  const isEnglish = segments[0] === 'en';

  // NOTE: Extensionless hrefs match sitemap/canonical URLs; GitHub Pages and Apache both resolve them to *.html files.
  const items = getSharedNavItems(segments, path);

  const linksMarkup = items
    .map(
      (item) =>
        `<a class="side-nav__link" href="${item.href}"${item.current ? ' aria-current="page"' : ''}>${item.label}</a>`
    )
    .join('');

  // NOTE: Language toggle UI in the side nav (NO ↔ EN). Keep markup aligned with scripts/lib/shared-nav-markup.mjs.
  const langSwitchMarkup = `
        <div class="side-nav__divider" aria-hidden="true"></div>
        <label class="lang-switch" for="lang-switch">
          <span class="lang-switch__label">NO</span>
          <input class="lang-switch__input" type="checkbox" id="lang-switch" />
          <span class="lang-switch__track" aria-hidden="true">
            <span class="lang-switch__thumb" aria-hidden="true"></span>
          </span>
          <span class="lang-switch__label">EN</span>
        </label>`;

  const navAriaLabel = isEnglish ? 'Navigation' : 'Navigasjon';
  const openMenuLabel = isEnglish ? 'Open menu' : 'Utvid meny';
  const closeMenuLabel = isEnglish ? 'Close menu' : 'Lukk meny';

  // NOTE: Root-absolute extensionless paths match public canonical URLs in sitemap.xml.
  const footerHrefByKey = isEnglish
    ? {
        home: '/en/',
        about: '/en/about',
        services: '/en/services',
        projects: '/en/projects',
        application: '/en/contact',
        'product-rendering': '/en/product-rendering',
        'cad-modeling': '/en/cad-modeling',
        'product-animation': '/en/product-animation',
      }
    : {
        projects: '/prosjekter',
        categories: '/category/industridesign/norge',
        insights: '/blogg',
        'tjenester-prosess': '/tjenester-prosess',
        about: '/oss',
        arrangement: '/arrangement',
        skaperverksted: '/formaa-skaperverksted',
        application: '/application-form',
        pricing: '/prisestimat',
      };

  navRoots.forEach((nav) => {
    if (nav.dataset.sharedNavHandled === 'true') return;
    nav.dataset.sharedNavHandled = 'true';
    nav.setAttribute('aria-label', navAriaLabel);

    // NOTE: Build-inlined nav already has links; only inject when components-loader left an empty shell.
    const hasLinks = nav.querySelector('.side-nav__link');
    if (!hasLinks) {
      nav.innerHTML = `
      <button
        class="side-nav__toggle"
        type="button"
        aria-label="${openMenuLabel}"
        aria-expanded="false"
        aria-controls="side-nav-content"
        data-mobile-nav-toggle
      >
        <img class="side-nav__toggle-icon" src="/assets/triangle.svg" alt="" aria-hidden="true" />
      </button>
      <div class="side-nav__content" id="side-nav-content" data-mobile-nav-content>
        ${linksMarkup}
        ${langSwitchMarkup}
      </div>
    `;
    } else if (isEnglish) {
      // NOTE: Replace any build-inlined NO links so EN pages always show the English MVP nav.
      const navContent = nav.querySelector('[data-mobile-nav-content]');
      if (navContent) {
        navContent.querySelectorAll('.side-nav__link').forEach((link) => link.remove());
        const divider = navContent.querySelector('.side-nav__divider');
        if (divider) divider.insertAdjacentHTML('beforebegin', linksMarkup);
        else navContent.insertAdjacentHTML('afterbegin', linksMarkup);
      }
    }

    // NOTE: Older build-inlined navs omit the language switch — append it so the control stays visible.
    const navContent = nav.querySelector('[data-mobile-nav-content]');
    if (navContent && !navContent.querySelector('.lang-switch')) {
      navContent.insertAdjacentHTML('beforeend', langSwitchMarkup);
    }

    // NOTE: Reflect current locale and jump via LANG_ROUTES (see assets/data/lang-routes.js).
    const langInput = nav.querySelector('#lang-switch');
    if (langInput && langInput.dataset.langSwitchBound !== 'true') {
      langInput.dataset.langSwitchBound = 'true';
      langInput.checked = isEnglish;
      langInput.setAttribute('aria-label', isEnglish ? 'Switch to Norwegian' : 'Switch to English');
      langInput.addEventListener('change', () => {
        window.location.href = resolveLangSwitchHref(langInput.checked);
      });
    }

    const toggle = nav.querySelector('[data-mobile-nav-toggle]');
    if (!toggle) return;

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', openMenuLabel);
    };

    const openMenu = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', closeMenuLabel);
    };

    toggle.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  });

  // NOTE: Keep shared footer hrefs aligned with on-disk HTML files for local preview.
  const footerLinks = Array.from(document.querySelectorAll('[data-footer-link]'));
  footerLinks.forEach((link) => {
    const key = link.getAttribute('data-footer-link');
    if (!key || !footerHrefByKey[key]) return;
    link.setAttribute('href', footerHrefByKey[key]);
  });
}

function bootstrapSharedNav() {
  ensureLangRoutes().then(renderSharedNav);
}

bootstrapSharedNav();
document.addEventListener('components:ready', bootstrapSharedNav);
