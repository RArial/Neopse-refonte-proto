import type { Metadata } from 'next';
import { ContactPageSettingsForm } from '@/components/contacts/settings/ContactPageSettingsForm';

export const metadata: Metadata = {
  title: 'Gérer la page contact',
};

export default function ContactParametresPage() {
  return <ContactPageSettingsForm />;
}
