import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DirectoryProfessionalForm } from '@/components/annuaire/DirectoryProfessionalForm';
import { PROFESSIONALS_DIRECTORY_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Modifier un professionnel',
};

interface EditProfessionnelPageProps {
  params: Promise<{ professionnelId: string }>;
}

export default async function EditProfessionnelPage({ params }: EditProfessionnelPageProps) {
  const { professionnelId } = await params;
  const professionnel = PROFESSIONALS_DIRECTORY_MOCK.find((candidate) => candidate.id === professionnelId);

  if (!professionnel) notFound();

  return (
    <DirectoryProfessionalForm
      mediaFolder="Annuaire des professionnels"
      mode="edit"
      initialItem={professionnel}
      title="Modifier un professionnel"
      nounLabel="professionnel"
      backHref="/dashboard/annuaire-professionnels"
      backLabel="Retour à l'annuaire des professionnels"
    />
  );
}
