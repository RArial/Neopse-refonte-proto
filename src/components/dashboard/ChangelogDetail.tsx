'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import React from 'react';
import { Icons, type IconName } from '@/components/ui/Icons';

export type ChangelogType = 'evolution' | 'fix' | 'security' | 'comm';

export interface ChangelogEntry {
  type: ChangelogType;
  time: string;
  title: string;
  body: string;
  day: string;
}

const PALETTE: Record<ChangelogType, { color: string; soft: string; label: string; icon: IconName }> = {
  evolution: { color: 'var(--lilac)',      soft: 'var(--lilac-soft)', label: 'Évolution',     icon: 'Sparkles'  },
  fix:       { color: 'var(--coral)',      soft: 'var(--coral-soft)', label: 'Correctif',     icon: 'Bug'       },
  security:  { color: 'var(--amber-deep)', soft: 'var(--amber-soft)', label: 'Sécurité',      icon: 'Shield'    },
  comm:      { color: 'var(--teal-deep)',  soft: 'var(--teal-soft)',  label: 'Communication', icon: 'Megaphone' },
};

interface HighlightItem { icon: IconName; title: string; desc: string; }
type Section =
  | { kind: 'highlights'; title: string; items: HighlightItem[] }
  | { kind: 'text'; title: string; body: string }
  | { kind: 'tags'; items: string[] };

interface Detail {
  type: ChangelogType;
  version: string;
  date: string;
  author: string;
  readTime: string;
  summary: string;
  sections: Section[];
  related: Array<{ type: ChangelogType; title: string; date: string }>;
}

const DETAILS: Record<string, Detail> = {
  'Éditeur de maquettes refondu': {
    type: 'evolution',
    version: 'v 4.12.0',
    date: "Aujourd'hui · 10:24",
    author: 'Équipe Produit Neopse',
    readTime: '3 min de lecture',
    summary: "L'éditeur de maquettes a été entièrement repensé pour vous faire gagner du temps. Glisser-déposer fluide, prévisualisation multi-écrans et historique des versions sont désormais intégrés dans une même interface.",
    sections: [
      {
        kind: 'highlights',
        title: 'Ce qui change',
        items: [
          { icon: 'Edit',     title: 'Drag & drop des blocs',        desc: 'Réorganisez vos sections sans rechargement.' },
          { icon: 'Globe',    title: 'Prévisualisation multi-écrans', desc: 'Mobile, tablette, desktop en un clic.' },
          { icon: 'Clock',    title: 'Historique des versions',      desc: "Revenez à n'importe quelle version sauvegardée." },
          { icon: 'Sparkles', title: 'Suggestions de mise en page',  desc: 'Templates contextuels selon le type de page.' },
        ],
      },
      {
        kind: 'text',
        title: 'Pourquoi ce changement ?',
        body: "Suite à vos retours sur la complexité de l'ancien éditeur, nous l'avons réécrit en gardant un seul objectif : que vous puissiez modifier une page en moins d'une minute. La nouvelle interface réduit de 60 % le nombre de clics nécessaires pour les opérations courantes.",
      },
      { kind: 'tags', items: ['Éditeur', 'Pages', 'Maquettes', 'UX'] },
    ],
    related: [
      { type: 'evolution', title: 'Recherche globale plus rapide', date: "Aujourd'hui" },
      { type: 'evolution', title: 'Module Agenda — invitations',   date: '15 avr.' },
    ],
  },
};

function defaultDetail(entry: ChangelogEntry): Detail {
  return {
    type: entry.type,
    version: 'v 4.12.0',
    date: `${entry.day} · ${entry.time}`,
    author: 'Équipe Produit Neopse',
    readTime: '2 min de lecture',
    summary: entry.body,
    sections: [
      { kind: 'text', title: 'Détails', body: "Cette mise à jour fait partie de notre cycle d'amélioration continue. Aucune action n'est requise de votre part — les changements sont déjà actifs sur votre espace." },
      { kind: 'tags', items: ['Mise à jour', 'Neopse'] },
    ],
    related: [],
  };
}

