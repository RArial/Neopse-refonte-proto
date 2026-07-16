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
 * appliqué au store — sinon on serait en train d'annuler notre propre synchronisation en cours.
 *
 * La branche « sync depuis l'URL » retourne un cleanup qui annule sa propre mutation du ref.
 * Sans lui, un second passage de cet effet sur le même rendu (avant que `activeVariant.id` n'ait
 * eu le temps de refléter le `switchTo` en cours) retrouvait le ref déjà mis à jour par le premier
 * passage, retombait dans la branche « corrige l'URL » et faisait un `router.replace` vers la
 * variante précédente — ce qui change la valeur du segment dynamique `[variantId]` et remonte donc
 * ce composant, réinitialisant le ref à `null` : le même bug se reproduisait alors symétriquement
 * dans l'autre sens, en boucle infinie (la sélection de maquette clignotant entre les deux
 * variantes sans jamais se stabiliser). Le cleanup rend le premier passage idempotent : un second
 * passage relance la même action « sélectionner » au lieu de tomber dans la correction d'URL. */
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
      const previous = lastSyncedVariantId.current;
      lastSyncedVariantId.current = variantId;
      requestSelectVariant(variantId);
      return () => {
        lastSyncedVariantId.current = previous;
      };
    }

    router.replace(`/dashboard/personnalisation/${activeVariant.id}`);
  }, [variantId, activeVariant.id, pendingVariantSwitchId, requestSelectVariant, router]);

  return <ThemeEditorPage />;
}
