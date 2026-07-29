import type { Metadata } from 'next';
import { MarcheForm } from '@/components/marches/MarcheForm';

export const metadata: Metadata = {
  title: 'Nouveau marché',
};

export default function NouveauMarchePage() {
  return <MarcheForm mode="create" />;
}
