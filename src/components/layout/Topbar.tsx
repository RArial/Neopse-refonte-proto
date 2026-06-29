'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Icons, type IconName } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

interface Tool {
  id: string;
  icon: IconName;
  desc: string;
}

const TOOLS: Tool[] = [
  { id: 'Site internet',       icon: 'Globe',     desc: 'Site vitrine & pages' },
  { id: 'Billetterie',         icon: 'Ticket',    desc: 'Vente de billets en ligne' },
  { id: 'Espace collaboratif', icon: 'Briefcase', desc: 'Documents & équipes' },
];

function ToolDropdown() {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<string>('Site internet');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const current = TOOLS.find(t => t.id === tool) ?? TOOLS[0];
  const CurrentIcon = Icons[current.icon];

  const selectTool = useCallback((id: string) => {
    setTool(id);
    setOpen(false);
  }, []);

  return (
    <div className="tool-dd" ref={menuRef}>
      <button
        className={cn('tool-dd-btn', open && 'open')}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Outil actif : ${tool}`}
      >
        <CurrentIcon size={13} />
        <span>{tool}</span>
        <Icons.ChevronDown size={12} />
      </button>

      {open && (
        <div className="tool-dd-menu" role="listbox" aria-label="Choisir un outil">
          {TOOLS.map(t => {
            const ToolIcon = Icons[t.icon];
            const isSelected = t.id === tool;
            return (
              <button
                key={t.id}
                className={cn('tool-dd-item', isSelected && 'on')}
                onClick={() => selectTool(t.id)}
                type="button"
                role="option"
                aria-selected={isSelected}
              >
                <span className="tool-dd-ico"><ToolIcon size={16} /></span>
                <span className="tool-dd-lbl">
                  <span className="tool-dd-t">{t.id}</span>
                  <span className="tool-dd-d">{t.desc}</span>
                </span>
                {isSelected && <Icons.ChevronRight size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Topbar() {
  function openTweaks() {
    window.postMessage({ type: '__activate_edit_mode' }, '*');
  }

  return (
    <header className="topbar">
      <div className="topbar-crumb" aria-label="Fil d'Ariane">
        <b>Mon projet Démo arborescence</b>
        <span className="sep" aria-hidden="true">/</span>
        <ToolDropdown />
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <button className="icon-btn" type="button" aria-label="Aide">
          <Icons.Question size={18} />
        </button>
        <button className="icon-btn" type="button" aria-label="2 notifications non lues">
          <Icons.Bell size={18} />
          <span className="badge" aria-hidden="true">2</span>
        </button>
        <button
          className="icon-btn"
          type="button"
          aria-label="Personnaliser l'affichage"
          onClick={openTweaks}
        >
          <Icons.Grid size={18} />
        </button>
        <button className="avatar" type="button" aria-label="Quentin Girard — Paramètres du compte">
          QG
        </button>
      </div>
    </header>
  );
}
