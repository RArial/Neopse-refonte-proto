import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DirectoryProfessionalForm } from '@/components/annuaire/DirectoryProfessionalForm';
import { TOURISM_DIRECTORY_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Modifier un professionnel touristique',
};

interface EditProfessionnelTourismePageProps {
  params: Promise<{ professionnelId: string }>;
}

export default async function EditProfessionnelTourismePage({ params }: EditProfessionnelTourismePageProps) {
  const { professionnelId } = await params;
  const professionnel = TOURISM_DIRECTORY_MOCK.find((candidate) => candidate.id === professionnelId);

  if (!professionnel) notFound();

  return (
    <DirectoryProfessionalForm
      mode="edit"
      initialItem={professionnel}
      title="Modifier un professionnel touristique"
      nounLabel="professionnel"
      backHref="/dashboard/annuaire-tourisme"
      backLabel="Retour à l'annuaire touristique"
    />
  );
}
