import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JobListingForm } from '@/components/annonces-emploi/JobListingForm';
import { JOB_LISTINGS } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: "Modifier une annonce d'emploi",
};

interface EditAnnonceEmploiPageProps {
  params: Promise<{ annonceId: string }>;
}

export default async function EditAnnonceEmploiPage({ params }: EditAnnonceEmploiPageProps) {
  const { annonceId } = await params;
  const annonce = JOB_LISTINGS.find((candidate) => candidate.id === annonceId);

  if (!annonce) notFound();

  return <JobListingForm mode="edit" initialItem={annonce} />;
}
