import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { FEEDS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Externalisation des flux',
};

export default function FeedPage() {
  return (
    <ContentListPage
      title="Externalisation des flux"
      description="Diffusez automatiquement vos contenus vers des sites partenaires."
      addLabel="Ajouter un flux"
      addHref="/dashboard/flux/nouveau"
      itemNounSingular="un flux"
      itemNounPlural="des flux"
      initialItems={FEEDS_MOCK}
    />
  );
}
