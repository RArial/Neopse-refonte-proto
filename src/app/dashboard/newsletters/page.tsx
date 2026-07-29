import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { NEWSLETTERS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Newsletters',
};

export default function NewsletterPage() {
  return (
    <ContentListPage
      title="Newsletters"
      description="Créez et envoyez des newsletters à vos abonnés."
      addLabel="Ajouter une newsletter"
      addHref="/dashboard/newsletters/nouveau"
      itemNounSingular="une newsletter"
      itemNounPlural="des newsletters"
      initialItems={NEWSLETTERS_MOCK}
    />
  );
}
