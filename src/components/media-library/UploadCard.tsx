'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import type { MediaFolder, MediaImage, UploadItem } from '@/types/mediaLibrary';

interface UploadCardProps {
  item: UploadItem;
  duplicateOf?: MediaImage;
  duplicateFolder?: MediaFolder;
  onDiscard: (item: UploadItem) => void;
  onUseExisting: (item: UploadItem, existing: MediaImage) => void;
  onForceUpload: (item: UploadItem) => void;
}

const BORDER_COLOR: Record<UploadItem['status'], string> = {
  uploading: 'divider',
  rejected: 'error.main',
  duplicate: 'warning.dark',
};

/** État d'un fichier importé, affiché dans la grille : aucune fenêtre secondaire. */
export function UploadCard({ item, duplicateOf, duplicateFolder, onDiscard, onUseExisting, onForceUpload }: UploadCardProps) {
  const name = item.file.name;

  return (
    <Box
      role="group"
      aria-label={name}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        border: '2px solid',
        borderColor: BORDER_COLOR[item.status],
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '4 / 3', bgcolor: 'action.hover', opacity: item.status === 'uploading' ? 0.6 : 1 }}>
        {/* Un format refusé (ex. HEIC) peut ne pas s'afficher : le fond neutre reste lisible. */}
        <MediaThumb src={item.previewUrl} sizes="200px" />
      </Box>

      <Stack spacing={1} sx={{ px: 1.25, py: 1, flex: 1 }}>
        <Typography variant="body2" title={name} sx={{ fontWeight: 500, lineHeight: 1.4, wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {name}
        </Typography>

        {item.status === 'uploading' && (
          <>
            <LinearProgress variant="determinate" value={item.progress} aria-label={`Import de ${name}`} />
            <Typography variant="caption" color="text.secondary">
              Import en cours… {item.progress} %
            </Typography>
          </>
        )}

        {item.status === 'rejected' && (
          <>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start' }}>
              <ErrorOutlineOutlinedIcon fontSize="small" color="error" aria-hidden="true" sx={{ mt: '1px' }} />
              <Typography variant="caption" sx={{ lineHeight: 1.5 }}>
                {item.reason}
              </Typography>
            </Stack>
            <Button size="small" variant="outlined" color="inherit" onClick={() => onDiscard(item)} sx={{ mt: 'auto' }} aria-label={`Retirer ${name}`}>
              Retirer
            </Button>
          </>
        )}

        {item.status === 'duplicate' && duplicateOf && (
          <>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start' }}>
              <WarningAmberIcon fontSize="small" sx={{ color: 'warning.dark', mt: '1px' }} aria-hidden="true" />
              <Typography variant="caption" sx={{ lineHeight: 1.5 }}>
                Cette image est déjà dans la médiathèque{duplicateFolder ? `, dossier « ${duplicateFolder.name} »` : ''}.
              </Typography>
            </Stack>
            <Stack spacing={0.75} sx={{ mt: 'auto' }}>
              <Button size="small" variant="contained" onClick={() => onUseExisting(item, duplicateOf)}>
                Utiliser l&apos;existante
              </Button>
              <Button size="small" variant="outlined" onClick={() => onForceUpload(item)}>
                Importer quand même
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}
