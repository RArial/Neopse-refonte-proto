import type { Metadata } from 'next';
import { PermissionProfileForm } from '@/components/administrateurs/profils/PermissionProfileForm';

export const metadata: Metadata = {
  title: 'Nouveau profil de droits',
};

export default function NouveauProfilPage() {
  return <PermissionProfileForm mode="create" />;
}
