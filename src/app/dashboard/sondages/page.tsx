import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { POLLS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Sondages',
};

export default function PollPage() {
  return (
    <ContentListPage
      title="Sondages"
      description="Recueillez l'avis de vos usagers grâce à des sondages en ligne."
      addLabel="Ajouter un sondage"
      addHref="/dashboard/sondages/nouveau"
      itemNounSingular="un sondage"
      itemNounPlural="des sondages"
      initialItems={POLLS_MOCK}
    />
  );
}
