import type { Metadata } from 'next';
import { FaqForm } from '@/components/faq/FaqForm';

export const metadata: Metadata = {
  title: 'Nouvelle question',
};

export default function NouveauFaqPage() {
  return <FaqForm />;
}
