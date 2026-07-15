import type { Palette } from '@/types/personnalisation';

/** Id de la palette de départ « Personnalisée », préchargée avec les couleurs de marque Neopse
 * (voir CLAUDE.md — primary.main / secondary.main / background.default du thème). */
export const NEOPSE_DEFAULT_PALETTE_ID = 'personnalisee-neopse';

export const PRESET_PALETTES: Palette[] = [
  {
    id: 'ocean',
    name: 'Océan',
    origin: 'preset',
    colors: {
      primary: '#47a5b6',
      secondary: '#182339',
      accent: '#e8a33d',
      surfaceLight: '#f7f7f5',
      surfaceDark: '#2c2c2a',
    },
  },
  {
    id: 'automne',
    name: 'Automne',
    origin: 'preset',
    colors: {
      primary: '#c0392b',
      secondary: '#3a2410',
      accent: '#f5a623',
      surfaceLight: '#fdf6ec',
      surfaceDark: '#2a1a0d',
    },
  },
  {
    id: 'foret',
    name: 'Forêt',
    origin: 'preset',
    colors: {
      primary: '#2e7d5b',
      secondary: '#1b3a2f',
      accent: '#d4a017',
      surfaceLight: '#f4f7f2',
      surfaceDark: '#16241d',
    },
  },
  {
    id: 'ardoise',
    name: 'Ardoise',
    origin: 'preset',
    colors: {
      primary: '#0b5fff',
      secondary: '#232f3e',
      accent: '#f59e0b',
      surfaceLight: '#f5f7fa',
      surfaceDark: '#1a2230',
    },
  },
  {
    id: 'nuit',
    name: 'Nuit',
    origin: 'preset',
    colors: {
      primary: '#2dd4bf',
      secondary: '#0f1720',
      accent: '#f59e0b',
      surfaceLight: '#e5e9f0',
      surfaceDark: '#0a0f16',
    },
  },
  {
    id: NEOPSE_DEFAULT_PALETTE_ID,
    name: 'Personnalisée',
    origin: 'preset',
    colors: {
      primary: '#1E3A5F',
      secondary: '#132436',
      accent: '#F5A623',
      surfaceLight: '#F8F9FA',
      surfaceDark: '#132436',
    },
  },
];

export function getPreset(id: string): Palette | undefined {
  return PRESET_PALETTES.find((p) => p.id === id);
}
