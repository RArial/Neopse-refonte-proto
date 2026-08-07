import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FormBuilder } from '@/components/formulaires/FormBuilder';
import { FORMS } from '@/types/formulaires';

export const metadata: Metadata = {
  title: 'Modifier le formulaire',
};

interface EditFormulairePageProps {
  params: Promise<{ fileId: string }>;
}

export default async function EditFormulairePage({ params }: EditFormulairePageProps) {
  const { fileId } = await params;
  const file = FORMS.find((candidate) => candidate.id === fileId);

  if (!file) notFound();

  return <FormBuilder mode="edit" initialFile={file} />;
}
