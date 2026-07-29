import type { Metadata } from 'next';
import { MarchePublicList } from '@/components/marches-publics/MarchePublicList';

export const metadata: Metadata = {
  title: 'Marchés publics',
};

export default function MarchesPublicsPage() {
  return <MarchePublicList />;
}
