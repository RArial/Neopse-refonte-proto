'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { FormulairesListPanel } from '@/components/formulaires/FormulairesListPanel';
import { ReponsesListPanel } from '@/components/formulaires/ReponsesListPanel';
import { FORMS } from '@/types/formulaires';

type FormulairesTab = 'formulaires' | 'reponses';

function isFormulairesTab(value: string | null): value is FormulairesTab {
  return value === 'formulaires' || value === 'reponses';
}

export function FormulairesHub() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<FormulairesTab>(() => {
    const requested = searchParams.get('tab');
    return isFormulairesTab(requested) ? requested : 'formulaires';
  });

  const totalNewResponses = useMemo(
    () => FORMS.reduce((sum, form) => sum + form.responses.filter((response) => response.isNew).length, 0),
    [],
  );

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1320, width: '100%', mx: 'auto' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em', mb: 2.5 }}>
        Formulaires
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, value: FormulairesTab) => setTab(value)}
        aria-label="Formulaires et réponses"
        sx={{ mb: 2.5, borderBottom: '1px solid', borderColor: 'divider', minHeight: 44 }}
      >
        <Tab value="formulaires" label="Formulaires" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700 }} />
        <Tab
          value="reponses"
          sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700 }}
          label={
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <span>Réponses</span>
              {totalNewResponses > 0 && (
                <Chip
                  size="small"
                  label={totalNewResponses > 99 ? '99+' : totalNewResponses}
                  color="secondary"
                  sx={{ height: 18, minWidth: 18, fontSize: 11, fontWeight: 700, '& .MuiChip-label': { px: 0.75 } }}
                />
              )}
            </Stack>
          }
        />
      </Tabs>

      {tab === 'formulaires' ? <FormulairesListPanel forms={FORMS} /> : <ReponsesListPanel forms={FORMS} />}
    </Box>
  );
}
