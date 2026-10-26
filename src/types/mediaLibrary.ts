export interface MediaFolder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface MediaImage {
  id: string;
  folderId: string;
  name: string;
  url: string;
  width: number;
  height: number;
  /** Poids en octets. */
  size: number;
  /** Horodatage d'ajout (ms). */
  createdAt: number;
  /** Partagé par tous les usages de l'image : saisi une fois, réutilisé partout. */
  altText: string;
}

export interface AspectRatio {
  width: number;
  height: number;
}

export type QuarterTurn = 0 | 90 | 180 | 270;

/** Zone recadrée, en fractions (0–1) de l'image après rotation et retournement. */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: QuarterTurn;
  flipped: boolean;
}

export type ImagePickerMode = 'single' | 'multiple';

/** Décidé par le champ, pas par l'image : un fond est décoratif, un bloc de contenu porte du sens. */
export type AltTextPolicy = 'ask' | 'decorative';

export interface ImagePickerConfig {
  mode: ImagePickerMode;
  /** Libellé du champ appelant, ex. « Vignette de l'actualité ». */
  context: string;
  /** Dossier de destination des imports (sous « Site »), créé s'il n'existe pas. Ex. « Actualités ». */
  folder: string;
  /** Absent = pas d'étape de recadrage. */
  ratio?: AspectRatio;
  /** Ex. « 1200 × 900 px » ; affiché seulement si renseigné. */
  recommendation?: string;
  altText: AltTextPolicy;
  currentImageId?: string;
  /** Recadrage en place, restauré si l'image actuelle est re-choisie. */
  currentCrop?: CropArea;
}

export interface ImagePickerOptions {
  /** Ouvre directement l'étape de recadrage sur l'image actuelle (« Modifier le cadrage »). */
  startInCrop?: boolean;
}

export interface PickedImage {
  image: MediaImage;
  crop?: CropArea;
}

export type SortKey = 'date' | 'name' | 'size' | 'dimensions';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export type UploadStatus = 'uploading' | 'rejected' | 'duplicate';

/** Fichier en cours d'import ou bloqué ; une fois importé, il devient une MediaImage. */
export interface UploadItem {
  id: string;
  file: File;
  /** Object URL : aperçu sur la carte, puis URL de l'image une fois importée. */
  previewUrl: string;
  folderId: string;
  status: UploadStatus;
  /** 0–100, pertinent en `uploading`. */
  progress: number;
  /** Raison lisible du refus, en `rejected`. */
  reason?: string;
  /** Image déjà présente, en `duplicate`. */
  duplicateOfId?: string;
}
