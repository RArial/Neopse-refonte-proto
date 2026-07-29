import type { Metadata } from 'next';
import { ArchivableListPage } from '@/components/pages-modules/ArchivableListPage';
import { PROFESSIONALS_DIRECTORY_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Annuaire des professionnels',
};

export default function AnnuaireProfessionnelsPage() {
  return (
    <ArchivableListPage
      title="Annuaire des professionnels"
      description="Référencez les commerçants et artisans de votre territoire."
      addLabel="Ajouter un professionnel"
      addHref="/dashboard/annuaire-professionnels/nouveau"
      editHrefBase="/dashboard/annuaire-professionnels/edit"
      itemNounSingular="un professionnel"
      itemNounPlural="l'annuaire des professionnels"
      initialItems={PROFESSIONALS_DIRECTORY_MOCK}
    />
  );
}
