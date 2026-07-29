'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_TWIN_TOWN_FORM, type TwinTownFormData } from '@/types/pagesModules';

function initialData(): TwinTownFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_TWIN_TOWN_FORM, name: copyName } : DEFAULT_TWIN_TOWN_FORM;
}

export function TwinTownForm() {
  const router = useRouter();
  const [data, setData] = useState<TwinTownFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_TWIN_TOWN_FORM), [data]);

  function handleChange(patch: Partial<TwinTownFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau jumelage'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/jumelages'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau jumelage"
      backHref="/dashboard/jumelages"
      backLabel="Retour aux jumelages"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le jumelage">
        <Stack spacing={2.5}>
          <TextField label="Ville jumelle" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="Pays" value={data.country} onChange={(e) => handleChange({ country: e.target.value })} fullWidth />
          <TextField
            label="Date du jumelage"
            type="date"
            value={data.twinningDate}
            onChange={(e) => handleChange({ twinningDate: e.target.value })}
            fullWidth
            sx={{ maxWidth: 260 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField label="Description" value={data.description} onChange={(e) => handleChange({ description: e.target.value })} multiline minRows={4} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Vignette du jumelage" infoTooltip="Image représentant la ville ou l'événement de jumelage.">
        <VignetteUploader value={data.thumbnailUrl} onChange={(url) => handleChange({ thumbnailUrl: url })} />
      </FormSection>

      <FormSection title="Affichage du jumelage">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du jumelage' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
