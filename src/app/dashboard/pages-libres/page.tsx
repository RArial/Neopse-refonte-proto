import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { FREE_PAGES_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Pages libres',
};

export default function FreePagePage() {
  return (
    <ContentListPage
      title="Pages libres"
      description="Créez des pages de contenu libre, sans contrainte de gabarit."
      addLabel="Ajouter une page"
      addHref="/dashboard/pages-libres/nouveau"
      itemNounSingular="une page"
      itemNounPlural="des pages"
      initialItems={FREE_PAGES_MOCK}
    />
  );
}
