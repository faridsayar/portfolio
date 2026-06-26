#!/usr/bin/env node
// NOTE: Regenerates JSON-LD @graph blocks on indexable HTML pages (run after adding routes or changing SEO copy).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE,
  ORG_ID,
  WEBSITE_ID,
  PROFESSIONAL_SERVICE_ID,
  ORG_SAME_AS,
  BRAND_CRUMB,
  normalizeCanonical,
  scriptBlock,
  wrapGraph,
  websiteRef,
  publisherRef,
  breadcrumbList,
  webPage,
  buildCategoryGraph,
  buildArticleGraph,
  buildBloggHubGraph,
  buildDefaultWebGraph,
  buildArrangementGraph,
  buildOssGraph,
  buildFullOrganizationNode,
  orgPostalAddress,
  buildProjectGraph,
  buildProjectsHubGraph,
  stripHtml,
} from './lib/schema-markup.mjs';
import { isPublishedCatalogProject, seoSlugForCatalog } from './lib/project-seo-slugs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_FILES = new Set(['404.html', 'gallery.html', 'article-template.html']);

const SKIP_DIRS = new Set(['components', 'node_modules']);

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, html) {
  fs.writeFileSync(filePath, html, 'utf8');
}

function getMeta(html, attr, key) {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i');
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${key}["']`, 'i');
  return re2?.[1] || '';
}

function getTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m?.[1]?.trim() || '';
}

function getCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (!m) {
    const m2 = html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    return normalizeCanonical(m2?.[1]);
  }
  return normalizeCanonical(m[1]);
}

function getH1(html) {
  const m = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  return m?.[1]?.trim() || '';
}

function isRedirectOnly(html) {
  if (/<body>\s*<\/body>/i.test(html)) return true;
  if (/http-equiv=["']refresh["']/i.test(html) && !html.includes('data-component')) return true;
  return false;
}

function isNoindex(html) {
  return /name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function extractArticleContent(html) {
  const m = html.match(
    /<script id="article-content" type="application\/json">\s*([\s\S]*?)\s*<\/script>/i
  );
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function removeJsonLd(html) {
  return html
    .replace(
      /\s*<!-- NOTE: JSON-LD @graph[\s\S]*?-->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi,
      ''
    )
    .replace(
      /\s*<!-- NOTE:[^\n]*JSON-LD[^\n]*-->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi,
      ''
    )
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
}

function insertSchemaFromGraph(html, graph) {
  const cleaned = removeJsonLd(html);
  const block = scriptBlock(graph['@graph']);
  if (/\n\s*<script src="[^"]*components-loader/i.test(cleaned)) {
    return cleaned.replace(
      /(\n\s*)<script src="([^"]*components-loader[^"]*)"/i,
      `\n${block}\n$1<script src="$2"`
    );
  }
  return cleaned.replace(/\s*<\/body>/i, `\n${block}\n  </body>`);
}

function statMtime(filePath) {
  const iso = fs.statSync(filePath).mtime.toISOString();
  return iso.replace(/\.\d{3}Z$/, '+00:00').replace('Z', '+00:00');
}

function parseCategoryPath(relPath) {
  const m = relPath.match(/^category\/([^/]+)\/([^/]+)\.html$/);
  if (!m) return null;
  return { serviceSlug: m[1], regionSlug: m[2].replace(/\.html$/, '') };
}

function parseBloggArticle(relPath) {
  const rootMatch = relPath.match(/^blogg-([a-z0-9-]+)\.html$/);
  if (rootMatch) return { slug: rootMatch[1] };
  const nestedMatch = relPath.match(/^blogg\/([a-z0-9-]+)\/index\.html$/);
  if (nestedMatch) return { slug: nestedMatch[1] };
  return null;
}

function extractHomeFaq(html) {
  const sectionMatch = html.match(
    /aria-label="Vanlige spørsmål om produktutvikling"[\s\S]*?<\/section>/i
  );
  if (!sectionMatch) return null;

  const section = sectionMatch[0];
  const pairs = [];
  for (const h3 of section.matchAll(/<h3 class="section-title"[^>]*>([\s\S]*?)<\/h3>/gi)) {
    const after = section.slice((h3.index ?? 0) + h3[0].length);
    const pMatch = after.match(/<p class="section-lead"[^>]*>([\s\S]*?)<\/p>/i);
    if (!pMatch) continue;
    const question = stripHtml(h3[1]).replace(/^\d+\.\s*/, '');
    const answer = stripHtml(pMatch[1]);
    if (question && answer) pairs.push({ question, answer });
  }

  if (!pairs.length) return null;

  return {
    '@type': 'FAQPage',
    '@id': `${SITE}/#faq`,
    mainEntity: pairs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

function buildTjenesterGraph({ url, title, description }) {
  return wrapGraph([
    websiteRef(),
    breadcrumbList(
      [
        { name: BRAND_CRUMB, url: `${SITE}/` },
        { name: 'Tjenester', url },
      ],
      url
    ),
    webPage({ url, name: title, description }),
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: 'Produktutvikling og 3D-visualisering',
      serviceType: ['Produktutvikling', '3D-visualisering', 'Prototyping', '3D-modellering'],
      description,
      url,
      inLanguage: 'nb-NO',
      provider: publisherRef(),
      areaServed: { '@type': 'Country', name: 'Norge' },
      image: `${SITE}/assets/images/prosess/3d-modelering.webp`,
    },
  ]);
}

function buildIndexGraph(html) {
  const homeTitle = 'Formaa: Produktutvikling og 3D-visualisering for startups i Norge';
  const homeDescription =
    'Designbyrå som vil få ideen din til å ta form. Er du en gründer eller driver en startup? Vi hjelper deg med produktutvikling, 3D/CAD, visualisering og prototype.';
  const faq = extractHomeFaq(html);

  return wrapGraph([
    websiteRef(),
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE}/#local-business`,
      name: 'Formaa',
      description: homeDescription,
      url: SITE,
      telephone: '+47 46 38 18 87',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+47 46 38 18 87',
        contactType: 'customer service',
        areaServed: 'NO',
        availableLanguage: ['no', 'en'],
      },
      address: orgPostalAddress(),
      sameAs: ORG_SAME_AS,
      parentOrganization: { '@id': ORG_ID },
    },
    {
      '@type': 'ProfessionalService',
      '@id': PROFESSIONAL_SERVICE_ID,
      name: 'Formaa',
      url: `${SITE}/`,
      logo: `${SITE}/assets/formaa-logo.svg`,
      image: `${SITE}/assets/images/prosess/3d-modelering.webp`,
      description:
        'Produktutvikling og 3D-visualisering for startups i Norge — prototyping, 3D-modellering, CAD-modelering og produksjonsforberedelse.',
      areaServed: [
        { '@type': 'Country', name: 'Norge' },
        { '@type': 'City', name: 'Oslo' },
        { '@type': 'AdministrativeArea', name: 'Akershus' },
        { '@type': 'AdministrativeArea', name: 'Buskerud' },
        { '@type': 'AdministrativeArea', name: 'Østfold' },
      ],
      serviceType: [
        'Produktutvikling',
        'Markedsanalyse',
        'Emballasjedesign',
        'Branding',
        'Rendering',
        'Redesign',
        'Produksjon',
        'Industridesign',
        'Produktdesign',
        'Konseptutvikling',
        'Prototyping',
        '3D-modelering',
        'CAD-modelering',
        '3D-visualisering',
        'Produksjonsforberedelse',
        'Teknisk design',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Tjenester',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Konseptutvikling' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Produktdesign' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Prototyping' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '3D-modelering' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CAD-modelering' } },
        ],
      },
      publisher: { '@id': ORG_ID },
    },
    buildFullOrganizationNode(),
    webPage({
      url: `${SITE}/`,
      name: homeTitle,
      description: homeDescription,
    }),
    ...(faq ? [faq] : []),
  ]);
}

