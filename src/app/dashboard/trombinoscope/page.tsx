import type { Metadata } from 'next';
import { MemberList } from '@/components/trombinoscope/MemberList';

export const metadata: Metadata = {
  title: 'Trombinoscope',
};

export default function TrombinoscopePage() {
  return <MemberList />;
}
