import type { Metadata } from 'next';
import { VariantHubPage } from '@/components/personnalisation/VariantHubPage';

export const metadata: Metadata = {
  title: 'Apparence',
};

export default function PersonnalisationPage() {
  return <VariantHubPage />;
}
