'use client';

import Stack from '@mui/material/Stack';
import { SectionPropertyRow } from '@/components/personnalisation/color-panel/SectionPropertyRow';
import { Subsection } from '@/components/personnalisation/color-panel/Subsection';

export function InternalHeaderSection() {
  return (
    <Stack sx={{ '& > *:last-child': { borderBottom: 'none' } }}>
      <Subsection label="Fond">
        <SectionPropertyRow section="internalHeader" propertyKey="internalHeaderBg" />
      </Subsection>
      <Subsection label="Titre">
        <SectionPropertyRow section="internalHeader" propertyKey="internalHeaderTitle" />
      </Subsection>
      <Subsection label="Texte">
        <SectionPropertyRow section="internalHeader" propertyKey="internalHeaderText" />
      </Subsection>
    </Stack>
  );
}
