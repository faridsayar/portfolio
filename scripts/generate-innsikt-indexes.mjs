#!/usr/bin/env node
// NOTE: Writes innsikt/{slug}/index.html from root innsikt-*.html so GitHub Pages serves sitemap article URLs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stubPrefix = 'innsikt-';

const stubs = fs
  .readdirSync(root)
  .filter((name) => name.startsWith(stubPrefix) && name.endsWith('.html'));

const innsiktDir = path.join(root, 'innsikt');
fs.mkdirSync(innsiktDir, { recursive: true });

const relativePrefixes = [
  'styles/',
  'components-loader.js',
  'shared-nav.js',
  'article-image-map.js',
  'shared-article.js',
];

function nestArticleHtml(html) {
  let out = html;
  for (const prefix of relativePrefixes) {
    out = out.replaceAll(`href="${prefix}`, `href="../../${prefix}`);
    out = out.replaceAll(`src="${prefix}`, `src="../../${prefix}`);
  }
  return out;
}

let written = 0;

for (const stubName of stubs) {
  const html = fs.readFileSync(path.join(root, stubName), 'utf8');
  const canonicalMatch = html.match(
    /<link\s+rel="canonical"\s+href="https:\/\/formaa\.no\/innsikt\/([a-z0-9-]+)"\s*\/?>/i
  );
  if (!canonicalMatch) {
    console.warn(`Skip ${stubName}: no /innsikt/{slug} canonical`);
    continue;
  }
  const slug = canonicalMatch[1];
  const targetDir = path.join(innsiktDir, slug);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), nestArticleHtml(html));
  written += 1;
  console.log(`Wrote innsikt/${slug}/index.html`);
}

const hubHtml = `<!doctype html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Innsikt | Formaa</title>
    <link rel="canonical" href="https://formaa.no/innsikt" />
    <meta http-equiv="refresh" content="0; url=../innsikt.html" />
    <script>
      window.location.replace('../innsikt.html');
    </script>
  </head>
  <body></body>
</html>
`;

fs.writeFileSync(path.join(innsiktDir, 'index.html'), hubHtml);
console.log('Wrote innsikt/index.html');
console.log(`Done (${written} article routes).`);
