'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_POLL_FORM, type PollFormData } from '@/types/pagesModules';

function initialData(): PollFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_POLL_FORM, name: copyName } : DEFAULT_POLL_FORM;
}

export function PollForm() {
  const router = useRouter();
  const [data, setData] = useState<PollFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_POLL_FORM), [data]);

  function handleChange(patch: Partial<PollFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau sondage'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/sondages'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau sondage"
      backHref="/dashboard/sondages"
      backLabel="Retour aux sondages"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le sondage">
        <Stack spacing={2.5}>
          <TextField label="Question" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField
            label="Réponses possibles"
            helperText="Une réponse par ligne."
            value={data.options}
            onChange={(e) => handleChange({ options: e.target.value })}
            multiline
            minRows={4}
            fullWidth
          />
        </Stack>
      </FormSection>

      <FormSection title="Affichage du sondage">
        <Stack spacing={2.5}>
          <TextField
            label="Date de fin"
            type="date"
            value={data.endDate}
            onChange={(e) => handleChange({ endDate: e.target.value })}
            fullWidth
            sx={{ maxWidth: 260 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Statut</Typography>
            <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du sondage' } }} />
          </Stack>
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
