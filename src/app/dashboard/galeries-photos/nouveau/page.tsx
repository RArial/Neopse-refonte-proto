import type { Metadata } from 'next';
import { PhotoDiaporamaForm } from '@/components/galeries-photos/PhotoDiaporamaForm';

export const metadata: Metadata = {
  title: 'Créer un diaporama',
};

export default function NouveauPhotoDiaporamaPage() {
  return <PhotoDiaporamaForm mode="create" />;
}
