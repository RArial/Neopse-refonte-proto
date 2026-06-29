import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Tweaks } from '@/components/dashboard/Tweaks';
import { Icons } from '@/components/ui/Icons';
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
    <div className="app">
      <Sidebar activeKey="dashboard" />
      <div className="main">
        <Topbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
      <Tweaks />
      <a
        href="#"
        className="help-float"
        aria-label="Aide et support"
        title="Aide et support"
      >
        <Icons.Question size={20} />
      </a>
    </div>
  );
}
