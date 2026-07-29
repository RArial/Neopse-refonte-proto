'use client';

import { useSearchParams } from 'next/navigation';
import { LegalPageEditor } from '@/components/contenu/legal/LegalPageEditor';
import type { LegalTemplateId } from '@/types/legal';

interface LegalPageEditorRouteProps {
  templateId: LegalTemplateId;
}

/** Lit `?focus=1` (déposé par l'avertissement de publication) pour ouvrir directement sur le
 * premier champ manquant. Isolé dans son propre composant car `useSearchParams` exige un parent
 * `<Suspense>` — voir le `page.tsx` de chaque page légale. */
export function LegalPageEditorRoute({ templateId }: LegalPageEditorRouteProps) {
  const searchParams = useSearchParams();
  return <LegalPageEditor templateId={templateId} autoFocusMissing={searchParams.get('focus') === '1'} />;
}
