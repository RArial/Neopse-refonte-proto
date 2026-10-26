'use client';

import { Fragment } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CropIcon from '@mui/icons-material/Crop';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { CropOverlayPreview } from '@/components/media-library/CropOverlayPreview';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { formatDate, formatDimensions, formatFileSize } from '@/lib/mediaLibrary/format';
import type { AltTextPolicy, CropArea, MediaImage } from '@/types/mediaLibrary';

const PREVIEW_HEIGHT = 140;

interface SelectedImagePanelProps {
  idPrefix: string;
  title: string;
  image: MediaImage | null;
  folderName?: string;
  altTextPolicy: AltTextPolicy;
  isCurrent: boolean;
  isNew: boolean;
  emptyMessage: string;
  /** Cadrage qui sera appliqué (ratio imposé) ; absent = pas de recadrage. */
  crop?: CropArea;
  onAdjustCrop?: () => void;
  onAltTextChange: (imageId: string, altText: string) => void;
}

export function SelectedImagePanel({
  idPrefix,
  title,
  image,
  folderName,
  altTextPolicy,
  isCurrent,
  isNew,
  emptyMessage,
  crop,
  onAdjustCrop,
  onAltTextChange,
}: SelectedImagePanelProps) {
  return (
    <Box component="section" aria-labelledby={`${idPrefix}-panel-title`} sx={{ p: 2 }}>
      <Typography id={`${idPrefix}-panel-title`} component="h3" variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>

      {!image ? (
        <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', color: 'text.secondary', py: 4, px: 1 }}>
          <ImageOutlinedIcon fontSize="large" aria-hidden="true" />
          <Typography variant="body2">{emptyMessage}</Typography>
        </Stack>
      ) : (
        <Stack spacing={1.5}>
          <Box>
            <Box sx={{ position: 'relative' }}>
              {crop ? (
                <CropOverlayPreview image={image} crop={crop} height={PREVIEW_HEIGHT} />
              ) : (
                <Box sx={{ position: 'relative', height: PREVIEW_HEIGHT, borderRadius: 1.5, overflow: 'hidden', bgcolor: 'action.hover' }}>
                  <MediaThumb src={image.url} fit="contain" sizes="260px" />
                </Box>
              )}
              {(isCurrent || isNew) && (
                <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 6, left: 6 }}>
                  {isCurrent && <Chip label="Actuelle" size="small" color="secondary" />}
                  {isNew && <Chip label="Nouvelle" size="small" color="primary" />}
                </Stack>
              )}
            </Box>
            {crop && onAdjustCrop && (
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mt: 0.75 }}>
                <CropIcon sx={{ fontSize: 16, color: 'primary.main' }} aria-hidden="true" />
                <Link component="button" type="button" variant="body2" onClick={onAdjustCrop}>
                  Ajuster le cadrage
                </Link>
              </Stack>
            )}
          </Box>

          {altTextPolicy === 'ask' && (
            <Stack spacing={1}>
              <TextField
                id={`${idPrefix}-alt`}
                size="small"
                label="Texte alternatif"
                value={image.altText}
                onChange={(event) => onAltTextChange(image.id, event.target.value)}
                multiline
                minRows={2}
                fullWidth
                helperText="Enregistré avec l'image : il sera repris partout où elle est utilisée."
              />
              {image.altText.trim() === '' && (
                <Alert severity="warning" role="status" variant="outlined" sx={{ py: 0, '& .MuiAlert-message': { fontSize: 14 } }}>
                  Pas encore de texte alternatif. Vous pouvez valider quand même.
                </Alert>
              )}
            </Stack>
          )}

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
              {image.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Coupures autorisées seulement entre les segments, jamais au milieu d'une date ou d'une dimension. */}
              {[formatDimensions(image.width, image.height), formatFileSize(image.size), formatDate(image.createdAt), folderName]
                .filter(Boolean)
                .map((part, index) => (
                  <Fragment key={part}>
                    {index > 0 && ' · '}
                    <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                      {part}
                    </Box>
                  </Fragment>
                ))}
            </Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
