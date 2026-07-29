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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { isScheduledPublication } from '@/lib/publicationSchedule';
import { PHOTO_DIAPORAMAS_MOCK, type PhotoDiaporama } from '@/types/galeriesPhotos';

type TabView = 'published' | 'scheduled' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  scheduled: 'Programmés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function formatFrLongDate(iso: string) {
  if (!iso) return '—';
  const date = new Date(`${iso}T00:00:00`);
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

function tabForDiaporama(diaporama: PhotoDiaporama): TabView {
  if (diaporama.status !== 'published') return diaporama.status;
  return isScheduledPublication(diaporama.status, diaporama.publicationDate) ? 'scheduled' : 'published';
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function PhotoGalleryList() {
  const [diaporamas, setDiaporamas] = useState<PhotoDiaporama[]>(PHOTO_DIAPORAMAS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [diaporamaToDelete, setDiaporamaToDelete] = useState<PhotoDiaporama | null>(null);

  const counts = useMemo(
    () => ({
      published: diaporamas.filter((d) => tabForDiaporama(d) === 'published').length,
      scheduled: diaporamas.filter((d) => tabForDiaporama(d) === 'scheduled').length,
      draft: diaporamas.filter((d) => d.status === 'draft').length,
      archived: diaporamas.filter((d) => d.status === 'archived').length,
    }),
    [diaporamas],
  );

  const filteredDiaporamas = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return diaporamas.filter((diaporama) => {
      if (tabForDiaporama(diaporama) !== tab) return false;
      if (trimmed && !diaporama.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [diaporamas, tab, query]);

  function archiveDiaporama(diaporama: PhotoDiaporama) {
    setDiaporamas((prev) => prev.map((d) => (d.id === diaporama.id ? { ...d, status: 'archived' } : d)));
    setSnackbarMessage(`« ${diaporama.name} » a été archivé.`);
  }

  function restoreDiaporama(diaporama: PhotoDiaporama) {
    setDiaporamas((prev) => prev.map((d) => (d.id === diaporama.id ? { ...d, status: 'draft' } : d)));
    setSnackbarMessage(`« ${diaporama.name} » a été restauré en brouillon.`);
  }

  function confirmDeleteDiaporama() {
    if (!diaporamaToDelete) return;
    setDiaporamas((prev) => prev.filter((d) => d.id !== diaporamaToDelete.id));
    setSnackbarMessage(`« ${diaporamaToDelete.name} » a été supprimé définitivement.`);
    setDiaporamaToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Galeries de photos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Créez des diaporamas illustrant la vie de votre collectivité.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/galeries-photos/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Créer un diaporama
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les diaporamas" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher un diaporama…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un diaporama' },
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
        <Table aria-label={`Diaporamas — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom du diaporama</TableCell>
              <TableCell>Publication</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDiaporamas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun diaporama ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDiaporamas.map((diaporama) => (
                <TableRow key={diaporama.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{diaporama.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{formatFrLongDate(diaporama.publicationDate)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${diaporama.name} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/galeries-photos/edit/${diaporama.id}`}
                          size="small"
                          aria-label={`Modifier « ${diaporama.name} »`}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {diaporama.status === 'archived' ? (
                        <>
                          <Tooltip title={`Restaurer « ${diaporama.name} »`}>
                            <IconButton size="small" onClick={() => restoreDiaporama(diaporama)} aria-label={`Restaurer « ${diaporama.name} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${diaporama.name} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setDiaporamaToDelete(diaporama)}
                              aria-label={`Supprimer définitivement « ${diaporama.name} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={`Archiver « ${diaporama.name} »`}>
                          <IconButton size="small" onClick={() => archiveDiaporama(diaporama)} aria-label={`Archiver « ${diaporama.name} »`}>
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

      <Dialog open={diaporamaToDelete !== null} onClose={() => setDiaporamaToDelete(null)} aria-labelledby="delete-diaporama-title">
        <DialogTitle id="delete-diaporama-title">Supprimer définitivement « {diaporamaToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setDiaporamaToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteDiaporama}>
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
