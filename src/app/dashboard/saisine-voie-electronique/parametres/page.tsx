import type { Metadata } from 'next';
import { SaisinePageSettingsForm } from '@/components/saisine-voie-electronique/settings/SaisinePageSettingsForm';

export const metadata: Metadata = {
  title: 'Gérer la page "Saisine par voie électronique"',
};

export default function SaisineVoieElectroniqueParametresPage() {
  return <SaisinePageSettingsForm />;
}
