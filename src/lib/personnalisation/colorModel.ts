import { compositeOver, contrastRatio, contrastRatioHex, textOn, type Rgb } from '@/lib/personnalisation/contrast';
import {
  COLOR_KEYS,
  MODULE_KEYS,
  MODULE_LABELS,
  SECTION_LABELS,
  type ColorKey,
  type ContrastIssue,
  type ModuleKey,
  type Palette,
  type SectionKey,
  type ThemeTokens,
} from '@/types/personnalisation';

const WHITE: Rgb = [255, 255, 255];
const SECTION_KEYS: SectionKey[] = ['general', 'header', 'internalHeader', 'footer'];

export type PropertyIcon = 'fill' | 'titleText' | 'bodyText' | 'button' | 'dropdown';
export type PropertyKind = 'bg' | 'text-manual' | 'text-derived';

export interface PropertyDef {
  key: string;
  label: string;
  icon: PropertyIcon;
  kind: PropertyKind;
  /** Pour les propriétés text-* : la clé de la propriété "fond" utilisée pour dériver/vérifier le contraste. */
  against?: string;
}

export const SECTION_PROPERTIES: Record<SectionKey, PropertyDef[]> = {
  general: [
    { key: 'bodyBg', label: 'Fond principal', icon: 'fill', kind: 'bg' },
    { key: 'secondaryBg', label: 'Fond secondaire', icon: 'fill', kind: 'bg' },
    { key: 'bodyText', label: 'Texte', icon: 'bodyText', kind: 'text-derived', against: 'bodyBg' },
    { key: 'linkColor', label: 'Liens', icon: 'bodyText', kind: 'text-manual', against: 'bodyBg' },
    { key: 'blocBg', label: 'Fond de bloc', icon: 'fill', kind: 'bg' },
    { key: 'blocText', label: 'Texte de bloc', icon: 'bodyText', kind: 'text-derived', against: 'blocBg' },
    { key: 'buttonBg', label: 'Fond de bouton', icon: 'button', kind: 'bg' },
    { key: 'buttonText', label: 'Texte de bouton', icon: 'button', kind: 'text-derived', against: 'buttonBg' },
  ],
  header: [
    { key: 'headerBg', label: 'Fond', icon: 'fill', kind: 'bg' },
    { key: 'dropdownText', label: 'Menu déroulant — texte par défaut', icon: 'dropdown', kind: 'text-derived', against: 'dropdownBg' },
    { key: 'dropdownBg', label: 'Menu déroulant — fond par défaut', icon: 'dropdown', kind: 'bg' },
    { key: 'dropdownHoverText', label: 'Menu déroulant — texte au survol', icon: 'dropdown', kind: 'text-derived', against: 'dropdownHoverBg' },
    { key: 'dropdownHoverBg', label: 'Menu déroulant — fond au survol', icon: 'dropdown', kind: 'bg' },
    { key: 'navText', label: 'Texte par défaut', icon: 'bodyText', kind: 'text-derived', against: 'headerBg' },
    { key: 'navTextHover', label: 'Texte au survol', icon: 'bodyText', kind: 'text-derived', against: 'navHoverBg' },
    { key: 'navHoverBg', label: 'Fond au survol', icon: 'fill', kind: 'bg' },
    { key: 'headerButtonBg', label: 'Fond de bouton', icon: 'button', kind: 'bg' },
    { key: 'headerButtonText', label: 'Texte de bouton', icon: 'button', kind: 'text-derived', against: 'headerButtonBg' },
  ],
  internalHeader: [
    { key: 'internalHeaderBg', label: 'Fond', icon: 'fill', kind: 'bg' },
    { key: 'internalHeaderTitle', label: 'Titre', icon: 'titleText', kind: 'text-derived', against: 'internalHeaderBg' },
    { key: 'internalHeaderText', label: 'Texte', icon: 'bodyText', kind: 'text-derived', against: 'internalHeaderBg' },
  ],
  footer: [
    { key: 'footerBg', label: 'Fond', icon: 'fill', kind: 'bg' },
    { key: 'footerTitle', label: 'Titre', icon: 'titleText', kind: 'text-derived', against: 'footerBg' },
    { key: 'footerText', label: 'Texte', icon: 'bodyText', kind: 'text-derived', against: 'footerBg' },
    { key: 'footerButtonBg', label: 'Fond de bouton', icon: 'button', kind: 'bg' },
    { key: 'footerButtonText', label: 'Texte de bouton', icon: 'button', kind: 'text-derived', against: 'footerButtonBg' },
  ],
};

