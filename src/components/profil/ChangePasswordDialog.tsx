'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ChangePasswordDialog({ open, onClose, onConfirm }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    onClose();
  }

  function handleSubmit() {
    if (!currentPassword) {
      setError('Indiquez votre mot de passe actuel.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    onConfirm();
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="change-password-title" maxWidth="xs" fullWidth>
      <DialogTitle id="change-password-title">Modifier mon mot de passe</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Mot de passe actuel"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setError(null);
            }}
          />
          <TextField
            fullWidth
            type="password"
            label="Nouveau mot de passe"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setError(null);
            }}
            helperText="8 caractères minimum."
          />
          <TextField
            fullWidth
            type="password"
            label="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError(null);
            }}
            error={Boolean(error)}
            helperText={error ?? undefined}
            slotProps={{ formHelperText: { role: error ? 'alert' : undefined } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Modifier le mot de passe
        </Button>
      </DialogActions>
    </Dialog>
  );
}
