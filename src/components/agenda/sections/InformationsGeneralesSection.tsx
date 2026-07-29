'use client';

import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { EVENT_CATEGORY_OPTIONS, type EventFormData } from '@/types/agenda';

interface SectionProps {
  data: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
}

export function InformationsGeneralesSection({ data, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        id="event-field-name"
        label="Nom de l'événement"
        value={data.name}
        onChange={(event) => onChange({ name: event.target.value.slice(0, 100) })}
        required
        fullWidth
        helperText={`${data.name.length} / 100`}
      />
      <TextField
        id="event-field-chapo"
        label="Chapô"
        value={data.chapo}
        onChange={(event) => onChange({ chapo: event.target.value.slice(0, 500) })}
        multiline
        minRows={2}
        fullWidth
        helperText={`${data.chapo.length} / 500`}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                <Tooltip title="Résumé court affiché sur la liste et les widgets">
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
        <TextField
          select
          label="Catégorie"
          value={data.category}
          onChange={(event) => onChange({ category: event.target.value as EventFormData['category'] })}
          fullWidth
        >
          {EVENT_CATEGORY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Tarifs"
          value={data.pricing}
          onChange={(event) => onChange({ pricing: event.target.value as EventFormData['pricing'] })}
          fullWidth
        >
          <MenuItem value="gratuit">Gratuit</MenuItem>
          <MenuItem value="payant">Payant</MenuItem>
        </TextField>
      </Stack>
      <TextField
        id="event-field-description"
        label="Description"
        placeholder="Décrivez l'événement..."
        value={data.description}
        onChange={(event) => onChange({ description: event.target.value })}
        multiline
        minRows={5}
        fullWidth
      />
    </Stack>
  );
}
