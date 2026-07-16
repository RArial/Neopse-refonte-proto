import type { Metadata } from 'next';
import { AbonnementsList } from '@/components/abonnements/AbonnementsList';

export const metadata: Metadata = {
  title: 'Mes abonnements',
};

export default function AbonnementsPage() {
  return <AbonnementsList />;
}
