#!/usr/bin/env node
// NOTE: Grayscale and normalize partner logos to a shared height; writes .webp files to assets/company-logos/.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logosDir = path.join(root, 'assets/company-logos');
const configPath = path.join(root, 'assets/data/company-partners.json');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

function isAllowedAsset(fileName) {
  return ALLOWED_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

// NOTE: Near-black fill → transparent so light-on-dark partner marks keep their own colors without a box.
async function stripDarkBackground(sourcePath) {
  const { data, info } = await sharp(sourcePath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 40 && g < 40 && b < 40) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  });
}

async function processLogo({ sourcePath, outputPath, logoHeight, invertLogo }) {
  // NOTE: invertLogo = source is already light-on-dark; strip fill and skip CSS invert (see --inverted-source).
  let pipeline = invertLogo ? await stripDarkBackground(sourcePath) : sharp(sourcePath).rotate();

  pipeline = pipeline
    .grayscale()
    .resize({ height: logoHeight, fit: 'inside', withoutEnlargement: false });

  const tempPath = `${outputPath}.tmp.webp`;
  await pipeline.webp({ quality: 90, effort: 4 }).toFile(tempPath);
  await fs.promises.rename(tempPath, outputPath);

  const meta = await sharp(outputPath).metadata();
  return { width: meta.width, height: meta.height };
}

async function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const logoHeight = Number(config.logoHeight) || 48;
  const partners = config.partners || [];

  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  let processed = 0;

  for (const partner of partners) {
    const outputName = partner.logo;
    if (!outputName) {
      console.warn(`Skipping "${partner.name || 'partner'}": missing "logo" output filename.`);
      continue;
    }

    const sourceName = partner.source || outputName;
    const sourcePath = path.join(logosDir, sourceName);
    const outputPath = path.join(logosDir, outputName);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Missing source file for "${partner.name}": ${sourcePath}`);
      continue;
    }

    if (!isAllowedAsset(sourceName)) {
      console.warn(`Unsupported file type for "${partner.name}": ${sourceName}`);
      continue;
    }

    const { width, height } = await processLogo({
      sourcePath,
      outputPath,
      logoHeight,
      invertLogo: Boolean(partner.invertLogo),
    });
    console.log(
      `Processed ${sourceName} → ${outputName} (${width}×${height}px, height target ${logoHeight}px)`
    );
    processed += 1;
  }

  console.log(`Done. ${processed} logo(s) processed in ${path.relative(root, logosDir)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
