import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { PRESS_RELEASES_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Espace presse',
};

export default function PressReleasePage() {
  return (
    <ContentListPage
      title="Espace presse"
      description="Mettez à disposition des journalistes vos communiqués et visuels presse."
      addLabel="Ajouter un communiqué"
      addHref="/dashboard/espace-presse/nouveau"
      itemNounSingular="un communiqué"
      itemNounPlural="des communiqués"
      initialItems={PRESS_RELEASES_MOCK}
    />
  );
}
