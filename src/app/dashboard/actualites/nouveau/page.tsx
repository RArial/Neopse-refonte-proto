import type { Metadata } from 'next';
import { NewsForm } from '@/components/actualites/NewsForm';

export const metadata: Metadata = {
  title: 'Nouvelle actualité',
};

export default function NouvelleActualitePage() {
  return <NewsForm mode="create" />;
}
