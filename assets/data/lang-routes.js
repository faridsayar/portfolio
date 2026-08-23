// NOTE: Bidirectional NO ↔ EN public path pairs for the language switch.
// Keys and values are extensionless canonical paths (trailing slash only on homes).
window.LANG_ROUTES = {
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
  // NOTE: Existing EN service landings pair with the NO services hub until dedicated EN hub pages are primary.
  '/en/product-rendering': '/tjenester-prosess',
  '/en/cad-modeling': '/tjenester-prosess',
  '/en/product-animation': '/tjenester-prosess',
};
