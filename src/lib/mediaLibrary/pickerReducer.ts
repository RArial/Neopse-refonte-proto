import { DEFAULT_FOLDER_ID, DEFAULT_SORT } from '@/lib/mediaLibrary/constants';
import type { CropState } from '@/lib/mediaLibrary/crop';
import type { ImagePickerMode, SortState, UploadItem } from '@/types/mediaLibrary';

export type PickerStep = 'choose' | 'crop';
export type PickerView = 'grid' | 'list';

export interface UploadBatch {
  folderId: string;
  /** Fichiers partis à l'import (hors refus immédiats et doublons en attente). */
  total: number;
  finished: number;
  succeeded: number;
}

export interface PickerState {
  mode: ImagePickerMode;
  step: PickerStep;
  folderId: string;
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
  crop: CropState | null;
}

export type PickerAction =
  | { type: 'setFolder'; folderId: string }
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
  | { type: 'useExisting'; uploadId: string; imageId: string; folderId: string }
  | { type: 'forceUpload'; uploadId: string }
  | { type: 'startCrop'; crop: CropState }
  | { type: 'updateCrop'; crop: CropState }
  | { type: 'backToChoose' };

export function createInitialPickerState(mode: ImagePickerMode): PickerState {
  return {
    mode,
    step: 'choose',
    folderId: DEFAULT_FOLDER_ID,
    search: '',
    sort: DEFAULT_SORT,
    view: 'grid',
    selectedIds: [],
    activeId: null,
    uploads: [],
    newImageIds: [],
    batch: null,
    crop: null,
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

function startUploads(state: PickerState, count: number, folderId: string): UploadBatch | null {
  if (count === 0) return state.batch;
  const batchRunning = state.uploads.some(isUploading);
  if (batchRunning && state.batch) return { ...state.batch, total: state.batch.total + count };
  return { folderId, total: count, finished: 0, succeeded: 0 };
}

/** Termine un fichier du lot ; à la fin du lot, la recherche est vidée pour montrer le dossier de destination. */
function finishUpload(state: PickerState, uploads: UploadItem[], succeeded: boolean): Partial<PickerState> {
  const batch = state.batch && {
    ...state.batch,
    finished: state.batch.finished + 1,
    succeeded: state.batch.succeeded + (succeeded ? 1 : 0),
  };
  const batchDone = !uploads.some(isUploading);
  return { uploads, batch, ...(batchDone && { search: '', folderId: batch?.folderId ?? state.folderId }) };
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
      const batch = startUploads(state, uploadingCount, action.items[0]?.folderId ?? state.folderId);
      return { ...state, uploads: [...action.items, ...state.uploads], batch };
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
        folderId: action.folderId,
        search: '',
      };
    case 'forceUpload': {
      const target = state.uploads.find((item) => item.id === action.uploadId);
      if (!target) return state;
      const batch = startUploads(state, 1, target.folderId);
      const uploads = state.uploads.map((item) =>
        item.id === action.uploadId ? { ...item, status: 'uploading' as const, progress: 0, duplicateOfId: undefined } : item,
      );
      return { ...state, uploads, batch };
    }
    case 'startCrop':
      return { ...state, step: 'crop', crop: action.crop };
    case 'updateCrop':
      return { ...state, crop: action.crop };
    case 'backToChoose':
      return { ...state, step: 'choose' };
  }
}
