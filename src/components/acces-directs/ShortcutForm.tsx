'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { InformationsGeneralesRaccourciSection } from '@/components/acces-directs/InformationsGeneralesRaccourciSection';
import { IllustrationRaccourciSection } from '@/components/acces-directs/IllustrationRaccourciSection';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_SHORTCUT_FORM, type Shortcut, type ShortcutFormData } from '@/types/pagesModules';

function buildInitialData(initialShortcut?: Shortcut): ShortcutFormData {
  if (initialShortcut) {
    return {
      name: initialShortcut.name,
      status: initialShortcut.status,
      linkType: initialShortcut.linkType,
      externalUrl: initialShortcut.externalUrl,
      internalTargetId: initialShortcut.internalTargetId,
      icon: initialShortcut.icon,
      color: initialShortcut.color,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_SHORTCUT_FORM, name: copyName } : DEFAULT_SHORTCUT_FORM;
}

interface ShortcutFormProps {
  mode: 'create' | 'edit';
  initialShortcut?: Shortcut;
}

export function ShortcutForm({ mode, initialShortcut }: ShortcutFormProps) {
  const router = useRouter();
  const [initialData] = useState<ShortcutFormData>(() => buildInitialData(initialShortcut));
  const [data, setData] = useState<ShortcutFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData), [data, initialData]);

  function handleChange(patch: Partial<ShortcutFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setSuccessMessage(mode === 'edit' ? `« ${data.name} » a été mis à jour.` : `« ${data.name || 'Nouveau raccourci'} » a été ajouté.`);
    window.setTimeout(() => router.push('/dashboard/acces-directs'), 1200);
  }

  return (
    <ModuleFormShell
      title={mode === 'edit' ? data.name || 'Modifier le raccourci' : 'Nouveau raccourci'}
      backHref="/dashboard/acces-directs"
      backLabel="Retour aux accès directs"
      submitLabel={mode === 'edit' ? 'Enregistrer' : 'Ajouter'}
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant le raccourci">
        <InformationsGeneralesRaccourciSection data={data} onChange={handleChange} />
      </FormSection>

      <FormSection title="Illustration du raccourci">
        <IllustrationRaccourciSection data={data} onChange={handleChange} />
      </FormSection>
    </ModuleFormShell>
  );
}
