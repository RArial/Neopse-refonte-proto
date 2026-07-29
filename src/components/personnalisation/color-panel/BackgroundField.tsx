'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { hasTextureOptions, TEXTURE_OPTIONS } from '@/lib/personnalisation/backgrounds';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { SectionPropertyRow } from '@/components/personnalisation/color-panel/SectionPropertyRow';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import type { BackgroundSlot } from '@/types/personnalisation';

interface BackgroundFieldProps {
  slot: BackgroundSlot;
  /** Clé de la propriété "couleur" (dans la section `general`) associée à ce fond. */
  colorKey: 'bodyBg' | 'secondaryBg';
}

const NO_TEXTURE_VALUE = '__none__';

export function BackgroundField({ slot, colorKey }: BackgroundFieldProps) {
  const { draftTokens, setBackgroundMode, setBackgroundGraphicKind, setBackgroundImage, setBackgroundTexture } = usePersonnalisation();

  const mode = draftTokens.backgroundModes[slot];
  const graphic = draftTokens.backgroundGraphics[slot];

  return (
    <Stack spacing={1.5}>
      <Box sx={{ px: 2 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={(_, next) => next && setBackgroundMode(slot, next)}
          aria-label="Type de fond"
        >
          <ToggleButton value="color">Couleur</ToggleButton>
          <ToggleButton value="graphic">Fond graphique</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {mode === 'color' ? (
        <SectionPropertyRow section="general" propertyKey={colorKey} />
      ) : (
        <Stack spacing={1.5} sx={{ px: 2 }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={graphic.kind}
            onChange={(_, next) => next && setBackgroundGraphicKind(slot, next)}
            aria-label="Type de fond graphique"
          >
            <ToggleButton value="image">Image personnalisée</ToggleButton>
            <ToggleButton value="texture">Texture</ToggleButton>
          </ToggleButtonGroup>

          {graphic.kind === 'image' ? (
            <VignetteUploader
              value={graphic.imageUrl}
              onChange={(url) => setBackgroundImage(slot, url)}
              itemLabel="visuel de fond"
              itemGender="masculine"
              minHeight={140}
            />
          ) : (
            <Box>
              <Select
                size="small"
                fullWidth
                value={hasTextureOptions() ? graphic.textureId ?? NO_TEXTURE_VALUE : NO_TEXTURE_VALUE}
                onChange={(e) => setBackgroundTexture(slot, e.target.value === NO_TEXTURE_VALUE ? null : e.target.value)}
                aria-label="Choisir une texture"
              >
                {hasTextureOptions() ? (
                  TEXTURE_OPTIONS.map((texture) => (
                    <MenuItem key={texture.id} value={texture.id}>
                      {texture.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={NO_TEXTURE_VALUE} disabled>
                    Aucune texture disponible pour le moment
                  </MenuItem>
                )}
              </Select>
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
}
