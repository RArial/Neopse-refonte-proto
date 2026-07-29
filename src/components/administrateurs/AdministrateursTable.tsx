'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';
import { ADMIN_ROLE_META, ADMIN_ROLE_ORDER, INITIAL_ADMINS, type AdminRole, type Administrator } from '@/types/administrateurs';
import { PERMISSION_PROFILES } from '@/types/profils';

interface PendingAdminInvite {
  id: string;
  email: string;
  role: AdminRole;
  profileIds: string[];
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdministrateursTable() {
  const [admins, setAdmins] = useState<Administrator[]>(INITIAL_ADMINS);
  const [pendingInvites, setPendingInvites] = useState<PendingAdminInvite[]>([]);
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('intervenant');
  const [inviteProfileId, setInviteProfileId] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [adminToRemove, setAdminToRemove] = useState<Administrator | null>(null);

  const filteredAdmins = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return admins;
    return admins.filter((admin) => `${admin.name} ${admin.handle}`.toLowerCase().includes(trimmed));
  }, [admins, query]);

  function openAddDialog() {
    setInviteEmail('');
    setInviteRole('intervenant');
    setInviteProfileId('');
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
    if (inviteRole === 'intervenant' && !inviteProfileId) {
      setInviteError('Sélectionnez un profil de droits pour un intervenant.');
      return;
    }
    setPendingInvites((prev) => [
      ...prev,
      { id: `invite-${Date.now()}`, email: trimmed, role: inviteRole, profileIds: inviteRole === 'intervenant' ? [inviteProfileId] : [] },
    ]);
    setAddDialogOpen(false);
    setSnackbarMessage(`Invitation envoyée à ${trimmed}.`);
  }

  function confirmRemoveAdmin() {
    if (!adminToRemove) return;
    setAdmins((prev) => prev.filter((admin) => admin.id !== adminToRemove.id));
    setSnackbarMessage(`${adminToRemove.name} a été retiré des administrateurs.`);
    setAdminToRemove(null);
  }

  function profileNames(profileIds: string[]) {
    return profileIds
      .map((id) => PERMISSION_PROFILES.find((profile) => profile.id === id)?.name)
      .filter((name): name is string => Boolean(name));
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
        <Button component={Link} href="/dashboard/administrateurs/profils" variant="outlined" color="inherit" startIcon={<BadgeOutlinedIcon fontSize="small" />}>
          Gérer les profils de droits
        </Button>
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
          Ajouter un administrateur
        </Button>
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
        <Table aria-label="Administrateurs du projet">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Administrateurs</TableCell>
              <TableCell>Rôle</TableCell>
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
                  <TableCell>
                    <Tooltip title={ADMIN_ROLE_META[admin.role].description}>
                      <Chip size="small" label={ADMIN_ROLE_META[admin.role].label} variant="outlined" sx={{ fontWeight: 600 }} />
                    </Tooltip>
                    {admin.role === 'intervenant' && admin.profileIds.length > 0 && (
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.75, flexWrap: 'wrap', rowGap: 0.5 }}>
                        {profileNames(admin.profileIds).map((name) => (
                          <Chip key={name} size="small" label={name} sx={{ bgcolor: 'action.hover' }} />
                        ))}
                      </Stack>
                    )}
                  </TableCell>
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
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingInvites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1.5, textAlign: 'center' }}>
                      Aucune invitation en attente.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pendingInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>{ADMIN_ROLE_META[invite.role].label}</TableCell>
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
            La personne invitée recevra un email pour rejoindre ce projet selon le rôle choisi.
          </DialogContentText>
          <Stack spacing={2.5}>
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
            />
            <TextField
              select
              fullWidth
              label="Rôle"
              value={inviteRole}
              onChange={(event) => {
                setInviteRole(event.target.value as AdminRole);
                setInviteError(null);
              }}
            >
              {ADMIN_ROLE_ORDER.map((role) => (
                <MenuItem key={role} value={role}>
                  <Box sx={{ py: 0.25 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ADMIN_ROLE_META[role].label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'normal' }}>
                      {ADMIN_ROLE_META[role].description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {inviteRole === 'intervenant' && (
              <Box>
                <TextField
                  select
                  fullWidth
                  label="Profil de droits"
                  value={inviteProfileId}
                  onChange={(event) => {
                    setInviteProfileId(event.target.value);
                    setInviteError(null);
                  }}
                >
                  {PERMISSION_PROFILES.map((profile) => (
                    <MenuItem key={profile.id} value={profile.id}>
                      <ListItemText primary={profile.name} />
                    </MenuItem>
                  ))}
                </TextField>
                <Typography
                  component={Link}
                  href="/dashboard/administrateurs/profils/nouveau"
                  variant="caption"
                  sx={{
                    mt: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    '& .create-profile-icon': { transition: 'transform 0.2s ease' },
                    '&:hover .create-profile-icon': { transform: 'translateX(3px)' },
                    '@media (prefers-reduced-motion: reduce)': {
                      '& .create-profile-icon': { transition: 'none' },
                      '&:hover .create-profile-icon': { transform: 'none' },
                    },
                  }}
                >
                  Créer un nouveau profil de droits
                  <AddCircleOutlineIcon className="create-profile-icon" sx={{ fontSize: 14 }} />
                </Typography>
              </Box>
            )}

            {inviteError && (
              <Typography variant="caption" color="error" role="alert">
                {inviteError}
              </Typography>
            )}
          </Stack>
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
