'use client';

import { useState, type ChangeEvent } from 'react';
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
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

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
  diaporamaType: DiaporamaType;
  images: DiaporamaImage[];
  onChangeType: (diaporamaType: DiaporamaType) => void;
  onChangeImages: (images: DiaporamaImage[]) => void;
  onNotify: (message: string) => void;
}

export function DiaporamaField({ diaporamaType, images, onChangeType, onChangeImages, onNotify }: DiaporamaFieldProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  function handleImagesSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;
    const added = Array.from(selected)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({ id: randomId('image'), name: file.name, url: URL.createObjectURL(file) }));
    onChangeImages([...images, ...added]);
    event.target.value = '';
  }

  function removeImage(id: string) {
    onChangeImages(images.filter((image) => image.id !== id));
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

      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
        <Button type="button" component="label" variant="contained" color="success" startIcon={<AddPhotoAlternateOutlinedIcon fontSize="small" />}>
          Ajouter une image
          <input type="file" accept="image/*" multiple hidden onChange={handleImagesSelected} />
        </Button>
        <Button type="button" variant="outlined" color="inherit" startIcon={<VisibilityOutlinedIcon fontSize="small" />} onClick={openPreview}>
          Prévisualiser mon diaporama
        </Button>
      </Stack>

      {images.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1.5 }}>
          {images.map((image) => (
            <Box key={image.id} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.name} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
              <IconButton
                size="small"
                onClick={() => removeImage(image.id)}
                aria-label={`Retirer l'image ${image.name}`}
                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

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
