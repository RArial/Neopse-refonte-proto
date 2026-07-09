'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { SiteSettings } from '@/types/parametres';

interface InformationsSiteSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function InformationsSiteSection({ settings, onChange }: InformationsSiteSectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        id="parametres-field-siteTitle"
        label="Titre du site"
        value={settings.siteTitle}
        onChange={(event) => onChange({ siteTitle: event.target.value })}
        required
        fullWidth
        helperText="Nom affiché dans l'onglet du navigateur et dans les résultats de recherche."
      />
      <TextField
        id="parametres-field-searchEngineSubtitle"
        label="Sous-titre affiché dans les moteurs de recherche"
        value={settings.searchEngineSubtitle}
        onChange={(event) => onChange({ searchEngineSubtitle: event.target.value })}
        fullWidth
        helperText="Complète le titre du site dans les résultats Google."
      />
      <TextField
        id="parametres-field-metaDescription"
        label="Description du site (balise meta description)"
        value={settings.metaDescription}
        onChange={(event) => onChange({ metaDescription: event.target.value })}
        multiline
        minRows={3}
        fullWidth
        helperText="Environ 150 à 160 caractères recommandés pour un affichage optimal dans les résultats de recherche."
      />
      <TextField
        id="parametres-field-metaKeywords"
        label="Mots-clés (balise meta keywords)"
        value={settings.metaKeywords}
        onChange={(event) => onChange({ metaKeywords: event.target.value })}
        fullWidth
        helperText="Séparez chaque mot-clé par une virgule."
      />
      <TextField
        id="parametres-field-notFoundPage"
        label="Page d'erreur 404"
        value={settings.notFoundPage}
        onChange={(event) => onChange({ notFoundPage: event.target.value })}
        fullWidth
        helperText="Page affichée lorsque l'adresse demandée par un visiteur n'existe pas."
      />
    </Stack>
  );
}
