'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Icons, type IconName } from '@/components/ui/Icons';

interface ProfileSectionProps {
  icon: IconName;
  title: string;
  children: ReactNode;
}

export function ProfileSection({ icon, title, children }: ProfileSectionProps) {
  const IconEl = Icons[icon];

  return (
    <Paper component="section" variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 2, md: 2.5 },
          py: 1.5,
          bgcolor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {IconEl && (
          <Box aria-hidden="true" sx={{ color: 'text.secondary', display: 'grid', placeItems: 'center' }}>
            <IconEl size={18} />
          </Box>
        )}
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2.5 }}>{children}</Box>
    </Paper>
  );
}
