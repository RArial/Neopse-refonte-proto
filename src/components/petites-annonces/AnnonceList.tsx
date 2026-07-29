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
import { ANNONCES_MOCK, ANNONCE_TYPE_LABELS, type Annonce } from '@/types/petitesAnnonces';

type TabView = 'published' | 'draft' | 'archived';

function duplicateHref(name: string): string {
  return `/dashboard/petites-annonces/nouveau?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiées',
  draft: 'Brouillons',
  archived: 'Archivées',
};

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function AnnonceList() {
  const [annonces, setAnnonces] = useState<Annonce[]>(ANNONCES_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [annonceToDelete, setAnnonceToDelete] = useState<Annonce | null>(null);

  const counts = useMemo(
    () => ({
      published: annonces.filter((a) => a.status === 'published').length,
      draft: annonces.filter((a) => a.status === 'draft').length,
      archived: annonces.filter((a) => a.status === 'archived').length,
    }),
    [annonces],
  );

  const filteredAnnonces = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return annonces.filter((annonce) => {
      if (annonce.status !== tab) return false;
      if (trimmed && !annonce.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [annonces, tab, query]);

  function archiveAnnonce(annonce: Annonce) {
    setAnnonces((prev) => prev.map((a) => (a.id === annonce.id ? { ...a, status: 'archived' } : a)));
    setSnackbarMessage(`« ${annonce.name} » a été archivée.`);
  }

  function restoreAnnonce(annonce: Annonce) {
    setAnnonces((prev) => prev.map((a) => (a.id === annonce.id ? { ...a, status: 'draft' } : a)));
    setSnackbarMessage(`« ${annonce.name} » a été restaurée en brouillon.`);
  }

  function confirmDeleteAnnonce() {
    if (!annonceToDelete) return;
    setAnnonces((prev) => prev.filter((a) => a.id !== annonceToDelete.id));
    setSnackbarMessage(`« ${annonceToDelete.name} » a été supprimée définitivement.`);
    setAnnonceToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Petites annonces
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Publiez les offres et demandes des habitants de votre collectivité.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/petites-annonces/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter une annonce
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les petites annonces" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher une annonce…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une annonce' },
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
        <Table aria-label={`Petites annonces — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom de l&apos;annonce</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnnonces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune annonce ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAnnonces.map((annonce) => (
                <TableRow key={annonce.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{annonce.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{ANNONCE_TYPE_LABELS[annonce.annonceType]}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${annonce.name} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/petites-annonces/edit/${annonce.id}`}
                          size="small"
                          aria-label={`Modifier « ${annonce.name} »`}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Dupliquer « ${annonce.name} »`}>
                        <IconButton component={Link} href={duplicateHref(annonce.name)} size="small" aria-label={`Dupliquer « ${annonce.name} »`}>
                          <ContentCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {annonce.status === 'archived' ? (
                        <>
                          <Tooltip title={`Restaurer « ${annonce.name} »`}>
                            <IconButton size="small" onClick={() => restoreAnnonce(annonce)} aria-label={`Restaurer « ${annonce.name} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${annonce.name} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setAnnonceToDelete(annonce)}
                              aria-label={`Supprimer définitivement « ${annonce.name} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={`Archiver « ${annonce.name} »`}>
                          <IconButton size="small" onClick={() => archiveAnnonce(annonce)} aria-label={`Archiver « ${annonce.name} »`}>
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

      <Dialog open={annonceToDelete !== null} onClose={() => setAnnonceToDelete(null)} aria-labelledby="delete-annonce-title">
        <DialogTitle id="delete-annonce-title">Supprimer définitivement « {annonceToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setAnnonceToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteAnnonce}>
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
