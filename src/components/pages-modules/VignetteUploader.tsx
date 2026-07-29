'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Icons } from '@/components/ui/Icons';

const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024;

interface VignetteUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Nom de l'élément affiché dans les libellés (ex. "logo", "image de fond"). Défaut : "vignette". */
  itemLabel?: string;
  /** Genre grammatical de `itemLabel`, pour accorder l'article ("un logo" vs "une vignette"). */
  itemGender?: 'masculine' | 'feminine';
  /** Hauteur minimale de la zone d'aperçu — réduite pour les emplacements compacts (ex. logos). */
  minHeight?: number;
  /** Alignement horizontal des boutons Ajouter/Modifier/Supprimer. Défaut : à droite. */
  buttonsAlign?: 'flex-start' | 'flex-end';
  /** Style additionnel appliqué au conteneur racine (ex. marge au-dessus dans un contexte imbriqué). */
  sx?: SxProps<Theme>;
}

export function VignetteUploader({
  value,
  onChange,
  itemLabel = 'vignette',
  itemGender = 'feminine',
  minHeight = 180,
  buttonsAlign = 'flex-end',
  sx,
}: VignetteUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const article = itemGender === 'masculine' ? 'un' : 'une';
  const possessive = itemGender === 'masculine' ? 'mon' : 'ma';

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/') || file.size > MAX_THUMBNAIL_SIZE_BYTES) return;
    onChange(URL.createObjectURL(file));
  }

  return (
    <Box sx={sx}>
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: buttonsAlign, mb: 2 }}>
        {value && (
          <Button size="small" variant="outlined" color="inherit" startIcon={<DeleteOutlineIcon fontSize="small" />} onClick={() => onChange(null)}>
            Supprimer {possessive} {itemLabel}
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          startIcon={<AddPhotoAlternateOutlinedIcon fontSize="small" />}
          onClick={() => fileInputRef.current?.click()}
        >
          {value ? `Modifier ${possessive} ${itemLabel}` : `Ajouter ${article} ${itemLabel}`}
        </Button>
      </Stack>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} aria-hidden="true" tabIndex={-1} />
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          minHeight,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'action.hover',
          color: 'text.disabled',
          overflow: 'hidden',
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={itemLabel} style={{ maxHeight: 220, maxWidth: '100%', objectFit: 'contain' }} />
        ) : (
          <Icons.Image size={40} />
        )}
      </Box>
    </Box>
  );
}
