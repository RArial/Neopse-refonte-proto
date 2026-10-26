'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { pluralize } from '@/lib/mediaLibrary/format';
import type { UploadBatch } from '@/lib/mediaLibrary/pickerReducer';

interface ImportBannerProps {
  batch: UploadBatch | null;
  /** Dossier de destination du champ : tous les imports y vont. */
  destination: string;
}

/** Un seul bandeau pour l'import : où iront les images, puis la progression, puis la confirmation. */
export function ImportBanner({ batch, destination }: ImportBannerProps) {
  const running = batch !== null && batch.finished < batch.total;
  const done = batch !== null && !running && batch.succeeded > 0;

  return (
    <Stack
      direction="row"
      spacing={1}
      aria-live="polite"
      sx={{
        alignItems: 'center',
        minHeight: 40,
        mx: 2.5,
        mt: 1.5,
        px: 1.5,
        borderRadius: 1.5,
        border: '1px dashed',
        borderColor: done ? 'success.main' : running ? 'primary.main' : 'divider',
        borderStyle: running || done ? 'solid' : 'dashed',
        color: running || done ? 'text.primary' : 'text.secondary',
      }}
    >
      {done ? (
        <CheckCircleOutlinedIcon fontSize="small" color="success" aria-hidden="true" />
      ) : (
        <CloudUploadOutlinedIcon fontSize="small" color={running ? 'primary' : 'inherit'} aria-hidden="true" />
      )}
      <Typography variant="body2">
        {running && batch ? (
          <>
            Import dans <strong>{destination}</strong> · {batch.finished} sur {batch.total} terminée{batch.finished > 1 ? 's' : ''}
          </>
        ) : done && batch ? (
          <>
            Import terminé : {pluralize(batch.succeeded, 'image ajoutée', 'images ajoutées')} dans <strong>{destination}</strong>.
          </>
        ) : (
          <>
            Glissez des images ici : elles iront dans <strong>{destination}</strong>.
          </>
        )}
      </Typography>
      <Box sx={{ flex: 1 }} />
    </Stack>
  );
}
