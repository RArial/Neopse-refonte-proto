import type { Metadata } from 'next';
import { FlashInfoForm } from '@/components/flash-infos/FlashInfoForm';

export const metadata: Metadata = {
  title: 'Nouveau flash info',
};

export default function NouveauFlashInfoPage() {
  return <FlashInfoForm mode="create" />;
}
