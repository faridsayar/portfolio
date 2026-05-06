// NOTE: Shared navigation component rendered on every page.
function renderSharedNav() {
  const navRoots = Array.from(document.querySelectorAll('nav.side-nav[data-mobile-nav]'));
  if (navRoots.length === 0) return;

  const rawPath = window.location.pathname.replace(/\/+$/, '');
  const segments = rawPath.split('/').filter(Boolean);
  const path = segments.length ? segments[segments.length - 1] : '';

  const isInsightsPage =
    segments[0] === 'innsikt' ||
    path === 'innsikt.html' ||
    path.startsWith('innsikt-') ||
    path.startsWith('article-') ||
    path === 'article-template.html';

  const isProjectPage =
    segments[0] === 'prosjekter' ||
    path === 'advanced-project.html' ||
    path.startsWith('project-') ||
    path.startsWith('prosjekt-');

  // NOTE: Nav uses real *.html paths so python http.server and other static hosts work; production Apache 301s to extensionless URLs.
  const items = [
    { href: '/', label: 'Hjem', current: segments.length === 0 },
    {
      href: '/oss.html',
      label: 'Oss',
      current: path === 'oss.html' || (segments.length === 1 && segments[0] === 'oss'),
    },
    { href: '/advanced-project.html', label: 'Prosjekter', current: isProjectPage },
    { href: '/innsikt.html', label: 'Innsikt', current: isInsightsPage },
  ];

  const linksMarkup = items
    .map(
      (item) =>
        `<a class="side-nav__link" href="${item.href}"${item.current ? ' aria-current="page"' : ''}>${item.label}</a>`
    )
    .join('');

  // NOTE: Root-absolute *.html paths work on static local servers; live site rewrites still canonicalize without extension.
  const footerHrefByKey = {
    projects: '/advanced-project.html',
    categories: '/category/design/norge.html',
    insights: '/innsikt.html',
    gallery: '/gallery.html',
    'designstudio-oslo': '/designstudio-oslo.html',
    about: '/oss.html',
    application: '/#application-form',
    pricing: '/prisestimat.html',
  };

  navRoots.forEach((nav) => {
    nav.dataset.sharedNavHandled = 'true';
    nav.innerHTML = `
      <button
        class="side-nav__toggle"
        type="button"
        aria-label="Utvid meny"
        aria-expanded="false"
        aria-controls="side-nav-content"
        data-mobile-nav-toggle
      >
        <img class="side-nav__toggle-icon" src="/assets/triangle.svg" alt="" aria-hidden="true" />
      </button>
      <div class="side-nav__content" id="side-nav-content" data-mobile-nav-content>
        ${linksMarkup}
      </div>
    `;

    const toggle = nav.querySelector('[data-mobile-nav-toggle]');
    if (!toggle) return;

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Utvid meny');
    };

    const openMenu = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Lukk meny');
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

renderSharedNav();
document.addEventListener('components:ready', renderSharedNav);
