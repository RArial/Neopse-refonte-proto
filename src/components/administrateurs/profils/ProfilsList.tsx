'use client';

import { useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { PERMISSION_PROFILES, type PermissionProfile } from '@/types/profils';

function countGrantedModules(profile: PermissionProfile) {
  return Object.values(profile.grants).filter((rights) => rights.length > 0).length;
}

export function ProfilsList() {
  const [profiles, setProfiles] = useState<PermissionProfile[]>(PERMISSION_PROFILES);
  const [profileToDelete, setProfileToDelete] = useState<PermissionProfile | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  function confirmDelete() {
    if (!profileToDelete) return;
    setProfiles((prev) => prev.filter((profile) => profile.id !== profileToDelete.id));
    setSnackbarMessage(`Profil « ${profileToDelete.name} » supprimé.`);
    setProfileToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
      <Button
        component={Link}
        href="/dashboard/administrateurs"
        startIcon={<ArrowBackIcon fontSize="small" />}
        color="inherit"
        size="small"
        sx={{ mb: 1, ml: -1, textTransform: 'none', fontWeight: 500 }}
      >
        Retour aux administrateurs
      </Button>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Profils de droits
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Créez des profils personnalisés pour les intervenants du site web.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/administrateurs/profils/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Nouveau profil
        </Button>
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table aria-label="Profils de droits">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom du profil</TableCell>
              <TableCell>Modules autorisés</TableCell>
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun profil de droits pour le moment.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{profile.name}</TableCell>
                  <TableCell>{countGrantedModules(profile)} module(s)</TableCell>
                  <TableCell align="right">
                    <Tooltip title={`Modifier « ${profile.name} »`}>
                      <IconButton
                        component={Link}
                        href={`/dashboard/administrateurs/profils/edit/${profile.id}`}
                        size="small"
                        aria-label={`Modifier « ${profile.name} »`}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Supprimer « ${profile.name} »`}>
                      <IconButton size="small" onClick={() => setProfileToDelete(profile)} aria-label={`Supprimer « ${profile.name} »`}>
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

      <Dialog open={profileToDelete !== null} onClose={() => setProfileToDelete(null)} aria-labelledby="delete-profile-title">
        <DialogTitle id="delete-profile-title">Supprimer « {profileToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Les intervenants utilisant ce profil perdront les droits associés. Cette action est définitive.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setProfileToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer
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
