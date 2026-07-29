import type { Metadata } from 'next';
import { AgendaList } from '@/components/agenda/AgendaList';

export const metadata: Metadata = {
  title: 'Agenda',
};

export default function AgendaPage() {
  return <AgendaList />;
}
