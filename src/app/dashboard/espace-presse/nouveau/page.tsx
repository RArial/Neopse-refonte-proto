import type { Metadata } from 'next';
import { PressReleaseForm } from '@/components/espace-presse/PressReleaseForm';

export const metadata: Metadata = {
  title: 'Nouveau communiqué',
};

export default function NouveauPressReleasePage() {
  return <PressReleaseForm />;
}
