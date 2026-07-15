'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { MODULE_PROPERTIES, resolveModuleProperty } from '@/lib/personnalisation/colorModel';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { PropertyRow } from '@/components/personnalisation/color-panel/PropertyRow';
import { MODULE_LABELS, type ModuleKey } from '@/types/personnalisation';

interface ModuleDrawerProps {
  moduleKey: ModuleKey | null;
  onClose: () => void;
}

export function ModuleDrawer({ moduleKey, onClose }: ModuleDrawerProps) {
  const { draftTokens, activePalette, setModuleRole } = usePersonnalisation();

  return (
    <Drawer anchor="left" open={moduleKey !== null} onClose={onClose} slotProps={{ paper: { sx: { width: 280 } } }}>
      {moduleKey && (
        <Box role="dialog" aria-label={`Couleurs du module ${MODULE_LABELS[moduleKey]}`}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {MODULE_LABELS[moduleKey]}
            </Typography>
            <IconButton size="small" onClick={onClose} aria-label="Fermer">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

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
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', pr: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <PropertyRow
                        owner={moduleKey}
                        def={def}
                        palette={activePalette}
                        resolvedColorKey={resolved.colorKey}
                        alpha={resolved.alpha}
                        againstColorKey={def.kind === 'bg' ? null : againstColorKey}
                        onChangeColor={(colorKey) => setModuleRole(moduleKey, def.key, colorKey ? { colorKey, alpha: resolved.alpha } : null)}
                        onChangeAlpha={(alpha) => setModuleRole(moduleKey, def.key, resolved.colorKey ? { colorKey: resolved.colorKey, alpha } : null)}
                      />
                    </Box>
                    {resolved.isOverride && (
                      <Tooltip title="Réinitialiser cette propriété">
                        <IconButton size="small" onClick={() => setModuleRole(moduleKey, def.key, null)} aria-label={`Réinitialiser ${def.label}`}>
                          <RestartAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}
