'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { QuestionsPageSettings } from '@/types/questionsReponses';

interface SectionProps {
  settings: QuestionsPageSettings;
  onChange: (patch: Partial<QuestionsPageSettings>) => void;
}

export function ParticipationQuestionsSection({ settings, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Aide à la participation"
        value={settings.participationHelp}
        onChange={(event) => onChange({ participationHelp: event.target.value })}
        multiline
        minRows={3}
        fullWidth
        helperText="Conseils affichés au-dessus du formulaire pour guider la rédaction d'une question."
      />
      <TextField
        label="Phrase de validation du formulaire"
        value={settings.validationMessage}
        onChange={(event) => onChange({ validationMessage: event.target.value })}
        multiline
        minRows={2}
        fullWidth
        helperText="Message affiché une fois la question envoyée."
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
        <TextField
          label="Nom du bouton de validation"
          value={settings.submitButtonLabel}
          onChange={(event) => onChange({ submitButtonLabel: event.target.value })}
          fullWidth
        />
        <TextField
          label="Nom du bouton de fermeture"
          value={settings.closeButtonLabel}
          onChange={(event) => onChange({ closeButtonLabel: event.target.value })}
          fullWidth
        />
      </Stack>
    </Stack>
  );
}
