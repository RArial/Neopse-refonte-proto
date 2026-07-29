import type { Metadata } from 'next';
import { FlashInfoList } from '@/components/flash-infos/FlashInfoList';

export const metadata: Metadata = {
  title: 'Flash Infos',
};

export default function FlashInfoPage() {
  return <FlashInfoList />;
}
