'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { Icons, type IconName } from '@/components/ui/Icons';
import { Sparkline, type SparklineColor } from './Sparkline';

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

const COLOR_MAP: Record<KpiColor, SparklineColor> = {
  teal: 'primary',
  coral: 'error',
  amber: 'warning',
  lilac: 'secondary',
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

const DELTA_TEXT_COLOR: Record<Trend, string> = {
  up: 'success.main',
  down: 'error.main',
  flat: 'text.secondary',
};

function KpiCard({ icon, label, value, delta, trend, color, data }: KpiData) {
  const IconEl = Icons[icon];
  return (
    <Box
      component="article"
      aria-label={`${label} : ${value}`}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '14px',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform .18s, box-shadow .18s, border-color .18s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2, borderColor: 'grey.300' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.25 }}>
        <Box
          aria-hidden="true"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.12),
            color: 'secondary.main',
            flexShrink: 0,
          }}
        >
          <IconEl size={18} />
        </Box>
        <Box
          aria-label={`Tendance : ${delta}`}
          sx={{
            fontSize: 11,
            fontWeight: 600,
            px: 0.875,
            py: 0.375,
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.375,
            color: DELTA_TEXT_COLOR[trend],
            bgcolor: (theme) =>
              trend === 'flat' ? theme.palette.action.hover : alpha(theme.palette[trend === 'up' ? 'success' : 'error'].main, 0.12),
          }}
        >
          {trend === 'up' && <Icons.TrendUp size={11} />}
          {trend === 'down' && <Icons.TrendDown size={11} />}
          {delta}
        </Box>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            color: 'text.primary',
          }}
        >
          {value}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: -0.5 }}>{label}</Typography>
      </Box>
      <Sparkline data={data} color={COLOR_MAP[color]} />
    </Box>
  );
}

export function Kpis() {
  return (
    <Box component="section" sx={{ mb: 4.5 }} aria-labelledby="kpis-heading">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
        <Typography id="kpis-heading" component="h2" variant="h6" sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
          Mon tableau de bord
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
        {KPIS.map((k, i) => (
          <KpiCard key={i} {...k} />
        ))}

        <Box
          aria-labelledby="storage-heading"
          sx={{
            gridColumn: 'span 4',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '14px',
            p: 2.5,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            transition: 'transform .18s, box-shadow .18s',
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.16)}, ${theme.palette.background.paper})`,
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography id="storage-heading" component="span" sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>
              Stockage du site
            </Typography>
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 600,
                px: 1,
                py: 0.375,
                borderRadius: '999px',
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                color: 'success.dark',
              }}
            >
              0,86 % utilisé
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              color: 'text.primary',
            }}
          >
            0,06
            <Box component="span" sx={{ fontSize: 14, fontWeight: 500, color: 'text.disabled', ml: 0.5 }}>
              {' '}/ 7 Go
            </Box>
          </Typography>
          <Box
            role="progressbar"
            aria-valuenow={0.86}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="0,86 % du stockage utilisé"
            sx={{
              height: 8,
              borderRadius: '999px',
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.14),
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: '0.86%',
                background: (theme) => `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                borderRadius: '999px',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'text.secondary' }}>
            <span>Beaucoup d&apos;espace disponible</span>
            <Box
              component="a"
              href="#"
              sx={{
                color: 'success.dark',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Augmenter <Icons.ArrowUpRight size={12} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
