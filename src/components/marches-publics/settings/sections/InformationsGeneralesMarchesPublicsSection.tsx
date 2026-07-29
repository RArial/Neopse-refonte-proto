'use client';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { MarchePublicInformationDisplay, MarchePublicPageSettings } from '@/types/marchesPublics';

interface SectionProps {
  settings: MarchePublicPageSettings;
  onChange: (patch: Partial<MarchePublicPageSettings>) => void;
}

export function InformationsGeneralesMarchesPublicsSection({ settings, onChange }: SectionProps) {
  const isHtml = settings.informationDisplay === 'html';

  return (
    <Stack spacing={2.5}>
      <FormControl component="fieldset">
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
            Affichage de l&apos;information
          </FormLabel>
          <Tooltip title="Choisissez si les informations générales sont affichées via le module natif ou via un bloc de code HTML personnalisé.">
            <IconButton size="small" aria-label="Informations sur l'affichage de l'information" sx={{ p: 0.25 }}>
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        </Stack>
        <RadioGroup
          row
          aria-label="Affichage de l'information"
          value={settings.informationDisplay}
          onChange={(event) => onChange({ informationDisplay: event.target.value as MarchePublicInformationDisplay })}
        >
          <FormControlLabel value="module" control={<Radio />} label="Module" />
          <FormControlLabel value="html" control={<Radio />} label="Code HTML" />
        </RadioGroup>
      </FormControl>

      {isHtml && (
        <>
          <FormControl component="fieldset">
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
              <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
                Remplacement des tableaux
              </FormLabel>
              <Tooltip title="Les tableaux cochés sont masqués sur la page publique et remplacés par le code HTML ci-dessous.">
                <IconButton size="small" aria-label="Informations sur le remplacement des tableaux" sx={{ p: 0.25 }}>
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
            </Stack>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.replaceCurrentTendersTable}
                    onChange={(event) => onChange({ replaceCurrentTendersTable: event.target.checked })}
                  />
                }
                label="Marchés en cours"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.replaceAwardedTendersTable}
                    onChange={(event) => onChange({ replaceAwardedTendersTable: event.target.checked })}
                  />
                }
                label="Marchés attribués"
              />
            </FormGroup>
          </FormControl>

          <TextField
            label="Code HTML"
            placeholder="<div>Votre code HTML…</div>"
            value={settings.htmlCode}
            onChange={(event) => onChange({ htmlCode: event.target.value })}
            multiline
            minRows={4}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Tooltip title="Code HTML additionnel inséré dans la page Marchés publics.">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }}
          />
        </>
      )}
    </Stack>
  );
}
