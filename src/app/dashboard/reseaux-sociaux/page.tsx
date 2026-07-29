import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { SOCIAL_ACCOUNTS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Réseaux sociaux',
};

export default function SocialAccountPage() {
  return (
    <ContentListPage
      title="Réseaux sociaux"
      description="Affichez vos comptes et derniers posts directement sur votre site."
      addLabel="Ajouter un compte"
      addHref="/dashboard/reseaux-sociaux/nouveau"
      itemNounSingular="un compte"
      itemNounPlural="des comptes"
      initialItems={SOCIAL_ACCOUNTS_MOCK}
    />
  );
}
