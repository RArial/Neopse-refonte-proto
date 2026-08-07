import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReponsesDetail } from '@/components/formulaires/ReponsesDetail';
import { FORMS } from '@/types/formulaires';

export const metadata: Metadata = {
  title: 'Réponses du formulaire',
};

interface FormulaireReponsesPageProps {
  params: Promise<{ fileId: string }>;
}

export default async function FormulaireReponsesPage({ params }: FormulaireReponsesPageProps) {
  const { fileId } = await params;
  const form = FORMS.find((candidate) => candidate.id === fileId);

  if (!form) notFound();

  return <ReponsesDetail form={form} />;
}
