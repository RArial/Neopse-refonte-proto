'use client';

import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { NewsForm } from '@/components/actualites/NewsForm';
import { useNews } from '@/components/actualites/NewsProvider';

function NewsFormSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Chargement de l'actualité…" sx={{ px: { xs: 2, md: 3.5 }, py: 3, maxWidth: 1600, mx: 'auto', width: '100%' }}>
      <Skeleton variant="text" width={280} height={44} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 3 }}>
        <Skeleton variant="rounded" height={420} sx={{ flexBasis: 300, flexShrink: 0 }} />
        <Skeleton variant="rounded" height={420} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={420} sx={{ flexBasis: 280, flexShrink: 0 }} />
      </Stack>
    </Box>
  );
}

// Le formulaire s'initialise une seule fois : on attend que la session soit relue avant de le monter.
export function NewsCreateRoute() {
  const news = useNews();
  if (!news.hydrated) return <NewsFormSkeleton />;
  return <NewsForm />;
}

export function NewsEditRoute({ articleId }: { articleId: string }) {
  const news = useNews();
  if (!news.hydrated) return <NewsFormSkeleton />;
  const article = news.articles.find((candidate) => candidate.id === articleId);
  if (!article) notFound();
  return <NewsForm key={articleId} initialArticle={article} />;
}
