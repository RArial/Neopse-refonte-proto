import type { Metadata } from 'next';
import { ModuleOrderConfirmation } from '@/components/module-non-active/ModuleOrderConfirmation';

export const metadata: Metadata = {
  title: 'Confirmation commande module',
};

export default function ModuleNonActiveCommandePage() {
  return <ModuleOrderConfirmation />;
}
