'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { RichTextField } from '@/components/ui/RichTextField';
import type { ContactPageSettings } from '@/types/pagesModules';

interface SectionProps {
  settings: ContactPageSettings;
  onChange: (patch: Partial<ContactPageSettings>) => void;
}

export function InformationsComplementairesContactSection({ settings, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Titre (dans la page « Contacts »)"
        value={settings.pageTitle}
        onChange={(event) => onChange({ pageTitle: event.target.value })}
        fullWidth
      />
      <RichTextField
        label="Texte (dans la page « Contacts »)"
        value={settings.pageText}
        onChange={(html) => onChange({ pageText: html })}
        placeholder="Texte affiché en introduction de la page Contacts…"
      />
      <TextField
        label="Titre du pied de page"
        value={settings.footerTitle}
        onChange={(event) => onChange({ footerTitle: event.target.value })}
        fullWidth
      />
      <RichTextField
        label="Texte (dans le pied de page)"
        value={settings.footerText}
        onChange={(html) => onChange({ footerText: html })}
        placeholder="Texte affiché dans le pied de page, sous les coordonnées de contact…"
      />
    </Stack>
  );
}
