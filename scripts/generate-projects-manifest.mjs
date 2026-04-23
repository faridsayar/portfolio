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
    .map((entry) => entry.name)
    .sort(naturalSort);
}

function toAssetPath(folderName, fileName) {
  return `assets/images/Projects/${folderName}/${fileName}`;
}

function assertDefinedProjectMedia(project, availableFiles) {
  // NOTE: Explicit media mapping per project: homepage thumbnail + ordered detail images.
  if (typeof project.thumbnail !== 'string' || project.thumbnail.trim() === '') {
    throw new Error(`Project "${project.slug}" is missing "thumbnail" in project-folders.json`);
  }
  if (!Array.isArray(project.images) || project.images.length === 0) {
    throw new Error(`Project "${project.slug}" must define at least 1 "images" entry`);
  }

  const requestedFiles = [project.thumbnail, ...project.images];
  for (const fileName of requestedFiles) {
    if (!isAllowedAsset(fileName)) {
      throw new Error(`Project "${project.slug}" has unsupported image type: ${fileName}`);
    }
    if (!availableFiles.includes(fileName)) {
      throw new Error(
        `Project "${project.slug}" references missing file in "${project.folder}": ${fileName}`
      );
    }
  }
}

async function main() {
  const configRaw = await fs.readFile(CONFIG_PATH, 'utf8');
  const config = JSON.parse(configRaw);
  const projects = Array.isArray(config.projects) ? config.projects : [];

  const manifestProjects = [];
  for (const project of projects) {
    const availableFiles = await listFolderImages(project.folder);
    assertDefinedProjectMedia(project, availableFiles);
    const thumbnail = toAssetPath(project.folder, project.thumbnail);
    const images = project.images.map((fileName) => toAssetPath(project.folder, fileName));

    manifestProjects.push({
      slug: project.slug,
      title: project.title,
      desc: project.desc,
      folder: project.folder,
      thumbnail,
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
