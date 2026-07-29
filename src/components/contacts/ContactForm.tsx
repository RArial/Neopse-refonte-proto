'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_CONTACT_FORM, type ContactFormData } from '@/types/pagesModules';
import type { SimpleContentItem } from '@/components/pages-modules/ContentListPage';

function buildInitialData(initialContact?: SimpleContentItem): ContactFormData {
  if (initialContact) return { ...DEFAULT_CONTACT_FORM, name: initialContact.name, email: initialContact.email ?? '' };
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_CONTACT_FORM, name: copyName } : DEFAULT_CONTACT_FORM;
}

interface ContactFormProps {
  mode: 'create' | 'edit';
  initialContact?: SimpleContentItem;
}

export function ContactForm({ mode, initialContact }: ContactFormProps) {
  const router = useRouter();
  const [initialData] = useState<ContactFormData>(() => buildInitialData(initialContact));
  const [data, setData] = useState<ContactFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData), [data, initialData]);

  function handleChange(patch: Partial<ContactFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(mode === 'edit' ? `« ${data.name} » a été mis à jour.` : `« ${data.name || 'Nouveau contact'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/contacts'), 1200);
  }

  return (
    <ModuleFormShell
      title={mode === 'edit' ? data.name || 'Modifier le contact' : 'Nouveau contact'}
      backHref="/dashboard/contacts"
      backLabel="Retour aux contacts"
      submitLabel={mode === 'edit' ? 'Enregistrer' : "Ajouter"}
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le contact">
        <Stack spacing={2.5}>
          <TextField label="Nom du contact" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
          <TextField label="Adresse e-mail" type="email" value={data.email} onChange={(e) => handleChange({ email: e.target.value })} fullWidth required />
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
