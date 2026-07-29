import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AssociationForm } from '@/components/annuaire/AssociationForm';
import { ASSOCIATIONS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Modifier une association',
};

interface EditAssociationPageProps {
  params: Promise<{ associationId: string }>;
}

export default async function EditAssociationPage({ params }: EditAssociationPageProps) {
  const { associationId } = await params;
  const association = ASSOCIATIONS_MOCK.find((candidate) => candidate.id === associationId);

  if (!association) notFound();

  return <AssociationForm mode="edit" initialItem={association} />;
}
