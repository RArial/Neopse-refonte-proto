'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ColorizeIcon from '@mui/icons-material/Colorize';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ShortcutIconPicker } from '@/components/acces-directs/ShortcutIconPicker';
import type { ShortcutFormData } from '@/types/pagesModules';

const DEFAULT_COLOR_INPUT_VALUE = '#1e3a5f';

interface SectionProps {
  data: ShortcutFormData;
  onChange: (patch: Partial<ShortcutFormData>) => void;
}

export function IllustrationRaccourciSection({ data, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Icône du raccourci
          </Typography>
          <Tooltip title="Icône affichée à côté du raccourci sur le site.">
            <IconButton size="small" aria-label="Informations sur l'icône du raccourci" sx={{ p: 0.25 }}>
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        </Stack>
        <ShortcutIconPicker value={data.icon} onChange={(icon) => onChange({ icon })} />
      </Stack>

      <Stack spacing={1}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Couleur du raccourci
          </Typography>
          <Tooltip title="Couleur de fond de l'icône affichée sur le site. Laissez « Par défaut » pour utiliser la couleur du thème.">
            <IconButton size="small" aria-label="Informations sur la couleur du raccourci" sx={{ p: 0.25 }}>
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TextField
            value={data.color ? data.color.toUpperCase() : 'Par défaut'}
            size="small"
            slotProps={{ htmlInput: { readOnly: true, 'aria-label': 'Couleur sélectionnée' } }}
            sx={{ width: 200 }}
          />
          <Tooltip title="Choisir une couleur">
            <IconButton
              component="label"
              size="small"
              aria-label="Choisir une couleur pour le raccourci"
              sx={{ position: 'relative', overflow: 'hidden' }}
            >
              <ColorizeIcon fontSize="small" />
              <Box
                component="input"
                type="color"
                value={data.color || DEFAULT_COLOR_INPUT_VALUE}
                onChange={(event) => onChange({ color: event.target.value })}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
            </IconButton>
          </Tooltip>
          {data.color && (
            <Tooltip title="Rétablir la couleur par défaut">
              <IconButton size="small" onClick={() => onChange({ color: '' })} aria-label="Rétablir la couleur par défaut du raccourci">
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
