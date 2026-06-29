// NOTE: Shared side-nav link logic and HTML builder for build-time inlining and shared-nav.js parity.

export const SIDE_NAV_BEGIN = '<!-- NOTE: BEGIN static side-nav (build-inlined for crawlers) -->';
export const SIDE_NAV_END = '<!-- NOTE: END static side-nav -->';

export const SITE_FOOTER_BEGIN =
  '<!-- NOTE: BEGIN static site-footer (build-inlined for crawlers) -->';
export const SITE_FOOTER_END = '<!-- NOTE: END static site-footer -->';

export const ARTICLE_LAYOUT_BEGIN =
  '<!-- NOTE: BEGIN static article-layout (build-inlined for crawlers) -->';
export const ARTICLE_LAYOUT_END = '<!-- NOTE: END static article-layout -->';

/** NOTE: Maps an on-disk HTML file to the extensionless public URL path. */
export function publicPathFromFile(root, filePath) {
  const rel = pathRelative(root, filePath);
  if (rel === 'index.html') return '/';

  let urlPath = rel;
  if (urlPath.endsWith('/index.html')) {
    urlPath = urlPath.slice(0, -'/index.html'.length);
  } else if (urlPath.endsWith('.html')) {
    urlPath = urlPath.slice(0, -'.html'.length);
  }
  return `/${urlPath}`;
}

function pathRelative(root, filePath) {
  return filePath.replace(`${root}/`, '').replace(/\\/g, '/');
}

/** NOTE: Parses a public URL path the same way shared-nav.js reads window.location.pathname. */
export function getNavContextFromPublicPath(publicPath) {
  const rawPath = publicPath.replace(/\/+$/, '') || '/';
  const segments = rawPath === '/' ? [] : rawPath.slice(1).split('/').filter(Boolean);
  const path = segments.length ? segments[segments.length - 1] : '';
  return { segments, path };
}

/** NOTE: Main nav items with current-page flags — keep aligned with shared-nav.js. */
export function getNavItems({ segments, path }) {
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
      href: '/application-form',
      label: 'Kontakt',
      current: isApplicationFormPage,
    },
  ];
}

/** NOTE: Full side-nav HTML with links for a page's public URL path. */
export function buildSideNavMarkup(publicPath) {
  const navContext = getNavContextFromPublicPath(publicPath);
  const items = getNavItems(navContext);

  const linksMarkup = items
    .map(
      (item) =>
        `<a class="side-nav__link" href="${item.href}"${item.current ? ' aria-current="page"' : ''}>${item.label}</a>`
    )
    .join('\n        ');

  return `${SIDE_NAV_BEGIN}
    <nav class="side-nav" aria-label="Navigasjon" data-mobile-nav data-static-nav="true">
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
    </nav>
    ${SIDE_NAV_END}`;
}

/** NOTE: Wraps site-footer component markup for build-time insertion. */
export function wrapSiteFooterMarkup(footerInnerHtml) {
  return `${SITE_FOOTER_BEGIN}
    ${footerInnerHtml.trim()}
    ${SITE_FOOTER_END}`;
}

/** NOTE: Wraps article-layout component with footer already inlined. */
export function wrapArticleLayoutMarkup(articleLayoutHtml) {
  return `${ARTICLE_LAYOUT_BEGIN}
    ${articleLayoutHtml.trim()}
    ${ARTICLE_LAYOUT_END}`;
}
