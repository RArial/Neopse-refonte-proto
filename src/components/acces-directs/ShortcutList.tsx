'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { SEED_MODULES } from '@/lib/navTree';
import { Icons } from '@/components/ui/Icons';
import { SHORTCUTS_MOCK, type Shortcut } from '@/types/pagesModules';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

type TabView = 'published' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function duplicateHref(name: string): string {
  return `/dashboard/acces-directs/nouveau?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

function destinationLabel(shortcut: Shortcut): string {
  if (shortcut.linkType === 'external') return shortcut.externalUrl || '—';
  if (shortcut.linkType === 'internal') {
    const target = SEED_MODULES.find((module) => module.id === shortcut.internalTargetId);
    return target?.label ?? '—';
  }
  return '—';
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

interface SortableShortcutRowProps {
  shortcut: Shortcut;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

function SortableShortcutRow({ shortcut, onArchive, onRestore, onDelete }: SortableShortcutRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: shortcut.id });
  const IconEl = shortcut.icon ? Icons[shortcut.icon] : null;

  return (
    <TableRow
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        position: isDragging ? 'relative' : undefined,
        zIndex: isDragging ? 1 : undefined,
        bgcolor: isDragging ? 'action.hover' : undefined,
      }}
    >
      <TableCell sx={{ width: 40, px: 1 }}>
        <Tooltip title="Glisser pour réordonner">
          <Box
            {...attributes}
            {...listeners}
            aria-label={`Déplacer « ${shortcut.name} »`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.disabled',
              cursor: 'grab',
              touchAction: 'none',
              '&:active': { cursor: 'grabbing' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 1 },
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ fontWeight: 700 }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              bgcolor: shortcut.color || 'action.hover',
              color: shortcut.color ? '#fff' : 'text.secondary',
            }}
          >
            {IconEl && <IconEl size={16} />}
          </Box>
          <span>{shortcut.name}</span>
        </Stack>
      </TableCell>
      <TableCell sx={{ color: 'text.secondary' }}>{destinationLabel(shortcut)}</TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title={`Modifier « ${shortcut.name} »`}>
            <IconButton component={Link} href={`/dashboard/acces-directs/${shortcut.id}`} size="small" aria-label={`Modifier « ${shortcut.name} »`}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Dupliquer « ${shortcut.name} »`}>
            <IconButton component={Link} href={duplicateHref(shortcut.name)} size="small" aria-label={`Dupliquer « ${shortcut.name} »`}>
              <ContentCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {shortcut.status !== 'archived' ? (
            <Tooltip title={`Archiver « ${shortcut.name} »`}>
              <IconButton size="small" onClick={onArchive} aria-label={`Archiver « ${shortcut.name} »`}>
                <Inventory2OutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title={`Rétablir « ${shortcut.name} »`}>
                <IconButton size="small" onClick={onRestore} aria-label={`Rétablir « ${shortcut.name} »`}>
                  <RestoreFromTrashOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Supprimer définitivement « ${shortcut.name} »`}>
                <IconButton size="small" onClick={onDelete} aria-label={`Supprimer définitivement « ${shortcut.name} »`}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export function ShortcutList() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(SHORTCUTS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [shortcutToDelete, setShortcutToDelete] = useState<Shortcut | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const counts = useMemo(
    () => ({
      published: shortcuts.filter((shortcut) => shortcut.status === 'published').length,
      draft: shortcuts.filter((shortcut) => shortcut.status === 'draft').length,
      archived: shortcuts.filter((shortcut) => shortcut.status === 'archived').length,
    }),
    [shortcuts],
  );

  const filteredShortcuts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return shortcuts.filter((shortcut) => {
      if (shortcut.status !== tab) return false;
      if (trimmed && !shortcut.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [shortcuts, tab, query]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredShortcuts.findIndex((shortcut) => shortcut.id === active.id);
    const newIndex = filteredShortcuts.findIndex((shortcut) => shortcut.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filteredShortcuts, oldIndex, newIndex);
    setShortcuts((prev) => {
      const reorderedIds = new Set(reordered.map((shortcut) => shortcut.id));
      let cursor = 0;
      return prev.map((shortcut) => (reorderedIds.has(shortcut.id) ? reordered[cursor++] : shortcut));
    });
  }

  function archiveShortcut(shortcut: Shortcut) {
    setShortcuts((prev) => prev.map((candidate) => (candidate.id === shortcut.id ? { ...candidate, status: 'archived' } : candidate)));
    setSnackbarMessage(`« ${shortcut.name} » a été archivé.`);
  }

  function restoreShortcut(shortcut: Shortcut) {
    setShortcuts((prev) => prev.map((candidate) => (candidate.id === shortcut.id ? { ...candidate, status: 'draft' } : candidate)));
    setSnackbarMessage(`« ${shortcut.name} » a été rétabli en brouillon.`);
  }

  function confirmDelete() {
    if (!shortcutToDelete) return;
    setShortcuts((prev) => prev.filter((shortcut) => shortcut.id !== shortcutToDelete.id));
    setSnackbarMessage(`« ${shortcutToDelete.name} » a été supprimé définitivement.`);
    setShortcutToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Accès directs
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Ajoutez des raccourcis vers les contenus les plus consultés de votre site.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/acces-directs/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter un raccourci
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les raccourcis" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher un raccourci…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher un raccourci' },
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

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredShortcuts.map((shortcut) => shortcut.id)} strategy={verticalListSortingStrategy}>
          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table aria-label={`Raccourcis — ${TAB_LABELS[tab]}`}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ width: 40 }} aria-hidden="true" />
                  <TableCell>Nom</TableCell>
                  <TableCell>Page de destination</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredShortcuts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        Aucun résultat pour des raccourcis.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShortcuts.map((shortcut) => (
                    <SortableShortcutRow
                      key={shortcut.id}
                      shortcut={shortcut}
                      onArchive={() => archiveShortcut(shortcut)}
                      onRestore={() => restoreShortcut(shortcut)}
                      onDelete={() => setShortcutToDelete(shortcut)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </SortableContext>
      </DndContext>

      <Dialog open={shortcutToDelete !== null} onClose={() => setShortcutToDelete(null)} aria-labelledby="delete-shortcut-title">
        <DialogTitle id="delete-shortcut-title">Supprimer définitivement « {shortcutToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setShortcutToDelete(null)} autoFocus>
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
        <MuiAlert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
