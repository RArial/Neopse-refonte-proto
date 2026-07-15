'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import type { Variant } from '@/types/personnalisation';

interface DeleteVariantDialogProps {
  open: boolean;
  variant: Variant;
  onClose: () => void;
}

export function DeleteVariantDialog({ open, variant, onClose }: DeleteVariantDialogProps) {
  const { deleteVariant } = usePersonnalisation();

  function handleConfirm() {
    deleteVariant(variant.id);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-variant-hub-title">
      <DialogTitle id="delete-variant-hub-title">Supprimer « {variant.name} » ?</DialogTitle>
      <DialogContent>
        <DialogContentText>Cette action est définitive. La variante ne pourra pas être récupérée.</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={onClose} autoFocus>
          Annuler
        </Button>
        <Button color="error" variant="contained" onClick={handleConfirm}>
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
