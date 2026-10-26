import type { MediaImage, SortState } from '@/types/mediaLibrary';

export interface ImageSection {
  key: string;
  title?: string;
  images: MediaImage[];
}

const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });

function monthTitle(timestamp: number): string {
  const label = monthFormatter.format(timestamp);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Les images importées pendant l'ouverture restent en tête quel que soit le tri, sous leur propre intertitre ;
 * le reste est groupé par mois quand le tri est chronologique.
 */
export function buildSections(sorted: MediaImage[], newImageIds: string[], sort: SortState): ImageSection[] {
  const fresh = sorted.filter((image) => newImageIds.includes(image.id));
  const others = sorted.filter((image) => !newImageIds.includes(image.id));
  const sections: ImageSection[] = [];
  if (fresh.length > 0) sections.push({ key: 'fresh', title: "Importées à l'instant", images: fresh });

  if (sort.key !== 'date') {
    if (others.length > 0) sections.push({ key: 'all', title: fresh.length > 0 ? 'Autres images' : undefined, images: others });
    return sections;
  }

  others.forEach((image) => {
    const title = monthTitle(image.createdAt);
    const last = sections.at(-1);
    if (last && last.key === `month-${title}`) last.images.push(image);
    else sections.push({ key: `month-${title}`, title, images: [image] });
  });
  return sections;
}
