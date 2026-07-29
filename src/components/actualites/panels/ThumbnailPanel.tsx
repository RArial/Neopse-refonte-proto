'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import { PanelShell } from '@/components/ui/PanelShell';
import type { NewsFormData } from '@/types/actualites';

const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024;

interface PanelProps {
  data: NewsFormData;
  onChange: (patch: Partial<NewsFormData>) => void;
}

export function ThumbnailPanel({ data, onChange }: PanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/') || file.size > MAX_THUMBNAIL_SIZE_BYTES) return;
    onChange({ thumbnailUrl: URL.createObjectURL(file) });
  }

  return (
    <PanelShell icon="Image" title="Vignette de l'actualité">
      <Box
        component="button"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          width: '100%',
          minHeight: 160,
          border: '1.5px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: data.thumbnailUrl ? 'transparent' : 'action.hover',
          color: 'text.secondary',
          cursor: 'pointer',
          fontFamily: 'inherit',
          overflow: 'hidden',
          p: 0,
          '&:hover': { borderColor: 'primary.main' },
        }}
        aria-label="Glissez une image ou cliquez pour parcourir"
      >
        {data.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.thumbnailUrl} alt="Vignette de l'actualité" style={{ maxHeight: 220, maxWidth: '100%', objectFit: 'contain' }} />
        ) : (
          <>
            <Icons.Image size={28} />
            <Typography variant="body2">Glissez une image ou cliquez pour parcourir</Typography>
          </>
        )}
      </Box>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} aria-hidden="true" tabIndex={-1} />
    </PanelShell>
  );
}
