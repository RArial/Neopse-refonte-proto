'use client';

import { useState } from 'react';
import type { MouseEvent, SyntheticEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { moduleOverrideCount, MODULE_PROPERTIES, resolveModuleProperty } from '@/lib/personnalisation/colorModel';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { PropertyRow } from '@/components/personnalisation/color-panel/PropertyRow';
import { MODULE_KEYS, MODULE_LABELS, type ModuleKey } from '@/types/personnalisation';

function ModuleAccordionItem({ moduleKey, expanded, onToggle }: { moduleKey: ModuleKey; expanded: boolean; onToggle: (expanded: boolean) => void }) {
  const { draftTokens, activePalette, setModuleRole } = usePersonnalisation();
  const count = moduleOverrideCount(draftTokens, moduleKey);

  function resetModule(event: MouseEvent) {
    event.stopPropagation();
    Object.keys(draftTokens.modules[moduleKey] ?? {}).forEach((key) => setModuleRole(moduleKey, key, null));
  }

  function handleChange(_event: SyntheticEvent, next: boolean) {
    onToggle(next);
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
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: 1, minWidth: 0 }}>
          <Stack sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {MODULE_LABELS[moduleKey]}
            </Typography>
            <Typography variant="caption" color={count > 0 ? 'primary.main' : 'text.secondary'} sx={{ fontWeight: count > 0 ? 600 : 400 }}>
              {count > 0 ? `${count} couleur${count > 1 ? 's' : ''} personnalisée${count > 1 ? 's' : ''}` : 'Hérité du site'}
            </Typography>
          </Stack>
          {count > 0 && (
            <Tooltip title="Réinitialiser les couleurs de ce module">
              <IconButton
                size="small"
                component="span"
                onClick={resetModule}
                onFocus={(e) => e.stopPropagation()}
                aria-label={`Réinitialiser les couleurs de ${MODULE_LABELS[moduleKey]}`}
                sx={{ flexShrink: 0 }}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack sx={{ '& > *:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
          {MODULE_PROPERTIES.map((def) => {
            const resolved = resolveModuleProperty(draftTokens, activePalette, moduleKey, def);
            const againstDef = def.against ? MODULE_PROPERTIES.find((p) => p.key === def.against) : undefined;
            const againstColorKey = againstDef ? resolveModuleProperty(draftTokens, activePalette, moduleKey, againstDef).colorKey : null;

            return (
              <Box key={def.key} sx={{ pt: 0.75 }}>
                <Typography variant="caption" color="text.secondary" sx={{ pl: 2, display: 'block' }}>
                  {resolved.isOverride ? 'Personnalisé' : 'Hérité'}
                </Typography>
                <PropertyRow
                  owner={moduleKey}
                  def={def}
                  palette={activePalette}
                  resolvedColorKey={resolved.colorKey}
                  alpha={resolved.alpha}
                  againstColorKey={def.kind === 'bg' ? null : againstColorKey}
                  onChangeColor={(colorKey) => setModuleRole(moduleKey, def.key, colorKey ? { colorKey, alpha: resolved.alpha } : null)}
                  onChangeAlpha={(alpha) => setModuleRole(moduleKey, def.key, resolved.colorKey ? { colorKey: resolved.colorKey, alpha } : null)}
                  onReset={resolved.isOverride ? () => setModuleRole(moduleKey, def.key, null) : undefined}
                />
              </Box>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export function ModulesTabPanel() {
  const { highlightTarget } = usePersonnalisation();
  const [openModule, setOpenModule] = useState<ModuleKey | null>(null);

  // Un avertissement de contraste concernant un module ouvre directement son accordéon. Détecté pendant
  // le rendu (plutôt que dans un effet) pour réagir dès l'apparition du nouveau `highlightTarget`.
  const [lastHandledTarget, setLastHandledTarget] = useState(highlightTarget);
  if (highlightTarget !== lastHandledTarget) {
    setLastHandledTarget(highlightTarget);
    if (highlightTarget && MODULE_KEYS.includes(highlightTarget.owner as ModuleKey)) {
      setOpenModule(highlightTarget.owner as ModuleKey);
    }
  }

  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      {MODULE_KEYS.map((moduleKey) => (
        <ModuleAccordionItem
          key={moduleKey}
          moduleKey={moduleKey}
          expanded={openModule === moduleKey}
          onToggle={(expanded) => setOpenModule(expanded ? moduleKey : null)}
        />
      ))}
    </Stack>
  );
}
