import type { Metadata } from 'next';
import { PushNotificationForm } from '@/components/notifications-push/PushNotificationForm';

export const metadata: Metadata = {
  title: 'Nouvelle notification',
};

export default function NouveauPushNotificationPage() {
  return <PushNotificationForm />;
}
