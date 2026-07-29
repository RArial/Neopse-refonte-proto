import { Suspense } from 'react';
import type { Metadata } from 'next';
import { GestionnaireHub } from '@/components/gestionnaire/GestionnaireHub';

export const metadata: Metadata = {
  title: 'Stockage',
};

export default function GestionnairePage() {
  return (
    <Suspense fallback={null}>
      <GestionnaireHub />
    </Suspense>
  );
}
