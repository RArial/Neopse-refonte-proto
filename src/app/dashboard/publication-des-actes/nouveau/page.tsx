import type { Metadata } from 'next';
import { ActeForm } from '@/components/actes/ActeForm';

export const metadata: Metadata = {
  title: 'Nouveau compte rendu',
};

export default function NouveauActePage() {
  return <ActeForm mode="create" />;
}
