'use client';

import { ImageField } from '@/components/media-library/field/ImageField';
import { PanelShell } from '@/components/ui/PanelShell';
import { THUMBNAIL_RATIO } from '@/lib/mediaLibrary/constants';
import type { NewsFormData } from '@/types/actualites';

interface ThumbnailPanelProps {
  data: NewsFormData;
  onChange: (patch: Partial<NewsFormData>) => void;
}

export function ThumbnailPanel({ data, onChange }: ThumbnailPanelProps) {
  return (
    <PanelShell icon="Image" title="Vignette de l'actualité">
      <ImageField
        config={{ context: "Vignette de l'actualité", folder: 'Actualités', ratio: THUMBNAIL_RATIO, altText: 'decorative' }}
        value={data.thumbnail ?? null}
        onChange={(next) => onChange({ thumbnail: next ?? undefined })}
      />
    </PanelShell>
  );
}
