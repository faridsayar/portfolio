#!/usr/bin/env node
// NOTE: Writes root prosjekt-{slug}.html and blogg-{slug}.html stubs for GitHub Pages legacy URLs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderLegacyRedirectStubHtml } from './lib/legacy-redirect-stub.mjs';
import { isPublishedCatalogProject, seoSlugForCatalog } from './lib/project-seo-slugs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadProjectsManifest() {
  const raw = fs.readFileSync(path.join(root, 'assets/data/projects-manifest.js'), 'utf8');
  return JSON.parse(raw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, ''));
}

function collectBloggSlugs() {
  const bloggDir = path.join(root, 'blogg');
  if (!fs.existsSync(bloggDir)) return [];

  return fs
    .readdirSync(bloggDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules')
    .filter((entry) => fs.existsSync(path.join(bloggDir, entry.name, 'index.html')))
    .map((entry) => entry.name)
    .sort();
}

function collectPublishedProjectSeoSlugs(manifest) {
  return manifest.projects
    .filter(isPublishedCatalogProject)
    .map((project) => seoSlugForCatalog(project.slug))
    .sort();
}

function writeStub(filename, targetPath) {
  const filePath = path.join(root, filename);
  fs.writeFileSync(filePath, renderLegacyRedirectStubHtml({ targetPath }), 'utf8');
  console.log(`Wrote ${filename} → ${targetPath}`);
}

function removeStaleStubs(prefix, activeSlugs) {
  const active = new Set(activeSlugs.map((slug) => `${prefix}${slug}.html`));

  for (const name of fs.readdirSync(root)) {
    if (!name.startsWith(prefix) || !name.endsWith('.html')) continue;
    if (active.has(name)) continue;
    fs.unlinkSync(path.join(root, name));
    console.log(`Removed stale ${name}`);
  }
}

function main() {
  const manifest = loadProjectsManifest();
  const projectSlugs = collectPublishedProjectSeoSlugs(manifest);
  const bloggSlugs = collectBloggSlugs();

  for (const seoSlug of projectSlugs) {
    writeStub(`prosjekt-${seoSlug}.html`, `/prosjekter/${seoSlug}`);
  }

  for (const slug of bloggSlugs) {
    writeStub(`blogg-${slug}.html`, `/blogg/${slug}`);
  }

  removeStaleStubs('prosjekt-', projectSlugs);
  removeStaleStubs('blogg-', bloggSlugs);

  console.log(`Done (${projectSlugs.length} project stubs, ${bloggSlugs.length} blogg stubs).`);
}

main();
