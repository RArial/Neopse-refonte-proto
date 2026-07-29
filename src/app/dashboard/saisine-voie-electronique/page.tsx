import type { Metadata } from 'next';
import { SaisineList } from '@/components/saisine-voie-electronique/SaisineList';

export const metadata: Metadata = {
  title: 'Saisine par voie électronique',
};

export default function SaisineVoieElectroniquePage() {
  return <SaisineList />;
}
