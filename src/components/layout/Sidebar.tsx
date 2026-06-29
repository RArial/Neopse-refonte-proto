'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icons, type IconName } from '@/components/ui/Icons';
import type { NavEntry } from '@/types/navigation';

const SIDEBAR_NAV: NavEntry[] = [
  { type: 'item', id: 'dashboard', icon: 'Dashboard', label: 'Tableau de bord', href: '/dashboard' },
  { type: 'item', id: 'access', icon: 'Globe', label: 'Accès au site', external: true },
  { type: 'divider' },
  {
    type: 'group', id: 'settings', icon: 'Settings', label: 'Paramètres',
    items: [
      { id: 'contrib', icon: 'Users', label: 'Contribution' },
      { id: 'tech', icon: 'Server', label: 'Données techniques' },
      { id: 'multi', icon: 'Languages', label: 'Multilingue' },
      { id: 'domain', icon: 'Globe2', label: 'Noms de domaine' },
    ],
  },
  {
    type: 'group', id: 'config', icon: 'Wrench', label: 'Configuration',
    items: [
      { id: 'a11y', icon: 'Eye', label: 'Accessibilité' },
      { id: 'pagesmgr', icon: 'Layout', label: 'Gestion du site' },
      { id: 'mockups', icon: 'Layers', label: 'Maquettes' },
      { id: 'legal', icon: 'Shield', label: 'Mentions légales' },
      { id: 'widgets', icon: 'Sliders', label: 'Widgets personnalisés' },
    ],
  },
  {
    type: 'group', id: 'pages', icon: 'Pages', label: 'Pages & modules',
    items: [
      { id: 'news', icon: 'Newspaper', label: 'Actualités', badge: 12 },
      { id: 'agenda', icon: 'Calendar', label: 'Agenda', badge: 4 },
      { id: 'directory', icon: 'IdCard', label: 'Annuaire' },
      { id: 'steps', icon: 'FileText', label: 'Démarches en ligne' },
      { id: 'faq', icon: 'Question', label: 'FAQ' },
      { id: 'gallery', icon: 'Photo', label: 'Galeries' },
      { id: 'polls', icon: 'Vote', label: 'Sondages' },
      { id: 'free', icon: 'Edit', label: 'Pages libres' },
    ],
  },
  {
    type: 'group', id: 'shares', icon: 'Share', label: 'Partages',
    items: [
      { id: 'flux', icon: 'Rss', label: 'Externalisation des flux' },
      { id: 'twin', icon: 'Heart', label: 'Jumelages' },
      { id: 'labels', icon: 'Tag', label: 'Labels' },
      { id: 'links', icon: 'Link', label: 'Liens' },
      { id: 'news2', icon: 'Mail', label: 'Newsletters' },
      { id: 'social', icon: 'AtSign', label: 'Réseaux sociaux' },
    ],
  },
  {
    type: 'group', id: 'managers', icon: 'Briefcase', label: 'Gestionnaires',
    items: [
      { id: 'files', icon: 'Folder', label: 'Gestionnaire de fichiers' },
      { id: 'forms', icon: 'Form', label: 'Gestionnaire de formulaires' },
      { id: 'media', icon: 'Image', label: 'Gestionnaire de médias' },
    ],
  },
  {
    type: 'group', id: 'mobile', icon: 'Smartphone', label: 'Application mobile',
    items: [
      { id: 'mtech', icon: 'Database', label: 'Données techniques' },
      { id: 'reports', icon: 'AlertTriangle', label: 'Signalements', badge: 3 },
      { id: 'devices', icon: 'Tablet', label: 'Appareils connectés' },
      { id: 'push', icon: 'Bell', label: 'Notifications push' },
    ],
  },
  { type: 'divider' },
  { type: 'item', id: 'users', icon: 'Users', label: 'Utilisateurs' },
  { type: 'item', id: 'inedi', icon: 'UserGroup', label: 'INEDI Citoyens', highlight: true },
];

