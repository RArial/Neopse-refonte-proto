'use client';

import { useState, type ReactNode, type SyntheticEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import type { SectionKey } from '@/types/personnalisation';

interface SectionAccordionProps {
  /** Omis pour les sections qui ne portent pas de propriétés de couleur (ex. « Maquettes ») —
   * dans ce cas, la surbrillance de contraste ne peut jamais cibler cette section. */
  section?: SectionKey;
  label: string;
  infoText: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export function SectionAccordion({ section, label, infoText, defaultExpanded, children }: SectionAccordionProps) {
  const { highlightTarget } = usePersonnalisation();
  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));

  // Un avertissement de contraste concernant cette section force son dépliage, même si l'utilisateur
  // l'avait repliée. Détecté pendant le rendu (plutôt que dans un effet) pour suivre le nouveau
  // `highlightTarget` dès son apparition, sans déclencher de rendu en cascade.
  const [lastHandledTarget, setLastHandledTarget] = useState(highlightTarget);
  if (highlightTarget !== lastHandledTarget) {
    setLastHandledTarget(highlightTarget);
    if (section && highlightTarget?.owner === section) setExpanded(true);
  }

  function handleChange(_event: SyntheticEvent, next: boolean) {
    setExpanded(next);
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
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
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {label}
          </Typography>
          <Tooltip title={infoText}>
            <IconButton
              size="small"
              component="span"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              aria-label={`À propos de ${label}`}
            >
              <InfoOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, borderTop: '1px solid', borderColor: 'divider' }}>{children}</AccordionDetails>
    </Accordion>
  );
}
