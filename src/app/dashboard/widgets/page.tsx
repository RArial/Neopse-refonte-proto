import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { WIDGETS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Widgets personnalisés',
};

export default function WidgetPage() {
  return (
    <ContentListPage
      title="Widgets personnalisés"
      description="Ajoutez des blocs personnalisés (météo, horaires, etc.) sur vos pages."
      addLabel="Ajouter un widget"
      addHref="/dashboard/widgets/nouveau"
      itemNounSingular="un widget"
      itemNounPlural="des widgets"
      initialItems={WIDGETS_MOCK}
    />
  );
}
