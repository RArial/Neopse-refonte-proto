'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { formatDimensions } from '@/lib/mediaLibrary/format';
import type { ImagePickerMode, MediaImage } from '@/types/mediaLibrary';

interface ImageCardProps {
  image: MediaImage;
  inputId: string;
  mode: ImagePickerMode;
  /** Nom du groupe de boutons radio (mode single). */
  groupName: string;
  /** Position dans la sélection (1-based), 0 si non sélectionnée. */
  order: number;
  isCurrent: boolean;
  isNew: boolean;
  onToggle: (imageId: string) => void;
}

export function ImageCard({ image, inputId, mode, groupName, order, isCurrent, isNew, onToggle }: ImageCardProps) {
  const selected = order > 0;

  return (
    <Box
      component="label"
      htmlFor={inputId}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        border: '2px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'action.selected' : 'background.paper',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: (theme) => theme.transitions.create(['border-color', 'background-color'], { duration: 150 }),
        '&:hover': { borderColor: selected ? 'primary.dark' : 'text.secondary' },
        '&:has(input:focus-visible)': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <input
        id={inputId}
        type={mode === 'single' ? 'radio' : 'checkbox'}
        name={mode === 'single' ? groupName : undefined}
        checked={selected}
        onChange={() => onToggle(image.id)}
        className="sr-only"
      />

      <Box sx={{ position: 'relative', aspectRatio: '4 / 3', bgcolor: 'action.hover' }}>
        <MediaThumb src={image.url} sizes="200px" />

        {(isCurrent || isNew) && (
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {isCurrent && <Chip label="Actuelle" size="small" color="secondary" />}
            {isNew && <Chip label="Nouvelle" size="small" color="primary" />}
          </Box>
        )}

        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            display: 'grid',
            placeItems: 'center',
            borderRadius: mode === 'single' ? '50%' : 1,
            border: '2px solid',
            borderColor: selected ? 'primary.main' : 'grey.600',
            bgcolor: selected ? 'primary.main' : 'background.paper',
            color: 'primary.contrastText',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {selected && (mode === 'single' ? <CheckIcon sx={{ fontSize: 18 }} /> : order)}
        </Box>
      </Box>

      <Box sx={{ px: 1.25, py: 1 }}>
        <Typography
          variant="body2"
          title={image.name}
          sx={{
            fontWeight: 500,
            lineHeight: 1.4,
            wordBreak: 'break-all',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {image.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDimensions(image.width, image.height)}
        </Typography>
        {selected && mode === 'multiple' && <span className="sr-only">, sélectionnée en position {order}</span>}
      </Box>
    </Box>
  );
}
