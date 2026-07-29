import type { Metadata } from 'next';
import { ShortcutList } from '@/components/acces-directs/ShortcutList';

export const metadata: Metadata = {
  title: 'Accès directs',
};

export default function ShortcutPage() {
  return <ShortcutList />;
}
