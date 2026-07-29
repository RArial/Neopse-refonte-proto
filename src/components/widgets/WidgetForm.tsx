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
import { DEFAULT_WIDGET_FORM, WIDGET_TYPES, type WidgetFormData } from '@/types/pagesModules';

function initialData(): WidgetFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_WIDGET_FORM, name: copyName } : DEFAULT_WIDGET_FORM;
}

export function WidgetForm() {
  const router = useRouter();
  const [data, setData] = useState<WidgetFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_WIDGET_FORM), [data]);

  function handleChange(patch: Partial<WidgetFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau widget'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/widgets'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau widget"
      backHref="/dashboard/widgets"
      backLabel="Retour aux widgets"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le widget">
        <Stack spacing={2.5}>
          <TextField label="Titre du widget" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField select label="Type de widget" value={data.type} onChange={(e) => handleChange({ type: e.target.value })} fullWidth sx={{ maxWidth: 340 }}>
            <MenuItem value="">Aucune sélection</MenuItem>
            {WIDGET_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Contenu / configuration"
            helperText="Texte, code HTML ou paramètres selon le type de widget choisi."
            value={data.content}
            onChange={(e) => handleChange({ content: e.target.value })}
            multiline
            minRows={5}
            fullWidth
          />
        </Stack>
      </FormSection>

      <FormSection title="Affichage du widget">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du widget' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