/** Les modules réutilisent le vocabulaire de `general` (mêmes clés), avec des libellés contextualisés. */
export const MODULE_PROPERTIES: PropertyDef[] = [
  { key: 'bodyBg', label: 'Fond de bloc', icon: 'fill', kind: 'bg' },
  { key: 'bodyText', label: 'Titre', icon: 'titleText', kind: 'text-derived', against: 'bodyBg' },
  { key: 'linkColor', label: 'Lien', icon: 'bodyText', kind: 'text-manual', against: 'bodyBg' },
  { key: 'buttonBg', label: 'Bouton', icon: 'button', kind: 'bg' },
];

const DEFAULT_SECTION_VALUES: ThemeTokens['sections'] = {
  general: {
    bodyBg: { colorKey: 'surfaceLight', alpha: 1 },
    secondaryBg: { colorKey: 'surfaceDark', alpha: 1 },
    linkColor: { colorKey: 'primary', alpha: 1 },
    blocBg: { colorKey: 'surfaceLight', alpha: 1 },
    buttonBg: { colorKey: 'primary', alpha: 1 },
  },
  header: {
    headerBg: { colorKey: 'secondary', alpha: 1 },
    dropdownBg: { colorKey: 'secondary', alpha: 1 },
    dropdownHoverBg: { colorKey: 'surfaceDark', alpha: 1 },
    navHoverBg: { colorKey: 'surfaceDark', alpha: 1 },
    headerButtonBg: { colorKey: 'accent', alpha: 1 },
  },
  internalHeader: {
    internalHeaderBg: { colorKey: 'surfaceDark', alpha: 1 },
  },
  footer: {
    footerBg: { colorKey: 'secondary', alpha: 1 },
    footerButtonBg: { colorKey: 'accent', alpha: 1 },
  },
};

export function createDefaultTokens(paletteId: string): ThemeTokens {
  return {
    paletteId,
    sections: {
      general: { ...DEFAULT_SECTION_VALUES.general },
      header: { ...DEFAULT_SECTION_VALUES.header },
      internalHeader: { ...DEFAULT_SECTION_VALUES.internalHeader },
      footer: { ...DEFAULT_SECTION_VALUES.footer },
    },
    modules: { news: {}, events: {}, directory: {}, forms: {}, media: {} },
    typography: { pairingId: 'sans-moderne', baseFontSize: 16 },
    searchEnabled: true,
    backgroundModes: { principal: 'color', secondaire: 'color' },
    backgroundGraphics: {
      principal: { kind: 'image', imageUrl: null, textureId: null },
      secondaire: { kind: 'image', imageUrl: null, textureId: null },
    },
    logos: { principalDesktop: null, principalMobile: null, secondary: null },
  };
}

// ─── Résolution ─────────────────────────────────────────────────────────────

export interface ResolvedProperty {
  key: string;
  def: PropertyDef;
  /** true si une valeur explicite est présente pour CETTE section/module (surcharge). */
  isOverride: boolean;
  colorKey: ColorKey | null; // null quand dérivé (kind 'text-derived' non surchargé)
  alpha: number;
  hex: string;
}

function paletteHex(palette: Palette, colorKey: ColorKey): string {
  return palette.colors[colorKey];
}

export function resolveSectionProperty(tokens: ThemeTokens, palette: Palette, section: SectionKey, def: PropertyDef): ResolvedProperty {
  const explicit = tokens.sections[section]?.[def.key];
  if (explicit) {
    return { key: def.key, def, isOverride: true, colorKey: explicit.colorKey, alpha: explicit.alpha, hex: paletteHex(palette, explicit.colorKey) };
  }
  if (def.kind === 'text-derived' && def.against) {
    const bgHex = resolveSectionColorHex(tokens, palette, section, def.against);
    return { key: def.key, def, isOverride: false, colorKey: null, alpha: 1, hex: textOn(bgHex) };
  }
  return { key: def.key, def, isOverride: false, colorKey: 'surfaceLight', alpha: 1, hex: paletteHex(palette, 'surfaceLight') };
}

export function resolveSectionColorHex(tokens: ThemeTokens, palette: Palette, section: SectionKey, key: string): string {
  const def = SECTION_PROPERTIES[section].find((p) => p.key === key);
  if (!def) return palette.colors.surfaceLight;
  return resolveSectionProperty(tokens, palette, section, def).hex;
}

