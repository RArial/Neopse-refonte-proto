'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { moduleOverrideCount } from '@/lib/personnalisation/colorModel';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { ModuleDrawer } from '@/components/personnalisation/color-panel/ModuleDrawer';
import { MODULE_KEYS, MODULE_LABELS, type ModuleKey } from '@/types/personnalisation';

export function ModuleOverridesAccordion() {
  const { draftTokens, moduleAccordionOpen, setModuleAccordionOpen, setModuleRole, highlightTarget } = usePersonnalisation();
  const [openModule, setOpenModule] = useState<ModuleKey | null>(null);

  // Un avertissement de contraste concernant un module ouvre directement son tiroir. Détecté pendant
  // le rendu (plutôt que dans un effet) pour réagir dès l'apparition du nouveau `highlightTarget`.
  const [lastHandledTarget, setLastHandledTarget] = useState(highlightTarget);
  if (highlightTarget !== lastHandledTarget) {
    setLastHandledTarget(highlightTarget);
    if (highlightTarget && MODULE_KEYS.includes(highlightTarget.owner as ModuleKey)) {
      setOpenModule(highlightTarget.owner as ModuleKey);
    }
  }

  function resetModule(moduleKey: ModuleKey, event: MouseEvent) {
    event.stopPropagation();
    Object.keys(draftTokens.modules[moduleKey] ?? {}).forEach((key) => setModuleRole(moduleKey, key, null));
  }

  return (
    <>
      <Accordion
        expanded={moduleAccordionOpen}
        onChange={(_, expanded) => setModuleAccordionOpen(expanded)}
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
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Personnalisations par module
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, borderTop: '1px solid', borderColor: 'divider' }}>
          <List disablePadding>
            {MODULE_KEYS.map((moduleKey) => {
              const count = moduleOverrideCount(draftTokens, moduleKey);
              return (
                <ListItemButton key={moduleKey} onClick={() => setOpenModule(moduleKey)} sx={{ py: 1.25 }}>
                  <ListItemText primary={MODULE_LABELS[moduleKey]} />
                  {count > 0 ? (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <Chip size="small" label={`${count} couleur${count > 1 ? 's' : ''} personnalisée${count > 1 ? 's' : ''}`} />
                      <Tooltip title="Réinitialiser les couleurs de ce module">
                        <IconButton
                          size="small"
                          onClick={(e) => resetModule(moduleKey, e)}
                          aria-label={`Réinitialiser les couleurs de ${MODULE_LABELS[moduleKey]}`}
                        >
                          <RestartAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Hérite du site
                    </Typography>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>

      <ModuleDrawer moduleKey={openModule} onClose={() => setOpenModule(null)} />
    </>
  );
}
