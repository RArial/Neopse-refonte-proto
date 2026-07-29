'use client';

import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { ContactPageSettings } from '@/types/pagesModules';

interface SectionProps {
  settings: ContactPageSettings;
  onChange: (patch: Partial<ContactPageSettings>) => void;
}

export function CodeHtmlContactSection({ settings, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
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
                <Tooltip title="Code HTML additionnel inséré dans la page Contacts.">
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
        sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }}
      />
    </Stack>
  );
}
