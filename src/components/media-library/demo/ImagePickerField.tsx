'use client';

import { useRef } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { CroppedImage } from '@/components/media-library/CroppedImage';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import type { CropArea, ImagePickerConfig } from '@/types/mediaLibrary';

export interface ImageFieldValue {
  imageId: string;
  crop?: CropArea;
}

interface ImagePickerFieldProps {
  config: Omit<ImagePickerConfig, 'currentImageId' | 'currentCrop'>;
  value: ImageFieldValue | null;
  onChange: (value: ImageFieldValue | null) => void;
}

export function ImagePickerField({ config, value, onChange }: ImagePickerFieldProps) {
  const { images, openImagePicker } = useMediaLibrary();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const image = value ? images.find((item) => item.id === value.imageId) : undefined;
  const alt = config.altText === 'decorative' || !image ? '' : image.altText;

  async function pick() {
    const result = await openImagePicker({ ...config, currentImageId: value?.imageId, currentCrop: value?.crop });
    if (result?.[0]) onChange({ imageId: result[0].image.id, crop: result[0].crop });
  }

  function remove() {
    onChange(null);
    // Le bouton « Retirer » disparaît : on garde le focus dans le champ.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <Stack spacing={1.5}>
      <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
        {image && value?.crop && config.ratio ? (
          <CroppedImage image={image} crop={value.crop} ratio={config.ratio} alt={alt} />
        ) : image ? (
          <Box sx={{ position: 'relative', aspectRatio: '16 / 9' }}>
            <MediaThumb src={image.url} alt={alt} fit="contain" sizes="(max-width: 768px) 100vw, 480px" />
          </Box>
        ) : (
          <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', aspectRatio: '16 / 9', color: 'text.secondary' }}>
            <AddPhotoAlternateOutlinedIcon fontSize="large" aria-hidden="true" />
            <Typography variant="body2">Aucune image choisie</Typography>
          </Stack>
        )}
      </Box>

      {image && (
        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
          {image.name}
        </Typography>
      )}

      {image && config.altText === 'ask' && (
        image.altText.trim() ? (
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary' }}>Texte alternatif : </Box>« {image.altText} »
          </Typography>
        ) : (
          <Alert severity="warning" variant="outlined" role="status">
            Cette image n&apos;a pas encore de texte alternatif.
          </Alert>
        )
      )}

      <Stack direction="row" spacing={1}>
        <Button ref={triggerRef} variant="outlined" onClick={pick}>
          {image ? "Changer d'image" : 'Choisir une image'}
        </Button>
        {image && (
          <Button variant="text" color="inherit" onClick={remove}>
            Retirer
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
