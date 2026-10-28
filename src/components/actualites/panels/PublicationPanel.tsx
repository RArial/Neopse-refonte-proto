'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { HelpTip } from '@/components/actualites/panels/HelpTip';
import { PanelShell } from '@/components/ui/PanelShell';
import type { NewsFormData } from '@/types/actualites';

export const NEWS_DEACTIVATION_FIELD_ID = 'news-deactivated-at';

interface PublicationPanelProps {
  data: NewsFormData;
  onChange: (patch: Partial<NewsFormData>) => void;
  deactivationError?: string;
}

function FieldLabel({ htmlFor, children, help }: { htmlFor: string; children: string; help: string }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
      <Typography component="label" htmlFor={htmlFor} variant="body2" sx={{ fontWeight: 600 }}>
        {children}
      </Typography>
      <HelpTip text={help} />
    </Stack>
  );
}

export function PublicationPanel({ data, onChange, deactivationError }: PublicationPanelProps) {
  return (
    <PanelShell icon="Calendar" title="Publication">
      <Stack spacing={2.5}>
        <Box>
          <FieldLabel htmlFor="news-published-at" help="Par défaut la date du jour. Une date postérieure programme la publication.">
            Date de publication
          </FieldLabel>
          <TextField
            id="news-published-at"
            type="date"
            size="small"
            fullWidth
            value={data.publishedAt}
            onChange={(event) => event.target.value && onChange({ publishedAt: event.target.value })}
          />
        </Box>
        <Box>
          <FieldLabel htmlFor={NEWS_DEACTIVATION_FIELD_ID} help="Supprime l'affichage de l'actualité sur le site à partir de cette date.">
            Date de désactivation
          </FieldLabel>
          <TextField
            id={NEWS_DEACTIVATION_FIELD_ID}
            type="date"
            size="small"
            fullWidth
            value={data.deactivatedAt ?? ''}
            onChange={(event) => onChange({ deactivatedAt: event.target.value || undefined })}
            error={Boolean(deactivationError)}
            helperText={deactivationError ?? 'Facultatif'}
            slotProps={{ formHelperText: { role: deactivationError ? 'alert' : undefined } }}
          />
        </Box>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component="label" htmlFor="news-active" variant="body2" sx={{ fontWeight: 600 }}>
            Statut
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" aria-hidden="true">
              {data.active ? 'Actif' : 'Inactif'}
            </Typography>
            <Switch id="news-active" checked={data.active} onChange={(event) => onChange({ active: event.target.checked })} />
          </Stack>
        </Stack>
      </Stack>
    </PanelShell>
  );
}
