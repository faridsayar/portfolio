#!/usr/bin/env node
// NOTE: Pre-renders prosjekter/{seo-slug}/index.html with real project content for crawlers and no-JS clients.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublishedCatalogProject, seoSlugForCatalog } from './lib/project-seo-slugs.mjs';
import { sortProjectsByPreferredOrder } from './lib/project-catalog-order.mjs';
import {
  renderProjectPageHtml,
  renderProjectsHubHtml,
  renderProjectStubHtml,
} from './lib/project-page-html.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prosjekterDir = path.join(root, 'prosjekter');

function loadProjectsManifest() {
  const raw = fs.readFileSync(path.join(root, 'assets/data/projects-manifest.js'), 'utf8');
  return JSON.parse(raw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, ''));
}

function loadNarratives() {
  return JSON.parse(
    fs.readFileSync(path.join(root, 'assets/data/project-narratives.json'), 'utf8')
  );
}

/** NOTE: Writes browser bundle for script.js narrative hydration on advanced-project.html. */
function writeProjectNarrativesJs(narratives) {
  const out = `// NOTE: Per-project problem/solution/outcome copy — generated from assets/data/project-narratives.json.
window.__PROJECT_NARRATIVES = ${JSON.stringify(narratives, null, 2)};
`;
  fs.writeFileSync(path.join(root, 'assets/data/project-narratives.js'), out);
}

function main() {
  const manifest = loadProjectsManifest();
  const narratives = loadNarratives();
  const published = sortProjectsByPreferredOrder(
    manifest.projects.filter(isPublishedCatalogProject)
  );

  writeProjectNarrativesJs(narratives);
  fs.mkdirSync(prosjekterDir, { recursive: true });

  let written = 0;

  for (let index = 0; index < published.length; index += 1) {
    const project = published[index];
    const seoSlug = seoSlugForCatalog(project.slug);
    const prevSeoSlug = seoSlugForCatalog(
      published[(index - 1 + published.length) % published.length].slug
    );
    const nextSeoSlug = seoSlugForCatalog(published[(index + 1) % published.length].slug);

    const html = renderProjectPageHtml({
      project,
      seoSlug,
      narratives,
      prevSeoSlug,
      nextSeoSlug,
    });

    const targetDir = path.join(prosjekterDir, seoSlug);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), html);
    written += 1;
    console.log(`Wrote prosjekter/${seoSlug}/index.html`);
  }

  fs.writeFileSync(
    path.join(prosjekterDir, 'index.html'),
    renderProjectsHubHtml({
      projects: published,
      seoSlugForCatalog: seoSlugForCatalog,
    })
  );
  console.log('Wrote prosjekter/index.html (projects hub)');

  for (const project of published) {
    const seoSlug = seoSlugForCatalog(project.slug);
    const stubPath = path.join(root, `prosjekt-${seoSlug}.html`);
    fs.writeFileSync(stubPath, renderProjectStubHtml({ project, seoSlug }));
    console.log(`Wrote prosjekt-${seoSlug}.html (noindex stub)`);
  }

  console.log(`Done (${written} static project pages).`);
}

main();
