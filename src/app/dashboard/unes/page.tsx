import type { Metadata } from 'next';
import { UneList } from '@/components/unes/UneList';

export const metadata: Metadata = {
  title: 'Unes',
};

export default function UnesPage() {
  return <UneList />;
}
