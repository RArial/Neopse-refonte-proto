import type { Metadata } from 'next';
import { VideoForm } from '@/components/galerie-videos/VideoForm';

export const metadata: Metadata = {
  title: 'Nouvelle vidéo',
};

export default function NouveauVideoPage() {
  return <VideoForm mode="create" />;
}
