import type { Metadata } from 'next';
import { AnnonceList } from '@/components/petites-annonces/AnnonceList';

export const metadata: Metadata = {
  title: 'Petites annonces',
};

export default function PetitesAnnoncesPage() {
  return <AnnonceList />;
}
