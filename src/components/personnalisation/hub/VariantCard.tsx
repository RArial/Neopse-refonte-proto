'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { VariantThumbnail } from '@/components/personnalisation/hub/VariantThumbnail';
import { DeleteVariantDialog } from '@/components/personnalisation/hub/DeleteVariantDialog';
import { formatRelativeTime } from '@/lib/personnalisation/relativeTime';
import type { Variant } from '@/types/personnalisation';

interface VariantCardProps {
  variant: Variant;
}

export function VariantCard({ variant }: VariantCardProps) {
  const { duplicateVariant, renameVariant, openPublishConfirm } = usePersonnalisation();
  const router = useRouter();

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(variant.name);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function openEditor() {
    router.push(`/dashboard/personnalisation/${variant.id}`);
  }

  function handleDuplicate() {
    duplicateVariant(variant.id, `Copie de ${variant.name}`);
  }

  function startRename() {
    setNameDraft(variant.name);
    setEditingName(true);
  }

  function commitRename() {
    renameVariant(variant.id, nameDraft);
    setEditingName(false);
  }

  function cancelRename() {
    setNameDraft(variant.name);
    setEditingName(false);
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: '12px', borderWidth: '0.5px', display: 'flex', flexDirection: 'column' }}>
      <VariantThumbnail variant={variant} />

      <Stack spacing={0.25} sx={{ p: 1.5, flex: 1 }}>
        {editingName ? (
          <TextField
            autoFocus
            size="small"
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitRename();
              if (event.key === 'Escape') cancelRename();
            }}
            slotProps={{ htmlInput: { 'aria-label': 'Nom de la variante' } }}
          />
        ) : (
          <Stack
            direction="row"
            spacing={0.25}
            sx={{
              alignItems: 'center',
              minWidth: 0,
              '&:hover .rename-icon, &:focus-within .rename-icon': { opacity: 1 },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {variant.name}
            </Typography>
            <Tooltip title={`Renommer ${variant.name}`}>
              <IconButton
                className="rename-icon"
                size="small"
                onClick={startRename}
                aria-label={`Renommer ${variant.name}`}
                sx={{
                  opacity: 0,
                  flexShrink: 0,
                  '@media (hover: none)': { opacity: 1 },
                  '@media (prefers-reduced-motion: no-preference)': { transition: 'opacity 150ms ease' },
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        <Typography variant="caption" color="text.secondary">
          Modifiée {formatRelativeTime(variant.updatedAt)}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 1.5, pb: 1.5 }}>
        <Button variant="contained" size="small" onClick={openEditor} sx={{ flexShrink: 0 }}>
          Ouvrir
        </Button>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={`Dupliquer ${variant.name}`}>
            <IconButton size="small" onClick={handleDuplicate} aria-label={`Dupliquer ${variant.name}`}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Publier ${variant.name}`}>
            <IconButton size="small" onClick={() => openPublishConfirm(variant.id)} aria-label={`Publier ${variant.name}`}>
              <PublishOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Supprimer ${variant.name}`}>
            <IconButton size="small" onClick={() => setDeleteOpen(true)} aria-label={`Supprimer ${variant.name}`}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <DeleteVariantDialog open={deleteOpen} variant={variant} onClose={() => setDeleteOpen(false)} />
    </Card>
  );
}
