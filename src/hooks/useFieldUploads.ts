'use client';

import { useState } from 'react';
import { useSimulatedUploads } from '@/hooks/useSimulatedUploads';
import type { MediaImage, UploadItem } from '@/types/mediaLibrary';

interface UseFieldUploadsOptions {
  folder: string;
  /** Image prête à placer dans le champ : importée, ou existante choisie face à un doublon. */
  onImage: (image: MediaImage) => void;
}

/** Import direct depuis un champ, sans modale : mêmes règles (refus, doublons) que dans la médiathèque. */
export function useFieldUploads({ folder, onImage }: UseFieldUploadsOptions) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const engine = useSimulatedUploads(folder, {
    onQueued: (items) => setUploads((prev) => [...prev, ...items]),
    onProgress: (uploadId, progress) => setUploads((prev) => prev.map((item) => (item.id === uploadId ? { ...item, progress } : item))),
    onSucceeded: (uploadId, image) => {
      setUploads((prev) => prev.filter((item) => item.id !== uploadId));
      onImage(image);
    },
    onFailed: (uploadId, reason) =>
      setUploads((prev) => prev.map((item) => (item.id === uploadId ? { ...item, status: 'rejected', reason } : item))),
  });

  function discard(item: UploadItem) {
    engine.releaseUpload(item);
    setUploads((prev) => prev.filter((upload) => upload.id !== item.id));
  }

  function keepExisting(item: UploadItem, existing: MediaImage) {
    discard(item);
    onImage(existing);
  }

  function force(item: UploadItem) {
    setUploads((prev) => prev.map((upload) => (upload.id === item.id ? { ...upload, status: 'uploading', progress: 0, duplicateOfId: undefined } : upload)));
    engine.forceUpload(item);
  }

  return { uploads, importFiles: engine.importFiles, discard, keepExisting, force };
}
