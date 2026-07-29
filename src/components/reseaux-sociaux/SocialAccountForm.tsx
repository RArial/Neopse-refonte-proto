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
import { DEFAULT_SOCIAL_ACCOUNT_FORM, SOCIAL_NETWORKS, type SocialAccountFormData } from '@/types/pagesModules';

function initialData(): SocialAccountFormData {
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_SOCIAL_ACCOUNT_FORM, name: copyName } : DEFAULT_SOCIAL_ACCOUNT_FORM;
}

export function SocialAccountForm() {
  const router = useRouter();
  const [data, setData] = useState<SocialAccountFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_SOCIAL_ACCOUNT_FORM), [data]);

  function handleChange(patch: Partial<SocialAccountFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(`« ${data.name || 'Nouveau compte'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/reseaux-sociaux'), 1200);
  }

  return (
    <ModuleFormShell
      title="Nouveau compte"
      backHref="/dashboard/reseaux-sociaux"
      backLabel="Retour aux réseaux sociaux"
      submitLabel="Ajouter"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le compte">
        <Stack spacing={2.5}>
          <TextField select label="Réseau" value={data.network} onChange={(e) => handleChange({ network: e.target.value })} fullWidth sx={{ maxWidth: 340 }}>
            <MenuItem value="">Aucune sélection</MenuItem>
            {SOCIAL_NETWORKS.map((network) => (
              <MenuItem key={network} value={network}>
                {network}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Nom du compte" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="URL du profil" placeholder="https://" value={data.url} onChange={(e) => handleChange({ url: e.target.value })} fullWidth />
        </Stack>
      </FormSection>

      <FormSection title="Affichage du compte">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">Statut</Typography>
          <Switch checked={data.active} onChange={(e) => handleChange({ active: e.target.checked })} slotProps={{ input: { 'aria-label': 'Statut du compte' } }} />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
