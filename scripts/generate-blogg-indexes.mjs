#!/usr/bin/env node
// NOTE: Writes blogg/index.html from root blogg.html so /blogg/ works on static hosts (GitHub Pages).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

const bloggDir = path.join(root, 'blogg');
fs.mkdirSync(bloggDir, { recursive: true });

// NOTE: Full hub markup at /blogg/ so static servers (local + GitHub Pages) do not serve an empty redirect stub.
const hubSourcePath = path.join(root, 'blogg.html');
if (!fs.existsSync(hubSourcePath)) {
  console.warn('Skip blogg/index.html: missing blogg.html');
} else {
  const hubHtml = nestHtml(fs.readFileSync(hubSourcePath, 'utf8'), hubRelativePrefixes, 1);
  fs.writeFileSync(path.join(bloggDir, 'index.html'), hubHtml);
  console.log('Wrote blogg/index.html (from blogg.html)');
}
console.log('Done (blogg hub only; articles live at blogg/{slug}/index.html).');
