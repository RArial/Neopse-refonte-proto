'use client';

import Box from '@mui/material/Box';
import { ImageCard } from '@/components/media-library/ImageCard';
import type { ImagePickerMode, MediaImage } from '@/types/mediaLibrary';

interface ImageGridProps {
  images: MediaImage[];
  /** Cartes d'import (progression, refus, doublon), placées en tête. */
  uploadCards: React.ReactNode[];
  mode: ImagePickerMode;
  groupLabel: string;
  idPrefix: string;
  selectedIds: string[];
  currentImageId?: string;
  newImageIds: string[];
  onToggle: (imageId: string) => void;
}

export function imageInputId(idPrefix: string, imageId: string): string {
  return `${idPrefix}-image-${imageId}`;
}

export function ImageGrid({ images, uploadCards, mode, groupLabel, idPrefix, selectedIds, currentImageId, newImageIds, onToggle }: ImageGridProps) {
  return (
    <Box
      role={mode === 'single' ? 'radiogroup' : 'group'}
      aria-label={groupLabel}
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(156px, 1fr))', gap: 2 }}
    >
      {uploadCards}
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          inputId={imageInputId(idPrefix, image.id)}
          mode={mode}
          groupName={`${idPrefix}-selection`}
          order={selectedIds.indexOf(image.id) + 1}
          isCurrent={image.id === currentImageId}
          isNew={newImageIds.includes(image.id)}
          onToggle={onToggle}
        />
      ))}
    </Box>
  );
}
