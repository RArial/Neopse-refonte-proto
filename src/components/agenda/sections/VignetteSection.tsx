'use client';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { ImageField } from '@/components/media-library/field/ImageField';
import { THUMBNAIL_RATIO } from '@/lib/mediaLibrary/constants';
import type { EventFormData } from '@/types/agenda';

interface SectionProps {
  data: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
}

export function VignetteSection({ data, onChange }: SectionProps) {
  return (
    <Stack spacing={2}>
      <ImageField
        config={{ context: "Vignette de l'événement", folder: 'Agenda', ratio: THUMBNAIL_RATIO, altText: 'decorative' }}
        value={data.thumbnailUrl ? { url: data.thumbnailUrl, crop: data.thumbnailCrop } : null}
        onChange={(next) => onChange({ thumbnailUrl: next?.url ?? null, thumbnailCrop: next?.crop })}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.showThumbnailOnWidget}
            onChange={(event) => onChange({ showThumbnailOnWidget: event.target.checked })}
          />
        }
        label="Afficher la vignette de l'événement sur le widget."
      />
    </Stack>
  );
}
