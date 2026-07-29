import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { STEPS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Démarches en ligne',
};

export default function StepPage() {
  return (
    <ContentListPage
      title="Démarches en ligne"
      description="Proposez à vos usagers de réaliser leurs démarches administratives en ligne."
      addLabel="Ajouter une démarche"
      addHref="/dashboard/demarches-en-ligne/nouveau"
      itemNounSingular="une démarche"
      itemNounPlural="des démarches"
      initialItems={STEPS_MOCK}
    />
  );
}
