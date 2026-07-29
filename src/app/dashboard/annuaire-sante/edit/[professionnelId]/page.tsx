import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DirectoryProfessionalForm } from '@/components/annuaire/DirectoryProfessionalForm';
import { HEALTH_DIRECTORY_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Modifier un professionnel de santé',
};

interface EditProfessionnelSantePageProps {
  params: Promise<{ professionnelId: string }>;
}

export default async function EditProfessionnelSantePage({ params }: EditProfessionnelSantePageProps) {
  const { professionnelId } = await params;
  const professionnel = HEALTH_DIRECTORY_MOCK.find((candidate) => candidate.id === professionnelId);

  if (!professionnel) notFound();

  return (
    <DirectoryProfessionalForm
      mode="edit"
      initialItem={professionnel}
      title="Modifier un professionnel de santé"
      nounLabel="professionnel"
      backHref="/dashboard/annuaire-sante"
      backLabel="Retour à l'annuaire de la santé"
    />
  );
}
