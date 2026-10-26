'use client';

import { ImageField } from '@/components/media-library/field/ImageField';
import { PanelShell } from '@/components/ui/PanelShell';
import { THUMBNAIL_RATIO } from '@/lib/mediaLibrary/constants';
import type { EditoFormData } from '@/types/editos';

interface PanelProps {
  data: EditoFormData;
  onChange: (patch: Partial<EditoFormData>) => void;
}

export function ThumbnailPanel({ data, onChange }: PanelProps) {
  return (
    <PanelShell icon="Image" title="Vignette de l'édito">
      <ImageField
        config={{ context: "Vignette de l'édito", folder: 'Éditos', ratio: THUMBNAIL_RATIO, altText: 'decorative' }}
        value={data.thumbnailUrl ? { url: data.thumbnailUrl, crop: data.thumbnailCrop } : null}
        onChange={(next) => onChange({ thumbnailUrl: next?.url ?? null, thumbnailCrop: next?.crop })}
      />
    </PanelShell>
  );
}
