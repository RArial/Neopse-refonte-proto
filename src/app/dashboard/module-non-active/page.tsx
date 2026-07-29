import type { Metadata } from 'next';
import { ModuleInactiveInfo } from '@/components/module-non-active/ModuleInactiveInfo';

export const metadata: Metadata = {
  title: 'Module pas activé',
};

export default function ModuleNonActivePage() {
  return <ModuleInactiveInfo />;
}
