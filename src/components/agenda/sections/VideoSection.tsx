'use client';

import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { EventFormData } from '@/types/agenda';

interface SectionProps {
  data: EventFormData;
  onChange: (patch: Partial<EventFormData>) => void;
}

export function VideoSection({ data, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Adresse URL"
        placeholder="https://"
        type="url"
        value={data.videoUrl}
        onChange={(event) => onChange({ videoUrl: event.target.value })}
        fullWidth
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Lien YouTube, Vimeo ou Dailymotion de la vidéo à intégrer.">
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />
    </Stack>
  );
}
