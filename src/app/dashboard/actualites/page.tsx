import { Suspense } from 'react';
import type { Metadata } from 'next';
import { NewsList } from '@/components/actualites/NewsList';
import ActualitesLoading from '@/app/dashboard/actualites/loading';

export const metadata: Metadata = {
  title: 'Actualités',
};

export default function ActualitesPage() {
  return (
    // Filtre et recherche vivent dans l'URL (useSearchParams) : la liste doit être sous un Suspense.
    <Suspense fallback={<ActualitesLoading />}>
      <NewsList />
    </Suspense>
  );
}
