'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { RichTextField } from '@/components/ui/RichTextField';
import { DEFAULT_RESERVED_PAGE_SETTINGS, type ReservedPageSettings } from '@/types/espaceReserve';

export function EspaceReservePageSettingsForm() {
  const router = useRouter();
  const [data, setData] = useState<ReservedPageSettings>(DEFAULT_RESERVED_PAGE_SETTINGS);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(DEFAULT_RESERVED_PAGE_SETTINGS), [data]);

  function handleChange(patch: Partial<ReservedPageSettings>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage("Les réglages de la page Espace Réservé ont bien été enregistrés.");
    window.setTimeout(() => router.push('/dashboard/espace-reserve'), 1400);
  }

  return (
    <ModuleFormShell
      title='Gérer la page "Espace Réservé"'
      backHref="/dashboard/espace-reserve"
      backLabel="Retour à l'espace réservé"
      submitLabel="Enregistrer"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant l'accès à l'Espace Réservé">
        <Stack spacing={2.5}>
          <RichTextField
            label="Texte"
            value={data.introText}
            onChange={(introText) => handleChange({ introText })}
            placeholder="Présentez l'espace réservé aux usagers…"
          />
          <TextField
            label="Nom du bouton d'accès"
            value={data.accessButtonLabel}
            onChange={(event) => handleChange({ accessButtonLabel: event.target.value })}
            fullWidth
          />
        </Stack>
      </FormSection>

      <FormSection title="Espace Réservé sur l'Interface Mon Compte">
        <RichTextField
          label="Accès refusé à l'Espace Réservé"
          value={data.accessDeniedText}
          onChange={(accessDeniedText) => handleChange({ accessDeniedText })}
          placeholder="Message affiché aux usagers n'ayant pas accès à l'espace réservé…"
          infoTooltip="Texte affiché sur l'Interface Mon Compte lorsqu'un usager identifié n'appartient à aucun groupe autorisé."
        />
      </FormSection>
    </ModuleFormShell>
  );
}
