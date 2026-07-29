import type { Metadata } from 'next';
import { GuideDemarchesForm } from '@/components/guide-demarches/GuideDemarchesForm';

export const metadata: Metadata = {
  title: 'Guide des démarches',
};

export default function GuideDemarchesPage() {
  return <GuideDemarchesForm />;
}
