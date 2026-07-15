'use client';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LANGUAGE_OPTIONS, type SiteSettings, type TraductionMode } from '@/types/parametres';

interface LangueSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function LangueSection({ settings, onChange }: LangueSectionProps) {
  const selectedLanguages = LANGUAGE_OPTIONS.filter((lang) => settings.specificLanguages.includes(lang.code));

  return (
    <Stack spacing={2.5}>
      <TextField
        id="parametres-field-defaultLanguage"
        select
        label="Langue par défaut"
        value="fr"
        disabled
        fullWidth
        helperText="Le français est la langue par défaut du site et ne peut pas être modifiée."
      >
        <MenuItem value="fr">Français</MenuItem>
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
            <Autocomplete
              multiple
              disableCloseOnSelect
              id="parametres-field-specificLanguages"
              options={LANGUAGE_OPTIONS}
              value={selectedLanguages}
              onChange={(_event, value) => onChange({ specificLanguages: value.map((lang) => lang.code) })}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              sx={{ mt: 2 }}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={uncheckedIcon}
                      checkedIcon={checkedIcon}
                      checked={selected}
                      sx={{ mr: 1 }}
                    />
                    {option.label}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Langues à traduire"
                  placeholder="Rechercher une langue…"
                  helperText="Recherchez une langue puis cochez-la pour l'ajouter à la traduction."
                />
              )}
            />
          )}
        </Box>
      )}
    </Stack>
  );
}
