// NOTE: Per-project English meta descriptions and keywords for static /prosjekter/{slug} pages.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** @type {Record<string, { descEn?: string, keywords?: string }> | null} */
let cachedMeta = null;

function loadProjectSeoMeta() {
  if (cachedMeta) return cachedMeta;
  const raw = fs.readFileSync(path.join(root, 'assets/data/project-seo-meta.json'), 'utf8');
  cachedMeta = JSON.parse(raw);
  return cachedMeta;
}

/** NOTE: Resolves per-project SEO copy with sensible fallbacks when a slug has no curated entry. */
export function resolveProjectSeoMeta(project) {
  const entry = loadProjectSeoMeta()[project.slug] || {};
  return {
    descEn:
      entry.descEn ||
      `Formaa case study: ${project.title} — industrial and product design from concept to production.`,
    keywords:
      entry.keywords ||
      `${project.slug}, prosjekt, industridesign, produktdesign, prototyping, Formaa, Norge`,
  };
}

/** NOTE: Hub-level English description and keywords for /prosjekter. */
export const PROJECTS_HUB_SEO = {
  descEn:
    'Formaa project portfolio — industrial and product design case studies from concept through prototype and production.',
  keywords:
    'prosjekter, portefølje, industridesign, produktdesign, case study, prototyping, Formaa, Norge',
};
