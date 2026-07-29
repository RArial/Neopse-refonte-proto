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
import { DEFAULT_PUSH_NOTIFICATION_FORM, type PushNotificationFormData } from '@/types/pagesModules';

function initialData(): PushNotificationFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_PUSH_NOTIFICATION_FORM, name: copyName } : DEFAULT_PUSH_NOTIFICATION_FORM;
}

export function PushNotificationForm() {
  const router = useRouter();
  const [data, setData] = useState<PushNotificationFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_PUSH_NOTIFICATION_FORM), [data]);

  function handleChange(patch: Partial<PushNotificationFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouvelle notification'} » a été ajoutée.`);
    window.setTimeout(() => router.push('/dashboard/notifications-push'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouvelle notification"
      backHref="/dashboard/notifications-push"
      backLabel="Retour aux notifications push"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant la notification">
        <Stack spacing={2.5}>
          <TextField label="Titre" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="Message" value={data.message} onChange={(e) => handleChange({ message: e.target.value })} multiline minRows={3} fullWidth />
          <TextField label="Lien (optionnel)" placeholder="https:// ou /page-du-site" value={data.link} onChange={(e) => handleChange({ link: e.target.value })} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Envoi de la notification">
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
            <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut de la notification' } }} />
          </Stack>
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
