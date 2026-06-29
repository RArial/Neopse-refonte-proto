'use client';

import { useState } from 'react';
import React from 'react';
import { Icons, type IconName } from '@/components/ui/Icons';
import { ChangelogDetail, type ChangelogEntry, type ChangelogType } from './ChangelogDetail';

const PALETTE: Record<ChangelogType, { color: string; soft: string; label: string; icon: IconName }> = {
  evolution: { color: 'var(--lilac)',      soft: 'var(--lilac-soft)', label: 'Évolution',     icon: 'Sparkles'  },
  fix:       { color: 'var(--coral)',      soft: 'var(--coral-soft)', label: 'Correctif',     icon: 'Bug'       },
  security:  { color: 'var(--amber-deep)', soft: 'var(--amber-soft)', label: 'Sécurité',      icon: 'Shield'    },
  comm:      { color: 'var(--teal-deep)',  soft: 'var(--teal-soft)',  label: 'Communication', icon: 'Megaphone' },
};

interface ChangelogGroup {
  day: string;
  fresh?: boolean;
  items: Omit<ChangelogEntry, 'day'>[];
}

const ENTRIES: ChangelogGroup[] = [
  {
    day: "Aujourd'hui",
    fresh: true,
    items: [
      { type: 'evolution', time: '10:24', title: 'Éditeur de maquettes refondu',       body: 'Glisser-déposer des blocs, prévisualisation multi-écrans et historique des versions intégré.' },
      { type: 'evolution', time: '08:12', title: 'Recherche globale plus rapide',       body: 'Indexation 3× plus rapide sur les pages et actualités. Résultats en moins de 120 ms.' },
    ],
  },
  {
    day: 'Hier',
    items: [
      { type: 'comm',      time: '15:30', title: 'Webinar Neopse — 14 mai',             body: 'Inscrivez-vous au prochain webinar « Optimiser votre site ». 45 min, en ligne.' },
      { type: 'fix',       time: '17:48', title: 'Correction : export PDF des actualités', body: "Les images en haute résolution ne sont plus tronquées lors de l'export." },
    ],
  },
  {
    day: '15 avr.',
    items: [
      { type: 'security',  time: '14:00', title: 'Authentification à 2 facteurs',       body: 'Disponible pour tous les gestionnaires depuis les paramètres du compte.' },
      { type: 'evolution', time: '09:30', title: 'Module Agenda — invitations',          body: 'Partagez un événement par email avec réponse intégrée (participe / peut-être / non).' },
    ],
  },
  {
    day: '12 avr.',
    items: [
      { type: 'comm',      time: '11:00', title: 'Maintenance planifiée — 20 avr.',      body: 'Interruption prévue de 02:00 à 04:00. Aucune action requise de votre part.' },
      { type: 'evolution', time: '16:15', title: 'Accessibilité — contrastes renforcés', body: "Conforme RGAA 4.1 sur l'ensemble des composants du tableau de bord." },
    ],
  },
  {
    day: '08 avr.',
    items: [
      { type: 'fix',       time: '10:05', title: 'Correctif : envoi de newsletter',      body: "Résolution du retard d'envoi observé sur les listes de plus de 500 destinataires." },
    ],
  },
];

const TABS: Array<{ id: 'all' | ChangelogType; label: string }> = [
  { id: 'all',       label: 'Tout' },
  { id: 'evolution', label: 'Évolutions' },
  { id: 'fix',       label: 'Correctifs' },
  { id: 'comm',      label: 'Communication' },
];

export function Changelog() {
  const [tab, setTab] = useState<'all' | ChangelogType>('all');
  const [openEntry, setOpenEntry] = useState<ChangelogEntry | null>(null);

  const filtered = ENTRIES
    .map(g => ({
      ...g,
      items: g.items.filter(it => tab === 'all' || it.type === tab),
    }))
    .filter(g => g.items.length > 0);

  return (
    <>
      <aside className="changelog" aria-labelledby="changelog-heading">
        <div className="changelog-head">
          <div className="changelog-head-left">
            <div className="icon-wrap" aria-hidden="true">
              <Icons.Sparkles size={16} />
            </div>
            <div>
              <h3 id="changelog-heading">Journal de bord</h3>
              <div className="sub">Les nouveautés Neopse</div>
            </div>
          </div>
          <span className="new-pill" aria-label="3 nouveaux éléments">3 new</span>
        </div>

        <div
          className="changelog-tabs"
          role="tablist"
          aria-label="Filtrer le journal"
        >
          {TABS.map(t => (
            <button
              key={t.id}
              className={tab === t.id ? 'on' : ''}
              onClick={() => setTab(t.id)}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="changelog-scroll" aria-live="polite" aria-atomic="false">
          {filtered.map((group, gi) => (
            <React.Fragment key={gi}>
              <div className="changelog-day" role="heading" aria-level={4}>{group.day}</div>
              <ul className="timeline">
                {group.items.map((it, ii) => {
                  const p = PALETTE[it.type];
                  const TypeIcon = Icons[p.icon];
                  const isFresh = group.fresh === true && ii === 0;
                  const entry: ChangelogEntry = { ...it, day: group.day };
                  return (
                    <li
                      key={ii}
                      className={`tl-item${isFresh ? ' fresh' : ''}`}
                      style={{ '--t-color': p.color, '--t-soft': p.soft } as React.CSSProperties}
                      onClick={() => setOpenEntry(entry)}
                    >
                      <span className="dot" aria-hidden="true">
                        <TypeIcon size={9} />
                      </span>
                      <div className="tl-meta">
                        <span className="tl-type">{p.label}</span>
                        <span className="tl-time">{it.time}</span>
                      </div>
                      <div className="tl-title">{it.title}</div>
                      <div className="tl-body">{it.body}</div>
                      <button
                        type="button"
                        className="tl-link"
                        onClick={e => { e.stopPropagation(); setOpenEntry(entry); }}
                        aria-label={`En savoir plus sur : ${it.title}`}
                      >
                        En savoir plus <Icons.ChevronRight size={10} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          ))}
        </div>

        <div className="changelog-foot">
          <a href="#" aria-label="Voir tout le journal de bord">
            Voir tout le journal <Icons.ArrowUpRight size={11} />
          </a>
          <span className="version" aria-label="Version 4.12.0">v 4.12.0</span>
        </div>
      </aside>

      {openEntry && (
        <ChangelogDetail
          entry={openEntry}
          onClose={() => setOpenEntry(null)}
        />
      )}
    </>
  );
}
