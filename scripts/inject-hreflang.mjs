#!/usr/bin/env node
// NOTE: Injects hreflang alternate links after canonical on paired NO ↔ EN hub pages.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HREFLANG_SOURCE_FILES, hreflangBlockForRoute } from './lib/lang-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const HREFLANG_RE = /\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>/gi;
const HREFLANG_MARKER = '<!-- NOTE: hreflang alternates (scripts/inject-hreflang.mjs) -->';

function stripHreflang(html) {
  return html.replace(HREFLANG_RE, '').replace(/\s*<!-- NOTE: hreflang alternates[^\n]* -->\n?/g, '');
}

function injectHreflang(html, block) {
  const cleaned = stripHreflang(html);
  const insertion = `\n    ${HREFLANG_MARKER}\n    ${block}`;

  if (/<link rel="canonical"/i.test(cleaned)) {
    return cleaned.replace(/(<link rel="canonical" href="[^"]+" \/>)/i, `$1${insertion}`);
  }

  const canonicalAlt = cleaned.match(/<link[^>]+rel=["']canonical["'][^>]+>/i);
  if (canonicalAlt) {
    return cleaned.replace(canonicalAlt[0], `${canonicalAlt[0]}${insertion}`);
  }

  return null;
}

let updated = 0;

for (const [route, relFile] of Object.entries(HREFLANG_SOURCE_FILES)) {
  const filePath = path.join(root, relFile);
  const block = hreflangBlockForRoute(route);

  if (!block) {
    console.warn(`Skip ${relFile}: no hreflang pair for ${route}`);
    continue;
  }

  if (!fs.existsSync(filePath)) {
    console.warn(`Skip ${relFile}: file not found`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const next = injectHreflang(html, block);

  if (!next) {
    console.warn(`Skip ${relFile}: no canonical link found`);
    continue;
  }

  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
    console.log(`Updated ${relFile} (${route})`);
  }
}

console.log(`hreflang injection complete (${updated} files updated).`);
