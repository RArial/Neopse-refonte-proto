'use client';

import { useState } from 'react';
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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

export function VariantSelector() {
  const {
    variants,
    activeVariant,
    requestSelectVariant,
    duplicateVariant,
    duplicateActiveIntoNewVariant,
    renameVariant,
    deleteVariant,
  } = usePersonnalisation();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [switchSnackbarMessage, setSwitchSnackbarMessage] = useState<string | null>(null);

  function handleChange(event: SelectChangeEvent<string>) {
    requestSelectVariant(event.target.value);
  }

  function openMenu(event: React.MouseEvent<HTMLElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  function handleDuplicate() {
    duplicateVariant(activeVariant.id);
    closeMenu();
  }

  function handleDuplicateIntoNew() {
    const { name } = duplicateActiveIntoNewVariant();
    closeMenu();
    setSwitchSnackbarMessage(`Vous éditez maintenant ${name}. L'originale est inchangée.`);
  }

  function openRename() {
    setRenameValue(activeVariant.name);
    setRenameOpen(true);
    closeMenu();
  }

  function confirmRename() {
    renameVariant(activeVariant.id, renameValue);
    setRenameOpen(false);
  }

  function openDelete() {
    setDeleteOpen(true);
    closeMenu();
  }

  function confirmDelete() {
    deleteVariant(activeVariant.id);
    setDeleteOpen(false);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
      <Select
        variant="outlined"
        size="small"
        value={activeVariant.id}
        onChange={handleChange}
        aria-label="Variante en cours d'édition"
        sx={{ fontWeight: 600, fontSize: 14, maxWidth: 260 }}
      >
        {variants.map((v) => (
          <MenuItem key={v.id} value={v.id} sx={{ gap: 1 }}>
            <Typography component="span" variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {v.name}
            </Typography>
            {v.status === 'published' && <Chip label="En ligne" color="success" size="small" variant="outlined" />}
          </MenuItem>
        ))}
      </Select>

      <IconButton size="small" onClick={openMenu} aria-label="Actions sur la variante" aria-haspopup="true" sx={{ ml: 1 }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={handleDuplicate}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dupliquer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicateIntoNew}>
          <ListItemIcon>
            <AltRouteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dupliquer dans une nouvelle variante</ListItemText>
        </MenuItem>
        <MenuItem onClick={openRename}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Renommer</ListItemText>
        </MenuItem>
        <MenuItem onClick={openDelete} disabled={activeVariant.status === 'published'}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} aria-labelledby="rename-variant-title">
        <DialogTitle id="rename-variant-title">Renommer la variante</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nom de la variante"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            sx={{ mt: 1, minWidth: 320 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setRenameOpen(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={confirmRename} disabled={!renameValue.trim()}>
            Renommer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} aria-labelledby="delete-variant-title">
        <DialogTitle id="delete-variant-title">Supprimer « {activeVariant.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive. La variante ne pourra pas être récupérée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setDeleteOpen(false)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={switchSnackbarMessage !== null}
        autoHideDuration={5000}
        onClose={() => setSwitchSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSwitchSnackbarMessage(null)} sx={{ width: '100%' }}>
          {switchSnackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
