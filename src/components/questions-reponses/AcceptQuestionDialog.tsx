'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { RichTextField } from '@/components/ui/RichTextField';

interface AcceptQuestionDialogProps {
  open: boolean;
  questionSubject: string;
  onClose: () => void;
  onConfirm: (data: { publicAnswer: string; responderName: string; responderFunction: string }) => void;
}

const EMPTY_STATE = { publicAnswer: '', responderName: '', responderFunction: '' };

export function AcceptQuestionDialog({ open, questionSubject, onClose, onConfirm }: AcceptQuestionDialogProps) {
  const [data, setData] = useState(EMPTY_STATE);
  const [answerError, setAnswerError] = useState(false);
  const [nameError, setNameError] = useState(false);

  function handleChange(patch: Partial<typeof EMPTY_STATE>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleClose() {
    setData(EMPTY_STATE);
    setAnswerError(false);
    setNameError(false);
    onClose();
  }

  function handleConfirm() {
    const answerIsEmpty = !data.publicAnswer.replace(/<[^>]*>/g, '').trim();
    const nameIsEmpty = !data.responderName.trim();
    setAnswerError(answerIsEmpty);
    setNameError(nameIsEmpty);
    if (answerIsEmpty || nameIsEmpty) return;
    onConfirm(data);
    setData(EMPTY_STATE);
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="accept-question-title" maxWidth="sm" fullWidth>
      <DialogTitle id="accept-question-title">Accepter la question</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Rédigez la réponse publique à « {questionSubject} ». Elle sera publiée avec la question.
        </DialogContentText>
        <Stack spacing={2.5}>
          <RichTextField
            label="Réponse publique"
            value={data.publicAnswer}
            onChange={(publicAnswer) => {
              handleChange({ publicAnswer });
              if (answerError) setAnswerError(false);
            }}
            placeholder="Rédigez votre réponse…"
            error={answerError}
            helperText={answerError ? 'Merci de rédiger une réponse publique.' : undefined}
          />
          <TextField
            label="Nom du répondant"
            value={data.responderName}
            onChange={(event) => {
              handleChange({ responderName: event.target.value });
              if (nameError) setNameError(false);
            }}
            fullWidth
            required
            error={nameError}
            helperText={nameError ? 'Merci de préciser le nom du répondant.' : undefined}
            slotProps={{ formHelperText: { role: nameError ? 'alert' : undefined } }}
          />
          <TextField
            label="Fonction du répondant"
            value={data.responderFunction}
            onChange={(event) => handleChange({ responderFunction: event.target.value })}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
