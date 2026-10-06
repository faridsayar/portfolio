/**
 * NOTE: Builds a print-ready A4 HTML catalogue (white bg, black text, 4 materials
 * per page, group sidebar) and renders it to PDF via headless Chrome.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const katalogDir = path.join(root, 'katalog');
const outHtmlPath = path.join(root, 'katalog', 'materialkatalog-print.html');
const outPdfPath = path.join(root, 'katalog', 'materialkatalog.pdf');
/** NOTE: Read type pages in stable order (hub no longer holds material cards). */
const KATALOG_TYPE_ORDER = [
  'tre',
  'metaller',
  'plast',
  'keramikk',
  'blandinger',
  'tekstil',
  'andre',
];

const CHROME =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function stripTags(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMaterials(html) {
  const groups = [];
  const sectionRe =
    /<section[^>]*data-katalog-group="([^"]+)"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)<\/section>/g;
  let sm;
  while ((sm = sectionRe.exec(html))) {
    const id = sm[1];
    const title = stripTags(sm[2]);
    const body = sm[3];
    const materials = [];
    const articleRe = /<article\s+class="katalog-material"[^>]*>([\s\S]*?)<\/article>/g;
    let am;
    while ((am = articleRe.exec(body))) {
      const art = am[0];
      const name = stripTags((art.match(/katalog-material__title">([\s\S]*?)<\/h3>/) || [])[1]);
      const text = stripTags((art.match(/katalog-material__text">([\s\S]*?)<\/p>/) || [])[1]);
      const imgRel = (
        (art.match(/katalog-material__img"[^>]*src="([^"]+)"/) || [])[1] || ''
      ).replace(/^\//, '');
      const imgAbs = imgRel ? path.join(root, imgRel) : '';
      const props = [];
      const propRe =
        /<div class="katalog-material__prop">\s*<span class="katalog-material__label">([^<]+)<\/span>\s*<span class="katalog-material__value"\s*>([\s\S]*?)<\/span\s*>\s*<\/div>/g;
      let pm;
      while ((pm = propRe.exec(art))) {
        const label = pm[1].trim();
        const raw = pm[2];
        const rating = raw.match(/aria-label="[^"]*?\s+(\d+)\s+av\s+5"/);
        if (rating) {
          let kind = 'other';
          if (/Fleks/i.test(label)) kind = 'flex';
          else if (/Styrke/i.test(label)) kind = 'strength';
          else if (/Pris/i.test(label)) kind = 'price';
          else if (/Gjenv/i.test(label)) kind = 'recycle';
          else if (/ledningsevne/i.test(label) && /Elektrisk/i.test(label)) kind = 'conductivity';
          else if (/Varmeledningsevne/i.test(label)) kind = 'heat';
          props.push({ label, type: 'rating', kind, score: Number(rating[1]) });
        } else {
          props.push({ label, type: 'text', value: stripTags(raw) });
        }
      }
      materials.push({ name, text, imgAbs, props });
    }
    groups.push({ id, title, materials });
  }
  return groups;
}

/** NOTE: Inline rating icons for print (no external sprite). */
function ratingIcons(kind, score) {
  const icon =
    {
      flex: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 4c8 4 8 12 0 16"/></svg>`,
      strength: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.5l5 5L19.5 6.5"/></svg>`,
      price: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3.2 4.5 1.5 4.5 3.3-2 3-4.5 3-4.5-1.3-4.5-3"/></svg>`,
      recycle: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4c-6.2.4-10.8 3.2-13.2 7.3-1.7 2.9-2 6.1-1.5 8.7 2.6.5 5.8.2 8.7-1.5C18.1 16.1 20.8 11.4 21.2 5.2 21.3 4.6 20.6 3.9 20 4z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M10 14c2.2-2.4 4.8-4.2 8-5.5"/></svg>`,
      conductivity: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.2 2.5L4.8 13.2c-.4.5 0 1.3.7 1.3h5.1l-1.3 7c-.2.8.8 1.3 1.4.7l8.4-10.7c.4-.5 0-1.3-.7-1.3h-5.1l1.3-7c.2-.8-.8-1.3-1.4-.7z"/></svg>`,
      heat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M8 20c0-3 2.5-3 2.5-6S8 11 8 8s2.5-3 2.5-6"/><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M13.5 20c0-3 2.5-3 2.5-6s-2.5-3-2.5-6 2.5-3 2.5-6"/></svg>`,
    }[kind] || '';

  let html = `<span class="rating rating--${kind}">`;
  for (let i = 1; i <= 5; i += 1) {
    const on = i <= score ? ' is-on' : '';
    html += `<span class="rating__icon${on}">${icon}</span>`;
  }
  html += `</span>`;
  return html;
}

function fileUrl(absPath) {
  return `file://${encodeURI(absPath)}`;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function renderCard(mat) {
  const propsHtml = mat.props
    .map((p) => {
      const value = p.type === 'rating' ? ratingIcons(p.kind, p.score) : escapeHtml(p.value);
      return `<div class="prop"><span class="prop__label">${escapeHtml(p.label)}</span><span class="prop__value">${value}</span></div>`;
    })
    .join('');

  const img = mat.imgAbs
    ? `<img class="card__img" src="${fileUrl(mat.imgAbs)}" alt="" />`
    : `<div class="card__img card__img--empty"></div>`;

  return `
    <article class="card">
      <div class="card__top">
        ${img}
        <div class="card__intro">
          <h3 class="card__title">${escapeHtml(mat.name)}</h3>
          <p class="card__text">${escapeHtml(mat.text)}</p>
        </div>
      </div>
      <div class="card__props">${propsHtml}</div>
    </article>`;
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(groups) {
  const pages = [];
  for (const group of groups) {
    // NOTE: New group always starts on a new page; fill with up to 4 materials each.
    for (const mats of chunk(group.materials, 4)) {
      const cards = mats.map(renderCard).join('\n');
      // Pad empty slots so the 4-row grid stays even when a page has fewer than 4.
      const pad = 4 - mats.length;
      const fillers = Array.from(
        { length: pad },
        () => `<div class="card card--empty"></div>`
      ).join('');
      pages.push(`
        <section class="page">
          <aside class="sidebar">
            <div class="sidebar__group">${escapeHtml(group.title.toUpperCase())}</div>
            <div class="sidebar__brand">formaa</div>
          </aside>
          <div class="cards">${cards}${fillers}</div>
        </section>`);
    }
  }

  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8" />
  <title>Materialkatalog — Formaa</title>
  <style>
    /* NOTE: Print catalogue — A4, white page, black type, 4 material cards per page. */
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: Helvetica, Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      height: 297mm;
      display: grid;
      grid-template-columns: 14mm 1fr;
      page-break-after: always;
      break-after: page;
      background: #fff;
    }
    .page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .sidebar {
      position: relative;
      border-right: 1px solid #ddd;
      background: #fff;
    }
    .sidebar__group {
      position: absolute;
      top: 10mm;
      left: 50%;
      transform: translateX(-50%) rotate(-90deg);
      transform-origin: center center;
      white-space: nowrap;
      font-size: 18pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #c8c8c8;
    }
    .sidebar__brand {
      position: absolute;
      bottom: 12mm;
      left: 50%;
      transform: translateX(-50%) rotate(-90deg);
      transform-origin: center center;
      white-space: nowrap;
      font-size: 8pt;
      font-weight: 500;
      letter-spacing: 0.08em;
      color: #888;
    }
    .cards {
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      gap: 2.5mm;
      padding: 6mm 7mm 6mm 5mm;
      min-height: 0;
    }
    .card {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #fff;
      border: 1px solid #e6e6e6;
      border-radius: 3mm;
      padding: 3.5mm 4mm;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2.5mm;
    }
    .card--empty {
      border: none;
      background: transparent;
    }
    .card__top {
      display: grid;
      grid-template-columns: 28mm 1fr;
      gap: 3.5mm;
      align-items: start;
    }
    .card__img {
      width: 28mm;
      height: 28mm;
      object-fit: cover;
      border-radius: 1.5mm;
      background: #f2f2f2;
      display: block;
    }
    .card__img--empty { background: #eee; }
    .card__title {
      margin: 0 0 1.5mm;
      font-size: 16pt;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: #000;
    }
    .card__text {
      margin: 0;
      font-size: 7.5pt;
      line-height: 1.35;
      color: #111;
    }
    .card__props {
      display: flex;
      flex-direction: column;
      gap: 0.9mm;
      min-height: 0;
    }
    .prop {
      display: grid;
      grid-template-columns: 42mm 1fr;
      gap: 2mm;
      align-items: center;
    }
    .prop__label {
      font-size: 7pt;
      font-weight: 700;
      color: #000;
    }
    .prop__value {
      font-size: 7pt;
      font-weight: 400;
      color: #111;
      line-height: 1.25;
    }
    .rating {
      display: inline-flex;
      align-items: center;
      gap: 1.2mm;
    }
    .rating__icon {
      display: inline-flex;
      width: 3.2mm;
      height: 3.2mm;
      color: #000;
      opacity: 0.2;
    }
    .rating__icon.is-on { opacity: 1; }
    .rating--recycle .rating__icon.is-on { color: #2f7a3e; }
    .rating--conductivity .rating__icon.is-on { color: #2f6fed; }
    .rating--heat .rating__icon.is-on { color: #e85d04; }
    .rating__icon svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`;
}

const htmlSource = KATALOG_TYPE_ORDER.map((slug) => {
  const file = path.join(katalogDir, slug, 'index.html');
  if (!fs.existsSync(file)) {
    console.error(`Missing catalogue type page: ${file}`);
    process.exit(1);
  }
  return fs.readFileSync(file, 'utf8');
}).join('\n');
const groups = extractMaterials(htmlSource);
const total = groups.reduce((n, g) => n + g.materials.length, 0);
if (total === 0) {
  console.error('No materials found in katalog/{type}/index.html pages');
  process.exit(1);
}

const printHtml = buildHtml(groups);
fs.writeFileSync(outHtmlPath, printHtml, 'utf8');
console.log(`Wrote ${outHtmlPath} (${total} materials, ${groups.length} groups)`);

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}`);
  process.exit(1);
}

const result = spawnSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outPdfPath}`,
    '--print-to-pdf-no-header',
    fileUrl(outHtmlPath),
  ],
  { encoding: 'utf8' }
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout || 'Chrome print failed');
  process.exit(result.status || 1);
}

const sizeKb = Math.round(fs.statSync(outPdfPath).size / 1024);
console.log(`Wrote ${outPdfPath} (${sizeKb} KB)`);
