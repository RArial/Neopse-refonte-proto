'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

export function SwitchVariantDialog() {
  const { pendingVariantSwitchId, confirmSwitchVariant, cancelSwitchVariant } = usePersonnalisation();

  return (
    <Dialog open={pendingVariantSwitchId !== null} onClose={cancelSwitchVariant} aria-labelledby="switch-variant-title">
      <DialogTitle id="switch-variant-title">Modifications non enregistrées</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Vous avez des modifications non enregistrées sur cette variante. Voulez-vous les enregistrer avant de
          changer de variante ?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: 'wrap' }}>
        <Button color="inherit" onClick={cancelSwitchVariant} autoFocus>
          Annuler
        </Button>
        <Button color="error" onClick={() => confirmSwitchVariant('discard')}>
          Abandonner
        </Button>
        <Button variant="contained" onClick={() => confirmSwitchVariant('save')}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
