import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditoForm } from '@/components/editos/EditoForm';
import { EDITO_ARTICLES } from '@/types/editos';

export const metadata: Metadata = {
  title: 'Modifier un edito',
};

interface EditEditoPageProps {
  params: Promise<{ editoId: string }>;
}

export default async function EditEditoPage({ params }: EditEditoPageProps) {
  const { editoId } = await params;
  const article = EDITO_ARTICLES.find((candidate) => candidate.id === editoId);

  if (!article) notFound();

  return <EditoForm mode="edit" initialArticle={article} />;
}
