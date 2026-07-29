import type { Metadata } from 'next';
import { EditoForm } from '@/components/editos/EditoForm';

export const metadata: Metadata = {
  title: 'Nouvel edito',
};

export default function NouveauEditoPage() {
  return <EditoForm mode="create" />;
}
