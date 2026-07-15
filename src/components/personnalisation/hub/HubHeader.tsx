'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { HistoryButton } from '@/components/personnalisation/HistoryButton';

export function HubHeader() {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Apparence
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Gérez les variantes d&apos;apparence de votre site et publiez celle de votre choix.
        </Typography>
      </Box>
      <HistoryButton />
    </Stack>
  );
}
