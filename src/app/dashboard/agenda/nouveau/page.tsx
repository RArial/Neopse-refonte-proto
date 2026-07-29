import type { Metadata } from 'next';
import { EventForm } from '@/components/agenda/EventForm';

export const metadata: Metadata = {
  title: 'Nouvel événement',
};

export default function NouvelEvenementPage() {
  return <EventForm mode="create" />;
}
