'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { HelpTip } from '@/components/actualites/panels/HelpTip';
import { PanelShell } from '@/components/ui/PanelShell';
import { NEWS_LEAD_MAX, NEWS_TITLE_MAX, type NewsFormData } from '@/types/actualites';

export const NEWS_TITLE_FIELD_ID = 'news-title';

interface GeneralInfoPanelProps {
  data: NewsFormData;
  onChange: (patch: Partial<NewsFormData>) => void;
  titleError?: string;
  onToggleFavorite: () => void;
}

export function GeneralInfoPanel({ data, onChange, titleError, onToggleFavorite }: GeneralInfoPanelProps) {
  return (
    <PanelShell icon="FileText" title="Informations générales">
      <Stack spacing={2.5}>
        <TextField
          id={NEWS_TITLE_FIELD_ID}
          variant="standard"
          label="Nom de l'actualité"
          placeholder="Ex. Travaux rue de la République"
          value={data.title}
          onChange={(event) => onChange({ title: event.target.value.slice(0, NEWS_TITLE_MAX) })}
          required
          fullWidth
          error={Boolean(titleError)}
          helperText={titleError ?? `${data.title.length} / ${NEWS_TITLE_MAX}`}
          slotProps={{ inputLabel: { shrink: true }, formHelperText: { role: titleError ? 'alert' : undefined, sx: { textAlign: titleError ? 'left' : 'right' } } }}
        />

        <Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Typography component="label" htmlFor="news-lead" variant="body2" sx={{ fontWeight: 600 }}>
              Chapô
            </Typography>
            <HelpTip text="Court résumé affiché dans les listes d'actualités" />
          </Stack>
          <TextField
            id="news-lead"
            placeholder="Résumé court affiché sur la liste et les widgets"
            value={data.lead}
            onChange={(event) => onChange({ lead: event.target.value.slice(0, NEWS_LEAD_MAX) })}
            multiline
            minRows={3}
            fullWidth
            helperText={`${data.lead.length} / ${NEWS_LEAD_MAX}`}
            slotProps={{ formHelperText: { sx: { textAlign: 'right' } } }}
            sx={{ '& textarea': { resize: 'vertical' } }}
          />
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Mettre en favori
          </Typography>
          <HelpTip text="Max. 5 favoris par projet" />
          <Box sx={{ flex: 1 }} />
          <Tooltip title={data.favorite ? 'Retirer des favoris' : 'Mettre en favori'}>
            <IconButton onClick={onToggleFavorite} aria-pressed={data.favorite} aria-label="Mettre en favori">
              {data.favorite ? <StarIcon sx={{ color: 'warning.main' }} /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </PanelShell>
  );
}
