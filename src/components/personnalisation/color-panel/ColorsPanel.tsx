'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { SectionAccordion } from '@/components/personnalisation/color-panel/SectionAccordion';
import { GeneralAppearanceSection } from '@/components/personnalisation/color-panel/GeneralAppearanceSection';
import { HeaderNavigationSection } from '@/components/personnalisation/color-panel/HeaderNavigationSection';
import { FooterSection } from '@/components/personnalisation/color-panel/FooterSection';
import { InternalHeaderSection } from '@/components/personnalisation/color-panel/InternalHeaderSection';
import { ModuleOverridesAccordion } from '@/components/personnalisation/color-panel/ModuleOverridesAccordion';

export function ColorsPanel() {
  const { moduleCoexistenceMessage, dismissModuleCoexistenceMessage, openModuleAccordion } = usePersonnalisation();

  function handleSeeModules() {
    openModuleAccordion();
    dismissModuleCoexistenceMessage();
  }

  return (
    <Box>
      <Stack spacing={1.5} sx={{ p: 2 }}>
        <SectionAccordion
          section="general"
          label="Apparence générale"
          infoText="Fond de page, texte courant, liens et boutons utilisés sur l'ensemble du site."
          defaultExpanded
        >
          <GeneralAppearanceSection />
        </SectionAccordion>
        <SectionAccordion
          section="header"
          label="En-tête et menu de navigation"
          infoText="Bandeau supérieur, menu déroulant, recherche et boutons de l'en-tête."
        >
          <HeaderNavigationSection />
        </SectionAccordion>
        <SectionAccordion
          section="internalHeader"
          label="En-tête de page interne"
          infoText="Bandeau affiché en haut des pages autres que l'accueil."
        >
          <InternalHeaderSection />
        </SectionAccordion>
        <SectionAccordion section="footer" label="Pied de page" infoText="Fond, titres, textes et boutons du pied de page.">
          <FooterSection />
        </SectionAccordion>

        <ModuleOverridesAccordion />
      </Stack>

      <Snackbar
        open={moduleCoexistenceMessage !== null}
        autoHideDuration={6000}
        onClose={dismissModuleCoexistenceMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={dismissModuleCoexistenceMessage}
          action={
            <Button color="inherit" size="small" onClick={handleSeeModules}>
              Voir
            </Button>
          }
          sx={{ width: '100%' }}
        >
          {moduleCoexistenceMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
