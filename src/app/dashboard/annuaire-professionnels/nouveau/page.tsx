import type { Metadata } from 'next';
import { DirectoryProfessionalForm } from '@/components/annuaire/DirectoryProfessionalForm';

export const metadata: Metadata = {
  title: 'Nouveau professionnel',
};

export default function NouveauProfessionnelPage() {
  return (
    <DirectoryProfessionalForm
      mediaFolder="Annuaire des professionnels"
      title="Nouveau professionnel"
      nounLabel="professionnel"
      backHref="/dashboard/annuaire-professionnels"
      backLabel="Retour à l'annuaire des professionnels"
    />
  );
}
