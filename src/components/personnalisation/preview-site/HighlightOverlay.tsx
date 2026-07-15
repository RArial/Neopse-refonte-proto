'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PREVIEW_CLEAR_HIGHLIGHT_MESSAGE,
  PREVIEW_HIGHLIGHT_MESSAGE,
  PREVIEW_REVEAL_MESSAGE,
} from '@/components/personnalisation/preview-site/previewMessages';

const HIGHLIGHT_COLOR = '#f59e0b';
const REVEAL_PERSIST_MS = 2000;

interface OverlayRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type Mode = 'hover' | 'reveal';

function measure(role: string): OverlayRect[] {
  return Array.from(document.querySelectorAll(`[data-role~="${role}"]`)).map((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
  });
}

/**
 * Surbrillance de rôle dans l'aperçu embarqué. Dessine un contour PAR-DESSUS les éléments
 * `data-role` correspondants (jamais leur fond/bordure réels) : l'aperçu reste toujours fidèle.
 * Deux modes : `hover` (transitoire, s'efface au `clearHighlight`) et `reveal` (persistant ~2s,
 * ne s'annule pas si un `clearHighlight` de survol arrive entre-temps ailleurs).
 */
export function HighlightOverlay() {
  const [role, setRole] = useState<string | null>(null);
  const [, setMode] = useState<Mode | null>(null);
  const [rects, setRects] = useState<OverlayRect[]>([]);
  const persistTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function clearPersistTimer() {
      if (persistTimerRef.current !== null) {
        window.clearTimeout(persistTimerRef.current);
        persistTimerRef.current = null;
      }
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data ?? {};

      if (data.type === PREVIEW_HIGHLIGHT_MESSAGE && typeof data.role === 'string') {
        clearPersistTimer();
        setRole(data.role);
        setMode('hover');
        setRects(measure(data.role));
        return;
      }

      if (data.type === PREVIEW_CLEAR_HIGHLIGHT_MESSAGE) {
        // Un survol persistant issu d'un clic (mode 'reveal') ne doit jamais être annulé par un
        // simple départ de souris ailleurs dans le panneau.
        setMode((current) => {
          if (current !== 'hover') return current;
          setRole(null);
          setRects([]);
          return null;
        });
        return;
      }

      if (data.type === PREVIEW_REVEAL_MESSAGE && typeof data.role === 'string') {
        clearPersistTimer();
        setRole(data.role);
        setMode('reveal');
        setRects(measure(data.role));

        const elements = document.querySelectorAll(`[data-role~="${data.role}"]`);
        if (elements.length > 0) {
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          elements[0].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }

        persistTimerRef.current = window.setTimeout(() => {
          persistTimerRef.current = null;
          setRole(null);
          setMode(null);
          setRects([]);
        }, REVEAL_PERSIST_MS);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearPersistTimer();
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
