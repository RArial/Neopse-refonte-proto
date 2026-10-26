'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import type { MediaImage } from '@/types/mediaLibrary';

interface SelectionOrderStripProps {
  images: MediaImage[];
  activeId: string | null;
  /** Signale les images sans texte alternatif quand le champ le demande. */
  flagMissingAlt: boolean;
  onActivate: (imageId: string) => void;
  onRemove: (imageId: string) => void;
}

export function SelectionOrderStrip({ images, activeId, flagMissingAlt, onActivate, onRemove }: SelectionOrderStripProps) {
  return (
    <Box component="section" aria-labelledby="order-strip-title" sx={{ borderTop: '1px solid', borderColor: 'divider', px: 3, py: 1.25, bgcolor: 'background.default' }}>
      <Typography id="order-strip-title" component="h3" variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.secondary', mb: 0.75 }}>
        Ordre d&apos;ajout
      </Typography>

      {images.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 72, display: 'flex', alignItems: 'center' }}>
          Cochez des images : elles seront ajoutées au diaporama dans l&apos;ordre où vous les cochez.
        </Typography>
      ) : (
        <Stack component="ol" direction="row" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0, overflowX: 'auto', pb: 0.5 }}>
          {images.map((image, index) => {
            const missingAlt = flagMissingAlt && image.altText.trim() === '';
            const active = image.id === activeId;
            return (
              <Box component="li" key={image.id} sx={{ position: 'relative', flexShrink: 0 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => onActivate(image.id)}
                  aria-pressed={active}
                  title={image.name}
                  sx={{
                    position: 'relative',
                    display: 'block',
                    width: 96,
                    height: 72,
                    p: 0,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: active ? 'primary.main' : 'divider',
                    bgcolor: 'action.hover',
                    cursor: 'pointer',
                    '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                  }}
                >
                  <MediaThumb src={image.url} sizes="96px" />
                  <span className="sr-only">
                    {index + 1}. {image.name}
                    {missingAlt ? ', texte alternatif manquant' : ''}
                  </span>
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      left: 4,
                      top: 4,
                      minWidth: 20,
                      height: 20,
                      px: 0.5,
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {index + 1}
                  </Box>
                  {missingAlt && (
                    <Box aria-hidden="true" sx={{ position: 'absolute', left: 4, bottom: 4, display: 'grid', placeItems: 'center', bgcolor: 'background.paper', borderRadius: '50%', p: '2px' }}>
                      <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.dark' }} />
                    </Box>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={() => onRemove(image.id)}
                  aria-label={`Retirer ${image.name} de la sélection`}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    // Sous les 44 px du thème pour tenir sur la miniature ; reste au-dessus du minimum WCAG 2.5.8 (24 px).
                    minWidth: 32,
                    minHeight: 32,
                    width: 32,
                    height: 32,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
