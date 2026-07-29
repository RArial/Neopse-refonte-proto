import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShortcutForm } from '@/components/acces-directs/ShortcutForm';
import { SHORTCUTS_MOCK } from '@/types/pagesModules';

export const metadata: Metadata = {
  title: 'Modifier un raccourci',
};

interface EditShortcutPageProps {
  params: Promise<{ shortcutId: string }>;
}

export default async function EditShortcutPage({ params }: EditShortcutPageProps) {
  const { shortcutId } = await params;
  const shortcut = SHORTCUTS_MOCK.find((candidate) => candidate.id === shortcutId);

  if (!shortcut) notFound();

  return <ShortcutForm mode="edit" initialShortcut={shortcut} />;
}
