#!/usr/bin/env node
// NOTE: Syncs name/og/twitter description meta tags from visible page copy (section-lead, hero, article JSON, manifest).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_LEN = 158;

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateMeta(text) {
  if (text.length <= MAX_LEN) return text;
  const cut = text.slice(0, MAX_LEN - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function buildDescription(headline, body) {
  const h = stripHtml(headline || '');
  const b = stripHtml(body || '');
  if (!h && !b) return '';
  if (!b) return truncateMeta(h);
  if (!h) return truncateMeta(b);
  const hNorm = h.toLowerCase();
  const bNorm = b.toLowerCase();
  if (bNorm.startsWith(hNorm) || bNorm.includes(hNorm.slice(0, Math.min(24, hNorm.length)))) {
    return truncateMeta(b);
  }
  return truncateMeta(`${h}. ${b}`);
}

function extractFirst(regex, html) {
  const m = html.match(regex);
  return m ? m[1] : '';
}

function extractLead(html) {
  const leadMatch = html.match(
    /<p\s+class="section-lead"(?![^>]*section-lead--after-grid)[^>]*>([\s\S]*?)<\/p>/i
  );
  if (leadMatch) return leadMatch[1];
  const heroSub = [...html.matchAll(/<p\s+class="hero-subtitle"[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripHtml(m[1]))
    .filter(Boolean);
  if (heroSub.length) return heroSub.join(' ');
  return '';
}

function extractHeadline(html) {
  return (
    extractFirst(/<h1[^>]*class="[^"]*section-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i, html) ||
    extractFirst(/<h1[^>]*class="[^"]*hero-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i, html) ||
    extractFirst(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html) ||
    ''
  );
}

function extractArticleLead(html) {
  const jsonMatch = html.match(
    /<script\s+id="article-content"\s+type="application\/json">\s*([\s\S]*?)\s*<\/script>/i
  );
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const firstP = data.blocks?.find((b) => b.type === 'p' && b.text);
      if (firstP) return firstP.text;
    } catch {
      /* ignore */
    }
  }
  return extractLead(html);
}

function loadProjectsManifest() {
  const raw = fs.readFileSync(path.join(root, 'assets/data/projects-manifest.js'), 'utf8');
  const json = raw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(json);
}

function loadEnLandings() {
  const raw = fs.readFileSync(path.join(root, 'assets/data/en-landing-pages.js'), 'utf8');
  const sandbox = {};
  const fn = new Function('window', `${raw}\nreturn window.EN_LANDING_PAGES;`);
  return fn(sandbox);
}

const SEO_SLUG_TO_CATALOG = {
  'obseed-custom-8-string-guitar': 'obseed',
  'undo-desertification': 'undo',
  'nomos-branding': 'nomos',
  'proton-headphones': 'proton',
  'nordic-restaurant-branding': 'nordic',
  'monocopter-drone': 'monocopter',
  'rafaels-ren-melk': 'rafaels',
  'eco-mate-closet': 'eco-mate-closet',
  'h2o-bottle-pedometer': 'h2o',
};

