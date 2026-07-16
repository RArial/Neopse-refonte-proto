'use client';

import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';

interface Administrator {
  id: string;
  name: string;
  handle: string;
  role: string;
}

interface PendingAdminInvite {
  id: string;
  email: string;
}

const INITIAL_ADMINS: Administrator[] = [
  { id: 'admin-1', name: 'Ojama The Coon', handle: '@TheCoon', role: 'Administrateur de projet' },
  { id: 'admin-2', name: 'Rémi Arial', handle: '@remiarial', role: 'Administrateur de projet' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdministrateursTable() {
  const [admins, setAdmins] = useState<Administrator[]>(INITIAL_ADMINS);
  const [pendingInvites, setPendingInvites] = useState<PendingAdminInvite[]>([]);
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [adminToRemove, setAdminToRemove] = useState<Administrator | null>(null);

  const filteredAdmins = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return admins;
    return admins.filter((admin) => `${admin.name} ${admin.handle}`.toLowerCase().includes(trimmed));
  }, [admins, query]);

  function openAddDialog() {
    setInviteEmail('');
    setInviteError(null);
    setAddDialogOpen(true);
  }

  function handleSendInvite() {
    const trimmed = inviteEmail.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setInviteError('Indiquez une adresse email valide.');
      return;
    }
    if (pendingInvites.some((invite) => invite.email === trimmed)) {
      setInviteError('Cette adresse a déjà été invitée.');
      return;
    }
    setPendingInvites((prev) => [...prev, { id: `invite-${Date.now()}`, email: trimmed }]);
    setAddDialogOpen(false);
    setSnackbarMessage(`Invitation envoyée à ${trimmed}.`);
  }

  function confirmRemoveAdmin() {
    if (!adminToRemove) return;
    setAdmins((prev) => prev.filter((admin) => admin.id !== adminToRemove.id));
    setSnackbarMessage(`${adminToRemove.name} a été retiré des administrateurs.`);
    setAdminToRemove(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Administrateurs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Gérez les personnes autorisées à administrer ce projet Neopse.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Recherche"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un administrateur' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button variant="contained" color="primary" startIcon={<PersonAddAltIcon fontSize="small" />} onClick={openAddDialog}>
          J&apos;ajoute un administrateur
        </Button>
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
        <Table aria-label="Administrateurs du projet">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Administrateurs</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun administrateur ne correspond à votre recherche.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {admin.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {admin.handle}
                    </Typography>
                  </TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={`Retirer ${admin.name}`}>
                      <IconButton size="small" onClick={() => setAdminToRemove(admin)} aria-label={`Retirer ${admin.name} des administrateurs`}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
          En attente
        </Typography>
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small" aria-label="Invitations en attente">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell>Adresse email</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingInvites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1.5, textAlign: 'center' }}>
                      Aucune invitation en attente.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pendingInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <Chip size="small" label="Invitation envoyée" color="warning" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} aria-labelledby="add-admin-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="add-admin-dialog-title">Ajouter un administrateur</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            La personne invitée recevra un email pour rejoindre ce projet en tant qu&apos;administrateur.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            type="email"
            label="Adresse email"
            value={inviteEmail}
            onChange={(event) => {
              setInviteEmail(event.target.value);
              setInviteError(null);
            }}
            error={Boolean(inviteError)}
            helperText={inviteError ?? undefined}
            slotProps={{ formHelperText: { role: inviteError ? 'alert' : undefined } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setAddDialogOpen(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSendInvite}>
            Envoyer l&apos;invitation
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={adminToRemove !== null} onClose={() => setAdminToRemove(null)} aria-labelledby="remove-admin-dialog-title">
        <DialogTitle id="remove-admin-dialog-title">Retirer « {adminToRemove?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cette personne n&apos;aura plus accès à l&apos;administration de ce projet.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setAdminToRemove(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmRemoveAdmin}>
            Retirer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
