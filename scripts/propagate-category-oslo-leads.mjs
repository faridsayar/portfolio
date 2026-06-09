// NOTE: Copies section-lead copy from each category/oslo.html to other counties, keeping location-specific endings.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const categoryRoot = path.join(root, 'category');
const counties = ['akershus', 'buskerud', 'ostfold', 'norge'];

function extractSectionLead(html) {
  const match = html.match(/<p class="section-lead">([\s\S]*?)<\/p>/);
  return match ? match[1] : null;
}

function replaceSectionLead(html, inner) {
  return html.replace(
    /<p class="section-lead">[\s\S]*?<\/p>/,
    `<p class="section-lead">${inner}</p>`
  );
}

function localizeLead(innerHtml, county, category) {
  let text = innerHtml;

  const regionalHolder = {
    akershus: 'Vi holder til nært Akershus,',
    buskerud: 'Vi holder til nært Buskerud,',
    ostfold: 'Vi holder til nært Østfold,',
  };

  // NOTE: Prototyping keeps “Vi holder til i Oslo” on regional county pages; only the trailing area name changes.
  const keepOsloHolder = category === 'prototyping';

  if (county !== 'norge' && !keepOsloHolder) {
    text = text.replace(/Vi holder til i Oslo,/g, regionalHolder[county]);
  }

  const regionalHele = {
    akershus: 'i hele Akershus',
    buskerud: 'i hele Buskerud',
    ostfold: 'i hele Østfold',
    norge: 'i hele Norge',
  };

  text = text.replace(/i\s+hele Oslo og omegn/g, regionalHele[county]);

  const regionalKunder = {
    akershus: 'for kunder i Akershus',
    buskerud: 'for kunder i Buskerud',
    ostfold: 'for kunder i Østfold',
    norge: 'for kunder i hele Norge',
  };

  text = text.replace(/for kunder i Oslo/g, regionalKunder[county]);

  const regionalHjelper = {
    akershus: 'hjelper deg i hele Akershus',
    buskerud: 'hjelper deg i hele Buskerud',
    ostfold: 'hjelper deg i hele Østfold',
    norge: 'hjelper deg i hele Norge',
  };

  text = text.replace(/hjelper deg i hele Oslo/g, regionalHjelper[county]);

  return text;
}

const categories = fs
  .readdirSync(categoryRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(categoryRoot, name, 'oslo.html')));

let updated = 0;

for (const category of categories) {
  const osloPath = path.join(categoryRoot, category, 'oslo.html');
  const osloHtml = fs.readFileSync(osloPath, 'utf8');
  const osloLead = extractSectionLead(osloHtml);
  if (!osloLead) {
    console.warn(`Skip ${category}: no section-lead in oslo.html`);
    continue;
  }

  for (const county of counties) {
    const countyPath = path.join(categoryRoot, category, `${county}.html`);
    if (!fs.existsSync(countyPath)) continue;

    const countyHtml = fs.readFileSync(countyPath, 'utf8');
    const localizedLead = localizeLead(osloLead, county, category);
    const nextHtml = replaceSectionLead(countyHtml, localizedLead);

    if (nextHtml !== countyHtml) {
      fs.writeFileSync(countyPath, nextHtml);
      updated += 1;
      console.log(`Updated category/${category}/${county}.html`);
    }
  }
}

console.log(`Done. Updated ${updated} files.`);
