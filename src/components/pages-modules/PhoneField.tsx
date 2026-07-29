'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PHONE_COUNTRIES } from '@/types/profil';

interface PhoneFieldProps {
  id: string;
  country: string;
  number: string;
  onCountryChange: (country: string) => void;
  onNumberChange: (number: string) => void;
  label?: string;
}

export function PhoneField({ id, country, number, onCountryChange, onNumberChange, label = 'Téléphone' }: PhoneFieldProps) {
  return (
    <Box>
      <Typography component="label" htmlFor={id} variant="body2" sx={{ display: 'block', mb: 0.75, fontWeight: 500 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1.5}>
        <TextField
          select
          value={country}
          onChange={(event) => onCountryChange(event.target.value)}
          sx={{ minWidth: 160 }}
          slotProps={{ select: { 'aria-label': `Indicatif téléphonique du pays — ${label}` } }}
        >
          {PHONE_COUNTRIES.map((c) => (
            <MenuItem key={c.code} value={c.code}>
              {c.label.toUpperCase()} ({c.dial})
            </MenuItem>
          ))}
        </TextField>
        <TextField id={id} type="tel" value={number} onChange={(event) => onNumberChange(event.target.value)} fullWidth />
      </Stack>
    </Box>
  );
}
