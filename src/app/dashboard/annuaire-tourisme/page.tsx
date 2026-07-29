import type { Metadata } from 'next';
import { ArchivableListPage } from '@/components/pages-modules/ArchivableListPage';
import { TOURISM_DIRECTORY_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Annuaire touristique',
};

export default function AnnuaireTourismePage() {
  return (
    <ArchivableListPage
      title="Annuaire touristique"
      description="Mettez en avant les sites et acteurs touristiques de votre territoire."
      addLabel="Ajouter un professionnel"
      addHref="/dashboard/annuaire-tourisme/nouveau"
      editHrefBase="/dashboard/annuaire-tourisme/edit"
      itemNounSingular="un professionnel"
      itemNounPlural="l'annuaire touristique"
      initialItems={TOURISM_DIRECTORY_MOCK}
    />
  );
}
