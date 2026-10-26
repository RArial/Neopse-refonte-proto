'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { formatDate, formatDimensions, formatFileSize } from '@/lib/mediaLibrary/format';
import type { AltTextPolicy, MediaImage } from '@/types/mediaLibrary';

interface SelectedImagePanelProps {
  idPrefix: string;
  title: string;
  image: MediaImage | null;
  folderName?: string;
  altTextPolicy: AltTextPolicy;
  isCurrent: boolean;
  isNew: boolean;
  emptyMessage: string;
  onAltTextChange: (imageId: string, altText: string) => void;
}

export function SelectedImagePanel({ idPrefix, title, image, folderName, altTextPolicy, isCurrent, isNew, emptyMessage, onAltTextChange }: SelectedImagePanelProps) {
  const altId = `${idPrefix}-alt`;

  return (
    <Box component="section" aria-labelledby={`${idPrefix}-panel-title`} sx={{ p: 2.5 }}>
      <Typography id={`${idPrefix}-panel-title`} component="h3" variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        {title}
      </Typography>

      {!image ? (
        <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', color: 'text.secondary', py: 4, px: 1 }}>
          <ImageOutlinedIcon fontSize="large" aria-hidden="true" />
          <Typography variant="body2">{emptyMessage}</Typography>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Box sx={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 1.5, overflow: 'hidden', bgcolor: 'action.hover' }}>
            <MediaThumb src={image.url} fit="contain" sizes="280px" />
          </Box>

          {(isCurrent || isNew) && (
            <Stack direction="row" spacing={0.5}>
              {isCurrent && <Chip label="Actuelle" size="small" color="secondary" />}
              {isNew && <Chip label="Nouvelle" size="small" color="primary" />}
            </Stack>
          )}

          <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
            {image.name}
          </Typography>

          <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 2, rowGap: 0.5, m: 0, fontSize: 14 }}>
            <Box component="dt" sx={{ color: 'text.secondary' }}>Dimensions</Box>
            <Box component="dd" sx={{ m: 0 }}>{formatDimensions(image.width, image.height)}</Box>
            <Box component="dt" sx={{ color: 'text.secondary' }}>Poids</Box>
            <Box component="dd" sx={{ m: 0 }}>{formatFileSize(image.size)}</Box>
            <Box component="dt" sx={{ color: 'text.secondary' }}>Ajoutée le</Box>
            <Box component="dd" sx={{ m: 0 }}>{formatDate(image.createdAt)}</Box>
            {folderName && (
              <>
                <Box component="dt" sx={{ color: 'text.secondary' }}>Dossier</Box>
                <Box component="dd" sx={{ m: 0 }}>{folderName}</Box>
              </>
            )}
          </Box>

          {altTextPolicy === 'ask' && (
            <Stack spacing={1}>
              <TextField
                id={altId}
                label="Texte alternatif"
                value={image.altText}
                onChange={(event) => onAltTextChange(image.id, event.target.value)}
                multiline
                minRows={2}
                fullWidth
                helperText="Enregistré avec l'image dans la médiathèque : il sera repris partout où elle est utilisée."
              />
              {image.altText.trim() === '' && (
                <Alert severity="warning" role="status" variant="outlined">
                  Pas encore de texte alternatif. Vous pouvez valider quand même, mais pensez à décrire l&apos;image pour les personnes qui ne la voient pas.
                </Alert>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
}
