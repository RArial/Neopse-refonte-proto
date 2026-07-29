'use client';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PanelShell } from '@/components/ui/PanelShell';
import type { EditoFormData } from '@/types/editos';

interface PanelProps {
  data: EditoFormData;
  onChange: (patch: Partial<EditoFormData>) => void;
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
        <TextField
          label="Date de désactivation"
          type="date"
          value={data.deactivationDate}
          onChange={(event) => onChange({ deactivationDate: event.target.value })}
          fullWidth
          size="small"
          helperText="L'edito cesse d'être affiché à partir de cette date."
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Affichage en une</Typography>
          <Switch
            checked={data.featuredHome}
            onChange={(event) => onChange({ featuredHome: event.target.checked })}
            slotProps={{ input: { 'aria-label': "Affichage de l'edito en une" } }}
          />
        </Stack>
      </Stack>
    </PanelShell>
  );
}
