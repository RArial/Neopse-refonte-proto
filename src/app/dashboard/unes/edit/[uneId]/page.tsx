import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UneForm } from '@/components/unes/UneForm';
import { UNES_MOCK } from '@/types/unes';

export const metadata: Metadata = {
  title: 'Modifier une une',
};

interface EditUnePageProps {
  params: Promise<{ uneId: string }>;
}

export default async function EditUnePage({ params }: EditUnePageProps) {
  const { uneId } = await params;
  const une = UNES_MOCK.find((candidate) => candidate.id === uneId);

  if (!une) notFound();

  return <UneForm mode="edit" initialUne={une} />;
}
