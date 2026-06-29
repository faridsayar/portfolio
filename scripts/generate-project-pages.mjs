#!/usr/bin/env node
// NOTE: Pre-renders prosjekter/{seo-slug}/index.html with real project content for crawlers and no-JS clients.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublishedCatalogProject, seoSlugForCatalog } from './lib/project-seo-slugs.mjs';
import { sortProjectsByPreferredOrder } from './lib/project-catalog-order.mjs';
import { renderProjectPageHtml } from './lib/project-page-html.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prosjekterDir = path.join(root, 'prosjekter');
const stubPrefix = 'prosjekt-';

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

/** NOTE: Root prosjekt-*.html stubs redirect to canonical /prosjekter/{slug}. */
function applyStubRedirect(html, redirectTarget) {
  return html
    .replace(
      /<meta\s+http-equiv="refresh"\s+content="[^"]*"\s*\/?>/i,
      `<meta http-equiv="refresh" content="0; url=${redirectTarget}" />`
    )
    .replace(/window\.location\.replace\([^)]+\)/, `window.location.replace('${redirectTarget}')`);
}

function writeProsjekterListingRedirect() {
  const listingHtml = `<!doctype html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Prosjekter | Formaa</title>
    <meta
      name="description"
      content="Alle prosjekter fra Formaa — industridesign og produktdesign fra konsept til prototype og produksjon."
    />
    <link rel="canonical" href="https://formaa.no/prosjekter" />
    <meta http-equiv="refresh" content="0; url=../advanced-project.html" />
    <script>
      window.location.replace('../advanced-project.html');
    </script>
  </head>
  <body></body>
</html>
`;
  fs.writeFileSync(path.join(prosjekterDir, 'index.html'), listingHtml);
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

  writeProsjekterListingRedirect();
  console.log('Wrote prosjekter/index.html');

  const stubs = fs
    .readdirSync(root)
    .filter((name) => name.startsWith(stubPrefix) && name.endsWith('.html'));

  for (const stubName of stubs) {
    const stubPath = path.join(root, stubName);
    const html = fs.readFileSync(stubPath, 'utf8');
    const canonicalMatch = html.match(
      /<link\s+rel="canonical"\s+href="https:\/\/formaa\.no\/prosjekter\/([a-z0-9-]+)"\s*\/?>/i
    );
    if (!canonicalMatch) {
      console.warn(`Skip ${stubName}: no /prosjekter/{slug} canonical`);
      continue;
    }
    const seoSlug = canonicalMatch[1];
    fs.writeFileSync(stubPath, applyStubRedirect(html, `/prosjekter/${seoSlug}`));
    console.log(`Updated ${stubName} → /prosjekter/${seoSlug}`);
  }

  console.log(`Done (${written} static project pages).`);
}

main();
