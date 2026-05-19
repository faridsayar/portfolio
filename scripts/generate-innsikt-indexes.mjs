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
  'shared-innsikt-thumbs.js',
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

// NOTE: Full hub markup at /innsikt/ so static servers (local + GitHub Pages) do not serve an empty redirect stub.
const hubSourcePath = path.join(root, 'innsikt.html');
if (!fs.existsSync(hubSourcePath)) {
  console.warn('Skip innsikt/index.html: missing innsikt.html');
} else {
  const hubHtml = nestHtml(fs.readFileSync(hubSourcePath, 'utf8'), hubRelativePrefixes, 1);
  fs.writeFileSync(path.join(innsiktDir, 'index.html'), hubHtml);
  console.log('Wrote innsikt/index.html (from innsikt.html)');
}
console.log(`Done (${written} article routes).`);
