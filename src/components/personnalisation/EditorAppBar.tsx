'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { VariantSelector } from '@/components/personnalisation/VariantSelector';
import { HistoryButton } from '@/components/personnalisation/HistoryButton';

function DirtyIndicator() {
  const { status } = usePersonnalisation();
  if (status === 'idle') return null;
  if (status === 'publishing') return <Chip size="small" label="Publication…" color="info" />;
  return <Chip size="small" label="Non enregistré" color="warning" />;
}

export function EditorAppBar() {
  const { status, isDirty, save, activeVariant, openPublishConfirm, requestReturnToHub } = usePersonnalisation();

  function handlePreview() {
    window.open(`/preview/${activeVariant.previewSlug}`, '_blank', 'noopener,noreferrer');
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

        <HistoryButton />
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
    </AppBar>
  );
}
