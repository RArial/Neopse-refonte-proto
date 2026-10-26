'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CropIcon from '@mui/icons-material/Crop';
import { CroppedImage } from '@/components/media-library/CroppedImage';
import { AltTextField } from '@/components/media-library/demo/AltTextField';
import { FieldDropZone } from '@/components/media-library/demo/FieldDropZone';
import { FieldUploadStatus } from '@/components/media-library/demo/FieldUploadStatus';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { useFieldUploads } from '@/hooks/useFieldUploads';
import { autoCropArea } from '@/lib/mediaLibrary/crop';
import type { CropArea, ImagePickerConfig, ImagePickerOptions, MediaImage } from '@/types/mediaLibrary';

export interface ImageFieldValue {
  imageId: string;
  crop?: CropArea;
}

interface ImagePickerFieldProps {
  config: Omit<ImagePickerConfig, 'mode' | 'currentImageId' | 'currentCrop'>;
  value: ImageFieldValue | null;
  onChange: (value: ImageFieldValue | null) => void;
}

export function ImagePickerField({ config, value, onChange }: ImagePickerFieldProps) {
  const { images, openImagePicker } = useMediaLibrary();
  const image = value ? images.find((item) => item.id === value.imageId) : undefined;
  const alt = config.altText === 'decorative' || !image ? '' : image.altText;
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  const altFieldRef = useRef<HTMLTextAreaElement>(null);
  const browseFocusTarget = useRef<HTMLDivElement>(null);
  // Le bouton qui avait le focus (zone de dépôt, « Retirer ») disparaît : on le replace au bon endroit.
  const pendingFocus = useRef<'filled' | 'empty' | null>(null);

  function place(next: MediaImage) {
    pendingFocus.current = 'filled';
    onChange({ imageId: next.id, crop: config.ratio ? autoCropArea(next, config.ratio) : undefined });
  }

  const uploads = useFieldUploads({ folder: config.folder, onImage: place });

  useEffect(() => {
    if (pendingFocus.current === 'filled' && image) {
      (altFieldRef.current ?? changeButtonRef.current)?.focus();
      pendingFocus.current = null;
    } else if (pendingFocus.current === 'empty' && !image) {
      browseFocusTarget.current?.querySelector<HTMLButtonElement>('button')?.focus();
      pendingFocus.current = null;
    }
  }, [image]);

  async function openLibrary(options?: ImagePickerOptions) {
    const result = await openImagePicker({ ...config, mode: 'single', currentImageId: value?.imageId, currentCrop: value?.crop }, options);
    if (result?.[0]) onChange({ imageId: result[0].image.id, crop: result[0].crop });
  }

  function remove() {
    pendingFocus.current = 'empty';
    onChange(null);
  }

  if (!image) {
    return (
      <Stack spacing={1.5} ref={browseFocusTarget}>
        <FieldUploadStatus uploads={uploads.uploads} onDiscard={uploads.discard} onUseExisting={uploads.keepExisting} onForceUpload={uploads.force} />
        <FieldDropZone
          multiple={false}
          folder={config.folder}
          onFiles={(files) => uploads.importFiles(files.slice(0, 1))}
          onBrowseLibrary={() => openLibrary()}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
        {value?.crop && config.ratio ? (
          <CroppedImage image={image} crop={value.crop} ratio={config.ratio} alt={alt} />
        ) : (
          <Box sx={{ position: 'relative', aspectRatio: '16 / 9' }}>
            <MediaThumb src={image.url} alt={alt} fit="contain" sizes="(max-width: 768px) 100vw, 480px" />
          </Box>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
        {image.name}
      </Typography>

      {config.altText === 'ask' && <AltTextField ref={altFieldRef} image={image} />}

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {config.ratio && (
          <Button size="small" variant="outlined" startIcon={<CropIcon />} onClick={() => openLibrary({ startInCrop: true })}>
            Modifier le cadrage
          </Button>
        )}
        <Button ref={changeButtonRef} size="small" variant="outlined" onClick={() => openLibrary()}>
          Changer d&apos;image
        </Button>
        <Button size="small" variant="text" color="inherit" onClick={remove}>
          Retirer
        </Button>
      </Stack>
    </Stack>
  );
}
