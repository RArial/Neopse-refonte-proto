import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventForm } from '@/components/agenda/EventForm';
import { AGENDA_EVENTS } from '@/types/agenda';

export const metadata: Metadata = {
  title: 'Modifier un événement',
};

interface EditEvenementPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEvenementPage({ params }: EditEvenementPageProps) {
  const { eventId } = await params;
  const event = AGENDA_EVENTS.find((candidate) => candidate.id === eventId);

  if (!event) notFound();

  return <EventForm mode="edit" initialEvent={event} />;
}
