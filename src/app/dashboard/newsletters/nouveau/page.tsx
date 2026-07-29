import type { Metadata } from 'next';
import { NewsletterForm } from '@/components/newsletters/NewsletterForm';

export const metadata: Metadata = {
  title: 'Nouvelle newsletter',
};

export default function NouveauNewsletterPage() {
  return <NewsletterForm />;
}
