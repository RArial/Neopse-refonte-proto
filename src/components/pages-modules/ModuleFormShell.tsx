'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';

interface ModuleFormShellProps {
  title: string;
  backHref: string;
  backLabel: string;
  submitLabel: string;
  onSubmit: () => void;
  successMessage: string | null;
  onSnackbarClose: () => void;
  children: ReactNode;
  /** Le formulaire contient-il des modifications non enregistrées ? Déclenche l'avertissement de sortie
   * (bouton « Retour », navigation latérale/breadcrumb, fermeture d'onglet…). */
  isDirty: boolean;
  /** Si fourni, affiche un bouton « Enregistrer comme brouillon » dans l'en-tête, avant le bouton principal. */
  onSaveDraft?: () => void;
  draftLabel?: string;
}

export function ModuleFormShell({
  title,
  backHref,
  backLabel,
  submitLabel,
  onSubmit,
  successMessage,
  onSnackbarClose,
  children,
  isDirty,
  onSaveDraft,
  draftLabel,
}: ModuleFormShellProps) {
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          mb: 2.5,
          pt: { xs: 2, md: 2.5 },
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Button
            component={Link}
            href={backHref}
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 1, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            {backLabel}
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {title}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          {onSaveDraft && (
            <Button variant="outlined" color="inherit" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={onSaveDraft}>
              {draftLabel ?? 'Enregistrer comme brouillon'}
            </Button>
          )}
          <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={onSubmit}>
            {submitLabel}
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>{children}</Stack>

      <Snackbar open={successMessage !== null} autoHideDuration={4000} onClose={onSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={isDialogOpen}
        onClose={cancelLeave}
        aria-labelledby="module-form-leave-title"
        aria-describedby="module-form-leave-description"
      >
        <DialogTitle id="module-form-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="module-form-leave-description">
            Des modifications n&apos;ont pas été enregistrées. Si vous quittez maintenant, elles seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={cancelLeave} color="inherit" autoFocus>
            Rester sur la page
          </Button>
          <Button onClick={confirmLeave} color="error" variant="contained">
            Quitter sans enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
