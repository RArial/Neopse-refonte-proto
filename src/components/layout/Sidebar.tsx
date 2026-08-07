'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons, type IconName } from '@/components/ui/Icons';
import { PagesFlyoutPanel } from '@/components/layout/PagesFlyoutPanel';
import { AssistancePopover } from '@/components/assistance/AssistancePopover';
import type { NavEntry } from '@/types/navigation';

const SIDEBAR_NAV: NavEntry[] = [
  { type: 'section-title', id: 'site-internet', label: 'Site internet' },
  { type: 'item', id: 'access', icon: 'Globe', label: 'Accès au site', external: true, accent: 'amber' },
  { type: 'item', id: 'dashboard', icon: 'Dashboard', label: 'Tableau de bord', href: '/dashboard' },
  { type: 'item', id: 'contenu', icon: 'AccountTree', label: 'Gestionnaire des pages', href: '/dashboard/contenu' },
  { type: 'flyout', id: 'pages-flyout', icon: 'Pages', label: 'Modules' },
  { type: 'item', id: 'personnalisation', icon: 'Brush', label: 'Apparence', href: '/dashboard/personnalisation' },
  { type: 'item', id: 'gestionnaire', icon: 'Folder', label: 'Fichiers', href: '/dashboard/gestionnaire' },
  { type: 'item', id: 'formulaires', icon: 'Form', label: 'Formulaires', href: '/dashboard/formulaires' },
  { type: 'item', id: 'parametres', icon: 'Settings', label: 'Paramètres', href: '/dashboard/parametres' },
  { type: 'divider' },
  { type: 'section-title', id: 'projet', label: 'Projet' },
  { type: 'item', id: 'services', icon: 'AlignJustify', label: 'Outils', href: '/dashboard/services' },
  { type: 'item', id: 'infos-projet', icon: 'Briefcase', label: 'Infos du projet', href: '/dashboard/infos-projet' },
  { type: 'item', id: 'parrainage', icon: 'UserPlus', label: 'Parrainage', href: '/dashboard/parrainage' },
  { type: 'item', id: 'commandes', icon: 'Ticket', label: 'Commandes', href: '/dashboard/mes-commandes' },
  { type: 'item', id: 'administrateurs', icon: 'UserGroup', label: 'Administrateurs', href: '/dashboard/administrateurs' },
];

interface SidebarProps {
  activeKey?: string;
}

