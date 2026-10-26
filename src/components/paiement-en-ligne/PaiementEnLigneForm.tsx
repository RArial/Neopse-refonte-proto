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
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { DEFAULT_PAIEMENT_EN_LIGNE, type PaiementEnLigneData } from '@/types/paiementEnLigne';
import { BackToGestionnaireLink } from '@/components/pages-modules/BackToGestionnaireLink';

export function PaiementEnLigneForm() {
  const [saved, setSaved] = useState<PaiementEnLigneData>(DEFAULT_PAIEMENT_EN_LIGNE);
  const [data, setData] = useState<PaiementEnLigneData>(DEFAULT_PAIEMENT_EN_LIGNE);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(saved), [data, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleChange(patch: Partial<PaiementEnLigneData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleCancel() {
    setData(saved);
  }

  function handleSave() {
    setSaved(data);
    setSuccessMessage('Le paiement en ligne a bien été enregistré.');
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
            Paiement en ligne
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Configurez l&apos;accès au service de paiement en ligne affiché sur votre site.
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
        <SettingsSection icon="FileText" title="Texte" description="Présentation du service de paiement en ligne" collapsible={false}>
          <RichTextField
            label="Texte"
            value={data.text}
            onChange={(text) => handleChange({ text })}
            placeholder="Présentez le service de paiement en ligne…"
          />
        </SettingsSection>

        <SettingsSection icon="Link" title="Bouton d'accès" description="Libellé du bouton et adresse de destination" collapsible={false}>
          <Stack spacing={2.5}>
            <TextField
              label="Nom du bouton d'accès"
              value={data.buttonLabel}
              onChange={(event) => handleChange({ buttonLabel: event.target.value })}
              fullWidth
            />
            <TextField
              label="Adresse URL de destination"
              placeholder="https://…"
              value={data.destinationUrl}
              onChange={(event) => handleChange({ destinationUrl: event.target.value })}
              fullWidth
            />
          </Stack>
        </SettingsSection>

        <SettingsSection icon="Paperclip" title="Pièces jointes" description="Documents utiles liés au paiement en ligne" collapsible={false}>
          <AttachmentsField attachments={data.attachments} onChange={(attachments) => handleChange({ attachments })} />
        </SettingsSection>

        <SettingsSection icon="Grid" title="Widget démarches administratives" description="Vignette et bouton affichés dans le widget" collapsible={false}>
          <Stack spacing={2.5}>
            <VignetteUploader folder="Paiement en ligne" value={data.widgetThumbnailUrl} onChange={(widgetThumbnailUrl) => handleChange({ widgetThumbnailUrl })} itemLabel="vignette" />
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

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="paiement-en-ligne-leave-title" aria-describedby="paiement-en-ligne-leave-description">
        <DialogTitle id="paiement-en-ligne-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="paiement-en-ligne-leave-description">
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
