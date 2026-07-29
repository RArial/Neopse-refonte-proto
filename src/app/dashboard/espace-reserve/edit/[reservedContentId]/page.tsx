import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReservedContentForm } from '@/components/espace-reserve/ReservedContentForm';
import { RESERVED_CONTENTS } from '@/types/espaceReserve';

export const metadata: Metadata = {
  title: 'Modifier un contenu réservé',
};

interface EditReservedContentPageProps {
  params: Promise<{ reservedContentId: string }>;
}

export default async function EditReservedContentPage({ params }: EditReservedContentPageProps) {
  const { reservedContentId } = await params;
  const content = RESERVED_CONTENTS.find((candidate) => candidate.id === reservedContentId);

  if (!content) notFound();

  return <ReservedContentForm mode="edit" initialContent={content} />;
}
