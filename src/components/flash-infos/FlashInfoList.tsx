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
import { FLASH_INFOS_MOCK, type FlashInfo } from '@/types/flashInfos';

type TabView = 'published' | 'scheduled' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  scheduled: 'Programmés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function tabForFlashInfo(flashInfo: FlashInfo): TabView {
  if (flashInfo.status !== 'published') return flashInfo.status;
  return isScheduledPublication(flashInfo.status, flashInfo.publicationDate) ? 'scheduled' : 'published';
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function FlashInfoList() {
  const [flashInfos, setFlashInfos] = useState<FlashInfo[]>(FLASH_INFOS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [flashInfoToDelete, setFlashInfoToDelete] = useState<FlashInfo | null>(null);

  const counts = useMemo(
    () => ({
      published: flashInfos.filter((f) => tabForFlashInfo(f) === 'published').length,
      scheduled: flashInfos.filter((f) => tabForFlashInfo(f) === 'scheduled').length,
      draft: flashInfos.filter((f) => f.status === 'draft').length,
      archived: flashInfos.filter((f) => f.status === 'archived').length,
    }),
    [flashInfos],
  );

  const filteredFlashInfos = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return flashInfos.filter((flashInfo) => {
      if (tabForFlashInfo(flashInfo) !== tab) return false;
      if (trimmed && !flashInfo.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [flashInfos, tab, query]);

  function archiveFlashInfo(flashInfo: FlashInfo) {
    setFlashInfos((prev) => prev.map((f) => (f.id === flashInfo.id ? { ...f, status: 'archived' } : f)));
    setSnackbarMessage(`« ${flashInfo.name} » a été archivé.`);
  }

  function restoreFlashInfo(flashInfo: FlashInfo) {
    setFlashInfos((prev) => prev.map((f) => (f.id === flashInfo.id ? { ...f, status: 'draft' } : f)));
    setSnackbarMessage(`« ${flashInfo.name} » a été restauré en brouillon.`);
  }

  function confirmDeleteFlashInfo() {
    if (!flashInfoToDelete) return;
    setFlashInfos((prev) => prev.filter((f) => f.id !== flashInfoToDelete.id));
    setSnackbarMessage(`« ${flashInfoToDelete.name} » a été supprimé définitivement.`);
    setFlashInfoToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Flash Infos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Diffusez des informations urgentes en bandeau prioritaire sur votre site.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/flash-infos/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter une brève
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les flash infos" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher un flash info…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un flash info' },
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
        <Table aria-label={`Flash infos — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom de la brève</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFlashInfos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun flash info ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredFlashInfos.map((flashInfo) => (
                <TableRow key={flashInfo.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{flashInfo.name}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${flashInfo.name} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/flash-infos/edit/${flashInfo.id}`}
                          size="small"
                          aria-label={`Modifier « ${flashInfo.name} »`}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {flashInfo.status === 'archived' ? (
                        <>
                          <Tooltip title={`Restaurer « ${flashInfo.name} »`}>
                            <IconButton size="small" onClick={() => restoreFlashInfo(flashInfo)} aria-label={`Restaurer « ${flashInfo.name} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${flashInfo.name} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setFlashInfoToDelete(flashInfo)}
                              aria-label={`Supprimer définitivement « ${flashInfo.name} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={`Archiver « ${flashInfo.name} »`}>
                          <IconButton size="small" onClick={() => archiveFlashInfo(flashInfo)} aria-label={`Archiver « ${flashInfo.name} »`}>
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

      <Dialog open={flashInfoToDelete !== null} onClose={() => setFlashInfoToDelete(null)} aria-labelledby="delete-flash-info-title">
        <DialogTitle id="delete-flash-info-title">Supprimer définitivement « {flashInfoToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setFlashInfoToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteFlashInfo}>
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
