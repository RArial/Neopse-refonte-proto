import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { LABELS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Labels',
};

export default function LabelPage() {
  return (
    <ContentListPage
      title="Labels"
      description="Valorisez les labels et certifications obtenus par votre collectivité."
      addLabel="Ajouter un label"
      addHref="/dashboard/labels/nouveau"
      itemNounSingular="un label"
      itemNounPlural="des labels"
      initialItems={LABELS_MOCK}
    />
  );
}
