import type { Metadata } from 'next';
import { PublicationForm } from '@/components/publications/PublicationForm';

export const metadata: Metadata = {
  title: 'Nouvelle publication',
};

export default function NouveauPublicationPage() {
  return <PublicationForm mode="create" />;
}
