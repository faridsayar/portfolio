#!/usr/bin/env node
// NOTE: Regenerates robots.txt, llms.txt, and ai.txt for search engines and AI crawlers.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AI_IMPORTANT_ROUTES,
  LLMS_CATEGORY_HUBS,
  LLMS_BLOGG_HUBS,
  RETIRED_ROUTES,
  SITE,
  STATIC_HUB_ROUTES,
} from './lib/public-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SITE_DESCRIPTION =
  'Produktutvikling og 3D-visualisering for gründere og startups i Norge — fra produktidé og prototype til CAD, modellering og produksjon. Designbyrå for fysiske produkter og hardware-startups.';

const AI_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'PerplexityBot',
  'Applebot-Extended',
  'Bytespider',
  'cohere-ai',
];

function abs(route) {
  return `${SITE}${route}`;
}

function writeRobotsTxt() {
  const aiBlocks = AI_AGENTS.map(
    (agent) => `# NOTE: Allow ${agent} to index public marketing pages; see ${abs('/llms.txt')}.
User-agent: ${agent}
Allow: /
Allow: /llms.txt
Allow: /ai.txt
`
  ).join('\n');

  const content = `# NOTE: Robots policy and sitemap for search engines. Public routes are extensionless;
# legacy .html and flat prosjekt-/blogg- slugs redirect via .htaccess (see sitemap.xml).
# LLM/AI discovery: ${abs('/llms.txt')} and ${abs('/ai.txt')}.
User-agent: *
Allow: /
Allow: /llms.txt
Allow: /ai.txt
Disallow: /article-template
Disallow: /article-template.html
Disallow: /gallery
Disallow: /gallery.html

${aiBlocks}Sitemap: ${abs('/sitemap.xml')}
`;

  fs.writeFileSync(path.join(root, 'robots.txt'), content);
}

function writeLlmsTxt() {
  const hubUrls = [
    ...STATIC_HUB_ROUTES,
    '/prosjekter',
    ...LLMS_BLOGG_HUBS.filter((r) => r !== '/blogg'),
    '/blogg',
    ...LLMS_CATEGORY_HUBS,
    '/sitemap.xml',
  ];

  const uniqueUrls = [...new Set(hubUrls.map(abs))];

  const content = `# NOTE: LLM discovery file describing Formaa website scope and important public URLs.
site: ${SITE}
name: Formaa
legal_name: Formaa AS
org_number: 937772505
language: no
description: ${SITE_DESCRIPTION}

important_urls:
${uniqueUrls.map((url) => `- ${url}`).join('\n')}

retired_urls:
${RETIRED_ROUTES.map((route) => `- ${abs(route)}`).join('\n')}

policies:
- content_usage: public_website_content
- attribution: required
- pii: do_not_collect
- preferred_summary: Produktutvikling og 3D-visualisering for startups i Norge
- contact: ${abs('/application-form')}
- ai_companion: ${abs('/ai.txt')}
`;

  fs.writeFileSync(path.join(root, 'llms.txt'), content);
}

function writeAiTxt() {
  const content = `# NOTE: AI crawler companion file — short index pointing to llms.txt and sitemap.
site: ${SITE}
name: Formaa
legal_name: Formaa AS
org_number: 937772505
language: no
summary: Produktutvikling og 3D-visualisering for gründere og startups i Norge.
description: ${SITE_DESCRIPTION}

allow: /
llms: ${abs('/llms.txt')}
sitemap: ${abs('/sitemap.xml')}
contact: ${abs('/application-form')}

primary_topics: produktutvikling, 3D-visualisering, industridesign, produktdesign, prototype, 3D-modellering, 3D-design, visualisering, designbyrå, skisseworkshop, idéworkshop, arrangement

important_urls:
${AI_IMPORTANT_ROUTES.map(abs).join('\n')}
`;

  fs.writeFileSync(path.join(root, 'ai.txt'), content);
}

writeRobotsTxt();
writeLlmsTxt();
writeAiTxt();
console.log('Wrote robots.txt, llms.txt, and ai.txt.');
