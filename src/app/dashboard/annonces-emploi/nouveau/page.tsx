import type { Metadata } from 'next';
import { JobListingForm } from '@/components/annonces-emploi/JobListingForm';

export const metadata: Metadata = {
  title: "Nouvelle annonce d'emploi",
};

export default function NouvelleAnnonceEmploiPage() {
  return <JobListingForm />;
}
