'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ImagePickerDialog } from '@/components/media-library/ImagePickerDialog';
import { ROOT_FOLDER_ID, SEED_FOLDERS, SEED_IMAGES } from '@/lib/mediaLibrary/seed';
import type { ImagePickerConfig, ImagePickerOptions, MediaFolder, MediaImage, PickedImage } from '@/types/mediaLibrary';

export type NewMediaImage = Omit<MediaImage, 'id' | 'createdAt' | 'altText'>;

interface MediaLibraryStore {
  folders: MediaFolder[];
  images: MediaImage[];
  addImage: (image: NewMediaImage) => MediaImage;
  updateAltText: (imageId: string, altText: string) => void;
  /** Identifiant du dossier de ce nom sous « Site », créé s'il n'existe pas. */
  ensureFolder: (name: string) => string;
  /** Résout avec les images choisies, ou null si l'agent annule. */
  openImagePicker: (config: ImagePickerConfig, options?: ImagePickerOptions) => Promise<PickedImage[] | null>;
}

interface PickerSession {
  /** Change à chaque ouverture : la modale est remontée et repart d'un état propre. */
  key: number;
  config: ImagePickerConfig;
  options: ImagePickerOptions;
  resolve: (result: PickedImage[] | null) => void;
}

const MediaLibraryContext = createContext<MediaLibraryStore | null>(null);

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Proto sans backend : la médiathèque vit en mémoire le temps de la session.
export function MediaLibraryProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<MediaImage[]>(SEED_IMAGES);
  const [folders, setFolders] = useState<MediaFolder[]>(SEED_FOLDERS);
  const [session, setSession] = useState<PickerSession | null>(null);
  const [open, setOpen] = useState(false);
  const objectUrls = useRef<string[]>([]);
  const sessionCounter = useRef(0);
  // Deux imports lancés dans le même rendu ne doivent pas créer deux fois le même dossier.
  const foldersRef = useRef(folders);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addImage = useCallback((input: NewMediaImage) => {
    const image: MediaImage = { ...input, id: randomId('image'), createdAt: Date.now(), altText: '' };
    if (image.url.startsWith('blob:')) objectUrls.current.push(image.url);
    setImages((prev) => [image, ...prev]);
    return image;
  }, []);

  const updateAltText = useCallback((imageId: string, altText: string) => {
    setImages((prev) => prev.map((image) => (image.id === imageId ? { ...image, altText } : image)));
  }, []);

  const ensureFolder = useCallback((name: string) => {
    const root = foldersRef.current.find((folder) => folder.id === ROOT_FOLDER_ID);
    if (root && root.name === name) return root.id;
    const existing = foldersRef.current.find((folder) => folder.parentId === ROOT_FOLDER_ID && folder.name === name);
    if (existing) return existing.id;
    const folder: MediaFolder = { id: randomId('folder'), name, parentId: ROOT_FOLDER_ID };
    foldersRef.current = [...foldersRef.current, folder];
    setFolders(foldersRef.current);
    return folder.id;
  }, []);

  const openImagePicker = useCallback((config: ImagePickerConfig, options: ImagePickerOptions = {}) => {
    return new Promise<PickedImage[] | null>((resolve) => {
      sessionCounter.current += 1;
      setSession({ key: sessionCounter.current, config, options, resolve });
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
    () => ({ folders, images, addImage, updateAltText, ensureFolder, openImagePicker }),
    [folders, images, addImage, updateAltText, ensureFolder, openImagePicker],
  );

  return (
    <MediaLibraryContext.Provider value={store}>
      {children}
      {session && <ImagePickerDialog key={session.key} open={open} config={session.config} options={session.options} onClose={close} />}
    </MediaLibraryContext.Provider>
  );
}

export function useMediaLibrary(): MediaLibraryStore {
  const store = useContext(MediaLibraryContext);
  if (!store) throw new Error('useMediaLibrary doit être utilisé dans un MediaLibraryProvider');
  return store;
}
