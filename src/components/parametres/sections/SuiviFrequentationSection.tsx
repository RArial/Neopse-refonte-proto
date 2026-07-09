'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { SiteSettings } from '@/types/parametres';

interface SuiviFrequentationSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function SuiviFrequentationSection({ settings, onChange }: SuiviFrequentationSectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        id="parametres-field-googleAnalyticsId"
        label="Code de suivi Google Analytics"
        value={settings.googleAnalyticsId}
        onChange={(event) => onChange({ googleAnalyticsId: event.target.value })}
        placeholder="G-XXXXXXXXXX"
        fullWidth
        helperText="Identifiant de mesure Google Analytics 4 (GA4)."
        slotProps={{ input: { sx: { fontFamily: 'var(--font-geist-mono), monospace' } } }}
      />
      <TextField
        id="parametres-field-googleSearchConsoleCode"
        label="Code de validation Google Search Console"
        value={settings.googleSearchConsoleCode}
        onChange={(event) => onChange({ googleSearchConsoleCode: event.target.value })}
        fullWidth
        helperText="Valeur de la balise meta de vérification fournie par Google Search Console."
        slotProps={{ input: { sx: { fontFamily: 'var(--font-geist-mono), monospace' } } }}
      />
    </Stack>
  );
}
