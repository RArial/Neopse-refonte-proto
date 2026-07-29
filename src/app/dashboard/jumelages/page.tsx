import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { TWIN_TOWNS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Jumelages',
};

export default function TwinTownPage() {
  return (
    <ContentListPage
      title="Jumelages"
      description="Présentez vos villes jumelles et les échanges menés avec elles."
      addLabel="Ajouter un jumelage"
      addHref="/dashboard/jumelages/nouveau"
      itemNounSingular="un jumelage"
      itemNounPlural="des jumelages"
      initialItems={TWIN_TOWNS_MOCK}
    />
  );
}
