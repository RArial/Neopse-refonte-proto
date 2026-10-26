'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { pluralize } from '@/lib/mediaLibrary/format';
import type { ImagePickerConfig, MediaImage } from '@/types/mediaLibrary';

interface SlideshowFieldProps {
  config: Omit<ImagePickerConfig, 'mode' | 'currentImageId' | 'currentCrop'>;
  imageIds: string[];
  onChange: (imageIds: string[]) => void;
}

export function SlideshowField({ config, imageIds, onChange }: SlideshowFieldProps) {
  const { images, openImagePicker } = useMediaLibrary();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const slides = imageIds.map((id) => images.find((image) => image.id === id)).filter((image): image is MediaImage => image !== undefined);

  async function add() {
    const result = await openImagePicker({ ...config, mode: 'multiple' });
    if (!result) return;
    const added = result.map((item) => item.image.id).filter((id) => !imageIds.includes(id));
    onChange([...imageIds, ...added]);
  }

  function remove(imageId: string) {
    onChange(imageIds.filter((id) => id !== imageId));
    addButtonRef.current?.focus();
  }

  return (
    <Stack spacing={1.5}>
      {slides.length === 0 ? (
        <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', aspectRatio: '16 / 9', borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover', color: 'text.secondary' }}>
          <AddPhotoAlternateOutlinedIcon fontSize="large" aria-hidden="true" />
          <Typography variant="body2">Le diaporama est vide</Typography>
        </Stack>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary">
            {pluralize(slides.length, 'image', 'images')}, dans l&apos;ordre d&apos;affichage
          </Typography>
          <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1.5 }}>
            {slides.map((image, index) => (
              <Box component="li" key={image.id} sx={{ position: 'relative' }}>
                <Box sx={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 1.5, overflow: 'hidden', bgcolor: 'action.hover' }}>
                  <MediaThumb src={image.url} alt={image.altText} sizes="160px" />
                </Box>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {index + 1}.
                  </Typography>
                  <Typography variant="caption" title={image.name} sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {image.name}
                  </Typography>
                  {!image.altText.trim() && (
                    <WarningAmberIcon sx={{ fontSize: 16, color: 'warning.dark' }} titleAccess="Texte alternatif manquant" />
                  )}
                </Stack>
                <IconButton
                  onClick={() => remove(image.id)}
                  aria-label={`Retirer ${image.name} du diaporama`}
                  sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </>
      )}

      <Box>
        <Button ref={addButtonRef} variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />} onClick={add}>
          Ajouter des images
        </Button>
      </Box>
    </Stack>
  );
}
