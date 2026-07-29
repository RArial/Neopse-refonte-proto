'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function FlashInfoNotFound() {
  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: 6, maxWidth: 560, width: '100%', mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Flash info introuvable
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ce flash info n&apos;existe pas ou a été supprimé.
      </Typography>
      <Button component={Link} href="/dashboard/flash-infos" variant="contained">
        Retour aux flash infos
      </Button>
    </Box>
  );
}
