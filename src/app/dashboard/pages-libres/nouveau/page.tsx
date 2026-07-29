import type { Metadata } from 'next';
import { FreePageForm } from '@/components/pages-libres/FreePageForm';

export const metadata: Metadata = {
  title: 'Nouvelle page libre',
};

export default function NouveauFreePagePage() {
  return <FreePageForm />;
}
