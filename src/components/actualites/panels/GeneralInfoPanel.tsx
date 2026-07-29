'use client';

import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PanelShell } from '@/components/ui/PanelShell';
import type { NewsFormData } from '@/types/actualites';

interface PanelProps {
  data: NewsFormData;
  onChange: (patch: Partial<NewsFormData>) => void;
  nameError?: boolean;
}

export function GeneralInfoPanel({ data, onChange, nameError }: PanelProps) {
  return (
    <PanelShell icon="FileText" title="Informations générales">
      <Stack spacing={2.5}>
        <TextField
          label="Nom de l'actualité"
          value={data.name}
          onChange={(event) => onChange({ name: event.target.value.slice(0, 100) })}
          required
          fullWidth
          error={nameError}
          helperText={nameError ? "Le nom de l'actualité est obligatoire." : `${data.name.length} / 100`}
          slotProps={{ formHelperText: { role: nameError ? 'alert' : undefined } }}
        />
        <TextField
          label="Chapô"
          value={data.chapo}
          onChange={(event) => onChange({ chapo: event.target.value.slice(0, 150) })}
          multiline
          minRows={2}
          fullWidth
          helperText={`${data.chapo.length} / 150`}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <Tooltip title="Résumé court affiché sur la liste et les widgets">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
    </PanelShell>
  );
}
