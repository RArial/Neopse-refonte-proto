import type { Metadata } from 'next';
import { ShortcutForm } from '@/components/acces-directs/ShortcutForm';

export const metadata: Metadata = {
  title: 'Nouveau raccourci',
};

export default function NouveauShortcutPage() {
  return <ShortcutForm mode="create" />;
}
