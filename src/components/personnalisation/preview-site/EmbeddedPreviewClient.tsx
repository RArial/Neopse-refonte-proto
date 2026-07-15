'use client';

import { useEffect, useState } from 'react';
import { PreviewSite } from '@/components/personnalisation/preview-site/PreviewSite';
import { HighlightOverlay } from '@/components/personnalisation/preview-site/HighlightOverlay';
import { PREVIEW_READY_MESSAGE, PREVIEW_TOKENS_MESSAGE } from '@/components/personnalisation/preview-site/previewMessages';
import { createDefaultTokens } from '@/lib/personnalisation/colorModel';
import { PRESET_PALETTES } from '@/lib/personnalisation/palettes';
import type { Palette, ThemeTokens } from '@/types/personnalisation';

export { PREVIEW_READY_MESSAGE, PREVIEW_TOKENS_MESSAGE };

interface EmbeddedPreviewClientProps {
  pageId: string;
}

/**
 * Cible embarquée dans l'iframe de l'éditeur. N'a aucune donnée de variante propre : elle
 * démarre avec une palette neutre puis applique les tokens + palette reçus par `postMessage`
 * depuis l'éditeur parent (voir PreviewPane), sans jamais recharger la page. La palette doit être
 * poussée en entier (pas juste un id) car une palette personnalisée n'existe que côté éditeur.
 */
export function EmbeddedPreviewClient({ pageId }: EmbeddedPreviewClientProps) {
  const [tokens, setTokens] = useState<ThemeTokens>(() => createDefaultTokens('ocean'));
  const [palette, setPalette] = useState<Palette>(() => PRESET_PALETTES[0]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== PREVIEW_TOKENS_MESSAGE) return;
      setTokens(event.data.tokens as ThemeTokens);
      setPalette(event.data.palette as Palette);
    }
    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: PREVIEW_READY_MESSAGE }, window.location.origin);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <PreviewSite pageId={pageId} tokens={tokens} palette={palette} />
      <HighlightOverlay />
    </>
  );
}
