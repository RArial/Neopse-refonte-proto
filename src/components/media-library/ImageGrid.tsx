'use client';

import { Fragment, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ImageCard } from '@/components/media-library/ImageCard';
import type { ImageSection } from '@/lib/mediaLibrary/sections';
import type { ImagePickerMode } from '@/types/mediaLibrary';

interface ImageGridProps {
  sections: ImageSection[];
  /** Cartes d'import (progression, refus, doublon), placées en tête. */
  uploadCards: ReactNode[];
  columns: number;
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

export function ImageGrid({ sections, uploadCards, columns, mode, groupLabel, idPrefix, selectedIds, currentImageId, newImageIds, onToggle }: ImageGridProps) {
  return (
    <Box
      role={mode === 'single' ? 'radiogroup' : 'group'}
      aria-label={groupLabel}
      sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 1.5, alignItems: 'start' }}
    >
      {uploadCards}
      {sections.map((section) => (
        <Fragment key={section.key}>
          {section.title && (
            <Typography
              component="h3"
              variant="body2"
              sx={{ gridColumn: '1 / -1', fontWeight: 700, color: 'text.secondary', pt: 1, '&:first-of-type': { pt: 0 } }}
            >
              {section.title}
            </Typography>
          )}
          {section.images.map((image) => (
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
        </Fragment>
      ))}
    </Box>
  );
}
