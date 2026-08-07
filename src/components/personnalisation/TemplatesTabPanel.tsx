'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TemplateGrid } from '@/components/personnalisation/TemplateGrid';
import { SectionAccordion } from '@/components/personnalisation/color-panel/SectionAccordion';

export function TemplatesTabPanel() {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      <SectionAccordion label="Maquettes" infoText="Choisissez la structure de mise en page de votre site." collapsible={false}>
        <Box sx={{ p: 2 }}>
          <TemplateGrid />
        </Box>
      </SectionAccordion>
    </Stack>
  );
}