export function Sidebar({ activeKey = 'dashboard' }: SidebarProps) {
  const pathname = usePathname();
  // Préférence épinglée par l'utilisateur (persistée) : repliée par défaut, le survol la déplie
  // temporairement (voir `visuallyExpanded`). Épingler via le bouton du bas force l'affichage
  // déplié en permanence, quel que soit le survol.
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('neopse:sidebar-collapsed') !== '0'; }
    catch { return true; }
  });
  const [hovering, setHovering] = useState(false);
  const [pagesFlyoutOpen, setPagesFlyoutOpen] = useState(false);
  const [assistanceAnchor, setAssistanceAnchor] = useState<HTMLElement | null>(null);
  // Le panneau « Modules » gardé ouvert compte comme un survol : la largeur du rail ne doit pas
  // changer sous lui pendant qu'il est ancré à sa largeur dépliée (sinon un vide apparaît entre
  // le rail replié et le panneau resté à sa position dépliée).
  const visuallyExpanded = collapsed ? (hovering || pagesFlyoutOpen) : true;

  const [active, setActive] = useState(activeKey);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem('neopse:sidebar-collapsed', next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  const handleMouseEnter = useCallback(() => setHovering(true), []);
  const handleMouseLeave = useCallback(() => setHovering(false), []);
  const handleFocus = useCallback(() => setHovering(true), []);
  const handleBlur = useCallback((event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHovering(false);
  }, []);

  return (
    <>
    <aside
      className={cn('sidebar', visuallyExpanded && 'expanded')}
      aria-label="Navigation principale"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Brand */}
      <div className="brand">
        <div className="logo" aria-hidden="true">N</div>
        <div className="label" aria-hidden={!visuallyExpanded}>
          <span className="n">Neopse</span>
          <span className="t">Démo arborescence</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav" aria-label="Menu principal">
        {SIDEBAR_NAV.map((n, i) => {
          if (n.type === 'divider') {
            return <div className="nav-divider" key={`divider-${i}`} role="separator" />;
          }

          if (n.type === 'section-title') {
            return (
              <div className="nav-section-title" key={n.id} aria-hidden={!visuallyExpanded}>
                {n.label}
              </div>
            );
          }

          if (n.type === 'item') {
            const IconEl = Icons[n.icon as IconName];
            const isActive = n.href ? pathname === n.href : active === n.id;
            const accentClass = n.accent === 'amber' && 'accent-amber';

            if (n.href) {
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  className={cn('nav-item', isActive && 'active', n.highlight && 'inedi', accentClass)}
                  aria-current={isActive ? 'page' : undefined}
                  title={!visuallyExpanded ? n.label : undefined}
                  onClick={() => setActive(n.id)}
                >
                  <span className="ico">{IconEl && <IconEl size={18} />}</span>
                  <span className="lbl">{n.label}</span>
                  {n.external && <span className="chev"><Icons.ArrowUpRight size={13} /></span>}
                </Link>
              );
            }
            return (
              <button
                key={n.id}
                className={cn('nav-item', isActive && 'active', n.highlight && 'inedi', accentClass)}
                aria-current={isActive ? 'page' : undefined}
                title={!visuallyExpanded ? n.label : undefined}
                onClick={() => setActive(n.id)}
                type="button"
              >
                <span className="ico">{IconEl && <IconEl size={18} />}</span>
                <span className="lbl">{n.label}</span>
                {n.external && <span className="chev"><Icons.ArrowUpRight size={13} /></span>}
              </button>
            );
          }

          if (n.type === 'flyout') {
            const IconEl = Icons[n.icon as IconName];

            return (
              <button
                key={n.id}
                className={cn('nav-item', pagesFlyoutOpen && 'has-active')}
                title={!visuallyExpanded ? n.label : undefined}
                aria-expanded={pagesFlyoutOpen}
                aria-haspopup="menu"
                onClick={() => setPagesFlyoutOpen((open) => !open)}
                type="button"
              >
                <span className="ico">{IconEl && <IconEl size={18} />}</span>
                <span className="lbl">{n.label}</span>
                <span className="chev"><Icons.ChevronRight size={14} /></span>
              </button>
            );
          }

          return null;
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-foot">
        <button
          className="foot-btn support"
          type="button"
          title={!visuallyExpanded ? 'Assistance' : undefined}
          aria-haspopup="dialog"
          onClick={(event) => setAssistanceAnchor(event.currentTarget)}
        >
          <span className="ico"><Icons.Question size={16} /></span>
          <span className="lbl">Assistance</span>
        </button>
      </div>

      {/* Copyright + épingler déplié/replié */}
      <div className="sidebar-copy">
        {visuallyExpanded && <span aria-hidden="true">©NEOPSE</span>}
        <button
          className="collapse-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Garder la navigation dépliée' : 'Replier la navigation'}
          aria-pressed={!collapsed}
          title={collapsed ? 'Garder dépliée' : 'Replier'}
          type="button"
        >
          <Icons.ChevronRight
            size={13}
            style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform .25s' }}
          />
        </button>
      </div>
    </aside>

    {pagesFlyoutOpen && (
      <PagesFlyoutPanel
        left={visuallyExpanded ? 'var(--sidebar-expanded)' : 'var(--sidebar-w)'}
        onClose={() => setPagesFlyoutOpen(false)}
      />
    )}

    <AssistancePopover anchorEl={assistanceAnchor} onClose={() => setAssistanceAnchor(null)} />
    </>
  );
}
