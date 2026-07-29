'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { VariantSelector } from '@/components/personnalisation/VariantSelector';

function DirtyIndicator() {
  const { status } = usePersonnalisation();
  if (status === 'idle') return null;
  if (status === 'publishing') return <Chip size="small" label="Publication…" color="info" />;
  return <Chip size="small" label="Non enregistré" color="warning" />;
}

export function EditorAppBar() {
  const { status, isDirty, save, activeVariant, openPublishConfirm, requestReturnToHub, duplicateVariant, renameVariant } =
    usePersonnalisation();
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  function handlePreview() {
    window.open(`/preview/${activeVariant.previewSlug}`, '_blank', 'noopener,noreferrer');
  }

  function handleDuplicate() {
    duplicateVariant(activeVariant.id);
  }

  function openRename() {
    setRenameValue(activeVariant.name);
    setRenameOpen(true);
  }

  function confirmRename() {
    renameVariant(activeVariant.id, renameValue);
    setRenameOpen(false);
  }

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 1.5, flexWrap: 'wrap', py: 1 }}>
        <Tooltip title="Retour à l'apparence">
          <IconButton onClick={requestReturnToHub} aria-label="Retour à l'apparence" size="small">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <VariantSelector />
        <DirtyIndicator />

        <Box sx={{ flex: 1 }} />

        <Button
          variant="text"
          color="inherit"
          size="small"
          startIcon={<ContentCopyIcon fontSize="small" />}
          onClick={handleDuplicate}
          sx={{ color: 'text.secondary' }}
        >
          Dupliquer
        </Button>
        <Button
          variant="text"
          color="inherit"
          size="small"
          startIcon={<DriveFileRenameOutlineIcon fontSize="small" />}
          onClick={openRename}
          sx={{ color: 'text.secondary' }}
        >
          Renommer
        </Button>
        <Button
          variant="text"
          color="inherit"
          size="small"
          startIcon={<OpenInNewIcon fontSize="small" />}
          onClick={handlePreview}
          sx={{ color: 'text.secondary' }}
        >
          Prévisualiser
        </Button>
        <Button variant="outlined" size="small" onClick={save} disabled={!isDirty || status === 'publishing'}>
          Enregistrer
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<PublishOutlinedIcon fontSize="small" />}
          onClick={() => openPublishConfirm()}
          disabled={status === 'publishing'}
          loading={status === 'publishing'}
        >
          Publier
        </Button>
      </Toolbar>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} aria-labelledby="rename-variant-title">
        <DialogTitle id="rename-variant-title">Renommer la variante</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nom de la variante"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            sx={{ mt: 1, minWidth: 320 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setRenameOpen(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={confirmRename} disabled={!renameValue.trim()}>
            Renommer
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
