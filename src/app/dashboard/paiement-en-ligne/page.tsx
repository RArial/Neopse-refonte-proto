import type { Metadata } from 'next';
import { PaiementEnLigneForm } from '@/components/paiement-en-ligne/PaiementEnLigneForm';

export const metadata: Metadata = {
  title: 'Paiement en ligne',
};

export default function PaiementEnLignePage() {
  return <PaiementEnLigneForm />;
}
