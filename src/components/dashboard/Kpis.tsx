import React from 'react';
import { Icons, type IconName } from '@/components/ui/Icons';
import { Sparkline } from './Sparkline';

type Trend = 'up' | 'down' | 'flat';
type KpiColor = 'teal' | 'coral' | 'amber' | 'lilac';

interface KpiData {
  icon: IconName;
  label: string;
  value: number | string;
  delta: string;
  trend: Trend;
  color: KpiColor;
  data: number[];
}

const COLOR_MAP: Record<KpiColor, { c: string; s: string }> = {
  teal:  { c: 'var(--teal-deep)',  s: 'var(--teal-soft)'  },
  coral: { c: 'var(--coral)',      s: 'var(--coral-soft)' },
  amber: { c: 'var(--amber-deep)', s: 'var(--amber-soft)' },
  lilac: { c: 'var(--lilac)',      s: 'var(--lilac-soft)' },
};

const KPIS: KpiData[] = [
  {
    icon: 'Mail',
    label: 'Messages non lus',
    value: 2,
    delta: '+1',
    trend: 'up',
    color: 'amber',
    data: [1, 0, 2, 1, 3, 2, 1, 2, 1, 2],
  },
  {
    icon: 'UserPlus',
    label: 'Abonnés au service Newsletters',
    value: 2,
    delta: 'stable',
    trend: 'flat',
    color: 'amber',
    data: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  },
  {
    icon: 'Phone',
    label: 'Abonnés à l’application Localiti',
    value: 0,
    delta: '—',
    trend: 'flat',
    color: 'amber',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    icon: 'Users',
    label: 'Utilisateurs',
    value: 6,
    delta: '+2',
    trend: 'up',
    color: 'amber',
    data: [3, 3, 4, 4, 4, 5, 5, 6, 6, 6],
  },
];

function KpiCard({ icon, label, value, delta, trend, color, data }: KpiData) {
  const IconEl = Icons[icon];
  const p = COLOR_MAP[color];
  return (
    <article
      className="kpi"
      style={{ '--k-color': p.c, '--k-soft': p.s } as React.CSSProperties}
      aria-label={`${label} : ${value}`}
    >
      <div className="kpi-top">
        <span className="ico" aria-hidden="true">
          <IconEl size={18} />
        </span>
        <span
          className={`delta ${trend}`}
          aria-label={`Tendance : ${delta}`}
        >
          {trend === 'up'   && <Icons.TrendUp size={11} />}
          {trend === 'down' && <Icons.TrendDown size={11} />}
          {delta}
        </span>
      </div>
      <div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
      <Sparkline data={data} />
    </article>
  );
}

export function Kpis() {
  return (
    <section className="section" aria-labelledby="kpis-heading">
      <div className="section-head">
        <h2 id="kpis-heading">Mon tableau de bord</h2>
      </div>
      <div className="grid-kpi">
        {KPIS.map((k, i) => (
          <KpiCard key={i} {...k} />
        ))}

        <div
          className="storage-card storage-card--wide"
          aria-labelledby="storage-heading"
        >
          <div className="storage-head">
            <span id="storage-heading" className="ttl">Stockage du site</span>
            <span className="pill">0,86 % utilisé</span>
          </div>
          <div className="storage-value">
            0,06<span className="of"> / 7 Go</span>
          </div>
          <div
            className="storage-bar"
            role="progressbar"
            aria-valuenow={0.86}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="0,86 % du stockage utilisé"
          >
            <div className="fill" />
          </div>
          <div className="storage-foot">
            <span>Beaucoup d&apos;espace disponible</span>
            <a href="#">
              Augmenter <Icons.ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
