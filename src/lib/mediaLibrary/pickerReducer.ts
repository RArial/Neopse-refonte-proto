import { DEFAULT_SORT } from '@/lib/mediaLibrary/constants';
import type { CropState } from '@/lib/mediaLibrary/crop';
import type { ImagePickerMode, SortState, UploadItem } from '@/types/mediaLibrary';

export type PickerStep = 'choose' | 'crop';
export type PickerView = 'grid' | 'list';

export interface UploadBatch {
  /** Fichiers partis à l'import (hors refus immédiats et doublons en attente). */
  total: number;
  finished: number;
  succeeded: number;
}

/** Cadrage ajusté à la main ; ne vaut que pour l'image sur laquelle il a été fait. */
export interface AdjustedCrop {
  imageId: string;
  state: CropState;
}

export interface PickerState {
  mode: ImagePickerMode;
  step: PickerStep;
  /** Filtre de dossier ; null = « Toutes les images ». */
  folderId: string | null;
  search: string;
  sort: SortState;
  view: PickerView;
  /** Ordre = ordre de sélection, c'est l'ordre d'ajout au diaporama. */
  selectedIds: string[];
  /** Image détaillée dans le panneau de droite. */
  activeId: string | null;
  uploads: UploadItem[];
  /** Importées pendant cette ouverture : badge « Nouvelle » et placées en tête. */
  newImageIds: string[];
  batch: UploadBatch | null;
  crop: AdjustedCrop | null;
}

export type PickerAction =
  | { type: 'setFolder'; folderId: string | null }
  | { type: 'setSearch'; search: string }
  | { type: 'setSort'; sort: SortState }
  | { type: 'setView'; view: PickerView }
  | { type: 'toggleImage'; imageId: string }
  | { type: 'selectAll'; imageIds: string[] }
  | { type: 'deselectAll' }
  | { type: 'setActive'; imageId: string }
  | { type: 'queueUploads'; items: UploadItem[] }
  | { type: 'uploadProgress'; uploadId: string; progress: number }
  | { type: 'uploadSucceeded'; uploadId: string; imageId: string }
  | { type: 'uploadFailed'; uploadId: string; reason: string }
  | { type: 'removeUpload'; uploadId: string }
  | { type: 'useExisting'; uploadId: string; imageId: string }
  | { type: 'forceUpload'; uploadId: string }
  | { type: 'clearBatch' }
  | { type: 'startCrop'; crop: AdjustedCrop }
  | { type: 'updateCrop'; state: CropState }
  | { type: 'backToChoose' };

export interface PickerInit {
  mode: ImagePickerMode;
  /** « Modifier le cadrage » depuis le champ : on arrive directement sur l'étape 2. */
  initialCrop?: AdjustedCrop;
}

export function createInitialPickerState({ mode, initialCrop }: PickerInit): PickerState {
  return {
    mode,
    step: initialCrop ? 'crop' : 'choose',
    folderId: null,
    search: '',
    sort: DEFAULT_SORT,
    view: 'grid',
    selectedIds: initialCrop ? [initialCrop.imageId] : [],
    activeId: initialCrop?.imageId ?? null,
    uploads: [],
    newImageIds: [],
    batch: null,
    crop: initialCrop ?? null,
  };
}

function addToSelection(state: PickerState, imageId: string): Pick<PickerState, 'selectedIds' | 'activeId'> {
  if (state.mode === 'single') return { selectedIds: [imageId], activeId: imageId };
  const selectedIds = state.selectedIds.includes(imageId) ? state.selectedIds : [...state.selectedIds, imageId];
  return { selectedIds, activeId: imageId };
}

function isUploading(item: UploadItem): boolean {
  return item.status === 'uploading';
}

function startUploads(state: PickerState, count: number): UploadBatch | null {
  if (count === 0) return state.batch;
  const batchRunning = state.uploads.some(isUploading);
  if (batchRunning && state.batch) return { ...state.batch, total: state.batch.total + count };
  return { total: count, finished: 0, succeeded: 0 };
}

