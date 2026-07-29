import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { FAQ_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'FAQ',
};

export default function FaqPage() {
  return (
    <ContentListPage
      title="FAQ"
      description="Centralisez les questions fréquentes de vos usagers."
      addLabel="Ajouter une question"
      addHref="/dashboard/faq/nouveau"
      itemNounSingular="une question"
      itemNounPlural="des questions"
      initialItems={FAQ_MOCK}
    />
  );
}
