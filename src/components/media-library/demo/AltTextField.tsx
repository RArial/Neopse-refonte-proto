'use client';

import { forwardRef } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import type { MediaImage } from '@/types/mediaLibrary';

interface AltTextFieldProps {
  image: MediaImage;
  /** Libellé accessible complet quand plusieurs champs se suivent (diaporama). */
  ariaLabel?: string;
  compact?: boolean;
}

/** Le texte est porté par l'image dans la médiathèque : le modifier ici le modifie partout. */
export const AltTextField = forwardRef<HTMLTextAreaElement, AltTextFieldProps>(function AltTextField({ image, ariaLabel, compact = false }, ref) {
  const { updateAltText } = useMediaLibrary();
  const missing = image.altText.trim() === '';

  return (
    <Stack spacing={0.75}>
      <TextField
        size="small"
        label="Texte alternatif"
        value={image.altText}
        onChange={(event) => updateAltText(image.id, event.target.value)}
        multiline
        minRows={compact ? 1 : 2}
        fullWidth
        inputRef={ref}
        helperText={compact ? undefined : "Enregistré avec l'image : il sera repris partout où elle est utilisée."}
        slotProps={{ htmlInput: ariaLabel ? { 'aria-label': ariaLabel } : undefined }}
      />
      {missing && !compact && (
        <Alert severity="warning" role="status" variant="outlined" sx={{ py: 0 }}>
          Pas encore de texte alternatif : décrivez l&apos;image pour les personnes qui ne la voient pas.
        </Alert>
      )}
    </Stack>
  );
});
