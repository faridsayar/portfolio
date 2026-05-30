#!/usr/bin/env node
// NOTE: Regenerates sitemap.xml from public routes (category pages, innsikt, prosjekter, core hubs).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://formaa.no';

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

function collectInnsiktRoutes() {
  const routes = ['/innsikt'];
  for (const name of fs.readdirSync(root)) {
    const m = name.match(/^innsikt-([a-z0-9-]+)\.html$/);
    if (m) routes.push(`/innsikt/${m[1]}`);
  }
  return routes.sort();
}

function collectProsjektRoutes() {
  const manifestRaw = fs.readFileSync(path.join(root, 'assets/data/projects-manifest.js'), 'utf8');
  const manifest = JSON.parse(manifestRaw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, ''));
  const seoByCatalog = {
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
  const routes = ['/prosjekter'];
  for (const p of manifest.projects) {
    const seo = seoByCatalog[p.slug] || p.slug;
    routes.push(`/prosjekter/${seo}`);
  }
  return routes;
}

const staticRoutes = [
  '/',
  '/designstudio-oslo',
  '/oss',
  '/prisestimat',
  '/application-form',
  '/bli-med',
  '/en/product-rendering',
  '/en/cad-modeling',
  '/en/product-animation',
];

const all = [
  ...new Set([
    ...staticRoutes,
    ...collectProsjektRoutes(),
    ...collectInnsiktRoutes(),
    ...collectCategoryRoutes(),
  ]),
].sort((a, b) => a.localeCompare(b));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- NOTE: XML sitemap for Google/Bing: one entry per public route only. Project URLs use
     /prosjekter/{slug}. Innsikt hub + articles use /innsikt/{slug} (10 articles; stubs innsikt-*.html).
     /application-form is the design-samtale kontaktform. Includes /en/* intent landings.
     /gallery is retired (301 → home). Static assets are intentionally excluded.
     Regenerate: pnpm generate:sitemap -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((route) => `  <url><loc>${SITE}${route}</loc></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), `${xml}\n`);
console.log(`Wrote sitemap.xml with ${all.length} URLs.`);
