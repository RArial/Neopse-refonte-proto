import type { Metadata } from 'next';
import { FooterLinkForm } from '@/components/contenu/footer/FooterLinkForm';

export const metadata: Metadata = {
  title: 'Modifier un lien',
};

interface EditLienPiedDePagePageProps {
  params: Promise<{ linkId: string }>;
}

export default async function EditLienPiedDePagePage({ params }: EditLienPiedDePagePageProps) {
  const { linkId } = await params;
  return <FooterLinkForm mode="edit" linkId={linkId} />;
}
