import type { Metadata } from 'next';
import { ReservedMembersTable } from '@/components/espace-reserve/ReservedMembersTable';

export const metadata: Metadata = {
  title: 'Membres autorisés — Espace Réservé',
};

export default function ReservedMembersPage() {
  return <ReservedMembersTable />;
}
