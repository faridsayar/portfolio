#!/usr/bin/env node
/**
 * NOTE: Generates blueprint-style (technical drawing) SVG illustrations
 * for wood screws, nuts, and machine screws used on /bibliotek-festemidler.
 * Stroke uses currentColor so icons inherit the page/card text color.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'assets', 'illustrations', 'festemidler');

function svg(w, h, body) {
  // NOTE: Hardcoded dark stroke so CSS invert on .bibliotek-item__img yields white lines on dark cards.
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none" stroke="#120700" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- NOTE: Blueprint-style technical drawing for fastener reference library -->
${body}
</svg>
`;
}

/** Coarse wood-thread zigzag along a vertical shank. */
function woodThread(x, yTop, yBot, halfW = 7) {
  const steps = [];
  let y = yTop;
  let left = true;
  while (y < yBot) {
    const next = Math.min(y + 6, yBot);
    const tipX = left ? x - halfW : x + halfW;
    steps.push(`M ${x} ${y} L ${tipX} ${(y + next) / 2} L ${x} ${next}`);
    y = next;
    left = !left;
  }
  return steps.join(' ');
}

/** Fine machine thread (symmetric V). */
function machineThread(x, yTop, yBot, halfW = 5) {
  const steps = [];
  let y = yTop;
  let left = true;
  while (y < yBot) {
    const next = Math.min(y + 4, yBot);
    const tipX = left ? x - halfW : x + halfW;
    steps.push(`M ${x - 2} ${y} L ${tipX} ${(y + next) / 2} L ${x + 2} ${next}`);
    y = next;
    left = !left;
  }
  return steps.join(' ');
}

function centerline(x, y1, y2) {
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke-dasharray="3 3" opacity="0.35" />`;
}

function write(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('wrote', path.relative(path.join(__dirname, '..'), file));
}

// --- Wood screws (side elevation) ---
const woodScrews = [
  {
    file: 'treskruer/undersenket-treskrue.svg',
    draw: () => {
      // Countersunk / flat head wood screw
      return `
  ${centerline(80, 8, 192)}
  <path d="M62 28 L80 12 L98 28 Z" />
  <line x1="68" y1="28" x2="92" y2="28" />
  <path d="M74 20 L86 20" opacity="0.5" />
  <rect x="74" y="28" width="12" height="22" />
  <path d="${woodThread(80, 50, 170, 9)}" />
  <path d="M71 170 L80 188 L89 170" />
`;
    },
  },
  {
    file: 'treskruer/panhode-treskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M64 30 C64 16 96 16 96 30 L96 34 L64 34 Z" />
  <line x1="70" y1="24" x2="90" y2="24" opacity="0.5" />
  <rect x="74" y="34" width="12" height="18" />
  <path d="${woodThread(80, 52, 170, 9)}" />
  <path d="M71 170 L80 188 L89 170" />
`,
  },
  {
    file: 'treskruer/rundhodet-treskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M64 34 C64 14 96 14 96 34 L64 34 Z" />
  <line x1="70" y1="24" x2="90" y2="24" opacity="0.5" />
  <rect x="74" y="34" width="12" height="16" />
  <path d="${woodThread(80, 50, 170, 9)}" />
  <path d="M71 170 L80 188 L89 170" />
`,
  },
  {
    file: 'treskruer/ovalhodet-treskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M62 34 L68 28 C72 16 88 16 92 28 L98 34 Z" />
  <line x1="70" y1="24" x2="90" y2="24" opacity="0.5" />
  <rect x="74" y="34" width="12" height="16" />
  <path d="${woodThread(80, 50, 170, 9)}" />
  <path d="M71 170 L80 188 L89 170" />
`,
  },
  {
    file: 'treskruer/lagskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <!-- NOTE: Hex head coach / lag screw for timber -->
  <path d="M66 18 L80 12 L94 18 L94 32 L66 32 Z" />
  <line x1="70" y1="22" x2="90" y2="22" opacity="0.45" />
  <rect x="73" y="32" width="14" height="36" />
  <path d="${woodThread(80, 68, 168, 11)}" />
  <path d="M69 168 L80 188 L91 168" />
`,
  },
  {
    file: 'treskruer/spanplateskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M62 26 L80 10 L98 26 Z" />
  <path d="M74 18 L86 18" opacity="0.5" />
  <rect x="75" y="26" width="10" height="14" />
  <!-- NOTE: Deep coarse chipboard thread almost to head -->
  <path d="${woodThread(80, 40, 168, 10)}" />
  <path d="M72 168 L80 188 L88 168" />
`,
  },
  {
    file: 'treskruer/konstruksjonsskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M60 28 L80 10 L100 28 Z" />
  <circle cx="80" cy="20" r="3" opacity="0.55" />
  <rect x="74" y="28" width="12" height="40" />
  <!-- NOTE: Partial thread + unthreaded shank for structural timber -->
  <path d="${woodThread(80, 68, 168, 10)}" />
  <path d="M71 168 L80 188 L89 168" />
`,
  },
  {
    file: 'treskruer/terrasseskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M62 28 L80 12 L98 28 Z" />
  <path d="M74 18 L86 18 M80 15 L80 23" opacity="0.5" />
  <rect x="74" y="28" width="12" height="18" />
  <path d="${woodThread(80, 46, 155, 9)}" />
  <!-- NOTE: Cutting tip / type-17 style notch -->
  <path d="M71 155 L80 188 L89 155" />
  <line x1="80" y1="160" x2="80" y2="182" opacity="0.45" />
`,
  },
  {
    file: 'treskruer/dyvelskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <!-- NOTE: Dowel screw — wood thread both ends, unthreaded middle -->
  <path d="M71 12 L80 8 L89 12" />
  <path d="${woodThread(80, 12, 70, 8)}" />
  <rect x="74" y="70" width="12" height="50" />
  <path d="${woodThread(80, 120, 178, 8)}" />
  <path d="M71 178 L80 188 L89 178" />
`,
  },
  {
    file: 'treskruer/selvborende-treskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M62 28 L80 12 L98 28 Z" />
  <path d="M74 18 L86 18" opacity="0.5" />
  <rect x="74" y="28" width="12" height="20" />
  <path d="${woodThread(80, 48, 150, 9)}" />
  <!-- NOTE: Self-drilling tip (drill point) -->
  <path d="M74 150 L74 168 L80 188 L86 168 L86 150" />
  <line x1="74" y1="160" x2="86" y2="172" opacity="0.45" />
`,
  },
];

