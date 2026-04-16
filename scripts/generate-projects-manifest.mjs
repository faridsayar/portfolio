import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const PROJECTS_ROOT = path.join(ROOT_DIR, 'assets', 'images', 'Projects');
const CONFIG_PATH = path.join(ROOT_DIR, 'project-folders.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'assets', 'data', 'projects-manifest.json');
const OUTPUT_JS_PATH = path.join(ROOT_DIR, 'assets', 'data', 'projects-manifest.js');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function isAllowedAsset(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

async function listFolderImages(folderName) {
  const folderPath = path.join(PROJECTS_ROOT, folderName);
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && isAllowedAsset(entry.name))
    .map((entry) => `assets/images/Projects/${folderName}/${entry.name}`)
    .sort(naturalSort);
}

async function main() {
  const configRaw = await fs.readFile(CONFIG_PATH, 'utf8');
  const config = JSON.parse(configRaw);
  const projects = Array.isArray(config.projects) ? config.projects : [];

  const manifestProjects = [];
  for (const project of projects) {
    const images = await listFolderImages(project.folder);
    manifestProjects.push({
      slug: project.slug,
      title: project.title,
      desc: project.desc,
      lead: project.lead,
      folder: project.folder,
      images,
    });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    projects: manifestProjects,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(
    OUTPUT_JS_PATH,
    `window.__PROJECTS_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`,
    'utf8'
  );

  console.log(`Generated ${toPosix(path.relative(ROOT_DIR, OUTPUT_PATH))}`);
  console.log(`Generated ${toPosix(path.relative(ROOT_DIR, OUTPUT_JS_PATH))}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
