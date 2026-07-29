import type { Metadata } from 'next';
import { FooterLinkForm } from '@/components/contenu/footer/FooterLinkForm';

export const metadata: Metadata = {
  title: 'Ajouter un lien',
};

export default function NouveauLienPiedDePagePage() {
  return <FooterLinkForm mode="create" />;
}
