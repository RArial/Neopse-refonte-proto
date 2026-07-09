'use client';

import { useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import type { SiteSettings } from '@/types/parametres';

interface FaviconSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function FaviconSection({ settings, onChange }: FaviconSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ faviconUrl: url });
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            bgcolor: 'action.hover',
          }}
        >
          {settings.faviconUrl ? (
            <Image src={settings.faviconUrl} alt="Aperçu de l'icône du site" width={40} height={40} unoptimized />
          ) : (
            <Box sx={{ color: 'text.disabled' }} aria-hidden="true">
              <Icons.Image size={22} />
            </Box>
          )}
        </Box>
        <Stack spacing={0.75}>
          <Button
            component="label"
            variant="outlined"
            size="small"
            startIcon={<Icons.Folder size={16} />}
          >
            Choisir une image
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/x-icon,image/svg+xml"
              hidden
              onChange={handleFileChange}
              aria-label="Choisir une icône de site (favicon)"
            />
          </Button>
          <Typography variant="caption" color="text.secondary">
            Format PNG, ICO ou SVG, carré, 32×32 px minimum recommandé.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
