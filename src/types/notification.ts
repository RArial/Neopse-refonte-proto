import type { IconName } from '@/components/ui/Icons';

export type NotificationCategoryId = 'site' | 'moderation' | 'systeme' | 'sondage' | 'administration';

export interface NotificationCategory {
  label: string;
  icon: IconName;
  color: string;
  colorSoft: string;
  colorDeep: string;
}

export const NOTIFICATION_CATEGORIES: Record<NotificationCategoryId, NotificationCategory> = {
  site: {
    label: 'Site internet',
    icon: 'Globe',
    color: 'var(--amber)',
    colorSoft: 'var(--amber-soft)',
    colorDeep: 'var(--amber-deep)',
  },
  moderation: {
    label: 'Modération',
    icon: 'Message',
    color: 'var(--coral)',
    colorSoft: 'var(--coral-soft)',
    colorDeep: 'var(--coral)',
  },
  systeme: {
    label: 'Système',
    icon: 'Wrench',
    color: 'var(--teal)',
    colorSoft: 'var(--teal-soft)',
    colorDeep: 'var(--teal-deep)',
  },
  sondage: {
    label: 'Sondage',
    icon: 'Vote',
    color: 'var(--lilac)',
    colorSoft: 'var(--lilac-soft)',
    colorDeep: 'var(--lilac)',
  },
  administration: {
    label: 'Administration',
    icon: 'UserPlus',
    color: 'var(--mint)',
    colorSoft: 'var(--mint-soft)',
    colorDeep: 'var(--mint)',
  },
};

export interface NotificationItem {
  id: string;
  category: NotificationCategoryId;
  title: string;
  message: string;
  date: string;
  read: boolean;
  href?: string;
}

export const NOTIFICATIONS_MOCK: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'site',
    title: 'Nouvelle page publiée',
    message: 'La page « Horaires d\'ouverture » a été publiée avec succès.',
    date: '2026-07-20T08:15:00.000Z',
    read: false,
    href: '/dashboard/contenu',
  },
  {
    id: 'notif-2',
    category: 'moderation',
    title: 'Commentaire à modérer',
    message: 'Un nouveau commentaire attend votre validation sur « Travaux voirie ».',
    date: '2026-07-19T17:40:00.000Z',
    read: false,
  },
  {
    id: 'notif-3',
    category: 'systeme',
    title: 'Mise à jour disponible',
    message: 'Une nouvelle version du module Agenda est disponible.',
    date: '2026-07-18T09:05:00.000Z',
    read: true,
  },
  {
    id: 'notif-4',
    category: 'sondage',
    title: 'Sondage clôturé',
    message: 'Le sondage « Aménagement du centre-ville » est terminé, consultez les résultats.',
    date: '2026-07-16T14:20:00.000Z',
    read: true,
    href: '/dashboard/sondages',
  },
  {
    id: 'notif-5',
    category: 'administration',
    title: 'Nouvel administrateur',
    message: 'Camille Dubois a rejoint l\'équipe d\'administration.',
    date: '2026-07-14T11:00:00.000Z',
    read: true,
    href: '/dashboard/administrateurs',
  },
  {
    id: 'notif-6',
    category: 'systeme',
    title: 'Espace de stockage',
    message: 'Votre espace de stockage média est utilisé à 80 %.',
    date: '2026-07-10T08:30:00.000Z',
    read: true,
  },
];
