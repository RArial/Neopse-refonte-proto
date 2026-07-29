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
import { isScheduledPublication } from '@/lib/publicationSchedule';
import { UNES_MOCK, type Une } from '@/types/unes';

type TabView = 'published' | 'scheduled' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiées',
  scheduled: 'Programmées',
  draft: 'Brouillons',
  archived: 'Archivées',
};

function tabForUne(une: Une): TabView {
  if (une.status !== 'published') return une.status;
  return isScheduledPublication(une.status, une.publicationDate) ? 'scheduled' : 'published';
}

function duplicateHref(name: string): string {
  return `/dashboard/unes/nouveau?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function UneList() {
  const [unes, setUnes] = useState<Une[]>(UNES_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [uneToDelete, setUneToDelete] = useState<Une | null>(null);

  const counts = useMemo(
    () => ({
      published: unes.filter((u) => tabForUne(u) === 'published').length,
      scheduled: unes.filter((u) => tabForUne(u) === 'scheduled').length,
      draft: unes.filter((u) => u.status === 'draft').length,
      archived: unes.filter((u) => u.status === 'archived').length,
    }),
    [unes],
  );

  const filteredUnes = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return unes.filter((une) => {
      if (tabForUne(une) !== tab) return false;
      if (trimmed && !une.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [unes, tab, query]);

  function archiveUne(une: Une) {
    setUnes((prev) => prev.map((u) => (u.id === une.id ? { ...u, status: 'archived' } : u)));
    setSnackbarMessage(`« ${une.name} » a été archivée.`);
  }

  function restoreUne(une: Une) {
    setUnes((prev) => prev.map((u) => (u.id === une.id ? { ...u, status: 'draft' } : u)));
    setSnackbarMessage(`« ${une.name} » a été restaurée en brouillon.`);
  }

  function confirmDelete() {
    if (!uneToDelete) return;
    setUnes((prev) => prev.filter((u) => u.id !== uneToDelete.id));
    setSnackbarMessage(`« ${uneToDelete.name} » a été supprimée définitivement.`);
    setUneToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Unes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Gérez les unes mises en avant sur la page d&apos;accueil du site.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/unes/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter une une
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les unes" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher une une…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une une' },
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
        <Table aria-label={`Unes — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom de la une</TableCell>
              <TableCell>Page de destination</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUnes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune une ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUnes.map((une) => {
                return (
                  <TableRow key={une.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{une.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{une.destination || '—'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title={`Modifier « ${une.name} »`}>
                          <IconButton component={Link} href={`/dashboard/unes/edit/${une.id}`} size="small" aria-label={`Modifier « ${une.name} »`}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Dupliquer « ${une.name} »`}>
                          <IconButton component={Link} href={duplicateHref(une.name)} size="small" aria-label={`Dupliquer « ${une.name} »`}>
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {une.status !== 'archived' ? (
                          <Tooltip title={`Archiver « ${une.name} »`}>
                            <IconButton size="small" onClick={() => archiveUne(une)} aria-label={`Archiver « ${une.name} »`}>
                              <Inventory2OutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title={`Restaurer « ${une.name} »`}>
                              <IconButton size="small" onClick={() => restoreUne(une)} aria-label={`Restaurer « ${une.name} »`}>
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Supprimer définitivement « ${une.name} »`}>
                              <IconButton
                                size="small"
                                onClick={() => setUneToDelete(une)}
                                aria-label={`Supprimer définitivement « ${une.name} »`}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={uneToDelete !== null} onClose={() => setUneToDelete(null)} aria-labelledby="delete-une-title">
        <DialogTitle id="delete-une-title">Supprimer définitivement « {uneToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setUneToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
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
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
