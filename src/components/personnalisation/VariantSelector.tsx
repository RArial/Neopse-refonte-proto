'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

export function VariantSelector() {
  const { variants, activeVariant, requestSelectVariant } = usePersonnalisation();

  function handleChange(event: SelectChangeEvent<string>) {
    requestSelectVariant(event.target.value);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
      <Select
        variant="outlined"
        size="small"
        value={activeVariant.id}
        onChange={handleChange}
        aria-label="Variante en cours d'édition"
        sx={{ fontWeight: 600, fontSize: 14, maxWidth: 260 }}
      >
        {variants.map((v) => (
          <MenuItem key={v.id} value={v.id} sx={{ gap: 1 }}>
            <Typography component="span" variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {v.name}
            </Typography>
            {v.status === 'published' && <Chip label="En ligne" color="success" size="small" variant="outlined" />}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
