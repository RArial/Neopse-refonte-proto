export type FileKind = 'image' | 'pdf';

export interface ManagedFile {
  id: string;
  name: string;
  kind: FileKind;
  meta: string;
  folderId: string;
  dateAdded: string;
}

export interface ManagedFolder {
  id: string;
  label: string;
  parentId: string;
}

export type ManagerSectionId = 'images' | 'documents';

export interface ManagerSection {
  id: ManagerSectionId;
  label: string;
  rootLabel: string;
  uploadLabel: string;
  acceptedFileTypes: string;
  folders: ManagedFolder[];
  files: ManagedFile[];
}

const ROOT_FOLDER_ID = 'root';

export const MANAGER_SECTIONS: ManagerSection[] = [
  {
    id: 'images',
    label: 'Images',
    rootLabel: 'Images',
    uploadLabel: 'Je charge des images',
    acceptedFileTypes: 'image/*',
    folders: [
      { id: 'img-bannieres', label: 'Bannières', parentId: ROOT_FOLDER_ID },
      { id: 'img-photos', label: 'Photos actualités', parentId: ROOT_FOLDER_ID },
      { id: 'img-photos-ete', label: 'Été 2026', parentId: 'img-photos' },
    ],
    files: [
      { id: 'img-1', name: 'banniere-association', kind: 'image', meta: '141,3 kB · JPG', folderId: 'img-bannieres', dateAdded: '2026-01-14' },
      { id: 'img-2', name: 'accueil-decouverte', kind: 'image', meta: '92,6 kB · JPG', folderId: 'img-bannieres', dateAdded: '2026-02-02' },
      { id: 'img-3', name: 'capture-ecran', kind: 'image', meta: '401,4 kB · PNG', folderId: 'img-photos', dateAdded: '2026-03-10' },
      { id: 'img-4', name: 'festival-de-lete', kind: 'image', meta: '78,5 kB · JPG', folderId: 'img-photos-ete', dateAdded: '2026-06-21' },
      { id: 'img-5', name: 'foret-brumeuse', kind: 'image', meta: '39,1 kB · JPG', folderId: 'img-photos', dateAdded: '2026-05-04' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    rootLabel: 'Documents',
    uploadLabel: 'Je charge des documents',
    acceptedFileTypes: 'application/pdf',
    folders: [
      { id: 'doc-pv', label: 'PV et délibérations', parentId: ROOT_FOLDER_ID },
      { id: 'doc-telechargements', label: 'Téléchargements', parentId: ROOT_FOLDER_ID },
    ],
    files: [
      { id: 'doc-1', name: 'Compte-rendu-21-02-2026', kind: 'pdf', meta: '136,1 kB · PDF', folderId: 'doc-pv', dateAdded: '2026-02-21' },
      { id: 'doc-2', name: 'Réunion-conseil-21-02-2026', kind: 'pdf', meta: '136,1 kB · PDF', folderId: 'doc-pv', dateAdded: '2026-02-21' },
      { id: 'doc-3', name: 'depliant-programme-ete', kind: 'pdf', meta: '898,3 kB · PDF', folderId: 'doc-telechargements', dateAdded: '2026-06-01' },
    ],
  },
];

export { ROOT_FOLDER_ID };