interface Props {
  entry: ChangelogEntry;
  onClose: () => void;
}

export function ChangelogDetail({ entry, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const detail = DETAILS[entry.title] ?? defaultDetail(entry);
  const p = PALETTE[detail.type];
  const TypeIcon = Icons[p.icon];

  const panel = (
    <div
      className="cd-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={entry.title}
    >
      <article
        className="cd-panel"
        onClick={e => e.stopPropagation()}
        style={{ '--t-color': p.color, '--t-soft': p.soft } as React.CSSProperties}
      >
        <header className="cd-head">
          <button className="cd-back" onClick={onClose} type="button">
            <Icons.ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            Retour au journal
          </button>
          <button className="cd-close" onClick={onClose} type="button" aria-label="Fermer le panneau">
            <Icons.X size={18} />
          </button>
        </header>

        <div className="cd-hero">
          <div className="cd-hero-bg" aria-hidden="true" />
          <div className="cd-hero-content">
            <div className="cd-type-pill">
              <TypeIcon size={12} />
              {p.label}
            </div>
            <h1 className="cd-title">{entry.title}</h1>
            <div className="cd-meta">
              <span className="cd-meta-item"><Icons.Clock size={12} />{detail.date}</span>
              <span className="cd-dot" aria-hidden="true" />
              <span className="cd-meta-item"><Icons.User size={12} />{detail.author}</span>
              <span className="cd-dot" aria-hidden="true" />
              <span className="cd-meta-item">{detail.readTime}</span>
              <span className="cd-version">{detail.version}</span>
            </div>
          </div>
        </div>

        <div className="cd-body">
          <p className="cd-summary">{detail.summary}</p>

          {detail.sections.map((s, i) => {
            if (s.kind === 'highlights') {
              return (
                <section className="cd-section" key={i}>
                  <h2>{s.title}</h2>
                  <div className="cd-highlights">
                    {s.items.map((h, j) => {
                      const HIcon = Icons[h.icon];
                      return (
                        <div className="cd-highlight" key={j}>
                          <span className="cd-highlight-ico"><HIcon size={16} /></span>
                          <div>
                            <div className="cd-highlight-t">{h.title}</div>
                            <div className="cd-highlight-d">{h.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }
            if (s.kind === 'text') {
              return (
                <section className="cd-section" key={i}>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                </section>
              );
            }
            if (s.kind === 'tags') {
              return (
                <section className="cd-section cd-tags" key={i} aria-label="Étiquettes">
                  {s.items.map((tag, j) => <span className="cd-tag" key={j}>{tag}</span>)}
                </section>
              );
            }
            return null;
          })}

          {detail.related.length > 0 && (
            <section className="cd-section">
              <h2>Autres évolutions</h2>
              <div className="cd-related">
                {detail.related.map((r, i) => {
                  const rp = PALETTE[r.type];
                  const RIcon = Icons[rp.icon];
                  return (
                    <a
                      className="cd-related-item"
                      key={i}
                      href="#"
                      style={{ '--t-color': rp.color, '--t-soft': rp.soft } as React.CSSProperties}
                    >
                      <span className="cd-related-ico"><RIcon size={14} /></span>
                      <div className="cd-related-body">
                        <div className="cd-related-t">{r.title}</div>
                        <div className="cd-related-d">{rp.label} · {r.date}</div>
                      </div>
                      <Icons.ChevronRight size={14} />
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          <footer className="cd-footer">
            <a href="#" className="btn btn-ghost">
              <Icons.BookOpen size={14} /> Lire l&apos;article complet
            </a>
            <a href="#" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
              Voir tout le journal
            </a>
          </footer>
        </div>
      </article>
    </div>
  );

  return createPortal(panel, document.body);
}
