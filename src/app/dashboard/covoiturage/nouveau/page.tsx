import type { Metadata } from 'next';
import { CarpoolingForm } from '@/components/covoiturage/CarpoolingForm';

export const metadata: Metadata = {
  title: 'Nouvelle annonce de covoiturage',
};

export default function NouvelleAnnonceCovoiturage() {
  return <CarpoolingForm mode="create" />;
}
