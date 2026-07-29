'use client';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import type { LegalField } from '@/types/legal';

interface InlineLegalFieldProps {
  field: LegalField;
  value: string;
  onChange: (value: string) => void;
  missing: boolean;
  /** Ancre DOM utilisée par « Aller au premier champ manquant » pour scroller jusqu'au champ. */
  id?: string;
}

/** Un champ variable rendu au fil du texte réglementaire — fond léger, bordure warning + pastille
 * si obligatoire et non rempli (jamais l'info par la seule couleur : voir l'aria-label). */
export function InlineLegalField({ field, value, onChange, missing, id }: InlineLegalFieldProps) {
  const label = field.help ? `${field.label} — ${field.help}` : field.label;
  const accessibleLabel = missing ? `${label} — champ obligatoire non renseigné` : label;

  return (
    <Tooltip title={label}>
      <Box
        component="span"
        id={id}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          verticalAlign: 'middle',
          mx: 0.25,
          px: 1,
          borderRadius: 1,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.07),
          border: '1px solid',
          borderColor: missing ? 'warning.main' : 'transparent',
          '&:focus-within': { borderColor: 'primary.main' },
        }}
      >
        {renderControl(field, value, onChange, accessibleLabel)}
        {missing && (
          <Box
            component="span"
            aria-hidden="true"
            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main', flexShrink: 0 }}
          />
        )}
      </Box>
    </Tooltip>
  );
}

function renderControl(field: LegalField, value: string, onChange: (value: string) => void, accessibleLabel: string) {
  const { type } = field;

  if (type.input === 'choice') {
    if (type.options.length <= 2) {
      return (
        <RadioGroup
          row
          aria-label={accessibleLabel}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          sx={{ my: -0.5 }}
        >
          {type.options.map((option) => (
            <FormControlLabel key={option} value={option} control={<Radio size="small" />} label={option} sx={{ mr: 1.5 }} />
          ))}
        </RadioGroup>
      );
    }
    return (
      <TextField
        select
        variant="standard"
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{ input: { disableUnderline: true }, htmlInput: { 'aria-label': accessibleLabel } }}
        sx={{ minWidth: 180 }}
      >
        {type.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (type.input === 'number') {
    return (
      <TextField
        variant="standard"
        size="small"
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          input: {
            disableUnderline: true,
            endAdornment: type.suffix ? <InputAdornment position="end">{type.suffix}</InputAdornment> : undefined,
          },
          htmlInput: { 'aria-label': accessibleLabel, min: type.min, max: type.max },
        }}
        sx={{ width: 90 }}
      />
    );
  }

  return (
    <TextField
      variant="standard"
      size="small"
      type={type.input === 'email' ? 'email' : type.input === 'url' ? 'url' : 'text'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ input: { disableUnderline: true }, htmlInput: { 'aria-label': accessibleLabel } }}
      sx={{ minWidth: 200 }}
    />
  );
}
