import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FormBuilder } from '@/components/formulaires/FormBuilder';
import { MANAGER_SECTIONS } from '@/types/gestionnaire';

export const metadata: Metadata = {
  title: 'Modifier le formulaire',
};

interface EditFormulairePageProps {
  params: Promise<{ fileId: string }>;
}

export default async function EditFormulairePage({ params }: EditFormulairePageProps) {
  const { fileId } = await params;
  const formulairesSection = MANAGER_SECTIONS.find((section) => section.id === 'formulaires');
  const file = formulairesSection?.files.find((candidate) => candidate.id === fileId && candidate.kind === 'form');

  if (!file) notFound();

  return <FormBuilder mode="edit" initialFile={file} />;
}
