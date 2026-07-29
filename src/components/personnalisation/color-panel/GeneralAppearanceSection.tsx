'use client';

import Stack from '@mui/material/Stack';
import { BackgroundField } from '@/components/personnalisation/color-panel/BackgroundField';
import { SectionPropertyRow } from '@/components/personnalisation/color-panel/SectionPropertyRow';
import { Subsection } from '@/components/personnalisation/color-panel/Subsection';

export function GeneralAppearanceSection() {
  return (
    <Stack sx={{ '& > *:last-child': { borderBottom: 'none' } }}>
      <Subsection label="Textes du site">
        <SectionPropertyRow section="general" propertyKey="bodyText" />
      </Subsection>

      <Subsection label="Couleurs">
        <Stack spacing={0.5}>
          <Subsection label="Fond principal" nested>
            <BackgroundField slot="principal" colorKey="bodyBg" />
          </Subsection>
          <Subsection label="Fond secondaire" nested>
            <BackgroundField slot="secondaire" colorKey="secondaryBg" />
          </Subsection>
          <Subsection label="Blocs" nested>
            <SectionPropertyRow section="general" propertyKey="blocBg" />
            <SectionPropertyRow section="general" propertyKey="blocText" />
          </Subsection>
          <Subsection label="Boutons" nested>
            <SectionPropertyRow section="general" propertyKey="buttonBg" />
            <SectionPropertyRow section="general" propertyKey="buttonText" />
          </Subsection>
          <Subsection label="Liens" nested>
            <SectionPropertyRow section="general" propertyKey="linkColor" />
          </Subsection>
        </Stack>
      </Subsection>
    </Stack>
  );
}
