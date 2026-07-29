'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function SaisineNotFound() {
  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: 6, maxWidth: 560, width: '100%', mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Saisine introuvable
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Cette demande n&apos;existe pas ou a été supprimée.
      </Typography>
      <Button component={Link} href="/dashboard/saisine-voie-electronique" variant="contained">
        Retour à la saisine par voie électronique
      </Button>
    </Box>
  );
}
