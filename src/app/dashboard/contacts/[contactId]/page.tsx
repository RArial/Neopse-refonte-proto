import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/contacts/ContactForm';
import { CONTACTS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Modifier un contact',
};

interface EditContactPageProps {
  params: Promise<{ contactId: string }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { contactId } = await params;
  const contact = CONTACTS_MOCK.find((candidate) => candidate.id === contactId);

  if (!contact) notFound();

  return <ContactForm mode="edit" initialContact={contact} />;
}
