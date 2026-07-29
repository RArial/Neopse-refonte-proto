import type { Metadata } from 'next';
import { SocialAccountForm } from '@/components/reseaux-sociaux/SocialAccountForm';

export const metadata: Metadata = {
  title: 'Nouveau compte',
};

export default function NouveauSocialAccountPage() {
  return <SocialAccountForm />;
}
