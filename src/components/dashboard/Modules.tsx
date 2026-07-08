'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { Icons } from '@/components/ui/Icons';

type ItemColor = 'teal' | 'amber' | 'lilac' | 'coral';
type PaletteKey = 'primary' | 'warning' | 'secondary' | 'error';

const COLOR_KEY: Record<ItemColor, PaletteKey> = {
  teal: 'primary',
  amber: 'warning',
  lilac: 'secondary',
  coral: 'error',
};

function mainColor(theme: Theme, item: ItemColor) {
  return theme.palette[COLOR_KEY[item]].main;
}

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

const STATUS_KEY: Record<NewsItem['status'], PaletteKey> = {
  pub: 'primary',
  draft: 'warning',
  sched: 'secondary',
};

function News() {
  return (
    <Box
      aria-labelledby="news-heading"
      sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '14px', p: 2.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
        <Typography id="news-heading" component="h3" sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary' }}>
          Dernières actualités publiées
        </Typography>
        <Box
          component="a"
          href="#"
          aria-label="Voir toutes les actualités"
          sx={{
            fontSize: 12,
            color: 'primary.dark',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Voir tout <Icons.ChevronRight size={12} />
        </Box>
      </Box>
      <Box role="list">
        {NEWS_ITEMS.map((item, i) => {
          const statusKey = STATUS_KEY[item.status];
          return (
            <Box
              key={i}
              role="listitem"
              sx={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr auto',
                gap: 1.75,
                alignItems: 'center',
                py: 1.5,
                borderBottom: i === NEWS_ITEMS.length - 1 ? 0 : '1px dashed',
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'transform .15s',
                '&:hover': { transform: 'translateX(3px)' },
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '10px',
                  flexShrink: 0,
                  background: (theme) =>
                    `repeating-linear-gradient(135deg, ${alpha(mainColor(theme, item.color), 0.14)} 0 6px, ${alpha(mainColor(theme, item.color), 0.06)} 6px 12px)`,
                  border: '1px solid',
                  borderColor: (theme) => alpha(mainColor(theme, item.color), 0.22),
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Box
                  aria-label={`Catégorie : ${item.tag}, publié il y a ${item.daysAgo} jour(s)`}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    fontSize: 11,
                    color: 'text.disabled',
                    textTransform: 'uppercase',
                    letterSpacing: '.06em',
                    mb: 0.375,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      bgcolor: (theme) => alpha(mainColor(theme, item.color), 0.12),
                      color: (theme) => mainColor(theme, item.color),
                      px: 0.75,
                      py: 0.125,
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {item.tag}
                  </Box>
                  <span>il y a {item.daysAgo} j</span>
                </Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
              <Box
                component="span"
                aria-label={`Statut : ${item.statusLabel}`}
                sx={{
                  fontSize: 11,
                  px: 1,
                  py: 0.375,
                  borderRadius: '999px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  bgcolor: (theme) => alpha(theme.palette[statusKey].main, 0.12),
                  color: (theme) => theme.palette[statusKey].dark,
                }}
              >
                {item.statusLabel}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
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
    <Box
      aria-labelledby="agenda-heading"
      sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '14px', p: 2.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
        <Typography id="agenda-heading" component="h3" sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary' }}>
          Événements à venir
        </Typography>
        <Box
          component="a"
          href="#"
          aria-label="Voir tout l'agenda"
          sx={{
            fontSize: 12,
            color: 'primary.dark',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Voir l&apos;agenda <Icons.ChevronRight size={12} />
        </Box>
      </Box>
      <Box role="list" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {AGENDA_ITEMS.map((item, i) => {
          const day = String(item.d).padStart(2, '0');
          return (
            <Box
              key={i}
              role="listitem"
              aria-label={`${item.title} — ${item.m} ${day} à ${item.time}, ${item.loc}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr auto',
                alignItems: 'center',
                gap: 1.75,
                py: 1.125,
                px: 1.25,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background .15s',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box
                sx={{
                  width: 52,
                  borderRadius: '10px',
                  py: 0.75,
                  px: 0.5,
                  textAlign: 'center',
                  flexShrink: 0,
                  bgcolor: (theme) => alpha(mainColor(theme, item.color), 0.12),
                  color: (theme) => mainColor(theme, item.color),
                  border: '1px solid',
                  borderColor: (theme) => alpha(mainColor(theme, item.color), 0.2),
                }}
              >
                <Box sx={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.85 }}>
                  {item.m}
                </Box>
                <Box sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1, mt: 0.25 }}>{day}</Box>
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </Typography>
                <Box
                  aria-hidden="true"
                  sx={{ fontSize: 12, color: 'text.disabled', display: 'flex', gap: 1, alignItems: 'center', mt: 0.25 }}
                >
                  <span>
                    <Icons.Clock size={11} style={{ verticalAlign: '-2px', marginRight: 3 }} />
                    {item.time}
                  </span>
                  <Box component="span" sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled', flexShrink: 0 }} />
                  <span>
                    <Icons.MapPin size={11} style={{ verticalAlign: '-2px', marginRight: 3 }} />
                    {item.loc}
                  </span>
                </Box>
              </Box>
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  fontSize: 11,
                  px: 1,
                  py: 0.375,
                  borderRadius: '999px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  bgcolor: (theme) => alpha(mainColor(theme, item.color), 0.12),
                  color: (theme) => mainColor(theme, item.color),
                }}
              >
                {item.type}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function Modules() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <News />
      <Agenda />
    </Box>
  );
}
