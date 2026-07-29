'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PHONE_COUNTRIES } from '@/types/profil';
import type { EventFormData } from '@/types/agenda';

interface SectionProps {
  data: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
}

export function OrganisateurSection({ data, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
        <TextField
          label="Nom de l'organisateur"
          value={data.organizerName}
          onChange={(event) => onChange({ organizerName: event.target.value })}
          fullWidth
        />
        <TextField
          label="Adresse email de contact"
          type="email"
          value={data.organizerEmail}
          onChange={(event) => onChange({ organizerEmail: event.target.value })}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
        <Box sx={{ flex: 1 }}>
          <Typography component="label" htmlFor="event-field-organizer-phone" variant="body2" sx={{ display: 'block', mb: 0.75, fontWeight: 500 }}>
            Téléphone
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <TextField
              select
              value={data.organizerPhoneCountry}
              onChange={(event) => onChange({ organizerPhoneCountry: event.target.value })}
              sx={{ minWidth: 160 }}
              slotProps={{ select: { 'aria-label': 'Indicatif téléphonique du pays' } }}
            >
              {PHONE_COUNTRIES.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.label.toUpperCase()} ({country.dial})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="event-field-organizer-phone"
              type="tel"
              value={data.organizerPhoneNumber}
              onChange={(event) => onChange({ organizerPhoneNumber: event.target.value })}
              fullWidth
            />
          </Stack>
        </Box>
        <TextField
          label="Site Internet"
          placeholder="https://"
          value={data.organizerWebsite}
          onChange={(event) => onChange({ organizerWebsite: event.target.value })}
          fullWidth
        />
      </Stack>
    </Stack>
  );
}
