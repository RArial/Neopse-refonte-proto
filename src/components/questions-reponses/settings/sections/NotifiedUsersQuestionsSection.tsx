'use client';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import { CONTACTS_MOCK } from '@/types/pagesModules';
import type { QuestionsPageSettings } from '@/types/questionsReponses';

interface SectionProps {
  settings: QuestionsPageSettings;
  onChange: (patch: Partial<QuestionsPageSettings>) => void;
}

export function NotifiedUsersQuestionsSection({ settings, onChange }: SectionProps) {
  function toggleContact(contactId: string) {
    const isSelected = settings.notifiedContactIds.includes(contactId);
    onChange({
      notifiedContactIds: isSelected
        ? settings.notifiedContactIds.filter((id) => id !== contactId)
        : [...settings.notifiedContactIds, contactId],
    });
  }

  return (
    <Stack spacing={1}>
      <FormLabel component="legend" sx={{ fontSize: 13 }}>
        Contacts notifiés à chaque nouvelle question
      </FormLabel>
      <FormGroup>
        {CONTACTS_MOCK.map((contact) => (
          <FormControlLabel
            key={contact.id}
            control={<Checkbox checked={settings.notifiedContactIds.includes(contact.id)} onChange={() => toggleContact(contact.id)} />}
            label={contact.name}
          />
        ))}
      </FormGroup>
    </Stack>
  );
}
