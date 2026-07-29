import type { Metadata } from 'next';
import { ActeList } from '@/components/actes/ActeList';

export const metadata: Metadata = {
  title: 'Publication des actes',
};

export default function PublicationDesActesPage() {
  return <ActeList />;
}
