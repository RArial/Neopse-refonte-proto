'use client';

import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { DomainRecord } from '@/types/parametres';

interface EditDomainDialogProps {
  open: boolean;
  domain: DomainRecord | null;
  onClose: () => void;
  onConfirm: (id: string, address: string) => void;
}

const NEOPSE_BASE_DOMAINS = ['neopse-site.com', 'neopse-site.fr', 'neopse-site.org'];

function splitAddress(address: string): { suffix: string; baseDomain: string } {
  const firstDotIndex = address.indexOf('.');
  if (firstDotIndex === -1) {
    return { suffix: address, baseDomain: NEOPSE_BASE_DOMAINS[0] };
  }
  const suffix = address.slice(0, firstDotIndex);
  const baseDomain = address.slice(firstDotIndex + 1);
  return {
    suffix,
    baseDomain: NEOPSE_BASE_DOMAINS.includes(baseDomain) ? baseDomain : NEOPSE_BASE_DOMAINS[0],
  };
}

interface EditDomainDialogFormProps {
  domain: DomainRecord;
  onClose: () => void;
  onConfirm: (id: string, address: string) => void;
}

function EditDomainDialogForm({ domain, onClose, onConfirm }: EditDomainDialogFormProps) {
  const initial = splitAddress(domain.address);
  const [suffix, setSuffix] = useState(initial.suffix);
  const [baseDomain, setBaseDomain] = useState(initial.baseDomain);

  function handleConfirm() {
    if (!suffix.trim()) return;
    onConfirm(domain.id, `${suffix.trim()}.${baseDomain}`);
    onClose();
  }

  return (
    <>
      <IconButton
        aria-label="Fermer"
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
          <EditIcon />
        </Avatar>
        <Typography id="edit-domain-dialog-title" variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2.5 }}>
          Editer le sous-domaine NEOPSE du site
        </Typography>

        <Alert severity="info" sx={{ textAlign: 'left', mb: 2.5 }}>
          La modification de l&apos;adresse URL NEOPSE du site (sous-domaine) peut affecter son référencement si
          celle-ci est son adresse principale.
        </Alert>

        <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
          <TextField
            label="Suffixe de l'adresse URL"
            value={suffix}
            onChange={(event) => setSuffix(event.target.value)}
            fullWidth
            size="small"
            required
          />
          <TextField
            select
            label="Je choisis le nom de domaine NEOPSE"
            value={baseDomain}
            onChange={(event) => setBaseDomain(event.target.value)}
            fullWidth
            size="small"
          >
            {NEOPSE_BASE_DOMAINS.map((base) => (
              <MenuItem key={base} value={base}>
                {base}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button color="inherit" onClick={onClose}>
          J&apos;annule
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Je confirme
        </Button>
      </DialogActions>
    </>
  );
}

export function EditDomainDialog({ open, domain, onClose, onConfirm }: EditDomainDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="edit-domain-dialog-title" maxWidth="xs" fullWidth>
      {domain && <EditDomainDialogForm key={domain.id} domain={domain} onClose={onClose} onConfirm={onConfirm} />}
    </Dialog>
  );
}
