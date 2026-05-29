#!/usr/bin/env node
// NOTE: Builds company-partners-manifest.js from assets/data/company-partners.json for static pages.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'assets/data/company-partners.json');
const outputPath = path.join(root, 'assets/data/company-partners-manifest.js');

const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const output = `// NOTE: Partner logos for partner-logos-section — edit assets/data/company-partners.json and run pnpm generate:company-partners-manifest.
window.__COMPANY_PARTNERS_MANIFEST = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log(`Wrote ${path.relative(root, outputPath)} (${data.partners?.length || 0} partners).`);
