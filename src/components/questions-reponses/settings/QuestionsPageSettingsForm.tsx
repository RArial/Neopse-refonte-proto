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
import { IntroductionQuestionsSection } from '@/components/questions-reponses/settings/sections/IntroductionQuestionsSection';
import { ParticipationQuestionsSection } from '@/components/questions-reponses/settings/sections/ParticipationQuestionsSection';
import { CategoriesQuestionsSection } from '@/components/questions-reponses/settings/sections/CategoriesQuestionsSection';
import { TermsQuestionsSection } from '@/components/questions-reponses/settings/sections/TermsQuestionsSection';
import { NotifiedUsersQuestionsSection } from '@/components/questions-reponses/settings/sections/NotifiedUsersQuestionsSection';
import { DEFAULT_QUESTIONS_PAGE_SETTINGS, type QuestionsPageSettings } from '@/types/questionsReponses';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';

export function QuestionsPageSettingsForm() {
  const [saved, setSaved] = useState<QuestionsPageSettings>(DEFAULT_QUESTIONS_PAGE_SETTINGS);
  const [settings, setSettings] = useState<QuestionsPageSettings>(DEFAULT_QUESTIONS_PAGE_SETTINGS);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(saved), [settings, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleChange(patch: Partial<QuestionsPageSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function handleCancel() {
    setSettings(saved);
  }

  function handleSave() {
    setSaved(settings);
    setSuccessMessage('Les réglages de la page Questions/réponses ont bien été enregistrés.');
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
            href="/dashboard/questions-reponses"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 1, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux questions/réponses
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Gérer la page questions/réponses
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Configurez le formulaire, les catégories et les notifications du module questions/réponses.
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
        <SettingsSection icon="Message" title="Texte et bouton d'accès" description="Introduction affichée sur la page et bouton pour poser une question">
          <IntroductionQuestionsSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="FileText" title="Formulaire de participation" description="Aide, message de validation et boutons du formulaire">
          <ParticipationQuestionsSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="Tag" title="Catégories" description="Catégories proposées aux habitants lors de l'envoi d'une question">
          <CategoriesQuestionsSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="Shield" title="Conditions d'utilisation" description="Texte affiché et à accepter avant l'envoi d'une question">
          <TermsQuestionsSection settings={settings} onChange={handleChange} />
        </SettingsSection>

        <SettingsSection icon="Bell" title="Utilisateurs notifiés" description="Contacts prévenus par e-mail à chaque nouvelle question">
          <NotifiedUsersQuestionsSection settings={settings} onChange={handleChange} />
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

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="questions-settings-leave-title" aria-describedby="questions-settings-leave-description">
        <DialogTitle id="questions-settings-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="questions-settings-leave-description">
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