function findParentGroup(id: string): string | null {
  for (const n of SIDEBAR_NAV) {
    if (n.type === 'group' && n.items.some(i => i.id === id)) return n.id;
  }
  return null;
}

interface SidebarProps {
  activeKey?: string;
}

export function Sidebar({ activeKey = 'dashboard' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('neopse:sidebar-collapsed') === '1'; }
    catch { return false; }
  });

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const parent = findParentGroup(activeKey);
    const m: Record<string, boolean> = {};
    for (const n of SIDEBAR_NAV) {
      if (n.type === 'group') m[n.id] = n.id === parent;
    }
    return m;
  });

  const [active, setActive] = useState(activeKey);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem('neopse:sidebar-collapsed', next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  const handleGroupClick = useCallback((groupId: string) => {
    if (collapsed) {
      setCollapsed(false);
      try { localStorage.setItem('neopse:sidebar-collapsed', '0'); } catch {}
      setOpenMap(m => ({ ...m, [groupId]: true }));
    } else {
      setOpenMap(m => ({ ...m, [groupId]: !m[groupId] }));
    }
  }, [collapsed]);

  return (
    <aside className={cn('sidebar', !collapsed && 'expanded')} aria-label="Navigation principale">
      {/* Brand */}
      <div className="brand">
        <div className="logo" aria-hidden="true">N</div>
        <div className="label" aria-hidden={collapsed}>
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

          if (n.type === 'item') {
            const IconEl = Icons[n.icon as IconName];
            const isActive = active === n.id;

            if (n.href) {
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  className={cn('nav-item', isActive && 'active', n.highlight && 'inedi')}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? n.label : undefined}
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
                className={cn('nav-item', isActive && 'active', n.highlight && 'inedi')}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? n.label : undefined}
                onClick={() => setActive(n.id)}
                type="button"
              >
                <span className="ico">{IconEl && <IconEl size={18} />}</span>
                <span className="lbl">{n.label}</span>
              </button>
            );
          }

          if (n.type === 'group') {
            const IconEl = Icons[n.icon as IconName];
            const isOpen = openMap[n.id] && !collapsed;
            const hasActiveChild = n.items.some(it => it.id === active);

            return (
              <div key={n.id}>
                <button
                  className={cn('nav-item', isOpen && 'open', hasActiveChild && 'has-active')}
                  onClick={() => handleGroupClick(n.id)}
                  title={collapsed ? n.label : undefined}
                  aria-expanded={isOpen}
                  type="button"
                >
                  <span className="ico">{IconEl && <IconEl size={18} />}</span>
                  <span className="lbl">{n.label}</span>
                  <span className="chev"><Icons.ChevronDown size={14} /></span>
                </button>

                {isOpen && (
                  <div className="sub" role="group" aria-label={n.label}>
                    {n.items.map(it => {
                      const SubIconEl = Icons[it.icon as IconName];
                      const isActive = active === it.id;

                      return (
                        <a
                          key={it.id}
                          href={it.href ?? '#'}
                          className={cn('sub-item', isActive && 'active')}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={e => {
                            if (!it.href) e.preventDefault();
                            setActive(it.id);
                          }}
                        >
                          <span className="sub-ico">{SubIconEl && <SubIconEl size={14} />}</span>
                          <span className="sub-lbl">{it.label}</span>
                          {it.badge != null && (
                            <span className="sub-badge" aria-label={`${it.badge} éléments`}>{it.badge}</span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-foot">
        <button className="foot-btn support" type="button">
          <span className="ico"><Icons.LifeBuoy size={16} /></span>
          <span className="lbl">Support</span>
        </button>
      </div>

      {/* Copyright + collapse toggle */}
      <div className="sidebar-copy">
        {!collapsed && <span aria-hidden="true">©NEOPSE</span>}
        <button
          className="collapse-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Déployer la navigation' : 'Réduire la navigation'}
          type="button"
        >
          <Icons.ChevronRight
            size={13}
            style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform .25s' }}
          />
        </button>
      </div>
    </aside>
  );
}
