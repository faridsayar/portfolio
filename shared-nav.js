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

  const items = [
    { href: '/', label: 'Hjem', current: segments.length === 0 },
    {
      href: '/oss',
      label: 'Oss',
      current: path === 'oss.html' || (segments.length === 1 && segments[0] === 'oss'),
    },
    { href: '/prosjekter', label: 'Prosjekter', current: isProjectPage },
    { href: '/innsikt', label: 'Innsikt', current: isInsightsPage },
  ];

  const linksMarkup = items
    .map(
      (item) =>
        `<a class="side-nav__link" href="${item.href}"${item.current ? ' aria-current="page"' : ''}>${item.label}</a>`
    )
    .join('');

  // NOTE: Root-absolute hrefs match .htaccess canonical URLs from any directory depth.
  const footerHrefByKey = {
    projects: '/prosjekter',
    categories: '/category/design/norge',
    insights: '/innsikt',
    gallery: '/gallery',
    'designstudio-oslo': '/designstudio-oslo',
    about: '/oss',
    application: '/#application-form',
    pricing: '/prisestimat',
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

  // NOTE: Keep shared footer links aligned with canonical routes (see .htaccess).
  const footerLinks = Array.from(document.querySelectorAll('[data-footer-link]'));
  footerLinks.forEach((link) => {
    const key = link.getAttribute('data-footer-link');
    if (!key || !footerHrefByKey[key]) return;
    link.setAttribute('href', footerHrefByKey[key]);
  });
}

renderSharedNav();
document.addEventListener('components:ready', renderSharedNav);
