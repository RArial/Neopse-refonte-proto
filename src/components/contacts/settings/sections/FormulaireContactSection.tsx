'use client';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { MANAGER_SECTIONS } from '@/types/gestionnaire';
import { CONTACTS_MOCK, type ContactPageSettings } from '@/types/pagesModules';

const SITE_FORMS = MANAGER_SECTIONS.find((section) => section.id === 'formulaires')?.files.filter((file) => file.kind === 'form') ?? [];

interface SectionProps {
  settings: ContactPageSettings;
  onChange: (patch: Partial<ContactPageSettings>) => void;
}

export function FormulaireContactSection({ settings, onChange }: SectionProps) {
  function toggleRecipient(contactId: string) {
    const isSelected = settings.formRecipientContactIds.includes(contactId);
    onChange({
      formRecipientContactIds: isSelected
        ? settings.formRecipientContactIds.filter((id) => id !== contactId)
        : [...settings.formRecipientContactIds, contactId],
    });
  }

  return (
    <Stack spacing={2.5}>
      <Stack spacing={1}>
        <FormLabel component="legend" sx={{ fontSize: 13 }}>
          Contacts destinataires du formulaire
        </FormLabel>
        <FormGroup>
          {CONTACTS_MOCK.map((contact) => (
            <FormControlLabel
              key={contact.id}
              control={
                <Checkbox
                  checked={settings.formRecipientContactIds.includes(contact.id)}
                  onChange={() => toggleRecipient(contact.id)}
                />
              }
              label={contact.name}
            />
          ))}
        </FormGroup>
      </Stack>

      <TextField
        select
        label="Formulaire"
        value={settings.formId}
        onChange={(event) => onChange({ formId: event.target.value })}
        fullWidth
        helperText="Formulaire affiché sur la page Contacts, parmi ceux créés dans le gestionnaire de formulaires."
      >
        <MenuItem value="">Aucune sélection</MenuItem>
        {SITE_FORMS.map((form) => (
          <MenuItem key={form.id} value={form.id}>
            {form.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Nom du bouton"
        value={settings.submitButtonLabel}
        onChange={(event) => onChange({ submitButtonLabel: event.target.value })}
        fullWidth
      />
    </Stack>
  );
}
