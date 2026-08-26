// NOTE: Single source for NO ↔ EN path pairs (hreflang, sitemap hubs, language switch).

export const SITE = 'https://formaa.no';

/** True translation pairs — use for hreflang and EN hub sitemap entries. */
export const HREFLANG_PAIRS = [
  { nb: '/', en: '/en/' },
  { nb: '/oss', en: '/en/about' },
  { nb: '/tjenester-prosess', en: '/en/services' },
  { nb: '/prosjekter', en: '/en/projects' },
  { nb: '/application-form', en: '/en/contact' },
];

/** Public route → repo HTML source (for hreflang injection). */
export const HREFLANG_SOURCE_FILES = {
  '/': 'index.html',
  '/oss': 'oss.html',
  '/tjenester-prosess': 'tjenester-prosess.html',
  '/prosjekter': 'prosjekter/index.html',
  '/application-form': 'application-form.html',
  '/en/': 'en/index.html',
  '/en/about': 'en/about.html',
  '/en/services': 'en/services.html',
  '/en/projects': 'en/projects.html',
  '/en/contact': 'en/contact.html',
};

/** Bidirectional paths for runtime language switch (includes EN service landings). */
export const NAV_LANG_ROUTES = {
  '/': '/en/',
  '/oss': '/en/about',
  '/tjenester-prosess': '/en/services',
  '/prosjekter': '/en/projects',
  '/application-form': '/en/contact',
  '/en': '/',
  '/en/': '/',
  '/en/about': '/oss',
  '/en/services': '/tjenester-prosess',
  '/en/projects': '/prosjekter',
  '/en/contact': '/application-form',
  // NOTE: EN service landings pair with NO services hub (nav only — no hreflang).
  '/en/product-rendering': '/tjenester-prosess',
  '/en/cad-modeling': '/tjenester-prosess',
  '/en/product-animation': '/tjenester-prosess',
};

export function normalizePublicPath(route) {
  if (route === '/en') return '/en/';
  return route;
}

export function hreflangBlockForRoute(route) {
  const path = normalizePublicPath(route);
  const pair = HREFLANG_PAIRS.find((p) => p.nb === path || p.en === path);
  if (!pair) return null;

  return [
    `<link rel="alternate" hreflang="nb" href="${SITE}${pair.nb}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}${pair.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}${pair.nb}" />`,
  ].join('\n    ');
}

/** EN hub routes for sitemap (paired translations only). */
export const EN_HUB_ROUTES = HREFLANG_PAIRS.map((p) => p.en);
