import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnnonceForm } from '@/components/petites-annonces/AnnonceForm';
import { ANNONCES_MOCK } from '@/types/petitesAnnonces';

export const metadata: Metadata = {
  title: 'Modifier une annonce',
};

interface EditAnnoncePageProps {
  params: Promise<{ annonceId: string }>;
}

export default async function EditAnnoncePage({ params }: EditAnnoncePageProps) {
  const { annonceId } = await params;
  const annonce = ANNONCES_MOCK.find((candidate) => candidate.id === annonceId);

  if (!annonce) notFound();

  return <AnnonceForm mode="edit" initialAnnonce={annonce} />;
}
