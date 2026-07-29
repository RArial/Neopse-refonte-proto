import type { Metadata } from 'next';
import { UneForm } from '@/components/unes/UneForm';

export const metadata: Metadata = {
  title: 'Nouvelle une',
};

export default function NouvelleUnePage() {
  return <UneForm mode="create" />;
}
