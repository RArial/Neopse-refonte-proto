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
import { ALERTS_MOCK, type Alert } from '@/types/alertes';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

type TabView = 'published' | 'scheduled' | 'draft' | 'archived';

const TAB_LABELS: Record<TabView, string> = {
  published: 'Publiées',
  scheduled: 'Programmées',
  draft: 'Brouillons',
  archived: 'Archivées',
};

function tabForAlert(alert: Alert): TabView {
  if (alert.status !== 'published') return alert.status;
  return isScheduledPublication(alert.status, alert.publicationDate) ? 'scheduled' : 'published';
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

export function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS_MOCK);
  const [tab, setTab] = useState<TabView>('published');
  const [query, setQuery] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

  const counts = useMemo(
    () => ({
      published: alerts.filter((a) => tabForAlert(a) === 'published').length,
      scheduled: alerts.filter((a) => tabForAlert(a) === 'scheduled').length,
      draft: alerts.filter((a) => a.status === 'draft').length,
      archived: alerts.filter((a) => a.status === 'archived').length,
    }),
    [alerts],
  );

  const filteredAlerts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return alerts.filter((alert) => {
      if (tabForAlert(alert) !== tab) return false;
      if (trimmed && !alert.name.toLowerCase().includes(trimmed)) return false;
      return true;
    });
  }, [alerts, tab, query]);

  function archiveAlert(alert: Alert) {
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status: 'archived' } : a)));
    setSnackbarMessage(`« ${alert.name} » a été archivée.`);
  }

  function restoreAlert(alert: Alert) {
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status: 'draft' } : a)));
    setSnackbarMessage(`« ${alert.name} » a été restaurée en brouillon.`);
  }

  function confirmDelete() {
    if (!alertToDelete) return;
    setAlerts((prev) => prev.filter((a) => a.id !== alertToDelete.id));
    setSnackbarMessage(`« ${alertToDelete.name} » a été supprimée définitivement.`);
    setAlertToDelete(null);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Alertes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Diffusez des messages d&apos;alerte prioritaires sur votre site.
          </Typography>
        </Box>
        <Button component={Link} href="/dashboard/alertes/nouveau" variant="contained" startIcon={<AddOutlinedIcon fontSize="small" />}>
          Ajouter une alerte
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 1 }}>
        <Tabs value={tab} onChange={(_, value: TabView) => setTab(value)} aria-label="Filtrer les alertes" sx={{ minHeight: 44 }}>
          <Tab value="published" label={<TabLabel text={TAB_LABELS.published} count={counts.published} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="scheduled" label={<TabLabel text={TAB_LABELS.scheduled} count={counts.scheduled} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="draft" label={<TabLabel text={TAB_LABELS.draft} count={counts.draft} />} sx={{ minHeight: 44, textTransform: 'none' }} />
          <Tab value="archived" label={<TabLabel text={TAB_LABELS.archived} count={counts.archived} />} sx={{ minHeight: 44, textTransform: 'none' }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Rechercher une alerte…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une alerte' },
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
        <Table aria-label={`Alertes — ${TAB_LABELS[tab]}`}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune alerte ne correspond à cette vue.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{alert.name}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={`Modifier « ${alert.name} »`}>
                        <IconButton component={Link} href={`/dashboard/alertes/edit/${alert.id}`} size="small" aria-label={`Modifier « ${alert.name} »`}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {alert.status === 'archived' ? (
                        <>
                          <Tooltip title={`Restaurer « ${alert.name} »`}>
                            <IconButton size="small" onClick={() => restoreAlert(alert)} aria-label={`Restaurer « ${alert.name} »`}>
                              <RestoreFromTrashOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Supprimer définitivement « ${alert.name} »`}>
                            <IconButton
                              size="small"
                              onClick={() => setAlertToDelete(alert)}
                              aria-label={`Supprimer définitivement « ${alert.name} »`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={`Archiver « ${alert.name} »`}>
                          <IconButton size="small" onClick={() => archiveAlert(alert)} aria-label={`Archiver « ${alert.name} »`}>
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

      <Dialog open={alertToDelete !== null} onClose={() => setAlertToDelete(null)} aria-labelledby="delete-alert-title">
        <DialogTitle id="delete-alert-title">Supprimer définitivement « {alertToDelete?.name} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est définitive et ne peut pas être annulée.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setAlertToDelete(null)} autoFocus>
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
