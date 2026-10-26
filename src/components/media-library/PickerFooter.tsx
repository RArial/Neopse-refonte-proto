'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ACCEPTED_FORMATS_LABEL, MAX_FILE_SIZE_BYTES } from '@/lib/mediaLibrary/constants';
import { formatFileSize } from '@/lib/mediaLibrary/format';

interface PickerFooterProps {
  primaryLabel: string;
  primaryDisabled: boolean;
  onPrimary: () => void;
  onCancel: () => void;
  /** Étape de recadrage : retour au choix de l'image. */
  onBack?: () => void;
}

export function PickerFooter({ primaryLabel, primaryDisabled, onPrimary, onCancel, onBack }: PickerFooterProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      sx={{ alignItems: 'center', px: 3, py: 1, borderTop: '1px solid', borderColor: 'divider', flexWrap: 'wrap', rowGap: 1 }}
    >
      {onBack ? (
        <Button size="small" variant="text" startIcon={<ArrowBackIcon />} onClick={onBack}>
          Changer d&apos;image
        </Button>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Formats acceptés : {ACCEPTED_FORMATS_LABEL} · {formatFileSize(MAX_FILE_SIZE_BYTES)} maximum par image
        </Typography>
      )}
      <Box sx={{ flex: 1 }} />
      <Button size="small" variant="outlined" color="inherit" onClick={onCancel}>
        Annuler
      </Button>
      <Button size="small" variant="contained" onClick={onPrimary} disabled={primaryDisabled}>
        {primaryLabel}
      </Button>
    </Stack>
  );
}
