import type { Metadata } from 'next';
import { ServicesOverview } from '@/components/services/ServicesOverview';

export const metadata: Metadata = {
  title: 'Services',
};

export default function ServicesPage() {
  return <ServicesOverview />;
}
