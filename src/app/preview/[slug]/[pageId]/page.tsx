import type { Metadata } from 'next';
import { EmbeddedPreviewClient } from '@/components/personnalisation/preview-site/EmbeddedPreviewClient';

export const metadata: Metadata = {
  title: 'Prévisualisation',
  robots: { index: false, follow: false },
};

interface EmbeddedPreviewPageProps {
  params: Promise<{ slug: string; pageId: string }>;
}

/**
 * Cible embarquée dans l'iframe de l'éditeur de personnalisation :
 * `/preview/{siteId}/{pageId}?variant={variantId}`. Ne rend rien de figé — les tokens sont
 * poussés en direct par l'éditeur parent via `postMessage` (voir EmbeddedPreviewClient).
 */
export default async function EmbeddedPreviewPage({ params }: EmbeddedPreviewPageProps) {
  const { pageId } = await params;
  return <EmbeddedPreviewClient pageId={pageId} />;
}
