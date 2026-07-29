import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CarpoolingForm } from '@/components/covoiturage/CarpoolingForm';
import { CARPOOLING_MOCK } from '@/types/covoiturage';

export const metadata: Metadata = {
  title: 'Modifier une annonce de covoiturage',
};

interface EditCarpoolingPageProps {
  params: Promise<{ carpoolingId: string }>;
}

export default async function EditCarpoolingPage({ params }: EditCarpoolingPageProps) {
  const { carpoolingId } = await params;
  const carpooling = CARPOOLING_MOCK.find((candidate) => candidate.id === carpoolingId);

  if (!carpooling) notFound();

  return <CarpoolingForm mode="edit" initialCarpooling={carpooling} />;
}
