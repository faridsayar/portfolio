// NOTE: Maps catalog project slugs (manifest) to public /prosjekter/{seo-slug} URL segments.

/** @type {Record<string, string>} catalog slug → SEO URL slug */
export const CATALOG_TO_SEO_SLUG = {
  obseed: 'obseed-custom-8-string-guitar',
  undo: 'undo-desertification',
  nomos: 'nomos-branding',
  proton: 'proton-headphones',
  nordic: 'nordic-restaurant-branding',
  monocopter: 'monocopter-drone',
  rafaels: 'rafaels-ren-melk',
  'eco-mate-closet': 'eco-mate-closet',
  h2o: 'h2o-bottle-pedometer',
};

/** @type {Record<string, string>} SEO URL slug → catalog slug (for meta sync lookups) */
export const SEO_SLUG_TO_CATALOG = Object.fromEntries(
  Object.entries(CATALOG_TO_SEO_SLUG).map(([catalog, seo]) => [seo, catalog])
);

export function seoSlugForCatalog(catalogSlug) {
  return CATALOG_TO_SEO_SLUG[catalogSlug] || catalogSlug;
}

export function catalogSlugForSeo(seoSlug) {
  return SEO_SLUG_TO_CATALOG[seoSlug] || seoSlug;
}
