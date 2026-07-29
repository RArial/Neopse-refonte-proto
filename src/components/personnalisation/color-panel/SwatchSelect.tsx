'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { chartMatrixRatio } from '@/lib/personnalisation/colorModel';
import { COLOR_KEY_LABELS, COLOR_KEYS, type ColorKey, type Palette } from '@/types/personnalisation';

const AUTO_VALUE = '__auto__';

interface SwatchSelectProps {
  label: string;
  palette: Palette;
  /** null = Auto (texte dérivé). */
  value: ColorKey | null;
  /** Clé de charte du fond courant, pour filtrer les options par contraste. null = pas de filtrage (rôles non textuels). */
  againstColorKey: ColorKey | null;
  allowAuto: boolean;
  onChange: (colorKey: ColorKey | null) => void;
}

function Swatch({ hex }: { hex: string }) {
  return <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: hex, border: '1px solid', borderColor: 'divider', flexShrink: 0 }} />;
}

function AutoSwatch() {
  return <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px dashed', borderColor: 'text.disabled', flexShrink: 0 }} />;
}

export function SwatchSelect({ label, palette, value, againstColorKey, allowAuto, onChange }: SwatchSelectProps) {
  const selectValue = value ?? AUTO_VALUE;

  function handleChange(event: SelectChangeEvent<string>) {
    const v = event.target.value;
    onChange(v === AUTO_VALUE ? null : (v as ColorKey));
  }

  return (
    <Select
      size="small"
      value={selectValue}
      onChange={handleChange}
      aria-label={label}
      sx={{ minWidth: 148, fontSize: 14, '& .MuiSelect-select': { pl: 1 } }}
      renderValue={(v) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {v === AUTO_VALUE ? <AutoSwatch /> : <Swatch hex={palette.colors[v as ColorKey]} />}
          <Typography variant="body2" component="span">
            {v === AUTO_VALUE ? 'Auto' : COLOR_KEY_LABELS[v as ColorKey]}
          </Typography>
        </Box>
      )}
    >
      {allowAuto && (
        <MenuItem value={AUTO_VALUE} sx={{ gap: 1 }}>
          <AutoSwatch />
          <Typography variant="body2">Auto (texte dérivé)</Typography>
        </MenuItem>
      )}
      {COLOR_KEYS.map((key) => {
        const ratio = againstColorKey ? chartMatrixRatio(palette, key, againstColorKey) : null;
        const passes = ratio === null || ratio >= 4.5;
        const item = (
          <MenuItem key={key} value={key} disabled={!passes} sx={{ gap: 1 }}>
            <Swatch hex={palette.colors[key]} />
            <Typography variant="body2">{COLOR_KEY_LABELS[key]}</Typography>
          </MenuItem>
        );
        if (passes) return item;
        return (
          <Tooltip key={key} title={`Contraste insuffisant (${ratio!.toFixed(1)}:1)`} placement="right">
            <span>{item}</span>
          </Tooltip>
        );
      })}
    </Select>
  );
}
