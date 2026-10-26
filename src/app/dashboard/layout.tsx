import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Tweaks } from '@/components/dashboard/Tweaks';
import { LegalPagesProvider } from '@/components/contenu/legal/LegalPagesProvider';
import { MediaLibraryProvider } from '@/components/media-library/MediaLibraryProvider';
import { NotificationsProvider } from '@/components/notifications/NotificationsProvider';
import '@/styles/dashboard.css';

export const metadata: Metadata = {
  title: 'Tableau de bord',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
      <LegalPagesProvider>
        <MediaLibraryProvider>
          <div className="app">
            <Sidebar activeKey="dashboard" />
            <div className="main">
              <Topbar />
              <main id="main-content" className="flex-1">
                {children}
              </main>
            </div>
            <Tweaks />
          </div>
        </MediaLibraryProvider>
      </LegalPagesProvider>
    </NotificationsProvider>
  );
}
