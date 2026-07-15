'use client';

import Box from '@mui/material/Box';
import { resolvePalette, usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { TemplateThumbnail } from '@/components/personnalisation/TemplateThumbnail';
import { getTemplate } from '@/lib/personnalisation/templates';
import type { Variant } from '@/types/personnalisation';

interface VariantThumbnailProps {
  variant: Variant;
}

/** Vignette de variante pour le hub : rend les tokens réels de la variante (palette + maquette),
 * jamais une image figée — deux variantes de couleurs différentes doivent avoir des vignettes
 * visuellement différentes. */
export function VariantThumbnail({ variant }: VariantThumbnailProps) {
  const { customPalettes } = usePersonnalisation();
  const palette = resolvePalette(variant.tokens.paletteId, customPalettes);
  const template = getTemplate(variant.templateId);

  return (
    <Box sx={{ aspectRatio: '16 / 10', width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
      <TemplateThumbnail template={template} tokens={variant.tokens} palette={palette} />
    </Box>
  );
}
