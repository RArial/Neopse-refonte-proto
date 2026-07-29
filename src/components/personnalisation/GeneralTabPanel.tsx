'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TemplateGrid } from '@/components/personnalisation/TemplateGrid';
import { PaletteSection } from '@/components/personnalisation/color-panel/PaletteSection';
import { SectionAccordion } from '@/components/personnalisation/color-panel/SectionAccordion';

export function GeneralTabPanel() {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      <SectionAccordion label="Maquettes" infoText="Choisissez la structure de mise en page de votre site." defaultExpanded>
        <Box sx={{ p: 2 }}>
          <TemplateGrid />
        </Box>
      </SectionAccordion>
      <PaletteSection />
    </Stack>
  );
}
