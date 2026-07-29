'use client';

import Stack from '@mui/material/Stack';
import { SectionPropertyRow } from '@/components/personnalisation/color-panel/SectionPropertyRow';
import { Subsection } from '@/components/personnalisation/color-panel/Subsection';

export function FooterSection() {
  return (
    <Stack sx={{ '& > *:last-child': { borderBottom: 'none' } }}>
      <Subsection label="Fond">
        <SectionPropertyRow section="footer" propertyKey="footerBg" />
      </Subsection>
      <Subsection label="Titre">
        <SectionPropertyRow section="footer" propertyKey="footerTitle" />
      </Subsection>
      <Subsection label="Texte">
        <SectionPropertyRow section="footer" propertyKey="footerText" />
      </Subsection>
      <Subsection label="Bouton">
        <SectionPropertyRow section="footer" propertyKey="footerButtonBg" />
        <SectionPropertyRow section="footer" propertyKey="footerButtonText" />
      </Subsection>
    </Stack>
  );
}
