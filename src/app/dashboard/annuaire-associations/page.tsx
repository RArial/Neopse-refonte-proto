import type { Metadata } from 'next';
import { ArchivableListPage } from '@/components/pages-modules/ArchivableListPage';
import { ASSOCIATIONS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Annuaire des associations',
};

export default function AnnuaireAssociationsPage() {
  return (
    <ArchivableListPage
      title="Annuaire des associations"
      description="Référencez les associations actives sur votre territoire."
      addLabel="Ajouter une association"
      addHref="/dashboard/annuaire-associations/nouveau"
      editHrefBase="/dashboard/annuaire-associations/edit"
      itemNounSingular="une association"
      itemNounPlural="l'annuaire des associations"
      initialItems={ASSOCIATIONS_MOCK}
    />
  );
}
