import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarcheForm } from '@/components/marches/MarcheForm';
import { MARCHES_MOCK } from '@/types/marches';

export const metadata: Metadata = {
  title: 'Modifier un marché',
};

interface EditMarchePageProps {
  params: Promise<{ marcheId: string }>;
}

export default async function EditMarchePage({ params }: EditMarchePageProps) {
  const { marcheId } = await params;
  const marche = MARCHES_MOCK.find((candidate) => candidate.id === marcheId);

  if (!marche) notFound();

  return <MarcheForm mode="edit" initialMarche={marche} />;
}
