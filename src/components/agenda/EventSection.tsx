'use client';

import type { ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Icons, type IconName } from '@/components/ui/Icons';

interface EventSectionProps {
  id: string;
  icon: IconName;
  title: string;
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  children: ReactNode;
}

export function EventSection({ id, icon, title, expanded, onToggle, children }: EventSectionProps) {
  const IconEl = Icons[icon];
  const headerId = `event-section-${id}-header`;
  const panelId = `event-section-${id}-content`;

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => onToggle(isExpanded)}
      disableGutters
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
      <AccordionSummary
        expandIcon={<Icons.ChevronDown size={18} />}
        aria-controls={panelId}
        id={headerId}
        sx={{ px: 2.5, '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.25, my: 1.5 } }}
      >
        {IconEl && <IconEl size={17} />}
        <Typography component="h3" sx={{ fontWeight: 700, fontSize: 15 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        id={panelId}
        aria-labelledby={headerId}
        sx={{ px: 2.5, pt: 2.5, pb: 3, borderTop: '1px solid', borderColor: 'divider' }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
