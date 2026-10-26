'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { formatRatio } from '@/lib/mediaLibrary/format';
import type { PickerStep } from '@/lib/mediaLibrary/pickerReducer';
import type { ImagePickerConfig } from '@/types/mediaLibrary';

interface PickerHeaderProps {
  config: ImagePickerConfig;
  step: PickerStep;
  withCropStep: boolean;
  titleId: string;
  onClose: () => void;
}

const STEPS: { step: PickerStep; label: string }[] = [
  { step: 'choose', label: 'Choisir' },
  { step: 'crop', label: 'Recadrer' },
];

function formatChipLabel(config: ImagePickerConfig): string | null {
  const parts = [config.ratio && `Format ${formatRatio(config.ratio)}`, config.recommendation && `recommandé ${config.recommendation}`].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : null;
}

export function PickerHeader({ config, step, withCropStep, titleId, onClose }: PickerHeaderProps) {
  const title = step === 'crop' ? "Recadrer l'image" : config.mode === 'single' ? 'Choisir une image' : 'Choisir des images';
  const formatLabel = formatChipLabel(config);

  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      // En-tête ~56 px. Marge droite réservée au bouton fermer, ancré en haut à droite même quand l'en-tête passe à la ligne.
      sx={{ position: 'relative', alignItems: 'center', pl: 3, pr: 8, py: 1, minHeight: 56, borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap', rowGap: 1 }}
    >
      <Typography id={titleId} component="h2" variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
        {title}
      </Typography>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Chip label={config.context} size="small" variant="outlined" />
        {formatLabel && <Chip label={formatLabel} size="small" variant="outlined" />}
      </Stack>

      <Box sx={{ flex: 1 }} />

      {withCropStep && (
        <Box component="ol" aria-label="Étapes" sx={{ display: 'flex', gap: 1.5, listStyle: 'none', m: 0, p: 0 }}>
          {STEPS.map((item, index) => {
            const active = item.step === step;
            return (
              <Box
                component="li"
                key={item.step}
                aria-current={active ? 'step' : undefined}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: active ? 'text.primary' : 'text.secondary', fontWeight: active ? 600 : 400, fontSize: 14 }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    border: '2px solid',
                    borderColor: active ? 'primary.main' : 'grey.600',
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? 'primary.contrastText' : 'text.secondary',
                  }}
                >
                  {index + 1}
                </Box>
                {item.label}
              </Box>
            );
          })}
        </Box>
      )}

      <IconButton onClick={onClose} aria-label="Fermer la médiathèque" sx={{ position: 'absolute', top: 6, right: 12 }}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
