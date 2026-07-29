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
import { isScheduledPublication } from '@/lib/publicationSchedule';
import { ACTE_CATEGORIES_SEED, ACTES_MOCK, type Acte } from '@/types/actes';

type TabView = 'published' | 'scheduled' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  scheduled: 'Programmés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function duplicateHref(name: string): string {
  return `/dashboard/publication-des-actes/nouveau?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

function tabForActe(acte: Acte): TabView {
  if (acte.status !== 'published') return acte.status;
  return isScheduledPublication(acte.status, acte.publicationDate) ? 'scheduled' : 'published';
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function ActeList() {
  const [actes, setActes] = useState<Acte[]>(ACTES_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [acteToDelete, setActeToDelete] = useState<Acte | null>(null);

  const categoryById = useMemo(() => new Map(ACTE_CATEGORIES_SEED.map((category) => [category.id, category])), []);

  const counts = useMemo(
    () => ({
      published: actes.filter((a) => tabForActe(a) === 'published').length,
      scheduled: actes.filter((a) => tabForActe(a) === 'scheduled').length,
      draft: actes.filter((a) => a.status === 'draft').length,
      archived: actes.filter((a) => a.status === 'archived').length,
    }),
    [actes],
  );

  const filteredActes = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return actes.filter((acte) => {
      if (tabForActe(acte) !== tab) return false;
      if (trimmed && !acte.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [actes, tab, query]);

  function archiveActe(acte: Acte) {
    setActes((prev) => prev.map((a) => (a.id === acte.id ? { ...a, status: 'archived' } : a)));
    setSnackbarMessage(`« ${acte.name} » a été archivé.`);
  }

  function restoreActe(acte: Acte) {
    setActes((prev) => prev.map((a) => (a.id === acte.id ? { ...a, status: 'draft' } : a)));
    setSnackbarMessage(`« ${acte.name} » a été restauré en brouillon.`);
  }

  function confirmDeleteActe() {
    if (!acteToDelete) return;
    setActes((prev) => prev.filter((a) => a.id !== acteToDelete.id));
    setSnackbarMessage(`« ${acteToDelete.name} » a été supprimé définitivement.`);
    setActeToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Publication des actes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Publiez les comptes rendus et actes officiels de votre collectivité.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/publication-des-actes/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Créer une publication des actes
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les actes" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher un compte rendu…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un compte rendu' },
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
        <Table aria-label={`Publication des actes — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom du compte rendu</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun compte rendu ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredActes.map((acte) => {
                return (
                  <TableRow key={acte.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{acte.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{categoryById.get(acte.categoryId)?.name ?? '—'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title={`Modifier « ${acte.name} »`}>
                          <IconButton
                            component={Link}
                            href={`/dashboard/publication-des-actes/edit/${acte.id}`}
                            size="small"
                            aria-label={`Modifier « ${acte.name} »`}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Dupliquer « ${acte.name} »`}>
                          <IconButton component={Link} href={duplicateHref(acte.name)} size="small" aria-label={`Dupliquer « ${acte.name} »`}>
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {acte.status === 'archived' ? (
                          <>
                            <Tooltip title={`Restaurer « ${acte.name} »`}>
                              <IconButton size="small" onClick={() => restoreActe(acte)} aria-label={`Restaurer « ${acte.name} »`}>
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Supprimer définitivement « ${acte.name} »`}>
                              <IconButton
                                size="small"
                                onClick={() => setActeToDelete(acte)}
                                aria-label={`Supprimer définitivement « ${acte.name} »`}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title={`Archiver « ${acte.name} »`}>
                            <IconButton size="small" onClick={() => archiveActe(acte)} aria-label={`Archiver « ${acte.name} »`}>
                              <Inventory2OutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

      <Dialog open={acteToDelete !== null} onClose={() => setActeToDelete(null)} aria-labelledby="delete-acte-title">
        <DialogTitle id="delete-acte-title">Supprimer définitivement « {acteToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setActeToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteActe}>
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
