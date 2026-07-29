import type { Metadata } from 'next';
import { ContactForm } from '@/components/contacts/ContactForm';

export const metadata: Metadata = {
  title: 'Nouveau contact',
};

export default function NouveauContactPage() {
  return <ContactForm mode="create" />;
}
