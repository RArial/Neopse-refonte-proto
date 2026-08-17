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
import { PUBLICATION_CATEGORIES_SEED, PUBLICATIONS_MOCK, type Publication } from '@/types/publications';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

type TabView = 'published' | 'scheduled' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiées',
  scheduled: 'Programmées',
  draft: 'Brouillons',
  archived: 'Archivées',
};

function duplicateHref(name: string): string {
  return `/dashboard/publication/nouveau?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

function tabForPublication(publication: Publication): TabView {
  if (publication.status !== 'published') return publication.status;
  return isScheduledPublication(publication.status, publication.publicationDate) ? 'scheduled' : 'published';
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function PublicationList() {
  const [publications, setPublications] = useState<Publication[]>(PUBLICATIONS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null);

  const categoryById = useMemo(() => new Map(PUBLICATION_CATEGORIES_SEED.map((category) => [category.id, category])), []);

  const counts = useMemo(
    () => ({
      published: publications.filter((p) => tabForPublication(p) === 'published').length,
      scheduled: publications.filter((p) => tabForPublication(p) === 'scheduled').length,
      draft: publications.filter((p) => p.status === 'draft').length,
      archived: publications.filter((p) => p.status === 'archived').length,
    }),
    [publications],
  );

  const filteredPublications = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return publications.filter((publication) => {
      if (tabForPublication(publication) !== tab) return false;
      if (trimmed && !publication.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [publications, tab, query]);

  function archivePublication(publication: Publication) {
    setPublications((prev) => prev.map((p) => (p.id === publication.id ? { ...p, status: 'archived' } : p)));
    setSnackbarMessage(`« ${publication.name} » a été archivée.`);
  }

  function restorePublication(publication: Publication) {
    setPublications((prev) => prev.map((p) => (p.id === publication.id ? { ...p, status: 'draft' } : p)));
    setSnackbarMessage(`« ${publication.name} » a été restaurée en brouillon.`);
  }

  function confirmDeletePublication() {
    if (!publicationToDelete) return;
    setPublications((prev) => prev.filter((p) => p.id !== publicationToDelete.id));
    setSnackbarMessage(`« ${publicationToDelete.name} » a été supprimée définitivement.`);
    setPublicationToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Publication
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Publiez des documents et contenus sur votre site.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/publication/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter une publication
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les publications" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher une publication…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une publication' },
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
        <Table aria-label={`Publications — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom de la publication</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPublications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune publication ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPublications.map((publication) => {
                return (
                  <TableRow key={publication.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{publication.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{categoryById.get(publication.categoryId)?.name ?? '—'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title={`Modifier « ${publication.name} »`}>
                          <IconButton
                            component={Link}
                            href={`/dashboard/publication/edit/${publication.id}`}
                            size="small"
                            aria-label={`Modifier « ${publication.name} »`}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Dupliquer « ${publication.name} »`}>
                          <IconButton
                            component={Link}
                            href={duplicateHref(publication.name)}
                            size="small"
                            aria-label={`Dupliquer « ${publication.name} »`}
                          >
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {publication.status === 'archived' ? (
                          <>
                            <Tooltip title={`Restaurer « ${publication.name} »`}>
                              <IconButton size="small" onClick={() => restorePublication(publication)} aria-label={`Restaurer « ${publication.name} »`}>
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Supprimer définitivement « ${publication.name} »`}>
                              <IconButton
                                size="small"
                                onClick={() => setPublicationToDelete(publication)}
                                aria-label={`Supprimer définitivement « ${publication.name} »`}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title={`Archiver « ${publication.name} »`}>
                            <IconButton size="small" onClick={() => archivePublication(publication)} aria-label={`Archiver « ${publication.name} »`}>
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

      <Dialog open={publicationToDelete !== null} onClose={() => setPublicationToDelete(null)} aria-labelledby="delete-publication-title">
        <DialogTitle id="delete-publication-title">Supprimer définitivement « {publicationToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setPublicationToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeletePublication}>
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
