'use client';

import { useId, useState, type ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icons, type IconName } from '@/components/ui/Icons';

interface SettingsSectionProps {
  icon: IconName;
  title: string;
  description: string;
  children: ReactNode;
  /** Quand `false`, la section est affichée fixe (non repliable), sans comportement accordéon. Par défaut `true`. */
  collapsible?: boolean;
}

export function SettingsSection({ icon, title, description, children, collapsible = true }: SettingsSectionProps) {
  const IconEl = Icons[icon];
  const baseId = useId();
  const headerId = `${baseId}-header`;
  const panelId = `${baseId}-content`;
  const [expanded, setExpanded] = useState(true);

  if (!collapsible) {
    return (
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          id={headerId}
          sx={{
            px: { xs: 2, md: 2.5 },
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            my: 1.5,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'action.hover',
              color: 'text.secondary',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {IconEl && <IconEl size={19} />}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
        <Box
          id={panelId}
          aria-labelledby={headerId}
          sx={{
            px: { xs: 2, md: 2.5 },
            pt: 2.5,
            pb: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      disableGutters
      elevation={0}
      square
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<Icons.ChevronDown size={18} />}
        aria-controls={panelId}
        id={headerId}
        sx={{
          px: { xs: 2, md: 2.5 },
          '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.75, my: 1.5 },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'action.hover',
            color: 'text.secondary',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {IconEl && <IconEl size={19} />}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        id={panelId}
        aria-labelledby={headerId}
        sx={{
          px: { xs: 2, md: 2.5 },
          pt: 2.5,
          pb: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
