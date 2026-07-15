import type { Metadata } from 'next';
import { VariantEditorRoute } from '@/components/personnalisation/VariantEditorRoute';

export const metadata: Metadata = {
  title: 'Apparence — Éditeur',
};

interface VariantEditorPageProps {
  params: Promise<{ variantId: string }>;
}

export default async function VariantEditorPage({ params }: VariantEditorPageProps) {
  const { variantId } = await params;

  return <VariantEditorRoute variantId={variantId} />;
}