// --- Nuts (top + side where useful) ---
const nuts = [
  {
    file: 'muttere/sekskantmutter.svg',
    draw: () => `
  <!-- NOTE: Hex nut — plan view + elevation -->
  <polygon points="80,28 108,44 108,76 80,92 52,76 52,44" />
  <circle cx="80" cy="60" r="14" />
  <circle cx="80" cy="60" r="8" opacity="0.45" />
  <rect x="52" y="118" width="56" height="28" />
  <ellipse cx="80" cy="118" rx="28" ry="8" />
  <ellipse cx="80" cy="146" rx="28" ry="8" />
  <circle cx="80" cy="132" r="8" opacity="0.45" />
`,
  },
  {
    file: 'muttere/lasemutter.svg',
    draw: () => `
  <!-- NOTE: Nyloc / prevailing-torque lock nut -->
  <polygon points="80,24 110,42 110,78 80,96 50,78 50,42" />
  <circle cx="80" cy="60" r="14" />
  <circle cx="80" cy="60" r="8" opacity="0.4" />
  <rect x="52" y="118" width="56" height="22" />
  <path d="M52 140 C52 152 108 152 108 140" opacity="0.85" />
  <ellipse cx="80" cy="118" rx="28" ry="7" />
  <ellipse cx="80" cy="148" rx="22" ry="6" opacity="0.55" />
`,
  },
  {
    file: 'muttere/flensmutter.svg',
    draw: () => `
  <polygon points="80,30 104,44 104,72 80,86 56,72 56,44" />
  <circle cx="80" cy="58" r="12" />
  <circle cx="80" cy="58" r="7" opacity="0.45" />
  <ellipse cx="80" cy="86" rx="34" ry="10" />
  <rect x="56" y="120" width="48" height="20" />
  <ellipse cx="80" cy="120" rx="24" ry="6" />
  <ellipse cx="80" cy="140" rx="36" ry="10" />
`,
  },
  {
    file: 'muttere/vingemutter.svg',
    draw: () => `
  <!-- NOTE: Wing nut — plan-ish elevation -->
  <path d="M40 70 C40 40 70 36 80 58 C90 36 120 40 120 70 L110 78 C100 60 90 70 80 78 C70 70 60 60 50 78 Z" />
  <circle cx="80" cy="78" r="16" />
  <circle cx="80" cy="78" r="8" opacity="0.45" />
  <rect x="64" y="94" width="32" height="28" />
  <ellipse cx="80" cy="122" rx="16" ry="5" />
`,
  },
  {
    file: 'muttere/hettemutter.svg',
    draw: () => `
  <!-- NOTE: Cap / acorn nut — dome elevation + hex plan -->
  <polygon points="80,22 104,36 104,56 80,70 56,56 56,36" />
  <circle cx="80" cy="46" r="9" opacity="0.45" />
  <path d="M54 120 L54 86 C54 58 106 58 106 86 L106 120" />
  <ellipse cx="80" cy="120" rx="26" ry="8" />
  <path d="M62 86 C62 68 98 68 98 86" opacity="0.55" />
`,
  },
  {
    file: 'muttere/firkantmutter.svg',
    draw: () => `
  <rect x="40" y="24" width="80" height="80" />
  <circle cx="80" cy="64" r="18" />
  <circle cx="80" cy="64" r="10" opacity="0.45" />
  <rect x="48" y="124" width="64" height="30" />
  <line x1="48" y1="124" x2="112" y2="124" />
  <line x1="48" y1="154" x2="112" y2="154" />
  <circle cx="80" cy="139" r="9" opacity="0.4" />
`,
  },
  {
    file: 'muttere/t-mutter.svg',
    draw: () => `
  <!-- NOTE: T-nut — barrel + pronged flange -->
  <rect x="66" y="36" width="28" height="74" />
  <path d="${machineThread(80, 44, 100, 7)}" opacity="0.7" />
  <rect x="36" y="110" width="88" height="16" />
  <path d="M46 126 L40 156 M66 126 L60 156 M94 126 L100 156 M114 126 L120 156" />
  <circle cx="80" cy="42" r="9" opacity="0.45" />
`,
  },
  {
    file: 'muttere/blindmutter.svg',
    draw: () => `
  <!-- NOTE: Rivet nut / blind insert — flange + deformable body -->
  <ellipse cx="80" cy="32" rx="34" ry="11" />
  <rect x="54" y="32" width="52" height="14" />
  <path d="M58 46 L58 128 C58 152 102 152 102 128 L102 46" />
  <path d="${machineThread(80, 68, 118, 8)}" opacity="0.65" />
  <ellipse cx="80" cy="128" rx="22" ry="9" opacity="0.55" />
`,
  },
  {
    file: 'muttere/kontramutter.svg',
    draw: () => `
  <!-- NOTE: Jam / lock / counter nut — thin hex profile -->
  <polygon points="80,40 112,58 112,86 80,104 48,86 48,58" />
  <circle cx="80" cy="72" r="14" />
  <circle cx="80" cy="72" r="8" opacity="0.45" />
  <rect x="50" y="128" width="60" height="14" />
  <ellipse cx="80" cy="128" rx="30" ry="6" />
  <ellipse cx="80" cy="142" rx="30" ry="6" />
`,
  },
  {
    file: 'muttere/sveismutter.svg',
    draw: () => `
  <!-- NOTE: Weld nut with projection bosses -->
  <polygon points="80,36 106,52 106,80 80,96 54,80 54,52" />
  <circle cx="80" cy="66" r="12" />
  <circle cx="80" cy="66" r="7" opacity="0.45" />
  <circle cx="58" cy="48" r="4" />
  <circle cx="102" cy="48" r="4" />
  <circle cx="58" cy="84" r="4" />
  <circle cx="102" cy="84" r="4" />
  <rect x="54" y="120" width="52" height="22" />
  <ellipse cx="80" cy="120" rx="26" ry="6" />
  <ellipse cx="80" cy="142" rx="26" ry="6" />
`,
  },
];

