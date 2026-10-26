'use client';

import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { DiaporamaField } from '@/components/pages-modules/DiaporamaField';
import { CoordinatesMap } from '@/components/plan-acces/CoordinatesMap';
import { RichTextField } from '@/components/ui/RichTextField';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { DEFAULT_PLAN_ACCES, type PlanAccesData } from '@/types/planAcces';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

export function PlanAccesForm() {
  const [saved, setSaved] = useState<PlanAccesData>(DEFAULT_PLAN_ACCES);
  const [data, setData] = useState<PlanAccesData>(DEFAULT_PLAN_ACCES);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(saved), [data, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleChange(patch: Partial<PlanAccesData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleCancel() {
    setData(saved);
  }

  function handleSave() {
    setSaved(data);
    setSuccessMessage('Le plan / accès a bien été enregistré.');
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
      <BackToGestionnaireLink />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          mb: 2.5,
          pt: { xs: 2, md: 2.5 },
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Plan / Accès
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Informations de localisation et d&apos;accès affichées sur votre site.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Button type="button" variant="outlined" color="inherit" onClick={handleCancel} disabled={!isDirty}>
            Annuler
          </Button>
          <Button type="button" variant="contained" onClick={handleSave} disabled={!isDirty}>
            Enregistrer
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <SettingsSection icon="FileText" title="Informations générales" description="Présentation générale affichée sur la page Plan / Accès" collapsible={false}>
          <RichTextField
            label="Informations générales"
            value={data.generalInfo}
            onChange={(generalInfo) => handleChange({ generalInfo })}
            placeholder="Présentez l'accès à votre structure…"
          />
        </SettingsSection>

        <SettingsSection icon="MapPin" title="Localisation" description="Adresse et coordonnées géographiques" collapsible={false}>
          <Stack spacing={2.5}>
            <TextField
              label="Ville / Code postal"
              placeholder="Ex. Paris 8ème 75008, France"
              value={data.cityPostalCode}
              onChange={(event) => handleChange({ cityPostalCode: event.target.value })}
              fullWidth
            />
            <TextField label="Adresse" value={data.address} onChange={(event) => handleChange({ address: event.target.value })} fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                label="Latitude"
                placeholder="Ex. 48.87102"
                value={data.latitude}
                onChange={(event) => handleChange({ latitude: event.target.value })}
                fullWidth
              />
              <TextField
                label="Longitude"
                placeholder="Ex. 2.35952"
                value={data.longitude}
                onChange={(event) => handleChange({ longitude: event.target.value })}
                fullWidth
              />
            </Stack>
            <CoordinatesMap latitude={data.latitude} longitude={data.longitude} onChange={(latitude, longitude) => handleChange({ latitude, longitude })} />
          </Stack>
        </SettingsSection>

        <SettingsSection icon="Image" title="Diaporama d'images" description="Images illustrant l'accès à votre structure" collapsible={false}>
          <DiaporamaField
            folder="Plan d'accès"
            diaporamaType={data.diaporamaType}
            images={data.images}
            onChangeType={(diaporamaType) => handleChange({ diaporamaType })}
            onChangeImages={(images) => handleChange({ images })}
            onNotify={setSnackbarMessage}
          />
        </SettingsSection>

        <SettingsSection icon="Paperclip" title="Pièces jointes" description="Documents utiles pour se rendre sur place" collapsible={false}>
          <AttachmentsField attachments={data.attachments} onChange={(attachments) => handleChange({ attachments })} />
        </SettingsSection>
      </Box>

      <Snackbar open={successMessage !== null} autoHideDuration={4000} onClose={() => setSuccessMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={snackbarMessage !== null} autoHideDuration={4000} onClose={() => setSnackbarMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="plan-acces-leave-title" aria-describedby="plan-acces-leave-description">
        <DialogTitle id="plan-acces-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="plan-acces-leave-description">
            Des modifications n&apos;ont pas été enregistrées. Si vous quittez maintenant, elles seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={cancelLeave} color="inherit" autoFocus>
            Rester sur la page
          </Button>
          <Button onClick={confirmLeave} color="error" variant="contained">
            Quitter sans enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
