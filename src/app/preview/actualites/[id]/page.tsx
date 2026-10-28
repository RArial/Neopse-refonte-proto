import type { Metadata } from 'next';
import { NewsProvider } from '@/components/actualites/NewsProvider';
import { NewsPreview } from '@/components/actualites/preview/NewsPreview';

export const metadata: Metadata = {
  title: "Aperçu de l'actualité",
  robots: { index: false, follow: false },
};

interface NewsPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsPreviewPage({ params }: NewsPreviewPageProps) {
  const { id } = await params;
  return (
    <NewsProvider>
      <NewsPreview articleId={id} />
    </NewsProvider>
  );
}
