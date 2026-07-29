'use client';

import type { ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icons, type IconName } from '@/components/ui/Icons';

interface FormAccordionSectionProps {
  id: string;
  icon: IconName;
  title: string;
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  children: ReactNode;
}

/** Section repliable d'un formulaire de création/modification, référencée par le sommaire de gauche
 * (voir `FormSommaire` et `useSectionScrollSpy`). */
export function FormAccordionSection({ id, icon, title, expanded, onToggle, children }: FormAccordionSectionProps) {
  const IconEl = Icons[icon];
  const headerId = `form-section-${id}-header`;
  const panelId = `form-section-${id}-content`;

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

interface SommaireLinkedSectionProps extends FormAccordionSectionProps {
  registerSection: (id: string) => (el: HTMLDivElement | null) => void;
}

/** `FormAccordionSection` doublée de son ancrage pour le sommaire/scroll-spy (`useSectionScrollSpy`). */
export function SommaireLinkedSection({ id, registerSection, ...sectionProps }: SommaireLinkedSectionProps) {
  return (
    <Box ref={registerSection(id)} data-section-id={id}>
      <FormAccordionSection id={id} {...sectionProps} />
    </Box>
  );
}
