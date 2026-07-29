'use client';

import type { ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FormSectionProps {
  title: string;
  collapsible?: boolean;
  /** Section dépliée au premier rendu — n'a d'effet que si `collapsible` est vrai. Défaut : replié. */
  defaultExpanded?: boolean;
  infoTooltip?: string;
  children: ReactNode;
}

export function FormSection({ title, collapsible, defaultExpanded, infoTooltip, children }: FormSectionProps) {
  const header = (
    <Typography component="h2" sx={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 0.75 }}>
      {title}
      {infoTooltip && (
        <Tooltip title={infoTooltip}>
          <InfoOutlinedIcon fontSize="small" color="action" />
        </Tooltip>
      )}
    </Typography>
  );

  if (collapsible) {
    return (
      <Accordion
        disableGutters
        defaultExpanded={defaultExpanded}
        elevation={0}
        square
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '10px !important',
          overflow: 'hidden',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} sx={{ px: 2.5, bgcolor: 'action.hover' }}>
          {header}
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2.5, py: 2.5 }}>{children}</AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>{header}</Box>
      <Box sx={{ px: 2.5, py: 2.5 }}>{children}</Box>
    </Box>
  );
}

