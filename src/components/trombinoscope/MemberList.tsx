'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import MuiAlert from '@mui/material/Alert';
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
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { MEMBERS_MOCK, type Member } from '@/types/trombinoscope';

type TabView = 'published' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function duplicateHref(lastName: string): string {
  return `/dashboard/trombinoscope/nouveau?copyName=${encodeURIComponent(`${lastName} (copie)`)}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function MemberList() {
  const [members, setMembers] = useState<Member[]>(MEMBERS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const counts = useMemo(
    () => ({
      published: members.filter((m) => m.status === 'published').length,
      draft: members.filter((m) => m.status === 'draft').length,
      archived: members.filter((m) => m.status === 'archived').length,
    }),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return members.filter((member) => {
      if (member.status !== tab) return false;
      if (trimmed && !`${member.firstName} ${member.lastName}`.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [members, tab, query]);

  function archiveMember(member: Member) {
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: 'archived' } : m)));
    setSnackbarMessage(`« ${member.firstName} ${member.lastName} » a été archivé(e).`);
  }

  function restoreMember(member: Member) {
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: 'draft' } : m)));
    setSnackbarMessage(`« ${member.firstName} ${member.lastName} » a été restauré(e) en brouillon.`);
  }

  function confirmDeleteMember() {
    if (!memberToDelete) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
    setSnackbarMessage(`« ${memberToDelete.firstName} ${memberToDelete.lastName} » a été supprimé(e) définitivement.`);
    setMemberToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Trombinoscope
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Présentez les membres de votre équipe sur le site.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/trombinoscope/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter un membre
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les membres" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher un membre…"
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
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table aria-label={`Trombinoscope — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun membre ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{member.lastName}</TableCell>
                  <TableCell>{member.firstName}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${member.firstName} ${member.lastName} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/trombinoscope/edit/${member.id}`}
                          size="small"
                          aria-label={`Modifier « ${member.firstName} ${member.lastName} »`}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Dupliquer « ${member.firstName} ${member.lastName} »`}>
                        <IconButton
                          component={Link}
                          href={duplicateHref(member.lastName)}
                          size="small"
                          aria-label={`Dupliquer « ${member.firstName} ${member.lastName} »`}
                        >
                          <ContentCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {member.status === 'archived' ? (
                        <>
                          <Tooltip title={`Restaurer « ${member.firstName} ${member.lastName} »`}>
                            <IconButton size="small" onClick={() => restoreMember(member)} aria-label={`Restaurer « ${member.firstName} ${member.lastName} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${member.firstName} ${member.lastName} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setMemberToDelete(member)}
                              aria-label={`Supprimer définitivement « ${member.firstName} ${member.lastName} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={`Archiver « ${member.firstName} ${member.lastName} »`}>
                          <IconButton size="small" onClick={() => archiveMember(member)} aria-label={`Archiver « ${member.firstName} ${member.lastName} »`}>
                            <Inventory2OutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={memberToDelete !== null} onClose={() => setMemberToDelete(null)} aria-labelledby="delete-member-title">
        <DialogTitle id="delete-member-title">
          Supprimer définitivement « {memberToDelete?.firstName} {memberToDelete?.lastName} » ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setMemberToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteMember}>
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