function resolveDescription(filePath, html) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');

  if (rel === 'index.html') {
    const heroTitle = extractFirst(
      /<h1[^>]*class="[^"]*hero-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i,
      html
    );
    const heroSubs = [...html.matchAll(/<p\s+class="hero-subtitle"[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((m) => stripHtml(m[1]))
      .join(' ');
    const afterGrid = extractFirst(
      /<p\s+class="section-lead section-lead--after-grid"[^>]*>([\s\S]*?)<\/p>/i,
      html
    );
    return buildDescription(heroTitle, `${heroSubs} ${stripHtml(afterGrid)}`.trim());
  }

  if (rel === 'designstudio-oslo.html') {
    return buildDescription(extractHeadline(html), extractLead(html));
  }

  if (rel === 'oss.html') {
    const lead1 = extractLead(html);
    const lead2 = extractFirst(
      /<p\s+class="section-lead section-lead--after-grid"[^>]*>([\s\S]*?)<\/p>/i,
      html
    );
    return buildDescription(
      extractHeadline(html),
      `${stripHtml(lead1)} ${stripHtml(lead2)}`.trim()
    );
  }

  if (rel === 'application-form.html') {
    const componentHtml = fs.readFileSync(
      path.join(root, 'components/application-form.html'),
      'utf8'
    );
    return buildDescription(extractHeadline(componentHtml), extractLead(componentHtml));
  }

  if (rel === 'prisestimat.html') {
    return buildDescription(extractHeadline(html), extractLead(html));
  }

  if (rel === 'innsikt.html' || rel === 'innsikt/index.html') {
    return buildDescription(extractHeadline(html), extractLead(html));
  }

  if (rel.startsWith('innsikt-') || rel.startsWith('innsikt/')) {
    const title = extractFirst(/<title>([\s\S]*?)<\/title>/i, html).replace(
      /\s*\|\s*Formaa.*$/i,
      ''
    );
    return buildDescription(title, extractArticleLead(html));
  }

  if (rel.startsWith('category/')) {
    return buildDescription(extractHeadline(html), extractLead(html));
  }

  if (rel.startsWith('en/') && rel.endsWith('.html')) {
    const slug = path.basename(rel, '.html');
    const pages = loadEnLandings();
    const page = pages[slug];
    if (page) return buildDescription(page.title, page.lead);
  }

  if (rel === 'advanced-project.html') {
    return truncateMeta(
      'Prosjekter fra Formaa: industridesign og produktdesign med hero, galleri og case-beskrivelse fra konsept til produksjon.'
    );
  }

  if (rel === 'prosjekter/index.html') {
    return truncateMeta(
      'Alle prosjekter fra Formaa — industridesign og produktdesign fra konsept til prototype og produksjon.'
    );
  }

  if (rel.startsWith('prosjekt-') || rel.startsWith('prosjekter/')) {
    const manifest = loadProjectsManifest();
    let catalogSlug = '';
    const stubMatch = rel.match(/prosjekt-([a-z0-9-]+)\.html$/);
    const folderMatch = rel.match(/prosjekter\/([a-z0-9-]+)\//);
    if (stubMatch) {
      const seoSlug = stubMatch[1];
      catalogSlug = SEO_SLUG_TO_CATALOG[seoSlug] || '';
    } else if (folderMatch) {
      catalogSlug = SEO_SLUG_TO_CATALOG[folderMatch[1]] || folderMatch[1];
    }
    const project = manifest.projects.find((p) => p.slug === catalogSlug);
    if (project) return buildDescription(project.title, project.desc);
  }

  if (rel === 'bli-med.html') {
    return buildDescription(extractHeadline(html), extractLead(html));
  }

  const headline = extractHeadline(html);
  const lead = extractLead(html);
  if (headline || lead) return buildDescription(headline, lead);

  return '';
}

function setMetaContent(html, nameOrProperty, value) {
  const escaped = value.replace(/"/g, '&quot;');
  const patterns = [
    new RegExp(`(<meta\\s+(?:name|property)="${nameOrProperty}"\\s+content=")[^"]*(")`, 'i'),
    new RegExp(`(<meta\\s+content=")[^"]*("\\s+(?:name|property)="${nameOrProperty}")`, 'i'),
  ];
  for (const re of patterns) {
    if (re.test(html)) return html.replace(re, `$1${escaped}$2`);
  }
  return html;
}

function updateDescriptions(filePath, description) {
  if (!description) {
    console.warn(`skip (no copy): ${path.relative(root, filePath)}`);
    return false;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html.match(/name="description"\s+content="([^"]*)"/i)?.[1];
  html = setMetaContent(html, 'description', description);
  html = setMetaContent(html, 'og:description', description);
  html = setMetaContent(html, 'twitter:description', description);
  fs.writeFileSync(filePath, html);
  const rel = path.relative(root, filePath);
  if (before !== description) {
    console.log(`updated: ${rel}`);
    return true;
  }
  console.log(`unchanged: ${rel}`);
  return false;
}

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

const files = [
  path.join(root, 'index.html'),
  path.join(root, 'designstudio-oslo.html'),
  path.join(root, 'oss.html'),
  path.join(root, 'application-form.html'),
  path.join(root, 'prisestimat.html'),
  path.join(root, 'innsikt.html'),
  path.join(root, 'advanced-project.html'),
  path.join(root, 'bli-med.html'),
  ...collectHtmlFiles(path.join(root, 'category')),
  ...collectHtmlFiles(path.join(root, 'innsikt')),
  ...fs
    .readdirSync(root)
    .filter((n) => n.startsWith('innsikt-') && n.endsWith('.html'))
    .map((n) => path.join(root, n)),
  ...fs
    .readdirSync(root)
    .filter((n) => n.startsWith('prosjekt-') && n.endsWith('.html'))
    .map((n) => path.join(root, n)),
  ...collectHtmlFiles(path.join(root, 'prosjekter')),
  ...collectHtmlFiles(path.join(root, 'en')),
];

let updated = 0;
const seen = new Set();
for (const file of files) {
  if (seen.has(file)) continue;
  seen.add(file);
  const html = fs.readFileSync(file, 'utf8');
  if (!/name="description"/i.test(html)) continue;
  const description = resolveDescription(file, html);
  if (updateDescriptions(file, description)) updated += 1;
}

console.log(`\nDone. ${updated} file(s) with new descriptions.`);
