'use client';

import { resolveSectionProperty, SECTION_PROPERTIES } from '@/lib/personnalisation/colorModel';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { PropertyRow } from '@/components/personnalisation/color-panel/PropertyRow';
import type { SectionKey } from '@/types/personnalisation';

interface SectionPropertyRowProps {
  section: SectionKey;
  /** Clé de la propriété dans `SECTION_PROPERTIES[section]`. */
  propertyKey: string;
}

/** Résout une propriété de section (couleur + opacité, dérivation "against" comprise) et affiche
 * sa `PropertyRow` — factorise la logique auparavant dupliquée dans `SectionAccordion`. */
export function SectionPropertyRow({ section, propertyKey }: SectionPropertyRowProps) {
  const { draftTokens, activePalette, setSectionRole } = usePersonnalisation();
  const properties = SECTION_PROPERTIES[section];
  const def = properties.find((p) => p.key === propertyKey)!;
  const resolved = resolveSectionProperty(draftTokens, activePalette, section, def);
  const againstDef = def.against ? properties.find((p) => p.key === def.against) : undefined;
  const againstColorKey = againstDef ? resolveSectionProperty(draftTokens, activePalette, section, againstDef).colorKey : null;

  return (
    <PropertyRow
      owner={section}
      def={def}
      palette={activePalette}
      resolvedColorKey={resolved.colorKey}
      alpha={resolved.alpha}
      againstColorKey={againstColorKey}
      onChangeColor={(colorKey) => setSectionRole(section, def.key, colorKey ? { colorKey, alpha: resolved.alpha } : null)}
      onChangeAlpha={(alpha) => setSectionRole(section, def.key, resolved.colorKey ? { colorKey: resolved.colorKey, alpha } : null)}
    />
  );
}
