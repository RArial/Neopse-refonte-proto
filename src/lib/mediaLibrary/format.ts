import type { AspectRatio } from '@/types/mediaLibrary';

const sizeFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${sizeFormatter.format(bytes / 1024)} Ko`;
  return `${sizeFormatter.format(bytes / (1024 * 1024))} Mo`;
}

export function formatDate(timestamp: number): string {
  return dateFormatter.format(timestamp);
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} px`;
}

export function formatRatio(ratio: AspectRatio): string {
  return `${ratio.width}:${ratio.height}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count > 1 ? plural : singular}`;
}

/** Nom affichable d'une image hors médiathèque (données de démo) : dernier segment de l'URL. */
export function fileNameFromUrl(url: string): string {
  if (url.startsWith('data:') || url.startsWith('blob:')) return 'Image sans nom';
  const segment = url.split('?')[0].split('/').pop();
  return segment ? decodeURIComponent(segment) : 'Image sans nom';
}
