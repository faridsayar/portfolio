#!/usr/bin/env node
// NOTE: Regenerates sitemap.xml from public routes (category pages, blogg, prosjekter, core hubs).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublishedCatalogProject, seoSlugForCatalog } from './lib/project-seo-slugs.mjs';
import { SITE, STATIC_HUB_ROUTES } from './lib/public-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function collectCategoryRoutes() {
  const dir = path.join(root, 'category');
  const routes = [];
  for (const category of fs.readdirSync(dir)) {
    const catDir = path.join(dir, category);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const region of fs.readdirSync(catDir)) {
      if (region.endsWith('.html')) {
        routes.push(`/category/${category}/${region.replace(/\.html$/, '')}`);
      }
    }
  }
  return routes.sort();
}

function collectBloggRoutes() {
  const routes = ['/blogg'];
  for (const name of fs.readdirSync(root)) {
    const m = name.match(/^blogg-([a-z0-9-]+)\.html$/);
    if (m) routes.push(`/blogg/${m[1]}`);
  }
  return routes.sort();
}

function collectProsjektRoutes() {
  const manifestRaw = fs.readFileSync(path.join(root, 'assets/data/projects-manifest.js'), 'utf8');
  const manifest = JSON.parse(manifestRaw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, ''));
  const routes = ['/prosjekter'];
  for (const p of manifest.projects) {
    if (!isPublishedCatalogProject(p)) continue;
    routes.push(`/prosjekter/${seoSlugForCatalog(p.slug)}`);
  }
  return routes;
}

const all = [
  ...new Set([
    ...STATIC_HUB_ROUTES,
    ...collectProsjektRoutes(),
    ...collectBloggRoutes(),
    ...collectCategoryRoutes(),
  ]),
].sort((a, b) => a.localeCompare(b));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- NOTE: XML sitemap for Google/Bing/AI crawlers: one entry per public route only.
     Project URLs: /prosjekter/{slug}. Blogg: /blogg/{slug} (stubs blogg-*.html).
     /application-form = kontaktform. /tjenester-prosess = tjenester og prosess.
     /gallery retired (301 → home). Regenerate: pnpm generate:sitemap -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((route) => `  <url><loc>${SITE}${route}</loc></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), `${xml}\n`);
console.log(`Wrote sitemap.xml with ${all.length} URLs.`);
