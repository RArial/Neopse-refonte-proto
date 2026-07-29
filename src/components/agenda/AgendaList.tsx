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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import SearchIcon from '@mui/icons-material/Search';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import { isScheduledPublication } from '@/lib/publicationSchedule';
import { AGENDA_EVENTS, type AgendaEvent, type EventStatus } from '@/types/agenda';

type TabView = EventStatus | 'scheduled';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Actifs',
  scheduled: 'Programmés',
  draft: 'Brouillons',
  archived: 'Archivés',
};

function tabForEvent(event: AgendaEvent): TabView {
  if (event.status !== 'published') return event.status;
  return isScheduledPublication(event.status, event.publicationDate) ? 'scheduled' : 'published';
}

function formatFrDate(iso: string) {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

function formatDateRange(event: AgendaEvent) {
  const start = formatFrDate(event.dateStart);
  return event.dateEnd ? `${start} - ${formatFrDate(event.dateEnd)}` : start;
}

function duplicateHref(name: string): string {
  return `/dashboard/agenda/nouveau?copyName=${encodeURIComponent(`${name} (copie)`)}`;
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function AgendaList() {
  const [events, setEvents] = useState<AgendaEvent[]>(AGENDA_EVENTS);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<AgendaEvent | null>(null);

  const filteredEvents = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return events.filter((event) => tabForEvent(event) === tab && (!trimmed || event.name.toLowerCase().includes(trimmed)));
  }, [events, tab, query]);

  const counts = useMemo(
    () => ({
      published: events.filter((e) => tabForEvent(e) === 'published').length,
      scheduled: events.filter((e) => tabForEvent(e) === 'scheduled').length,
      draft: events.filter((e) => e.status === 'draft').length,
      archived: events.filter((e) => e.status === 'archived').length,
    }),
    [events],
  );

  function updateStatus(id: string, status: EventStatus, message: string) {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, status } : event)));
    setSnackbarMessage(message);
  }

  function confirmDelete() {
    if (!eventToDelete) return;
    const suffix = eventToDelete.status === 'archived' ? ' définitivement' : '';
    setEvents((prev) => prev.filter((event) => event.id !== eventToDelete.id));
    setSnackbarMessage(`« ${eventToDelete.name} » a été supprimé${suffix}.`);
    setEventToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Agenda
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Gérez les événements diffusés sur votre site NEOPSE.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            size="small"
            placeholder="Recherche"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ minWidth: 220 }}
            slotProps={{
              htmlInput: { 'aria-label': 'Rechercher un événement' },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button component={Link} href="/dashboard/agenda/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
            Ajouter un événement
          </Button>
        </Stack>
      </Stack>

      <Tabs
        value={tab}
        onChange={(_, value: TabView) => setTab(value)}
        aria-label="Statut des événements"
        sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', minHeight: 44 }}
      >
        <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
      </Tabs>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table aria-label={`Événements — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom</TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <span>Date(s)</span>
                  <Tooltip title="Plage de dates pendant laquelle l'événement est affiché sur le site.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
              </TableCell>
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucun événement dans « {TAB_LABELS[tab]} ».
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => {
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {event.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDateRange(event)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title={`Modifier « ${event.name} »`}>
                          <IconButton
                            component={Link}
                            href={`/dashboard/agenda/edit/${event.id}`}
                            size="small"
                            aria-label={`Modifier « ${event.name} »`}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Dupliquer « ${event.name} »`}>
                          <IconButton component={Link} href={duplicateHref(event.name)} size="small" aria-label={`Dupliquer « ${event.name} »`}>
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {event.status === 'published' && (
                          <Tooltip title={`Archiver « ${event.name} »`}>
                            <IconButton
                              size="small"
                              onClick={() => updateStatus(event.id, 'archived', `« ${event.name} » a été archivé.`)}
                              aria-label={`Archiver « ${event.name} »`}
                            >
                              <InventoryOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {event.status === 'draft' && (
                          <>
                            <Tooltip title={`Publier « ${event.name} »`}>
                              <IconButton
                                size="small"
                                onClick={() => updateStatus(event.id, 'published', `« ${event.name} » a été publié.`)}
                                aria-label={`Publier « ${event.name} »`}
                              >
                                <PublishOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Supprimer « ${event.name} »`}>
                              <IconButton size="small" onClick={() => setEventToDelete(event)} aria-label={`Supprimer « ${event.name} »`}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {event.status === 'archived' && (
                          <>
                            <Tooltip title={`Rétablir « ${event.name} »`}>
                              <IconButton
                                size="small"
                                onClick={() => updateStatus(event.id, 'published', `« ${event.name} » a été rétabli.`)}
                                aria-label={`Rétablir « ${event.name} »`}
                              >
                                <UnarchiveOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Supprimer définitivement « ${event.name} »`}>
                              <IconButton
                                size="small"
                                onClick={() => setEventToDelete(event)}
                                aria-label={`Supprimer définitivement « ${event.name} »`}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
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

      <Dialog open={eventToDelete !== null} onClose={() => setEventToDelete(null)} aria-labelledby="delete-event-title">
        <DialogTitle id="delete-event-title">
          {eventToDelete?.status === 'archived' ? 'Supprimer définitivement' : 'Supprimer'} « {eventToDelete?.name} » ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setEventToDelete(null)} autoFocus>
            Annuler
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            {eventToDelete?.status === 'archived' ? 'Supprimer définitivement' : 'Supprimer'}
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
