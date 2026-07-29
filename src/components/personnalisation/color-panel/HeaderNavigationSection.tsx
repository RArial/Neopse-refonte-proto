'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { SectionPropertyRow } from '@/components/personnalisation/color-panel/SectionPropertyRow';
import { Subsection } from '@/components/personnalisation/color-panel/Subsection';

export function HeaderNavigationSection() {
  const { draftTokens, setSearchEnabled } = usePersonnalisation();

  return (
    <Stack sx={{ '& > *:last-child': { borderBottom: 'none' } }}>
      <Subsection label="Fond">
        <SectionPropertyRow section="header" propertyKey="headerBg" />
      </Subsection>

      <Subsection label="Menu déroulant">
        <SectionPropertyRow section="header" propertyKey="dropdownText" />
        <SectionPropertyRow section="header" propertyKey="dropdownBg" />
        <SectionPropertyRow section="header" propertyKey="dropdownHoverText" />
        <SectionPropertyRow section="header" propertyKey="dropdownHoverBg" />
      </Subsection>

      <Subsection label="Textes">
        <SectionPropertyRow section="header" propertyKey="navText" />
        <SectionPropertyRow section="header" propertyKey="navTextHover" />
        <SectionPropertyRow section="header" propertyKey="navHoverBg" />
      </Subsection>

      <Subsection label="Recherche">
        <Box sx={{ px: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={draftTokens.searchEnabled} onChange={(e) => setSearchEnabled(e.target.checked)} />}
            label="Activer la recherche dans l'en-tête"
          />
        </Box>
      </Subsection>

      <Subsection label="Boutons">
        <SectionPropertyRow section="header" propertyKey="headerButtonBg" />
        <SectionPropertyRow section="header" propertyKey="headerButtonText" />
      </Subsection>
    </Stack>
  );
}
