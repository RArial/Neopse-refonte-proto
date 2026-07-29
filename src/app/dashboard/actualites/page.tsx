import type { Metadata } from 'next';
import { NewsList } from '@/components/actualites/NewsList';

export const metadata: Metadata = {
  title: 'Actualités',
};

export default function ActualitesPage() {
  return <NewsList />;
}
