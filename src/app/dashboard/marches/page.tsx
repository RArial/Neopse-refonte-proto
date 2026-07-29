import type { Metadata } from 'next';
import { MarcheList } from '@/components/marches/MarcheList';

export const metadata: Metadata = {
  title: 'Marchés',
};

export default function MarchesPage() {
  return <MarcheList />;
}
