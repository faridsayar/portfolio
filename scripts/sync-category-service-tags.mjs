#!/usr/bin/env node
// NOTE: Restores cross-service category chips (+ EN intent landings) on all category/{service}/{region}.html pages.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const categoryDir = path.join(root, 'category');

const CATEGORIES = [
  { slug: 'konseptutvikling', label: 'Konseptutvikling' },
  { slug: 'produktdesign', label: 'Produktdesign' },
  { slug: 'emballasjedesign', label: 'Emballasjedesign' },
  { slug: 'prototyping', label: 'Prototyping' },
  { slug: 'brukerundersokelse', label: 'Brukerundersøkelse' },
  { slug: 'validering', label: 'Validering' },
  { slug: 'industridesign', label: 'Industridesign' },
  { slug: 'design', label: 'Design' },
  { slug: 'branding', label: 'Branding' },
  { slug: 'markedsundersokelse', label: 'Markedsundersøkelse' },
  { slug: 'visualisering', label: 'Visualisering' },
  { slug: 'redesign', label: 'Redesign' },
  { slug: '3d-modelering', label: '3D-modelering' },
  { slug: 'cad-modelering', label: 'CAD-modelering' },
  { slug: 'teknisk-tegning', label: 'Teknisk tegning' },
];

const EN_SERVICES = [
  { href: '/en/product-rendering', label: 'Product rendering' },
  { href: '/en/cad-modeling', label: 'CAD modeling' },
  { href: '/en/product-animation', label: 'Product animation' },
];

const LES_MER_BLOCK =
  /[\t ]*<!-- NOTE: User-value links replace cross-service category tag grid\. -->\s*<nav class="service-tags" aria-label="Les mer" style="margin-top: 0\.75rem">[\s\S]*?<\/nav>/;

function buildTagRow({ ariaLabel, items, getHref }) {
  const links = items
    .map((item, index) => {
      const href = getHref(item);
      const label = item.label;
      const prefix = index === 0 ? '            ' : '            >';
      return `${prefix}<a class="service-tag" href="${href}">${label}</a`;
    })
    .join('\n');

  return `          <div class="service-tags" aria-label="${ariaLabel}" style="margin-top: 0.75rem">
${links}>
          </div>`;
}

function buildReplacement(region) {
  const categoryRow = buildTagRow({
    ariaLabel: 'Velg kategori',
    items: CATEGORIES,
    getHref: (item) => `/category/${item.slug}/${region}`,
  });

  const enRow = buildTagRow({
    ariaLabel: 'English services',
    items: EN_SERVICES,
    getHref: (item) => item.href,
  });

  return `          <!-- NOTE: Cross-service category chips — same region as current page; includes EN intent landings. -->
${categoryRow}

${enRow}`;
}

function main() {
  const files = fs.readdirSync(categoryDir, { withFileTypes: true }).flatMap((serviceDir) => {
    if (!serviceDir.isDirectory()) return [];
    const servicePath = path.join(categoryDir, serviceDir.name);
    return fs
      .readdirSync(servicePath)
      .filter((name) => name.endsWith('.html'))
      .map((name) => path.join(servicePath, name));
  });

  let updated = 0;

  for (const filePath of files) {
    const region = path.basename(filePath, '.html');
    const source = fs.readFileSync(filePath, 'utf8');

    if (!LES_MER_BLOCK.test(source)) {
      console.warn(`Skipping (no Les mer block): ${path.relative(root, filePath)}`);
      continue;
    }

    const next = source.replace(LES_MER_BLOCK, buildReplacement(region));
    if (next === source) continue;

    fs.writeFileSync(filePath, next);
    updated += 1;
  }

  console.log(`Updated ${updated} category page(s).`);
}

main();
