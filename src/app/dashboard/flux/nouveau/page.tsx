import type { Metadata } from 'next';
import { FeedForm } from '@/components/flux/FeedForm';

export const metadata: Metadata = {
  title: 'Nouveau flux',
};

export default function NouveauFeedPage() {
  return <FeedForm />;
}
