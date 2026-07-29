import type { Metadata } from 'next';
import { ArchivableListPage } from '@/components/pages-modules/ArchivableListPage';
import { JOB_LISTINGS } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: "Annonces d'emploi",
};

export default function AnnoncesEmploiPage() {
  return (
    <ArchivableListPage
      title="Annonces d'emploi"
      description="Publiez les offres d'emploi de votre collectivité."
      addLabel="Ajouter une annonce"
      addHref="/dashboard/annonces-emploi/nouveau"
      editHrefBase="/dashboard/annonces-emploi/edit"
      itemNounSingular="une annonce"
      itemNounPlural="des annonces d'emploi"
      initialItems={JOB_LISTINGS}
    />
  );
}
