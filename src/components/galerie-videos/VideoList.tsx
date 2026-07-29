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
import { VIDEOS_MOCK, type Video } from '@/types/videos';

type TabView = 'published' | 'scheduled' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiées',
  scheduled: 'Programmées',
  draft: 'Brouillons',
  archived: 'Archivées',
};

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function formatFrLongDate(iso: string) {
  if (!iso) return '—';
  const date = new Date(`${iso}T00:00:00`);
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

function tabForVideo(video: Video): TabView {
  if (video.status !== 'published') return video.status;
  return isScheduledPublication(video.status, video.publicationDate) ? 'scheduled' : 'published';
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>(VIDEOS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const counts = useMemo(
    () => ({
      published: videos.filter((v) => tabForVideo(v) === 'published').length,
      scheduled: videos.filter((v) => tabForVideo(v) === 'scheduled').length,
      draft: videos.filter((v) => v.status === 'draft').length,
      archived: videos.filter((v) => v.status === 'archived').length,
    }),
    [videos],
  );

  const filteredVideos = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return videos.filter((video) => {
      if (tabForVideo(video) !== tab) return false;
      if (trimmed && !video.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [videos, tab, query]);

  function archiveVideo(video: Video) {
    setVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, status: 'archived' } : v)));
    setSnackbarMessage(`« ${video.name} » a été archivée.`);
  }

  function restoreVideo(video: Video) {
    setVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, status: 'draft' } : v)));
    setSnackbarMessage(`« ${video.name} » a été restaurée en brouillon.`);
  }

  function confirmDeleteVideo() {
    if (!videoToDelete) return;
    setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
    setSnackbarMessage(`« ${videoToDelete.name} » a été supprimée définitivement.`);
    setVideoToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Galerie de vidéos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Organisez vos vidéos par thématiques.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/galerie-videos/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter une vidéo
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les vidéos" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher une vidéo…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une vidéo' },
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
        <Table aria-label={`Vidéos — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom de la vidéo</TableCell>
              <TableCell>Publication</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVideos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune vidéo ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{video.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{formatFrLongDate(video.publicationDate)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${video.name} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/galerie-videos/edit/${video.id}`}
                          size="small"
                          aria-label={`Modifier « ${video.name} »`}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {video.status === 'archived' ? (
                        <>
                          <Tooltip title={`Restaurer « ${video.name} »`}>
                            <IconButton size="small" onClick={() => restoreVideo(video)} aria-label={`Restaurer « ${video.name} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${video.name} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setVideoToDelete(video)}
                              aria-label={`Supprimer définitivement « ${video.name} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={`Archiver « ${video.name} »`}>
                          <IconButton size="small" onClick={() => archiveVideo(video)} aria-label={`Archiver « ${video.name} »`}>
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

      <Dialog open={videoToDelete !== null} onClose={() => setVideoToDelete(null)} aria-labelledby="delete-video-title">
        <DialogTitle id="delete-video-title">Supprimer définitivement « {videoToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setVideoToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDeleteVideo}>
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
