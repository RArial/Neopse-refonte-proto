'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { VariantThumbnail } from '@/components/personnalisation/hub/VariantThumbnail';
import type { Variant } from '@/types/personnalisation';

interface PublishedRowProps {
  variant: Variant;
}

function formatPublishedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export function PublishedRow({ variant }: PublishedRowProps) {
  const { duplicateVariant } = usePersonnalisation();
  const router = useRouter();

  function openEditor() {
    router.push(`/dashboard/personnalisation/${variant.id}`);
  }

  function handleDuplicate() {
    duplicateVariant(variant.id, `Copie de ${variant.name}`);
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        borderLeft: '3px solid',
        borderLeftColor: 'success.main',
      }}
    >
      <Box sx={{ width: 140, flexShrink: 0, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <VariantThumbnail variant={variant} />
      </Box>

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {variant.name}
          </Typography>
          <Chip label="En ligne" color="success" size="small" variant="outlined" />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Publiée le {formatPublishedDate(variant.updatedAt)} par {variant.updatedBy}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          startIcon={<ContentCopyIcon fontSize="small" />}
          onClick={handleDuplicate}
        >
          Dupliquer
        </Button>
        <Button variant="contained" size="small" onClick={openEditor}>
          Ouvrir
        </Button>
      </Stack>
    </Paper>
  );
}
