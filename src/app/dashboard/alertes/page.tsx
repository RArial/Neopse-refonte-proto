import type { Metadata } from 'next';
import { AlertList } from '@/components/alertes/AlertList';

export const metadata: Metadata = {
  title: 'Alertes',
};

export default function AlertesPage() {
  return <AlertList />;
}
