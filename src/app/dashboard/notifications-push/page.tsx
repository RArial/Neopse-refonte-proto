import type { Metadata } from 'next';
import { ContentListPage } from '@/components/pages-modules/ContentListPage';
import { PUSH_NOTIFICATIONS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Notifications push',
};

export default function PushNotificationPage() {
  return (
    <ContentListPage
      title="Notifications push"
      description="Envoyez des notifications push aux utilisateurs de votre application mobile."
      addLabel="Ajouter une notification"
      addHref="/dashboard/notifications-push/nouveau"
      itemNounSingular="une notification"
      itemNounPlural="des notifications"
      initialItems={PUSH_NOTIFICATIONS_MOCK}
    />
  );
}
