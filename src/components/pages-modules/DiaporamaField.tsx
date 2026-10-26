'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ImageListField } from '@/components/media-library/field/ImageListField';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { fileNameFromUrl } from '@/lib/mediaLibrary/format';

export type DiaporamaType = 'aucune' | 'galerie' | 'diaporama-externe';

export interface DiaporamaImage {
  id: string;
  name: string;
  url: string;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface DiaporamaFieldProps {
  /** Dossier de la médiathèque où ranger les imports, en général le nom du module. */
  folder: string;
  diaporamaType: DiaporamaType;
  images: DiaporamaImage[];
  onChangeType: (diaporamaType: DiaporamaType) => void;
  onChangeImages: (images: DiaporamaImage[]) => void;
  onNotify: (message: string) => void;
}

export function DiaporamaField({ folder, diaporamaType, images, onChangeType, onChangeImages, onNotify }: DiaporamaFieldProps) {
  const { images: library } = useMediaLibrary();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  // Plusieurs imports peuvent aboutir avant le rendu suivant : on applique les mises à jour sur la dernière liste connue.
  const latestImages = useRef(images);
  useEffect(() => {
    latestImages.current = images;
  });

  function updateUrls(update: (urls: string[]) => string[]) {
    const byUrl = new Map(latestImages.current.map((image) => [image.url, image]));
    const next = update(latestImages.current.map((image) => image.url)).map(
      (url) => byUrl.get(url) ?? { id: randomId('image'), name: library.find((image) => image.url === url)?.name ?? fileNameFromUrl(url), url },
    );
    latestImages.current = next;
    onChangeImages(next);
  }

  function openPreview() {
    if (images.length === 0) {
      onNotify('Ajoutez au moins une image pour prévisualiser le diaporama.');
      return;
    }
    setPreviewIndex(0);
  }

  return (
    <Stack spacing={2.5}>
      <TextField
        select
        label="Type de diaporama"
        value={diaporamaType}
        onChange={(event) => onChangeType(event.target.value as DiaporamaType)}
        sx={{ maxWidth: 340 }}
      >
        <MenuItem value="aucune">Aucune sélection</MenuItem>
        <MenuItem value="galerie">Galerie de photos existante</MenuItem>
        <MenuItem value="diaporama-externe">Diaporama externe</MenuItem>
      </TextField>

      <ImageListField config={{ context: 'Diaporama', folder, altText: 'ask' }} urls={images.map((image) => image.url)} onChange={updateUrls} />

      <Box>
        <Button type="button" size="small" variant="outlined" color="inherit" startIcon={<VisibilityOutlinedIcon fontSize="small" />} onClick={openPreview}>
          Prévisualiser mon diaporama
        </Button>
      </Box>

      <Dialog open={previewIndex !== null} onClose={() => setPreviewIndex(null)} maxWidth="md" fullWidth aria-labelledby="diaporama-preview-title">
        <DialogTitle id="diaporama-preview-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          Aperçu du diaporama
          <IconButton aria-label="Fermer l'aperçu" onClick={() => setPreviewIndex(null)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {previewIndex !== null && images[previewIndex] && (
            <>
              <Box sx={{ width: '100%', display: 'grid', placeItems: 'center', minHeight: 320, bgcolor: 'action.hover', borderRadius: 2, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[previewIndex].url} alt={images[previewIndex].name} style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain' }} />
              </Box>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <IconButton
                  onClick={() => setPreviewIndex((index) => (index === null ? null : (index - 1 + images.length) % images.length))}
                  aria-label="Image précédente"
                  disabled={images.length < 2}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {previewIndex + 1} / {images.length}
                </Typography>
                <IconButton
                  onClick={() => setPreviewIndex((index) => (index === null ? null : (index + 1) % images.length))}
                  aria-label="Image suivante"
                  disabled={images.length < 2}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Stack>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
