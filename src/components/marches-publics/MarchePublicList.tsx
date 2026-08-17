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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { MARCHES_PUBLICS_MOCK, type MarchePublic } from '@/types/marchesPublics';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

type TabView = 'published' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function duplicateHref(objet: string): string {
  return `/dashboard/marches-publics/nouveau?copyName=${encodeURIComponent(`${objet} (copie)`)}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function MarchePublicList() {
  const [marchesPublics, setMarchesPublics] = useState<MarchePublic[]>(MARCHES_PUBLICS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [marchePublicToDelete, setMarchePublicToDelete] = useState<MarchePublic | null>(null);

  const counts = useMemo(
    () => ({
      published: marchesPublics.filter((m) => m.status === 'published').length,
      draft: marchesPublics.filter((m) => m.status === 'draft').length,
      archived: marchesPublics.filter((m) => m.status === 'archived').length,
    }),
    [marchesPublics],
  );

  const filteredMarchesPublics = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return marchesPublics.filter((marchePublic) => {
      if (marchePublic.status !== tab) return false;
      if (trimmed && !marchePublic.objet.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [marchesPublics, tab, query]);

  function archiveMarchePublic(marchePublic: MarchePublic) {
    setMarchesPublics((prev) => prev.map((m) => (m.id === marchePublic.id ? { ...m, status: 'archived' } : m)));
    setSnackbarMessage(`« ${marchePublic.objet} » a été archivé.`);
  }

  function restoreMarchePublic(marchePublic: MarchePublic) {
    setMarchesPublics((prev) => prev.map((m) => (m.id === marchePublic.id ? { ...m, status: 'draft' } : m)));
    setSnackbarMessage(`« ${marchePublic.objet} » a été restauré en brouillon.`);
  }

  function confirmDeleteMarchePublic() {
    if (!marchePublicToDelete) return;
    setMarchesPublics((prev) => prev.filter((m) => m.id !== marchePublicToDelete.id));
    setSnackbarMessage(`« ${marchePublicToDelete.objet} » a été supprimé définitivement.`);
    setMarchePublicToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Marchés publics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Publiez les avis de marchés publics de votre collectivité.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Button
            component={Link}
            href="/dashboard/marches-publics/parametres"
            variant="outlined"
            color="inherit"
            startIcon={<SettingsOutlinedIcon fontSize="small" />}
          >
            Gérer la page marchés publics
          </Button>
          <Button component={Link} href="/dashboard/marches-publics/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
            Ajouter un marché public
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les marchés publics" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher un marché public…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un marché public' },
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
        <Table aria-label={`Marchés publics — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Objet</TableCell>
              <TableCell>Domaine</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMarchesPublics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun marché public ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMarchesPublics.map((marchePublic) => {
                return (
                  <TableRow key={marchePublic.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{marchePublic.objet}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{marchePublic.domaine || '—'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title={`Modifier « ${marchePublic.objet} »`}>
                          <IconButton
                            component={Link}
                            href={`/dashboard/marches-publics/edit/${marchePublic.id}`}
                            size="small"
                            aria-label={`Modifier « ${marchePublic.objet} »`}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Dupliquer « ${marchePublic.objet} »`}>
                          <IconButton
                            component={Link}
                            href={duplicateHref(marchePublic.objet)}
                            size="small"
                            aria-label={`Dupliquer « ${marchePublic.objet} »`}
                          >
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {marchePublic.status === 'archived' ? (
                          <>
                            <Tooltip title={`Restaurer « ${marchePublic.objet} »`}>
                              <IconButton size="small" onClick={() => restoreMarchePublic(marchePublic)} aria-label={`Restaurer « ${marchePublic.objet} »`}>
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Supprimer définitivement « ${marchePublic.objet} »`}>
                              <IconButton
                                size="small"
                                onClick={() => setMarchePublicToDelete(marchePublic)}
                                aria-label={`Supprimer définitivement « ${marchePublic.objet} »`}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title={`Archiver « ${marchePublic.objet} »`}>
                            <IconButton size="small" onClick={() => archiveMarchePublic(marchePublic)} aria-label={`Archiver « ${marchePublic.objet} »`}>
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

      <Dialog open={marchePublicToDelete !== null} onClose={() => setMarchePublicToDelete(null)} aria-labelledby="delete-marche-public-title">
        <DialogTitle id="delete-marche-public-title">Supprimer définitivement « {marchePublicToDelete?.objet} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setMarchePublicToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteMarchePublic}>
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
