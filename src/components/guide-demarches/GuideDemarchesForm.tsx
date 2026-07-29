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
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { DEFAULT_GUIDE_DEMARCHES, FRENCH_DEPARTMENTS, type GuideDemarchesData } from '@/types/guideDemarches';

export function GuideDemarchesForm() {
  const [saved, setSaved] = useState<GuideDemarchesData>(DEFAULT_GUIDE_DEMARCHES);
  const [data, setData] = useState<GuideDemarchesData>(DEFAULT_GUIDE_DEMARCHES);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(saved), [data, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleChange(patch: Partial<GuideDemarchesData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleCancel() {
    setData(saved);
  }

  function handleSave() {
    setSaved(data);
    setSuccessMessage('Le guide des démarches a bien été enregistré.');
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
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
            Guide des démarches
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Configurez le guide des démarches administratives affiché sur votre site.
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
        <SettingsSection icon="FileText" title="Informations générales" description="Présentation générale du guide des démarches" collapsible={false}>
          <RichTextField
            label="Informations générales"
            value={data.generalInfo}
            onChange={(generalInfo) => handleChange({ generalInfo })}
            placeholder="Présentez le guide des démarches administratives…"
          />
        </SettingsSection>

        <SettingsSection icon="MapPin" title="Données de géolocalisation du guide" description="Département et code INSEE (COG) de rattachement" collapsible={false}>
          <Stack spacing={2.5}>
            <TextField select label="Département" value={data.department} onChange={(event) => handleChange({ department: event.target.value })} fullWidth sx={{ maxWidth: 340 }}>
              <MenuItem value="">Aucune sélection</MenuItem>
              {FRENCH_DEPARTMENTS.map((department) => (
                <MenuItem key={department.code} value={department.code}>
                  {department.code} — {department.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Code INSEE (COG)"
              placeholder="Ex. 75056"
              value={data.cogCode}
              onChange={(event) => handleChange({ cogCode: event.target.value })}
              fullWidth
              sx={{ maxWidth: 340 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <Tooltip title="Code Officiel Géographique (COG) de l'INSEE identifiant votre commune.">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  ),
                },
              }}
            />
          </Stack>
        </SettingsSection>

        <SettingsSection icon="Grid" title="Widget démarches administratives" description="Vignette et bouton affichés dans le widget" collapsible={false}>
          <Stack spacing={2.5}>
            <VignetteUploader value={data.widgetThumbnailUrl} onChange={(widgetThumbnailUrl) => handleChange({ widgetThumbnailUrl })} itemLabel="vignette" />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Affichage du bouton dans le widget</Typography>
              <Switch
                checked={data.showWidgetButton}
                onChange={(event) => handleChange({ showWidgetButton: event.target.checked })}
                slotProps={{ input: { 'aria-label': 'Affichage du bouton dans le widget' } }}
              />
            </Stack>
          </Stack>
        </SettingsSection>
      </Box>

      <Snackbar open={successMessage !== null} autoHideDuration={4000} onClose={() => setSuccessMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="guide-demarches-leave-title" aria-describedby="guide-demarches-leave-description">
        <DialogTitle id="guide-demarches-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="guide-demarches-leave-description">
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
