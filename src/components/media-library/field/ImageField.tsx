'use client';

import { useEffect, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CropIcon from '@mui/icons-material/Crop';
import { CroppedImage } from '@/components/media-library/CroppedImage';
import { AltTextField } from '@/components/media-library/field/AltTextField';
import { FieldDropZone, PREVIEW_HEIGHT, type ImageFieldSize } from '@/components/media-library/field/FieldDropZone';
import { FieldUploadStatus } from '@/components/media-library/field/FieldUploadStatus';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { useFieldUploads } from '@/hooks/useFieldUploads';
import { autoCropArea } from '@/lib/mediaLibrary/crop';
import { fileNameFromUrl } from '@/lib/mediaLibrary/format';
import { withStrongPrimary } from '@/lib/theme';
import type { CropArea, ImagePickerConfig, ImagePickerOptions, MediaImage } from '@/types/mediaLibrary';

export type ImageFieldConfig = Omit<ImagePickerConfig, 'mode' | 'currentImageId' | 'currentCrop'>;

/** Les formulaires stockent une URL ; le recadrage est conservé à part, en coordonnées. */
export interface ImageFieldValue {
  url: string;
  crop?: CropArea;
}

interface ImageFieldProps {
  config: ImageFieldConfig;
  value: ImageFieldValue | null;
  onChange: (value: ImageFieldValue | null) => void;
  /** Seule la hauteur varie selon l'emplacement : compact pour les logos et les fonds. */
  size?: ImageFieldSize;
}

/** Champ une image : import direct (cas principal) ou choix dans la médiathèque. */
export function ImageField({ config, value, onChange, size = 'default' }: ImageFieldProps) {
  const { images, openImagePicker } = useMediaLibrary();
  // Une URL absente de la médiathèque (données de démo des formulaires) reste affichée telle quelle.
  const image = value ? images.find((item) => item.url === value.url) : undefined;
  const alt = config.altText === 'decorative' || !image ? '' : image.altText;
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  const altFieldRef = useRef<HTMLTextAreaElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);
  // Le bouton qui avait le focus (zone de dépôt, « Retirer ») disparaît : on le replace au bon endroit.
  const pendingFocus = useRef<'filled' | 'empty' | null>(null);
  const hasValue = value !== null;

  function place(next: MediaImage) {
    pendingFocus.current = 'filled';
    onChange({ url: next.url, crop: config.ratio ? autoCropArea(next, config.ratio) : undefined });
  }

  const uploads = useFieldUploads({ folder: config.folder, onImage: place });

  useEffect(() => {
    if (pendingFocus.current === 'filled' && hasValue) {
      (altFieldRef.current ?? changeButtonRef.current)?.focus();
      pendingFocus.current = null;
    } else if (pendingFocus.current === 'empty' && !hasValue) {
      emptyStateRef.current?.querySelector<HTMLButtonElement>('[data-field-import]')?.focus();
      pendingFocus.current = null;
    }
  }, [hasValue]);

  async function openLibrary(options?: ImagePickerOptions) {
    const result = await openImagePicker({ ...config, mode: 'single', currentImageId: image?.id, currentCrop: value?.crop }, options);
    if (!result?.[0]) return;
    if (!hasValue) pendingFocus.current = 'filled';
    onChange({ url: result[0].image.url, crop: result[0].crop });
  }

  function remove() {
    pendingFocus.current = 'empty';
    onChange(null);
  }

  return (
    <ThemeProvider theme={withStrongPrimary}>
      {!value ? (
        <Stack spacing={1.5} ref={emptyStateRef}>
          <FieldUploadStatus uploads={uploads.uploads} onDiscard={uploads.discard} onUseExisting={uploads.keepExisting} onForceUpload={uploads.force} />
          <FieldDropZone
            multiple={false}
            size={size}
            onFiles={(files) => uploads.importFiles(files.slice(0, 1))}
            onBrowseLibrary={() => openLibrary()}
          />
        </Stack>
      ) : (
        <Stack spacing={1.5}>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
            {image && value.crop && config.ratio ? (
              <CroppedImage image={image} crop={value.crop} ratio={config.ratio} alt={alt} />
            ) : (
              <Box sx={{ position: 'relative', height: PREVIEW_HEIGHT[size] }}>
                <MediaThumb src={value.url} alt={alt} fit="contain" sizes="(max-width: 768px) 100vw, 480px" />
              </Box>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
            {image?.name ?? fileNameFromUrl(value.url)}
          </Typography>

          {config.altText === 'ask' && image && <AltTextField ref={altFieldRef} image={image} />}

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {config.ratio && image && (
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
      )}
    </ThemeProvider>
  );
}
