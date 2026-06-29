// NOTE: Shared public hub routes used by sitemap and AI/crawler discovery files.

export const SITE = 'https://formaa.no';

/** Core indexable pages (extensionless public URLs). */
export const STATIC_HUB_ROUTES = [
  '/',
  '/tjenester-prosess',
  '/oss',
  '/prisestimat',
  '/application-form',
  '/arrangement',
  '/karriere',
  '/en/product-rendering',
  '/en/cad-modeling',
  '/en/product-animation',
];

/** Curated hubs for ai.txt (short AI crawler companion). */
export const AI_IMPORTANT_ROUTES = [
  '/',
  '/tjenester-prosess',
  '/prosjekter',
  '/blogg',
  '/oss',
  '/prisestimat',
  '/arrangement',
  '/application-form',
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

/** Key Blogg articles aligned with produktutvikling / 3D-visualisering positioning. */
export const LLMS_BLOGG_HUBS = [
  '/blogg',
  '/blogg/hvordan-lage-prototype',
  '/blogg/fra-oppfinnelse-til-produksjon',
  '/blogg/produktutvikling-hardware-startup',
  '/blogg/hva-er-industridesign',
  '/blogg/hvordan-design-sparer-penger',
];

/** Retired public routes (301 targets documented for crawlers). */
export const RETIRED_ROUTES = ['/gallery', '/designstudio-oslo'];
