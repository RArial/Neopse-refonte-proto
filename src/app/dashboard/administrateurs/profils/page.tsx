import type { Metadata } from 'next';
import { ProfilsList } from '@/components/administrateurs/profils/ProfilsList';

export const metadata: Metadata = {
  title: 'Profils de droits',
};

export default function ProfilsPage() {
  return <ProfilsList />;
}
