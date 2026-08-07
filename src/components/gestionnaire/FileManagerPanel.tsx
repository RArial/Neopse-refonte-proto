'use client';

import { useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { FolderTree } from '@/components/gestionnaire/FolderTree';
import { ROOT_FOLDER_ID, type ManagedFile, type ManagedFolder, type ManagerSection } from '@/types/gestionnaire';

type SortBy = 'name' | 'date';

const KIND_BADGE: Record<ManagedFile['kind'], { label: string; bgcolor: string; color: string; striped?: boolean }> = {
  image: { label: 'IMG', bgcolor: 'action.hover', color: 'text.disabled', striped: true },
  pdf: { label: 'PDF', bgcolor: 'error.dark', color: 'common.white' },
};

function FileThumbnail({ kind }: { kind: ManagedFile['kind'] }) {
  const badge = KIND_BADGE[kind];
  return (
    <Box
      aria-hidden="true"
      sx={{
        aspectRatio: '4 / 3',
        borderRadius: '10px 10px 0 0',
        display: 'grid',
        placeItems: 'center',
        bgcolor: badge.bgcolor,
        color: badge.color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '.08em',
        backgroundImage: badge.striped
          ? 'repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 10px)'
          : undefined,
        backgroundBlendMode: badge.striped ? 'overlay' : undefined,
        opacity: badge.striped ? 1 : 1,
      }}
    >
      <Box sx={{ opacity: badge.striped ? 0.9 : 1 }}>{badge.label}</Box>
    </Box>
  );
}

interface FileManagerPanelProps {
  section: ManagerSection;
}

export function FileManagerPanel({ section }: FileManagerPanelProps) {
  const [folders, setFolders] = useState<ManagedFolder[]>(section.folders);
  const [files, setFiles] = useState<ManagedFile[]>(section.files);
  const [trashedFiles, setTrashedFiles] = useState<ManagedFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>(ROOT_FOLDER_ID);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [fileMenu, setFileMenu] = useState<{ id: string; anchorEl: HTMLElement } | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameTarget, setRenameTarget] = useState<ManagedFile | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [trashOpen, setTrashOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    files.forEach((file) => {
      counts[file.folderId] = (counts[file.folderId] ?? 0) + 1;
    });
    return counts;
  }, [files]);

  const visibleFiles = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return files
      .filter((file) => currentFolderId === ROOT_FOLDER_ID || file.folderId === currentFolderId)
      .filter((file) => !trimmed || file.name.toLowerCase().includes(trimmed))
      .sort((a, b) => (sortBy === 'name' ? a.name.localeCompare(b.name) : b.dateAdded.localeCompare(a.dateAdded)));
  }, [files, currentFolderId, query, sortBy]);

  const allVisibleSelected = visibleFiles.length > 0 && visibleFiles.every((file) => selectedIds.has(file.id));

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      if (allVisibleSelected) return new Set([...prev].filter((id) => !visibleFiles.some((file) => file.id === id)));
      const next = new Set(prev);
      visibleFiles.forEach((file) => next.add(file.id));
      return next;
    });
  }

  function closeFileMenu() {
    setFileMenu(null);
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (selected.length === 0) return;
    const created: ManagedFile[] = selected.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      kind: section.id === 'images' ? 'image' : 'pdf',
      meta: `${(file.size / 1024).toFixed(1)} kB · ${(file.name.split('.').pop() ?? '').toUpperCase()}`,
      folderId: currentFolderId,
      dateAdded: new Date().toISOString().slice(0, 10),
    }));
    setFiles((prev) => [...created, ...prev]);
    setSnackbarMessage(`${created.length} fichier${created.length > 1 ? 's' : ''} ajouté${created.length > 1 ? 's' : ''}.`);
  }

  function createFolder() {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    setFolders((prev) => [...prev, { id: `folder-${Date.now()}`, label: trimmed, parentId: currentFolderId }]);
    setSnackbarMessage(`Dossier « ${trimmed} » créé.`);
    setNewFolderName('');
    setNewFolderOpen(false);
  }

  function downloadFile(file: ManagedFile) {
    setSnackbarMessage(`Téléchargement de « ${file.name} » démarré.`);
    closeFileMenu();
  }

  function bulkDownload() {
    const count = selectedIds.size;
    setSnackbarMessage(`Téléchargement de ${count} fichier${count > 1 ? 's' : ''} démarré.`);
  }

  function openRename(file: ManagedFile) {
    setRenameTarget(file);
    setRenameValue(file.name);
    closeFileMenu();
  }

  function confirmRename() {
    if (!renameTarget || !renameValue.trim()) return;
    setFiles((prev) => prev.map((file) => (file.id === renameTarget.id ? { ...file, name: renameValue.trim() } : file)));
    setRenameTarget(null);
  }

  function moveToTrash(file: ManagedFile) {
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    setTrashedFiles((prev) => [file, ...prev]);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(file.id);
      return next;
    });
    setSnackbarMessage(`« ${file.name} » déplacé vers la corbeille.`);
    closeFileMenu();
  }

  function bulkMoveToTrash() {
    const toTrash = files.filter((file) => selectedIds.has(file.id));
    setFiles((prev) => prev.filter((file) => !selectedIds.has(file.id)));
    setTrashedFiles((prev) => [...toTrash, ...prev]);
    setSnackbarMessage(`${toTrash.length} fichier(s) déplacé(s) vers la corbeille.`);
    setSelectedIds(new Set());
  }

  function restoreFromTrash(file: ManagedFile) {
    setTrashedFiles((prev) => prev.filter((f) => f.id !== file.id));
    setFiles((prev) => [file, ...prev]);
    setSnackbarMessage(`« ${file.name} » restauré.`);
  }

  function deleteForever(file: ManagedFile) {
    setTrashedFiles((prev) => prev.filter((f) => f.id !== file.id));
    setSnackbarMessage(`« ${file.name} » supprimé définitivement.`);
  }

  const activeMenuFile = files.find((file) => file.id === fileMenu?.id);

  return (
    <Box>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="inherit"
          sx={{ bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'text.secondary' } }}
          startIcon={<UploadFileOutlinedIcon fontSize="small" />}
          onClick={handleUploadClick}
        >
          {section.uploadLabel}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={section.acceptedFileTypes || undefined}
          multiple
          hidden
          onChange={handleFilesSelected}
          aria-hidden="true"
          tabIndex={-1}
        />
        <Button variant="outlined" color="inherit" startIcon={<CreateNewFolderOutlinedIcon fontSize="small" />} onClick={() => setNewFolderOpen(true)}>
          Nouveau dossier
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Checkbox size="small" checked={allVisibleSelected} disabled={visibleFiles.length === 0} sx={{ p: 0 }} />}
          onClick={toggleSelectAll}
          disabled={visibleFiles.length === 0}
        >
          Tout sélectionner
        </Button>

        <Box sx={{ flex: 1 }} />

        <ToggleButtonGroup
          size="small"
          value={viewMode}
          exclusive
          onChange={(_, value: 'grid' | 'list' | null) => value && setViewMode(value)}
          aria-label="Mode d'affichage"
        >
          <ToggleButton value="grid" aria-label="Affichage en grille">
            <GridViewOutlinedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list" aria-label="Affichage en liste">
            <ViewListOutlinedIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          select
          size="small"
          label="Trier par"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortBy)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="name">Nom</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </TextField>

        <TextField
          size="small"
          placeholder="Rechercher un fichier…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 220 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un fichier' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button variant="outlined" color="inherit" startIcon={<DeleteOutlineIcon fontSize="small" />} onClick={() => setTrashOpen(true)}>
          Corbeille{trashedFiles.length > 0 ? ` (${trashedFiles.length})` : ''}
        </Button>
      </Stack>

      {selectedIds.size > 0 && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2, px: 1.5, py: 1, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
          </Typography>
          <Button size="small" color="inherit" startIcon={<DownloadOutlinedIcon fontSize="small" />} onClick={bulkDownload}>
            Télécharger
          </Button>
          <Button size="small" color="error" startIcon={<DeleteOutlineIcon fontSize="small" />} onClick={bulkMoveToTrash}>
            Déplacer vers la corbeille
          </Button>
          <Button size="small" color="inherit" onClick={() => setSelectedIds(new Set())}>
            Annuler la sélection
          </Button>
        </Stack>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px minmax(0, 1fr)' }, gap: 3 }}>
        <Box component="nav" aria-label={`Dossiers — ${section.label}`}>
          <Stack
            direction="row"
            spacing={1}
            role="treeitem"
            aria-selected={currentFolderId === ROOT_FOLDER_ID}
            tabIndex={0}
            onClick={() => setCurrentFolderId(ROOT_FOLDER_ID)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setCurrentFolderId(ROOT_FOLDER_ID);
              }
            }}
            sx={{
              alignItems: 'center',
              px: 1.25,
              py: 0.875,
              borderRadius: 1.5,
              cursor: 'pointer',
              fontWeight: 700,
              bgcolor: currentFolderId === ROOT_FOLDER_ID ? 'action.selected' : 'transparent',
              color: currentFolderId === ROOT_FOLDER_ID ? 'primary.dark' : 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
            }}
          >
            <FolderOutlinedIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 700, flex: 1 }}>
              {section.rootLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {files.length}
            </Typography>
          </Stack>

          <FolderTree folders={folders} currentFolderId={currentFolderId} folderCounts={folderCounts} onSelect={setCurrentFolderId} />
        </Box>

        <Box>
          {visibleFiles.length === 0 ? (
            <Box sx={{ border: '1.5px dashed', borderColor: 'divider', borderRadius: 2, py: 6, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Aucun fichier ici.
              </Typography>
            </Box>
          ) : viewMode === 'grid' ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
              {visibleFiles.map((file) => (
                <Box key={file.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden', position: 'relative' }}>
                  <Checkbox
                    size="small"
                    checked={selectedIds.has(file.id)}
                    onChange={() => toggleSelected(file.id)}
                    sx={{ position: 'absolute', top: 6, left: 6, bgcolor: 'background.paper', borderRadius: 1, '&:hover': { bgcolor: 'background.paper' } }}
                    slotProps={{ input: { 'aria-label': `Sélectionner « ${file.name} »` } }}
                  />
                  <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 4, right: 4 }}>
                    <IconButton
                      size="small"
                      onClick={(event) => setFileMenu({ id: file.id, anchorEl: event.currentTarget })}
                      aria-label={`Autres actions pour « ${file.name} »`}
                      sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <FileThumbnail kind={file.kind} />
                  <Box sx={{ p: 1.25 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.meta}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table size="small" aria-label={`Fichiers — ${section.label}`}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell padding="checkbox" />
                    <TableCell>Nom</TableCell>
                    <TableCell>Détails</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={selectedIds.has(file.id)}
                          onChange={() => toggleSelected(file.id)}
                          slotProps={{ input: { 'aria-label': `Sélectionner « ${file.name} »` } }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{file.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{file.meta}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(event) => setFileMenu({ id: file.id, anchorEl: event.currentTarget })} aria-label={`Autres actions pour « ${file.name} »`}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      <Menu anchorEl={fileMenu?.anchorEl} open={fileMenu !== null} onClose={closeFileMenu}>
        <MenuItem onClick={() => activeMenuFile && downloadFile(activeMenuFile)}>
          <ListItemIcon>
            <DownloadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Télécharger
        </MenuItem>
        <MenuItem onClick={() => activeMenuFile && openRename(activeMenuFile)}>
          <ListItemIcon>
            <DriveFileRenameOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Renommer
        </MenuItem>
        <MenuItem onClick={() => activeMenuFile && moveToTrash(activeMenuFile)}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          Déplacer vers la corbeille
        </MenuItem>
      </Menu>

      <Dialog open={newFolderOpen} onClose={() => setNewFolderOpen(false)} aria-labelledby="new-folder-title" maxWidth="xs" fullWidth>
        <DialogTitle id="new-folder-title">Nouveau dossier</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nom du dossier"
            value={newFolderName}
            onChange={(event) => setNewFolderName(event.target.value)}
            sx={{ mt: 0.5 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setNewFolderOpen(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={createFolder} disabled={!newFolderName.trim()}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={renameTarget !== null} onClose={() => setRenameTarget(null)} aria-labelledby="rename-file-title" maxWidth="xs" fullWidth>
        <DialogTitle id="rename-file-title">Renommer le fichier</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Nom du fichier" value={renameValue} onChange={(event) => setRenameValue(event.target.value)} sx={{ mt: 0.5 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setRenameTarget(null)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={confirmRename} disabled={!renameValue.trim()}>
            Renommer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={trashOpen} onClose={() => setTrashOpen(false)} aria-labelledby="trash-title" maxWidth="sm" fullWidth>
        <DialogTitle id="trash-title">Corbeille</DialogTitle>
        <DialogContent>
          {trashedFiles.length === 0 ? (
            <DialogContentText>La corbeille est vide.</DialogContentText>
          ) : (
            <Stack spacing={1}>
              {trashedFiles.map((file) => (
                <Stack
                  key={file.id}
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.meta}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                    <Tooltip title="Restaurer">
                      <IconButton size="small" onClick={() => restoreFromTrash(file)} aria-label={`Restaurer « ${file.name} »`}>
                        <RestoreFromTrashOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer définitivement">
                      <IconButton size="small" onClick={() => deleteForever(file)} aria-label={`Supprimer définitivement « ${file.name} »`}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setTrashOpen(false)}>
            Fermer
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
