#!/usr/bin/env node
// NOTE: Syncs name/og/twitter description meta tags from visible page copy (section-lead, hero, article JSON, manifest).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogSlugForSeo } from './lib/project-seo-slugs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_LEN = 158;

/** NOTE: Curated SERP copy for key pages — not overwritten by hero/lead extraction. */
const CURATED_SEO = {
  'index.html': {
    title: 'Formaa: Produktutvikling og 3D-visualisering for startups i Norge',
    description:
      'Designbyrå som vil få ideen din til å ta form. Er du en gründer eller driver en startup? Vi hjelper deg med produktutvikling, 3D/CAD, visualisering og prototype.',
  },
  'oss.html': {
    title: 'Om oss | Produktutvikling og 3D-visualisering | Formaa',
    description:
      'Formaa AS er tre designer-venner med produktutviklingsbyrå for oppfinnere, gründere og startups — personlig tilnærming fra idé til marked.',
  },
  'prisestimat.html': {
    description:
      'Prisestimat og små pakker med fast pris for prototype, konsept og 3D-modellering. Overslag for produktutvikling — nyttig for startups før dere starter.',
  },
  'tjenester-prosess.html': {
    title: 'Produktutvikling og 3D-visualisering | Tjenester | Formaa',
    description:
      'Produktutvikling og 3D-visualisering fra konsept til prototype: industridesign, CAD, visualisering og branding for startups og gründere i Norge.',
  },
};

/** NOTE: Prefer one studio term per meta sentence (never both designstudio and designbyrå together). */
function sanitizeStudioTerms(text, prefer = 'designbyrå') {
  return text
    .replace(/designstudio og designbyrå/gi, prefer)
    .replace(/designbyrå og designstudio/gi, prefer);
}

function studioTermPreference(rel) {
  if (rel.startsWith('category/visualisering/')) return 'designstudio';
  if (rel.startsWith('category/design/')) return 'designbyrå';
  if (rel === 'index.html') return 'designbyrå';
  return 'designbyrå';
}

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

function normalizeMetaText(text) {
  return text
    .replace(/\s+([.,!?…])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** NOTE: Pack full sentences up to MAX_LEN; word-boundary fallback without literal ellipsis in meta tags. */
function truncateMeta(text) {
  const normalized = normalizeMetaText(text);
  if (normalized.length <= MAX_LEN) return normalized;

  const parts = normalized.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [normalized];
  let out = '';
  for (const part of parts) {
    const next = (out + part).trim();
    if (next.length > MAX_LEN) break;
    out = next;
  }
  if (out.length >= 50) return out;

  const cut = normalized.slice(0, MAX_LEN);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim();
}

/** NOTE: leadOnly skips H1 prefix when location/topic is already in the page title (category, blog, EN). */
function buildDescription(headline, body, { leadOnly = false } = {}) {
  const h = stripHtml(headline || '');
  const b = stripHtml(body || '');
  if (!h && !b) return '';
  if (leadOnly || !h) return truncateMeta(b);
  if (!b) return truncateMeta(h);
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

function resolveDescription(filePath, html) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');

  if (CURATED_SEO[rel]?.description) {
    return CURATED_SEO[rel].description;
  }

  if (rel === 'blogg.html' || rel === 'blogg/index.html') {
    return buildDescription(extractHeadline(html), extractLead(html));
  }

  if (rel.startsWith('blogg-') || rel.startsWith('blogg/')) {
    return truncateMeta(stripHtml(extractArticleLead(html)));
  }

  if (rel.startsWith('category/')) {
    return sanitizeStudioTerms(
      buildDescription(extractHeadline(html), extractLead(html), { leadOnly: true }),
      studioTermPreference(rel)
    );
  }

  if (rel.startsWith('en/') && rel.endsWith('.html')) {
    const slug = path.basename(rel, '.html');
    const pages = loadEnLandings();
    const page = pages[slug];
    if (page) return buildDescription(page.title, page.lead, { leadOnly: true });
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
      catalogSlug = catalogSlugForSeo(seoSlug) || '';
    } else if (folderMatch) {
      catalogSlug = catalogSlugForSeo(folderMatch[1]) || folderMatch[1];
    }
    const project = manifest.projects.find((p) => p.slug === catalogSlug);
    if (project) return buildDescription(project.title, project.desc);
  }

  if (rel === 'bli-med.html' || rel === 'arrangement.html') {
    return buildDescription(extractHeadline(html), extractLead(html));
  }

  const headline = extractHeadline(html);
  const lead = extractLead(html);
  if (headline || lead) {
    return sanitizeStudioTerms(buildDescription(headline, lead), studioTermPreference(rel));
  }

  return '';
}

function resolveTitle(filePath, html) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (CURATED_SEO[rel]?.title) return CURATED_SEO[rel].title;

  if (rel.startsWith('category/')) {
    const h1 = stripHtml(extractHeadline(html));
    if (!h1) return '';
    const service = rel.match(/^category\/([^/]+)\//)?.[1] || '';
    const primaryServices = new Set([
      'visualisering',
      'prototyping',
      'produktdesign',
      'industridesign',
      '3d-modelering',
      'cad-modelering',
      'konseptutvikling',
      'design',
    ]);
    const hint = primaryServices.has(service) ? ' — produktutvikling og 3D-visualisering' : '';
    return `${h1}${hint} | Formaa`;
  }

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

function setTitleTag(html, title) {
  if (!title) return html;
  const escaped = title.replace(/</g, '&lt;');
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escaped}</title>`);
  }
  return html;
}

function updateTitles(filePath, title) {
  if (!title) return false;
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  html = setTitleTag(html, title);
  html = setMetaContent(html, 'og:title', title);
  html = setMetaContent(html, 'twitter:title', title);
  fs.writeFileSync(filePath, html);
  const rel = path.relative(root, filePath);
  if (before !== title) {
    console.log(`title updated: ${rel}`);
    return true;
  }
  return false;
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

let updated = 0;
let titlesUpdated = 0;
const seen = new Set();
for (const file of files) {
  if (seen.has(file)) continue;
  seen.add(file);
  const html = fs.readFileSync(file, 'utf8');
  if (!/name="description"/i.test(html)) continue;
  const description = resolveDescription(file, html);
  if (updateDescriptions(file, description)) updated += 1;
  const title = resolveTitle(file, html);
  if (updateTitles(file, title)) titlesUpdated += 1;
}

console.log(`\nDone. ${updated} description(s) and ${titlesUpdated} title(s) updated.`);
