import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MemberForm } from '@/components/trombinoscope/MemberForm';
import { MEMBERS_MOCK } from '@/types/trombinoscope';

export const metadata: Metadata = {
  title: 'Modifier un membre',
};

interface EditMembrePageProps {
  params: Promise<{ memberId: string }>;
}

export default async function EditMembrePage({ params }: EditMembrePageProps) {
  const { memberId } = await params;
  const member = MEMBERS_MOCK.find((candidate) => candidate.id === memberId);

  if (!member) notFound();

  return <MemberForm mode="edit" initialMember={member} />;
}
