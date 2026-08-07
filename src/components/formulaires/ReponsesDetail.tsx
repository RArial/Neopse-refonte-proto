'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { FormSummary } from '@/types/formulaires';

interface ReponsesDetailProps {
  form: FormSummary;
}

function formatSubmittedAt(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

export function ReponsesDetail({ form }: ReponsesDetailProps) {
  const responses = [...form.responses].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1320, width: '100%', mx: 'auto' }}>
      <Button
        component={Link}
        href="/dashboard/formulaires?tab=reponses"
        startIcon={<ArrowBackIcon fontSize="small" />}
        color="inherit"
        size="small"
        sx={{ mb: 2, ml: -1, textTransform: 'none', fontWeight: 500 }}
      >
        Retour aux réponses
      </Button>

      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
        {form.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, mb: 3 }}>
        {responses.length} réponse{responses.length > 1 ? 's' : ''} au total
      </Typography>

      {responses.length === 0 ? (
        <Box sx={{ border: '1.5px dashed', borderColor: 'divider', borderRadius: 2, py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Aucune réponse pour ce formulaire.
          </Typography>
        </Box>
      ) : (
        <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {responses.map((response) => (
            <Stack
              key={response.id}
              component="li"
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{
                alignItems: { sm: 'center' },
                justifyContent: 'space-between',
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: response.isNew ? 'action.hover' : 'transparent',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {response.respondentName}
                  </Typography>
                  {response.isNew && <Chip size="small" label="Nouveau" color="secondary" sx={{ fontWeight: 700 }} />}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {response.summary}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                {formatSubmittedAt(response.submittedAt)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
