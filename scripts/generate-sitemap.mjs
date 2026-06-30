#!/usr/bin/env node
// NOTE: Regenerates sitemap.xml from public routes (category pages, blogg, prosjekter, core hubs).
// Each URL includes lastmod (source file mtime), changefreq, and priority for crawler hints.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublishedCatalogProject, seoSlugForCatalog } from './lib/project-seo-slugs.mjs';
import { SITE, STATIC_HUB_ROUTES } from './lib/public-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Maps a public route to its on-disk HTML source for lastmod. */
function routeToSourceFile(route) {
  if (route === '/') return path.join(root, 'index.html');
  if (route === '/blogg') return path.join(root, 'blogg', 'index.html');
  if (route.startsWith('/blogg/')) {
    const slug = route.slice('/blogg/'.length);
    const nested = path.join(root, 'blogg', slug, 'index.html');
    if (fs.existsSync(nested)) return nested;
    return path.join(root, `blogg-${slug}.html`);
  }
  if (route === '/prosjekter') return path.join(root, 'prosjekter', 'index.html');
  if (route.startsWith('/prosjekter/')) {
    const slug = route.slice('/prosjekter/'.length);
    return path.join(root, 'prosjekter', slug, 'index.html');
  }
  if (route.startsWith('/category/')) {
    const [category, region] = route.slice('/category/'.length).split('/');
    return path.join(root, 'category', category, `${region}.html`);
  }
  if (route.startsWith('/en/')) return path.join(root, `${route.slice(1)}.html`);
  return path.join(root, `${route.slice(1)}.html`);
}

/** ISO date (YYYY-MM-DD) from file mtime for sitemap lastmod. */
function lastmodForRoute(route) {
  const file = routeToSourceFile(route);
  if (!fs.existsSync(file)) return null;
  return new Date(fs.statSync(file).mtimeMs).toISOString().slice(0, 10);
}

/** Crawler hints by route type (changefreq/priority are optional but help recrawl scheduling). */
function sitemapHints(route) {
  if (route === '/') return { changefreq: 'weekly', priority: '1.0' };
  if (['/tjenester-prosess', '/prosjekter', '/blogg', '/oss'].includes(route)) {
    return { changefreq: 'weekly', priority: '0.9' };
  }
  if (route.startsWith('/blogg/')) return { changefreq: 'monthly', priority: '0.7' };
  if (route.startsWith('/prosjekter/')) return { changefreq: 'monthly', priority: '0.7' };
  if (route.startsWith('/category/')) {
    const region = route.split('/').pop();
    if (region === 'norge') return { changefreq: 'monthly', priority: '0.6' };
    return { changefreq: 'yearly', priority: '0.5' };
  }
  if (route.startsWith('/en/')) return { changefreq: 'monthly', priority: '0.6' };
  return { changefreq: 'monthly', priority: '0.5' };
}

function formatUrlEntry(route) {
  const { changefreq, priority } = sitemapHints(route);
  const lastmod = lastmodForRoute(route);
  const lines = [`    <loc>${SITE}${route}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`, `    <priority>${priority}</priority>`);
  return `  <url>\n${lines.join('\n')}\n  </url>`;
}

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
     /application-form = kontaktform. /arrangement = event hub (skisse- og idéworkshop).
     /tjenester-prosess = tjenester og prosess.
     /gallery retired (301 → home). lastmod from source HTML mtime. Regenerate: pnpm generate:sitemap -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((route) => formatUrlEntry(route)).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), `${xml}\n`);
console.log(`Wrote sitemap.xml with ${all.length} URLs.`);
