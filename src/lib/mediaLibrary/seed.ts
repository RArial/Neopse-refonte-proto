import type { MediaFolder, MediaImage } from '@/types/mediaLibrary';

// « Site » est la seule racine : un dossier par module dessous, plus « Apparence ».
export const ROOT_FOLDER_ID = 'site';

export const SEED_FOLDERS: MediaFolder[] = [
  { id: ROOT_FOLDER_ID, name: 'Site', parentId: null },
  { id: 'actualites', name: 'Actualités', parentId: ROOT_FOLDER_ID },
  { id: 'agenda', name: 'Agenda', parentId: ROOT_FOLDER_ID },
  { id: 'apparence', name: 'Apparence', parentId: ROOT_FOLDER_ID },
];

interface Scene {
  sky: [string, string];
  hills: [string, string];
  sun: string;
}

const SCENES: Scene[] = [
  { sky: ['#bfe3f2', '#f6f1e3'], hills: ['#7fb38a', '#4f8a63'], sun: '#f7c948' },
  { sky: ['#f8c9a0', '#fde9d3'], hills: ['#c98b6b', '#8f5a45'], sun: '#ffefc2' },
  { sky: ['#9ec5e8', '#e3eef8'], hills: ['#6c8fb3', '#3e6188'], sun: '#ffffff' },
  { sky: ['#d9d2f0', '#f4f1fb'], hills: ['#9a8cc4', '#665a94'], sun: '#ffd6e8' },
  { sky: ['#c7ecd9', '#f0faf4'], hills: ['#5fa88a', '#2f7559'], sun: '#fff3b0' },
  { sky: ['#ffe2a8', '#fff6df'], hills: ['#d6a34f', '#9c6b22'], sun: '#ffffff' },
];

// Les images de démo sont des SVG générés : pas d'asset à versionner ni de requête externe.
function sceneDataUri(width: number, height: number, scene: Scene): string {
  const h = height;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${scene.sky[0]}"/><stop offset="1" stop-color="${scene.sky[1]}"/></linearGradient></defs>
<rect width="${width}" height="${height}" fill="url(#s)"/>
<circle cx="${width * 0.72}" cy="${h * 0.3}" r="${Math.min(width, h) * 0.09}" fill="${scene.sun}"/>
<path d="M0 ${h * 0.68} Q ${width * 0.25} ${h * 0.5} ${width * 0.5} ${h * 0.66} T ${width} ${h * 0.6} V ${h} H 0 Z" fill="${scene.hills[0]}"/>
<path d="M0 ${h * 0.82} Q ${width * 0.35} ${h * 0.68} ${width * 0.65} ${h * 0.8} T ${width} ${h * 0.76} V ${h} H 0 Z" fill="${scene.hills[1]}"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

interface SeedSpec {
  name: string;
  folderId: string;
  width: number;
  height: number;
  size: number;
  daysAgo: number;
  altText?: string;
}

// Les noms longs et quasi identiques sont volontaires : ils montrent la troncature sur deux lignes.
const SPECS: SeedSpec[] = [
  { name: 'kermesse-ecole-2026.jpg', folderId: 'site', width: 1600, height: 1200, size: 842_311, daysAgo: 2, altText: "Stand de la kermesse dans la cour de l'école" },
  { name: 'marche-de-noel-place-de-la-mairie-vue-depuis-le-clocher.jpg', folderId: 'site', width: 1920, height: 1080, size: 1_284_552, daysAgo: 5 },
  { name: 'conseil-municipal-seance-du-12-septembre-2026-photo-1.jpg', folderId: 'site', width: 2400, height: 1600, size: 2_104_877, daysAgo: 9 },
  { name: 'conseil-municipal-seance-du-12-septembre-2026-photo-2.jpg', folderId: 'site', width: 2400, height: 1600, size: 2_098_120, daysAgo: 9 },
  { name: 'eglise-saint-martin.png', folderId: 'site', width: 900, height: 1350, size: 1_532_004, daysAgo: 14, altText: "Façade de l'église Saint-Martin" },
  { name: 'fete-du-village-feu-artifice.jpg', folderId: 'site', width: 3000, height: 2000, size: 3_410_998, daysAgo: 21 },
  { name: 'bibliotheque-nouvelle-salle.jpg', folderId: 'site', width: 1200, height: 900, size: 512_330, daysAgo: 30 },
  { name: 'panorama-vallee.jpg', folderId: 'site', width: 4000, height: 1500, size: 4_210_667, daysAgo: 45 },
  { name: 'lavoir-restaure.jpg', folderId: 'site', width: 1200, height: 1200, size: 688_140, daysAgo: 60 },
  { name: 'rentree-scolaire-cantine.jpg', folderId: 'actualites', width: 1600, height: 1200, size: 905_221, daysAgo: 3 },
  { name: 'travaux-route-departementale.jpg', folderId: 'actualites', width: 1920, height: 1280, size: 1_105_009, daysAgo: 12 },
  { name: 'ceremonie-11-novembre.jpg', folderId: 'actualites', width: 1600, height: 1067, size: 1_002_118, daysAgo: 40 },
  { name: 'affiche-concert-ete.png', folderId: 'agenda', width: 1240, height: 1754, size: 2_310_442, daysAgo: 7 },
  { name: 'brocante-printemps.jpg', folderId: 'agenda', width: 1600, height: 1200, size: 801_776, daysAgo: 25 },
  { name: 'essai-import.jpg', folderId: 'site', width: 800, height: 600, size: 120_554, daysAgo: 1 },
  { name: 'logo-commune.png', folderId: 'apparence', width: 800, height: 800, size: 64_210, daysAgo: 120, altText: 'Logo de la commune' },
  { name: 'bandeau-accueil.jpg', folderId: 'apparence', width: 2560, height: 640, size: 1_780_334, daysAgo: 90 },
];

const DAY_MS = 24 * 60 * 60 * 1000;
// Date fixe : le rendu serveur et le rendu client doivent produire les mêmes dates.
const SEED_REFERENCE_DATE = Date.UTC(2026, 9, 26, 9, 0);

export const SEED_IMAGES: MediaImage[] = SPECS.map((spec, index) => ({
  id: `seed-${index + 1}`,
  folderId: spec.folderId,
  name: spec.name,
  url: sceneDataUri(spec.width, spec.height, SCENES[index % SCENES.length]),
  width: spec.width,
  height: spec.height,
  size: spec.size,
  createdAt: SEED_REFERENCE_DATE - spec.daysAgo * DAY_MS,
  altText: spec.altText ?? '',
}));
