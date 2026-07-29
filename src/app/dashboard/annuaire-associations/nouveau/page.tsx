import type { Metadata } from 'next';
import { AssociationForm } from '@/components/annuaire/AssociationForm';

export const metadata: Metadata = {
  title: 'Nouvelle association',
};

export default function NouvelleAssociationPage() {
  return <AssociationForm />;
}