/** Termine un fichier du lot ; à la fin du lot, la recherche est vidée pour que les nouvelles images soient visibles. */
function finishUpload(state: PickerState, uploads: UploadItem[], succeeded: boolean): Partial<PickerState> {
  const batch = state.batch && {
    ...state.batch,
    finished: state.batch.finished + 1,
    succeeded: state.batch.succeeded + (succeeded ? 1 : 0),
  };
  const batchDone = !uploads.some(isUploading);
  return { uploads, batch, ...(batchDone && { search: '' }) };
}

export function pickerReducer(state: PickerState, action: PickerAction): PickerState {
  switch (action.type) {
    case 'setFolder':
      return { ...state, folderId: action.folderId };
    case 'setSearch':
      return { ...state, search: action.search };
    case 'setSort':
      return { ...state, sort: action.sort };
    case 'setView':
      return { ...state, view: action.view };
    case 'toggleImage': {
      if (state.mode === 'single' || !state.selectedIds.includes(action.imageId)) {
        return { ...state, ...addToSelection(state, action.imageId) };
      }
      const selectedIds = state.selectedIds.filter((id) => id !== action.imageId);
      const activeId = state.activeId === action.imageId ? (selectedIds.at(-1) ?? null) : state.activeId;
      return { ...state, selectedIds, activeId };
    }
    case 'selectAll': {
      const added = action.imageIds.filter((id) => !state.selectedIds.includes(id));
      return { ...state, selectedIds: [...state.selectedIds, ...added], activeId: added.at(-1) ?? state.activeId };
    }
    case 'deselectAll':
      return { ...state, selectedIds: [], activeId: null };
    case 'setActive':
      return { ...state, activeId: action.imageId };
    case 'queueUploads': {
      const uploadingCount = action.items.filter(isUploading).length;
      const destination = action.items[0]?.folderId;
      // Un filtre sur un autre dossier masquerait les images importées : on repasse sur « Toutes les images ».
      const folderId = state.folderId === null || state.folderId === destination ? state.folderId : null;
      return { ...state, folderId, uploads: [...action.items, ...state.uploads], batch: startUploads(state, uploadingCount) };
    }
    case 'uploadProgress':
      return {
        ...state,
        uploads: state.uploads.map((item) => (item.id === action.uploadId ? { ...item, progress: action.progress } : item)),
      };
    case 'uploadSucceeded': {
      const uploads = state.uploads.filter((item) => item.id !== action.uploadId);
      return {
        ...state,
        ...addToSelection(state, action.imageId),
        newImageIds: [action.imageId, ...state.newImageIds],
        ...finishUpload(state, uploads, true),
      };
    }
    case 'uploadFailed': {
      const uploads = state.uploads.map((item) =>
        item.id === action.uploadId ? { ...item, status: 'rejected' as const, reason: action.reason } : item,
      );
      return { ...state, ...finishUpload(state, uploads, false) };
    }
    case 'removeUpload':
      return { ...state, uploads: state.uploads.filter((item) => item.id !== action.uploadId) };
    case 'useExisting':
      return {
        ...state,
        ...addToSelection(state, action.imageId),
        uploads: state.uploads.filter((item) => item.id !== action.uploadId),
        folderId: null,
        search: '',
      };
    case 'forceUpload': {
      const uploads = state.uploads.map((item) =>
        item.id === action.uploadId ? { ...item, status: 'uploading' as const, progress: 0, duplicateOfId: undefined } : item,
      );
      return { ...state, uploads, batch: startUploads(state, 1) };
    }
    case 'clearBatch':
      return { ...state, batch: null };
    case 'startCrop':
      return { ...state, step: 'crop', crop: action.crop };
    case 'updateCrop':
      return state.crop ? { ...state, crop: { ...state.crop, state: action.state } } : state;
    case 'backToChoose':
      return { ...state, step: 'choose' };
  }
}
