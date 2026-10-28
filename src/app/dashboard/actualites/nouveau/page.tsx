import type { Metadata } from 'next';
import { NewsCreateRoute } from '@/components/actualites/NewsRoutes';

export const metadata: Metadata = {
  title: 'Nouvelle actualité',
};

export default function NouvelleActualitePage() {
  return <NewsCreateRoute />;
}
