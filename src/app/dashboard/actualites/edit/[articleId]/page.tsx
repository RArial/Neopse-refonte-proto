import type { Metadata } from 'next';
import { NewsEditRoute } from '@/components/actualites/NewsRoutes';

export const metadata: Metadata = {
  title: 'Modifier une actualité',
};

interface EditActualitePageProps {
  params: Promise<{ articleId: string }>;
}

export default async function EditActualitePage({ params }: EditActualitePageProps) {
  const { articleId } = await params;
  // Les actualités vivent côté client (session) : la recherche se fait dans NewsEditRoute.
  return <NewsEditRoute articleId={articleId} />;
}
