import type { MediaImage, SortKey, SortState } from '@/types/mediaLibrary';

const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

const COMPARATORS: Record<SortKey, (a: MediaImage, b: MediaImage) => number> = {
  date: (a, b) => a.createdAt - b.createdAt,
  name: (a, b) => collator.compare(a.name, b.name),
  size: (a, b) => a.size - b.size,
  dimensions: (a, b) => a.width * a.height - b.width * b.height,
};

export function sortImages(images: MediaImage[], sort: SortState): MediaImage[] {
  const compare = COMPARATORS[sort.key];
  const sign = sort.direction === 'asc' ? 1 : -1;
  return [...images].sort((a, b) => sign * compare(a, b) || collator.compare(a.name, b.name));
}

/** Tris proposés en vue grille, qui n'a pas d'en-têtes de colonnes. */
export const GRID_SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: 'date-desc', label: "Plus récentes d'abord", sort: { key: 'date', direction: 'desc' } },
  { value: 'date-asc', label: "Plus anciennes d'abord", sort: { key: 'date', direction: 'asc' } },
  { value: 'name-asc', label: 'Nom de A à Z', sort: { key: 'name', direction: 'asc' } },
  { value: 'name-desc', label: 'Nom de Z à A', sort: { key: 'name', direction: 'desc' } },
  { value: 'size-desc', label: "Plus lourdes d'abord", sort: { key: 'size', direction: 'desc' } },
];

export function sortToValue(sort: SortState): string {
  return `${sort.key}-${sort.direction}`;
}
