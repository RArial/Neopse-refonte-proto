import type { Metadata } from 'next';
import { DirectoryProfessionalForm } from '@/components/annuaire/DirectoryProfessionalForm';

export const metadata: Metadata = {
  title: 'Nouveau professionnel de santé',
};

export default function NouveauProfessionnelSantePage() {
  return (
    <DirectoryProfessionalForm
      mediaFolder="Annuaire de la santé"
      title="Nouveau professionnel de santé"
      nounLabel="professionnel"
      backHref="/dashboard/annuaire-sante"
      backLabel="Retour à l'annuaire de la santé"
    />
  );
}
