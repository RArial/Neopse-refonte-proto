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
import { CARPOOLING_MOCK, CARPOOLING_TYPE_LABELS, type Carpooling } from '@/types/covoiturage';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

type TabView = 'published' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiées',
  draft: 'Brouillons',
  archived: 'Archivées',
};

const DUPLICATE_HREF = '/dashboard/covoiturage/nouveau?duplicate=1';

function tripLabel(carpooling: Carpooling) {
  return `${carpooling.departureCity} → ${carpooling.arrivalCity}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function CarpoolingList() {
  const [listings, setListings] = useState<Carpooling[]>(CARPOOLING_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [listingToDelete, setListingToDelete] = useState<Carpooling | null>(null);

  const counts = useMemo(
    () => ({
      published: listings.filter((l) => l.status === 'published').length,
      draft: listings.filter((l) => l.status === 'draft').length,
      archived: listings.filter((l) => l.status === 'archived').length,
    }),
    [listings],
  );

  const filteredListings = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return listings.filter((listing) => {
      if (listing.status !== tab) return false;
      if (trimmed && !tripLabel(listing).toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [listings, tab, query]);

  function archiveListing(listing: Carpooling) {
    setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, status: 'archived' } : l)));
    setSnackbarMessage(`« ${tripLabel(listing)} » a été archivée.`);
  }

  function restoreListing(listing: Carpooling) {
    setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, status: 'draft' } : l)));
    setSnackbarMessage(`« ${tripLabel(listing)} » a été restaurée en brouillon.`);
  }

  function confirmDeleteListing() {
    if (!listingToDelete) return;
    setListings((prev) => prev.filter((l) => l.id !== listingToDelete.id));
    setSnackbarMessage(`« ${tripLabel(listingToDelete)} » a été supprimée définitivement.`);
    setListingToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Annonces de covoiturage
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Mettez en relation les habitants souhaitant covoiturer.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/covoiturage/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter une annonce
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les annonces de covoiturage" sx={{ minHeight: 44 }}>
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
            htmlInput: { 'aria-label': 'Rechercher une annonce de covoiturage' },
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
        <Table aria-label={`Annonces de covoiturage — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Trajet</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredListings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune annonce ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{tripLabel(listing)}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{CARPOOLING_TYPE_LABELS[listing.annonceType]}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${tripLabel(listing)} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/covoiturage/edit/${listing.id}`}
                          size="small"
                          aria-label={`Modifier « ${tripLabel(listing)} »`}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Dupliquer « ${tripLabel(listing)} »`}>
                        <IconButton component={Link} href={DUPLICATE_HREF} size="small" aria-label={`Dupliquer « ${tripLabel(listing)} »`}>
                          <ContentCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {listing.status === 'archived' ? (
                        <>
                          <Tooltip title={`Restaurer « ${tripLabel(listing)} »`}>
                            <IconButton size="small" onClick={() => restoreListing(listing)} aria-label={`Restaurer « ${tripLabel(listing)} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${tripLabel(listing)} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setListingToDelete(listing)}
                              aria-label={`Supprimer définitivement « ${tripLabel(listing)} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={`Archiver « ${tripLabel(listing)} »`}>
                          <IconButton size="small" onClick={() => archiveListing(listing)} aria-label={`Archiver « ${tripLabel(listing)} »`}>
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

      <Dialog open={listingToDelete !== null} onClose={() => setListingToDelete(null)} aria-labelledby="delete-carpooling-title">
        <DialogTitle id="delete-carpooling-title">Supprimer définitivement « {listingToDelete ? tripLabel(listingToDelete) : ''} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setListingToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteListing}>
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
