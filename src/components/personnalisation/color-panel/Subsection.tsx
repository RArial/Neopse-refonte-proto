'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SubsectionProps {
  label: string;
  children: ReactNode;
  /** Regroupement visuel de plusieurs sous-sections (ex. « Couleurs ») — titre plus discret, pas de bordure propre. */
  nested?: boolean;
}

/** Les enfants (typiquement des `PropertyRow`) gèrent déjà leur propre padding horizontal (px: 2) —
 * ce wrapper ne fait qu'ajouter le titre de sous-section et le séparateur, sans dupliquer le padding. */
export function Subsection({ label, children, nested }: SubsectionProps) {
  return (
    <Box sx={{ py: nested ? 1 : 1.5, borderBottom: nested ? 'none' : '1px solid', borderColor: 'divider' }}>
      <Typography
        variant={nested ? 'caption' : 'body2'}
        sx={{
          px: 2,
          fontWeight: 700,
          textTransform: nested ? 'uppercase' : 'none',
          letterSpacing: nested ? '.04em' : 'normal',
          color: nested ? 'text.secondary' : 'text.primary',
          display: 'block',
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}
