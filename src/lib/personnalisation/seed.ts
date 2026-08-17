import { createDefaultTokens } from '@/lib/personnalisation/colorModel';
import { getPreset, PRESET_PALETTES } from '@/lib/personnalisation/palettes';
import type { HistoryEntry, Palette, Variant } from '@/types/personnalisation';

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createPreviewSlug(name: string): string {
  return `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
}

const oceanPreset = getPreset('ocean')!;

/** Palettes personnalisées déjà en place au chargement — le provider en seede son état `customPalettes`. */
export const SEED_CUSTOM_PALETTES: Palette[] = [
  {
    id: 'palette-marie-custom',
    name: 'Personnalisée (basée sur Océan)',
    origin: 'custom',
    basedOn: 'ocean',
    colors: { ...oceanPreset.colors, primary: '#0f707f', accent: '#d32f2f' },
  },
];

export const SEED_VARIANTS: Variant[] = [
  {
    id: 'variant-neopse-defaut',
    name: 'Neopse — Défaut',
    templateId: 'template1',
    tokens: createDefaultTokens('ocean'),
    status: 'published',
    previewSlug: 'neopse-defaut',
    updatedAt: '2026-07-07T14:32:00.000Z',
    updatedBy: 'Sylvie Grandjean',
  },
  {
    id: 'variant-proposition-marie',
    name: 'Proposition Sylvie',
    templateId: 'template2',
    tokens: createDefaultTokens('palette-marie-custom'),
    status: 'saved',
    previewSlug: 'proposition-marie',
    updatedAt: '2026-07-02T10:05:00.000Z',
    updatedBy: 'Sylvie Grandjean',
  },
  {
    id: 'variant-palette-automne',
    name: 'Palette automne',
    templateId: 'template3',
    tokens: createDefaultTokens('automne'),
    status: 'saved',
    previewSlug: 'palette-automne',
    updatedAt: '2026-06-18T16:40:00.000Z',
    updatedBy: 'Karim Benyahia',
  },
];

/** Résout un paletteId dans le jeu de données de départ (presets + palettes personnalisées seedées). */
export function resolveSeedPalette(paletteId: string): Palette {
  return SEED_CUSTOM_PALETTES.find((p) => p.id === paletteId) ?? getPreset(paletteId) ?? PRESET_PALETTES[0];
}

export const SEED_HISTORY: HistoryEntry[] = [
  {
    id: 'history-1',
    publishedAt: '2026-07-07T14:32:00.000Z',
    publishedBy: 'Sylvie Grandjean',
    variantName: 'Proposition Sylvie',
    templateId: 'template2',
    tokens: createDefaultTokens('palette-marie-custom'),
  },
  {
    id: 'history-2',
    publishedAt: '2026-03-12T09:11:00.000Z',
    publishedBy: 'Karim Benyahia',
    variantName: 'Charte 2024',
    templateId: 'template2',
    tokens: createDefaultTokens('ocean'),
  },
];
