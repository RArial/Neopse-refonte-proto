'use client';

import { useId, useState, type FormEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import type { DomainPriority, DomainRecord } from '@/types/parametres';

interface DomaineSectionProps {
  domains: DomainRecord[];
  onAddDomain: (domain: DomainRecord) => void;
}

const STATUS_LABEL: Record<DomainRecord['status'], string> = {
  actif: 'Actif',
  en_attente: 'En attente de validation',
  expire: 'Expiré',
};

const STATUS_COLOR: Record<DomainRecord['status'], 'success' | 'warning' | 'error'> = {
  actif: 'success',
  en_attente: 'warning',
  expire: 'error',
};

const PRIORITY_LABEL: Record<DomainPriority, string> = {
  principal: 'Principal',
  redirection: 'Redirection',
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function DomaineSection({ domains, onAddDomain }: DomaineSectionProps) {
  const [adding, setAdding] = useState(false);
  const [address, setAddress] = useState('');
  const [registrar, setRegistrar] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [priority, setPriority] = useState<DomainPriority>('redirection');
  const formId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!address.trim() || !expiresAt) return;

    onAddDomain({
      id: `dom-${Date.now()}`,
      address: address.trim(),
      registrar: registrar.trim() || 'Non renseigné',
      expiresAt,
      status: 'en_attente',
      priority,
    });

    setAddress('');
    setRegistrar('');
    setExpiresAt('');
    setPriority('redirection');
    setAdding(false);
  }

  return (
    <Stack spacing={2.5}>
      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small" aria-label="Noms de domaine associés au site">
          <TableHead>
            <TableRow>
              <TableCell>Adresse URL</TableCell>
              <TableCell>Source d&apos;enregistrement</TableCell>
              <TableCell>Date d&apos;expiration</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Priorité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell sx={{ fontWeight: 600 }}>{domain.address}</TableCell>
                <TableCell>{domain.registrar}</TableCell>
                <TableCell>{formatDate(domain.expiresAt)}</TableCell>
                <TableCell>
                  <Chip size="small" label={STATUS_LABEL[domain.status]} color={STATUS_COLOR[domain.status]} variant="outlined" />
                </TableCell>
                <TableCell>{PRIORITY_LABEL[domain.priority]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {adding ? (
        <Box component="form" id={formId} onSubmit={handleSubmit} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Ajouter un nom de domaine
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Adresse URL"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="www.exemple.fr"
              required
              fullWidth
              size="small"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Source d'enregistrement"
                value={registrar}
                onChange={(event) => setRegistrar(event.target.value)}
                placeholder="OVH, Gandi…"
                fullWidth
                size="small"
              />
              <TextField
                label="Date d'expiration"
                type="date"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                select
                label="Priorité"
                value={priority}
                onChange={(event) => setPriority(event.target.value as DomainPriority)}
                fullWidth
                size="small"
              >
                <MenuItem value="principal">Principal</MenuItem>
                <MenuItem value="redirection">Redirection</MenuItem>
              </TextField>
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button type="button" variant="outlined" color="inherit" onClick={() => setAdding(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="contained">
                Ajouter
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Button
          type="button"
          variant="outlined"
          startIcon={<Icons.Plus size={16} />}
          onClick={() => setAdding(true)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Ajouter un nom de domaine
        </Button>
      )}
    </Stack>
  );
}
