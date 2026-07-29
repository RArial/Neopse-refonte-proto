'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/ui/Icons';
import { SIDEBAR_PAGES_CATALOG } from '@/lib/sidebarPagesCatalog';
import { cn } from '@/lib/utils';

interface PagesFlyoutPanelProps {
  left: string;
  onClose: () => void;
}

/** Panneau flottant listant toutes les pages/modules Neopse, ouvert depuis l'entrée « Modules » de
 * la barre latérale. La plupart des entrées sont purement consultatives : cliquer ne fait rien.
 * Celles qui référencent une page déjà construite (ex. Agenda) naviguent réellement. */
export function PagesFlyoutPanel({ left, onClose }: PagesFlyoutPanelProps) {
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
    <div ref={panelRef} className="pages-flyout" style={{ left }} role="menu" aria-label="Modules">
      <div className="pages-flyout-head">
        <span className="pages-flyout-title">Modules</span>
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
            const isActive = entry.href ? pathname === entry.href : false;

            if (entry.href) {
              return (
                <Link
                  key={entry.id}
                  href={entry.href}
                  className={cn('pages-flyout-item', isActive && 'active')}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={onClose}
                >
                  <span className="ico">{IconEl && <IconEl size={16} />}</span>
                  <span className="lbl">{entry.label}</span>
                </Link>
              );
            }

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
