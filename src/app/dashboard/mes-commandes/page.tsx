import type { Metadata } from 'next';
import { CommandesTable } from '@/components/commandes/CommandesTable';

export const metadata: Metadata = {
  title: 'Mes commandes',
};

export default function MesCommandesPage() {
  return <CommandesTable />;
}
