'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_FREE_PAGE_FORM, type FreePageFormData } from '@/types/pagesModules';

function initialData(): FreePageFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_FREE_PAGE_FORM, name: copyName } : DEFAULT_FREE_PAGE_FORM;
}

export function FreePageForm() {
  const router = useRouter();
  const [data, setData] = useState<FreePageFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_FREE_PAGE_FORM), [data]);

  function handleChange(patch: Partial<FreePageFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouvelle page libre'} » a été ajoutée.`);
    window.setTimeout(() => router.push('/dashboard/pages-libres'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouvelle page libre"
      backHref="/dashboard/pages-libres"
      backLabel="Retour aux pages libres"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant la page">
        <Stack spacing={2.5}>
          <TextField label="Titre de la page" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField
            label="Adresse de la page"
            value={data.slug}
            onChange={(e) => handleChange({ slug: e.target.value })}
            fullWidth
            slotProps={{ input: { startAdornment: <InputAdornment position="start">/</InputAdornment> } }}
          />
          <TextField label="Contenu" value={data.content} onChange={(e) => handleChange({ content: e.target.value })} multiline minRows={8} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Affichage de la page">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut de la page' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
