import type { Metadata } from 'next';
import { InfosProjetForm } from '@/components/projet/InfosProjetForm';

export const metadata: Metadata = {
  title: 'Infos du projet',
};

export default function InfosProjetPage() {
  return <InfosProjetForm />;
}
