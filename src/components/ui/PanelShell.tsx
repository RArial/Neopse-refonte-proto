'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Icons, type IconName } from '@/components/ui/Icons';

interface PanelShellProps {
  icon: IconName;
  title: string;
  children: ReactNode;
}

export function PanelShell({ icon, title, children }: PanelShellProps) {
  const IconEl = Icons[icon];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2,
          py: 1.5,
          bgcolor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {IconEl && <IconEl size={16} />}
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Paper>
  );
}
