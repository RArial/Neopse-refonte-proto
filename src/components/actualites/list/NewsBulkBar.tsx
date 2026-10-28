'use client';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';

interface NewsBulkBarProps {
  count: number;
  onPublish: () => void;
  onDeactivate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/** Barre flottante sombre : visible dès qu'au moins une ligne est cochée. */
export function NewsBulkBar({ count, onPublish, onDeactivate, onDuplicate, onDelete, onClose }: NewsBulkBarProps) {
  const label = `${count} actualité${count > 1 ? 's' : ''} sélectionnée${count > 1 ? 's' : ''}`;

  return (
    <Paper
      role="toolbar"
      aria-label="Actions groupées"
      elevation={8}
      sx={{
        // Centrée sans `left: 50%` : sinon la barre ne dispose que d'une demi-largeur d'écran et passe sur deux lignes.
        position: 'fixed',
        left: 0,
        right: 0,
        mx: 'auto',
        width: 'fit-content',
        bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        zIndex: (theme) => theme.zIndex.snackbar - 1,
        maxWidth: 'calc(100vw - 32px)',
        bgcolor: 'grey.900',
        color: 'common.white',
        borderRadius: 3,
        px: 1.5,
        py: 1,
      }}
    >
      <Stack direction="row" spacing={0.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="body2" aria-live="polite" sx={{ fontWeight: 700, px: 1, mr: 1 }}>
          {label}
        </Typography>
        <Button color="inherit" size="small" startIcon={<CheckCircleOutlineIcon fontSize="small" />} onClick={onPublish}>
          Publier maintenant
        </Button>
        <Button color="inherit" size="small" startIcon={<RemoveCircleOutlineIcon fontSize="small" />} onClick={onDeactivate}>
          Mettre en inactive
        </Button>
        <Button color="inherit" size="small" startIcon={<ContentCopyOutlinedIcon fontSize="small" />} onClick={onDuplicate}>
          Dupliquer
        </Button>
        {/* Rouge clair : le rouge du thème n'atteint pas 4,5:1 sur ce fond sombre. */}
        <Button size="small" startIcon={<DeleteOutlinedIcon fontSize="small" />} onClick={onDelete} sx={{ color: 'error.light' }}>
          Supprimer
        </Button>
        <Tooltip title="Fermer la sélection">
          <IconButton color="inherit" size="small" onClick={onClose} aria-label="Fermer la sélection">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
