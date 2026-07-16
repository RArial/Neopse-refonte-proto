import type { Metadata } from 'next';
import { ParrainageForm } from '@/components/parrainage/ParrainageForm';

export const metadata: Metadata = {
  title: 'Parrainage',
};

export default function ParrainagePage() {
  return <ParrainageForm />;
}
