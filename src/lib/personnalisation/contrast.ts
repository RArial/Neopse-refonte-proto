import { COLOR_KEYS, type ColorKey, type Palette } from '@/types/personnalisation';

export type Rgb = [number, number, number];

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const int = parseInt(full, 16) || 0;
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

/** Compose une couleur (avec son alpha propre) sur un fond déjà résolu en RGB opaque. */
export function compositeOver(hex: string, alpha: number, bg: Rgb): Rgb {
  const [r, g, b] = hexToRgb(hex);
  const a = clamp(alpha, 0, 1);
  return [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)];
}

export function relativeLuminance([r, g, b]: Rgb): number {
  const [rl, gl, bl] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export function contrastRatioHex(hexA: string, hexB: string): number {
  return contrastRatio(hexToRgb(hexA), hexToRgb(hexB));
}

/**
 * Couleur de texte dérivée : noir ou blanc, quel que soit le meilleur ratio WCAG contre le fond.
 * Le noir et le blanc ne sont jamais un choix utilisateur — uniquement le résultat de ce calcul.
 */
export function textOn(bgHex: string): string {
  const bg = hexToRgb(bgHex);
  const withBlack = contrastRatio(bg, BLACK);
  const withWhite = contrastRatio(bg, WHITE);
  return withWhite >= withBlack ? '#ffffff' : '#000000';
}

/** Matrice 5×5 des ratios de contraste entre les couleurs de la charte (alpha=1, calcul borné). */
export function computeChartMatrix(palette: Palette): Record<ColorKey, Record<ColorKey, number>> {
  const matrix = {} as Record<ColorKey, Record<ColorKey, number>>;
  for (const a of COLOR_KEYS) {
    matrix[a] = {} as Record<ColorKey, number>;
    for (const b of COLOR_KEYS) {
      matrix[a][b] = contrastRatioHex(palette.colors[a], palette.colors[b]);
    }
  }
  return matrix;
}
