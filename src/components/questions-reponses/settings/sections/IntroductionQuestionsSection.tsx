'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { RichTextField } from '@/components/ui/RichTextField';
import type { QuestionsPageSettings } from '@/types/questionsReponses';

interface SectionProps {
  settings: QuestionsPageSettings;
  onChange: (patch: Partial<QuestionsPageSettings>) => void;
}

export function IntroductionQuestionsSection({ settings, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <RichTextField
        label="Texte d'introduction"
        value={settings.introText}
        onChange={(introText) => onChange({ introText })}
        placeholder="Présentez le module questions/réponses aux habitants…"
      />
      <TextField
        label="Nom du bouton d'accès"
        value={settings.accessButtonLabel}
        onChange={(event) => onChange({ accessButtonLabel: event.target.value })}
        fullWidth
        helperText="Bouton permettant aux habitants d'ouvrir le formulaire de question."
      />
    </Stack>
  );
}
