import type { Metadata } from 'next';
import { TwinTownForm } from '@/components/jumelages/TwinTownForm';

export const metadata: Metadata = {
  title: 'Nouveau jumelage',
};

export default function NouveauTwinTownPage() {
  return <TwinTownForm />;
}
