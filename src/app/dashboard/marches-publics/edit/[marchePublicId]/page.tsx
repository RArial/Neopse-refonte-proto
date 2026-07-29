import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarchePublicForm } from '@/components/marches-publics/MarchePublicForm';
import { MARCHES_PUBLICS_MOCK } from '@/types/marchesPublics';

export const metadata: Metadata = {
  title: 'Modifier un marché public',
};

interface EditMarchePublicPageProps {
  params: Promise<{ marchePublicId: string }>;
}

export default async function EditMarchePublicPage({ params }: EditMarchePublicPageProps) {
  const { marchePublicId } = await params;
  const marchePublic = MARCHES_PUBLICS_MOCK.find((candidate) => candidate.id === marchePublicId);

  if (!marchePublic) notFound();

  return <MarchePublicForm mode="edit" initialMarchePublic={marchePublic} />;
}
