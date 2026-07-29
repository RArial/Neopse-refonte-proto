'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ChangeEmailDialogProps {
  open: boolean;
  currentEmail: string;
  onClose: () => void;
  onConfirm: (newEmail: string) => void;
}

export function ChangeEmailDialog({ open, currentEmail, onClose, onConfirm }: ChangeEmailDialogProps) {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  function handleClose() {
    setNewEmail('');
    setConfirmEmail('');
    setError(null);
    setConfirmError(null);
    onClose();
  }

  function handleSubmit() {
    const trimmed = newEmail.trim();
    const trimmedConfirm = confirmEmail.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      setError('Indiquez une adresse email valide.');
      return;
    }
    if (trimmed === currentEmail) {
      setError('Cette adresse est déjà associée à votre compte.');
      return;
    }
    setError(null);

    if (trimmedConfirm !== trimmed) {
      setConfirmError('Les deux adresses email ne correspondent pas.');
      return;
    }
    setConfirmError(null);

    onConfirm(trimmed);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="change-email-title" maxWidth="xs" fullWidth>
      <DialogTitle id="change-email-title">Modifier mon adresse email</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Un email de confirmation sera envoyé à la nouvelle adresse pour valider le changement.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          type="email"
          label="Nouvelle adresse email"
          value={newEmail}
          onChange={(event) => {
            setNewEmail(event.target.value);
            setError(null);
          }}
          error={Boolean(error)}
          helperText={error ?? undefined}
          slotProps={{ formHelperText: { role: error ? 'alert' : undefined } }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="email"
          label="Confirmez la nouvelle adresse email"
          value={confirmEmail}
          onChange={(event) => {
            setConfirmEmail(event.target.value);
            setConfirmError(null);
          }}
          error={Boolean(confirmError)}
          helperText={confirmError ?? undefined}
          slotProps={{ formHelperText: { role: confirmError ? 'alert' : undefined } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Envoyer la confirmation
        </Button>
      </DialogActions>
    </Dialog>
  );
}
