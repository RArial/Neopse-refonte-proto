import type { Metadata } from 'next';
import { LinkForm } from '@/components/liens/LinkForm';

export const metadata: Metadata = {
  title: 'Nouveau lien',
};

export default function NouveauLinkPage() {
  return <LinkForm />;
}
