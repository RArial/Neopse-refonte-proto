import type { Metadata } from 'next';
import { AdministrateursTable } from '@/components/administrateurs/AdministrateursTable';

export const metadata: Metadata = {
  title: 'Administrateurs',
};

export default function AdministrateursPage() {
  return <AdministrateursTable />;
}
