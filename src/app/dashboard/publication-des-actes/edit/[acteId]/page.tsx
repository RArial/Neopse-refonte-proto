import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActeForm } from '@/components/actes/ActeForm';
import { ACTES_MOCK } from '@/types/actes';

export const metadata: Metadata = {
  title: 'Modifier un compte rendu',
};

interface EditActePageProps {
  params: Promise<{ acteId: string }>;
}

export default async function EditActePage({ params }: EditActePageProps) {
  const { acteId } = await params;
  const acte = ACTES_MOCK.find((candidate) => candidate.id === acteId);

  if (!acte) notFound();

  return <ActeForm mode="edit" initialActe={acte} />;
}
