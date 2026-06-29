import { PageHeader } from '@/components/dashboard/PageHeader';
import { Shortcuts } from '@/components/dashboard/Shortcuts';
import { Kpis } from '@/components/dashboard/Kpis';
import { Modules } from '@/components/dashboard/Modules';
import { Changelog } from '@/components/dashboard/Changelog';

export default function DashboardPage() {
  return (
    <div className="page">
      <div className="page-main">
        <PageHeader />
        <Shortcuts />
        <Kpis />
        <Modules />
      </div>
      <Changelog />
    </div>
  );
}
