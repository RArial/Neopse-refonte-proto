'use client';

import { useState, type ReactNode, type SyntheticEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
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
  /** Quand `false`, la section est affichée fixe (non repliable), sans comportement accordéon.
   * Par défaut `true`. */
  collapsible?: boolean;
  children: ReactNode;
}

const containerSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'hidden',
} as const;

const headerSx = {
  px: 2,
  py: 1.5,
} as const;

function SectionHeaderContent({ label, infoText }: { label: string; infoText: string }) {
  return (
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
  );
}

export function SectionAccordion({ section, label, infoText, defaultExpanded, collapsible = true, children }: SectionAccordionProps) {
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

  if (!collapsible) {
    return (
      <Box sx={containerSx}>
        <Box sx={headerSx}>
          <SectionHeaderContent label={label} infoText={infoText} />
        </Box>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>{children}</Box>
      </Box>
    );
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
        <SectionHeaderContent label={label} infoText={infoText} />
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, borderTop: '1px solid', borderColor: 'divider' }}>{children}</AccordionDetails>
    </Accordion>
  );
}
