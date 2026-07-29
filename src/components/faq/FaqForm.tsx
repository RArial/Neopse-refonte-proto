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
import { DEFAULT_FAQ_FORM, FAQ_CATEGORIES, type FaqFormData } from '@/types/pagesModules';

function initialData(): FaqFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_FAQ_FORM, name: copyName } : DEFAULT_FAQ_FORM;
}

export function FaqForm() {
  const router = useRouter();
  const [data, setData] = useState<FaqFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_FAQ_FORM), [data]);

  function handleChange(patch: Partial<FaqFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouvelle question'} » a été ajoutée.`);
    window.setTimeout(() => router.push('/dashboard/faq'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouvelle question"
      backHref="/dashboard/faq"
      backLabel="Retour à la FAQ"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant la question">
        <Stack spacing={2.5}>
          <TextField label="Question" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField select label="Catégorie" value={data.category} onChange={(e) => handleChange({ category: e.target.value })} fullWidth sx={{ maxWidth: 340 }}>
            <MenuItem value="">Aucune sélection</MenuItem>
            {FAQ_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Réponse" value={data.answer} onChange={(e) => handleChange({ answer: e.target.value })} multiline minRows={5} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Affichage de la question">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut de la question' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
