import type { Metadata } from 'next';
import { NotificationsListPage } from '@/components/notifications/NotificationsListPage';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default function NotificationsPage() {
  return <NotificationsListPage />;
}
