import type { Metadata } from 'next';
import { VideoList } from '@/components/galerie-videos/VideoList';

export const metadata: Metadata = {
  title: 'Galerie de vidéos',
};

export default function VideoPage() {
  return <VideoList />;
}
