import React from 'react';
import { Icons, type IconName } from '@/components/ui/Icons';

interface ShortcutItem {
  icon: IconName;
  title: string;
  sub: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { icon: 'Pages',     title: 'Gestion du site', sub: '42 pages publiées' },
  { icon: 'Edit',      title: 'Maquettes',        sub: 'Charte & gabarits' },
  { icon: 'Newspaper', title: 'Unes',              sub: '3 à la une' },
  { icon: 'Megaphone', title: 'Actualités',        sub: '12 publications' },
  { icon: 'Calendar',  title: 'Agenda',            sub: '5 événements à venir' },
  { icon: 'Bell',      title: 'Alertes',           sub: '2 alertes diffusées' },
];

export function Shortcuts() {
  return (
    <section className="section" aria-labelledby="shortcuts-heading">
      <div className="section-head">
        <h2 id="shortcuts-heading">Mes raccourcis de gestion du site</h2>
      </div>
      <div className="grid-shortcuts">
        {SHORTCUTS.map((item, i) => {
          const IconEl = Icons[item.icon];
          return (
            <button
              key={i}
              className="shortcut"
              type="button"
              style={{ '--s-color': '#fff', '--s-soft': '#EFBF10' } as React.CSSProperties}
              aria-label={`${item.title} — ${item.sub}`}
            >
              <span className="ico" aria-hidden="true">
                <IconEl size={20} />
              </span>
              <span className="lbl">
                <span className="t">{item.title}</span>
                <span className="s">{item.sub}</span>
              </span>
              <span className="arr" aria-hidden="true">
                <Icons.ArrowUpRight size={16} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
