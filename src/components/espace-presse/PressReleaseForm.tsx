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
import { DEFAULT_PRESS_RELEASE_FORM, type PressReleaseFormData } from '@/types/pagesModules';

function initialData(): PressReleaseFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_PRESS_RELEASE_FORM, name: copyName } : DEFAULT_PRESS_RELEASE_FORM;
}

export function PressReleaseForm() {
  const router = useRouter();
  const [data, setData] = useState<PressReleaseFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_PRESS_RELEASE_FORM), [data]);

  function handleChange(patch: Partial<PressReleaseFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau communiqué'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/espace-presse'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau communiqué"
      backHref="/dashboard/espace-presse"
      backLabel="Retour à l'espace presse"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le communiqué">
        <Stack spacing={2.5}>
          <TextField label="Nom du communiqué" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="Résumé" value={data.summary} onChange={(e) => handleChange({ summary: e.target.value })} multiline minRows={4} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Visuel presse" infoTooltip="Image ou capture jointe au communiqué.">
        <VignetteUploader folder="Espace presse" value={data.thumbnailUrl} onChange={(url) => handleChange({ thumbnailUrl: url })} />
      </FormSection>

      <FormSection title="Publication du communiqué">
        <Stack spacing={2.5}>
          <TextField
            label="Date de publication"
            type="date"
            value={data.publicationDate}
            onChange={(e) => handleChange({ publicationDate: e.target.value })}
            fullWidth
            sx={{ maxWidth: 260 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Statut</Typography>
            <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du communiqué' } }} />
          </Stack>
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
