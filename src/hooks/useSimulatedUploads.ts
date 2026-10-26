'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { findDuplicate, getRejectionReason } from '@/lib/mediaLibrary/validation';
import type { MediaImage, UploadItem } from '@/types/mediaLibrary';

const TICK_MS = 160;

/** Chaque appelant (modale, champ) range l'état des imports à sa façon. */
export interface UploadHandlers {
  onQueued: (items: UploadItem[]) => void;
  onProgress: (uploadId: string, progress: number) => void;
  onSucceeded: (uploadId: string, image: MediaImage) => void;
  onFailed: (uploadId: string, reason: string) => void;
}

function randomUploadId(): string {
  return `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function readDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const probe = new window.Image();
    probe.onload = () => resolve({ width: probe.naturalWidth, height: probe.naturalHeight });
    probe.onerror = () => reject(new Error('decode'));
    probe.src = url;
  });
}

/**
 * Proto sans backend : la progression est simulée, le fichier reste en mémoire (object URL).
 * Les fichiers vont dans le dossier `folder` (créé au besoin), quel que soit le dossier affiché.
 */
export function useSimulatedUploads(folder: string, handlers: UploadHandlers) {
  const { images, addImage, ensureFolder } = useMediaLibrary();
  const timers = useRef(new Set<number>());
  // Aperçus pas encore devenus des images de la médiathèque : à libérer au démontage.
  const pendingPreviews = useRef(new Set<string>());
  // Les timers appellent les gestionnaires bien après le rendu qui les a lancés.
  const latestHandlers = useRef(handlers);
  useEffect(() => {
    latestHandlers.current = handlers;
  });

  useEffect(() => {
    const activeTimers = timers.current;
    const previews = pendingPreviews.current;
    return () => {
      activeTimers.forEach((timer) => window.clearInterval(timer));
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const runUpload = useCallback(
    (item: UploadItem) => {
      let progress = 0;
      const dimensions = readDimensions(item.previewUrl);
      const timer = window.setInterval(() => {
        progress = Math.min(100, progress + 12 + Math.round(Math.random() * 18));
        latestHandlers.current.onProgress(item.id, progress);
        if (progress < 100) return;
        window.clearInterval(timer);
        timers.current.delete(timer);
        dimensions
          .then(({ width, height }) => {
            pendingPreviews.current.delete(item.previewUrl);
            const image = addImage({
              folderId: item.folderId,
              name: item.file.name,
              url: item.previewUrl,
              width,
              height,
              size: item.file.size,
            });
            latestHandlers.current.onSucceeded(item.id, image);
          })
          .catch(() => {
            latestHandlers.current.onFailed(item.id, "Ce fichier n'a pas pu être lu comme une image. Vérifiez qu'il n'est pas endommagé.");
          });
      }, TICK_MS);
      timers.current.add(timer);
    },
    [addImage],
  );

  const importFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      const folderId = ensureFolder(folder);
      const items: UploadItem[] = files.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        pendingPreviews.current.add(previewUrl);
        const reason = getRejectionReason(file);
        const duplicate = reason ? undefined : findDuplicate(file, images);
        return {
          id: randomUploadId(),
          file,
          previewUrl,
          folderId,
          status: reason ? 'rejected' : duplicate ? 'duplicate' : 'uploading',
          progress: 0,
          reason: reason ?? undefined,
          duplicateOfId: duplicate?.id,
        };
      });
      latestHandlers.current.onQueued(items);
      items.filter((item) => item.status === 'uploading').forEach(runUpload);
    },
    [ensureFolder, folder, images, runUpload],
  );

  /** Libère l'aperçu d'un fichier abandonné (refus retiré, ou doublon résolu par l'image existante). */
  const releaseUpload = useCallback((item: UploadItem) => {
    URL.revokeObjectURL(item.previewUrl);
    pendingPreviews.current.delete(item.previewUrl);
  }, []);

  return { importFiles, releaseUpload, forceUpload: runUpload };
}
