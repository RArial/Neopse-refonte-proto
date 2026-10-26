import { ACCEPTED_FORMATS_LABEL, ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/mediaLibrary/constants';
import { formatFileSize } from '@/lib/mediaLibrary/format';
import type { MediaImage } from '@/types/mediaLibrary';

const FORMAT_NAMES: Record<string, string> = { webp: 'WebP', heic: 'HEIC', svg: 'SVG', 'svg+xml': 'SVG', gif: 'GIF', tiff: 'TIFF' };

function formatNameOf(file: File): string {
  const fromMime = file.type.split('/')[1];
  const fromExtension = file.name.includes('.') ? file.name.split('.').pop() : undefined;
  const raw = (fromMime || fromExtension || 'inconnu').toLowerCase();
  return FORMAT_NAMES[raw] ?? raw.toUpperCase();
}

/** Raison du refus formulée pour l'agent (quoi + comment corriger), ou null si le fichier est accepté. */
export function getRejectionReason(file: File): string | null {
  if (!(ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return `Format ${formatNameOf(file)} non accepté. Convertissez-la en ${ACCEPTED_FORMATS_LABEL.replace(', ', ' ou ')}.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Image trop lourde (${formatFileSize(file.size)}). Le maximum est ${formatFileSize(MAX_FILE_SIZE_BYTES)} : réduisez-la avant de l'importer.`;
  }
  return null;
}

// Le proto n'a pas d'empreinte serveur : nom + poids suffit à simuler la détection.
export function findDuplicate(file: File, images: MediaImage[]): MediaImage | undefined {
  return images.find((image) => image.name === file.name && image.size === file.size);
}
