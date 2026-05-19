#!/usr/bin/env node
// NOTE: Writes prosjekter/{seo-slug}/index.html from root prosjekt-*.html stubs so GitHub Pages serves sitemap URLs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stubGlobPrefix = 'prosjekt-';

const stubs = fs
  .readdirSync(root)
  .filter((name) => name.startsWith(stubGlobPrefix) && name.endsWith('.html'));

if (stubs.length === 0) {
  console.error('No prosjekt-*.html stubs found.');
  process.exit(1);
}

/** NOTE: Replace self-loop /prosjekter redirects with advanced-project.html?seoSlug=… */
function applyRedirect(html, redirectTarget) {
  return html
    .replace(
      /<meta\s+http-equiv="refresh"\s+content="[^"]*"\s*\/?>/i,
      `<meta http-equiv="refresh" content="0; url=${redirectTarget}" />`
    )
    .replace(/window\.location\.replace\([^)]+\)/, `window.location.replace('${redirectTarget}')`);
}

const prosjekterDir = path.join(root, 'prosjekter');
fs.mkdirSync(prosjekterDir, { recursive: true });

let written = 0;

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
  const stubRedirect = `advanced-project.html?seoSlug=${seoSlug}`;
  const prosjekterRedirect = `../../advanced-project.html?seoSlug=${seoSlug}`;

  fs.writeFileSync(stubPath, applyRedirect(html, stubRedirect));

  const targetDir = path.join(prosjekterDir, seoSlug);
  fs.mkdirSync(targetDir, { recursive: true });

  const outPath = path.join(targetDir, 'index.html');
  fs.writeFileSync(outPath, applyRedirect(html, prosjekterRedirect));
  written += 1;
  console.log(`Wrote prosjekter/${seoSlug}/index.html`);
}

const listingHtml = `<!doctype html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Prosjekter | Formaa</title>
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
console.log('Wrote prosjekter/index.html');
console.log(`Done (${written} project routes).`);
