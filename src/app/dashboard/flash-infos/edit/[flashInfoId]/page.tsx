import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FlashInfoForm } from '@/components/flash-infos/FlashInfoForm';
import { FLASH_INFOS_MOCK } from '@/types/flashInfos';

export const metadata: Metadata = {
  title: 'Modifier un flash info',
};

interface EditFlashInfoPageProps {
  params: Promise<{ flashInfoId: string }>;
}

export default async function EditFlashInfoPage({ params }: EditFlashInfoPageProps) {
  const { flashInfoId } = await params;
  const flashInfo = FLASH_INFOS_MOCK.find((candidate) => candidate.id === flashInfoId);

  if (!flashInfo) notFound();

  return <FlashInfoForm mode="edit" initialFlashInfo={flashInfo} />;
}
