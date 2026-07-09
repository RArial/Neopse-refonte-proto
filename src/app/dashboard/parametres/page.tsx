import type { Metadata } from 'next';
import { ParametresForm } from '@/components/parametres/ParametresForm';

export const metadata: Metadata = {
  title: 'Paramètres',
};

export default function ParametresPage() {
  return <ParametresForm />;
}
