'use client';

import { useCallback, useEffect, useRef, type Dispatch } from 'react';
import type { NewMediaImage } from '@/components/media-library/MediaLibraryProvider';
import type { PickerAction } from '@/lib/mediaLibrary/pickerReducer';
import { findDuplicate, getRejectionReason } from '@/lib/mediaLibrary/validation';
import type { MediaImage, UploadItem } from '@/types/mediaLibrary';

const TICK_MS = 160;

interface UseSimulatedUploadsOptions {
  images: MediaImage[];
  dispatch: Dispatch<PickerAction>;
  addImage: (image: NewMediaImage) => MediaImage;
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

/** Proto sans backend : la progression est simulée, le fichier reste en mémoire (object URL). */
export function useSimulatedUploads({ images, dispatch, addImage }: UseSimulatedUploadsOptions) {
  const timers = useRef(new Set<number>());
  // Aperçus pas encore devenus des images de la médiathèque : à libérer si la modale se ferme.
  const pendingPreviews = useRef(new Set<string>());

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
        dispatch({ type: 'uploadProgress', uploadId: item.id, progress });
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
            dispatch({ type: 'uploadSucceeded', uploadId: item.id, imageId: image.id });
          })
          .catch(() => {
            dispatch({ type: 'uploadFailed', uploadId: item.id, reason: "Ce fichier n'a pas pu être lu comme une image. Vérifiez qu'il n'est pas endommagé." });
          });
      }, TICK_MS);
      timers.current.add(timer);
    },
    [addImage, dispatch],
  );

  const importFiles = useCallback(
    (files: File[], folderId: string) => {
      if (files.length === 0) return;
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
      dispatch({ type: 'queueUploads', items });
      items.filter((item) => item.status === 'uploading').forEach(runUpload);
    },
    [dispatch, images, runUpload],
  );

  const discardUpload = useCallback(
    (item: UploadItem) => {
      URL.revokeObjectURL(item.previewUrl);
      pendingPreviews.current.delete(item.previewUrl);
      dispatch({ type: 'removeUpload', uploadId: item.id });
    },
    [dispatch],
  );

  const keepExistingImage = useCallback(
    (item: UploadItem, existing: MediaImage) => {
      URL.revokeObjectURL(item.previewUrl);
      pendingPreviews.current.delete(item.previewUrl);
      dispatch({ type: 'useExisting', uploadId: item.id, imageId: existing.id, folderId: existing.folderId });
    },
    [dispatch],
  );

  const forceUpload = useCallback(
    (item: UploadItem) => {
      dispatch({ type: 'forceUpload', uploadId: item.id });
      runUpload(item);
    },
    [dispatch, runUpload],
  );

  return { importFiles, discardUpload, keepExistingImage, forceUpload };
}
