export type AdminRole = 'gerant' | 'admin-site' | 'intervenant';

export const ADMIN_ROLE_META: Record<AdminRole, { label: string; description: string }> = {
  gerant: {
    label: 'Administrateur projet',
    description: 'Tous les droits de gestion, y compris la capacité de passer des commandes pour le compte NEOPSE.',
  },
  'admin-site': {
    label: 'Administrateur du site web',
    description: "Peut gérer l'intégralité du site web.",
  },
  intervenant: {
    label: 'Intervenant du site web',
    description: 'Accès limité selon un ou plusieurs profils de droits.',
  },
};

export const ADMIN_ROLE_ORDER: AdminRole[] = ['gerant', 'admin-site', 'intervenant'];

export interface Administrator {
  id: string;
  name: string;
  handle: string;
  role: AdminRole;
  profileIds: string[];
}

export const INITIAL_ADMINS: Administrator[] = [
  { id: 'admin-1', name: 'Camille Berthier', handle: '@cberthier', role: 'gerant', profileIds: [] },
  { id: 'admin-2', name: 'Rémi Arial', handle: '@remiarial', role: 'admin-site', profileIds: [] },
];
