'use client';

import { useEffect, useRef, useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { SIDEBAR_PAGES_CATALOG } from '@/lib/sidebarPagesCatalog';

interface PagesFlyoutPanelProps {
  left: string;
  onClose: () => void;
}

/** Panneau flottant listant toutes les pages/modules Neopse, ouvert depuis l'entrée « Pages » de
 * la barre latérale. Purement consultatif pour l'instant : cliquer sur une entrée ne fait rien. */
export function PagesFlyoutPanel({ left, onClose }: PagesFlyoutPanelProps) {
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const filtered = SIDEBAR_PAGES_CATALOG.filter((entry) => entry.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div ref={panelRef} className="pages-flyout" style={{ left }} role="menu" aria-label="Pages">
      <div className="pages-flyout-head">
        <span className="pages-flyout-title">Pages</span>
      </div>

      <div className="pages-flyout-search">
        <Icons.Search size={14} />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher partout..."
          aria-label="Rechercher une page ou un module"
          autoFocus
        />
      </div>

      <div className="pages-flyout-list">
        {filtered.length === 0 ? (
          <p className="pages-flyout-empty">Aucun résultat.</p>
        ) : (
          filtered.map((entry) => {
            const IconEl = Icons[entry.icon];
            return (
              <button key={entry.id} type="button" className="pages-flyout-item" role="menuitem">
                <span className="ico">{IconEl && <IconEl size={16} />}</span>
                <span className="lbl">{entry.label}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
