'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export interface SimpleContentItem {
  id: string;
  name: string;
  active: boolean;
  email?: string;
}

interface SecondaryAction {
  label: string;
  href: string;
}

function duplicateHref(addHref: string, name: string): string {
  return `${addHref}?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

interface ContentListPageProps {
  title: string;
  description: string;
  addLabel: string;
  addHref: string;
  itemNounSingular: string;
  itemNounPlural: string;
  initialItems: SimpleContentItem[];
  /** Affiche la colonne Email — désactivée par défaut. */
  showEmail?: boolean;
  /** Si fourni, affiche un bouton d'édition par ligne menant vers `${editHrefBase}/${item.id}`. */
  editHrefBase?: string;
  /** Boutons secondaires optionnels affichés à côté du bouton d'ajout (ex. accès aux réglages de la page). */
  secondaryActions?: SecondaryAction[];
}

export function ContentListPage({
  title,
  description,
  addLabel,
  addHref,
  itemNounSingular,
  itemNounPlural,
  initialItems,
  showEmail = false,
  editHrefBase,
  secondaryActions,
}: ContentListPageProps) {
  const [items, setItems] = useState<SimpleContentItem[]>(initialItems);
  const [query, setQuery] = useState('');
  const [itemToDelete, setItemToDelete] = useState<SimpleContentItem | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return items.filter((item) => !trimmed || item.name.toLowerCase().includes(trimmed));
  }, [items, query]);

  function confirmDelete() {
    if (!itemToDelete) return;
    setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    setSnackbarMessage(`« ${itemToDelete.name} » a été supprimé(e).`);
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
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0, flexWrap: 'wrap' }}>
          {secondaryActions?.map((action) => (
            <Button key={action.href} component={Link} href={action.href} variant="outlined" color="inherit" startIcon={<SettingsOutlinedIcon fontSize="small" />}>
              {action.label}
            </Button>
          ))}
          <Button component={Link} href={addHref} variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
            {addLabel}
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
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
        <Table aria-label={itemNounPlural}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom</TableCell>
              {showEmail && <TableCell>Email</TableCell>}
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2 + (showEmail ? 1 : 0)}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun résultat pour {itemNounPlural}.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
                  {showEmail && <TableCell sx={{ color: 'text.secondary' }}>{item.email || '—'}</TableCell>}
                  <TableCell align="right">
                    {editHrefBase && (
                      <Tooltip title={`Modifier « ${item.name} »`}>
                        <IconButton component={Link} href={`${editHrefBase}/${item.id}`} size="small" aria-label={`Modifier « ${item.name} »`}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
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
                    <Tooltip title={`Supprimer « ${item.name} »`}>
                      <IconButton size="small" onClick={() => setItemToDelete(item)} aria-label={`Supprimer « ${item.name} »`}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={itemToDelete !== null} onClose={() => setItemToDelete(null)} aria-labelledby="delete-item-title">
        <DialogTitle id="delete-item-title">Supprimer « {itemToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setItemToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer
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
