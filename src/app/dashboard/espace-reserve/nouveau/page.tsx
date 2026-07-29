import type { Metadata } from 'next';
import { ReservedContentForm } from '@/components/espace-reserve/ReservedContentForm';

export const metadata: Metadata = {
  title: 'Nouveau contenu réservé',
};

export default function NouveauReservedContentPage() {
  return <ReservedContentForm mode="create" />;
}
