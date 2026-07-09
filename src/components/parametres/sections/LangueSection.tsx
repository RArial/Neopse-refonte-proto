'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LANGUAGE_OPTIONS, type SiteSettings, type TraductionMode } from '@/types/parametres';

interface LangueSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function LangueSection({ settings, onChange }: LangueSectionProps) {
  function handleSpecificLanguagesChange(event: SelectChangeEvent<string[]>) {
    const value = event.target.value;
    onChange({ specificLanguages: typeof value === 'string' ? value.split(',') : value });
  }

  return (
    <Stack spacing={2.5}>
      <TextField
        id="parametres-field-defaultLanguage"
        select
        label="Langue par défaut"
        value={settings.defaultLanguage}
        onChange={(event) => onChange({ defaultLanguage: event.target.value })}
        fullWidth
        helperText="Langue utilisée par défaut pour les visiteurs du site."
      >
        {LANGUAGE_OPTIONS.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Site multilingue
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            variant="body2"
            color={settings.multilingual ? 'text.primary' : 'text.secondary'}
            sx={{ fontWeight: settings.multilingual ? 600 : 400 }}
          >
            {settings.multilingual ? 'Activé' : 'Désactivé'}
          </Typography>
          <Switch
            checked={settings.multilingual}
            onChange={(event) => onChange({ multilingual: event.target.checked })}
            slotProps={{
              input: { 'aria-label': `Site multilingue : ${settings.multilingual ? 'activé' : 'désactivé'}` },
            }}
          />
        </Stack>
      </Stack>

      {settings.multilingual && (
        <Box>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              Traduction
            </FormLabel>
            <RadioGroup
              value={settings.traductionMode}
              onChange={(event) => onChange({ traductionMode: event.target.value as TraductionMode })}
            >
              <FormControlLabel value="all" control={<Radio />} label="Toutes les langues" />
              <FormControlLabel value="specific" control={<Radio />} label="Langues spécifiques" />
            </RadioGroup>
          </FormControl>

          {settings.traductionMode === 'specific' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="parametres-field-specificLanguages-label">Langues à traduire</InputLabel>
              <Select
                labelId="parametres-field-specificLanguages-label"
                id="parametres-field-specificLanguages"
                multiple
                value={settings.specificLanguages}
                onChange={handleSpecificLanguagesChange}
                input={<OutlinedInput label="Langues à traduire" />}
                renderValue={(selected) => (
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((code) => (
                      <Chip key={code} size="small" label={LANGUAGE_OPTIONS.find((l) => l.code === code)?.label ?? code} />
                    ))}
                  </Stack>
                )}
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      )}
    </Stack>
  );
}
