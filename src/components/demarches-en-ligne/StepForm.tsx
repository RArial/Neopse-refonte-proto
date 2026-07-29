'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_STEP_FORM, STEP_CATEGORIES, type StepFormData } from '@/types/pagesModules';

function initialData(): StepFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_STEP_FORM, name: copyName } : DEFAULT_STEP_FORM;
}

export function StepForm() {
  const router = useRouter();
  const [data, setData] = useState<StepFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_STEP_FORM), [data]);

  function handleChange(patch: Partial<StepFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouvelle démarche'} » a été ajoutée.`);
    window.setTimeout(() => router.push('/dashboard/demarches-en-ligne'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouvelle démarche"
      backHref="/dashboard/demarches-en-ligne"
      backLabel="Retour aux démarches en ligne"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant la démarche">
        <Stack spacing={2.5}>
          <TextField label="Nom de la démarche" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField select label="Catégorie" value={data.category} onChange={(e) => handleChange({ category: e.target.value })} fullWidth sx={{ maxWidth: 340 }}>
            <MenuItem value="">Aucune sélection</MenuItem>
            {STEP_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Description" value={data.description} onChange={(e) => handleChange({ description: e.target.value })} multiline minRows={4} fullWidth />
          <TextField
            label="Lien du formulaire"
            placeholder="https://"
            value={data.formUrl}
            onChange={(e) => handleChange({ formUrl: e.target.value })}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Adresse vers laquelle l'usager est redirigé pour effectuer sa démarche.">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </FormSection>

      <FormSection title="Affichage de la démarche">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut de la démarche' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
