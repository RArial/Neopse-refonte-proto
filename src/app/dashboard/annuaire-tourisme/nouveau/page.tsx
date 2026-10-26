import type { Metadata } from 'next';
import { DirectoryProfessionalForm } from '@/components/annuaire/DirectoryProfessionalForm';

export const metadata: Metadata = {
  title: 'Nouveau professionnel touristique',
};

export default function NouveauProfessionnelTourismePage() {
  return (
    <DirectoryProfessionalForm
      mediaFolder="Annuaire du tourisme"
      title="Nouveau professionnel touristique"
      nounLabel="professionnel"
      backHref="/dashboard/annuaire-tourisme"
      backLabel="Retour à l'annuaire touristique"
    />
  );
}
