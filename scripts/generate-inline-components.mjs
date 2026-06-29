#!/usr/bin/env node
// NOTE: Inlines side-nav and site-footer into static HTML so crawlers get internal links without JavaScript.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ARTICLE_LAYOUT_BEGIN,
  ARTICLE_LAYOUT_END,
  SIDE_NAV_BEGIN,
  SIDE_NAV_END,
  SITE_FOOTER_BEGIN,
  SITE_FOOTER_END,
  buildSideNavMarkup,
  publicPathFromFile,
  wrapArticleLayoutMarkup,
  wrapSiteFooterMarkup,
} from './lib/shared-nav-markup.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = path.join(root, 'components');

const siteFooterInner = fs.readFileSync(path.join(componentsDir, 'site-footer.html'), 'utf8');
const articleLayoutTemplate = fs.readFileSync(
  path.join(componentsDir, 'article-layout.html'),
  'utf8'
);
const siteFooterMarkup = wrapSiteFooterMarkup(siteFooterInner);
const articleLayoutWithFooter = articleLayoutTemplate.replace(
  '<div data-component="site-footer"></div>',
  siteFooterMarkup
);
const articleLayoutMarkup = wrapArticleLayoutMarkup(articleLayoutWithFooter);

const SIDE_NAV_SLOT = '<div data-component="side-nav"></div>';
const SITE_FOOTER_SLOT = '<div data-component="site-footer"></div>';
const ARTICLE_LAYOUT_SLOT = '<div data-component="article-layout"></div>';

function collectHtmlFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === 'components') continue;
      collectHtmlFiles(full, out);
    } else if (
      name.endsWith('.html') &&
      name !== 'article-template.html' &&
      name !== 'gallery.html'
    ) {
      out.push(full);
    }
  }
  return out;
}

function collectTargetFiles() {
  const files = [
    path.join(root, 'index.html'),
    path.join(root, 'oss.html'),
    path.join(root, 'tjenester-prosess.html'),
    path.join(root, 'application-form.html'),
    path.join(root, 'prisestimat.html'),
    path.join(root, 'blogg.html'),
    path.join(root, 'advanced-project.html'),
    path.join(root, 'bli-med.html'),
    path.join(root, 'arrangement.html'),
    ...collectHtmlFiles(path.join(root, 'category')),
    ...collectHtmlFiles(path.join(root, 'blogg')),
    ...fs
      .readdirSync(root)
      .filter((n) => n.startsWith('blogg-') && n.endsWith('.html'))
      .map((n) => path.join(root, n)),
    ...fs
      .readdirSync(root)
      .filter((n) => n.startsWith('prosjekt-') && n.endsWith('.html'))
      .map((n) => path.join(root, n)),
    ...collectHtmlFiles(path.join(root, 'prosjekter')),
    ...collectHtmlFiles(path.join(root, 'en')),
  ];

  return [...new Set(files)].filter((file) => fs.existsSync(file));
}

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceMarkedBlock(html, begin, end, replacement) {
  const pattern = new RegExp(`${escapeForRegExp(begin)}[\\s\\S]*?${escapeForRegExp(end)}`, 'g');
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html;
}

function inlineSideNav(html, publicPath) {
  const replacement = buildSideNavMarkup(publicPath);
  let next = replaceMarkedBlock(html, SIDE_NAV_BEGIN, SIDE_NAV_END, replacement);
  if (next.includes(SIDE_NAV_SLOT)) {
    next = next.replace(SIDE_NAV_SLOT, replacement);
  }
  return next;
}

function inlineSiteFooter(html) {
  let next = replaceMarkedBlock(html, SITE_FOOTER_BEGIN, SITE_FOOTER_END, siteFooterMarkup);
  if (next.includes(SITE_FOOTER_SLOT)) {
    next = next.replace(SITE_FOOTER_SLOT, siteFooterMarkup);
  }
  return next;
}

function inlineArticleLayout(html) {
  let next = replaceMarkedBlock(
    html,
    ARTICLE_LAYOUT_BEGIN,
    ARTICLE_LAYOUT_END,
    articleLayoutMarkup
  );
  if (next.includes(ARTICLE_LAYOUT_SLOT)) {
    next = next.replace(ARTICLE_LAYOUT_SLOT, articleLayoutMarkup);
  }
  return next;
}

function processFile(filePath) {
  const publicPath = publicPathFromFile(root, filePath);
  const before = fs.readFileSync(filePath, 'utf8');
  let html = before;

  if (html.includes(SIDE_NAV_SLOT) || html.includes(SIDE_NAV_BEGIN)) {
    html = inlineSideNav(html, publicPath);
  }

  if (html.includes(ARTICLE_LAYOUT_SLOT) || html.includes(ARTICLE_LAYOUT_BEGIN)) {
    html = inlineArticleLayout(html);
  } else if (html.includes(SITE_FOOTER_SLOT) || html.includes(SITE_FOOTER_BEGIN)) {
    html = inlineSiteFooter(html);
  }

  if (html !== before) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

const files = collectTargetFiles();
let updated = 0;

for (const file of files) {
  if (processFile(file)) {
    console.log(`inlined: ${path.relative(root, file)}`);
    updated += 1;
  }
}

console.log(`\nDone. ${updated} file(s) updated with static nav/footer.`);
