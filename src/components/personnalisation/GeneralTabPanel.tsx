'use client';

import Stack from '@mui/material/Stack';
import { PaletteSection } from '@/components/personnalisation/color-panel/PaletteSection';
import { SectionAccordion } from '@/components/personnalisation/color-panel/SectionAccordion';
import { GeneralAppearanceSection } from '@/components/personnalisation/color-panel/GeneralAppearanceSection';
import { HeaderNavigationSection } from '@/components/personnalisation/color-panel/HeaderNavigationSection';
import { InternalHeaderSection } from '@/components/personnalisation/color-panel/InternalHeaderSection';
import { FooterSection } from '@/components/personnalisation/color-panel/FooterSection';

export function GeneralTabPanel() {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      <PaletteSection />
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
    </Stack>
  );
}
