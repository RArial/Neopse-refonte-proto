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
import { MARCHES_MOCK, type Marche } from '@/types/marches';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

type TabView = 'published' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function duplicateHref(name: string): string {
  return `/dashboard/marches/nouveau?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function MarcheList() {
  const [marches, setMarches] = useState<Marche[]>(MARCHES_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [marcheToDelete, setMarcheToDelete] = useState<Marche | null>(null);

  const counts = useMemo(
    () => ({
      published: marches.filter((m) => m.status === 'published').length,
      draft: marches.filter((m) => m.status === 'draft').length,
      archived: marches.filter((m) => m.status === 'archived').length,
    }),
    [marches],
  );

  const filteredMarches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return marches.filter((marche) => {
      if (marche.status !== tab) return false;
      if (trimmed && !marche.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [marches, tab, query]);

  function archiveMarche(marche: Marche) {
    setMarches((prev) => prev.map((m) => (m.id === marche.id ? { ...m, status: 'archived' } : m)));
    setSnackbarMessage(`« ${marche.name} » a été archivé.`);
  }

  function restoreMarche(marche: Marche) {
    setMarches((prev) => prev.map((m) => (m.id === marche.id ? { ...m, status: 'draft' } : m)));
    setSnackbarMessage(`« ${marche.name} » a été restauré en brouillon.`);
  }

  function confirmDeleteMarche() {
    if (!marcheToDelete) return;
    setMarches((prev) => prev.filter((m) => m.id !== marcheToDelete.id));
    setSnackbarMessage(`« ${marcheToDelete.name} » a été supprimé définitivement.`);
    setMarcheToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Marchés
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Publiez les marchés se tenant sur votre commune.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/marches/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter un marché
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les marchés" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher un marché…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un marché' },
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
        <Table aria-label={`Marchés — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom du marché</TableCell>
              <TableCell>Activité</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMarches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun marché ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMarches.map((marche) => {
                return (
                  <TableRow key={marche.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{marche.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{marche.activity || '—'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title={`Modifier « ${marche.name} »`}>
                          <IconButton component={Link} href={`/dashboard/marches/edit/${marche.id}`} size="small" aria-label={`Modifier « ${marche.name} »`}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Dupliquer « ${marche.name} »`}>
                          <IconButton component={Link} href={duplicateHref(marche.name)} size="small" aria-label={`Dupliquer « ${marche.name} »`}>
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {marche.status === 'archived' ? (
                          <>
                            <Tooltip title={`Restaurer « ${marche.name} »`}>
                              <IconButton size="small" onClick={() => restoreMarche(marche)} aria-label={`Restaurer « ${marche.name} »`}>
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Supprimer définitivement « ${marche.name} »`}>
                              <IconButton
                                size="small"
                                onClick={() => setMarcheToDelete(marche)}
                                aria-label={`Supprimer définitivement « ${marche.name} »`}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title={`Archiver « ${marche.name} »`}>
                            <IconButton size="small" onClick={() => archiveMarche(marche)} aria-label={`Archiver « ${marche.name} »`}>
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

      <Dialog open={marcheToDelete !== null} onClose={() => setMarcheToDelete(null)} aria-labelledby="delete-marche-title">
        <DialogTitle id="delete-marche-title">Supprimer définitivement « {marcheToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setMarcheToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteMarche}>
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
