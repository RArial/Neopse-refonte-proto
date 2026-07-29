import type { Metadata } from 'next';
import { AnnonceForm } from '@/components/petites-annonces/AnnonceForm';

export const metadata: Metadata = {
  title: 'Nouvelle annonce',
};

export default function NouvelleAnnoncePage() {
  return <AnnonceForm mode="create" />;
}
