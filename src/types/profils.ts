import type { IconName } from '@/components/ui/Icons';

export type PermissionRight = 'voir' | 'ajouter' | 'ajouter_modifier' | 'modifier' | 'supprimer' | 'gerer';

export const RIGHT_LABEL: Record<PermissionRight, string> = {
  voir: 'Voir',
  ajouter: 'Ajouter',
  ajouter_modifier: 'Ajouter/Modifier',
  modifier: 'Modifier',
  supprimer: 'Supprimer',
  gerer: 'Gérer les contenus',
};

export const RIGHT_ORDER: PermissionRight[] = ['gerer', 'voir', 'ajouter', 'ajouter_modifier', 'modifier', 'supprimer'];

export interface PermissionModule {
  id: string;
  label: string;
  rights: PermissionRight[];
  lockedNote?: string;
}

export interface PermissionGroup {
  id: string;
  label: string;
  icon: IconName;
  modules: PermissionModule[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'parametres',
    label: 'Paramètres',
    icon: 'Settings',
    modules: [
      { id: 'donnees-techniques', label: 'Données techniques', rights: ['voir', 'modifier'] },
      {
        id: 'noms-domaine',
        label: 'Noms de domaine',
        rights: [],
        lockedNote: "Seuls les Administrateurs du Projet peuvent intervenir sur la gestion de l'URL du site et/ou l'achat d'un nom de domaine.",
      },
      {
        id: 'utilisateurs',
        label: 'Utilisateurs',
        rights: [],
        lockedNote: "Seuls les Administrateurs du Projet et/ou de l'Outil peuvent accéder à la gestion des Utilisateurs.",
      },
    ],
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: 'Wrench',
    modules: [
      { id: 'gestionnaire-pages', label: 'Gestionnaire des pages', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'maquettes', label: 'Maquettes', rights: ['voir', 'modifier'] },
      { id: 'mentions-legales', label: 'Mentions légales', rights: ['voir', 'modifier'] },
    ],
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: 'FileText',
    modules: [
      { id: 'contenus-rubrique', label: 'Contenus des pages de type « rubrique »', rights: ['gerer'] },
      { id: 'actualites', label: 'Actualités', rights: ['voir', 'ajouter_modifier', 'supprimer'] },
      { id: 'agenda', label: 'Agenda', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'alertes', label: 'Alertes', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'covoiturage', label: 'Annonces de covoiturage', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'contacts', label: 'Contacts', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'editos', label: 'Editos', rights: ['voir', 'ajouter_modifier', 'supprimer'] },
      { id: 'flash-infos', label: 'Flash Infos', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'galerie-videos', label: 'Galerie de vidéos', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'unes', label: 'Unes', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
    ],
  },
  {
    id: 'partages',
    label: 'Partages',
    icon: 'Share',
    modules: [
      { id: 'liens', label: 'Liens', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'reseaux-sociaux', label: 'Réseaux sociaux', rights: ['voir', 'modifier'] },
    ],
  },
  {
    id: 'application-mobile',
    label: 'Application mobile',
    icon: 'Smartphone',
    modules: [
      { id: 'app-donnees-techniques', label: 'Données techniques', rights: ['voir', 'modifier'] },
      { id: 'signalements', label: 'Signalements', rights: ['voir', 'modifier'] },
    ],
  },
  {
    id: 'gestionnaires',
    label: 'Gestionnaires',
    icon: 'Briefcase',
    modules: [
      { id: 'gestionnaire-fichiers', label: 'Gestionnaire de fichiers', rights: ['voir', 'ajouter', 'modifier', 'supprimer'] },
      { id: 'gestionnaire-formulaires', label: 'Gestionnaire de formulaires', rights: ['voir', 'ajouter_modifier', 'supprimer'] },
    ],
  },
];

export type PermissionGrants = Record<string, PermissionRight[]>;

export interface PermissionProfile {
  id: string;
  name: string;
  grants: PermissionGrants;
}

export const PERMISSION_PROFILES: PermissionProfile[] = [
  {
    id: 'redacteur-actualites',
    name: 'Rédacteur actualités',
    grants: {
      actualites: ['voir', 'ajouter_modifier'],
      agenda: ['voir', 'ajouter', 'modifier'],
      'flash-infos': ['voir', 'ajouter'],
    },
  },
  {
    id: 'community-manager',
    name: 'Community manager',
    grants: {
      'reseaux-sociaux': ['voir', 'modifier'],
      liens: ['voir', 'ajouter', 'modifier'],
      unes: ['voir', 'ajouter'],
    },
  },
];

export const DEFAULT_PERMISSION_PROFILE_NAME = '';