// --- Machine screws / bolts ---
const screws = [
  {
    file: 'skruer/sekskantbolt.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M64 16 L80 10 L96 16 L96 34 L64 34 Z" />
  <rect x="72" y="34" width="16" height="50" />
  <path d="${machineThread(80, 84, 168, 8)}" />
  <line x1="72" y1="168" x2="88" y2="168" />
`,
  },
  {
    file: 'skruer/maskinskrue-undersenket.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M62 30 L80 12 L98 30 Z" />
  <path d="M74 20 L86 20" opacity="0.5" />
  <rect x="74" y="30" width="12" height="28" />
  <path d="${machineThread(80, 58, 170, 6)}" />
  <line x1="74" y1="170" x2="86" y2="170" />
`,
  },
  {
    file: 'skruer/maskinskrue-panhode.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M64 28 C64 16 96 16 96 28 L96 34 L64 34 Z" />
  <path d="M70 24 L90 24" opacity="0.5" />
  <rect x="74" y="34" width="12" height="26" />
  <path d="${machineThread(80, 60, 170, 6)}" />
  <line x1="74" y1="170" x2="86" y2="170" />
`,
  },
  {
    file: 'skruer/innvendig-sekskantskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <!-- NOTE: Socket head cap screw (Allen) -->
  <rect x="62" y="14" width="36" height="28" rx="2" />
  <polygon points="80,20 88,24 88,32 80,36 72,32 72,24" opacity="0.7" />
  <rect x="72" y="42" width="16" height="36" />
  <path d="${machineThread(80, 78, 172, 7)}" />
  <line x1="72" y1="172" x2="88" y2="172" />
`,
  },
  {
    file: 'skruer/vognbolt.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <!-- NOTE: Carriage bolt — domed head + square underhead -->
  <path d="M60 40 C60 16 100 16 100 40 Z" />
  <rect x="68" y="40" width="24" height="18" />
  <rect x="74" y="58" width="12" height="28" />
  <path d="${machineThread(80, 86, 172, 7)}" />
  <line x1="73" y1="172" x2="87" y2="172" />
`,
  },
  {
    file: 'skruer/settskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <!-- NOTE: Set screw — no head, hex socket, cup point -->
  <rect x="68" y="24" width="24" height="20" />
  <polygon points="80,28 88,32 88,40 80,44 72,40 72,32" opacity="0.7" />
  <path d="${machineThread(80, 44, 160, 8)}" />
  <path d="M72 160 L80 178 L88 160" />
`,
  },
  {
    file: 'skruer/oyebolt.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <circle cx="80" cy="36" r="22" />
  <circle cx="80" cy="36" r="12" />
  <rect x="72" y="58" width="16" height="36" />
  <path d="${machineThread(80, 94, 172, 7)}" />
  <line x1="73" y1="172" x2="87" y2="172" />
`,
  },
  {
    file: 'skruer/stiftbolt.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <!-- NOTE: Stud bolt — thread both ends, plain middle -->
  <path d="${machineThread(80, 16, 60, 7)}" />
  <rect x="73" y="60" width="14" height="70" />
  <path d="${machineThread(80, 130, 180, 7)}" />
`,
  },
  {
    file: 'skruer/selvborende-maskinskrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M64 28 C64 16 96 16 96 28 L96 34 L64 34 Z" />
  <path d="M70 24 L90 24" opacity="0.5" />
  <rect x="74" y="34" width="12" height="20" />
  <path d="${machineThread(80, 54, 145, 6)}" />
  <path d="M74 145 L74 162 L80 182 L86 162 L86 145" />
`,
  },
  {
    file: 'skruer/torx-skrue.svg',
    draw: () => `
  ${centerline(80, 8, 192)}
  <path d="M62 30 L80 12 L98 30 Z" />
  <!-- NOTE: Torx (6-lobe) drive recess indication -->
  <path d="M80 16 L84 20 L82 24 L86 26 L82 28 L84 32 L80 30 L76 32 L78 28 L74 26 L78 24 L76 20 Z" opacity="0.75" />
  <rect x="74" y="30" width="12" height="26" />
  <path d="${machineThread(80, 56, 168, 6)}" />
  <line x1="74" y1="168" x2="86" y2="168" />
`,
  },
];

for (const item of [...woodScrews, ...nuts, ...screws]) {
  write(item.file, svg(160, 200, item.draw()));
}

console.log('Done:', woodScrews.length + nuts.length + screws.length, 'SVGs');
