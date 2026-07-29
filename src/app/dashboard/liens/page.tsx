import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { LINKS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Liens',
};

export default function LinkPage() {
  return (
    <ContentListPage
      title="Liens"
      description="Proposez une sélection de liens utiles vers des sites partenaires."
      addLabel="Ajouter un lien"
      addHref="/dashboard/liens/nouveau"
      itemNounSingular="un lien"
      itemNounPlural="des liens"
      initialItems={LINKS_MOCK}
    />
  );
}
