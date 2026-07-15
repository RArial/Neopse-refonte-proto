import { hexToRgb, textOn } from '@/lib/personnalisation/contrast';
import {
  MODULE_PROPERTIES,
  resolveModuleProperty,
  resolveSectionProperty,
  SECTION_PROPERTIES,
} from '@/lib/personnalisation/colorModel';
import { getTypographyPairing } from '@/lib/personnalisation/typography';
import { MODULE_KEYS, type Palette, type ThemeTokens } from '@/types/personnalisation';

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function sectionDef(section: keyof typeof SECTION_PROPERTIES, key: string) {
  return SECTION_PROPERTIES[section].find((p) => p.key === key)!;
}

const moduleDef = (key: string) => MODULE_PROPERTIES.find((p) => p.key === key)!;

/**
 * Traduit les tokens résolus (palette + affectations de rôles) en variables CSS consommées par
 * le rendu de preview : `--role-*` (couleurs de section), `--module-*` (surcharges par module),
 * `--font-*` (typographie).
 */
export function tokensToCssVars(tokens: ThemeTokens, palette: Palette): Record<string, string> {
  const vars: Record<string, string> = {};

  const headerBg = resolveSectionProperty(tokens, palette, 'header', sectionDef('header', 'headerBg'));
  const navText = resolveSectionProperty(tokens, palette, 'header', sectionDef('header', 'navText'));
  const bodyBg = resolveSectionProperty(tokens, palette, 'general', sectionDef('general', 'bodyBg'));
  const bodyText = resolveSectionProperty(tokens, palette, 'general', sectionDef('general', 'bodyText'));
  const linkColor = resolveSectionProperty(tokens, palette, 'general', sectionDef('general', 'linkColor'));
  const buttonBg = resolveSectionProperty(tokens, palette, 'general', sectionDef('general', 'buttonBg'));
  const footerBg = resolveSectionProperty(tokens, palette, 'footer', sectionDef('footer', 'footerBg'));
  const footerTitle = resolveSectionProperty(tokens, palette, 'footer', sectionDef('footer', 'footerTitle'));
  const footerText = resolveSectionProperty(tokens, palette, 'footer', sectionDef('footer', 'footerText'));
  const internalHeaderBg = resolveSectionProperty(tokens, palette, 'internalHeader', sectionDef('internalHeader', 'internalHeaderBg'));
  const internalHeaderTitle = resolveSectionProperty(tokens, palette, 'internalHeader', sectionDef('internalHeader', 'internalHeaderTitle'));
  const internalHeaderText = resolveSectionProperty(tokens, palette, 'internalHeader', sectionDef('internalHeader', 'internalHeaderText'));

  vars['--role-headerBg'] = rgba(headerBg.hex, headerBg.alpha);
  vars['--role-headerText'] = navText.hex;
  vars['--role-bodyBg'] = rgba(bodyBg.hex, bodyBg.alpha);
  vars['--role-bodyText'] = bodyText.hex;
  vars['--role-linkColor'] = rgba(linkColor.hex, linkColor.alpha);
  vars['--role-buttonBg'] = rgba(buttonBg.hex, buttonBg.alpha);
  vars['--role-buttonText'] = textOn(buttonBg.hex);
  vars['--role-footerBg'] = rgba(footerBg.hex, footerBg.alpha);
  vars['--role-footerTitle'] = footerTitle.hex;
  vars['--role-footerText'] = footerText.hex;
  vars['--role-internalHeaderBg'] = rgba(internalHeaderBg.hex, internalHeaderBg.alpha);
  vars['--role-internalHeaderTitle'] = internalHeaderTitle.hex;
  vars['--role-internalHeaderText'] = internalHeaderText.hex;
  vars['--role-accent'] = palette.colors.accent;

  for (const moduleKey of MODULE_KEYS) {
    const blockBg = resolveModuleProperty(tokens, palette, moduleKey, moduleDef('bodyBg'));
    const blockTitle = resolveModuleProperty(tokens, palette, moduleKey, moduleDef('bodyText'));
    vars[`--module-${moduleKey}-bg`] = rgba(blockBg.hex, blockBg.alpha);
    vars[`--module-${moduleKey}-title`] = blockTitle.hex;
  }

  const pairing = getTypographyPairing(tokens.typography.pairingId);
  vars['--font-heading'] = pairing.heading;
  vars['--font-body'] = pairing.body;
  vars['--font-size-base'] = `${tokens.typography.baseFontSize}px`;

  return vars;
}
