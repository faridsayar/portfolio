// NOTE: Shared navigation component rendered on every page.
function renderSharedNav() {
  const navRoots = Array.from(document.querySelectorAll('nav.side-nav[data-mobile-nav]'));
  if (navRoots.length === 0) return;

  const path = window.location.pathname.split('/').pop() || 'index.html';
  const fullPath = window.location.pathname || '';
  const rootPrefix = fullPath.includes('/category/') ? '../../' : '';
  const isInsightsPage =
    path === 'innsikt.html' ||
    path.startsWith('article-') ||
    path.startsWith('innsikt-') ||
    path === 'article-template.html';
  const isProjectPage =
    path === 'advanced-project.html' || path.startsWith('project-') || path.startsWith('prosjekt-');

  const items = [
    { href: `${rootPrefix}index.html`, label: 'Hjem', current: path === 'index.html' },
    { href: `${rootPrefix}oss.html`, label: 'Oss', current: path === 'oss.html' },
    {
      href: `${rootPrefix}advanced-project.html`,
      label: 'Prosjekter',
      current: isProjectPage,
    },
    { href: `${rootPrefix}innsikt.html`, label: 'Innsikt', current: isInsightsPage },
  ];

  const linksMarkup = items
    .map(
      (item) =>
        `<a class="side-nav__link" href="${item.href}"${item.current ? ' aria-current="page"' : ''}>${item.label}</a>`
    )
    .join('');

  const footerHrefByKey = {
    projects: `${rootPrefix}advanced-project.html`,
    categories: `${rootPrefix}category/design/norge.html`,
    insights: `${rootPrefix}innsikt.html`,
    about: `${rootPrefix}oss.html`,
    application: `${rootPrefix}index.html#application-form`,
    pricing: `${rootPrefix}prisestimat.html`,
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
        <img class="side-nav__toggle-icon" src="${rootPrefix}assets/triangle.svg" alt="" aria-hidden="true" />
      </button>
      <div class="side-nav__content" id="side-nav-content" data-mobile-nav-content>
        ${linksMarkup}
        <div class="side-nav__divider" aria-hidden="true"></div>
        <label class="lang-switch" for="lang-switch">
          <span class="lang-switch__label">NO</span>
          <input class="lang-switch__input" type="checkbox" id="lang-switch" />
          <span class="lang-switch__track" aria-hidden="true">
            <span class="lang-switch__thumb" aria-hidden="true"></span>
          </span>
          <span class="lang-switch__label">EN</span>
        </label>
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

  // NOTE: Keep shared footer links working from both root pages and nested category pages.
  const footerLinks = Array.from(document.querySelectorAll('[data-footer-link]'));
  footerLinks.forEach((link) => {
    const key = link.getAttribute('data-footer-link');
    if (!key || !footerHrefByKey[key]) return;
    link.setAttribute('href', footerHrefByKey[key]);
  });
}

renderSharedNav();
document.addEventListener('components:ready', renderSharedNav);
