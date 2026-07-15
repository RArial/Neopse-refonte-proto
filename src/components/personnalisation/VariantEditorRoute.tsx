'use client';

import { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { ThemeEditorPage } from '@/components/personnalisation/ThemeEditorPage';

interface VariantEditorRouteProps {
  variantId: string;
}

/** Fait le pont entre l'URL (deep-link vers une variante) et le PersonnalisationProvider partagé :
 * ouvre la variante demandée par l'URL, puis maintient l'URL synchronisée si la variante active
 * change par un autre chemin (VariantSelector, duplication...). Le ref `lastSyncedVariantId` évite
 * que les deux directions ne se contredisent sur le même rendu : on ne corrige l'URL depuis le
 * store que si le prop `variantId` n'a *pas* changé depuis la dernière fois qu'on l'a nous-même
 * appliqué au store — sinon on serait en train d'annuler notre propre synchronisation en cours. */
export function VariantEditorRoute({ variantId }: VariantEditorRouteProps) {
  const { activeVariant, requestSelectVariant, pendingVariantSwitchId } = usePersonnalisation();
  const router = useRouter();
  const lastSyncedVariantId = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (pendingVariantSwitchId !== null) return;

    if (activeVariant.id === variantId) {
      lastSyncedVariantId.current = variantId;
      return;
    }

    if (variantId !== lastSyncedVariantId.current) {
      lastSyncedVariantId.current = variantId;
      requestSelectVariant(variantId);
      return;
    }

    router.replace(`/dashboard/personnalisation/${activeVariant.id}`);
  }, [variantId, activeVariant.id, pendingVariantSwitchId, requestSelectVariant, router]);

  return <ThemeEditorPage />;
}
