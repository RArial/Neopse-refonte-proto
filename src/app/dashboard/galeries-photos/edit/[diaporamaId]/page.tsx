import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PhotoDiaporamaForm } from '@/components/galeries-photos/PhotoDiaporamaForm';
import { PHOTO_DIAPORAMAS_MOCK } from '@/types/galeriesPhotos';

export const metadata: Metadata = {
  title: 'Modifier un diaporama',
};

interface EditDiaporamaPageProps {
  params: Promise<{ diaporamaId: string }>;
}

export default async function EditDiaporamaPage({ params }: EditDiaporamaPageProps) {
  const { diaporamaId } = await params;
  const diaporama = PHOTO_DIAPORAMAS_MOCK.find((candidate) => candidate.id === diaporamaId);

  if (!diaporama) notFound();

  return <PhotoDiaporamaForm mode="edit" initialDiaporama={diaporama} />;
}
