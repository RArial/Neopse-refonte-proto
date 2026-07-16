import type { Metadata } from 'next';
import { ProfilForm } from '@/components/profil/ProfilForm';

export const metadata: Metadata = {
  title: 'Mon profil',
};

export default function ProfilPage() {
  return <ProfilForm />;
}
