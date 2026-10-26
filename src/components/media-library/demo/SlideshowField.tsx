'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { AltTextField } from '@/components/media-library/demo/AltTextField';
import { FieldDropZone } from '@/components/media-library/demo/FieldDropZone';
import { FieldUploadStatus } from '@/components/media-library/demo/FieldUploadStatus';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { useFieldUploads } from '@/hooks/useFieldUploads';
import { pluralize } from '@/lib/mediaLibrary/format';
import type { ImagePickerConfig, MediaImage } from '@/types/mediaLibrary';

interface SlideshowFieldProps {
  config: Omit<ImagePickerConfig, 'mode' | 'currentImageId' | 'currentCrop'>;
  imageIds: string[];
  /** Mise à jour fonctionnelle : plusieurs imports peuvent aboutir avant le rendu suivant. */
  onChange: (update: (imageIds: string[]) => string[]) => void;
}

function appendUnique(ids: string[], added: string[]): string[] {
  return [...ids, ...added.filter((id) => !ids.includes(id))];
}

export function SlideshowField({ config, imageIds, onChange }: SlideshowFieldProps) {
  const { images, openImagePicker } = useMediaLibrary();
  const slides = imageIds.map((id) => images.find((image) => image.id === id)).filter((image): image is MediaImage => image !== undefined);
  const uploads = useFieldUploads({ folder: config.folder, onImage: (image) => onChange((ids) => appendUnique(ids, [image.id])) });

  async function browseLibrary() {
    const result = await openImagePicker({ ...config, mode: 'multiple' });
    if (result) onChange((ids) => appendUnique(ids, result.map((item) => item.image.id)));
  }

  return (
    <Stack spacing={1.5}>
      {slides.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary">
            {pluralize(slides.length, 'image', 'images')}, dans l&apos;ordre d&apos;affichage
          </Typography>
          <Stack component="ol" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {slides.map((image, index) => (
              <Stack
                component="li"
                key={image.id}
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'flex-start', p: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
              >
                <Box sx={{ position: 'relative', width: 96, height: 72, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover' }}>
                  <MediaThumb src={image.url} alt={image.altText} sizes="96px" />
                </Box>
                <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" title={image.name} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>{index + 1}.</Box> {image.name}
                  </Typography>
                  {config.altText === 'ask' && <AltTextField image={image} compact ariaLabel={`Texte alternatif de l'image ${index + 1}, ${image.name}`} />}
                </Stack>
                <IconButton size="small" onClick={() => onChange((ids) => ids.filter((id) => id !== image.id))} aria-label={`Retirer ${image.name} du diaporama`}>
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </>
      )}

      <FieldUploadStatus uploads={uploads.uploads} onDiscard={uploads.discard} onUseExisting={uploads.keepExisting} onForceUpload={uploads.force} />
      <FieldDropZone multiple folder={config.folder} onFiles={uploads.importFiles} onBrowseLibrary={browseLibrary} />
    </Stack>
  );
}
