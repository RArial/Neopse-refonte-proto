'use client';

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ImageFieldSize } from '@/components/media-library/field/FieldDropZone';
import { ImageField } from '@/components/media-library/field/ImageField';
import type { AltTextPolicy, AspectRatio, CropArea } from '@/types/mediaLibrary';

interface VignetteUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Dossier de la médiathèque où ranger les imports, en général le nom du module (ex. « Annuaire »). */
  folder: string;
  /** Nom de l'élément, repris comme contexte dans la médiathèque (ex. « logo », « photo »). Défaut : « vignette ». */
  itemLabel?: string;
  /** Une vignette de liste est décorative (le titre à côté dit tout) ; un logo porte du sens. */
  altText?: AltTextPolicy;
  /** Format imposé par l'emplacement ; active le recadrage automatique. */
  ratio?: AspectRatio;
  crop?: CropArea;
  onCropChange?: (crop: CropArea | undefined) => void;
  /** Seule la hauteur varie selon l'emplacement : compact pour les logos et les fonds. */
  size?: ImageFieldSize;
  /** Style additionnel appliqué au conteneur racine (ex. marge au-dessus dans un contexte imbriqué). */
  sx?: SxProps<Theme>;
}

/** Champ une image des formulaires de modules, branché sur la médiathèque. */
export function VignetteUploader({
  value,
  onChange,
  folder,
  itemLabel = 'vignette',
  altText = 'decorative',
  ratio,
  crop,
  onCropChange,
  size = 'default',
  sx,
}: VignetteUploaderProps) {
  return (
    <Box sx={sx}>
      <ImageField
        config={{ context: itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1), folder, altText, ratio }}
        value={value ? { url: value, crop } : null}
        onChange={(next) => {
          onChange(next?.url ?? null);
          onCropChange?.(next?.crop);
        }}
        size={size}
      />
    </Box>
  );
}
