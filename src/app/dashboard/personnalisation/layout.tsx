'use client';

import type { ReactNode } from 'react';
import { PersonnalisationProvider } from '@/components/personnalisation/PersonnalisationProvider';
import { PublishDialog } from '@/components/personnalisation/PublishDialog';

// Le hub (/dashboard/personnalisation) et l'éditeur trois-zones (/dashboard/personnalisation/[variantId])
// partagent un seul PersonnalisationProvider : les variantes, l'historique et le brouillon en cours
// doivent survivre à la navigation entre les deux écrans (le hub est une destination, pas un péage).
export default function PersonnalisationLayout({ children }: { children: ReactNode }) {
  return (
    <PersonnalisationProvider>
      {children}
      <PublishDialog />
    </PersonnalisationProvider>
  );
}
