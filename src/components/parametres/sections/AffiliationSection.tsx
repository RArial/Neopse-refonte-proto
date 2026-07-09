'use client';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { SiteSettings } from '@/types/parametres';

interface AffiliationSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function AffiliationSection({ settings, onChange }: AffiliationSectionProps) {
  return (
    <Stack spacing={2.5}>
      <Alert severity="warning" variant="outlined">
        Réglage avancé : le code inséré ici s&apos;applique à l&apos;ensemble des pages du site. Une erreur peut affecter
        son bon fonctionnement — vérifiez la provenance du code avant de l&apos;ajouter.
      </Alert>
      <TextField
        id="parametres-field-headerScript"
        label="Code inséré en haut de page (avant </head>)"
        value={settings.headerScript}
        onChange={(event) => onChange({ headerScript: event.target.value })}
        multiline
        minRows={4}
        fullWidth
        slotProps={{ input: { sx: { fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 } } }}
      />
      <TextField
        id="parametres-field-footerScript"
        label="Code inséré en bas de page (avant &lt;/body&gt;)"
        value={settings.footerScript}
        onChange={(event) => onChange({ footerScript: event.target.value })}
        multiline
        minRows={4}
        fullWidth
        slotProps={{ input: { sx: { fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 } } }}
      />
    </Stack>
  );
}
