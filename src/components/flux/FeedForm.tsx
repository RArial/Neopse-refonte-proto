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
import { DEFAULT_FEED_FORM, FEED_CONTENT_TYPES, FEED_FORMATS, type FeedFormData } from '@/types/pagesModules';

function initialData(): FeedFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_FEED_FORM, name: copyName } : DEFAULT_FEED_FORM;
}

export function FeedForm() {
  const router = useRouter();
  const [data, setData] = useState<FeedFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_FEED_FORM), [data]);

  function handleChange(patch: Partial<FeedFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau flux'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/flux'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau flux"
      backHref="/dashboard/flux"
      backLabel="Retour aux flux"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le flux">
        <Stack spacing={2.5}>
          <TextField label="Nom du flux" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField
            label="URL de destination"
            placeholder="https://"
            value={data.destinationUrl}
            onChange={(e) => handleChange({ destinationUrl: e.target.value })}
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
            <TextField select label="Contenu diffusé" value={data.contentType} onChange={(e) => handleChange({ contentType: e.target.value })} fullWidth>
              <MenuItem value="">Aucune sélection</MenuItem>
              {FEED_CONTENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Format" value={data.format} onChange={(e) => handleChange({ format: e.target.value })} fullWidth>
              <MenuItem value="">Aucune sélection</MenuItem>
              {FEED_FORMATS.map((format) => (
                <MenuItem key={format} value={format}>
                  {format}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </FormSection>

      <FormSection title="Affichage du flux">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du flux' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
