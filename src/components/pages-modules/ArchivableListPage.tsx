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

export type ArchivableStatus = 'published' | 'draft' | 'archived';

export interface ArchivableItem {
  id: string;
  name: string;
  status: ArchivableStatus;
}

type TabView = 'published' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function duplicateHref(addHref: string, name: string): string {
  return `${addHref}?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

interface ArchivableListPageProps {
  title: string;
  description: string;
  addLabel: string;
  addHref: string;
  editHrefBase: string;
  itemNounSingular: string;
  itemNounPlural: string;
  initialItems: ArchivableItem[];
}

export function ArchivableListPage({
  title,
  description,
  addLabel,
  addHref,
  editHrefBase,
  itemNounSingular,
  itemNounPlural,
  initialItems,
}: ArchivableListPageProps) {
  const [items, setItems] = useState<ArchivableItem[]>(initialItems);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ArchivableItem | null>(null);

  const counts = useMemo(
    () => ({
      published: items.filter((item) => item.status === 'published').length,
      draft: items.filter((item) => item.status === 'draft').length,
      archived: items.filter((item) => item.status === 'archived').length,
    }),
    [items],
  );

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return items.filter((item) => {
      if (item.status !== tab) return false;
      if (trimmed && !item.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [items, tab, query]);

  function archiveItem(item: ArchivableItem) {
    setItems((prev) => prev.map((candidate) => (candidate.id === item.id ? { ...candidate, status: 'archived' } : candidate)));
    setSnackbarMessage(`« ${item.name} » a été archivé(e).`);
  }

  function restoreItem(item: ArchivableItem) {
    setItems((prev) => prev.map((candidate) => (candidate.id === item.id ? { ...candidate, status: 'draft' } : candidate)));
    setSnackbarMessage(`« ${item.name} » a été rétabli(e) en brouillon.`);
  }

  function confirmDelete() {
    if (!itemToDelete) return;
    setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    setSnackbarMessage(`« ${itemToDelete.name} » a été supprimé(e) définitivement.`);
    setItemToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {description}
          </Typography>
        </Box>
        <Button component={Link} href={addHref} variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          {addLabel}
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label={`Filtrer ${itemNounPlural}`} sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder={`Rechercher ${itemNounSingular}…`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': `Rechercher ${itemNounSingular}` },
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
        <Table aria-label={`${itemNounPlural} — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun résultat pour {itemNounPlural}.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${item.name} »`}>
                        <IconButton component={Link} href={`${editHrefBase}/${item.id}`} size="small" aria-label={`Modifier « ${item.name} »`}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Dupliquer « ${item.name} »`}>
                        <IconButton
                          component={Link}
                          href={duplicateHref(addHref, item.name)}
                          size="small"
                          aria-label={`Dupliquer « ${item.name} »`}
                        >
                          <ContentCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {item.status !== 'archived' ? (
                        <Tooltip title={`Archiver « ${item.name} »`}>
                          <IconButton size="small" onClick={() => archiveItem(item)} aria-label={`Archiver « ${item.name} »`}>
                            <Inventory2OutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <>
                          <Tooltip title={`Rétablir « ${item.name} »`}>
                            <IconButton size="small" onClick={() => restoreItem(item)} aria-label={`Rétablir « ${item.name} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${item.name} »`}>
                            <IconButton size="small" onClick={() => setItemToDelete(item)} aria-label={`Supprimer définitivement « ${item.name} »`}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={itemToDelete !== null} onClose={() => setItemToDelete(null)} aria-labelledby="delete-item-title">
        <DialogTitle id="delete-item-title">Supprimer définitivement « {itemToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setItemToDelete(null)} autoFocus>
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
