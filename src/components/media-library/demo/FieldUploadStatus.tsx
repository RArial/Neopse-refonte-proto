'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import type { MediaImage, UploadItem } from '@/types/mediaLibrary';

interface FieldUploadStatusProps {
  uploads: UploadItem[];
  onDiscard: (item: UploadItem) => void;
  onUseExisting: (item: UploadItem, existing: MediaImage) => void;
  onForceUpload: (item: UploadItem) => void;
}

/** Même logique que les cartes de la modale (progression, refus, doublon), sous forme de lignes dans le champ. */
export function FieldUploadStatus({ uploads, onDiscard, onUseExisting, onForceUpload }: FieldUploadStatusProps) {
  const { images, folders } = useMediaLibrary();
  if (uploads.length === 0) return null;

  return (
    <Stack spacing={1} aria-live="polite">
      {uploads.map((item) => {
        const name = item.file.name;
        if (item.status === 'uploading') {
          return (
            <Box key={item.id} sx={{ px: 1.5, py: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 0.75 }}>
                Import de {name}… {item.progress} %
              </Typography>
              <LinearProgress variant="determinate" value={item.progress} aria-label={`Import de ${name}`} />
            </Box>
          );
        }
        if (item.status === 'rejected') {
          return (
            <Alert
              key={item.id}
              severity="error"
              variant="outlined"
              action={
                <Button size="small" color="inherit" onClick={() => onDiscard(item)} aria-label={`Retirer ${name}`}>
                  Retirer
                </Button>
              }
            >
              <Box component="span" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>{name}</Box> — {item.reason}
            </Alert>
          );
        }
        const existing = images.find((image) => image.id === item.duplicateOfId);
        if (!existing) return null;
        const folderName = folders.find((folder) => folder.id === existing.folderId)?.name;
        return (
          <Alert key={item.id} severity="warning" variant="outlined">
            <Box component="span" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>{name}</Box> — cette image est déjà dans la médiathèque
            {folderName ? `, dossier « ${folderName} »` : ''}.
            <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
              <Button size="small" variant="contained" onClick={() => onUseExisting(item, existing)}>
                Utiliser l&apos;existante
              </Button>
              <Button size="small" variant="outlined" onClick={() => onForceUpload(item)}>
                Importer quand même
              </Button>
            </Stack>
          </Alert>
        );
      })}
    </Stack>
  );
}
