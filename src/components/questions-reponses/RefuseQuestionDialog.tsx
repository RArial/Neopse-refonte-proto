'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface RefuseQuestionDialogProps {
  open: boolean;
  questionSubject: string;
  onClose: () => void;
  onConfirm: (refusalReason: string) => void;
}

export function RefuseQuestionDialog({ open, questionSubject, onClose, onConfirm }: RefuseQuestionDialogProps) {
  const [refusalReason, setRefusalReason] = useState('');
  const [reasonError, setReasonError] = useState(false);

  function handleClose() {
    setRefusalReason('');
    setReasonError(false);
    onClose();
  }

  function handleConfirm() {
    if (!refusalReason.trim()) {
      setReasonError(true);
      return;
    }
    onConfirm(refusalReason.trim());
    setRefusalReason('');
    setReasonError(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="refuse-question-title" maxWidth="sm" fullWidth>
      <DialogTitle id="refuse-question-title">Refuser la question</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Indiquez le motif de refus de la question « {questionSubject} ». Ce texte n&apos;est pas visible par le participant.
        </DialogContentText>
        <TextField
          label="Texte de refus"
          value={refusalReason}
          onChange={(event) => {
            setRefusalReason(event.target.value);
            if (reasonError) setReasonError(false);
          }}
          multiline
          minRows={4}
          fullWidth
          required
          error={reasonError}
          helperText={reasonError ? 'Merci de préciser le motif de refus.' : undefined}
          slotProps={{ formHelperText: { role: reasonError ? 'alert' : undefined } }}
          autoFocus
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={handleClose}>
          Annuler
        </Button>
        <Button color="error" variant="contained" onClick={handleConfirm}>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
