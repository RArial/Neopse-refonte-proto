import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicationForm } from '@/components/publications/PublicationForm';
import { PUBLICATIONS_MOCK } from '@/types/publications';

export const metadata: Metadata = {
  title: 'Modifier une publication',
};

interface EditPublicationPageProps {
  params: Promise<{ publicationId: string }>;
}

export default async function EditPublicationPage({ params }: EditPublicationPageProps) {
  const { publicationId } = await params;
  const publication = PUBLICATIONS_MOCK.find((candidate) => candidate.id === publicationId);

  if (!publication) notFound();

  return <PublicationForm mode="edit" initialPublication={publication} />;
}
