'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ImagePickerDialog } from '@/components/media-library/ImagePickerDialog';
import { SEED_FOLDERS, SEED_IMAGES } from '@/lib/mediaLibrary/seed';
import type { ImagePickerConfig, MediaFolder, MediaImage, PickedImage } from '@/types/mediaLibrary';

export type NewMediaImage = Omit<MediaImage, 'id' | 'createdAt' | 'altText'>;

interface MediaLibraryStore {
  folders: MediaFolder[];
  images: MediaImage[];
  addImage: (image: NewMediaImage) => MediaImage;
  updateAltText: (imageId: string, altText: string) => void;
  /** Résout avec les images choisies, ou null si l'agent annule. */
  openImagePicker: (config: ImagePickerConfig) => Promise<PickedImage[] | null>;
}

interface PickerSession {
  /** Change à chaque ouverture : la modale est remontée et repart d'un état propre. */
  key: number;
  config: ImagePickerConfig;
  resolve: (result: PickedImage[] | null) => void;
}

const MediaLibraryContext = createContext<MediaLibraryStore | null>(null);

function randomImageId(): string {
  return `image-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Proto sans backend : la médiathèque vit en mémoire le temps de la session.
export function MediaLibraryProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<MediaImage[]>(SEED_IMAGES);
  const [session, setSession] = useState<PickerSession | null>(null);
  const [open, setOpen] = useState(false);
  const objectUrls = useRef<string[]>([]);
  const sessionCounter = useRef(0);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addImage = useCallback((input: NewMediaImage) => {
    const image: MediaImage = { ...input, id: randomImageId(), createdAt: Date.now(), altText: '' };
    if (image.url.startsWith('blob:')) objectUrls.current.push(image.url);
    setImages((prev) => [image, ...prev]);
    return image;
  }, []);

  const updateAltText = useCallback((imageId: string, altText: string) => {
    setImages((prev) => prev.map((image) => (image.id === imageId ? { ...image, altText } : image)));
  }, []);

  const openImagePicker = useCallback((config: ImagePickerConfig) => {
    return new Promise<PickedImage[] | null>((resolve) => {
      sessionCounter.current += 1;
      setSession({ key: sessionCounter.current, config, resolve });
      setOpen(true);
    });
  }, []);

  const close = useCallback(
    (result: PickedImage[] | null) => {
      session?.resolve(result);
      setOpen(false);
    },
    [session],
  );

  const store = useMemo<MediaLibraryStore>(
    () => ({ folders: SEED_FOLDERS, images, addImage, updateAltText, openImagePicker }),
    [images, addImage, updateAltText, openImagePicker],
  );

  return (
    <MediaLibraryContext.Provider value={store}>
      {children}
      {session && <ImagePickerDialog key={session.key} open={open} config={session.config} onClose={close} />}
    </MediaLibraryContext.Provider>
  );
}

export function useMediaLibrary(): MediaLibraryStore {
  const store = useContext(MediaLibraryContext);
  if (!store) throw new Error('useMediaLibrary doit être utilisé dans un MediaLibraryProvider');
  return store;
}
