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
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { InformationsGeneralesMarchesPublicsSection } from '@/components/marches-publics/settings/sections/InformationsGeneralesMarchesPublicsSection';
import { AffichageMarchesAttribuesSection } from '@/components/marches-publics/settings/sections/AffichageMarchesAttribuesSection';
import { DEFAULT_MARCHE_PUBLIC_PAGE_SETTINGS, type MarchePublicPageSettings } from '@/types/marchesPublics';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';

export function MarchePublicPageSettingsForm() {
  const [saved, setSaved] = useState<MarchePublicPageSettings>(DEFAULT_MARCHE_PUBLIC_PAGE_SETTINGS);
  const [settings, setSettings] = useState<MarchePublicPageSettings>(DEFAULT_MARCHE_PUBLIC_PAGE_SETTINGS);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(saved), [settings, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleChange(patch: Partial<MarchePublicPageSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function handleCancel() {
    setSettings(saved);
  }

  function handleSave() {
    setSaved(settings);
    setSuccessMessage('Les réglages de la page Marchés publics ont bien été enregistrés.');
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
          <Button
            component={Link}
            href="/dashboard/marches-publics"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 1, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux marchés publics
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Gérer la page marchés publics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Configurez les informations et les listes affichées sur la page Marchés publics.
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
        <SettingsSection
          icon="Briefcase"
          title="Informations générales concernant la lecture des marchés publics"
          description="Choisissez comment les informations générales sont affichées sur la page"
        >
          <InformationsGeneralesMarchesPublicsSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection
          icon="AlignJustify"
          title="Affichage des marchés publics attribués"
          description="Choisissez comment les marchés attribués sont listés sur la page"
        >
          <AffichageMarchesAttribuesSection settings={settings} onChange={handleChange} />
        </SettingsSection>
      </Box>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={isDialogOpen}
        onClose={cancelLeave}
        aria-labelledby="marche-public-settings-leave-title"
        aria-describedby="marche-public-settings-leave-description"
      >
        <DialogTitle id="marche-public-settings-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="marche-public-settings-leave-description">
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
