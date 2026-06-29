// NOTE: Shared catalog sort order for homepage grid, prev/next nav, and static project page generation.

/** @type {string[]} catalog slugs in display order */
export const PREFERRED_PROJECT_ORDER = [
  'obseed',
  'undo',
  'nomos',
  'proton',
  'nordic',
  'monocopter',
  'rafaels',
  'eco-mate-closet',
  'h2o',
];

/**
 * @param {Array<{ slug: string, title: string }>} projects
 * @returns {typeof projects}
 */
export function sortProjectsByPreferredOrder(projects) {
  const orderRank = new Map(PREFERRED_PROJECT_ORDER.map((slug, index) => [slug, index]));
  return [...projects].sort((a, b) => {
    const aRank = orderRank.has(a.slug) ? orderRank.get(a.slug) : Number.MAX_SAFE_INTEGER;
    const bRank = orderRank.has(b.slug) ? orderRank.get(b.slug) : Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return a.title.localeCompare(b.title);
  });
}
