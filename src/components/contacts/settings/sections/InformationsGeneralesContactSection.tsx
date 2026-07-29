'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { ContactPageSettings } from '@/types/pagesModules';

interface SectionProps {
  settings: ContactPageSettings;
  onChange: (patch: Partial<ContactPageSettings>) => void;
}

export function InformationsGeneralesContactSection({ settings, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Nom du site"
        value={settings.siteName}
        onChange={(event) => onChange({ siteName: event.target.value })}
        fullWidth
      />
      <TextField
        label="Nom du responsable du site"
        value={settings.managerName}
        onChange={(event) => onChange({ managerName: event.target.value })}
        fullWidth
      />
      <TextField
        label="Ville / Code postal"
        value={settings.cityPostalCode}
        onChange={(event) => onChange({ cityPostalCode: event.target.value })}
        fullWidth
      />
      <TextField
        label="Adresse"
        value={settings.address}
        onChange={(event) => onChange({ address: event.target.value })}
        fullWidth
      />
    </Stack>
  );
}
