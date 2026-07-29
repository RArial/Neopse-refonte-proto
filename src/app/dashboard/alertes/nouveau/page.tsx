import type { Metadata } from 'next';
import { AlertForm } from '@/components/alertes/AlertForm';

export const metadata: Metadata = {
  title: 'Nouvelle alerte',
};

export default function NouvelleAlertePage() {
  return <AlertForm mode="create" />;
}
