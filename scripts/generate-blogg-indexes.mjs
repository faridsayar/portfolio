#!/usr/bin/env node
// NOTE: Writes blogg/{slug}/index.html from root blogg-*.html so GitHub Pages serves sitemap article URLs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stubPrefix = 'blogg-';

const stubs = fs
  .readdirSync(root)
  .filter((name) => name.startsWith(stubPrefix) && name.endsWith('.html'));

const bloggDir = path.join(root, 'blogg');
fs.mkdirSync(bloggDir, { recursive: true });

const articleRelativePrefixes = [
  'styles/',
  'components-loader.js',
  'shared-nav.js',
  'article-image-map.js',
  'shared-article.js',
];

const hubRelativePrefixes = [
  'styles/',
  'components-loader.js',
  'shared-nav.js',
  'article-image-map.js',
  'shared-blogg-thumbs.js',
  'assets/',
];

function nestHtml(html, prefixes, depth) {
  const prefixPath = '../'.repeat(depth);
  let out = html;
  for (const relativePrefix of prefixes) {
    out = out.replaceAll(`href="${relativePrefix}`, `href="${prefixPath}${relativePrefix}`);
    out = out.replaceAll(`src="${relativePrefix}`, `src="${prefixPath}${relativePrefix}`);
  }
  return out;
}

function nestArticleHtml(html) {
  return nestHtml(html, articleRelativePrefixes, 2);
}

let written = 0;

for (const stubName of stubs) {
  const html = fs.readFileSync(path.join(root, stubName), 'utf8');
  const canonicalMatch = html.match(
    /<link\s+rel="canonical"\s+href="https:\/\/formaa\.no\/blogg\/([a-z0-9-]+)"\s*\/?>/i
  );
  if (!canonicalMatch) {
    console.warn(`Skip ${stubName}: no /blogg/{slug} canonical`);
    continue;
  }
  const slug = canonicalMatch[1];
  const targetDir = path.join(bloggDir, slug);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), nestArticleHtml(html));
  written += 1;
  console.log(`Wrote blogg/${slug}/index.html`);
}

// NOTE: Full hub markup at /blogg/ so static servers (local + GitHub Pages) do not serve an empty redirect stub.
const hubSourcePath = path.join(root, 'blogg.html');
if (!fs.existsSync(hubSourcePath)) {
  console.warn('Skip blogg/index.html: missing blogg.html');
} else {
  const hubHtml = nestHtml(fs.readFileSync(hubSourcePath, 'utf8'), hubRelativePrefixes, 1);
  fs.writeFileSync(path.join(bloggDir, 'index.html'), hubHtml);
  console.log('Wrote blogg/index.html (from blogg.html)');
}
console.log(`Done (${written} article routes).`);
