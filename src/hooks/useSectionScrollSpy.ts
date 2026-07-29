'use client';

import { useEffect, useRef, useState } from 'react';

interface UseSectionScrollSpyOptions {
  /** Ids des sections dépliées par défaut (généralement les sections « essentielles »). Toutes par défaut. */
  defaultExpandedIds?: string[];
}

/** Sommaire à gauche + sections repliables à droite (voir la page de création d'un événement de l'agenda) :
 * observe quelle section est visible à l'écran pour surligner l'entrée de sommaire correspondante, et
 * gère le clic sur une entrée (déplie la section visée puis y scrolle). */
export function useSectionScrollSpy(sectionIds: string[], options: UseSectionScrollSpyOptions = {}) {
  const { defaultExpandedIds = sectionIds } = options;
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sectionIds.forEach((id) => {
      initial[id] = defaultExpandedIds.includes(id);
    });
    return initial;
  });
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0]);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const id = topMost.target.getAttribute('data-section-id');
        if (id) setActiveSectionId(id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    );
    sectionIds.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function registerSection(id: string) {
    return (el: HTMLDivElement | null) => {
      sectionRefs.current[id] = el;
    };
  }

  function toggleSection(id: string, value: boolean) {
    setExpanded((prev) => ({ ...prev, [id]: value }));
  }

  function handleNavClick(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: true }));
    setActiveSectionId(id);
    requestAnimationFrame(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return { expanded, activeSectionId, registerSection, toggleSection, handleNavClick };
}
