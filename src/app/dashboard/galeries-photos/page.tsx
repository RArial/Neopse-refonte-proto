import type { Metadata } from 'next';
import { PhotoGalleryList } from '@/components/galeries-photos/PhotoGalleryList';

export const metadata: Metadata = {
  title: 'Galeries de photos',
};

export default function PhotoAlbumPage() {
  return <PhotoGalleryList />;
}
