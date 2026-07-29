import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideoForm } from '@/components/galerie-videos/VideoForm';
import { VIDEOS_MOCK } from '@/types/videos';

export const metadata: Metadata = {
  title: 'Modifier une vidéo',
};

interface EditVideoPageProps {
  params: Promise<{ videoId: string }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const { videoId } = await params;
  const video = VIDEOS_MOCK.find((candidate) => candidate.id === videoId);

  if (!video) notFound();

  return <VideoForm mode="edit" initialVideo={video} />;
}
