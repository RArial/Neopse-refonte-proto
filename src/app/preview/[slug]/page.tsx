import type { Metadata } from 'next';
import Link from 'next/link';
import { PreviewSite } from '@/components/personnalisation/preview-site/PreviewSite';
import { resolveSeedPalette, SEED_VARIANTS } from '@/lib/personnalisation/seed';
import { PAGE_GABARITS } from '@/types/personnalisation';

export const metadata: Metadata = {
  title: 'Aperçu du site',
  robots: { index: false, follow: false },
};

interface StandalonePreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Page d'aperçu partageable d'une variante : `/preview/{previewSlug}`, navigation libre entre
 * les gabarits. Recherche la variante dans le jeu de données de départ (pas de backend, pas de
 * localStorage) : un aperçu ouvert dans un nouvel onglet ne reflète donc pas des éditions faites
 * en direct dans l'éditeur de la même session — seules les variantes enregistrées au chargement
 * de l'application sont consultables ici.
 */
export default async function StandalonePreviewPage({ params, searchParams }: StandalonePreviewPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const variant = SEED_VARIANTS.find((v) => v.previewSlug === slug);
  const pageId = page && PAGE_GABARITS.some((g) => g.id === page) ? page : 'accueil';

  if (!variant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <p className="text-sm text-gray-500">Cet aperçu n&apos;est plus disponible.</p>
      </div>
    );
  }

  return (
    <div className="pb-14">
      <nav className="bg-black/5 border-b border-black/10 px-6 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
        {PAGE_GABARITS.map((g) => (
          <Link
            key={g.id}
            href={`/preview/${slug}?page=${g.id}`}
            className={g.id === pageId ? 'underline underline-offset-4 font-bold' : 'hover:underline underline-offset-4'}
          >
            {g.label}
          </Link>
        ))}
      </nav>

      <PreviewSite pageId={pageId} tokens={variant.tokens} palette={resolveSeedPalette(variant.tokens.paletteId)} />

      <div
        className="fixed bottom-0 inset-x-0 bg-black text-white text-xs text-center py-2 px-4 z-50"
        role="status"
      >
        Aperçu — variante {variant.name} ·{' '}
        {variant.status === 'published' ? 'actuellement en ligne' : 'non publiée'}
      </div>
    </div>
  );
}
