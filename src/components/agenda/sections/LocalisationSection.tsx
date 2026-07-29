'use client';

import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { EventFormData } from '@/types/agenda';

interface SectionProps {
  data: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
}

export function LocalisationSection({ data, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Ville / Code postal"
        placeholder="Ex. Paris 8ème 75008, France"
        value={data.city}
        onChange={(event) => onChange({ city: event.target.value })}
        fullWidth
      />

      <RadioGroup
        row
        aria-label="Emplacement"
        value={data.locationType}
        onChange={(event) => onChange({ locationType: event.target.value as EventFormData['locationType'] })}
      >
        <FormControlLabel value="lieu" control={<Radio />} label="Lieu" />
        <FormControlLabel value="adresse" control={<Radio />} label="Adresse simple" />
      </RadioGroup>

      <TextField
        label="Adresse"
        placeholder="Ex. Place principale"
        value={data.address}
        onChange={(event) => onChange({ address: event.target.value })}
        fullWidth
      />

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2">Affichage de la carte de localisation</Typography>
        <Switch
          checked={data.showLocationMap}
          onChange={(event) => onChange({ showLocationMap: event.target.checked })}
          slotProps={{ input: { 'aria-label': 'Affichage de la carte de localisation' } }}
        />
      </Stack>
    </Stack>
  );
}
