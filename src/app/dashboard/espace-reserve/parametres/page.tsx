import type { Metadata } from 'next';
import { EspaceReservePageSettingsForm } from '@/components/espace-reserve/settings/EspaceReservePageSettingsForm';

export const metadata: Metadata = {
  title: 'Gérer la page "Espace Réservé"',
};

export default function EspaceReserveParametresPage() {
  return <EspaceReservePageSettingsForm />;
}
