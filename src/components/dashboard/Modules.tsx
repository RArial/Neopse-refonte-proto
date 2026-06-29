import React from 'react';
import { Icons } from '@/components/ui/Icons';

type ItemColor = 'teal' | 'amber' | 'lilac' | 'coral';

const COLOR_PALETTE: Record<ItemColor, { color: string; soft: string }> = {
  amber: { color: 'var(--amber-deep)', soft: 'var(--amber-soft)' },
  teal:  { color: 'var(--teal-deep)',  soft: 'var(--teal-soft)'  },
  coral: { color: 'var(--coral)',      soft: 'var(--coral-soft)' },
  lilac: { color: 'var(--lilac)',      soft: 'var(--lilac-soft)' },
};

/* ---- News ---- */
interface NewsItem {
  tag: string;
  color: ItemColor;
  title: string;
  status: 'pub' | 'draft' | 'sched';
  statusLabel: string;
  daysAgo: number;
}

const NEWS_ITEMS: NewsItem[] = [
  { tag: 'Vie locale',    color: 'teal',  title: 'Inscriptions au marché de Noël — ouverture',            status: 'pub',   statusLabel: 'En ligne',    daysAgo: 1 },
  { tag: 'Urbanisme',     color: 'amber', title: 'Travaux rue des Tilleuls — déviation temporaire',        status: 'pub',   statusLabel: 'En ligne',    daysAgo: 2 },
  { tag: 'Culture',       color: 'lilac', title: 'Exposition « Regards d’ici » à la médiathèque',    status: 'sched', statusLabel: 'Programmée',  daysAgo: 3 },
  { tag: 'Environnement', color: 'coral', title: 'Nettoyage d’automne — appel à bénévoles',           status: 'draft', statusLabel: 'Brouillon',   daysAgo: 4 },
];

function News() {
  return (
    <div className="module" aria-labelledby="news-heading">
      <div className="module-head">
        <h3 id="news-heading">Dernières actualités publiées</h3>
        <a href="#" aria-label="Voir toutes les actualités">
          Voir tout <Icons.ChevronRight size={12} />
        </a>
      </div>
      <div className="news-list" role="list">
        {NEWS_ITEMS.map((item, i) => {
          const p = COLOR_PALETTE[item.color];
          return (
            <div
              key={i}
              className="news-item"
              role="listitem"
              style={{ '--n-color': p.color, '--n-soft': p.soft } as React.CSSProperties}
            >
              <div className="news-thumb" aria-hidden="true" />
              <div className="news-body">
                <div className="meta" aria-label={`Catégorie : ${item.tag}, publié il y a ${item.daysAgo} jour(s)`}>
                  <span className="tag">{item.tag}</span>
                  <span>il y a {item.daysAgo} j</span>
                </div>
                <div className="ttl">{item.title}</div>
              </div>
              <span className={`news-status ${item.status}`} aria-label={`Statut : ${item.statusLabel}`}>
                {item.statusLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Agenda ---- */
interface AgendaItem {
  m: string;
  d: number;
  title: string;
  time: string;
  loc: string;
  type: string;
  color: ItemColor;
}

const AGENDA_ITEMS: AgendaItem[] = [
  { m: 'AVR', d: 22, title: 'Conseil municipal',         time: '19:00', loc: 'Salle des fêtes',   type: 'Réunion',   color: 'teal'  },
  { m: 'AVR', d: 25, title: 'Vide-grenier de printemps', time: '08:00', loc: 'Place du marché',   type: 'Animation', color: 'amber' },
  { m: 'AVR', d: 28, title: 'Atelier médiathèque',       time: '14:30', loc: 'Médiathèque',        type: 'Culture',   color: 'lilac' },
  { m: 'MAI', d: 3,  title: 'Commémoration du 8 mai',    time: '11:00', loc: 'Monument aux morts', type: 'Cérémonie', color: 'coral' },
];

function Agenda() {
  return (
    <div className="module" aria-labelledby="agenda-heading">
      <div className="module-head">
        <h3 id="agenda-heading">Événements à venir</h3>
        <a href="#" aria-label="Voir tout l'agenda">
          Voir l&apos;agenda <Icons.ChevronRight size={12} />
        </a>
      </div>
      <div className="agenda-list" role="list">
        {AGENDA_ITEMS.map((item, i) => {
          const p = COLOR_PALETTE[item.color];
          const day = String(item.d).padStart(2, '0');
          return (
            <div
              key={i}
              className="agenda-item"
              role="listitem"
              style={{ '--a-color': p.color, '--a-soft': p.soft } as React.CSSProperties}
              aria-label={`${item.title} — ${item.m} ${day} à ${item.time}, ${item.loc}`}
            >
              <div className="agenda-date" aria-hidden="true">
                <div className="m">{item.m}</div>
                <div className="d">{day}</div>
              </div>
              <div className="agenda-body">
                <div className="ttl">{item.title}</div>
                <div className="meta" aria-hidden="true">
                  <span>
                    <Icons.Clock size={11} style={{ verticalAlign: '-2px', marginRight: 3 }} />
                    {item.time}
                  </span>
                  <span className="dot" />
                  <span>
                    <Icons.MapPin size={11} style={{ verticalAlign: '-2px', marginRight: 3 }} />
                    {item.loc}
                  </span>
                </div>
              </div>
              <span className="agenda-chip" aria-hidden="true">{item.type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Modules() {
  return (
    <div className="modules-stack">
      <News />
      <Agenda />
    </div>
  );
}
