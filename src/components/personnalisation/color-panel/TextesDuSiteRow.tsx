'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import { TYPOGRAPHY_PAIRINGS } from '@/lib/personnalisation/typography';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

export function TextesDuSiteRow() {
  const { draftTokens, setTypographyPairing } = usePersonnalisation();

  return (
    <Stack spacing={1} sx={{ alignItems: 'flex-start', py: 1.5, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box sx={{ color: 'text.secondary', display: 'flex' }} aria-hidden="true">
          <FormatSizeIcon fontSize="small" />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Textes du site
        </Typography>
      </Stack>
      <TextField
        select
        size="small"
        value={draftTokens.typography.pairingId}
        onChange={(e) => setTypographyPairing(e.target.value)}
        sx={{ minWidth: 200, ml: 3.5 }}
        aria-label="Association typographique"
      >
        {TYPOGRAPHY_PAIRINGS.map((pairing) => (
          <MenuItem key={pairing.id} value={pairing.id}>
            {pairing.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
