import { hexToRgb } from '@/lib/personnalisation/contrast';
import { resolveSectionColorHex, resolveSectionProperty, SECTION_PROPERTIES } from '@/lib/personnalisation/colorModel';
import type { TemplateDefinition } from '@/lib/personnalisation/templates';
import type { Palette, ThemeTokens } from '@/types/personnalisation';

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface TemplateThumbnailProps {
  template: TemplateDefinition;
  tokens: ThemeTokens;
  palette: Palette;
}

/**
 * Vignette SVG paramétrée : rend les couleurs *en cours* (palette + affectations), résolues via
 * colorModel.ts — jamais une image figée.
 */
export function TemplateThumbnail({ template, tokens, palette }: TemplateThumbnailProps) {
  const headerBg = resolveSectionProperty(tokens, palette, 'header', SECTION_PROPERTIES.header[0]);
  const headerText = resolveSectionColorHex(tokens, palette, 'header', 'navText');
  const bodyBg = resolveSectionProperty(tokens, palette, 'general', SECTION_PROPERTIES.general[0]);
  const bodyText = resolveSectionColorHex(tokens, palette, 'general', 'bodyText');
  const buttonBg = resolveSectionProperty(tokens, palette, 'general', SECTION_PROPERTIES.general[3]);
  const footerBg = resolveSectionProperty(tokens, palette, 'footer', SECTION_PROPERTIES.footer[0]);
  const footerHeight = template.hasFooterBand ? 16 : 0;

  return (
    <svg
      viewBox="0 0 160 120"
      style={{ width: '100%', height: '100%', display: 'block' }}
      role="img"
      aria-label={`Aperçu de la maquette ${template.name}`}
    >
      <rect x={0} y={0} width={160} height={120} fill={rgba(bodyBg.hex, bodyBg.alpha)} />
      <rect x={0} y={0} width={160} height={22} fill={rgba(headerBg.hex, headerBg.alpha)} />
      <rect x={10} y={9} width={28} height={5} rx={2} fill={headerText} opacity={0.9} />
      <rect x={112} y={9} width={14} height={5} rx={2} fill={headerText} opacity={0.5} />
      <rect x={132} y={9} width={14} height={5} rx={2} fill={headerText} opacity={0.5} />

      <rect x={10} y={38} width={90} height={7} rx={2} fill={bodyText} opacity={0.85} />
      <rect x={10} y={52} width={140} height={5} rx={2} fill={bodyText} opacity={0.4} />
      <rect x={10} y={62} width={110} height={5} rx={2} fill={bodyText} opacity={0.4} />

      <rect x={10} y={76} width={40} height={14} rx={3} fill={rgba(buttonBg.hex, buttonBg.alpha)} />
      <rect x={17} y={81} width={26} height={4} rx={2} fill="#ffffff" opacity={0.9} />

      {template.hasAccentBadge && <circle cx={142} cy={83} r={6} fill={palette.colors.accent} />}

      {template.hasFooterBand && (
        <rect x={0} y={120 - footerHeight} width={160} height={footerHeight} fill={rgba(footerBg.hex, footerBg.alpha)} />
      )}
    </svg>
  );
}
