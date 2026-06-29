#!/usr/bin/env node
// NOTE: Injects title+text and process blocks into category hero, before the feature banner / contact form.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildCategoryContentBlocks,
  parseCategoryServiceSlug,
} from './lib/category-content-blocks.mjs';
import { SITE } from './lib/schema-markup.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const categoryDir = path.join(root, 'category');

const FORM_ANCHOR = '          <div data-component="application-form"></div>';
const FOOTER_MARKER = '    <!-- NOTE: BEGIN static site-footer';
const BODY_MARKER = 'category-body-copy';
const KICKER_OLD = '<p class="section-kicker">Forma AS</p>';
const KICKER_NEW = '<p class="section-kicker">Formaa AS</p>';

function collectCategoryHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectCategoryHtmlFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function stripExistingBlocks(html) {
  return html.replace(
    /\n? {6,10}<!-- NOTE: (?:"Hva er det\?" block|Category body copy|Category delivery steps|Process phase strip)[\s\S]*? {6,10}<\/section>\n\n {6,10}<!-- NOTE: (?:"Hva er det\?" block|Category body copy|Category delivery steps|Process phase strip)[\s\S]*? {6,10}<\/section>\n?/g,
    '\n'
  );
}

function normalizeCategoryCanonical(html, relPath) {
  const match = relPath.match(/^category\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return html;
  const canonicalUrl = `${SITE}/category/${match[1]}/${match[2]}`;
  return html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
}

function injectBlocks(html, serviceSlug, relPath) {
  let next = html.replaceAll(KICKER_OLD, KICKER_NEW);
  next = normalizeCategoryCanonical(next, relPath);
  next = stripExistingBlocks(next);

  if (!next.includes(FORM_ANCHOR)) {
    throw new Error('Could not find application-form anchor');
  }

  if (next.includes(BODY_MARKER)) {
    throw new Error('Category body block still present after strip');
  }

  const blocks = buildCategoryContentBlocks(serviceSlug);
  const insertion = `\n${blocks}\n${FORM_ANCHOR}`;

  return next.replace(FORM_ANCHOR, insertion);
}

function main() {
  const files = collectCategoryHtmlFiles(categoryDir);
  let updated = 0;

  for (const filePath of files) {
    const relPath = path.relative(root, filePath).replace(/\\/g, '/');
    const serviceSlug = parseCategoryServiceSlug(relPath);
    if (!serviceSlug) {
      console.warn(`skip: could not parse service slug from ${relPath}`);
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes(FOOTER_MARKER)) {
      console.warn(`skip: missing footer marker in ${relPath}`);
      continue;
    }

    const next = injectBlocks(html, serviceSlug, relPath);
    if (next !== html) {
      fs.writeFileSync(filePath, next);
      updated += 1;
      console.log(`updated: ${relPath}`);
    }
  }

  console.log(`Done. Updated ${updated} category page(s).`);
}

main();
