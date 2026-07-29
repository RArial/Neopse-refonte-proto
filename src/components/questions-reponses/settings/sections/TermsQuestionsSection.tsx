'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { RichTextField } from '@/components/ui/RichTextField';
import type { QuestionsPageSettings } from '@/types/questionsReponses';

interface SectionProps {
  settings: QuestionsPageSettings;
  onChange: (patch: Partial<QuestionsPageSettings>) => void;
}

export function TermsQuestionsSection({ settings, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Texte d'introduction des conditions d'utilisation"
        value={settings.termsIntroText}
        onChange={(event) => onChange({ termsIntroText: event.target.value })}
        multiline
        minRows={2}
        fullWidth
      />
      <RichTextField
        label="Texte des conditions d'utilisation"
        value={settings.termsText}
        onChange={(termsText) => onChange({ termsText })}
        placeholder="Rédigez les conditions d'utilisation du module questions/réponses…"
        minHeight={200}
      />
    </Stack>
  );
}
