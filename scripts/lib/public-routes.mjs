// NOTE: Shared public hub routes used by sitemap and AI/crawler discovery files.

export const SITE = 'https://formaa.no';

/** Core indexable pages (extensionless public URLs). */
export const STATIC_HUB_ROUTES = [
  '/',
  '/tjenester-prosess',
  '/oss',
  '/prisestimat',
  '/application-form',
  '/bli-med',
  '/en/product-rendering',
  '/en/cad-modeling',
  '/en/product-animation',
];

/** Primary category hubs for LLM/AI discovery (Norge-level). */
export const LLMS_CATEGORY_HUBS = [
  '/category/visualisering/norge',
  '/category/3d-modelering/norge',
  '/category/prototyping/norge',
  '/category/produktdesign/norge',
  '/category/industridesign/norge',
  '/category/konseptutvikling/norge',
  '/category/cad-modelering/norge',
  '/category/teknisk-tegning/norge',
  '/category/design/norge',
];

/** Key Innsikt articles aligned with produktutvikling / 3D-visualisering positioning. */
export const LLMS_INNSIKT_HUBS = [
  '/innsikt',
  '/innsikt/hvordan-lage-prototype',
  '/innsikt/fra-oppfinnelse-til-produksjon',
  '/innsikt/produktutvikling-hardware-startup',
  '/innsikt/hva-er-industridesign',
  '/innsikt/hvordan-design-sparer-penger',
];

/** Retired public routes (301 targets documented for crawlers). */
export const RETIRED_ROUTES = ['/gallery', '/designstudio-oslo'];
