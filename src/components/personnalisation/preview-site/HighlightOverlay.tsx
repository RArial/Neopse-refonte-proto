'use client';

import { useEffect, useRef, useState } from 'react';
import { PREVIEW_REVEAL_MESSAGE } from '@/components/personnalisation/preview-site/previewMessages';

const HIGHLIGHT_COLOR = '#f59e0b';
const REVEAL_PERSIST_MS = 3000;

interface OverlayRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function measure(role: string): OverlayRect[] {
  return Array.from(document.querySelectorAll(`[data-role~="${role}"]`)).map((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
  });
}

/**
 * Surbrillance de rôle dans l'aperçu embarqué. Dessine un contour PAR-DESSUS les éléments
 * `data-role` correspondants (jamais leur fond/bordure réels) : l'aperçu reste toujours fidèle.
 * Ne se déclenche que sur clic du bouton œil (persistant ~3s) — jamais sur simple survol.
 */
export function HighlightOverlay() {
  const [role, setRole] = useState<string | null>(null);
  const [rects, setRects] = useState<OverlayRect[]>([]);
  const persistTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data ?? {};

      if (data.type === PREVIEW_REVEAL_MESSAGE && typeof data.role === 'string') {
        const revealedRole = data.role;
        if (persistTimerRef.current !== null) window.clearTimeout(persistTimerRef.current);
        setRole(revealedRole);
        setRects(measure(revealedRole));

        const elements = document.querySelectorAll(`[data-role~="${revealedRole}"]`);
        if (elements.length > 0) {
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          elements[0].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }

        persistTimerRef.current = window.setTimeout(() => {
          persistTimerRef.current = null;
          setRole(null);
          setRects([]);
        }, REVEAL_PERSIST_MS);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (persistTimerRef.current !== null) window.clearTimeout(persistTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!role) return;
    function remeasure() {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        if (role) setRects(measure(role));
      });
    }
    window.addEventListener('scroll', remeasure, { passive: true });
    window.addEventListener('resize', remeasure);
    return () => {
      window.removeEventListener('scroll', remeasure);
      window.removeEventListener('resize', remeasure);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [role]);

  if (!role || rects.length === 0) return null;

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2147483000 }}>
      {rects.map((rect, index) => (
        <div
          key={index}
          style={{
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            outline: `2px solid ${HIGHLIGHT_COLOR}`,
            outlineOffset: 2,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.45)',
            borderRadius: 4,
          }}
        />
      ))}
    </div>
  );
}
