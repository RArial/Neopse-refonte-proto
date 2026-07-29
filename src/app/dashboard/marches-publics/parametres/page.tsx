import type { Metadata } from 'next';
import { MarchePublicPageSettingsForm } from '@/components/marches-publics/settings/MarchePublicPageSettingsForm';

export const metadata: Metadata = {
  title: 'Gérer la page marchés publics',
};

export default function MarchesPublicsParametresPage() {
  return <MarchePublicPageSettingsForm />;
}
