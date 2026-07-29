import type { Metadata } from 'next';
import { PublicationList } from '@/components/publications/PublicationList';

export const metadata: Metadata = {
  title: 'Publication',
};

export default function PublicationPage() {
  return <PublicationList />;
}
