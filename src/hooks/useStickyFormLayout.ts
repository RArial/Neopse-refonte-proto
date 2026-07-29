'use client';

import { useEffect, useRef, useState } from 'react';

const TOPBAR_HEIGHT = 62;
const RAIL_TOP_GAP = 16;
const RAIL_BOTTOM_GAP = 16;

/**
 * Mesure la hauteur réelle de l'en-tête sticky (ref à poser dessus) pour caler la colonne de
 * gauche (sommaire + affichage) juste en dessous — elle ne doit jamais scroller sous la topbar
 * ni sous l'en-tête. `railSx` plafonne aussi sa hauteur à l'espace restant à l'écran, avec un
 * scroll interne si son contenu déborde.
 */
export function useStickyFormLayout() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeaderHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const railTop = TOPBAR_HEIGHT + headerHeight + RAIL_TOP_GAP;

  return {
    headerRef,
    railSx: {
      position: 'sticky' as const,
      top: railTop,
      maxHeight: `calc(100vh - ${railTop + RAIL_BOTTOM_GAP}px)`,
      overflowY: 'auto' as const,
    },
  };
}
