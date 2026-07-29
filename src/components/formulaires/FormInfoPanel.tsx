'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { PanelShell } from '@/components/ui/PanelShell';
import type { FormBuilderData } from '@/types/formulaires';

interface FormInfoPanelProps {
  data: FormBuilderData;
  onChange: (patch: Partial<FormBuilderData>) => void;
  nameError?: boolean;
}

export function FormInfoPanel({ data, onChange, nameError }: FormInfoPanelProps) {
  return (
    <PanelShell icon="Form" title="Informations générales">
      <Stack spacing={2.5}>
        <TextField
          label="Nom du formulaire"
          value={data.name}
          onChange={(event) => onChange({ name: event.target.value.slice(0, 100) })}
          required
          fullWidth
          error={nameError}
          helperText={nameError ? 'Le nom du formulaire est obligatoire.' : `${data.name.length} / 100`}
          slotProps={{ formHelperText: { role: nameError ? 'alert' : undefined } }}
        />
        <TextField
          label="Texte du bouton de validation"
          value={data.submitButtonText}
          onChange={(event) => onChange({ submitButtonText: event.target.value.slice(0, 40) })}
          fullWidth
          helperText={`${data.submitButtonText.length} / 40`}
        />
        <TextField
          label="Phrase de validation du formulaire"
          value={data.confirmationMessage}
          onChange={(event) => onChange({ confirmationMessage: event.target.value.slice(0, 200) })}
          fullWidth
          multiline
          minRows={2}
          helperText={`${data.confirmationMessage.length} / 200 — affichée après l'envoi du formulaire`}
        />
      </Stack>
    </PanelShell>
  );
}
