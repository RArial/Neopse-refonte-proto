import type { Metadata } from 'next';
import { ArchivableListPage } from '@/components/pages-modules/ArchivableListPage';
import { HEALTH_DIRECTORY_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Annuaire de la santé',
};

export default function AnnuaireSantePage() {
  return (
    <ArchivableListPage
      title="Annuaire de la santé"
      description="Référencez les professionnels de santé de votre territoire."
      addLabel="Ajouter un professionnel"
      addHref="/dashboard/annuaire-sante/nouveau"
      editHrefBase="/dashboard/annuaire-sante/edit"
      itemNounSingular="un professionnel"
      itemNounPlural="l'annuaire de la santé"
      initialItems={HEALTH_DIRECTORY_MOCK}
    />
  );
}
