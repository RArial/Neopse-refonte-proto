'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { NOTIFICATIONS_MOCK, type NotificationItem } from '@/types/notification';

interface NotificationsStore {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
  toggleRead: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsStore | null>(null);

/** Registre partagé des notifications — monté dans le layout du tableau de bord car son état
 * lu/non-lu doit rester synchronisé entre la cloche du header et la page « Toutes les notifications ». */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_MOCK);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => (prev.some((n) => !n.read) ? prev.map((n) => ({ ...n, read: true })) : prev));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo<NotificationsStore>(
    () => ({ notifications, unreadCount, markAllAsRead, toggleRead }),
    [notifications, unreadCount, markAllAsRead, toggleRead],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsStore {
  const store = useContext(NotificationsContext);
  if (!store) throw new Error('useNotifications doit être utilisé à l’intérieur de <NotificationsProvider>.');
  return store;
}
