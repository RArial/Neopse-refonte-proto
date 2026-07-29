'use client';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { EventFormData } from '@/types/agenda';

interface SectionProps {
  data: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
  onNotify: (message: string) => void;
}

export function DiaporamaSection({ data, onChange, onNotify }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        select
        label="Type de diaporama"
        value={data.diaporamaType}
        onChange={(event) => onChange({ diaporamaType: event.target.value as EventFormData['diaporamaType'] })}
        sx={{ maxWidth: 340 }}
      >
        <MenuItem value="aucune">Aucune sélection</MenuItem>
        <MenuItem value="galerie">Galerie de photos existante</MenuItem>
        <MenuItem value="diaporama-externe">Diaporama externe</MenuItem>
      </TextField>

      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddOutlinedIcon fontSize="small" />}
          onClick={() => onNotify("L'ajout de diaporama sera bientôt disponible.")}
        >
          Ajouter un diaporama
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<VisibilityOutlinedIcon fontSize="small" />}
          onClick={() => onNotify('Aperçu du diaporama — bientôt disponible.')}
        >
          Prévisualiser mon diaporama
        </Button>
      </Stack>
    </Stack>
  );
}
