import type { Metadata } from 'next';
import { MarchePublicForm } from '@/components/marches-publics/MarchePublicForm';

export const metadata: Metadata = {
  title: 'Nouveau marché public',
};

export default function NouveauMarchePublicPage() {
  return <MarchePublicForm mode="create" />;
}
