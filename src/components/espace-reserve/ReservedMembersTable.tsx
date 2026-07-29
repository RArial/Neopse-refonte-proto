'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';
import { CategoriesDialog } from '@/components/pages-modules/CategoriesDialog';
import {
  RESERVED_GROUPS_SEED,
  RESERVED_MEMBERS_SEED,
  type ReservedGroup,
  type ReservedMember,
  type ReservedMemberInvite,
} from '@/types/espaceReserve';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ReservedMembersTable() {
  const [members, setMembers] = useState<ReservedMember[]>(RESERVED_MEMBERS_SEED);
  const [pendingInvites, setPendingInvites] = useState<ReservedMemberInvite[]>([]);
  const [groups, setGroups] = useState<ReservedGroup[]>(RESERVED_GROUPS_SEED);
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteGroupIds, setInviteGroupIds] = useState<string[]>([]);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [memberToEdit, setMemberToEdit] = useState<ReservedMember | null>(null);
  const [editGroupIds, setEditGroupIds] = useState<string[]>([]);

  const [memberToRemove, setMemberToRemove] = useState<ReservedMember | null>(null);

  const filteredMembers = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return members;
    return members.filter((member) => `${member.name} ${member.handle}`.toLowerCase().includes(trimmed));
  }, [members, query]);

  function groupNames(groupIds: string[]) {
    return groupIds.map((id) => groups.find((group) => group.id === id)?.name).filter((name): name is string => Boolean(name));
  }

  function addGroup(): string {
    const id = randomId('group');
    setGroups((prev) => [...prev, { id, name: '' }]);
    return id;
  }

  function renameGroup(id: string, name: string) {
    setGroups((prev) => prev.map((group) => (group.id === id ? { ...group, name } : group)));
  }

  function deleteGroup(id: string) {
    setGroups((prev) => prev.filter((group) => group.id !== id));
    setMembers((prev) => prev.map((member) => ({ ...member, groupIds: member.groupIds.filter((groupId) => groupId !== id) })));
    setPendingInvites((prev) => prev.map((invite) => ({ ...invite, groupIds: invite.groupIds.filter((groupId) => groupId !== id) })));
  }

  function openAddDialog() {
    setInviteEmail('');
    setInviteGroupIds([]);
    setInviteError(null);
    setAddDialogOpen(true);
  }

  function toggleInviteGroup(groupId: string) {
    setInviteGroupIds((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
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
    setPendingInvites((prev) => [...prev, { id: randomId('invite'), email: trimmed, groupIds: inviteGroupIds }]);
    setAddDialogOpen(false);
    setSnackbarMessage(`Invitation envoyée à ${trimmed}.`);
  }

  function openEditDialog(member: ReservedMember) {
    setMemberToEdit(member);
    setEditGroupIds(member.groupIds);
  }

  function toggleEditGroup(groupId: string) {
    setEditGroupIds((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
  }

  function handleSaveMemberGroups() {
    if (!memberToEdit) return;
    setMembers((prev) => prev.map((member) => (member.id === memberToEdit.id ? { ...member, groupIds: editGroupIds } : member)));
    setSnackbarMessage(`Les groupes de ${memberToEdit.name} ont été mis à jour.`);
    setMemberToEdit(null);
  }

  function confirmRemoveMember() {
    if (!memberToRemove) return;
    setMembers((prev) => prev.filter((member) => member.id !== memberToRemove.id));
    setSnackbarMessage(`${memberToRemove.name} a été retiré(e) de l'espace réservé.`);
    setMemberToRemove(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 2.5 }}>
        <Button
          component={Link}
          href="/dashboard/espace-reserve"
          startIcon={<ArrowBackIcon fontSize="small" />}
          color="inherit"
          size="small"
          sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
        >
          Retour à l&apos;espace réservé
        </Button>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Membres autorisés
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Gérez les usagers identifiés autorisés à consulter les contenus de l&apos;espace réservé.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="outlined" color="inherit" startIcon={<GroupsOutlinedIcon fontSize="small" />} onClick={() => setGroupsDialogOpen(true)}>
          Je gère les groupes
        </Button>
        <TextField
          size="small"
          placeholder="Recherche"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un membre' },
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
          J&apos;ajoute un membre
        </Button>
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
        <Table aria-label="Membres autorisés de l'espace réservé">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Membre</TableCell>
              <TableCell>Groupe(s)</TableCell>
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun membre ne correspond à votre recherche.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.handle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {groupNames(member.groupIds).length > 0 ? (
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                        {groupNames(member.groupIds).map((name) => (
                          <Chip key={name} size="small" label={name} sx={{ bgcolor: 'action.hover' }} />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucun groupe
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={`Modifier les groupes de ${member.name}`}>
                      <IconButton size="small" onClick={() => openEditDialog(member)} aria-label={`Modifier les groupes de ${member.name}`}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Retirer ${member.name}`}>
                      <IconButton size="small" onClick={() => setMemberToRemove(member)} aria-label={`Retirer ${member.name} de l'espace réservé`}>
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

      <CategoriesDialog
        open={groupsDialogOpen}
        onClose={() => setGroupsDialogOpen(false)}
        categories={groups}
        selectedCategoryId=""
        inUseMessage="Groupe utilisé par au moins un membre"
        onAddCategory={addGroup}
        onRenameCategory={renameGroup}
        onDeleteCategory={deleteGroup}
      />

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} aria-labelledby="add-member-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="add-member-dialog-title">Ajouter un membre</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>La personne invitée recevra un email pour rejoindre l&apos;espace réservé.</DialogContentText>
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
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Groupes
              </Typography>
              <FormGroup>
                {groups.map((group) => (
                  <FormControlLabel
                    key={group.id}
                    control={<Checkbox checked={inviteGroupIds.includes(group.id)} onChange={() => toggleInviteGroup(group.id)} />}
                    label={group.name || 'Groupe sans nom'}
                  />
                ))}
              </FormGroup>
            </Box>
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

      <Dialog open={memberToEdit !== null} onClose={() => setMemberToEdit(null)} aria-labelledby="edit-member-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="edit-member-dialog-title">Groupes de {memberToEdit?.name}</DialogTitle>
        <DialogContent>
          <FormGroup>
            {groups.map((group) => (
              <FormControlLabel
                key={group.id}
                control={<Checkbox checked={editGroupIds.includes(group.id)} onChange={() => toggleEditGroup(group.id)} />}
                label={group.name || 'Groupe sans nom'}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setMemberToEdit(null)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSaveMemberGroups}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={memberToRemove !== null} onClose={() => setMemberToRemove(null)} aria-labelledby="remove-member-dialog-title">
        <DialogTitle id="remove-member-dialog-title">Retirer « {memberToRemove?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette personne n&apos;aura plus accès à l&apos;espace réservé.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setMemberToRemove(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmRemoveMember}>
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
