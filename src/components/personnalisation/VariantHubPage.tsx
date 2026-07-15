'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { HubHeader } from '@/components/personnalisation/hub/HubHeader';
import { PublishedRow } from '@/components/personnalisation/hub/PublishedRow';
import { VariantGrid } from '@/components/personnalisation/hub/VariantGrid';

export function VariantHubPage() {
  const { variants } = usePersonnalisation();
  const published = variants.find((v) => v.status === 'published');

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <HubHeader />
      <Stack spacing={3}>
        {published && <PublishedRow variant={published} />}
        <VariantGrid />
      </Stack>
    </Box>
  );
}
