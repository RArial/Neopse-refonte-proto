import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsForm } from '@/components/actualites/NewsForm';
import { NEWS_ARTICLES } from '@/types/actualites';

export const metadata: Metadata = {
  title: 'Modifier une actualité',
};

interface EditActualitePageProps {
  params: Promise<{ articleId: string }>;
}

export default async function EditActualitePage({ params }: EditActualitePageProps) {
  const { articleId } = await params;
  const article = NEWS_ARTICLES.find((candidate) => candidate.id === articleId);

  if (!article) notFound();

  return <NewsForm mode="edit" initialArticle={article} />;
}
