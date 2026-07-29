import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SaisineDetail } from '@/components/saisine-voie-electronique/SaisineDetail';
import { SAISINES_MOCK } from '@/types/saisineVoieElectronique';

interface SaisineDetailPageProps {
  params: Promise<{ saisineId: string }>;
}

export async function generateMetadata({ params }: SaisineDetailPageProps): Promise<Metadata> {
  const { saisineId } = await params;
  const saisine = SAISINES_MOCK.find((candidate) => candidate.id === saisineId);
  return { title: saisine ? saisine.subject : 'Saisine introuvable' };
}

export default async function SaisineDetailPage({ params }: SaisineDetailPageProps) {
  const { saisineId } = await params;
  const saisine = SAISINES_MOCK.find((candidate) => candidate.id === saisineId);

  if (!saisine) notFound();

  return <SaisineDetail saisine={saisine} />;
}
