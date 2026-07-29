import type { Metadata } from 'next';
import { EditoList } from '@/components/editos/EditoList';

export const metadata: Metadata = {
  title: 'Editos',
};

export default function EditoPage() {
  return <EditoList />;
}
