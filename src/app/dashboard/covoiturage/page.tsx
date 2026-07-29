import type { Metadata } from 'next';
import { CarpoolingList } from '@/components/covoiturage/CarpoolingList';

export const metadata: Metadata = {
  title: 'Annonces de covoiturage',
};

export default function CovoiturageListPage() {
  return <CarpoolingList />;
}