export function resolveModuleProperty(tokens: ThemeTokens, palette: Palette, moduleKey: ModuleKey, def: PropertyDef): ResolvedProperty {
  const explicit = tokens.modules[moduleKey]?.[def.key];
  if (explicit) {
    return { key: def.key, def, isOverride: true, colorKey: explicit.colorKey, alpha: explicit.alpha, hex: paletteHex(palette, explicit.colorKey) };
  }
  if (def.kind === 'text-derived' && def.against) {
    const bgHex = resolveModuleColorHex(tokens, palette, moduleKey, def.against);
    return { key: def.key, def, isOverride: false, colorKey: null, alpha: 1, hex: textOn(bgHex) };
  }
  const generalDef = SECTION_PROPERTIES.general.find((p) => p.key === def.key);
  if (generalDef) return resolveSectionProperty(tokens, palette, 'general', generalDef);
  return { key: def.key, def, isOverride: false, colorKey: 'surfaceLight', alpha: 1, hex: palette.colors.surfaceLight };
}

export function resolveModuleColorHex(tokens: ThemeTokens, palette: Palette, moduleKey: ModuleKey, key: string): string {
  const def = MODULE_PROPERTIES.find((p) => p.key === key);
  if (!def) return palette.colors.surfaceLight;
  return resolveModuleProperty(tokens, palette, moduleKey, def).hex;
}

export function moduleOverrideCount(tokens: ThemeTokens, moduleKey: ModuleKey): number {
  return Object.keys(tokens.modules[moduleKey] ?? {}).length;
}

// ─── Filtrage du SwatchSelect (matrice 5×5, alpha=1, calcul borné) ─────────

export function passesChartContrast(matrix: Record<ColorKey, Record<ColorKey, number>>, candidate: ColorKey, against: ColorKey): boolean {
  return matrix[candidate][against] >= 4.5;
}

// ─── Problèmes de contraste réels (surcharges manuelles uniquement) ────────

function resolveBgRgbForSection(tokens: ThemeTokens, palette: Palette, section: SectionKey, key: string): Rgb {
  const def = SECTION_PROPERTIES[section].find((p) => p.key === key);
  if (!def) return WHITE;
  const resolved = resolveSectionProperty(tokens, palette, section, def);
  return compositeOver(resolved.hex, resolved.alpha, WHITE);
}

export function computeManualOverrideIssues(tokens: ThemeTokens, palette: Palette): ContrastIssue[] {
  const issues: ContrastIssue[] = [];

  for (const section of SECTION_KEYS) {
    for (const def of SECTION_PROPERTIES[section]) {
      if (def.kind === 'bg' || !def.against) continue;
      const resolved = resolveSectionProperty(tokens, palette, section, def);
      // Dérivé (non surchargé) : garanti conforme par construction, jamais vérifié.
      if (def.kind === 'text-derived' && !resolved.isOverride) continue;

      const bgRgb = resolveBgRgbForSection(tokens, palette, section, def.against);
      const textRgb = compositeOver(resolved.hex, resolved.alpha, bgRgb);
      const ratio = contrastRatio(textRgb, bgRgb);
      if (ratio < 4.5) {
        issues.push({
          section,
          sectionLabel: SECTION_LABELS[section],
          propertyKey: def.key,
          propertyLabel: def.label,
          ratio,
          severity: ratio < 3 ? 'critical' : 'warning',
          canResetToAuto: def.kind === 'text-derived',
        });
      }
    }
  }

  for (const moduleKey of MODULE_KEYS) {
    for (const def of MODULE_PROPERTIES) {
      if (def.kind === 'bg' || !def.against) continue;
      const hasOwnOverride = Boolean(tokens.modules[moduleKey]?.[def.key]);
      if (!hasOwnOverride) continue; // pas une surcharge de ce module : déjà couvert au niveau général

      const resolved = resolveModuleProperty(tokens, palette, moduleKey, def);
      const bgHex = resolveModuleColorHex(tokens, palette, moduleKey, def.against);
      const bgRgb = compositeOver(bgHex, 1, WHITE);
      const textRgb = compositeOver(resolved.hex, resolved.alpha, bgRgb);
      const ratio = contrastRatio(textRgb, bgRgb);
      if (ratio < 4.5) {
        issues.push({
          section: moduleKey,
          sectionLabel: MODULE_LABELS[moduleKey],
          propertyKey: def.key,
          propertyLabel: def.label,
          ratio,
          severity: ratio < 3 ? 'critical' : 'warning',
          // Au niveau module, "réinitialiser" retombe toujours sur l'héritage de `general` — jamais cassé.
          canResetToAuto: true,
        });
      }
    }
  }

  return issues;
}

export function chartMatrixRatio(palette: Palette, a: ColorKey, b: ColorKey): number {
  return contrastRatioHex(palette.colors[a], palette.colors[b]);
}

export { COLOR_KEYS };