function buildPrisestimatGraph(html) {
  const url = `${SITE}/prisestimat`;
  const existingScripts = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi),
  ];
  let serviceNodes = [];
  for (const match of existingScripts) {
    try {
      const data = JSON.parse(match[1]);
      if (data['@graph']) {
        serviceNodes.push(...data['@graph'].filter((n) => n['@type'] === 'Service'));
      } else if (data['@type'] === 'Service') {
        serviceNodes.push(data);
      }
    } catch {
      /* ignore */
    }
  }

  return wrapGraph([
    websiteRef(),
    breadcrumbList(
      [
        { name: BRAND_CRUMB, url: `${SITE}/` },
        { name: 'Prisestimat', url },
      ],
      url
    ),
    webPage({
      url,
      name: 'Pakkepriser og prisestimat for design og produktutvikling | Formaa',
      description:
        'Fastpris på 3D model med visualisering, konseptpakke og prototypepakke, samt prisestimat for design og produktutvikling hos Formaa.',
    }),
    ...serviceNodes.map((node) => ({
      ...node,
      provider: publisherRef(),
    })),
  ]);
}

function processFile(absPath, relPath) {
  let html = read(absPath);
  if (isRedirectOnly(html) || isNoindex(html))
    return { skipped: true, reason: 'redirect or noindex' };

  const url = getCanonical(html);
  const title = getTitle(html);
  const description =
    getMeta(html, 'name', 'description') || getMeta(html, 'property', 'og:description');
  const ogImage = getMeta(html, 'property', 'og:image');
  const image = ogImage ? (ogImage.startsWith('http') ? ogImage : `${SITE}${ogImage}`) : undefined;
  const mtime = statMtime(absPath);

  let graph;

  if (relPath === 'index.html') {
    html = removeJsonLd(html);
    html = html.replace(
      /\s*<!-- NOTE: Local SEO schema[\s\S]*?<\/script>\s*<!-- NOTE: Identity schema[\s\S]*?<\/script>\s*/i,
      '\n'
    );
    html = html.replace(
      /\s*<!-- Structured Data -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/i,
      '\n'
    );
    html = html.replace(/\s*<!-- Structured Data -->\s*/i, '\n');
    graph = buildIndexGraph(html);
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'home' };
  }

  if (relPath === 'advanced-project.html') {
    graph = buildProjectsHubGraph({
      url: `${SITE}/prosjekter`,
      title,
      description,
    });
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'projects-hub' };
  }

  if (relPath === 'prisestimat.html') {
    graph = buildPrisestimatGraph(html);
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'pricing' };
  }

  if (relPath === 'tjenester-prosess.html') {
    const pageUrl = url || `${SITE}/tjenester-prosess`;
    graph = buildTjenesterGraph({
      url: pageUrl,
      title,
      description,
    });
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'tjenester' };
  }

  if (relPath === 'arrangement.html') {
    const pageUrl = url || `${SITE}/arrangement`;
    graph = buildArrangementGraph({
      url: pageUrl,
      title,
      description,
    });
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'arrangement' };
  }

  if (relPath === 'oss.html') {
    const pageUrl = url || `${SITE}/oss`;
    graph = buildOssGraph({
      url: pageUrl,
      title,
      description,
    });
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'oss' };
  }

  if (relPath === 'blogg.html' || relPath === 'blogg/index.html') {
    graph = buildBloggHubGraph({
      url: url || `${SITE}/blogg`,
      title,
      description,
    });
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'blogg-hub' };
  }

  const category = parseCategoryPath(relPath);
  if (category) {
    const pageUrl = url || `${SITE}/category/${category.serviceSlug}/${category.regionSlug}`;
    graph = buildCategoryGraph({
      url: pageUrl,
      title,
      description,
      serviceSlug: category.serviceSlug,
      regionSlug: category.regionSlug,
      h1: getH1(html),
    });
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'category' };
  }

  const article = parseBloggArticle(relPath);
  if (article) {
    const content = extractArticleContent(html);
    const pageUrl = url || `${SITE}/blogg/${article.slug}`;
    const keywords = (getMeta(html, 'name', 'keywords') || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    graph = buildArticleGraph({
      url: pageUrl,
      headline: content?.title || title.split('|')[0].trim(),
      description,
      image,
      keywords,
      blocks: content?.blocks,
      breadcrumbTitle: title.split('|')[0].trim(),
      datePublished: `${mtime.slice(0, 10)}T00:00:00+01:00`,
      dateModified: mtime.replace('+00:00', '+01:00'),
    });
    html = insertSchemaFromGraph(html, graph);
    write(absPath, html);
    return { updated: true, type: 'article' };
  }

  if (relPath.startsWith('en/') && relPath.endsWith('.html')) {
    return { skipped: true, reason: 'en landing (see en-landing-pages.js)' };
  }

  graph = buildDefaultWebGraph({
    url: url || `${SITE}/${relPath.replace(/index\.html$/, '').replace(/\.html$/, '')}`,
    title,
    description,
  });
  html = insertSchemaFromGraph(html, graph);
  write(absPath, html);
  return { updated: true, type: 'webpage' };
}

function collectHtmlFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...collectHtmlFiles(path.join(dir, entry.name), rel));
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    if (SKIP_FILES.has(rel)) continue;
    files.push(rel);
  }
  return files;
}

function loadProjectsManifest() {
  const raw = read(path.join(root, 'assets/data/projects-manifest.js'));
  return JSON.parse(raw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, ''));
}

function writeProjectSchemaJs() {
  const manifest = loadProjectsManifest();

  const projects = manifest.projects.filter(isPublishedCatalogProject).map((p) => {
    const seoSlug = seoSlugForCatalog(p.slug);
    const thumb = p.thumbnail?.startsWith('http')
      ? p.thumbnail
      : `${SITE}/${p.thumbnail.replace(/^\//, '')}`;
    return {
      seoSlug,
      title: p.title,
      description: p.desc,
      image: thumb,
      url: `${SITE}/prosjekter/${seoSlug}`,
    };
  });

  const out = `// NOTE: Per-project CreativeWork JSON-LD injected on advanced-project.html for /prosjekter/{slug} URLs.
window.__PROJECT_SCHEMA_BY_SLUG = ${JSON.stringify(
    Object.fromEntries(
      projects.map((p) => [
        p.seoSlug,
        buildProjectGraph({
          url: p.url,
          title: p.title,
          description: p.description,
          image: p.image,
        }),
      ])
    ),
    null,
    2
  )};
`;

  write(path.join(root, 'assets/data/project-schema-by-slug.js'), out);
}

function main() {
  const files = collectHtmlFiles(root);
  const summary = { updated: 0, skipped: 0, byType: {} };

  for (const rel of files.sort()) {
    const abs = path.join(root, rel);
    try {
      const result = processFile(abs, rel);
      if (result.skipped) {
        summary.skipped += 1;
      } else if (result.updated) {
        summary.updated += 1;
        summary.byType[result.type] = (summary.byType[result.type] || 0) + 1;
      }
    } catch (error) {
      console.error(`Failed: ${rel}`, error);
      process.exitCode = 1;
    }
  }

  writeProjectSchemaJs();

  console.log(
    `Schema markup: updated ${summary.updated} HTML files, skipped ${summary.skipped}, project-schema-by-slug.js written.`
  );
  console.log(summary.byType);
}

main();
