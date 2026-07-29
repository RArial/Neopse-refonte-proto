'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_LINK_FORM, LINK_CATEGORIES, type LinkFormData } from '@/types/pagesModules';

function initialData(): LinkFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_LINK_FORM, name: copyName } : DEFAULT_LINK_FORM;
}

export function LinkForm() {
  const router = useRouter();
  const [data, setData] = useState<LinkFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_LINK_FORM), [data]);

  function handleChange(patch: Partial<LinkFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau lien'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/liens'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau lien"
      backHref="/dashboard/liens"
      backLabel="Retour aux liens"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le lien">
        <Stack spacing={2.5}>
          <TextField label="Nom du lien" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="URL" placeholder="https://" value={data.url} onChange={(e) => handleChange({ url: e.target.value })} fullWidth />
          <TextField select label="Catégorie" value={data.category} onChange={(e) => handleChange({ category: e.target.value })} fullWidth sx={{ maxWidth: 340 }}>
            <MenuItem value="">Aucune sélection</MenuItem>
            {LINK_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Description courte" value={data.description} onChange={(e) => handleChange({ description: e.target.value })} multiline minRows={3} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Affichage du lien">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du lien' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
