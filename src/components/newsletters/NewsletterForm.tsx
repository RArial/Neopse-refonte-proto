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
import { DEFAULT_NEWSLETTER_FORM, type NewsletterFormData } from '@/types/pagesModules';

function initialData(): NewsletterFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_NEWSLETTER_FORM, name: copyName } : DEFAULT_NEWSLETTER_FORM;
}

export function NewsletterForm() {
  const router = useRouter();
  const [data, setData] = useState<NewsletterFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_NEWSLETTER_FORM), [data]);

  function handleChange(patch: Partial<NewsletterFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouvelle newsletter'} » a été ajoutée.`);
    window.setTimeout(() => router.push('/dashboard/newsletters'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouvelle newsletter"
      backHref="/dashboard/newsletters"
      backLabel="Retour aux newsletters"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant la newsletter">
        <Stack spacing={2.5}>
          <TextField label="Objet" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="Contenu" value={data.content} onChange={(e) => handleChange({ content: e.target.value })} multiline minRows={6} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Envoi de la newsletter">
        <Stack spacing={2.5}>
          <TextField
            label="Date d'envoi"
            type="date"
            value={data.sendDate}
            onChange={(e) => handleChange({ sendDate: e.target.value })}
            fullWidth
            sx={{ maxWidth: 260 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Statut</Typography>
            <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut de la newsletter' } }} />
          </Stack>
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
