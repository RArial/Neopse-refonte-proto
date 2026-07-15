'use client';

import { useState, type SyntheticEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { NEOPSE_DEFAULT_PALETTE_ID, PRESET_PALETTES } from '@/lib/personnalisation/palettes';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { COLOR_KEY_DESCRIPTIONS, COLOR_KEY_LABELS, COLOR_KEYS, type ColorKey, type Palette } from '@/types/personnalisation';

const HEX_PATTERN = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

function PresetPastille({ palette, selected, onClick }: { palette: Palette; selected: boolean; onClick: () => void }) {
  return (
    <ButtonBase onClick={onClick} aria-pressed={selected} sx={{ display: 'block', borderRadius: 2, width: '100%' }}>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          borderRadius: 2,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? 'primary.main' : 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        <Box sx={{ display: 'flex' }} aria-hidden="true">
          {COLOR_KEYS.map((key, i) => (
            <Box
              key={key}
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: palette.colors[key],
                ml: i === 0 ? 0 : -0.75,
                border: '1.5px solid',
                borderColor: 'background.paper',
                zIndex: COLOR_KEYS.length - i,
              }}
            />
          ))}
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {palette.name}
        </Typography>
      </Paper>
    </ButtonBase>
  );
}

function PaletteColorRow({ colorKey, hex, onChange }: { colorKey: ColorKey; hex: string; onChange: (hex: string) => void }) {
  const [hexInput, setHexInput] = useState(hex);
  const [lastSyncedHex, setLastSyncedHex] = useState(hex);

  // Resynchronise le champ hex quand la valeur change depuis l'extérieur (input color natif, changement de preset).
  if (hex !== lastSyncedHex) {
    setLastSyncedHex(hex);
    setHexInput(hex);
  }

  function handleHexChange(value: string) {
    setHexInput(value);
    if (HEX_PATTERN.test(value)) onChange(value);
  }

  return (
    <Stack spacing={0.75} sx={{ alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {COLOR_KEY_LABELS[colorKey]}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {COLOR_KEY_DESCRIPTIONS[colorKey]}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box
          component="input"
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`Couleur : ${COLOR_KEY_LABELS[colorKey]}`}
          sx={{ width: 32, height: 32, p: 0, border: '1px solid', borderColor: 'divider', borderRadius: 1, cursor: 'pointer', flexShrink: 0 }}
        />
        <TextField
          size="small"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          onBlur={() => setHexInput(hex)}
          error={!HEX_PATTERN.test(hexInput)}
          sx={{ width: 100, flexShrink: 0 }}
          slotProps={{ htmlInput: { 'aria-label': `Code hexadécimal : ${COLOR_KEY_LABELS[colorKey]}`, maxLength: 7 } }}
        />
      </Stack>
    </Stack>
  );
}

export function PaletteSection() {
  const { activePalette, selectPreset, resetPalette, updatePaletteColor } = usePersonnalisation();
  const [expanded, setExpanded] = useState(true);

  function handleChange(_event: SyntheticEvent, next: boolean) {
    setExpanded(next);
  }

  const isCustomised = activePalette.origin === 'custom';

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      disableGutters
      elevation={0}
      square
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 0 },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Charte graphique
          </Typography>
          <Tooltip title="Les 5 couleurs de votre charte graphique, utilisées dans tout le site.">
            <IconButton
              size="small"
              component="span"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              aria-label="À propos de la charte graphique"
            >
              <InfoOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 1, mb: 2 }}>
          {PRESET_PALETTES.map((preset) => {
            const isCustomTile = preset.id === NEOPSE_DEFAULT_PALETTE_ID;
            // La tuile « Personnalisée » représente tout brouillon forké, quel que soit le preset
            // d'origine — elle reste sélectionnée tant qu'on est sur une palette custom, et affiche
            // ses couleurs en direct plutôt que ses couleurs de départ figées.
            const selected = isCustomised ? isCustomTile : activePalette.id === preset.id;
            const displayedPalette = isCustomTile && isCustomised ? { ...preset, colors: activePalette.colors } : preset;
            return (
              <PresetPastille
                key={preset.id}
                palette={displayedPalette}
                selected={selected}
                onClick={() => {
                  if (isCustomTile && isCustomised) return;
                  selectPreset(preset.id);
                }}
              />
            );
          })}
        </Box>

        <Stack spacing={1.75}>
          {COLOR_KEYS.map((key) => (
            <PaletteColorRow key={key} colorKey={key} hex={activePalette.colors[key]} onChange={(hex) => updatePaletteColor(key, hex)} />
          ))}
        </Stack>

        {isCustomised && activePalette.basedOn && (
          <Stack spacing={0.75} sx={{ mt: 1.5, alignItems: 'flex-start' }}>
            <Typography variant="caption" color="text.secondary">
              {activePalette.name}
            </Typography>
            <Button size="small" onClick={resetPalette} startIcon={<RestartAltIcon fontSize="small" />}>
              Réinitialiser la charte
            </Button>
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
