'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';

interface PiedDePageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PiedDePageError({ error, reset }: PiedDePageErrorProps) {
  useEffect(() => {
    console.error('Pied de page error:', error);
  }, [error]);

  return (
    <Box
      role="alert"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 8,
        textAlign: 'center',
      }}
    >
      <ErrorOutlinedIcon color="error" sx={{ fontSize: 40 }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Une erreur est survenue
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        Le pied de page n&apos;a pas pu se charger. Réessayez ou contactez le support si le problème persiste.
      </Typography>
      <Button variant="contained" onClick={reset}>
        Réessayer
      </Button>
    </Box>
  );
}
