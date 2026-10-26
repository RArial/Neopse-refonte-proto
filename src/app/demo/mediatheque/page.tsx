import type { Metadata } from 'next';
import { MediaLibraryDemo } from '@/components/media-library/demo/MediaLibraryDemo';

export const metadata: Metadata = {
  title: 'Démo médiathèque',
};

export default function MediathequeDemoPage() {
  return <MediaLibraryDemo />;
}
