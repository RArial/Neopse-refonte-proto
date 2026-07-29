import type { Metadata } from 'next';
import { MemberForm } from '@/components/trombinoscope/MemberForm';

export const metadata: Metadata = {
  title: 'Nouveau membre',
};

export default function NouveauMembrePage() {
  return <MemberForm mode="create" />;
}
