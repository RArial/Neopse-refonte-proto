import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PermissionProfileForm } from '@/components/administrateurs/profils/PermissionProfileForm';
import { PERMISSION_PROFILES } from '@/types/profils';

export const metadata: Metadata = {
  title: 'Modifier un profil de droits',
};

interface EditProfilPageProps {
  params: Promise<{ profileId: string }>;
}

export default async function EditProfilPage({ params }: EditProfilPageProps) {
  const { profileId } = await params;
  const profile = PERMISSION_PROFILES.find((candidate) => candidate.id === profileId);

  if (!profile) notFound();

  return <PermissionProfileForm mode="edit" initialProfile={profile} />;
}
