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
import { DEFAULT_LABEL_FORM, type LabelFormData } from '@/types/pagesModules';

function initialData(): LabelFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_LABEL_FORM, name: copyName } : DEFAULT_LABEL_FORM;
}

export function LabelForm() {
  const router = useRouter();
  const [data, setData] = useState<LabelFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_LABEL_FORM), [data]);

  function handleChange(patch: Partial<LabelFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau label'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/labels'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau label"
      backHref="/dashboard/labels"
      backLabel="Retour aux labels"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le label">
        <Stack spacing={2.5}>
          <TextField label="Nom du label" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="Organisme délivrant le label" value={data.issuer} onChange={(e) => handleChange({ issuer: e.target.value })} fullWidth />
          <TextField label="Description" value={data.description} onChange={(e) => handleChange({ description: e.target.value })} multiline minRows={4} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Logo du label" infoTooltip="Visuel officiel du label ou de la certification.">
        <VignetteUploader value={data.thumbnailUrl} onChange={(url) => handleChange({ thumbnailUrl: url })} />
      </FormSection>

      <FormSection title="Affichage du label">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du label' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
