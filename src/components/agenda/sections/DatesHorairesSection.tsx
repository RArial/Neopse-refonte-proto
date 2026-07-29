'use client';

import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { EventFormData } from '@/types/agenda';

interface SectionProps {
  data: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
}

export function DatesHorairesSection({ data, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <RadioGroup
        row
        aria-label="Type d'événement"
        value={data.scheduleType}
        onChange={(event) => onChange({ scheduleType: event.target.value as EventFormData['scheduleType'] })}
      >
        <FormControlLabel value="ponctuel" control={<Radio />} label="Ponctuel" />
        <FormControlLabel value="recurrent" control={<Radio />} label="Récurrent" />
      </RadioGroup>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
        <TextField
          label="Date de début"
          type="date"
          value={data.dateStart}
          onChange={(event) => onChange({ dateStart: event.target.value })}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Heure de début"
          type="time"
          value={data.timeStart}
          onChange={(event) => onChange({ timeStart: event.target.value })}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
        <TextField
          label="Date de fin (facultatif)"
          type="date"
          value={data.dateEnd}
          onChange={(event) => onChange({ dateEnd: event.target.value })}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Heure de fin (facultatif)"
          type="time"
          value={data.timeEnd}
          onChange={(event) => onChange({ timeEnd: event.target.value })}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>
    </Stack>
  );
}
