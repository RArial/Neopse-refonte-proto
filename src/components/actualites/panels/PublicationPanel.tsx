'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { PanelShell } from '@/components/ui/PanelShell';
import type { NewsFormData } from '@/types/actualites';

interface PanelProps {
  data: NewsFormData;
  onChange: (patch: Partial<NewsFormData>) => void;
}

export function PublicationPanel({ data, onChange }: PanelProps) {
  return (
    <PanelShell icon="Calendar" title="Publication">
      <Stack spacing={2}>
        <TextField
          label="Date de publication"
          type="date"
          value={data.publicationDate}
          onChange={(event) => onChange({ publicationDate: event.target.value })}
          fullWidth
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>
    </PanelShell>
  );
}
