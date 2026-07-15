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
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { OuvertureAuPublicSection } from '@/components/parametres/sections/OuvertureAuPublicSection';
import { InformationsSiteSection } from '@/components/parametres/sections/InformationsSiteSection';
import { FaviconSection } from '@/components/parametres/sections/FaviconSection';
import { SuiviFrequentationSection } from '@/components/parametres/sections/SuiviFrequentationSection';
import { AffiliationSection } from '@/components/parametres/sections/AffiliationSection';
import { LangueSection } from '@/components/parametres/sections/LangueSection';
import { DomaineSection } from '@/components/parametres/sections/DomaineSection';
import { DEFAULT_SITE_SETTINGS, type DomainRecord, type SiteSettings } from '@/types/parametres';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';

export function ParametresForm() {
  const [saved, setSaved] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(saved), [settings, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleChange(patch: Partial<SiteSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function handleAddDomain(domain: DomainRecord) {
    setSettings((prev) => ({ ...prev, domains: [...prev.domains, domain] }));
  }

  function handleEditDomain(id: string, address: string) {
    setSettings((prev) => ({
      ...prev,
      domains: prev.domains.map((domain) => (domain.id === id ? { ...domain, address } : domain)),
    }));
  }

  function handleCancel() {
    setSettings(saved);
  }

  function handleSave() {
    setSaved(settings);
    setSuccessMessage('Les paramètres du site ont bien été enregistrés.');
  }

  return (
    <Box
      component="section"
      sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          mb: 2.5,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5, color: 'text.secondary' }}>
            <Icons.Settings size={13} />
            <Typography
              component="span"
              variant="caption"
              sx={{ fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}
            >
              Site internet
            </Typography>
          </Stack>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Paramètres
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Configurez les informations techniques et le référencement de votre site.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Button type="button" variant="outlined" color="inherit" onClick={handleCancel}>
            Annuler
          </Button>
          <Button type="button" variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <SettingsSection icon="Globe" title="Ouverture au public" description="Contrôlez l'accès public à votre site">
          <OuvertureAuPublicSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="FileText" title="Informations concernant le site" description="Titre, description et identité affichés en ligne">
          <InformationsSiteSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="Image" title="Icône du site web" description="Favicon affiché dans l'onglet du navigateur">
          <FaviconSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="TrendUp" title="Suivi de fréquentation — outils Google" description="Google Analytics et Google Search Console">
          <SuiviFrequentationSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="FileText" title="Autres types d'affiliation" description="Scripts à insérer en haut et bas de page">
          <AffiliationSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="Languages" title="Options de langue" description="Langue par défaut et configuration multilingue">
          <LangueSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="Globe" title="Nom de domaine" description="Gérez les noms de domaine associés à votre site">
          <DomaineSection domains={settings.domains} onAddDomain={handleAddDomain} onEditDomain={handleEditDomain} />
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

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="unsaved-changes-title" aria-describedby="unsaved-changes-description">
        <DialogTitle id="unsaved-changes-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="unsaved-changes-description">
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
